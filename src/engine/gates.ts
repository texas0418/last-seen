// src/engine/gates.ts
// Pure module: every password/answer gate in the game, with the clue map
// that test-content.ts enforces. THE DOCTRINE (see AGENTS.md): a gate's
// answer never appears in any readable content; every gate cites >= 2 clue
// sources on >= 2 different surfaces; wrong answers get atmosphere, never
// help. Hints exist only in-fiction (texting Dae) and never near the gate.

import type { Flag, Surface } from '../models';
import { normalizeAnswer } from '../models';

export interface ClueRef {
  itemId: string; // id of a thread/email/voicemail/note/photo, or 'intro'
  surface: Surface;
  what: string; // designer note: which fragment this source contributes
}

export interface Gate {
  id: string;
  /**
   * 'password': a secret string — test-content.ts fails the build if it
   * appears ANYWHERE the player can read (photo `closer` layers excepted:
   * that is the inside of an image). 'deduction': a reading-comprehension
   * answer that legitimately lives in the evidence.
   */
  kind: 'password' | 'deduction';
  /** Normalized accepted answers. Never rendered anywhere. */
  answers: string[];
  setsFlag: Flag | null;
  /** Shown after a wrong try — atmosphere, not error copy. Cycles. */
  wrong: string[];
  clues: ClueRef[];
  /** Two escalating in-fiction nudges, deliverable by Dae. Never the answer. */
  nudges: [string, string];
}

export const GATES: Gate[] = [
  {
    // Lock screen passcode. Tutorial gate: teaches "look CLOSER" — the
    // answer is a watermark detail in the lock wallpaper itself.
    id: 'passcode',
    kind: 'password',
    answers: ['2008'],
    setsFlag: 'phoneUnlocked',
    wrong: [
      'Try again.',
      'Attempt logged. 1 try until this phone is wiped.', // a bluff; it never wipes
    ],
    clues: [
      { itemId: 'intro', surface: 'intro', what: 'she set every PIN to the best day; the photo strip is from the fair' },
      { itemId: 'ph-wallpaper', surface: 'photos', what: 'fair-photo wallpaper carries a tiny © Brennan County Fair year watermark' },
    ],
    nudges: [
      'she never changed that code. it was always about the two of you.',
      'look AT the lock screen. not past it. the picture knows the year.',
    ],
  },
  {
    // Personal mail password — act break 1 -> 2. Three surfaces, one
    // inference, one subtraction. Scheme (dead bird + year the house was
    // lost) is teased in banter; the bird's name and the year live far away.
    id: 'mail',
    kind: 'password',
    answers: ['ozzy2014'],
    setsFlag: 'act2',
    wrong: [
      'Incorrect password.',
      'Incorrect password. Account will lock after repeated attempts.',
      'Incorrect password.',
    ],
    clues: [
      { itemId: 'th-dae', surface: 'messages', what: 'password scheme banter: "him plus the year we lost the house"' },
      { itemId: 'ph-ozzy', surface: 'photos', what: 'the budgie: "Ozzy. King." — no year anywhere near it' },
      { itemId: 'vm-mom-oct2', surface: 'voicemail', what: '"twelve years this fall since we lost Alder Street" — do the math from Oct 2026' },
    ],
    nudges: [
      'her passwords were always a eulogy. something she buried, something she lost.',
      'the bird has a name in her camera roll. the house has a year in your mother’s voice. put them together, no space.',
    ],
  },
  {
    // Hidden account — act break 2 -> 3. The login hint itself is written in
    // the childhood cipher; the facts it points at are on a memorial flyer.
    // Requires: notice the account (settings/system email), crack the cipher
    // (torn chart photo / the unanswered sign-off), then source both facts.
    id: 'tidewater',
    kind: 'password',
    answers: ['doramae1991'],
    setsFlag: 'act3',
    wrong: [
      'Wrong password.',
      'Wrong password. This mailbox is not registered to this device.',
      'Wrong password.',
    ],
    clues: [
      { itemId: 'em-storage', surface: 'mail', what: 'storage warning lists a second address: tidewater.ledger@' },
      { itemId: 'th-casey-old', surface: 'messages', what: 'the unanswered sign-off "XZHVB. KOVZHV." — garbage until it isn’t' },
      { itemId: 'ph-chart', surface: 'photos', what: 'torn childhood chart: A↔Z, B↔Y, C↔X, rest burned away' },
      { itemId: 'ph-flyer', surface: 'photos', what: 'memorial flyer: F/V DORA MAE, 1991–2025' },
    ],
    nudges: [
      'you two had a language once. she never stopped speaking it. the hint on that login is not gibberish.',
      'the rule is on a torn piece of paper in her photos. the boat and the year are on the saddest flyer in this town.',
    ],
  },
  {
    // Mara's deduction check, asked over live text. Free text, from the
    // invoice attachment. Passing earns her file drop (maraTrusted).
    id: 'mara1',
    kind: 'deduction',
    answers: ['coastalremediation', 'coastalremediationllc'],
    setsFlag: 'maraTrusted',
    wrong: [
      'Wrong. You skimmed. She didn’t die skimming. Read the invoices again — both of them.',
    ],
    clues: [
      { itemId: 'em-invoices', surface: 'mail', what: 'the AP batch: same date, same $4,800, two payees — one real lab, one shell' },
      { itemId: 'th-m', surface: 'messages', what: 'M: "the second set. he thinks nobody reads the ledger twice."' },
    ],
    nudges: [
      'mara wants proof you READ it. the money always gets paid twice — once for the truth, once for the lie.',
      'open the September AP batch attachment. the lab is real. the other payee is not.',
    ],
  },
  {
    // The old words, typed to the burner after decoding the draft. The
    // draft yields them in cipher; the player must decode and SEND them.
    id: 'burner',
    kind: 'password',
    answers: ['stillgame', 'thegameisstillon'],
    setsFlag: 'burnerContact',
    wrong: ['Wrong number.'],
    clues: [
      { itemId: 'em-draft', surface: 'mail', what: 'the unsent draft, decoded: "say the old words"' },
      { itemId: 'th-casey-old', surface: 'messages', what: 'the cipher itself — proof only Casey could answer' },
    ],
    nudges: [
      'the draft tells you exactly what to say. it just doesn’t tell you in english.',
      'two words. the ones that meant "I’m still your sister."',
    ],
  },
  {
    // Ending 3 triangulation: WHERE is she. Smudged postmark + ferry
    // timetable + florist receipt agree on one town. Typed to the burner.
    id: 'town',
    kind: 'deduction',
    answers: ['kestrelbay'],
    setsFlag: 'ending3',
    wrong: ['if you don’t know, don’t guess. guessing gets people found by the wrong ones.'],
    clues: [
      { itemId: 'intro', surface: 'intro', what: 'smudged postmark: K————L B——' },
      { itemId: 'ph-ferry', surface: 'photos', what: 'NORTH LINE timetable: Port Brennan · Tessley · Kestrel Bay · Ardenwall, dawn boat circled' },
      { itemId: 'em-florist', surface: 'mail', what: 'flowers for Mom paid IN STORE, in cash, two days after she "died" — the shop has one address' },
    ],
    nudges: [
      'she paid for the flowers in person. shops stand in towns. boats stop in towns. envelopes remember towns.',
      'line up the postmark, the dawn ferry’s stops, and where that florist keeps its till.',
    ],
  },
];

export const gateById = (id: string): Gate => {
  const g = GATES.find((x) => x.id === id);
  if (!g) throw new Error(`unknown gate: ${id}`);
  return g;
};

export const checkGate = (id: string, typed: string): boolean =>
  gateById(id).answers.includes(normalizeAnswer(typed));
