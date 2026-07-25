// src/db.ts
// Thin expo-sqlite wrapper around dbCore. Sync API: the store is tiny.

import { openDatabaseSync } from 'expo-sqlite';

import {
  ALL_KV_SQL,
  DEL_KV_SQL,
  MIGRATIONS,
  RESET_SQL,
  SET_KV_SQL,
  TARGET_DB_VERSION,
  type KvRow,
} from './dbCore';

const db = openDatabaseSync('lastseen.db');

export function migrate(): void {
  const row = db.getFirstSync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;
  while (version < TARGET_DB_VERSION) {
    db.withTransactionSync(() => {
      for (const sql of MIGRATIONS[version]) db.execSync(sql);
    });
    version += 1;
    db.execSync(`PRAGMA user_version = ${version}`);
  }
}

export const loadAll = (): KvRow[] => db.getAllSync<KvRow>(ALL_KV_SQL);

export const setKv = (k: string, v: string): void => {
  db.runSync(SET_KV_SQL, [k, v]);
};

export const delKv = (k: string): void => {
  db.runSync(DEL_KV_SQL, [k]);
};

export const resetAll = (): void => {
  db.runSync(RESET_SQL);
};
