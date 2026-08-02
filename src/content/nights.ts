// src/content/nights.ts
// The Twelve Nights structure (DESIGN.md). A night STARTS when its
// `unlockedBy` flag is set; the newest unlocked night gets a one-time
// title card with the previous night's recap in Casey's voice.
//
// v2 scaffold: nights 1–4 map the existing arc onto the night frame.
// Nights 5–12 join this table WITH their content — never list a night
// the player can enter and find empty.

import type { Flag } from '../models';

export interface NightDef {
  n: number;
  title: string;
  /** flag that begins this night; null = begins at first launch */
  unlockedBy: Flag | null;
  /** "PREVIOUSLY" line on the night card — Casey's serif voice */
  recap: string | null;
}

export const NIGHTS: NightDef[] = [
  {
    n: 1,
    title: 'THE ENVELOPE',
    unlockedBy: null,
    recap: null,
  },
  {
    n: 2,
    title: 'UNREAD',
    unlockedBy: 'phoneUnlocked',
    recap:
      'The phone opened for you like it was waiting. Six days of missed calls. A town that has already decided.',
  },
  {
    n: 3,
    title: 'PASSWORD',
    unlockedBy: 'act2',
    recap:
      'Her whole life ran through that inbox, and now it runs through you. Somebody else tried the door first.',
  },
  {
    n: 4,
    title: 'M 🌊',
    unlockedBy: 'maraTrusted',
    recap:
      'The affair was a costume. The reporter is real, the story is real, and your sister is a witness who never made it to print.',
  },
  {
    n: 5,
    title: 'THE BOOKS',
    unlockedBy: 'night5',
    recap:
      'The reporter kept her word: three files, one hole. Quinn read ledgers the way other people read faces. Your turn.',
  },
  {
    n: 6,
    title: 'MARCUS',
    unlockedBy: 'night6',
    recap:
      'The watcher gave you until Friday. And the boss’s son keeps leaving words on a dead woman’s phone — none of them the words a guilty man would choose.',
  },
];

export const currentNight = (has: (f: Flag) => boolean): NightDef => {
  let cur = NIGHTS[0];
  for (const nd of NIGHTS) if (nd.unlockedBy === null || has(nd.unlockedBy)) cur = nd;
  return cur;
};
