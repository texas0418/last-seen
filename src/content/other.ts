// src/content/other.ts
// Voicemail transcripts, Notes, Photos, intro narration, endings. Photos are
// v1 "described scenes": an alt paragraph on a gradient card, plus an
// optional `closer` layer revealed by long-press ("look closer"). The closer
// layer is the ONLY place a password answer may appear (AGENTS.md doctrine —
// it is the diegetic equivalent of spotting a detail inside the image).

import type { Note, Photo, Voicemail } from '../models';

export interface DescribedPhoto extends Photo {
  closer?: string;
}

export const VOICEMAILS: Voicemail[] = [
  {
    id: 'vm-mom-oct2',
    from: 'Mom',
    when: 'Oct 2, 2026, 4:41 PM',
    duration: '0:17',
    transcript:
      '“Quinn, honey, it’s your mother. I was thinking about the wisteria at ' +
      'Alder Street — twelve years this fall since we lost that house, can you ' +
      'believe it. Your father never did fix the gate. Anyway. The girl on the ' +
      'radio said rain. Call me when you’re off, don’t forget to eat something.”',
  },
  {
    id: 'vm-mom-oct11',
    from: 'Mom',
    when: 'Oct 11, 2026, 8:03 PM',
    duration: '0:09',
    transcript:
      '“You sounded far away today, sweetheart. Not the phone kind of far away. ' +
      'The other kind. You get that from him, you know. Call me back.”',
  },
  {
    id: 'vm-dae-oct13',
    from: 'Dae 🌙',
    when: 'Oct 13, 2026, 3:14 AM',
    duration: '0:09',
    transcript:
      '“[crying] Pick up. Pick up pick up pick up. Tell me you didn’t — you ' +
      'don’t get to make me the plant person, Quinn, that was a JOKE — [call ends]”',
  },
  {
    // The crack of light. Three days after the car was found. Mid-act-2 it
    // reads as a confused woman's grief; the florist receipt reframes it.
    id: 'vm-mom-oct15',
    from: 'Mom',
    when: 'Oct 15, 2026, 11:20 AM',
    duration: '0:20',
    transcript:
      '“Thank you for the flowers, honey. Lilies, like the fair. Though I told ' +
      'the delivery girl at the door, my Quinn always sends yellow ones — she ' +
      'laughed. People laugh at me now. The card was nice. You and your little ' +
      'codes. Call me back, everyone here keeps using the wrong voice.”',
    visibleWhen: ['act2'],
  },
  {
    id: 'vm-hr',
    from: 'Halloway Seafood — Front Office',
    when: 'Oct 13, 2026, 9:00 AM',
    duration: '0:18',
    transcript:
      '“Ms. Mercer, this is Carol from the front office. Mr. Halloway asked me ' +
      'to remind you that company records and login credentials are company ' +
      'property, and, um — given the circumstances I’m so sorry to be leaving ' +
      'this message at all. Please disregard. I’m sorry. [call ends]”',
  },
  {
    id: 'vm-marcus',
    from: 'Marcus Halloway',
    when: 'Oct 11, 2026, 7:42 PM',
    duration: '0:18',
    visibleWhen: ['night6'],
    transcript:
      'Quinn. It’s — you know who it is. My father had his consultant in the ' +
      'office for an hour today and your name came through the door twice. ' +
      'Whatever you copied — I need to know it’s somewhere safe. Not for him. ' +
      'For — just. Call me back. Not the office line.',
  },
  {
    id: 'vm-eli',
    from: 'Eli Soto (fwd: R. Soto)',
    when: 'Apr 8, 2025, 6:12 AM',
    duration: '0:22',
    visibleWhen: ['rosaTrust'],
    transcript:
      'Rosita. Don’t cook tonight, I’ll bring— [wind] —they’ve got us ' +
      'pulling cages out of seven today. water smells like a battery, I’m ' +
      'not — [inaudible] — Ramos says the notice came down last week and ' +
      'the office said pull anyway, so. [pause] Tell your mother we’ll come ' +
      'Sunday. Love you. [end of forwarded message]',
  },
];

export const NOTES: Note[] = [
  {
    id: 'nt-groceries',
    title: 'groceries',
    when: 'Oct 6',
    body: 'oat milk\neggs\nthe good bread (BACK shelf)\nlemons x3\nfoil\nbatteries AAA',
  },
  {
    id: 'nt-mom',
    title: 'mom — meds + appts',
    when: 'Sep 28',
    body:
      'donepezil 10mg — MORNINGS, with food\nDr. Okafor — thursdays 2pm (drive her, she cancels ubers)\n' +
      'harborview intake weds — bring the insurance card. she’ll say she doesn’t need it\n' +
      'insurance lapsed?? call monday\nDO NOT argue about the radio. it’s her radio.',
  },
  {
    id: 'nt-audit',
    title: 'if the audit asks',
    when: 'Oct 3',
    body:
      'the second folder is not mine.\ni only copied what was already true.\n' +
      'copies are not theft. copies are memory.\n(breathe.)',
  },
  {
    id: 'nt-packing',
    title: 'packing?',
    when: 'Oct 10',
    visibleWhen: ['act2'],
    body:
      'cash only.\ngray hoodie, not the blue coat. T likes the blue coat.\n' +
      'leave the plants for dae. she’ll pretend to hate it.\n' +
      'mom’s lilies — AFTER. so she knows.',
  },
  {
    id: 'note-bc',
    title: 'ledger rules',
    when: 'Jun 14',
    visibleWhen: ['maraTrusted'],
    body:
      'B is born. C is changed.\n' +
      'nothing gets a C without somebody paying for the edit.\n' +
      'count the C’s. then count who cashed them.',
  },
];

export const PHOTOS: DescribedPhoto[] = [
  {
    id: 'ph-wallpaper',
    when: 'Set as wallpaper',
    emoji: '🎡',
    alt:
      'A photo-booth strip, rescanned: two girls at a county fair, maybe ten ' +
      'and thirteen, sunburnt, mid-laugh, sharing an enormous cloud of cotton ' +
      'candy. The older one is looking at the younger one instead of the camera. ' +
      'There is small print along the strip’s bottom edge.',
    closer: 'The small print, magnified: “© BRENNAN CO. FAIR — SOUVENIR STRIP — 2008”.',
    caption: 'the best day',
  },
  {
    id: 'b6',
    when: 'Oct 5',
    emoji: '🪑',
    caption: 'sunday.',
    alt:
      'Mom asleep in the wingback under the crocheted afghan, reading glasses still on, a plain pale book in her hands. Late light through the lace.',
  },
  {
    id: 'b2',
    when: 'Oct 10',
    emoji: '🪴',
    caption: 'the hostages',
    alt:
      'The windowsill jungle over the radiator — pothos, fern, the little monstera — rain on the glass, the street grey beyond.',
  },
  {
    id: 'ph-ozzy',
    when: 'Mar 12, 2021',
    emoji: '🐦',
    alt:
      'A sky-blue budgie standing on a curtain rod with the posture of a ' +
      'building inspector who has found several violations.',
    caption: 'Ozzy. King.',
  },
  {
    id: 'b10',
    when: 'Oct 8',
    emoji: '🧩',
    alt:
      'The thousand-piece puzzle at night: border done, a mug holding the box lid face-down, lamp light.',
  },
  {
    id: 'b8',
    when: 'Oct 6',
    emoji: '🌧️',
    alt:
      'Rain hammering the windshield from the driver’s seat, parked, wipers stopped mid-arc, the harbor lot smeared into bokeh.',
  },
  {
    id: 'ph-chart',
    when: 'Aug 30',
    emoji: '📄',
    alt:
      'A torn half-page of childhood paper, photographed on a carpet. Crayon ' +
      'title: “THE GAME — RULE 1: never write the real thing.” Below, in ' +
      'pencil, a two-column list: A—Z, B—Y, C—X… the rest of the page is ' +
      'gone, burnt-edged, like someone once tried to retire it.',
    caption: 'found in mom’s boxes. still binding. 🐦',
  },
  {
    id: 'b7',
    when: 'Oct 2',
    emoji: '🛒',
    alt:
      'Two paper bags spilling groceries on the kitchen counter — apples, a leek, plain bread. The fluorescent hum practically audible.',
  },
  {
    id: 'b11',
    when: 'Sep 30',
    emoji: '🧾',
    caption: 'month-end',
    alt:
      'The desk after hours: adding machine, paper stacks edge-on, the monitor dark, one green banker’s lamp.',
  },
  {
    id: 'ph-flyer',
    when: 'Sep 14',
    emoji: '🕯️',
    alt:
      'A photocopied memorial flyer taped inside a window: a young man in ' +
      'rain gear laughing into the wind on a boat deck. Candle stubs on the ' +
      'sill below. A line of dates and a vessel name under his photo.',
    closer:
      'The line under the photo: “ELI SOTO · 1991–2025 · CREW, F/V DORA MAE · ' +
      '‘the water doesn’t forgive.’ · Port Brennan Seamen’s Hall”.',
    caption: undefined,
  },
  {
    id: 'b12',
    when: 'Sep 28',
    emoji: '🕊️',
    caption: 'almost five years, king.',
    alt:
      'The old brass birdcage on the shelf, repurposed: a pot of ivy growing out through the bars. Dust in the window light.',
  },
  {
    id: 'b1',
    when: 'Sep 21',
    emoji: '☕',
    alt:
      'A latte on the café window table, rain streaking the glass, the marina blurred beyond, the chair opposite empty.',
  },
  {
    id: 'ph-ferry',
    when: 'Oct 9',
    emoji: '⛴️',
    alt:
      'A timetable board photographed at an angle, dockside glare: “NORTH ' +
      'LINE — Port Brennan · Tessley · Kestrel Bay · Ardenwall.” The first ' +
      'sailing, 5:40 AM, has been circled twice in pen. Hard. The pen went ' +
      'through the paper.',
    visibleWhen: ['act2'],
  },
  {
    id: 'b9',
    when: 'Sep 12',
    emoji: '🐦‍⬛',
    alt:
      'A great blue heron on a single piling at low tide, fog eating the far shore. It did not care that she was there.',
  },
  {
    id: 'b3',
    when: 'Aug 30',
    emoji: '🍟',
    alt:
      'Fish and chips in plain paper on the dock bench, wooden fork, gulls loitering just out of reach.',
  },
  {
    id: 'ph-tcar',
    when: 'Oct 4, 11:52 PM',
    emoji: '🚗',
    visibleWhen: ['night8'],
    alt:
      'Her own car alone in the marina lot at night, photographed from ' +
      'across the street. Sodium light, long shadows. And at the fence, ' +
      'facing the car: a man standing perfectly still, hood up, his ' +
      'high-visibility work jacket glowing under the lamp.',
    closer:
      'Taken five minutes after “nice parking job.” She went back out with ' +
      'her phone, and he let her take the picture. The jacket: bright ' +
      'yellow-orange, grey reflective double stripe. Not a construction ' +
      'crew’s. He never moved.',
    caption: undefined,
  },
  {
    id: 'b4',
    when: 'Aug 14',
    emoji: '🐈',
    alt:
      'An orange cat mid-leap off the fence rail, hopelessly blurred, half the frame shed wall. Not her cat. Photographed anyway.',
  },
  {
    id: 'b5',
    when: 'Aug 2',
    emoji: '🌇',
    alt:
      'A sunset over pewter water, the ordinary kind everyone photographs: grey-gold light, pebble beach, one stranger far down the shore.',
  },
  {
    id: 'b13',
    when: 'Jul 19',
    emoji: '🌲',
    alt:
      'The driftwood beach up the coast, logs like fallen columns, fog snagged in the treeline.',
  },
  {
    id: 'ph-overlook',
    when: 'Oct 9',
    emoji: '🌊',
    alt:
      'Widow’s Point at dusk, shot from the guardrail: grey water a long way ' +
      'down, no horizon, the kind of photo nobody takes for fun. It is the ' +
      'only photo on this phone with no people in it and no caption.',
  },
];

/** Casey's narration — the only voice outside the phone. Shown once. */
export const INTRO: string[] = [
  'The envelope is padded, brown, heavier than it looks. No return address. The postmark is smudged — K————L B——, the rest gone to rain.',
  'Inside: your sister’s phone. You know it by the chip on the corner and by the way your chest does something geological when the screen lights up.',
  'Six days ago they found Quinn’s car at Widow’s Point with the door open. The tide was going out. The sheriff used the word “concluded” on the third day.',
  'Also in the envelope, nothing else. No note. Which — if you knew Quinn, and you did, three years ago, before Dad, before the silence — is itself a kind of note.',
  'She set every PIN to the best day. She never said which day. You were probably supposed to know.',
];

export interface Ending {
  flag: 'ending1' | 'ending2' | 'ending3' | 'ending4';
  title: string;
  prose: string[];
}

export const ENDINGS: Ending[] = [
  {
    flag: 'ending1',
    title: 'LOUD',
    prose: [
      'Mara’s story runs on a Thursday. By Friday there are federal cars at the marina office, and Carol from the front office is carrying a box to her sedan, crying and waving to the cameras.',
      'Marcus Halloway testifies for four hours. He does not look at his father once.',
      'Three weeks later, a voicemail from an unlisted number: “They subpoenaed me, bird. Which means I exist again. Which means — put the kettle on. I’m coming home the long way.”',
    ],
  },
  {
    flag: 'ending2',
    title: 'QUIET',
    prose: [
      'You delete the account the way she asked: slowly, like lowering something into water.',
      'The town keeps its story. The Halloways keep their marina. Dae keeps the plants alive, furiously, for years.',
      'Every October a postcard arrives with no signature. A ferry. A lighthouse. A bird. You keep them in the envelope the phone came in, which you have never thrown away, because some notes are the absence of a note.',
    ],
  },
  {
    flag: 'ending3',
    title: 'THE FAIR',
    prose: [
      'Kestrel Bay smells like diesel and doughnuts. The florist recognizes the photo strip before you finish unfolding it. “Back booth,” she says, “of the diner. She always faces the door.”',
      'Quinn looks up. Three years and six days of silence sit down at the table between you, and then she says, “you found the watermark,” and the silence gets up and leaves.',
      'The tide book is still out there. The choice is still coming. But you make it together, which was the only thing she ever actually asked.',
    ],
  },
  {
    flag: 'ending4',
    title: 'PROCEDURE',
    prose: [
      'The side door, after six. Dunmore thanks you with both hands around yours, like a man at a funeral.',
      'The case stays concluded. The phone enters evidence and is never logged. In the spring, Halloway Seafood sponsors the county fair.',
      'Some nights you wake up certain the phone is buzzing in the drawer where you no longer keep it. You never find out what the flowers meant. She never finds out you got the phone at all.',
    ],
  },
];
