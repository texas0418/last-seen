// src/dbCore.ts
// Pure module: SQL schema/migrations and helpers. No expo imports so it can
// be tested in Node against node:sqlite. All game state is a kv store:
// flags ("flag:<name>" = "1"), live-script positions ("script:<threadId>"),
// decoder mappings ("decoder:<draftId>" = JSON), read markers ("read:<id>").

/** Each entry is the batch of statements that upgrades user_version N-1 -> N.
 *  MIGRATIONS[0] builds version 1. Append only; never edit shipped entries. */
export const MIGRATIONS: string[][] = [
  [
    `CREATE TABLE IF NOT EXISTS kv (
      k TEXT PRIMARY KEY,
      v TEXT NOT NULL
    )`,
  ],
];

export const TARGET_DB_VERSION = MIGRATIONS.length;

export const SET_KV_SQL = `INSERT INTO kv (k, v) VALUES (?, ?)
  ON CONFLICT(k) DO UPDATE SET v = excluded.v`;
export const GET_KV_SQL = 'SELECT v FROM kv WHERE k = ?';
export const ALL_KV_SQL = 'SELECT k, v FROM kv';
export const DEL_KV_SQL = 'DELETE FROM kv WHERE k = ?';
export const RESET_SQL = 'DELETE FROM kv';

export interface KvRow {
  k: string;
  v: string;
}

export const flagKey = (name: string): string => `flag:${name}`;
export const scriptKey = (threadId: string): string => `script:${threadId}`;
export const decoderKey = (draftId: string): string => `decoder:${draftId}`;
export const readKey = (itemId: string): string => `read:${itemId}`;

/** Rebuild the in-memory picture of the world from raw kv rows. */
export const rowsToState = (
  rows: KvRow[],
): { flags: Set<string>; kv: Map<string, string> } => {
  const flags = new Set<string>();
  const kv = new Map<string, string>();
  for (const { k, v } of rows) {
    kv.set(k, v);
    if (k.startsWith('flag:') && v === '1') flags.add(k.slice('flag:'.length));
  }
  return { flags, kv };
};
