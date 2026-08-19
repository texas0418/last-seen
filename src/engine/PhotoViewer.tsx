// src/engine/PhotoViewer.tsx
// Full-screen photos, iOS Photos-style: swipe left/right between shots,
// pinch to zoom, drag to pan. Details are FOUND, never pre-framed
// (doctrine). Date and caption ride the chrome so reading them is an act
// rather than a glance at a list.
//
// Structure: an outer PAGED horizontal ScrollView, one page per photo,
// each page its own zoomable ScrollView. Paging is disabled while a page
// is zoomed in so panning never fights the swipe.

import { useRef, useState } from 'react';
import {
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import { colors, fonts } from '../theme';
import { BodyText, ChromeText } from './ui';

export interface ViewerPhoto {
  id: string;
  when: string;
  caption?: string;
  /** accessibility narration; also the described-scene fallback */
  label: string;
  source?: number;
  ar?: number;
}

export function PhotoViewer({
  photos,
  startIndex,
  onClose,
}: {
  photos: ViewerPhoto[];
  startIndex: number;
  onClose: () => void;
}) {
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);
  const pager = useRef<ScrollView>(null);
  const current = photos[index] ?? photos[0];

  const onPageScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index && i >= 0 && i < photos.length) {
      setIndex(i);
      setZoomed(false);
    }
  };

  return (
    <View style={s.fill}>
      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        scrollEnabled={!zoomed}
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: startIndex * width, y: 0 }}
        onMomentumScrollEnd={onPageScroll}
      >
        {photos.map((p) => (
          <View key={p.id} style={{ width, height }}>
            {p.source ? (
              <ScrollView
                style={{ width, height }}
                maximumZoomScale={6}
                minimumZoomScale={1}
                bouncesZoom
                centerContent
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onScroll={(e) => setZoomed(e.nativeEvent.zoomScale > 1.01)}
                scrollEventThrottle={64}
              >
                <Image
                  source={p.source}
                  style={{ width, height: Math.round(width / (p.ar ?? 1)) }}
                  resizeMode="contain"
                  accessibilityLabel={p.label}
                />
              </ScrollView>
            ) : (
              <ScrollView style={{ width, height }} contentContainerStyle={s.describedWrap}>
                <BodyText style={s.described}>{p.label}</BodyText>
              </ScrollView>
            )}
          </View>
        ))}
      </ScrollView>

      <View style={s.topBar}>
        <ChromeText style={s.when}>{current.when}</ChromeText>
        <Pressable onPress={onClose} hitSlop={12} style={s.done}>
          <ChromeText style={s.doneText}>Done</ChromeText>
        </Pressable>
      </View>

      <View style={s.bottomBar}>
        {current.caption ? (
          <BodyText style={s.caption}>{current.caption}</BodyText>
        ) : null}
        <ChromeText style={s.hint}>
          {photos.length > 1
            ? `${index + 1} of ${photos.length} · swipe · pinch to look closer`
            : 'pinch to look closer'}
        </ChromeText>
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
  doneText: { color: colors.accent, fontSize: 15 },
  bottomBar: { position: 'absolute', bottom: 30, left: 24, right: 24, alignItems: 'center' },
  caption: { fontSize: 15, color: colors.text, textAlign: 'center', marginBottom: 8 },
  hint: { fontSize: 12, color: colors.faint },
});
