// src/engine/PhotoViewer.tsx
// Full-screen photo: pinch to zoom, drag to pan — the player investigates
// the whole image, nothing is pre-framed for them (doctrine: details are
// FOUND, not presented). The date and caption live here, not in the grid,
// so reading them is an act rather than a glance.

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import { colors, fonts } from '../theme';
import { BodyText, ChromeText } from './ui';

interface Props {
  /** omitted for photos with no art yet — `described` renders instead */
  source?: number;
  ar?: number;
  /** accessibility narration — the content alt/closer pipeline */
  label: string;
  when: string;
  caption?: string;
  /** described-scene fallback text when there is no image */
  described?: string;
  onClose: () => void;
}

export function PhotoViewer({
  source,
  ar,
  label,
  when,
  caption,
  described,
  onClose,
}: Props) {
  const { width } = useWindowDimensions();
  return (
    <View style={s.fill}>
      {source ? (
        <ScrollView
          style={s.scroller}
          maximumZoomScale={6}
          minimumZoomScale={1}
          bouncesZoom
          centerContent
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={source}
            style={{ width, height: Math.round(width / (ar ?? 1)) }}
            resizeMode="contain"
            accessibilityLabel={label}
          />
        </ScrollView>
      ) : (
        <ScrollView style={s.scroller} contentContainerStyle={s.describedWrap}>
          <BodyText style={s.described}>{described ?? label}</BodyText>
        </ScrollView>
      )}

      <View style={s.topBar}>
        <ChromeText style={s.when}>{when}</ChromeText>
        <Pressable onPress={onClose} hitSlop={12} style={s.done}>
          <ChromeText style={s.doneText}>Done</ChromeText>
        </Pressable>
      </View>

      <View style={s.bottomBar}>
        {caption ? <BodyText style={s.caption}>{caption}</BodyText> : null}
        {source ? (
          <ChromeText style={s.hint}>pinch to look closer</ChromeText>
        ) : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 10,
  },
  scroller: { flex: 1 },
  describedWrap: { padding: 28, paddingTop: 120 },
  described: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 25,
    color: colors.textDim,
    fontStyle: 'italic',
  },
  topBar: {
    position: 'absolute',
    top: 48,
    left: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  when: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textDim,
    backgroundColor: 'rgba(10,12,16,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  done: {
    backgroundColor: 'rgba(20,24,31,0.85)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  doneText: { color: colors.accent, fontFamily: fonts.sans, fontSize: 15 },
  bottomBar: { position: 'absolute', bottom: 30, left: 24, right: 24, alignItems: 'center' },
  caption: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  hint: { fontFamily: fonts.sans, fontSize: 12, color: colors.faint },
});
