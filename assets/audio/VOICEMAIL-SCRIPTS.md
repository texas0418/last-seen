# Voicemail recording scripts — Case One: Widow's Point

Five voicemails. Drop finished files in this folder with the exact filenames.
Record clean and dry (no phone EQ, no beep — the tinny phone-speaker filter
and the leading beep get applied at integration so all five match). Target
lengths are what the app displays; ±5s is fine. Format: `.m4a`, mono.

The SPOKEN WORDS must match the in-game transcripts word-for-word — the
Voicemail app shows the transcript alongside the audio, and one of these
lines is a puzzle clue (marked). Direction, pauses, and breaths are yours.

Casting: Mom (60s, warm, unhurried), Dae (late 20s, any gender — in-game
gender never specified), Carol (40s–60s, office-polite).

---

## 1. `vm-mom-oct2.m4a` — Mom · 1:12
The baseline "before" recording: this is Mom happy. Wandering but bright.
She repeats herself a little; it should feel cozy, not yet worrying. Take
your time — long pauses while she thinks are what stretch this to 1:12.
**⚠ Clue line: "twelve years this fall" must be clearly audible — it's a
password source. Don't rush it, don't emphasize it either.**

> "Quinn, honey, it's your mother. I was thinking about the wisteria at
> Alder Street — twelve years this fall since we lost that house, can you
> believe it. Your father never did fix the gate. Anyway. The girl on the
> radio said rain. Call me when you're off, don't forget to eat something."

Direction: smile through "can you believe it." A small sad breath on "your
father," then briskly past it — she's practiced at stepping over that hole.

## 2. `vm-mom-oct11.m4a` — Mom · 0:31
The night before. Mom notices what nobody else did. Quieter than #1, slower,
no rambling — this is her lucid register. It should unsettle in hindsight.

> "You sounded far away today, sweetheart. Not the phone kind of far away.
> The other kind. You get that from him, you know. Call me back."

Direction: "the other kind" almost a whisper. No melodrama; she's stating a
fact she's seen before.

## 3. `vm-dae-oct13.m4a` — Dae · 0:22
3 AM, the day after the car was found. Genuinely crying — messy, angry,
young. Recorded too close to the mic. Cuts off mid-thought.

> "Pick up. Pick up pick up pick up. Tell me you didn't — you don't get to
> make me the plant person, Quinn, that was a JOKE —"

Direction: "JOKE" breaks upward, furious and pleading at once. Hard stop
right after — the app adds the call-ended click.

## 4. `vm-hr.m4a` — Carol, Halloway front office · 0:26
An office voice performing a script she's ashamed of. Starts corporate,
collapses into human. The apology doubling at the end is real.

> "Ms. Mercer, this is Carol from the front office. Mr. Halloway asked me to
> remind you that company records and login credentials are company
> property, and, um — given the circumstances I'm so sorry to be leaving
> this message at all. Please disregard. I'm sorry."

Direction: the "um" is where the script runs out. Speed up slightly through
"please disregard" — she wants off this call.

## 5. `vm-mom-oct15.m4a` — Mom · 0:47
THE voicemail — three days after Quinn "died," and Mom thanks her for
flowers. The player hears it mid-act-2 and can't tell if it's grief or a
clue. Play it completely straight: to Mom, nothing is wrong. Warmth with a
thin crack of loneliness at the end. Never spooky.

> "Thank you for the flowers, honey. Lilies, like the fair. Though I told
> the delivery girl at the door, my Quinn always sends yellow ones — she
> laughed. People laugh at me now. The card was nice. You and your little
> codes. Call me back, everyone here keeps using the wrong voice."

Direction: "people laugh at me now" is light, almost amused — which makes it
land harder. "You and your little codes" with real affection; it's the
closest the game comes to saying the truth out loud. Last line slower,
smaller.

---

## Integration notes (for the build session, not the recording)
- Add `expo-audio` to deps when files land; VoicemailScreen gets a play
  button above the transcript. Transcripts stay — they're the accessibility
  layer and the "battery too low for audio sometimes" excuse disappears.
- Post: low-pass ~3.4 kHz + slight compression on all five for phone-line
  feel, leading beep, trailing click on #3.
- Priority order if recording piecemeal: 5, 1, 2 (Mom carries the game),
  then 3, then 4.
