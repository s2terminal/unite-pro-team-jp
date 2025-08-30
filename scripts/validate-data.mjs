#!/usr/bin/env node
// @ts-check

import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import YAML from 'yaml';

const paths = {
  data: {
    member: 'data/member.yaml',
    roster: 'data/roster.yaml',
    team: 'data/team.yaml'
  },
  schema: {
    member: 'data/schema/member.schema.json',
    roster: 'data/schema/roster.schema.json',
    team: 'data/schema/team.schema.json'
  }
};

// ---------------------------------------------
// ユーティリティ関数
// ---------------------------------------------

/** ルートからの絶対パスを解決 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');

/** @param {...string} paths */
const resolveRoot = (...paths) => {
  return resolve(ROOT_DIR, ...paths);
};

/** エラー整形 */
/** @param {import('ajv').ErrorObject[]} errors */
function formatErrors(errors) {
  return (errors || [])
    .map((e) => `${e.instancePath || '(root)'} ${e.message}${e.params ? ' ' + JSON.stringify(e.params) : ''}`)
    .join('\n');
}

/** YAML を JSON に読み込み */
/** @param {string} relPath */
async function loadYaml(relPath) {
  const text = await readFile(resolveRoot(relPath), 'utf8');
  return YAML.parse(text);
}

/** JSON ファイルを読み込み（スキーマ用） */
/** @param {string} relPath */
async function loadJson(relPath) {
  const text = await readFile(resolveRoot(relPath), 'utf8');
  return JSON.parse(text);
}

/** 全データ（YAML）と全スキーマ（JSON）を一括で読み込み */
/**
 * @typedef {Object} LoadedBundle
 * @property {{member: any, roster: any, team: any}} data
 * @property {{member: any, roster: any, team: any}} schemas
 * @property {{data: {member: string, roster: string, team: string}, schema: {member: string, roster: string, team: string}}} paths
 */
/** @returns {Promise<LoadedBundle>} */
async function loadAll() {
  const [member, roster, team, memberSchema, rosterSchema, teamSchema] = await Promise.all([
    loadYaml(paths.data.member),
    loadYaml(paths.data.roster),
    loadYaml(paths.data.team),
    loadJson(paths.schema.member),
    loadJson(paths.schema.roster),
    loadJson(paths.schema.team)
  ]);

  return {
    paths,
    data: { member, roster, team },
    schemas: { member: memberSchema, roster: rosterSchema, team: teamSchema }
  };
}

// ---------------------------------------------
// スキーマ検証
// ---------------------------------------------

/** AJV を用いて data と schema を検証 */
/** @param {Ajv} ajv @param {any} dataJson @param {any} schemaJson */
function validateWithSchema(ajv, dataJson, schemaJson) {
  const validate = ajv.compile(schemaJson);
  const ok = validate(dataJson);
  return { ok, errors: ok ? [] : validate.errors || [] };
}

/** 複数ファイルのスキーマ検証を実行（事前に読み込んだデータ／スキーマを使用） */
/** @param {LoadedBundle} loaded */
async function validateAllSchemas(loaded) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  let allOk = true;
  const types = /** @type {('member'|'roster'|'team')[]} */ (Object.keys(loaded.data));
  const dataset = types.map(type => ({
    dataLabel: loaded.paths.data[type],
    schemaLabel: loaded.paths.schema[type],
    data: loaded.data[type],
    schema: loaded.schemas[type]
  }));

  for (const { dataLabel, schemaLabel, data, schema } of dataset) {
    const { ok, errors } = validateWithSchema(ajv, data, schema);
    if (!ok) {
      allOk = false;
      console.error(`\n❌ 検証失敗: ${dataLabel}（スキーマ: ${schemaLabel}）`);
      console.error(formatErrors(errors));
    } else {
      console.log(`✅ ${dataLabel} は有効です。`);
    }
  }
  return allOk;
}

// ---------------------------------------------
// クロスファイル検証（roster <--> team / member）
// ---------------------------------------------

/** roster/team/member のキー整合チェックを行い、エラー一覧を返す */
/** @param {any} memberJson @param {any} rosterJson @param {any} teamJson */
function crossValidateRosterKeysAndMembers(memberJson, rosterJson, teamJson) {
  /** @type {Set<string>} */
  const memberSlugs = new Set(Object.keys((memberJson && memberJson.player) || {}));
  /** @type {Set<string>} */
  const teamSlugs = new Set(Object.keys(teamJson || {}));
  /** @type {string[]} */
  const crossErrors = [];

  for (const [teamKey, changes] of Object.entries(rosterJson || {})) {
    if (!teamSlugs.has(teamKey)) {
      crossErrors.push(`(roster).${teamKey} は team.yaml に定義がありません`);
    }

    if (!Array.isArray(changes)) {
      crossErrors.push(`(roster).${teamKey} はロスターの配列である必要があります`);
      continue;
    }

    changes.forEach((entry, idx) => {
      const pathBase = `(roster).${teamKey}[${idx}].member`;
      const member = entry && entry.member;
      if (!member || typeof member !== 'object') return;
      for (const dir of ['in', 'out']) {
        const arr = member[dir];
        if (Array.isArray(arr)) {
          for (const slug of arr) {
            if (!memberSlugs.has(slug)) {
              crossErrors.push(`${pathBase}.${dir} に未定義のメンバー・スラグ '${slug}' が含まれています（member.yaml に存在しません）`);
            }
          }
        }
      }
    });
  }

  return crossErrors;
}

/** クロス検証の実行（事前に読み込んだデータを使用） */
/** @param {LoadedBundle} loaded */
async function runCrossValidation(loaded) {
  try {
    const errors = crossValidateRosterKeysAndMembers(loaded.data.member, loaded.data.roster, loaded.data.team);
    if (errors.length > 0) {
      console.error(`\n❌ ファイル横断の参照検証に失敗しました（roster のキーと member スラグ）`);
      console.error(errors.join('\n'));
      return false;
    } else {
      console.log('✅ ファイル横断の参照は一貫しています。');
      return true;
    }
  } catch (e) {
    console.error('\n❌ ファイル横断の検証でエラーが発生しました:', e);
    return false;
  }
}

// ---------------------------------------------
// main
// ---------------------------------------------
async function main() {
  const loaded = await loadAll();
  const schemaOk = await validateAllSchemas(loaded);
  const crossOk = await runCrossValidation(loaded);
  if (!schemaOk || !crossOk) {
    process.exit(1);
  } else {
    console.log('\nすべてのデータファイルは有効です。');
  }
}

await main();
