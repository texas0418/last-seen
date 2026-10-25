// src/screens/NightCard.tsx
// The chapter title card, shown once when a night begins: an index card on
// the table, Casey's hand, serif. The one breath outside the phone before the
// screen lights again, in the same physical world as the envelope rather than
// as brand chrome on black.

import { Pressable, StyleSheet, View } from 'react-native';

import type { NightDef } from '../content/nights';
import { BodyText, ChromeText } from '../engine/ui';
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
        <View style={s.card}>
          <View style={s.rule} />
          <ChromeText style={s.eyebrow}>Night {ROMAN[night.n]}</ChromeText>
          <BodyText style={s.title}>{night.title}</BodyText>
          {night.recap ? (
            <BodyText style={[type.narration, s.recap]}>{night.recap}</BodyText>
          ) : null}
        </View>
      </View>
      <Pressable onPress={onContinue} style={s.continueHit} hitSlop={16}>
        <ChromeText style={s.continue}>pick the phone back up</ChromeText>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 30 },
  center: { flex: 1, justifyContent: 'center' },
  card: {
    backgroundColor: '#efe6d3',
    borderRadius: 3,
    paddingVertical: 26,
    paddingHorizontal: 22,
    transform: [{ rotate: '1.5deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  rule: { height: 2, backgroundColor: '#c9847a', marginBottom: 18, opacity: 0.8 },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 3,
    color: '#8a6a44',
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 28,
    color: '#2b2118',
    marginTop: 8,
    marginBottom: 14,
  },
  recap: { color: '#3d3128', fontSize: 16, lineHeight: 25 },
  continueHit: { alignSelf: 'center', marginBottom: 34 },
  continue: { fontFamily: fonts.sans, fontSize: 14, color: colors.accent },
});
