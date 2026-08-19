# LAST SEEN — session handoff (2026-08-19)

Written for an agent starting cold. Assume no conversation context.

## What this is

`Last Seen: Widow's Point` — an epistolary detective game. The entire app is
a missing woman's phone. Twelve nights, thirteen puzzle gates, four endings.
Expo 57 / RN 0.86, iPhone-only, portrait, dark. Read `AGENTS.md` first, then
`DESIGN.md` (ground truth + every solution) and `WALKTHROUGH.md` (play order).

## State: content-complete, playtested twice, NOT submitted

- All 12 nights written and playable start to finish.
- Simon played the whole game guided (playtest 2) on 2026-08-19. Every note
  from that pass is fixed and shipped.
- 21 photos composited, 7 voicemails recorded and processed with a
  phone-line filter, all playable in-app.
- Repo: https://github.com/texas0418/last-seen — **PUBLIC**, `main` + `dev`,
  branch protection on both requiring `quality` + `secrets`.
- Pages live: https://texas0418.github.io/last-seen-privacy/ and
  https://texas0418.github.io/last-seen-support/
- `STORE.md` holds the complete App Store listing, keywords, 12+ rating
  answers, and the App Review notes.

## ⛔ BLOCKER — device build is failing right now

The last device build FAILED and this is the first thing to fix:

```
The following build commands failed:
  CompileAssetCatalogVariant thinned .../LastSeen.app
    ios/LastSeen/Images.xcassets (in target 'LastSeen')
```

Context: it built fine all evening. It broke immediately after a full
`rm -rf node_modules package-lock.json && npm install` (done to fix a CI
lockfile problem), followed by `rm -f ios/Podfile.lock && pod install`.

Already ruled out: the icon is present, 1024x1024, and has NO alpha
(`sips -g hasAlpha` = no). `Images.xcassets` structure is intact
(AppIcon.appiconset + SplashScreenBackground.colorset +
SplashScreenLogo.imageset). No `error:` line is emitted by actool — it just
fails.

Try in this order:
1. `rm -rf ~/LastSeenDD` entirely (not just Build/) and rebuild — the
   asset-catalog step is the first thing a clean build does and stale
   intermediates have caused phantom failures here before.
2. `npx expo prebuild -p ios --no-install` to regenerate `ios/`, then
   `cd ios && LANG=en_US.UTF-8 pod install`, then rebuild. NOTE: prebuild
   wipes Pods, and wiping node_modules removes expo-sqlite's `sqlite3.c`
   amalgamation, which only `pod install` restores — verify
   `ls node_modules/expo-sqlite/ios/sqlite3.c` exists before building.
3. Check free disk space; actool fails oddly when low.
4. Open the workspace in Xcode and build once — its error surface for
   asset catalogs is far better than xcodebuild's log.

The simulator build was fine, so this is device/thinning-specific.

## Version drift worth knowing

After the reinstall, three packages sit BELOW the SDK-sanctioned set in
`node_modules/expo/bundledNativeModules.json`:

| package | installed | sanctioned |
|---|---|---|
| expo-asset | 57.0.7 | 57.0.12 |
| expo-file-system | 57.0.1 | 57.0.4 |
| react-native | 0.86.0 | 0.86.2 |

These are deliberate pins from an earlier session and the app shipped to
device on them all evening. Do NOT bump them casually: the house memory
records that letting npm resolve newer expo patches caused a dyld
`signal 6` crash on launch in another app. If you do align them, pin
exactly, re-run `scripts/patch-jsi-xcode26.sh`, `pod install`, and verify
the app LAUNCHES on device, not just builds.

## Open PR

https://github.com/texas0418/last-seen/pull/1 — `screenshots` → `dev`.
CI green (quality + secrets). Contains: 5 App Store screenshots, the photo
grid column fix, the preview-leak fix + regression test, the kv navigation
hook, and the lockfile repair. **Not merged — Simon merges his own PRs.**

## Next steps, in order

1. **Fix the device build** (above). Nothing else can proceed.
2. **Merge PR #1** once Simon approves.
3. **App Store Connect record.** Nothing exists on Apple's servers yet
   except (probably) the App ID `com.lastseen.app`, which Xcode's automatic
   signing registered while building. Verify, then create the app record.
   - ASC API client: `~/.appstoreconnect/asc_api.py`
     KEY_ID `R2T6RB2W97`, ISSUER `b4c70f86-277f-4e9e-8050-dc788275caf5`,
     keys in `~/.appstoreconnect/private_keys/`.
   - All metadata to paste is in `STORE.md`.
4. **IAP + RevenueCat.** Create non-consumable `ls_story_unlock` at $5.99.
   Create the RevenueCat project, entitlement id `story`, then replace the
   placeholders in `src/revenuecat.ts`. **`proAccess.ts` fails OPEN while
   the keys are placeholders** — the moment real keys land the paywall
   becomes real, so a sandbox purchase MUST be tested end to end. An
   untested paywall that blocks Night III is a guaranteed rejection.
5. **Upload**: bump build number, archive → export → `altool` with the
   on-disk API key (no EAS credits — see the house playbook).
6. **Submit** with the review notes from `STORE.md` pasted verbatim.

## ⚠️ The single highest-risk item in the submission

**A reviewer cannot get past the lock screen without a puzzle answer.**
`STORE.md` contains App Review notes with all 13 answers in order plus a
content note explaining the story's reveal. If those notes are not pasted
into the submission, expect rejection for "app is unusable."

## Still outstanding (not blockers)

- **Filler content pass** — more mundane texts/emails so evidence hides.
  The photo noise pass is done; Messages and Mail are still nearly all
  load-bearing, which makes the game easier than intended.
- **Two more voicemails** — `vm-dad` and `vm-mom-n10` (scripts not yet
  written; the other 7 are recorded and shipped).
- **Blind playtest** — nobody except Simon has played it, and he had the
  walkthrough. This is the only remaining way to learn whether the puzzles
  land cold.

## House rules that bit this session

- Branch off `dev`, PR into `dev`, never commit to `main`/`dev` directly.
- Player-facing prose rules are ASSERTIONS in `test-content.ts`, not
  guidelines: no math metaphors, em-dash density >= 60 words per dash in
  dialogue/narration, no semicolons in text messages, no preview leaks.
  If a content edit fails `npm test`, that's the rule, not a bug.
- `npm install` on macOS prunes the Linux-only `@emnapi` optional deps and
  breaks CI's `npm ci`. Fix is a FULL `rm -rf node_modules package-lock.json
  && npm install`; verify `grep -c '@emnapi/core' package-lock.json` == 4
  and `npm ci --dry-run` passes before pushing.
- Simon's contact address is **simon@simonbuilds.app**, never the gmail.
