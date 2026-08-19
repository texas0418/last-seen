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
    // 'ozzyking2014': the caption "Ozzy. King." reads as a compound name to
    // some players — a correct deduction must never bounce on formatting.
    answers: ['ozzy2014', 'ozzyking2014'],
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
      'Wrong. You skimmed. She didn’t die skimming. Read the invoices again. Both of them.',
    ],
    clues: [
      { itemId: 'em-invoices', surface: 'mail', what: 'the AP batch: same date, same $4,800, two payees — one real lab, one shell' },
      { itemId: 'th-m', surface: 'messages', what: 'M: "the second set. he thinks nobody reads the ledger twice."' },
    ],
    nudges: [
      'mara wants proof you READ it. the money always gets paid twice, once for the truth, once for the lie.',
      'open the September AP batch attachment. the lab is real. the other payee is not.',
    ],
  },
  {
    // Night 5: the accounting deduction. The answer legitimately lives in
    // the evidence (deduction kind — exempt from the leak scan): the lab's
    // issued log says R-1147-B / Bed 7 / FAIL; the county shelf says
    // R-1147-C / pass. First mismatch = the report they touched to bury
    // Eli. Suffix-generous, number-strict.
    id: 'mara2',
    kind: 'deduction',
    answers: ['r1147', 'r1147b', 'r1147c', '1147'],
    setsFlag: 'booksDone',
    wrong: ['No. Numbers or nothing.', 'you’re reading it like a bank statement. it’s a crime scene.'],
    clues: [
      { itemId: 'em-backup1', surface: 'mail', what: 'lab issued log: R-1147-B · Bed 7 · Apr · FAIL' },
      { itemId: 'em-backup2', surface: 'mail', what: 'county shelf: Bed 7 · Apr · R-1147-C · pass' },
      { itemId: 'note-bc', surface: 'notes', what: 'Quinn’s rule: B is born, C is changed' },
    ],
    nudges: [
      'she matched paper for a living. what the lab wrote and what the county keeps are supposed to be twins.',
      'read the last letter of every report number, both lists, top to bottom. find where the twins stop matching. the first time is the one that matters.',
    ],
  },
  {
    // Night 6: the cloud-trash PIN. Scheme (everything is mom now — WHERE
    // she is) surfaces in Dae's thread; the room number is a calendar
    // entry. The pad wants four digits: rm 214 -> 0214. Password kind:
    // '0214' never appears in readable content.
    id: 'cloud',
    kind: 'password',
    answers: ['0214'],
    setsFlag: 'cloudRestored',
    wrong: ['Incorrect PIN.', 'Incorrect PIN. Recovery items remain encrypted.'],
    clues: [
      { itemId: 'th-dae', surface: 'messages', what: 'the PIN scheme: "everything’s mom now — where she is"' },
      { itemId: 'nt-mom', surface: 'notes', what: 'harborview intake — establishes WHERE mom is, no room number' },
      { itemId: 'cal-harborview', surface: 'calendar', what: 'mom — harborview · rm 214 · tuesdays' },
    ],
    nudges: [
      'her cloud pin? dae teased her about it once. after the diagnosis, everything became mom.',
      'not who mom is. WHERE mom is. the pad wants four digits and the answer only has three, so she padded it.',
    ],
  },
  {
    // Night 7: Rosa's test. The answer is printed inside the memorial-flyer
    // photo — deduction kind, quote-exact but normalize-forgiving.
    id: 'rosa',
    kind: 'deduction',
    answers: ['thewaterdoesntforgive', 'waterdoesntforgive'],
    setsFlag: 'rosaTrust',
    wrong: ['every word. or don’t write back.'],
    clues: [
      { itemId: 'ph-flyer', surface: 'photos', what: 'the quote under his name, inside the image: "the water doesn’t forgive."' },
      { itemId: 'th-rosa', surface: 'messages', what: 'her demand names the flyer and the window it hangs in' },
    ],
    nudges: [
      'rosa won’t trust a voice. she’ll trust the town’s own paper. quinn kept a photo of it.',
      'the memorial flyer in the camera roll. zoom under his name, under the dates. type the quote.',
    ],
  },
  {
    // Night 8: name the fixer. Deduction — 'T. Vale' is printed in a
    // newsletter nobody reads; the jacket reflection in the saved
    // screenshot is what makes the surname mean something.
    id: 'vale',
    kind: 'deduction',
    answers: ['vale', 'tvale', 'terrencevale'],
    setsFlag: 'valeNamed',
    wrong: ['Not a guess. A name I can pin to a photograph.'],
    clues: [
      { itemId: 'ph-tcar', surface: 'photos', what: 'the saved screenshot: HARBOR PATROL jacket reflected in the rear window' },
      { itemId: 'em-portnews', surface: 'mail', what: 'Waterfront Notes, personnel item: Harbor Patrol’s T. Vale joins Halloway as security consultant' },
      { itemId: 'th-t', surface: 'messages', what: 'six weeks of texts that know her coats, her hours, her parking' },
    ],
    nudges: [
      'the watcher sent her a picture once. she kept it. look at what he didn’t mean to photograph.',
      'harbor patrol doesn’t let go of its jackets. the waterfront newsletter keeps receipts. march, personnel.',
    ],
  },
  {
    // Night 9: the signature. Deduction from the tide-book transmittal scan;
    // M's "arrogance" line is the second surface.
    id: 'mara3',
    kind: 'deduction',
    answers: ['rhalloway', 'royhalloway'],
    setsFlag: null,
    wrong: ['The archive knows. Read it like she filed it, in order.'],
    clues: [
      { itemId: 'em-tidebook', surface: 'mail', what: 'exhibit 5 + the transmittal scan: R. Halloway, signed, ten days early' },
      { itemId: 'th-m', surface: 'messages', what: '"he signs the county copies himself. arrogance is our best witness."' },
    ],
    nudges: [
      'the tide book numbers its exhibits. number five is a confession with a pen.',
      'open the transmittal scan. first initial, last name, right over the stamp.',
    ],
  },
  {
    // Night 10: where she stood on the 14th. Deduction across the receipt,
    // Mom's flowers voicemail, and (for the wary) the ferry photo.
    id: 'florist',
    kind: 'deduction',
    answers: ['tidepoolflorals', 'tidepool'],
    setsFlag: null,
    wrong: ['In-store means a street. A street means a shop with a name on it.'],
    clues: [
      { itemId: 'em-florist', surface: 'mail', what: 'receipt: Oct 14, 9:12 AM, paid IN STORE, cash' },
      { itemId: 'vm-mom-oct15', surface: 'voicemail', what: 'Mom thanks Quinn for lilies — a day after the in-store purchase' },
      { itemId: 'ph-ferry', surface: 'photos', what: 'the dawn sailing north — how a dead woman reaches a shop' },
    ],
    nudges: [
      'mom said a girl came to the door. the receipt says nobody delivered anything, so somebody stood at a counter.',
      'the receipt has a letterhead. type it.',
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
      { itemId: 'th-casey-old', surface: 'messages', what: 'her last unanswered text, in cipher: "HGROO TZNV?" -> "still game?" — the question Casey finally answers' },
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
