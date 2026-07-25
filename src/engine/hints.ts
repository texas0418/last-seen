// src/engine/hints.ts
// Pure module: which gates Dae can currently nudge the player about. Dae is
// the ONLY hint channel, hints live in gates.ts, and they escalate exactly
// once. She never gives answers; she gives grief and geography.

import type { FlagSet } from '../models';
import { GATES, type Gate } from './gates';

/** Gate ids Dae will talk about, in the order the player is stuck on them. */
export function activeGateIds(flags: FlagSet): string[] {
  const ids: string[] = [];
  if (!flags.has('act2')) ids.push('mail');
  if (flags.has('act2') && !flags.has('maraTrusted')) ids.push('mara1');
  if (flags.has('act2') && !flags.has('act3')) ids.push('tidewater');
  if (flags.has('draftDecoded') && !flags.has('burnerContact')) ids.push('burner');
  if (flags.has('burnerContact') && !flags.has('ending3')) ids.push('town');
  return ids;
}

export const hintLabel = (g: Gate): string =>
  ({
    mail: 'her email password',
    mara1: 'what the reporter wants',
    tidewater: 'the second mailbox',
    burner: 'the old words',
    town: 'where she is',
  })[g.id] ?? g.id;

export const activeGates = (flags: FlagSet): Gate[] =>
  activeGateIds(flags).map((id) => GATES.find((g) => g.id === id)!);
