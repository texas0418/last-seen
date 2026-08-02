// src/engine/PhotoViewer.tsx
// Full-screen photo viewer: pinch to zoom, drag to pan — the player
// investigates the whole image, nothing is pre-framed for them (doctrine:
// details are FOUND, not presented). Uses the native iOS zoomable ScrollView;
// no gesture libs. (maximumZoomScale is iOS-only; Android gets pan-only until
// a case ships there.)

import { Image, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';

import { colors, fonts } from '../theme';
import { ChromeText } from './ui';

interface Props {
  source: number;
  /** width / height of the image */
  ar: number;
  /** accessibility narration — the content alt/closer text pipeline */
  label: string;
  onClose: () => void;
}

export function PhotoViewer({ source, ar, label, onClose }: Props) {
  const { width } = useWindowDimensions();
  // Explicit pixel dimensions: the zoom container derives its pannable
  // content size from the child's layout, and percentage/aspectRatio sizing
  // under-reports it (symptom: vertical pan works, horizontal doesn't).
  const imgW = width;
  const imgH = Math.round(width / ar);
  return (
    <View style={s.fill}>
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
          style={{ width: imgW, height: imgH }}
          resizeMode="contain"
          accessibilityLabel={label}
        />
      </ScrollView>
      <Pressable style={s.done} onPress={onClose} hitSlop={12}>
        <ChromeText style={s.doneText}>Done</ChromeText>
      </Pressable>
      <ChromeText style={s.hint}>pinch to look closer</ChromeText>
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
  done: {
    position: 'absolute',
    top: 54,
    right: 18,
    backgroundColor: 'rgba(20,24,31,0.85)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  doneText: { color: colors.accent, fontFamily: fonts.sans, fontSize: 15 },
  hint: {
    position: 'absolute',
    bottom: 28,
    alignSelf: 'center',
    color: colors.faint,
    fontFamily: fonts.sans,
    fontSize: 12,
  },
});
