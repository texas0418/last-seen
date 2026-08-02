// src/screens/EndingScreen.tsx
// The epilogue card for whichever ending fired. The phone stays explorable
// afterwards — the endings are voicemails from the future, not a game over.

import { Pressable, ScrollView, StyleSheet } from 'react-native';

import type { Ending } from '../content/other';
import { BodyText, ChromeText } from '../engine/ui';
import { colors, fonts, type } from '../theme';

export default function EndingScreen({
  ending,
  onClose,
}: {
  ending: Ending;
  onClose: () => void;
}) {
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <ChromeText style={s.brand}>LAST SEEN</ChromeText>
      {/* The one honest chrome line (paywall precedent): tell the player
          the shape of the ending space, never dress it as fiction. */}
      <ChromeText style={s.ordinal}>ENDING {ending.flag.slice(-1)} OF 4</ChromeText>
      <ChromeText style={s.title}>{ending.title}</ChromeText>
      {ending.prose.map((p, i) => (
        <BodyText key={i} style={[type.narration, { marginBottom: 20 }]}>
          {p}
        </BodyText>
      ))}
      <Pressable onPress={onClose}>
        <ChromeText style={s.close}>return to the phone</ChromeText>
      </Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 30, paddingTop: 90, paddingBottom: 60 },
  brand: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 6,
    color: colors.faint,
    textAlign: 'center',
  },
  ordinal: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 3,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: 10,
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: 30,
    letterSpacing: 10,
    color: colors.ghost,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 36,
  },
  close: {
    color: colors.accent,
    textAlign: 'center',
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 20,
  },
});
