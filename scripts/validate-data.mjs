#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import YAML from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const root = resolve(__dirname, '..');

const files = [
  { data: 'data/member.yaml', schema: 'data/schema/member.schema.json' },
  { data: 'data/roster.yaml', schema: 'data/schema/roster.schema.json' },
  { data: 'data/team.yaml', schema: 'data/schema/team.schema.json' }
];

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function formatErrors(errors) {
  return errors
    .map((e) => `${e.instancePath || '(root)'} ${e.message}${e.params ? ' ' + JSON.stringify(e.params) : ''}`)
    .join('\n');
}

let failed = false;
for (const { data, schema } of files) {
  const dataPath = resolve(root, data);
  const schemaPath = resolve(root, schema);

  const [yamlText, schemaText] = await Promise.all([
    readFile(dataPath, 'utf8'),
    readFile(schemaPath, 'utf8')
  ]);

  const json = YAML.parse(yamlText);
  const schemaJson = JSON.parse(schemaText);

  const validate = ajv.compile(schemaJson);
  const ok = validate(json);
  if (!ok) {
    failed = true;
    console.error(`\n❌ Validation failed for ${data} against ${schema}`);
    console.error(formatErrors(validate.errors || []));
  } else {
    console.log(`✅ ${data} is valid.`);
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('\nAll data files are valid.');
}
