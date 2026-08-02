// src/screens/NightCard.tsx
// The chapter title card, shown once when a night begins. Same voice as the
// endings: mono brand chrome, serif recap — Casey outside the phone for one
// breath before the screen lights again.

import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { NightDef } from '../content/nights';
import { colors, fonts, type } from '../theme';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

export default function NightCard({
  night,
  onContinue,
}: {
  night: NightDef;
  onContinue: () => void;
}) {
  return (
    <View style={s.screen}>
      <View style={s.center}>
        <Text style={s.eyebrow}>NIGHT {ROMAN[night.n]}</Text>
        <Text style={s.title}>{night.title}</Text>
        {night.recap ? (
          <Text style={[type.narration, s.recap]}>{night.recap}</Text>
        ) : null}
      </View>
      <Pressable onPress={onContinue} style={s.continueHit} hitSlop={16}>
        <Text style={s.continue}>pick the phone back up</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 30 },
  center: { flex: 1, justifyContent: 'center' },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 5,
    color: colors.faint,
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.mono,
    fontSize: 26,
    letterSpacing: 8,
    color: colors.ghost,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 26,
  },
  recap: { textAlign: 'center' },
  continueHit: { alignSelf: 'center', marginBottom: 34 },
  continue: { fontFamily: fonts.sans, fontSize: 14, color: colors.accent },
});
