import fs from 'node:fs/promises';
import { parse } from 'yaml';

// データファイルパス（このモジュール基準）
const TEAM_YAML_PATH = '../../data/team.yaml';
const MEMBER_YAML_PATH = '../../data/member.yaml';
const ROSTER_YAML_PATH = '../../data/roster.yaml';

// キャッシュ有効化フラグ ※リロードで反映されなくなる
const CACHE_ENABLED = false;

// YAMLファイル読み込みユーティリティ
// dataファイルからの相対パスを受け取り、パース結果を返す
export async function readYaml(relativePathFromThisFile: string) {
  const url = new URL(relativePathFromThisFile, import.meta.url);
  const raw = await fs.readFile(url, 'utf-8');
  return parse(raw);
}

// シンプルなインメモリキャッシュ
let cache: {
  team?: TeamYaml;
  member?: MemberYaml;
  roster?: RosterYaml;
} = {};

// 個別YAMLの型（構造）
export type TeamYaml = Record<
  string,
  {
    name: string;
    alias?: string[];
    reference?: string[];
    memo?: string;
  }
>;

export type MemberYaml = {
  player: Record<
    string,
    {
      name: string;
      alias?: string[];
      reference?: string[];
    }
  >;
};

export type RosterYaml = Record<
  string,
  Array<{
    date: string;
    member: { in?: string[]; out?: string[] };
    reference?: string[];
  }>
>;

// データ別ローダー：ファイルパスの責務をここに集約
export async function loadTeamYaml(): Promise<TeamYaml> {
  if (CACHE_ENABLED && cache.team) return cache.team;
  const data = (await readYaml(TEAM_YAML_PATH)) as TeamYaml;
  if (CACHE_ENABLED) cache.team = data;
  return data;
}

export async function loadMemberYaml(): Promise<MemberYaml> {
  if (CACHE_ENABLED && cache.member) return cache.member;
  const data = (await readYaml(MEMBER_YAML_PATH)) as MemberYaml;
  if (CACHE_ENABLED) cache.member = data;
  return data;
}

export async function loadRosterYaml(): Promise<RosterYaml> {
  if (CACHE_ENABLED && cache.roster) return cache.roster;
  const data = (await readYaml(ROSTER_YAML_PATH)) as RosterYaml;
  if (CACHE_ENABLED) cache.roster = data;
  return data;
}
