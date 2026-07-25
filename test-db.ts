// dbCore tests against node:sqlite. Run with: npx tsx test-db.ts

// @ts-expect-error node builtins have no types under Expo's tsconfig; tsx runs it fine
import assert from 'node:assert/strict';
// @ts-expect-error node:sqlite has no types under Expo's tsconfig; tsx runs it fine
import { DatabaseSync } from 'node:sqlite';

import {
  ALL_KV_SQL,
  DEL_KV_SQL,
  MIGRATIONS,
  RESET_SQL,
  SET_KV_SQL,
  TARGET_DB_VERSION,
  decoderKey,
  flagKey,
  readKey,
  rowsToState,
  scriptKey,
  type KvRow,
} from './src/dbCore';

const db = new DatabaseSync(':memory:');
for (const batch of MIGRATIONS) for (const sql of batch) db.exec(sql);
assert.equal(TARGET_DB_VERSION, MIGRATIONS.length);

const set = db.prepare(SET_KV_SQL);
set.run(flagKey('act2'), '1');
set.run(flagKey('airplaneMode'), '1');
set.run(scriptKey('th-dae'), '3');
set.run(decoderKey('em-draft'), '{"g":"t"}');
set.run(readKey('em-storage'), '1');

// Upsert overwrites.
set.run(scriptKey('th-dae'), '4');

const rows = db.prepare(ALL_KV_SQL).all() as unknown as KvRow[];
const { flags, kv } = rowsToState(rows);
assert.ok(flags.has('act2'));
assert.ok(flags.has('airplaneMode'));
assert.equal(flags.size, 2);
assert.equal(kv.get(scriptKey('th-dae')), '4');
assert.equal(kv.get(decoderKey('em-draft')), '{"g":"t"}');

db.prepare(DEL_KV_SQL).run(flagKey('airplaneMode'));
const after = rowsToState(db.prepare(ALL_KV_SQL).all() as unknown as KvRow[]);
assert.ok(!after.flags.has('airplaneMode'));

db.exec(RESET_SQL);
assert.equal((db.prepare(ALL_KV_SQL).all() as unknown as KvRow[]).length, 0);

console.log('test-db: all assertions passed');
