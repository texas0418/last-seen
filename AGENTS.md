# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

# What this app is

Last Seen: an epistolary detective game. Case One ("Widow's Point"): you are
Casey Mercer, and your missing sister's phone has arrived in the mail. The
ENTIRE game is the phone's screen — Messages, Mail, Voicemail, Notes, Photos,
Settings. There is no inventory, no map, no detective UI. Every reveal is
something the player assembles from evidence; the game never announces a
conclusion (the game does not tell you Quinn is alive — a florist receipt does).

LAST SEEN is the franchise brand (like The Room): each future story is a new
found phone, a new case, same engine. Keep the engine (src/engine, src/models,
screens) strictly separate from Case One content (src/content) so Case Two is
a content drop.

- Content is DATA (`src/content/*.ts`) rendered by dumb screens. Visibility
  is flags; flags are earned through gates (`src/engine/gates.ts`).
- Live threads (people texting the phone NOW) are scripts (`src/engine/script.ts`)
  with a persisted cursor. The world must feel alive: T threatens you, Mara
  tests you, Mom keeps calling.
- The sisters' cipher is atbash (`src/engine/cipher.ts`). NEVER write the word
  "atbash" in any player-readable string.
- Pure modules (models, dbCore, engine/cipher, engine/script, engine/hints,
  engine/gates, content/*) take no expo imports so Node can test them (`npm test`).
- Monetization: Act 1 free forever; one IAP ('story') at the first password.
  proAccess.ts fails OPEN — never hide the story behind a wall the player
  cannot pay through.

# Puzzle doctrine (Simon's bar: medium-to-HARD; the player must EARN every move)

test-content.ts enforces the mechanical half of this. The judgment half:

- A password-gate answer appears NOWHERE the player can read. The only
  exception is a photo's `closer` layer (long-press = looking inside the
  image), and only for details that must be visually "found" (a watermark,
  a flyer's dates). The leak test enforces this exception precisely.
- Every gate needs >= 2 clue sources on >= 2 different surfaces (enforced),
  and at least one step of INFERENCE the phone never states: arithmetic
  ("twelve years this fall" -> 2014), decoding, or cross-referencing.
  A puzzle whose answer can be copied from any single screen is too easy. 
- Never explain a trick in prose. The torn cipher chart shows three pairs and
  burns off; the player generalizes. Wrong answers get atmosphere ("Attempt
  logged."), never guidance.
- Hints live ONLY in Dae's thread (gates.ts `nudges`), gated behind the
  player explicitly asking, escalating exactly twice, never containing the
  answer. Do not add hint text anywhere else — especially not near a gate.
- Difficulty ramps: the lock screen is minutes (it teaches long-press);
  the mail password is a three-surface hunt; the tidewater login requires a
  cracked cipher plus two sourced facts; the draft is a full hand-decode.
  Anything added later must ramp, not flatten.

# Design doctrine

- The phone is diegetic, always. No toasts, no tutorials, no quest log. The
  Home screen badge counts are the only pointer the player gets.
- BrineOS is fictional but plausible; dark-only (it is 11:47 PM at Casey's
  kitchen table, and the scripted clock only moves toward dawn as acts fall).
- Wrong answers cost nothing mechanically but must FEEL surveilled (T's
  thread exists so the player never feels alone).
- The paywall is the one non-diegetic screen, by design: never dress a real
  purchase as fiction.
- Photos are real art: tapping opens the zoomable viewer (PhotoViewer,
  pinch + pan) and the player FINDS details — never pre-frame a detail crop.
  The content alt/closer text pipeline is the accessibility layer, and the
  described-scene card remains the fallback for photos without art.

# Git workflow (PR-based CI)

`main` is what ships; `dev` is the integration branch. Never commit directly to either.

1. Start every session by branching off `dev`: `git fetch origin && git checkout -b <topic> origin/dev`. Prefer an isolated worktree (`git worktree add`) when other sessions may be active.
2. When the work is done and `npm run typecheck`, `npm run lint`, and `npm test` pass locally, push and open a PR into `dev` with `gh pr create --base dev`.
3. Do not merge your own PR unless Simon says to; report the PR URL and CI status at the end of the session.
4. Batches of work on `dev` get promoted by a PR into `main` (ask Simon first).

(Until the GitHub repo + CI rollout exists — see README pre-ship list — keep
the same discipline locally: topic branches off dev, all three checks green
before merging.)

# Cross-session memory (GitHub Issues, once the repo exists)

To-dos, bugs, and session handoffs live in GitHub Issues, not in README
checklists or scratch files. Check `gh issue list --state open` at session
start; file what you find but don't fix; close what you resolve via PR
(`Closes #N`). Pre-ship checklist items carry the `pre-ship` label. Until the
repo exists, the README pre-ship section is the single source of truth.
