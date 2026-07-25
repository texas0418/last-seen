import { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Global safety ceiling: honor Dynamic Type but never let fixed phone-chrome
// layouts collapse. Reading surfaces cap tighter at their own call sites.
type TextWithDefaults = typeof Text & {
  defaultProps?: { maxFontSizeMultiplier?: number };
};
const T = Text as TextWithDefaults;
T.defaultProps = { ...T.defaultProps, maxFontSizeMultiplier: 1.4 };

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
import MessagesScreen from './src/screens/MessagesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import EndingScreen from './src/screens/EndingScreen';
import {
  NotesScreen,
  PhotosScreen,
  VoicemailScreen,
} from './src/screens/SimpleApps';

function Root() {
  useWorldVersion();
  const [app, setApp] = useState<AppId | null>(null);
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
  if (!hasFlag('phoneUnlocked')) return <LockScreen />;
  if (app === 'messages') return <MessagesScreen onBack={back} />;
  if (app === 'mail') return <MailScreen onBack={back} />;
  if (app === 'voicemail') return <VoicemailScreen onBack={back} />;
  if (app === 'notes') return <NotesScreen onBack={back} />;
  if (app === 'photos') return <PhotosScreen onBack={back} />;
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
