// src/content/threads.ts
// Messages app content. Archived threads are Quinn's life; `live` scripts
// are the world texting the phone NOW, while Casey holds it. Dates are
// October 2026; the car was found at Widow's Point on Oct 12, the phone
// reached Casey on Oct 18. See DESIGN.md for the ground-truth timeline.

import type { Thread } from '../models';

export const THREADS: Thread[] = [
  {
    // The wound. Three years old, all unanswered. The final sign-off is the
    // cipher plant: garbage until the torn chart photo makes it legible.
    id: 'th-casey-old',
    contact: 'Casey ♡',
    detail: 'No messages sent since 2023',
    messages: [
      {
        from: 'quinn',
        body: 'you can’t skip the funeral planning and then tell ME i’m the one who left.',
        when: 'Nov 4, 2023',
      },
      {
        from: 'quinn',
        body: 'mom asked where you were today. i didn’t have an answer. i made one up. it was a good one, you’d have liked it.',
        when: 'Nov 9, 2023',
      },
      { from: 'quinn', body: 'fine.', when: 'Nov 20, 2023' },
      { from: 'quinn', body: 'XZHVB. KOVZHV.', when: 'Jan 2, 2024' },
      // The old words. Garbage until the cipher is cracked; then it's the
      // question Casey never answered — and the burner gate's answer.
      { from: 'quinn', body: 'HGROO TZNV?', when: 'Mar 8, 2024' },
    ],
  },
  {
    id: 'th-dae',
    contact: 'Dae 🌙',
    messages: [
      {
        from: 'them',
        body: 'wait. you still name every password after that dumb bird??',
        when: 'Sep 21, 6:02 PM',
      },
      {
        from: 'quinn',
        body: 'he was a GOOD bird. and no. now it’s him plus the year we lost the house. grief-based security. unbreakable.',
        when: 'Sep 21, 6:04 PM',
      },
      {
        from: 'them',
        body: 'your entire security model is a eulogy. love that for you.',
        when: 'Sep 21, 6:04 PM',
      },
      { from: 'them', body: 'lunch? you’ve been WEIRD.', when: 'Oct 5, 11:38 AM' },
      {
        from: 'quinn',
        body: 'can’t. month-end. numbers don’t close themselves.',
        when: 'Oct 5, 12:10 PM',
      },
      {
        from: 'quinn',
        body: 'hey. if i ever go quiet, water my plants. joking. mostly.',
        when: 'Oct 10, 11:47 PM',
      },
      { from: 'them', body: 'that’s not funny??? call me', when: 'Oct 10, 11:52 PM' },
      {
        from: 'them',
        body: 'locked out of your own cloud AGAIN. incredible. new pin, again??',
        when: 'Sep 14, 3:22 PM',
        visibleWhen: ['night6'],
      },
      {
        from: 'quinn',
        body: 'reset it. everything’s mom now — where she is. i won’t forget where she is.',
        when: 'Sep 14, 3:29 PM',
        visibleWhen: ['night6'],
      },
      { from: 'them', body: 'quinn.', when: 'Oct 12, 8:15 AM' },
      { from: 'them', body: 'they found your car. tell me this is one of your jokes. tell me right now.', when: 'Oct 12, 9:03 AM' },
      { from: 'them', body: 'i called the tip line 4 times. the sheriff told me to STOP CALLING. what kind of', when: 'Oct 14, 2:20 PM' },
      { from: 'them', body: 'i’m watering your plants. you’re coming back for them. that’s the deal.', when: 'Oct 17, 1:12 AM' },
    ],
    // Once the phone is unlocked, Dae sees the read receipts change. She is
    // the in-fiction hint channel: after this script, the thread shows
    // "Ask Dae about…" chips driven by gates.ts nudges (see MessagesScreen).
    live: {
      trigger: 'phoneUnlocked',
      steps: [
        { kind: 'them', body: 'my messages just went to READ. who is this.', delayMs: 4000 },
        {
          kind: 'choice',
          options: [
            { label: 'It’s Casey. Quinn’s sister. Her phone was mailed to me.' },
            { label: 'A friend. I’m trying to find out what happened to her.' },
          ],
        },
        {
          kind: 'them',
          body: 'casey. she talked about you like a phantom limb. ok. i don’t think she jumped. nobody who jokes about plants jumps. ask me anything — i knew her best.',
          delayMs: 2500,
        },
        { kind: 'end' },
      ],
    },
  },
  {
    // The affair that wasn't. Reads like an affair with a married man in
    // act 1; the act-2 messages start leaking the truth.
    id: 'th-m',
    contact: 'M 🌊',
    messages: [
      { from: 'them', body: 'same booth. don’t park in the lot this time.', when: 'Sep 12, 7:31 PM' },
      { from: 'quinn', body: 'he almost saw the folder today. i want to stop.', when: 'Sep 26, 10:14 PM' },
      {
        from: 'them',
        body: 'you can’t tell anyone about us. especially not him. we’re so close.',
        when: 'Sep 26, 10:16 PM',
      },
      { from: 'them', body: 'after this it’s done, i promise. you’re almost out.', when: 'Oct 8, 9:02 PM' },
      {
        from: 'them',
        body: 'the second set. he thinks nobody reads the ledger twice. you read it twice. that’s why it has to be you.',
        when: 'Oct 9, 8:47 PM',
        visibleWhen: ['act2'],
      },
      {
        from: 'them',
        body: 'the FOIA came back. it’s enough. one last meeting and you never have to see me again.',
        when: 'Oct 10, 6:15 PM',
        visibleWhen: ['act2'],
      },
      {
        from: 'quinn',
        body: 'tell eli’s wife before it prints. she earned that.',
        when: 'Oct 10, 6:20 PM',
        visibleWhen: ['act2'],
      },
    ],
  },
  {
    id: 'th-marcus',
    contact: 'Marcus Halloway',
    messages: [
      {
        from: 'them',
        body: 'We need to talk about what you took from the office. Before he finds out. I mean it, Quinn.',
        when: 'Oct 9, 4:55 PM',
      },
      {
        from: 'them',
        body: 'You were in the file room Tuesday after close. I signed the log as me. That’s twice now.',
        when: 'Oct 10, 8:12 PM',
        visibleWhen: ['night6'],
      },
      // Recovered from cloud trash in act 3: Marcus was never the villain.
      {
        from: 'them',
        body: '[recovered · deleted by account owner · Oct 11, 11:59 PM] I know what my father did to the Soto reports. I’ve been copying them too. If you go public I’ll testify. Whatever you decide — I’m sorry I was a coward first.',
        when: 'Oct 11, 11:58 PM',
        visibleWhen: ['cloudRestored'],
      },
    ],
  },
  {
    // T. No name, no number saved. The fixer.
    id: 'th-t',
    contact: 'T',
    detail: 'Unknown number',
    messages: [
      { from: 'them', body: 'nice sweater today. blue suits you.', when: 'Sep 30, 8:12 PM' },
      { from: 'them', body: 'the marina office has cameras, you know.', when: 'Oct 4, 11:45 PM' },
      {
        from: 'them',
        body: 'nice parking job.',
        when: 'Oct 4, 11:47 PM',
        visibleWhen: ['night8'],
      },
      { from: 'them', body: 'give back what you took and all of this stops.', when: 'Oct 7, 9:21 PM' },
      { from: 'them', body: 'saw you at the office after hours. last warning.', when: 'Oct 11, 10:38 PM' },
    ],
    // Night 5 cliff: the watcher noticed the reading. He knows the phone
    // opened the ledgers — which means he can see more than a dead number.
    live: {
      trigger: 'booksDone',
      steps: [
        { kind: 'them', body: 'you opened the books.', delayMs: 9000 },
        {
          kind: 'them',
          body: 'quinn couldn’t leave the numbers alone either. look how that ended.',
          delayMs: 3500,
        },
        {
          kind: 'them',
          body: 'box. marina office. by friday. after that i stop charging by the hour.',
          delayMs: 3000,
        },
        {
          kind: 'choice',
          options: [{ label: '[ Don’t reply ]', setsFlag: 'night6' }],
        },
        {
          waitFor: 'valeNamed',
          kind: 'them',
          body: 'asking the waterfront about me now.',
          delayMs: 10000,
        },
        {
          kind: 'them',
          body: 'quinn learned this at the end: going dark doesn’t hide you. it just tells me what you’re holding.',
          delayMs: 4000,
        },
        { kind: 'end' },
        // after this: nothing. his silence is the cliff.
      ],
    },
  },
  {
    id: 'th-pharm',
    contact: 'Slater’s Pharmacy',
    messages: [
      {
        from: 'them',
        body: 'Rx #7741 is ready for pickup. Balance due: $214.60 (insurance declined). Reply STOP to opt out.',
        when: 'Oct 6, 2:00 PM',
      },
      {
        from: 'them',
        body: 'Reminder: Rx #7741 will be restocked in 7 days if not collected.',
        when: 'Oct 13, 2:00 PM',
      },
    ],
  },
  {
    // Rosa Soto. Cold in the archive (Quinn approached her; she refused),
    // live once the Marcus restore proves someone is really digging. Her
    // test answer lives inside the memorial-flyer photo. Her cliff names
    // the "tide book" — the breadcrumb that later makes tidewater.ledger@
    // click into place.
    id: 'th-rosa',
    contact: 'Rosa Soto',
    visibleWhen: ['cloudRestored'],
    messages: [
      {
        from: 'them',
        body: 'Stop calling me. Whatever Halloway sent you to say, the answer is no.',
        when: 'Aug 19, 2:11 PM',
      },
      {
        from: 'quinn',
        body: 'I’m not with them. I keep their books and I found something about the water at Bed 7. Ten minutes. Please.',
        when: 'Aug 19, 2:40 PM',
      },
      {
        from: 'them',
        body: 'My husband is dead, Ms. Mercer. Ten minutes doesn’t fix arithmetic.',
        when: 'Aug 19, 3:05 PM',
      },
    ],
    live: {
      trigger: 'cloudRestored',
      steps: [
        {
          kind: 'them',
          body: 'this number lit up again two days ago. i told myself i wouldn’t ask.',
          delayMs: 8000,
        },
        {
          kind: 'them',
          body: 'if you’re halloway, stop. if you’re police, you know where i live. if you’re the sister — she said you existed — then prove you’re holding HER phone. what’s printed under my husband’s name, on the flyer in the seamen’s hall window. every word.',
          delayMs: 4000,
        },
        {
          kind: 'freetext',
          gateId: 'rosa',
          wrong: 'every word. or don’t write back.',
        },
        { kind: 'them', body: 'okay.', delayMs: 3000 },
        {
          kind: 'them',
          body: 'he called me from the boat the morning he died. i kept it. and the police “lost” two pages of their own report — i photographed them at the front desk while the deputy got coffee. quinn is the only other person who ever saw these. now you.',
          delayMs: 4500,
        },
        {
          kind: 'them',
          body: 'check the phone. i sent everything to her mail. don’t make me regret the one brave thing i’ve done all year.',
          delayMs: 3000,
        },
        {
          kind: 'choice',
          options: [{ label: 'You won’t regret it. I promise.' }],
        },
        {
          kind: 'them',
          body: 'one more thing. she called me the night before they found her car. i didn’t pick up. the message said: if anything happens, the tide book is still there. TIDE BOOK. you’re her sister. what is a tide book?',
          delayMs: 5000,
        },
        {
          kind: 'choice',
          options: [{ label: 'I don’t know yet. But I’ll find it.', setsFlag: 'night8' }],
        },
        { kind: 'end' },
      ],
    },
  },
  {
    // NO CALLER ID — T, live, once the player starts digging.
    id: 'th-nocaller',
    contact: 'NO CALLER ID',
    messages: [],
    visibleWhen: ['act2'],
    live: {
      trigger: 'act2',
      steps: [
        { kind: 'them', body: 'that phone went dark six days ago. now it reads its mail. interesting.', delayMs: 8000 },
        {
          kind: 'them',
          body: 'whoever you are: seal it in a box, mail it to the marina office, walk away. there’s money in it for you. there’s worse in it if not.',
          delayMs: 3000,
        },
        {
          kind: 'choice',
          options: [
            { label: 'Who is this?' },
            { label: 'Come and get it.' },
            { label: '[ Don’t reply ]', goto: 4 },
          ],
        },
        { kind: 'them', body: 'wrong answer.', delayMs: 2000 },
        { kind: 'end' },
      ],
    },
  },
  {
    // Mara, live. She noticed the same thing T did. Her trust is a gate.
    id: 'th-mara',
    contact: 'Unknown · (360) 555-0177',
    messages: [],
    visibleWhen: ['act2'],
    live: {
      trigger: 'act2',
      steps: [
        {
          kind: 'them',
          body: 'You just logged into her mail. I watch that account for a living. If you’re police, say so. If you’re him, I’m already gone.',
          delayMs: 6000,
        },
        {
          kind: 'them',
          body: 'If you’re someone who loved her: prove you’ve read what she read. The September AP batch. Two invoices, same day, same amount. One payee is real. Type the name of the one that isn’t.',
          delayMs: 3000,
        },
        {
          kind: 'freetext',
          gateId: 'mara1',
          wrong: 'Wrong. You skimmed. She didn’t risk everything for a skimmer. Read the invoices again — both of them.',
        },
        {
          kind: 'them',
          body: 'Okay. Okay. My name is Mara Reyes. I’m a reporter. Quinn was my source, and the story is real, and it is not done. I just sent her backup what I have. Read it, then we talk about what happens to the Halloways.',
          delayMs: 2500,
        },
        {
          kind: 'choice',
          options: [{ label: 'I’ll read all of it.', setsFlag: 'night5' }],
        },
        {
          kind: 'them',
          body: 'Three files. The lab’s own ledger, the county’s shelf, and the shell company. Quinn could read them. Can you?',
          delayMs: 2500,
        },
        {
          kind: 'them',
          body: 'When you can name the first report they touched — the number, not vibes — text it to me. Until then I’m writing around a hole.',
          delayMs: 3000,
        },
        {
          kind: 'freetext',
          gateId: 'mara2',
          wrong: 'No. Numbers or nothing.',
        },
        {
          kind: 'them',
          body: 'R-1147. Bed seven. April. He walked into that water eleven days after the lab said nobody should. The story has its spine now — and whoever built that shelf isn’t done with you. Keep reading.',
          delayMs: 4000,
        },
        {
          waitFor: 'night8',
          kind: 'them',
          body: 'Rosa Soto talked to you. ROSA SOTO. Okay. Listen. The story has a spine, the report has a signature — but legal wants a name on the surveillance. The man who watched your sister for six weeks is a pattern, Casey. Patterns keep schedules. Schedules have names.',
          delayMs: 6000,
        },
        {
          kind: 'them',
          body: 'Find me the name. One word. I can’t print “T.”',
          delayMs: 2500,
        },
        {
          kind: 'freetext',
          gateId: 'vale',
          wrong: 'Not a guess. A name I can pin to a photograph.',
        },
        {
          kind: 'them',
          body: 'Terrence Vale. Twenty-two years of harbor patrol, walks into Halloway’s the same month the shell company is born. I have his pension record and his parking spot. He’s real, he’s paid, and he’s about to be famous. If he texts you again — do not answer.',
          delayMs: 4500,
        },
        {
          kind: 'choice',
          options: [{ label: 'He gave me until Friday.', setsFlag: 'night9' }],
        },
        {
          kind: 'them',
          body: 'Then we work until Thursday. — M',
          delayMs: 2500,
        },
        { kind: 'end' },
      ],
    },
  },
  {
    // Sheriff Dunmore, live in act 3. The trap door ending.
    id: 'th-dunmore',
    contact: 'Sheriff R. Dunmore',
    messages: [],
    visibleWhen: ['act3'],
    live: {
      trigger: 'act3',
      steps: [
        {
          kind: 'them',
          body: 'Ms. Mercer — Casey. Roy Halloway’s office says someone up north signed for a package in your name. If you are in possession of your sister’s phone, that is evidence in an open case. Bring it in. We’ll take it from here.',
          delayMs: 20000,
        },
        {
          kind: 'choice',
          options: [
            { label: 'Bring the phone to the station', goto: 2 },
            { label: '[ Delete his number ]', goto: 4 },
          ],
        },
        {
          kind: 'them',
          body: 'Good. Side door, after six. No need to make a circus of it. Kind of you to be reasonable — grief makes people imaginative.',
          delayMs: 2500,
        },
        {
          kind: 'choice',
          options: [
            { label: 'Hand it over. It’s his case.', setsFlag: 'ending4' },
            { label: 'No. Something is wrong here.', goto: 4 },
          ],
        },
        { kind: 'end' },
      ],
    },
  },
  {
    // The burner. Appears only after the draft is decoded. Everything ends here.
    id: 'th-burner',
    contact: 'Unknown · ···-0412',
    messages: [],
    visibleWhen: ['draftDecoded'],
    live: {
      trigger: 'draftDecoded',
      steps: [
        {
          kind: 'freetext',
          gateId: 'burner',
          echo: 'still game',
          wrong: 'Wrong number.',
        },
        { kind: 'them', body: '…', delayMs: 6000 },
        { kind: 'them', body: 'hi, bird.', delayMs: 4000 },
        {
          kind: 'them',
          body: 'you actually did it. i hoped and i was terrified, both. i’m safe. i can’t say more unless you already know it. what happens now is the only choice that ever mattered:',
          delayMs: 3000,
        },
        // 4 — the choice. Confirms are IN-FICTION (Quinn asks to be sure);
        // every resolved branch flows to 13, the reopen beat, so the player
        // can pursue the other endings without any menu.
        {
          kind: 'choice',
          options: [
            { label: 'I’m sending everything to Mara. All of it.', goto: 5 },
            { label: 'I’ll burn it. Stay a ghost. Stay safe.', goto: 8 },
            { label: 'I know where you are. I’m coming.', goto: 11 },
          ],
        },
        // 5-7 — loud
        {
          kind: 'them',
          body: 'say it plain. no taking it back. she prints everything — the town, the sheriff, our name next to eli’s in the paper.',
          delayMs: 2500,
        },
        {
          kind: 'choice',
          options: [
            { label: 'Send it. All of it. This ends loud.', setsFlag: 'ending1', goto: 13 },
            { label: 'Wait. Not yet.', goto: 4 },
          ],
        },
        { kind: 'end' },
        // 8-10 — quiet
        {
          kind: 'them',
          body: 'you’re sure. i stay dead. you grieve me in public for the rest of your life, and mom never knows.',
          delayMs: 2500,
        },
        {
          kind: 'choice',
          options: [
            { label: 'Burn it. Stay a ghost. Stay safe.', setsFlag: 'ending2', goto: 13 },
            { label: 'Wait. Not yet.', goto: 4 },
          ],
        },
        { kind: 'end' },
        // 11-12 — the town gate (ending3 via the gate's flag)
        {
          kind: 'them',
          body: 'if you really know, you don’t have to say the town to me. say it to the phone. it’s been listening this whole time anyway.',
          delayMs: 3000,
        },
        {
          kind: 'freetext',
          gateId: 'town',
          wrong: 'if you don’t know, don’t guess. guessing gets people found by the wrong ones. the envelope knows. the boat knows. the flowers know.',
        },
        // 13-14 — the reopen: fires after any ending's epilogue closes
        {
          kind: 'them',
          body: '…still there? it doesn’t feel finished. the other doors are still on the table.',
          delayMs: 2500,
        },
        {
          kind: 'choice',
          options: [
            { label: 'I’m sending everything to Mara. All of it.', goto: 5 },
            { label: 'I’ll burn it. Stay a ghost. Stay safe.', goto: 8 },
            { label: 'I know where you are. I’m coming.', goto: 11 },
          ],
        },
        { kind: 'end' },
      ],
    },
  },
];

export const threadById = (id: string): Thread => {
  const t = THREADS.find((x) => x.id === id);
  if (!t) throw new Error(`unknown thread: ${id}`);
  return t;
};
