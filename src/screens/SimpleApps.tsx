// src/screens/SimpleApps.tsx
// The three quiet surfaces: Phone (voicemail transcripts), Notes, Photos.
// Photos carry the long-press "look closer" gesture taught on the lock
// screen — the closer layer is where zoom-level details live.

import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { useEffect, useState } from 'react';
import {
  Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions,
} from 'react-native';

import { VM_AUDIO } from '../audioAssets';
import { NOTES, PHOTOS, VOICEMAILS } from '../content/other';
import { PhotoViewer } from '../engine/PhotoViewer';
import { AppHeader, StatusBarRow, ui } from '../engine/ui';
import { isVisible } from '../models';
import { PHOTO_ART } from '../photoAssets';
import { flagSet, isRead, markRead } from '../state';
import { colors, fonts } from '../theme';

function VoicemailPlayer({ source }: { source: number }) {
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true });
  }, []);
  const toggle = () => {
    if (status.playing) player.pause();
    else {
      if (status.didJustFinish || status.currentTime >= status.duration - 0.1)
        player.seekTo(0);
      player.play();
    }
  };
  return (
    <Pressable style={s.playRow} onPress={toggle}>
      <Text style={s.playBtn}>{status.playing ? '❙❙' : '▶'}</Text>
      <View style={s.playTrack}>
        <View
          style={[
            s.playFill,
            {
              width: `${Math.min(
                100,
                (status.currentTime / Math.max(status.duration, 0.1)) * 100,
              )}%`,
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

export function VoicemailScreen({ onBack }: { onBack: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const items = VOICEMAILS.filter((v) => isVisible(v, flagSet()));
  const open = items.find((v) => v.id === openId);
  if (open) {
    markRead(open.id);
    return (
      <View style={ui.screen}>
        <StatusBarRow />
        <AppHeader title={open.from} subtitle={`${open.when} · ${open.duration}`} onBack={() => setOpenId(null)} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {VM_AUDIO[open.id] != null && <VoicemailPlayer source={VM_AUDIO[open.id]} />}
          <Text style={s.transcriptLabel}>
            {VM_AUDIO[open.id] != null ? 'TRANSCRIPT' : 'TRANSCRIPT (audio unavailable)'}
          </Text>
          <Text selectable style={s.transcript}>{open.transcript}</Text>
        </ScrollView>
      </View>
    );
  }
  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <AppHeader title="Voicemail" onBack={onBack} />
      <ScrollView>
        {items.map((v) => (
          <Pressable key={v.id} style={ui.row} onPress={() => setOpenId(v.id)}>
            <Text style={[ui.rowTitle, !isRead(v.id) && ui.rowTitleUnread]}>
              {!isRead(v.id) ? <Text style={ui.unreadDot}>{'● '}</Text> : null}
              {v.from}
            </Text>
            <Text style={ui.rowSub}>
              {v.when} · {v.duration}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export function NotesScreen({ onBack }: { onBack: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const items = NOTES.filter((n) => isVisible(n, flagSet()));
  const open = items.find((n) => n.id === openId);
  if (open) {
    markRead(open.id);
    return (
      <View style={ui.screen}>
        <StatusBarRow />
        <AppHeader title={open.title} subtitle={open.when} onBack={() => setOpenId(null)} />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text selectable style={s.note}>{open.body}</Text>
        </ScrollView>
      </View>
    );
  }
  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <AppHeader title="Notes" onBack={onBack} />
      <ScrollView>
        {items.map((n) => (
          <Pressable key={n.id} style={ui.row} onPress={() => setOpenId(n.id)}>
            <Text style={[ui.rowTitle, !isRead(n.id) && ui.rowTitleUnread]}>
              {!isRead(n.id) ? <Text style={ui.unreadDot}>{'● '}</Text> : null}
              {n.title}
            </Text>
            <Text style={ui.rowSub}>{n.when}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export function PhotosScreen({ onBack }: { onBack: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [closerId, setCloserId] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  // Explicit pixel size — percentage width on Image is unreliable here and
  // falls back to the bitmap's intrinsic size (see PhotoViewer note).
  // 14pt list padding + 16pt card padding + 1pt border, each side.
  const imgW = width - 2 * (14 + 16 + 1);
  const items = PHOTOS.filter((p) => isVisible(p, flagSet()));
  const open = items.find((p) => p.id === openId);
  const openArt = open ? PHOTO_ART[open.id] : undefined;
  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <AppHeader title="Photos" subtitle="tap a photo to look closer" onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 14 }}>
        {items.map((p) => {
          markRead(p.id);
          const art = PHOTO_ART[p.id];
          const closer = closerId === p.id && p.closer;
          return (
            <Pressable
              key={p.id}
              style={s.photo}
              onPress={() => (art ? setOpenId(p.id) : setCloserId(closer ? null : p.id))}
              onLongPress={() => setCloserId(p.id)}
              delayLongPress={600}
            >
              {art ? (
                <Image
                  source={art.image}
                  style={[s.photoImg, { width: imgW, height: Math.round(imgW / art.ar) }]}
                  accessibilityLabel={p.alt}
                />
              ) : (
                <>
                  <Text style={s.photoEmoji}>{p.emoji}</Text>
                  <Text style={[s.photoAlt, closer ? { color: colors.ghost } : null]}>
                    {closer ? p.closer : p.alt}
                  </Text>
                </>
              )}
              {p.caption ? <Text style={s.photoCaption}>“{p.caption}”</Text> : null}
              <Text style={s.photoWhen}>{p.when}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {open && openArt ? (
        <PhotoViewer
          source={openArt.image}
          ar={openArt.ar}
          label={open.closer ?? open.alt}
          onClose={() => setOpenId(null)}
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  playRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
  },
  playBtn: { color: colors.accent, fontSize: 18, width: 24, textAlign: 'center' },
  playTrack: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.hairline },
  playFill: { height: 4, borderRadius: 2, backgroundColor: colors.accent },
  transcriptLabel: { fontFamily: fonts.mono, fontSize: 11, color: colors.faint, marginBottom: 12 },
  transcript: { fontFamily: fonts.sans, fontSize: 17, lineHeight: 27, color: colors.text },
  note: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 26, color: colors.text },
  photo: {
    backgroundColor: colors.panel,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 16,
    marginBottom: 12,
  },
  photoImg: { borderRadius: 10, backgroundColor: colors.hairline },
  photoEmoji: { fontSize: 30, textAlign: 'center', marginBottom: 8 },
  photoAlt: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textDim,
    fontStyle: 'italic',
  },
  photoCaption: { fontFamily: fonts.sans, fontSize: 13, color: colors.text, marginTop: 8 },
  photoWhen: { fontFamily: fonts.sans, fontSize: 11, color: colors.faint, marginTop: 6 },
});
