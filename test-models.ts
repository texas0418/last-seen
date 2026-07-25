// Pure-module tests for models + script/hint logic. Run with: npx tsx test-models.ts

// @ts-expect-error node builtins have no types under Expo's tsconfig; tsx runs it fine
import assert from 'node:assert/strict';

import { activeGateIds } from './src/engine/hints';
import { nextCursor, scriptHistory } from './src/engine/script';
import { isVisible, normalizeAnswer, type ScriptStep } from './src/models';

// Answer normalization: forgiving on case, spacing, punctuation.
assert.equal(normalizeAnswer('  Ozzy 2014! '), 'ozzy2014');
assert.equal(normalizeAnswer('Dora Mae 1991'), 'doramae1991');
assert.equal(normalizeAnswer('STILL GAME'), 'stillgame');
assert.equal(normalizeAnswer('Kestrel Bay'), 'kestrelbay');

// Visibility: no requirement = always visible; all flags required.
const flags = new Set(['act2']);
assert.equal(isVisible({}, flags), true);
assert.equal(isVisible({ visibleWhen: ['act2'] }, flags), true);
assert.equal(isVisible({ visibleWhen: ['act3'] }, flags), false);
assert.equal(isVisible({ visibleWhen: ['act2', 'act3'] }, flags), false);

// Script history renders only what happened.
const steps: ScriptStep[] = [
  { kind: 'them', body: 'hello?' },
  { kind: 'choice', options: [{ label: 'A' }, { label: 'B' }] },
  { kind: 'freetext', gateId: 'mara1', wrong: 'no' },
  { kind: 'end' },
];
const chosen = (i: number) => (i === 1 ? 'A' : i === 2 ? 'typed' : undefined);
assert.deepEqual(scriptHistory(steps, 0, chosen), []);
assert.deepEqual(scriptHistory(steps, 1, chosen), [{ from: 'them', body: 'hello?' }]);
assert.deepEqual(scriptHistory(steps, 3, chosen), [
  { from: 'them', body: 'hello?' },
  { from: 'me', body: 'A' },
  { from: 'me', body: 'typed' },
]);
assert.equal(nextCursor(1, undefined), 2);
assert.equal(nextCursor(1, 4), 4);

// Hint routing follows the player's actual stuck-point.
assert.deepEqual(activeGateIds(new Set()), ['mail']);
assert.deepEqual(activeGateIds(new Set(['act2'])), ['mara1', 'tidewater']);
assert.deepEqual(activeGateIds(new Set(['act2', 'maraTrusted', 'act3'])), []);
assert.deepEqual(
  activeGateIds(new Set(['act2', 'maraTrusted', 'act3', 'draftDecoded'])),
  ['burner'],
);
assert.deepEqual(
  activeGateIds(new Set(['act2', 'maraTrusted', 'act3', 'draftDecoded', 'burnerContact'])),
  ['town'],
);

console.log('test-models: all assertions passed');
