# LAST SEEN: Widow's Point — Complete Walkthrough (v1)

**⚠️ TOTAL SPOILERS.** Designer's walkthrough: every gate, every clue with
its exact location, and the inference chain a player must walk. Companion to
DESIGN.md (which holds ground truth); this is the player-side view.

---

## Gate 1 — The lock screen · answer: `2008`

**Where you're stuck:** a 4-digit keypad, one wallpaper, three notification
previews. Wrong tries get "Attempt logged." — atmosphere, never a hint.

**The clues:**
1. **Intro narration (beat 5):** "She set every PIN to the best day. She
   never said which." — establishes the *scheme*: the code is a date that
   mattered, and the phone won't say more.
2. **The wallpaper itself:** the photo-booth strip. Tapping it opens the
   zoomable viewer (the game's one taught gesture). The strip's bottom
   border carries a tiny print line: `© BRENNAN CO. FAIR — SOUVENIR STRIP —
   2008`.
3. **Corroboration (found later, in Photos):** the same strip appears in the
   camera roll captioned "the best day" — closing the loop with the intro's
   exact phrase.

**The chain:** the intro says the PIN is "the best day" → the only thing on
the lock screen is a photo of a day → look INSIDE the photo → the year is
printed where a real photo booth prints it. Type `2008`.

**Why it's fair:** one inference (day → year printed on the souvenir), one
gesture the hint line teaches ("tap to look closer"). It exists to teach
that photos contain evidence at zoom level — every later photo puzzle
depends on the player having learned this here.

---

## Gate 2 — The personal mail password · answer: `ozzy2014` (also accepts `ozzyking2014`)

**Where you're stuck:** Mail app, Quinn's personal account, "Enter
password." This is the paywall gate and the first real three-surface hunt.

**The clues:**
1. **Messages → Dae 🌙, scroll up to Sep 21:** Dae: "wait. you still name
   every password after that dumb bird??" Quinn: "he was a GOOD bird. and
   no. now it's him plus the year we lost the house. he guards everything."
   — this is the *scheme*: `<bird's name><year the house was lost>`. Note
   what it does NOT give you: the name, or the year.
2. **Photos → the budgie:** sky-blue parakeet on a curtain rod, caption
   "Ozzy. King." — the name. (The caption reads as name + joke title; the
   gate accepts the `ozzyking` reading too, because a correct deduction must
   never bounce on formatting.)
3. **Voicemail → Mom, Oct 2, 2026:** "…I was thinking about the wisteria at
   Alder Street — twelve years this fall since we lost that house, can you
   believe it…" — the year, hidden in grief-adjacent rambling, as
   arithmetic: the voicemail row is dated **2026**, so *twelve years this
   fall* → **2014**.

**The chain:** banter names the scheme → camera roll names the bird → Mom's
voicemail dates the house, but only relative to now → 2026 − 12 = 2014 →
`ozzy2014`.

**Why it's hard:** three surfaces (Messages, Photos, Voicemail), none of
which look like clues when first read; the year never appears as a number
anywhere; the arithmetic anchor (2026) has to be noticed on the timestamps.
**The hint path:** texting Dae ("ask about her email password") escalates
exactly twice — "her passwords were always a eulogy…" then "the bird has a
name in her camera roll. the house has a year in your mother's voice. put
them together, no space." Never the answer.

---

## Gate 3 — Mara's test · answer: `coastal remediation`

**Where you're stuck:** after act 2 opens, "M 🌊" texts the phone live —
she doesn't know who's holding it. She'll only engage if the holder proves
they've read what Quinn read: "What name do the second invoices bill to?"

**The clues:**
1. **Mail → "Fwd: AP batch — September":** the attachment shows two
   invoices, same date, same amount ($4,800): Brennan Analytical (water
   testing) and **Coastal Remediation LLC** ("consulting — resample &
   filing"). The twin structure IS the fraud; the payee is the answer.
2. **Context that makes it findable:** the act-2 M texts ("the FOIA came
   back", "tell eli's wife first") have just collapsed the affair herring,
   so the player is re-reading the money trail when Mara asks.

**The chain:** Mara's question quotes Quinn's own phrase ("the second
invoices") → the only document with paired invoices is the AP batch →
the second payee's name, typed back to her.

**Why it's fair:** the answer legitimately exists in evidence (this is a
comprehension check, not a hunt) — it's the game teaching that *documents
matter*, priming the deeper document work later. Wrong answers cool her off
with in-fiction suspicion, not error copy.

---

## Gate 4 — The tidewater login · answer: `doramae1991`

**Where you're stuck:** Mail's second tab: `tidewater.ledger@pelicanmail.com`,
signed out. The login shows a password field and a hint — and the hint is
gibberish: `gsv ylzg. dsvm sv dzh ylim.`

**The clues (three independent chains that must all converge):**

*Chain A — the account exists:*
1. **Mail → system email "Storage 90% full":** lists both addresses.
2. **Settings → Mail accounts:** `tidewater.ledger` — "Signed out — added
   Jun 2026, never synced to cloud."

*Chain B — the cipher:*
3. **Photos → the torn chart:** a burnt half-page, crayon title "THE GAME —
   RULE 1: never write the real thing.", then pencil pairs `A—Z  B—Y  C—X`
   — and the fire eats the rest. Three pairs, generalize: the alphabet
   mirrored (A↔Z, B↔Y, …).
4. **Messages → the old Casey thread (2023–24):** Quinn's unanswered texts
   end `XZHVB. KOVZHV.` — apply the mirrored alphabet: **CASEY. PLEASE.**
   The cipher is confirmed, and it costs the player something to learn it.
5. Now the login hint decodes: `gsv ylzg. dsvm sv dzh ylim.` →
   **"the boat. when he was born."**

*Chain C — the facts:*
6. **Photos → the memorial flyer:** zoom the line under the photo:
   `ELI SOTO · 1991–2025 · CREW, F/V DORA MAE`. The boat: *Dora Mae*. His
   birth year: *1991*.

**The chain:** notice the account → decode the hint (which first requires
cracking a cipher from two other surfaces) → source both facts from a
photo's zoom detail → `doramae1991`.

**Why it's the act gate:** it's a puzzle whose *hint* is itself a puzzle.
Nothing on the login screen is usable until the player has been curious
about a burnt page and a three-year-old unanswered thread. This is the
game's thesis in mechanical form: understanding Quinn IS the key.

---

## Gate 5 — The draft · full hand-decode

**Where you're stuck:** tidewater's Drafts folder holds one unsent message —
~500 characters of ciphertext ("Draft — never sent, saved Oct 11, 11:41 PM").

**The mechanics:** tap any letter in the text (all instances highlight),
type your guess on the A–Z row; it fills everywhere. ⌫ clears a letter;
"start over" (with confirm) wipes the mapping; duplicate assignments flag
red in place. At ≤5 unmapped letters the hint line counts down ("four
letters are still lying to you."). The player already knows the cipher from
Gate 4 — the work here is *scale*: every letter of the draft must be
correctly mapped, not merely enough to skim it.

**What it says (decoded):** Casey's name, the truth about Eli, the choice
("send it all to mara reyes… or burn it and let me stay a ghost"), a number
ending 0412, and the instruction: **"say the old words."** Deliberately NOT
in the draft: the old words themselves.

**Completion fires the endgame:** the hint line settles ("the letters have
stopped fighting you.") and a new thread appears in Messages.

---

## Gate 6 — The burner · answer: `still game` (also: `the game is still on`)

**Where you're stuck:** Messages → **Unknown · ···-0412**, an empty thread
with a text box. Anything wrong gets "Wrong number."

**The clues:**
1. **The draft (Gate 5):** "say the old words." — the instruction.
2. **Messages → the old Casey thread, final message (Mar 8, 2024):**
   `HGROO TZNV?` — gibberish on first read in Night 1; now, with the cipher,
   it decodes to **"still game?"** — the question Quinn asked three years
   ago that Casey never answered.

**The chain:** the draft says the old words exist → the only "old words" in
Quinn's world live in the one thread that's all unanswered questions → the
last of them, decoded, is the phrase → typing it into the burner is
*finally answering her*.

**Why it lands:** the gate is emotionally load-bearing — the mechanical act
(decode an old text) and the narrative act (answer your sister) are the same
gesture. (Playtest 1 note: this phrase originally wasn't planted anywhere —
now it is, and a test enforces that it stays.)

---

## Gate 7 — The town · answer: `kestrel bay` (Ending 3 only)

**Where you're stuck:** telling the burner "I know where you are. I'm
coming." gets: "if you really know, you don't have to say the town to me.
say it to the phone." Guessing gets: "the envelope knows. the boat knows.
the flowers know."

**The clues (triangulation — three partials, no single source):**
1. **The envelope (intro, beat 1):** postmark smudged to `K————L B——`.
   Shape of the name, nothing more.
2. **Photos → the ferry timetable:** `NORTH LINE — Port Brennan · Tessley ·
   Kestrel Bay · Ardenwall`, with the 5:40 AM first sailing circled twice,
   hard. Which stops fit `K————L B——`? Only one.
3. **Tidewater → Tidepool Florals receipt:** Oct 14, 9:12 AM, **"paid in
   store, cash"** — two days after her "death," she physically stood in a
   shop. Where's the shop? The receipt's the florist's; the delivery went
   to Mom in Port Brennan; *in store* means Quinn was wherever Tidepool
   Florals is — the town the ferry reaches and the postmark spells.

**The chain:** postmark gives the pattern → timetable gives the candidate
set (and the circled dawn sailing gives the escape itself) → the receipt
proves she was physically present → `kestrel bay`.

**Why "the flowers know":** the receipt is also the game's alive-proof — the
player has usually already had the realization; this gate asks them to
*commit* to it as geography.

---

## Ending 4 — PROCEDURE (the trap that asks nothing)

Sheriff Dunmore's thread arrives in act 3: "Bring the phone in, Casey."
Complying (with an in-fiction confirm) is the only "gate" with no puzzle —
which is the point. Everything the player learned says the sheriff is
Halloway's brother-in-law; the game never states it as a conclusion, but the
signature on the transmittals, Dae's "the sheriff said to stop calling the
tip line," and the missing-pages pattern are all in evidence. The ending
punishes trusting the institution over the evidence — the cautionary shape
of the whole story.

---

## The herrings (what misleads, and what honestly kills it)

| You believe… | Because… | Until… |
|---|---|---|
| She jumped | car at the overlook; the town's verdict; the one uncaptioned photo (Oct 9) | the circled 5:40 AM sailing; the florist receipt; Mom's Oct 15 "thank you for the flowers" voicemail |
| She was having an affair | "same booth", "don't tell anyone about us", "you're almost out" | act-2 M texts: the FOIA slip, "tell eli's wife first"; Mara's byline; Mara texting the phone |
| She had money/pill trouble | pharmacy balance texts, ATM alerts | the itemized statement: patient **Marianne** Mercer, donepezil — it was Mom's care all along |
| Marcus is the villain | "we need to talk about what you took." | the cloud-restored Oct 11 message: he's been copying records too; he'll testify |

Every herring dies by *evidence the player reads*, never by a character
explaining. That's the doctrine: the game never announces; the phone just
knows.

---

## The hint system (the only one there is)

Dae's thread, after her intro script completes, offers "ask about…" chips
for whichever gate is currently active. Each gate has exactly two nudges —
vague, then warmer — and the second never contains the answer. There are no
other hints anywhere in the game, by rule.
