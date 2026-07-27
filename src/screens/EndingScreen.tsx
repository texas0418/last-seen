// src/screens/EndingScreen.tsx
// The epilogue card for whichever ending fired. The phone stays explorable
// afterwards — the endings are voicemails from the future, not a game over.

import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import type { Ending } from '../content/other';
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
      <Text style={s.brand}>LAST SEEN</Text>
      {/* The one honest chrome line (paywall precedent): tell the player
          the shape of the ending space, never dress it as fiction. */}
      <Text style={s.ordinal}>ENDING {ending.flag.slice(-1)} OF 4</Text>
      <Text style={s.title}>{ending.title}</Text>
      {ending.prose.map((p, i) => (
        <Text key={i} style={[type.narration, { marginBottom: 20 }]}>
          {p}
        </Text>
      ))}
      <Pressable onPress={onClose}>
        <Text style={s.close}>return to the phone</Text>
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
