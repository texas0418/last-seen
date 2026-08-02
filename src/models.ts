// src/models.ts
// Pure module: content types + visibility/answer logic. No expo imports so
// Node can test it (npm test). The whole game is DATA rendered by dumb
// screens; every reveal is a flag, every flag is earned.

/** Every flag the engine may set. Content tests reject unknown flags. */
export const FLAGS = [
  'introDone',
  'phoneUnlocked', // lock screen passcode solved (tutorial gate)
  'act2', // personal mail password solved
  'act3', // hidden tidewater account unlocked
  'maraTrusted', // deduction check passed; Mara's file drop arrives
  'night5', // acknowledged the file drop — Night 5 (The Books) opens
  'night6', // read T's warning — Night 6 (Marcus) opens
  'rosaTrust', // passed the widow's test — her evidence arrives
  'night8', // promised Rosa an answer — Night 8 opens (reserved)
  'valeNamed', // named the fixer to Mara — Night 8 resolved
  'night9', // Mara set the Thursday deadline — Night 9 opens (reserved)
  'night10', // named the signature — Night 10 (The Flowers) opens
  'night11', // told Mara about the draft — Night 11 (The Draft) opens
  'booksDone', // named R-1147 to Mara — the accounting night resolved
  'airplaneMode',
  'cloudRestored', // deleted Marcus thread recovered
  'draftDecoded', // the cipher draft resolved in the decoder
  'burnerContact', // player sent the old words to the burner
  'ending1', // sent the archive to Mara
  'ending2', // let her go
  'ending3', // found her — Kestrel Bay
  'ending4', // gave the phone to Dunmore
] as const;
export type Flag = (typeof FLAGS)[number];

export type Surface =
  | 'messages'
  | 'mail'
  | 'voicemail'
  | 'notes'
  | 'photos'
  | 'settings'
  | 'calendar'
  | 'intro';

export interface Msg {
  from: 'quinn' | 'them';
  body: string;
  when: string; // display string, e.g. "Oct 11, 9:12 PM"
  visibleWhen?: Flag[];
}

/** A scripted step in a LIVE thread (things texting the phone NOW). */
/** A step may carry `waitFor`: it stays dormant (no typing, no delivery)
 * until that flag exists — how a parked conversation resumes in a LATER
 * night without a second script. */
export type ScriptStep = { waitFor?: Flag } & (
  | { kind: 'them'; body: string; delayMs?: number }
  | { kind: 'choice'; options: { label: string; setsFlag?: Flag; goto?: number }[] }
  | {
      kind: 'freetext';
      /** Gate id checked against the typed reply. */
      gateId: string;
      /** Shown as Casey's sent bubble on success. */
      echo?: string;
      wrong: string; // their reply to a wrong answer
    }
  | { kind: 'end' }
);

export interface Thread {
  id: string;
  contact: string; // display name as saved in Quinn's phone
  detail?: string; // subtitle in thread view (number, etc.)
  messages: Msg[];
  /** Live script appended after the archived messages once trigger flag set. */
  live?: { trigger: Flag; steps: ScriptStep[] };
  visibleWhen?: Flag[];
}

export interface Attachment {
  name: string;
  body: string;
}

export interface Email {
  id: string;
  account: 'personal' | 'tidewater';
  folder: 'inbox' | 'drafts';
  from: string;
  subject: string;
  when: string;
  body: string;
  attachments?: Attachment[];
  visibleWhen?: Flag[];
}

export interface Voicemail {
  id: string;
  from: string;
  when: string;
  duration: string;
  transcript: string;
  visibleWhen?: Flag[];
}

export interface Note {
  id: string;
  title: string;
  when: string;
  body: string;
  visibleWhen?: Flag[];
}

export interface Photo {
  id: string;
  /** v1 renders photos as described scenes (alt text on a gradient card). */
  alt: string;
  caption?: string;
  when: string;
  emoji: string; // placeholder glyph on the card until real art ships
  visibleWhen?: Flag[];
}

export type FlagSet = ReadonlySet<string>;

export const isVisible = (
  item: { visibleWhen?: Flag[] },
  flags: FlagSet,
): boolean => (item.visibleWhen ?? []).every((f) => flags.has(f));

/** Case/punctuation/space-insensitive compare for typed answers. */
export const normalizeAnswer = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]/g, '');
