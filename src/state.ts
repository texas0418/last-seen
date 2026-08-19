// src/state.ts
// The one mutable store: flags + kv, persisted through db.ts, subscribed to
// with useSyncExternalStore. Screens read; gates and scripts write.

import { useSyncExternalStore } from 'react';

import { decoderKey, flagKey, readKey, rowsToState, scriptKey } from './dbCore';
import { delKv, loadAll, migrate, resetAll, setKv } from './db';
import type { Flag } from './models';

let flags = new Set<string>();
let kv = new Map<string, string>();
let version = 0;
const listeners = new Set<() => void>();

export function initState(): void {
  migrate();
  const loaded = rowsToState(loadAll());
  flags = loaded.flags;
  kv = loaded.kv;
  bump();
}

function bump(): void {
  version += 1;
  listeners.forEach((l) => l());
}

const subscribe = (l: () => void): (() => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Screens re-render on ANY state change; the store is small enough. */
export const useWorldVersion = (): number =>
  useSyncExternalStore(subscribe, () => version);

export const hasFlag = (f: Flag): boolean => flags.has(f);
export const flagSet = (): ReadonlySet<string> => flags;

export function setFlag(f: Flag, on = true): void {
  if (on === flags.has(f)) return;
  if (on) {
    flags.add(f);
    setKv(flagKey(f), '1');
  } else {
    flags.delete(f);
    delKv(flagKey(f));
  }
  bump();
}

export const getKv = (k: string): string | undefined => kv.get(k);

export function putKv(k: string, v: string): void {
  kv.set(k, v);
  setKv(k, v);
  bump();
}

export const scriptIndex = (threadId: string): number =>
  Number(kv.get(scriptKey(threadId)) ?? '0');

export const setScriptIndex = (threadId: string, i: number): void =>
  putKv(scriptKey(threadId), String(i));

export const decoderMapping = (draftId: string): Record<string, string> => {
  const raw = kv.get(decoderKey(draftId));
  return raw ? (JSON.parse(raw) as Record<string, string>) : {};
};

export const setDecoderMapping = (
  draftId: string,
  mapping: Record<string, string>,
): void => putKv(decoderKey(draftId), JSON.stringify(mapping));

export const isRead = (itemId: string): boolean => kv.has(readKey(itemId));
export const markRead = (itemId: string): void => {
  if (!isRead(itemId)) putKv(readKey(itemId), '1');
};

/** Stamped variants for threads: "read" means "read at THIS content state."
 *  New messages (live or archived) change the stamp -> unread again. */
export const readStamp = (itemId: string): string | undefined => getKv(readKey(itemId));
export const isReadAt = (itemId: string, stamp: string): boolean =>
  getKv(readKey(itemId)) === stamp;
export const markReadAt = (itemId: string, stamp: string): void => {
  if (getKv(readKey(itemId)) !== stamp) putKv(readKey(itemId), stamp);
};

/** Settings > "Start over" — wipes the phone back to the envelope. */
export function resetWorld(): void {
  resetAll();
  flags = new Set();
  kv = new Map();
  bump();
}
