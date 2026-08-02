// src/content/calendar.ts
// Quinn's calendar. v2 scaffold ships NOISE ONLY — mundane life, herring
// support, and the quiet gut-punch of appointments she'll never keep. The
// N6 clue entries (Harborview rm 214 etc.) land WITH Night 6's content;
// never ship a clue before its gate exists (leak doctrine).

import type { Flag } from '../models';

export interface CalEntry {
  id: string;
  when: string;
  title: string;
  detail?: string;
  visibleWhen?: Flag[];
}

export const CALENDAR: CalEntry[] = [
  {
    id: 'cal-sun',
    when: 'Sundays, 6:00 PM',
    title: 'call mom',
    detail: 'repeats weekly · do not skip twice in a row again',
  },
  {
    id: 'cal-oct2',
    when: 'Oct 2',
    title: 'mom — groceries + pharmacy',
  },
  {
    id: 'cal-oct3',
    when: 'Oct 3, 9:00 AM',
    title: 'month-end close',
    detail: 'AP batch to Sandra by noon. no exceptions this time.',
  },
  {
    id: 'cal-oct7',
    when: 'Oct 7, 2:30 PM',
    title: 'dr. okafor (mom) — bring the list',
  },
  {
    id: 'cal-oct8',
    when: 'Oct 8, 7:00 PM',
    title: 'M — 7:00',
    detail: 'don’t park in the lot',
  },
  {
    id: 'cal-oct16',
    when: 'Oct 16, 11:15 AM',
    title: 'dentist',
  },
  {
    id: 'cal-harborview',
    when: 'Tuesdays, 4:00 PM',
    title: 'mom — harborview',
    detail: 'rm 214. she likes the window chair.',
    visibleWhen: ['night6'],
  },
  {
    id: 'cal-oct11',
    when: 'Oct 11, 9:00 AM',
    title: 'R.H. — office',
    detail: 'bring nothing.',
    visibleWhen: ['night6'],
  },
  {
    id: 'cal-oct12',
    when: 'Oct 12, 5:00 AM',
    title: '—',
    visibleWhen: ['night6'],
  },
  {
    id: 'cal-oct23',
    when: 'Oct 23',
    title: 'ozzy — 5 yrs',
    detail: 'flowers for the window box',
  },
];
