// src/screens/SimpleApps.tsx
// The two quiet surfaces: Phone (voicemail + audio) and Notes. Photos is
// its own screen (PhotosScreen.tsx).



import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { VM_AUDIO } from '../audioAssets';
import { NOTES, VOICEMAILS } from '../content/other';
import { AppHeader, BodyText, ChromeText, StatusBarRow, ui } from '../engine/ui';
import { isVisible } from '../models';
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
      <ChromeText style={s.playBtn}>{status.playing ? '❙❙' : '▶'}</ChromeText>
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
          <ChromeText style={s.transcriptLabel}>
            {VM_AUDIO[open.id] != null ? 'TRANSCRIPT' : 'TRANSCRIPT (audio unavailable)'}
          </ChromeText>
          <BodyText selectable style={s.transcript}>{open.transcript}</BodyText>
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
            <ChromeText style={[ui.rowTitle, !isRead(v.id) && ui.rowTitleUnread]}>
              {!isRead(v.id) ? <ChromeText style={ui.unreadDot}>{'● '}</ChromeText> : null}
              {v.from}
            </ChromeText>
            <ChromeText style={ui.rowSub}>
              {v.when} · {v.duration}
            </ChromeText>
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
          <BodyText selectable style={s.note}>{open.body}</BodyText>
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
            <ChromeText style={[ui.rowTitle, !isRead(n.id) && ui.rowTitleUnread]}>
              {!isRead(n.id) ? <ChromeText style={ui.unreadDot}>{'● '}</ChromeText> : null}
              {n.title}
            </ChromeText>
            <ChromeText style={ui.rowSub}>{n.when}</ChromeText>
          </Pressable>
        ))}
      </ScrollView>
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
});
