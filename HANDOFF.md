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

## ✅ RESOLVED — the device build (2026-08-19)

The `CompileAssetCatalogVariant thinned ... Images.xcassets (in target
'LastSeen')` failure was **stale DerivedData**, nothing more. `rm -rf
~/LastSeenDD` (the whole directory, not just `Build/`) and a rebuild fixed
it. No prebuild, no version changes, no source changes.

Fast way to rule the catalog innocent next time — run actool standalone,
which takes about five seconds:

```
xcrun actool ios/LastSeen/Images.xcassets --compile /tmp/ac-out \
  --app-icon AppIcon --target-device iphone --platform iphoneos \
  --minimum-deployment-target 16.4 --output-format human-readable-text \
  --output-partial-info-plist /tmp/ac-out/partial.plist
```

If that exits 0, the icon and catalog are fine; stop inspecting PNGs and
wipe DerivedData instead.

**The project has no `DEVELOPMENT_TEAM` baked into the pbxproj.** Every
device build and archive must pass it on the command line or it dies at
signing before ever reaching the asset catalog:

```
LANG=en_US.UTF-8 xcodebuild -workspace ios/LastSeen.xcworkspace \
  -scheme LastSeen -configuration Release -destination 'generic/platform=iOS' \
  -derivedDataPath ~/LastSeenDD \
  DEVELOPMENT_TEAM=75ULC33H2C CODE_SIGN_STYLE=Automatic \
  -allowProvisioningUpdates -allowProvisioningDeviceRegistration build
```

Also note `xcodebuild ... > log 2>&1; echo "EXIT=$?"` reports the *echo's*
status, not the build's. Grep the log for `** BUILD SUCCEEDED **`.

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

None outstanding. PR #1 (`screenshots` → `dev`) was rebase-merged
2026-08-19; `dev` head `ddd8fbf`.

## Next steps, in order

1. ~~Fix the device build~~ — DONE 2026-08-19; builds, installs and
   launches on the iPhone.
2. ~~Merge PR #1~~ — DONE 2026-08-19, rebase-merged into `dev`.
3. **App Store Connect record.** The App ID
   **`com.simonshih.lastseen`** (id `N3GKXG8TS3`, In-App Purchase capability
   on) is registered as of 2026-08-19. Only the app record is still missing.
   - **The bundle id is NOT `com.lastseen.app`.** That string is owned by
     another developer account — Apple returns "not available" and there is
     no appeal. Earlier drafts of this file wrongly assumed Xcode had
     registered it; it never did, the device builds were signing against the
     team wildcard `75ULC33H2C.*`.
   - App records **cannot** be created through Apple's public API. Simon
     creates it in the ASC website (~2 min); everything after that
     (description, keywords, categories, age rating, price, IAP,
     screenshots, build attachment) is API-settable.
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
