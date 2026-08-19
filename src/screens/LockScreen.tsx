// src/screens/LockScreen.tsx
// Quinn's lock screen: the fair-photo wallpaper, notification previews that
// seed the cast, and a 4-digit keypad. The passcode's clue is IN the
// wallpaper — tapping any photo opens the zoomable viewer (pinch + pan),
// taught here once; every photo in the game works the same way.

import { useState } from 'react';
import {
  Image, Pressable, ScrollView, StyleSheet, View, useWindowDimensions,
} from 'react-native';

import { PHOTOS } from '../content/other';
import { checkGate, gateById } from '../engine/gates';
import { PhotoViewer } from '../engine/PhotoViewer';
import { BodyText, ChromeText, StatusBarRow, ui } from '../engine/ui';
import { PHOTO_ART } from '../photoAssets';
import { setFlag } from '../state';
import { colors, fonts } from '../theme';

const PREVIEWS = [
  { app: 'Phone', line: 'Mom · 6 missed calls' },
  { app: 'Messages', line: 'Dae 🌙 · i’m watering your plants. you’re coming…' },
  { app: 'Messages', line: 'NO CALLER ID · that phone went dark six days a…' },
];

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

export default function LockScreen() {
  const [entry, setEntry] = useState('');
  const [wrongs, setWrongs] = useState(0);
  const [closer, setCloser] = useState(false);
  const { width } = useWindowDimensions();
  // explicit pixel size — see PhotoViewer note (18pt screen + 16pt card padding, 1pt border)
  const wallW = width - 2 * (18 + 16 + 1);
  const wallpaper = PHOTOS.find((p) => p.id === 'ph-wallpaper')!;

  const press = (k: string) => {
    if (k === '⌫') return setEntry(entry.slice(0, -1));
    if (!k || entry.length >= 4) return;
    const next = entry + k;
    if (next.length < 4) return setEntry(next);
    if (checkGate('passcode', next)) return setFlag('phoneUnlocked');
    const wrong = gateById('passcode').wrong;
    setWrongs(wrongs + 1);
    setEntry('');
    setWarning(wrong[Math.min(wrongs, wrong.length - 1)]);
  };
  const [warning, setWarning] = useState('');

  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        <Pressable style={s.wallpaper} onPress={() => setCloser(true)}>
          {PHOTO_ART[wallpaper.id] ? (
            <Image
              source={PHOTO_ART[wallpaper.id].image}
              style={[s.wallpaperCover, { width: wallW }]}
              resizeMode="cover"
              accessibilityLabel={wallpaper.alt}
            />
          ) : (
            <>
              <ChromeText style={s.wallpaperEmoji}>{wallpaper.emoji}</ChromeText>
              <BodyText style={s.wallpaperAlt}>{wallpaper.alt}</BodyText>
            </>
          )}
          <ChromeText style={s.closerHint}>tap to look closer</ChromeText>
        </Pressable>
        {PREVIEWS.map((p, i) => (
          <View key={i} style={s.notif}>
            <ChromeText style={s.notifApp}>{p.app}</ChromeText>
            <BodyText style={s.notifLine} numberOfLines={1}>
              {p.line}
            </BodyText>
          </View>
        ))}
        <ChromeText style={s.dots}>{'●'.repeat(entry.length).padEnd(4, '○')}</ChromeText>
        {warning ? <ChromeText style={s.warning}>{warning}</ChromeText> : null}
        <View style={s.pad}>
          {KEYS.map((k, i) => (
            <Pressable key={i} style={[s.key, !k && { opacity: 0 }]} onPress={() => press(k)}>
              <ChromeText style={s.keyText}>{k}</ChromeText>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {closer && PHOTO_ART[wallpaper.id] ? (
        <PhotoViewer
          source={PHOTO_ART[wallpaper.id].image}
          ar={PHOTO_ART[wallpaper.id].ar}
          label={wallpaper.closer ?? wallpaper.alt}
          when={wallpaper.when}
          caption={wallpaper.caption}
          onClose={() => setCloser(false)}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  wallpaper: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 16,
    marginBottom: 14,
  },
  wallpaperImg: { width: '100%', borderRadius: 12, backgroundColor: colors.hairline },
  wallpaperCover: {
    height: 230,
    borderRadius: 12,
    backgroundColor: colors.hairline,
  },
  wallpaperEmoji: { fontSize: 34, textAlign: 'center', marginBottom: 8 },
  wallpaperAlt: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textDim,
    fontStyle: 'italic',
  },
  closerHint: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.faint,
    textAlign: 'center',
    marginTop: 8,
  },
  notif: {
    backgroundColor: 'rgba(20,24,31,0.85)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  notifApp: { fontFamily: fonts.sans, fontSize: 11, color: colors.faint, marginBottom: 2 },
  notifLine: { fontFamily: fonts.sans, fontSize: 14, color: colors.text },
  dots: {
    textAlign: 'center',
    color: colors.ghost,
    fontSize: 22,
    letterSpacing: 14,
    marginVertical: 12,
  },
  warning: {
    textAlign: 'center',
    color: colors.badge,
    fontFamily: fonts.mono,
    fontSize: 12,
    marginBottom: 6,
  },
  pad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 260,
    alignSelf: 'center',
  },
  key: {
    width: 72,
    height: 56,
    margin: 6,
    borderRadius: 28,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { color: colors.text, fontSize: 24, fontFamily: fonts.sans },
});
