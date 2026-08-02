// src/screens/PaywallScreen.tsx
// Shown once: the moment the first password falls. Non-diegetic on purpose —
// never dress a real purchase as part of the fiction. Fail-open builds
// (Expo Go / placeholder keys) never see this screen.

import { Pressable, StyleSheet, View } from 'react-native';

import { BodyText, ChromeText } from '../engine/ui';
import { purchaseStory, restoreStory, useStoryUnlocked } from '../proAccess';
import { hasFlag, setFlag } from '../state';
import { colors, fonts } from '../theme';

export default function PaywallScreen({ onDone }: { onDone: () => void }) {
  const unlocked = useStoryUnlocked();
  const finish = () => {
    if (!hasFlag('act2')) setFlag('act2');
    onDone();
  };
  if (unlocked) finish();
  return (
    <View style={s.screen}>
      <ChromeText style={s.brand}>LAST SEEN</ChromeText>
      <ChromeText style={s.case}>Case One: Widow’s Point</ChromeText>
      <BodyText style={s.copy}>
        The password is right. The mail is about to open, and everything past
        it — the second mailbox, the reporter, the draft she never sent, all
        four endings.
      </BodyText>
      <BodyText style={s.copy}>Unlock the full story. One time, yours forever.</BodyText>
      <Pressable
        style={s.buy}
        onPress={async () => {
          if (await purchaseStory()) finish();
        }}
      >
        <ChromeText style={s.buyText}>Continue the story</ChromeText>
      </Pressable>
      <Pressable
        onPress={async () => {
          if (await restoreStory()) finish();
        }}
      >
        <ChromeText style={s.restore}>Restore purchase</ChromeText>
      </Pressable>
      <Pressable onPress={onDone}>
        <ChromeText style={s.later}>Not now</ChromeText>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', padding: 32 },
  brand: {
    fontFamily: fonts.mono,
    fontSize: 24,
    letterSpacing: 8,
    color: colors.text,
    textAlign: 'center',
  },
  case: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ghost,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  copy: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textDim,
    textAlign: 'center',
    marginBottom: 14,
  },
  buy: {
    backgroundColor: colors.accentDeep,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  buyText: { color: '#eef4fa', fontFamily: fonts.sans, fontSize: 16, fontWeight: '700' },
  restore: { color: colors.accent, textAlign: 'center', marginTop: 18, fontSize: 14 },
  later: { color: colors.faint, textAlign: 'center', marginTop: 14, fontSize: 14 },
});
