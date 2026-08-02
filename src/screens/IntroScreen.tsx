// src/screens/IntroScreen.tsx
// Casey's narration — the only screens that are not the phone. Serif on
// black, one paragraph at a time, tap to continue. The postmark and the
// photo strip land here; both are load-bearing clues later.

import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { INTRO } from '../content/other';
import { BodyText, ChromeText } from '../engine/ui';
import { setFlag } from '../state';
import { colors, type } from '../theme';

export default function IntroScreen() {
  const [i, setI] = useState(0);
  const last = i >= INTRO.length - 1;
  return (
    <Pressable
      style={s.screen}
      onPress={() => (last ? setFlag('introDone') : setI(i + 1))}
    >
      <View style={s.center}>
        <BodyText style={type.narration}>{INTRO[i]}</BodyText>
      </View>
      <ChromeText style={s.tap}>{last ? 'pick up the phone' : 'tap'}</ChromeText>
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: 28, justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center' },
  tap: {
    textAlign: 'center',
    color: colors.faint,
    fontSize: 13,
    letterSpacing: 2,
    paddingBottom: 30,
    textTransform: 'uppercase',
  },
});
