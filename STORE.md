# App Store Connect — Last Seen: Widow's Point

Everything needed for the 1.0 submission. Character limits noted; counts
verified against the drafts below.

---

## Identity

| Field | Value | Limit |
|---|---|---|
| App name | `Last Seen: Widow's Point` | 30 (uses 24) |
| Subtitle | `A found-phone detective story` | 30 (uses 29) |
| Bundle ID | `com.lastseen.app` | — |
| SKU | `lastseen-widowspoint-001` | — |
| Primary category | Games → Puzzle | — |
| Secondary category | Games → Adventure | — |
| Price | Free | — |
| In-app purchase | `ls_story_unlock` — non-consumable, **$5.99** | — |

**Why Puzzle over Adventure as primary:** the audience that buys hard
cryptogram/deduction games browses Puzzle. Adventure is where narrative
games get lost among platformers.

---

## Promotional text (170 max — editable without review)

> Twelve nights. One phone. Everyone says she jumped from Widow's Point.
> Her messages, photos and voicemails say something else, if you can get
> past her locks.

*(163 characters)*

---

## Description (4000 max)

> Six days after your sister vanished from a small fishing town, her phone
> arrives in your mailbox. No note. No explanation. Just her lock screen,
> her unread messages, and a town that has already decided what happened
> to her.
>
> LAST SEEN is a detective story told entirely through a phone. There is no
> map, no inventory, no detective interface. You read her texts, listen to
> her voicemails, dig through her photos and her mail, and assemble the
> truth the way she did — out of documents that were never meant to be
> read together.
>
> The people in her life are still texting. Her best friend wants to know
> who you are. A reporter wants proof you can be trusted. A man with no
> name has been watching her for six weeks and has noticed you.
>
> TWELVE NIGHTS
> The story unfolds across twelve chapters, each ending somewhere you did
> not expect. Finish one and the next begins immediately — no waiting, no
> timers, no energy meters.
>
> PUZZLES THAT EXPECT SOMETHING OF YOU
> Thirteen locks stand between you and the end, and not one of them can be
> solved from a single screen. A password hides across three apps. A code
> two children invented is scattered over a burnt page and an unanswered
> message. One night is nothing but a forged document, waiting for you to
> notice which letter changed.
>
> AND A HINT SYSTEM THAT IS A PERSON
> When you are stuck, text Dae. She knew your sister better than anyone,
> and she will point you at the right corner of the world without ever
> handing you the answer.
>
> FOUR ENDINGS
> How this ends is the last thing you decide, and you will have to decide
> it knowing exactly what it costs.
>
> • Play offline. No accounts, no ads, no tracking, nothing collected.
> • Full voice performances with on-screen transcripts throughout.
> • The first two nights are free. One purchase unlocks the rest, forever.

---

## Keywords (100 max, comma-separated, no spaces)

```
mystery,detective,puzzle,cipher,crime,thriller,story,noir,text,investigation,codebreaking,narrative
```

*(99 characters)*

Deliberately excluded: "game", "app", "free" (wasted characters — Apple
already indexes the title, subtitle and category).

---

## URLs

| Field | Value |
|---|---|
| Support URL | `https://texas0418.github.io/last-seen-support/` |
| Marketing URL | *(optional — leave blank for 1.0, or a simonbuilds.app page later)* |
| Privacy Policy URL | `https://texas0418.github.io/last-seen-privacy/` |

---

## Privacy nutrition label

**Data Not Collected** — every category. The app has no network calls of
its own; the only third party is RevenueCat, which receives an anonymous
purchase receipt and a random identifier and is disclosed in the policy.
Answer "No" to every collection question.

---

## Age rating questionnaire

Recommended outcome: **12+**

| Question | Answer | Why |
|---|---|---|
| Cartoon or Fantasy Violence | None | |
| Realistic Violence | None | No violence is depicted; a workplace death is discussed after the fact |
| Prolonged Graphic/Sadistic Violence | None | |
| Profanity or Crude Humor | None | No profanity in the script |
| Mature/Suggestive Themes | **Infrequent/Mild** | A presumed suicide drives the premise; grief, stalking, corporate negligence causing a death |
| Horror/Fear Themes | **Infrequent/Mild** | Surveillance and menace, no horror imagery |
| Alcohol, Tobacco, Drug Use | None | Prescription medication for a parent's dementia is mentioned |
| Sexual Content or Nudity | None | An affair is implied, then revealed to be a cover story |
| Gambling | None | |
| Contests | None | |
| Unrestricted Web Access | No | |
| User Generated Content | No | |

---

## App Review notes  ⚠️ THE CRITICAL FIELD

**A reviewer cannot progress past the first screen without a puzzle
answer.** Paste this verbatim.

```
Last Seen is a narrative puzzle game. The entire app is presented as a
missing person's phone, and progress requires solving puzzles from clues
scattered across the in-game apps. This is the intended experience, not a
malfunction — but it means the app cannot be evaluated without the
answers below. There is no login, no account, and no network connection
required. The app works fully offline in airplane mode.

FULL SOLUTION, IN ORDER

1.  Lock screen passcode: 2008
2.  Mail sign-in (personal account): ozzy2014
3.  Text to "Unknown (360) 555-0177": coastal remediation
    Then tap the reply option "I'll read all of it."
4.  Text to the same number: r1147
    Then open the "T" conversation and tap "[ Don't reply ]"
5.  Settings > Cloud trash, PIN: 0214
6.  Text to "Rosa Soto": the water doesn't forgive
    Then tap "I don't know yet. But I'll find it."
7.  Text to "Unknown (360) 555-0177": vale
    Then tap "He gave me until Friday."
8.  Mail > second tab (tidewater.ledger) sign-in: doramae1991
9.  Text to "Unknown (360) 555-0177": r halloway
    Then tap "Understood."
10. Text to "Unknown (360) 555-0177": tidepool florals
    Then tap "It's in our language. I'll read it alone."
11. Mail > tidewater.ledger > Drafts > "Draft — never sent"
    This is a substitution cipher solved by hand. The alphabet is
    reversed: A=Z, B=Y, C=X, D=W, E=V, F=U, G=T, H=S, I=R, J=Q, K=P,
    L=O, M=N. Tap a letter in the message, then tap its true letter on
    the keyboard below. All letters must be filled in.
12. Text to "Unknown ...-0412": still game
13. For the fourth ending, text to the same number: kestrel bay

IN-APP PURCHASE
There is one non-consumable purchase (ls_story_unlock) after the second
chapter, which unlocks chapters 3-12. In the review build it can be
tested through the sandbox as normal.

CONTENT NOTE
The story's premise is that a woman is presumed to have died by suicide.
The plot's central reveal, roughly two thirds through, is that she did
NOT die — she staged her disappearance to escape a man hired to
intimidate her after she reported a workplace death. The game does not
depict suicide, self-harm, or violence at any point. It is a mystery in
the tradition of an epistolary detective novel.

ACCESSIBILITY
All voicemails have on-screen transcripts, all photographs and documents
carry written descriptions for VoiceOver, and the app honors Dynamic
Type.

Thank you for reviewing.
```

---

## Screenshots (6.7" required — 1290 × 2796)

Nothing past Night II, so the store gives away nothing:

1. **Lock screen** — the photo strip wallpaper and keypad. The premise in one image.
2. **A message thread** — Dae's, mid-conversation, so the format reads instantly.
3. **The photo grid** — 21 thumbnails; sells "a real phone, and the evidence is in here."
4. **A voicemail** — play button plus transcript. Shows the production value.
5. **The decoder** — ciphertext mid-solve. Sells the difficulty to the audience that wants it.

Optional caption overlays, in the game's own voice, if we add them later.

---

## Version / build

- Version `1.0.0`, build increments each upload.
- `ITSAppUsesNonExemptEncryption: false` is already set in app.json.
- Ships iPhone-only, portrait-only, dark by design.
