#!/usr/bin/env node
// Validate all fixtures against their referenced JSON schemas
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname || '.');
const SCHEMA_DIR = join(ROOT, 'spec', 'schema');
const FIXTURES_DIR = join(ROOT, 'spec', 'fixtures');

let errors = 0;
let checked = 0;

// Load all schemas
const schemas = {};
if (existsSync(SCHEMA_DIR)) {
  for (const file of readdirSync(SCHEMA_DIR)) {
    if (!file.endsWith('.schema.json')) continue;
    const name = file.replace('.schema.json', '');
    try {
      schemas[name] = JSON.parse(readFileSync(join(SCHEMA_DIR, file), 'utf8'));
      checked++;
    } catch (e) {
      console.error(`FAIL: ${file} is not valid JSON: ${e.message}`);
      errors++;
    }
  }
}

// Validate fixtures
function walkFixtures(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFixtures(path);
    } else if (entry.name.endsWith('.json')) {
      try {
        const fixture = JSON.parse(readFileSync(path, 'utf8'));
        checked++;
        if (fixture.response?.schema && !schemas[fixture.response.schema]) {
          console.error(`FAIL: ${path} references unknown schema "${fixture.response.schema}"`);
          errors++;
        }
      } catch (e) {
        console.error(`FAIL: ${path} is not valid JSON: ${e.message}`);
        errors++;
      }
    }
  }
}

walkFixtures(FIXTURES_DIR);

console.log(`\nChecked ${checked} files, ${errors} error(s)`);
process.exit(errors > 0 ? 1 : 0);
