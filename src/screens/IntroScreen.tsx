// src/screens/IntroScreen.tsx
// Casey's narration — the only screens that are not the phone. The envelope
// the whole case arrives in sits on the table above the words: padded, brown,
// postmark smudged past reading, the fair photo strip showing at its mouth.
// Serif below, one paragraph at a time, tap to continue. The postmark and the
// strip are load-bearing clues later, so they are shown here, not described.
import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { INTRO } from '../content/other';
import { BodyText, ChromeText } from '../engine/ui';
import { PHOTO_ART } from '../photoAssets';
import { setFlag } from '../state';
import { colors, fonts, type } from '../theme';

const KRAFT = '#8a6a44';
const KRAFT_DARK = '#6e5333';
const KRAFT_EDGE = '#a98557';
const STAMP = '#9c4a3c';

function Envelope() {
  const strip = PHOTO_ART['ph-wallpaper'];
  return (
    <View style={s.table}>
      <View style={s.envelope}>
        <View style={s.flap} />
        <View style={s.postmark}>
          <ChromeText style={s.postmarkText}>K————L B——</ChromeText>
          <ChromeText style={s.postmarkSub}>· · · · ·</ChromeText>
        </View>
        {strip ? (
          <View style={s.mouth}>
            <Image source={strip.image} style={s.strip} resizeMode="cover" />
          </View>
        ) : null}
        <View style={s.label}>
          <ChromeText style={s.labelLine}>CASEY HALE</ChromeText>
          <ChromeText style={s.labelLineDim}>no return address</ChromeText>
        </View>
      </View>
    </View>
  );
}

export default function IntroScreen() {
  const [i, setI] = useState(0);
  const last = i >= INTRO.length - 1;
  return (
    <Pressable
      style={s.screen}
      onPress={() => (last ? setFlag('introDone') : setI(i + 1))}
    >
      <Envelope />
      <View style={s.center}>
        <BodyText style={type.narration}>{INTRO[i]}</BodyText>
      </View>
      <ChromeText style={s.tap}>{last ? 'pick up the phone' : 'tap'}</ChromeText>
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 28, paddingTop: 70 },
  table: { alignItems: 'center', marginBottom: 26 },
  envelope: {
    width: 250,
    height: 150,
    backgroundColor: KRAFT,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: KRAFT_EDGE,
    transform: [{ rotate: '-3deg' }],
    overflow: 'hidden',
  },
  flap: {
    position: 'absolute',
    top: -90,
    left: -40,
    width: 330,
    height: 150,
    backgroundColor: KRAFT_DARK,
    transform: [{ rotate: '8deg' }],
  },
  postmark: {
    position: 'absolute',
    right: 14,
    top: 12,
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 2,
    borderColor: STAMP,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.75,
  },
  postmarkText: { fontFamily: fonts.mono, fontSize: 9, color: STAMP, letterSpacing: 0.5 },
  postmarkSub: { fontFamily: fonts.mono, fontSize: 8, color: STAMP, marginTop: 2 },
  mouth: {
    position: 'absolute',
    left: 18,
    bottom: -4,
    width: 54,
    height: 70,
    borderRadius: 3,
    overflow: 'hidden',
    transform: [{ rotate: '6deg' }],
    borderWidth: 1,
    borderColor: '#f0e6d2',
  },
  strip: { width: 54, height: 96 },
  label: { position: 'absolute', left: 90, bottom: 26 },
  labelLine: { fontFamily: fonts.mono, fontSize: 12, color: '#2b2118', letterSpacing: 1 },
  labelLineDim: { fontFamily: fonts.mono, fontSize: 9, color: '#4a3a2a', marginTop: 3 },
  center: { flex: 1, justifyContent: 'flex-start' },
  tap: {
    textAlign: 'center',
    color: colors.faint,
    fontSize: 13,
    letterSpacing: 2,
    paddingBottom: 30,
    textTransform: 'uppercase',
  },
});
