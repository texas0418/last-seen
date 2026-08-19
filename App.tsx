import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';

// Dynamic Type ceilings live in theme.ts (TYPE_CAPS) and are applied as
// explicit maxFontSizeMultiplier props per surface via the capped wrappers
// in src/engine/ui.tsx — Text.defaultProps is silently DEAD under React 19
// (the old "global 1.4 cap" here did nothing and AX sizes scaled unbounded).

import { currentNight } from './src/content/nights';
import { ENDINGS } from './src/content/other';
import { initPurchases, useStoryUnlocked } from './src/proAccess';
import {
  getKv,
  hasFlag,
  initState,
  putKv,
  setFlag,
  useWorldVersion,
} from './src/state';
import HomeScreen, { type AppId } from './src/screens/HomeScreen';
import IntroScreen from './src/screens/IntroScreen';
import LockScreen from './src/screens/LockScreen';
import MailScreen from './src/screens/MailScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import NightCard from './src/screens/NightCard';
import SettingsScreen from './src/screens/SettingsScreen';
import EndingScreen from './src/screens/EndingScreen';
import PhotosScreen from './src/screens/PhotosScreen';
import { NotesScreen, VoicemailScreen } from './src/screens/SimpleApps';

function Root() {
  useWorldVersion();
  // Screenshot/layout-audit hook: a kv key can preselect the open app and
  // the open mail item. Only reachable by writing to the app's private
  // database from a dev machine, and it only navigates — it cannot set a
  // flag or skip a puzzle.
  const [app, setApp] = useState<AppId | null>(
    () => (getKv('debug:screen') as AppId | undefined) ?? null,
  );

  const unlocked = useStoryUnlocked();
  const back = () => setApp(null);

  // If the mail password was solved but the paywall was deferred, grant act2
  // the moment the entitlement lands (purchase, restore, or fail-open).
  useEffect(() => {
    if (unlocked && getKv('mailSolved') && !hasFlag('act2')) setFlag('act2');
  }, [unlocked]);

  // A fired ending shows its epilogue exactly once, then the phone remains.
  const ending = ENDINGS.find((e) => hasFlag(e.flag) && !getKv(`shown:${e.flag}`));
  if (ending)
    return (
      <EndingScreen ending={ending} onClose={() => putKv(`shown:${ending.flag}`, '1')} />
    );

  if (!hasFlag('introDone')) return <IntroScreen />;

  // Chapter card: the newest unlocked night announces itself exactly once.
  const night = currentNight(hasFlag);
  if (!getKv(`shown:night:${night.n}`))
    return (
      <NightCard night={night} onContinue={() => putKv(`shown:night:${night.n}`, '1')} />
    );

  if (!hasFlag('phoneUnlocked')) return <LockScreen />;
  if (app === 'messages') return <MessagesScreen onBack={back} />;
  if (app === 'mail') return <MailScreen onBack={back} />;
  if (app === 'voicemail') return <VoicemailScreen onBack={back} />;
  if (app === 'notes') return <NotesScreen onBack={back} />;
  if (app === 'photos') return <PhotosScreen onBack={back} />;
  if (app === 'calendar') return <CalendarScreen onBack={back} />;
  if (app === 'settings') return <SettingsScreen onBack={back} />;
  return <HomeScreen onOpen={setApp} />;
}

export default function App() {
  // Lazy one-time init: sqlite is sync, purchases guards itself. Doing it in
  // the state initializer keeps the first frame correct without an effect.
  const [ready] = useState(() => {
    initState();
    initPurchases(); // fail-open: unlocks the story in Expo Go / placeholder builds
    return true;
  });
  if (!ready) return null;
  return (
    <>
      <StatusBar style="light" />
      <Root />
    </>
  );
}
