// src/engine/hints.ts
// Pure module: which gates Dae can currently nudge the player about. Dae is
// the ONLY hint channel, hints live in gates.ts, and they escalate exactly
// once. She never gives answers; she gives grief and geography.

import type { Flag, FlagSet } from '../models';
import { GATES, type Gate } from './gates';

/** The hint ladder: a gate is "active" for Dae once its prerequisite flag
 * is set (or immediately) and until its own flag resolves it. Table-driven
 * so twelve nights of gates never trip the complexity lint. */
const LADDER: { id: string; requires?: Flag; until: Flag }[] = [
  { id: 'mail', until: 'act2' },
  { id: 'mara1', requires: 'act2', until: 'maraTrusted' },
  { id: 'mara2', requires: 'night5', until: 'booksDone' },
  { id: 'cloud', requires: 'night6', until: 'cloudRestored' },
  { id: 'rosa', requires: 'cloudRestored', until: 'rosaTrust' },
  { id: 'vale', requires: 'night8', until: 'valeNamed' },
  { id: 'mara3', requires: 'act3', until: 'night10' },
  { id: 'florist', requires: 'night10', until: 'night11' },
  { id: 'tidewater', requires: 'act2', until: 'act3' },
  { id: 'burner', requires: 'draftDecoded', until: 'burnerContact' },
  { id: 'town', requires: 'burnerContact', until: 'ending3' },
];

export function activeGateIds(flags: FlagSet): string[] {
  return LADDER.filter(
    (e) => (!e.requires || flags.has(e.requires)) && !flags.has(e.until),
  ).map((e) => e.id);
}

export const hintLabel = (g: Gate): string =>
  ({
    mail: 'her email password',
    mara1: 'what the reporter wants',
    mara2: 'the reports',
    cloud: 'her cloud pin',
    rosa: 'what the widow wants',
    vale: 'the watcher’s name',
    mara3: 'the signature',
    florist: 'the fourteenth',
    tidewater: 'the second mailbox',
    burner: 'the old words',
    town: 'where she is',
  })[g.id] ?? g.id;

export const activeGates = (flags: FlagSet): Gate[] =>
  activeGateIds(flags).map((id) => GATES.find((g) => g.id === id)!);
