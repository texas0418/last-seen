// Pure-module tests for the sisters' cipher. Run with: npx tsx test-cipher.ts

// @ts-expect-error node builtins have no types under Expo's tsconfig; tsx runs it fine
import assert from 'node:assert/strict';

import {
  applyMapping,
  cipherLetters,
  flip,
  flipChar,
  isFullyDecoded,
} from './src/engine/cipher';

// The cipher is its own inverse.
assert.equal(flip(flip('the tide book')), 'the tide book');
assert.equal(flipChar('a'), 'z');
assert.equal(flipChar('Z'), 'A');
assert.equal(flipChar('.'), '.');

// The canonical plants.
assert.equal(flip('XZHVB. KOVZHV.'), 'CASEY. PLEASE.');
assert.equal(flip('hgroo tznv'), 'still game');
assert.equal(flip('gsv ylzg. dsvm sv dzh ylim.'), 'the boat. when he was born.');

// Decoder mechanics.
const ct = 'gsv tznv';
assert.deepEqual(cipherLetters(ct).sort(), ['g', 'n', 's', 't', 'v', 'z']);
assert.equal(isFullyDecoded(ct, {}), false);
const full: Record<string, string> = {};
for (const c of cipherLetters(ct)) full[c] = flipChar(c);
assert.equal(isFullyDecoded(ct, full), true);
const wrong = { ...full, g: 'q' };
assert.equal(isFullyDecoded(ct, wrong), false);

// Partial mapping renders mapped letters and passes the rest through.
const rendered = applyMapping('gsv', { g: 't' });
assert.deepEqual(rendered.map((r) => r.ch).join(''), 'tsv');
assert.deepEqual(rendered.map((r) => r.decoded), [true, false, false]);

// Case is preserved through mapping.
assert.equal(applyMapping('Gsv', { g: 't' })[0].ch, 'T');

console.log('test-cipher: all assertions passed');
