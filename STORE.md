# App Store Connect — Last Seen: Widow's Point

Everything needed for the 1.0 submission. Character limits noted; counts
verified against the drafts below.

---

## Identity

| Field | Value | Limit |
|---|---|---|
| App name | `Last Seen: Widow's Point` | 30 (uses 24) |
| Subtitle | `A found-phone detective story` | 30 (uses 29) |
| Bundle ID | `com.simonshih.lastseen` | — |
| App ID (Developer portal) | `N3GKXG8TS3` | — |
| ASC app id | `6803071651` | — |
| SKU | `lastseen-widowspoint-001` | — |
| Primary category | Games → Puzzle | — |
| Secondary category | Games → Adventure | — |
| Price | Free | — |
| In-app purchase | `ls_story_unlock` — non-consumable, **$5.99** (ASC id `6803075412`) | — |
| IAP display name | `The Full Story` | 30 (uses 14) |
| IAP description | `Nights three to twelve, and all four endings.` | **55** (uses 45) |

**Why Puzzle over Adventure as primary:** the audience that buys hard
cryptogram/deduction games browses Puzzle. Adventure is where narrative
games get lost among platformers.

**How this maps in the API:** a game's category is `GAMES` with up to two
*sub*categories — there is no separate "secondary category" for games.
Set as `primaryCategory=GAMES`, `primarySubcategoryOne=GAMES_PUZZLE`,
`primarySubcategoryTwo=GAMES_ADVENTURE`. Passing `GAMES_PUZZLE` as
`primaryCategory` is rejected with `ENTITY_ERROR.RELATIONSHIP.INVALID`.

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

**CORRECTED 2026-08-19 — this section previously said "Data Not Collected,
answer No to everything." That is wrong and would have been a false
declaration.**

The app makes no network calls of its own, but RevenueCat does, and it
*retains* what it receives so that Restore purchase works. Retention beyond
servicing the request in real time is Apple's definition of collection.
"Data Not Linked to You" is a sub-classification of **collected** data — it
still must be declared. The exemption that allows skipping disclosure
requires collection to be infrequent, optional and outside core
functionality; a purchase is core functionality.

Answer **Yes, we collect data**, then declare:

| Category | Type | Linked to identity | Tracking | Purpose |
|---|---|---|---|---|
| Purchases | Purchase History | No | No | App Functionality |
| Identifiers | User ID | No | No | App Functionality |

"Not linked" is accurate: `proAccess.ts` calls `Purchases.configure({ apiKey })`
with no `appUserID`, so RevenueCat generates a random anonymous id per
install. No account, no name, no email, nothing tying it to a person.

The *User ID* row is a judgement call — the id is RevenueCat's, not one we
assign. Declare it anyway; over-declaring costs a line on the store page,
under-declaring gets apps rejected.

Everything else is genuinely **not collected**: no analytics, no ads, no
crash reporting, no contacts/photos/location/microphone, no browsing or
usage data. The privacy policy already matches this declaration exactly.
Answer "No" to every collection question.

---

## Age rating questionnaire

Answers below are the honest ones. **Apple's 2026 matrix computes these
to 9+ (`NINE_PLUS`), not the 12+ this file originally predicted** — two
"Infrequent/Mild" answers no longer reach 12+. Brazil self-rates 12.

Open question for Simon: whether to voluntarily raise it via
`ageRatingOverrideV2` (Apple lets you rate *up*, never down). The premise
is a presumed suicide plus stalking, and a rating that reads low for the
content is itself a rejection risk. Do not change the answers below to
force a number — that is a misrepresentation; use the override.

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

## Screenshots — UPLOADED 2026-08-19

Five shots at **1320 × 2868**, uploaded to display type `APP_IPHONE_67`,
all `COMPLETE`. Files in `assets/store/screenshots/`. Nothing past Night II,
so the store gives away nothing:

1. `01-lockscreen.png` — the photo strip wallpaper and keypad. The premise in one image.
2. `02-home.png` — the BrineOS home screen with badge counts. Sells "this is a real phone."
3. `03-photos.png` — the photo grid, 21 thumbnails; the evidence is in here.
4. `04-messages.png` — a thread mid-conversation, so the format reads instantly.
5. `05-voicemail.png` — play button plus transcript. Shows the production value.

A decoder shot (ciphertext mid-solve) was planned as #5 and never taken; it
is the obvious sixth if we want to sell the difficulty harder. Optional
caption overlays, in the game's own voice, if we add them later.

---

## What is already live on App Store Connect (2026-08-19)

App record `6803071651` exists and is `PREPARE_FOR_SUBMISSION`. Set via the
API from this file — do not re-enter by hand:

- name, subtitle, privacy policy URL, support URL
- categories (GAMES / Puzzle / Adventure)
- version string `1.0.0`
- description, keywords, promotional text
- price schedule: **Free**, base territory USA
- content rights: does not use third-party content
- age rating declaration (computes to 9+ — see above)
- 5 screenshots at `APP_IPHONE_67`
- App Review notes, stored **byte-for-byte identical** to this file
- IAP `ls_story_unlock`: non-consumable, $5.99, 175 territories, localized,
  review screenshot attached — **`READY_TO_SUBMIT`**

**Still outstanding:**

1. **App Privacy nutrition labels** — not settable through the public API.
   Simon, in the ASC website. Answer "No" to every collection question.
2. **The build** — none uploaded yet.
3. ~~Sandbox purchase test~~ — **PASSED 2026-08-19 on the iPhone 11 Pro Max
   (iOS 26.6).** Bought `ls_story_unlock` in sandbox: the paywall dismissed,
   the mailbox opened, and the unlock **survived a force-quit**, which is
   what proves the entitlement came back from RevenueCat rather than an
   in-memory flag. No errors.

### RevenueCat (done 2026-08-19)

Project `f443c37e`. App credentials both report *Valid credentials*: In-App
Purchase key `74AP8H7329`, App Store Connect API key `84UF5N584V`.
Entitlement `story` holds product `ls_story_unlock`; offering `default` is
**current** and carries package `$rc_lifetime`. Verified by asking
RevenueCat's own API with the shipped public key, which is what the SDK
does:

```
current_offering_id = "default"
packages            = [$rc_lifetime -> ls_story_unlock]
```

The IAP review screenshot is `assets/store/iap/iap-review-paywall.png`,
captured from the real paywall on the iPhone 16 Pro Max simulator with the
live key in the build.

### Signing: device builds need the EXPLICIT profile

Automatic signing picks the **team wildcard** profile
(`iOS Team Provisioning Profile: *`, entitlement `75ULC33H2C.*`), because
nothing in the target forces an explicit one. **Wildcard App IDs cannot do
In-App Purchase**, so a sandbox purchase fails in a wildcard-signed build no
matter how correct the RevenueCat keys are.

Explicit profile created 2026-08-19 — **"Last Seen Dev Explicit"**, id
`Z273W55AHG`, uuid `7e867721-d737-4571-82a4-21ea7c6ebfd9`, expires
2027-08-19, covering App ID `N3GKXG8TS3`, dev cert `G25897LJRZ` and all four
registered devices. Build against it with:

```
DEVELOPMENT_TEAM=75ULC33H2C \
CODE_SIGN_STYLE=Manual \
PROVISIONING_PROFILE_SPECIFIER="Last Seen Dev Explicit" \
CODE_SIGN_IDENTITY="Apple Development: Simon Shih (D4MS9M6QY5)"
```

Verify it took by reading the built app's embedded profile — the
`application-identifier` entitlement must be
`75ULC33H2C.com.simonshih.lastseen`, **not** `75ULC33H2C.*`.

The App Store export is unaffected; distribution profiles are always
explicit.

## Version / build

- Version `1.0.0`, build increments each upload.
- `ITSAppUsesNonExemptEncryption: false` is already set in app.json.
- Ships iPhone-only, portrait-only, dark by design.
