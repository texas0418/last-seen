// src/screens/PhotosScreen.tsx
// A real phone's camera roll: a dense square grid, no captions, no dates,
// nothing to scan. Every thumbnail looks equally unimportant — which is the
// whole point of the noise pass. The date and caption live INSIDE the
// viewer, so reading them is an act, not a glance.

import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import { PHOTOS } from '../content/other';
import { PhotoViewer, type ViewerPhoto } from '../engine/PhotoViewer';
import { AppHeader, ChromeText, StatusBarRow, ui } from '../engine/ui';
import { isVisible } from '../models';
import { PHOTO_ART } from '../photoAssets';
import { flagSet, markRead } from '../state';
import { colors, fonts } from '../theme';

const GAP = 2;
const COLS = 3;

export default function PhotosScreen({ onBack }: { onBack: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  // every tile carries marginRight, including the last in a row, so the
  // row costs COLS*(tile+GAP) — budget for COLS gaps, not COLS-1, or three
  // tiles overflow by a hair and the grid silently wraps to two columns
  const tile = Math.floor((width - GAP * COLS) / COLS);
  const items = PHOTOS.filter((p) => isVisible(p, flagSet()));
  // the viewer pages through the whole roll, like real Photos
  const viewerPhotos: ViewerPhoto[] = items.map((p) => ({
    id: p.id,
    when: p.when,
    caption: p.caption,
    label: p.closer ?? p.alt,
    source: PHOTO_ART[p.id]?.image,
    ar: PHOTO_ART[p.id]?.ar,
  }));
  const openIndex = items.findIndex((p) => p.id === openId);

  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <AppHeader title="Photos" onBack={onBack} />
      <ScrollView>
        <ChromeText style={s.count}>{items.length} Items</ChromeText>
        <View style={s.grid}>
          {items.map((p) => {
            const art = PHOTO_ART[p.id];
            return (
              <Pressable
                key={p.id}
                onPress={() => {
                  markRead(p.id);
                  setOpenId(p.id);
                }}
                style={{ width: tile, height: tile, marginRight: GAP, marginBottom: GAP }}
              >
                {art ? (
                  <Image
                    source={art.image}
                    style={{ width: tile, height: tile }}
                    resizeMode="cover"
                    accessibilityLabel={p.alt}
                  />
                ) : (
                  <View style={[s.fallback, { width: tile, height: tile }]}>
                    <ChromeText style={s.fallbackGlyph}>{p.emoji}</ChromeText>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      {openIndex >= 0 ? (
        <PhotoViewer
          photos={viewerPhotos}
          startIndex={openIndex}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  count: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.faint,
    textAlign: 'center',
    paddingVertical: 10,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  fallback: {
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackGlyph: { fontSize: 26 },
});
