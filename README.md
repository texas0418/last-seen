# Last Seen

**Case One: Widow's Point** — an epistolary detective game. Your estranged
sister vanished six days ago; the town says she jumped. Then her phone
arrives in your mailbox with no note. The entire game is her phone's screen:
texts, mail, voicemails, notes, photos, settings — and the people who are
*still texting it*.

LAST SEEN is built as an anthology brand (like The Room): each case is a new
found phone on the same engine. Engine lives in `src/engine` + screens;
everything Case One is data in `src/content`.

- **Puzzles are medium-to-hard by doctrine** — see AGENTS.md. Answers never
  appear in readable content (mechanically enforced by `test-content.ts`);
  every gate demands cross-surface inference. Hints exist only by texting
  Quinn's best friend, and she never gives answers.
- **DESIGN.md is total spoilers** — ground truth, every solution, the clue map.
- Act 1 free; one IAP (`ls_story_unlock`) at the first password; fail-open
  RevenueCat (`src/proAccess.ts`).

## Run

```
npm install
npm run ios        # or: npx expo start
npm test           # pure-module tests incl. the puzzle-doctrine enforcer
npm run typecheck
npm run lint
```

Icons are generated (no art deps): `python3 scripts/make_icons.py`.

## Pre-ship checklist

- [ ] **Playtest the difficulty curve end-to-end** — the bar is "notepad
      energy": mail password ~30+ min, tidewater ~1 hr+, full draft decode a
      sit-down session. If a tester solves a gate from one screen, that gate
      is broken (see AGENTS.md doctrine).
- [ ] Real photo art (6 images) — bake each `closer` detail INTO the image as
      zoomable detail (fair watermark, chart pairs, flyer dates, ferry stops);
      keep alt text as the accessibility layer.
- [ ] Record voicemail audio (priority: Mom ×3 — Oct 2, Oct 11, Oct 15).
- [ ] Airplane-mode dilemma (cut from v1): T traces the phone while online;
      cloud-trash restore needs ~3 min online. Design doc in DESIGN.md.
- [ ] Act-2/3 content pass: more filler texts/emails so evidence hides in
      noise (currently every item is load-bearing, which lowers difficulty).
- [ ] GitHub repo + CI rollout (ci-template), branch protection, dev branch.
- [ ] App Store Connect record + RevenueCat project; replace placeholder keys;
      price the unlock ($3.99?).
- [ ] Store listing: name "Last Seen: Widow's Point", screenshots of lock
      screen / messages / decoder (no spoilers past act 1).
- [ ] expo-doctor + device install via the raw-xcodebuild playbook.

## Case Two seeds (brand test: does it franchise?)

A different phone, e.g.: a rideshare driver's phone left in your back seat
(the last fare never got out); a dead landlord's phone with 40 years of
tenant texts; a phone that keeps receiving texts addressed to *you*.
