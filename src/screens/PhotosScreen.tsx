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
import { PhotoViewer } from '../engine/PhotoViewer';
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
  const tile = Math.floor((width - GAP * (COLS - 1)) / COLS);
  const items = PHOTOS.filter((p) => isVisible(p, flagSet()));
  const open = items.find((p) => p.id === openId);
  const openArt = open ? PHOTO_ART[open.id] : undefined;

  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <AppHeader title="Photos" onBack={onBack} />
      <ScrollView>
        <ChromeText style={s.count}>{items.length} Items</ChromeText>
        <View style={s.grid}>
          {items.map((p) => {
            markRead(p.id);
            const art = PHOTO_ART[p.id];
            return (
              <Pressable
                key={p.id}
                onPress={() => setOpenId(p.id)}
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
      {open ? (
        <PhotoViewer
          source={openArt?.image}
          ar={openArt?.ar}
          label={open.closer ?? open.alt}
          when={open.when}
          caption={open.caption}
          described={openArt ? undefined : open.alt}
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
