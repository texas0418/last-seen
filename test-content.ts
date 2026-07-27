// The doctrine enforcer. Run with: npx tsx test-content.ts
//
// 1. NO LEAKS: a password-gate answer must not appear, normalized, in any
//    text the player can read — except photo `closer` layers (the inside of
//    an image) and post-solution artifacts (freetext echoes, endings).
// 2. EARNED: every gate cites >= 2 clue sources on >= 2 distinct surfaces,
//    and every cited source actually exists.
// 3. SOUND: all visibleWhen/trigger/setsFlag flags are declared; all script
//    gotos land inside their script; all freetext gateIds exist.
// 4. TRUE: the ciphertexts decode to exactly what DESIGN.md promises.

// @ts-expect-error node builtins have no types under Expo's tsconfig; tsx runs it fine
import assert from 'node:assert/strict';

import { DRAFT_BODY_CIPHER, DRAFT_SUBJECT_CIPHER, EMAILS, TIDEWATER_HINT } from './src/content/mail';
import { INTRO, NOTES, PHOTOS, VOICEMAILS } from './src/content/other';
import { THREADS } from './src/content/threads';
import { flip } from './src/engine/cipher';
import { GATES } from './src/engine/gates';
import { FLAGS, normalizeAnswer, type Flag } from './src/models';

const known = new Set<string>(FLAGS);

// ——— The readable pool (leak-scan targets) ———
const pool: { where: string; text: string }[] = [];
for (const p of INTRO) pool.push({ where: 'intro', text: p });
for (const t of THREADS) {
  for (const m of t.messages) pool.push({ where: t.id, text: m.body });
  for (const [i, s] of (t.live?.steps ?? []).entries()) {
    if (s.kind === 'them') pool.push({ where: `${t.id}#${i}`, text: s.body });
    if (s.kind === 'choice')
      for (const o of s.options) pool.push({ where: `${t.id}#${i}`, text: o.label });
    if (s.kind === 'freetext') pool.push({ where: `${t.id}#${i}`, text: s.wrong });
    // note: freetext `echo` is deliberately NOT scanned — it renders only
    // after the player has already produced the answer themselves.
  }
}
for (const e of EMAILS) {
  pool.push({ where: e.id, text: `${e.subject}\n${e.body}` });
  for (const a of e.attachments ?? []) pool.push({ where: e.id, text: a.body });
}
for (const v of VOICEMAILS) pool.push({ where: v.id, text: v.transcript });
for (const n of NOTES) pool.push({ where: n.id, text: `${n.title}\n${n.body}` });
for (const p of PHOTOS)
  pool.push({ where: p.id, text: `${p.alt}\n${p.caption ?? ''}` }); // closer excluded
for (const g of GATES) {
  for (const w of g.wrong) pool.push({ where: `gate:${g.id}`, text: w });
  for (const n of g.nudges) pool.push({ where: `gate:${g.id}`, text: n });
}

// 1. No leaks.
for (const g of GATES.filter((g) => g.kind === 'password')) {
  for (const answer of g.answers) {
    for (const { where, text } of pool) {
      assert.ok(
        !normalizeAnswer(text).includes(answer),
        `LEAK: answer to '${g.id}' appears in ${where}`,
      );
    }
  }
}

// 2. Earned.
const contentIds = new Set<string>([
  'intro',
  ...THREADS.map((t) => t.id),
  ...EMAILS.map((e) => e.id),
  ...VOICEMAILS.map((v) => v.id),
  ...NOTES.map((n) => n.id),
  ...PHOTOS.map((p) => p.id),
]);
for (const g of GATES) {
  assert.ok(g.clues.length >= 2, `gate '${g.id}' has fewer than 2 clues`);
  const surfaces = new Set(g.clues.map((c) => c.surface));
  assert.ok(surfaces.size >= 2, `gate '${g.id}' clues live on a single surface`);
  for (const c of g.clues)
    assert.ok(contentIds.has(c.itemId), `gate '${g.id}' cites missing item '${c.itemId}'`);
}

// 3. Sound.
const checkFlags = (list: readonly string[] | undefined, where: string) => {
  for (const f of list ?? []) assert.ok(known.has(f), `unknown flag '${f}' in ${where}`);
};
for (const t of THREADS) {
  checkFlags(t.visibleWhen, t.id);
  for (const m of t.messages) checkFlags(m.visibleWhen, t.id);
  if (t.live) {
    assert.ok(known.has(t.live.trigger), `unknown trigger in ${t.id}`);
    t.live.steps.forEach((s, i) => {
      if (s.kind === 'choice')
        for (const o of s.options) {
          if (o.setsFlag) assert.ok(known.has(o.setsFlag), `bad setsFlag ${t.id}#${i}`);
          if (o.goto !== undefined)
            assert.ok(o.goto >= 0 && o.goto < t.live!.steps.length, `bad goto ${t.id}#${i}`);
        }
      if (s.kind === 'freetext')
        assert.ok(GATES.some((g) => g.id === s.gateId), `bad gateId ${t.id}#${i}`);
    });
  }
}
for (const e of EMAILS) checkFlags(e.visibleWhen, e.id);
for (const v of VOICEMAILS) checkFlags(v.visibleWhen, v.id);
for (const n of NOTES) checkFlags(n.visibleWhen, n.id);
for (const p of PHOTOS) checkFlags(p.visibleWhen, p.id);
for (const g of GATES)
  if (g.setsFlag) assert.ok(known.has(g.setsFlag), `bad setsFlag on gate ${g.id}`);

// Every gate answer is already normalized (the checker compares normalized).
for (const g of GATES)
  for (const a of g.answers)
    assert.equal(a, normalizeAnswer(a), `gate '${g.id}' answer not normalized`);

// 4. True ciphertexts.
assert.equal(flip(DRAFT_SUBJECT_CIPHER), 'to the only person who still calls me q');
assert.equal(flip(TIDEWATER_HINT), 'the boat. when he was born.');
const draft = flip(DRAFT_BODY_CIPHER);
for (const must of [
  'i am not in the water',
  'eli soto did not drown by accident',
  'mara reyes',
  'zero four one two',
  'say the old words',
  'love, q',
]) {
  assert.ok(draft.includes(must), `decoded draft is missing: "${must}"`);
}

// The flag every ending needs is reachable: each ending flag is set by a
// gate or by a script choice somewhere.
const settable = new Set<string>();
for (const g of GATES) if (g.setsFlag) settable.add(g.setsFlag);
for (const t of THREADS)
  for (const s of t.live?.steps ?? [])
    if (s.kind === 'choice')
      for (const o of s.options) if (o.setsFlag) settable.add(o.setsFlag);
for (const f of ['ending1', 'ending2', 'ending3', 'ending4'] as Flag[])
  assert.ok(settable.has(f), `ending flag '${f}' is unreachable`);

// …and every flag any content item DEPENDS on is settable somewhere: by a
// gate, a script choice, or one of the engine's own screens.
const ENGINE_SET: Flag[] = ['introDone', 'phoneUnlocked', 'act2', 'airplaneMode', 'cloudRestored', 'draftDecoded'];
for (const f of ENGINE_SET) settable.add(f);
for (const t of THREADS) {
  for (const f of t.visibleWhen ?? []) assert.ok(settable.has(f), `dead flag '${f}' (${t.id})`);
  for (const m of t.messages)
    for (const f of m.visibleWhen ?? []) assert.ok(settable.has(f), `dead flag '${f}' (${t.id})`);
  if (t.live) assert.ok(settable.has(t.live.trigger), `dead trigger '${t.live.trigger}' (${t.id})`);
}
for (const e of [...EMAILS, ...VOICEMAILS, ...NOTES, ...PHOTOS])
  for (const f of e.visibleWhen ?? [])
    assert.ok(settable.has(f), `dead flag '${f}' (${e.id})`);


// ——— discoverability: the inverse of the leak test ———
// Every "find the phrase" gate answer must actually exist, ciphered, in
// player-readable content. (Added after playtest 1: "still game" was never
// planted — the final gate was unsolvable.)
{
  const flip = (s: string): string =>
    s.replace(/[a-z]/g, (c: string) => String.fromCharCode(219 - c.charCodeAt(0)))
     .replace(/[A-Z]/g, (c: string) => String.fromCharCode(155 - c.charCodeAt(0)));
  const oldThread = THREADS.find((t) => t.id === 'th-casey-old');
  if (!oldThread) throw new Error('th-casey-old missing');
  const bodies = oldThread.messages.map((m) => m.body.toLowerCase()).join(' ');
  assert(
    bodies.includes(flip('still game').toLowerCase()),
    'the old words ("still game") are planted, ciphered, in th-casey-old',
  );
  const draftPlain = flip(DRAFT_BODY_CIPHER).toLowerCase();
  assert(
    draftPlain.includes('say the old words'),
    'the draft instructs "say the old words"',
  );
  assert(
    !draftPlain.includes('still game'),
    'the draft must NOT contain the old words themselves',
  );
}

console.log(`test-content: all assertions passed (${pool.length} readable items scanned)`);
