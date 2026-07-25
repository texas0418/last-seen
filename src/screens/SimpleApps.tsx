// src/screens/SimpleApps.tsx
// The three quiet surfaces: Phone (voicemail transcripts), Notes, Photos.
// Photos carry the long-press "look closer" gesture taught on the lock
// screen — the closer layer is where zoom-level details live.

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { NOTES, PHOTOS, VOICEMAILS } from '../content/other';
import { AppHeader, StatusBarRow, ui } from '../engine/ui';
import { isVisible } from '../models';
import { flagSet, markRead } from '../state';
import { colors, fonts } from '../theme';

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
          <Text style={s.transcriptLabel}>TRANSCRIPT (audio unavailable)</Text>
          <Text style={s.transcript}>{open.transcript}</Text>
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
            <Text style={ui.rowTitle}>{v.from}</Text>
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
          <Text style={s.note}>{open.body}</Text>
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
            <Text style={ui.rowTitle}>{n.title}</Text>
            <Text style={ui.rowSub}>{n.when}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export function PhotosScreen({ onBack }: { onBack: () => void }) {
  const [closerId, setCloserId] = useState<string | null>(null);
  const items = PHOTOS.filter((p) => isVisible(p, flagSet()));
  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <AppHeader title="Photos" subtitle="hold a photo to look closer" onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 14 }}>
        {items.map((p) => {
          markRead(p.id);
          const closer = closerId === p.id && p.closer;
          return (
            <Pressable
              key={p.id}
              style={s.photo}
              onLongPress={() => setCloserId(p.id)}
              onPress={() => setCloserId(null)}
              delayLongPress={600}
            >
              <Text style={s.photoEmoji}>{p.emoji}</Text>
              <Text style={[s.photoAlt, closer ? { color: colors.ghost } : null]}>
                {closer ? p.closer : p.alt}
              </Text>
              {p.caption ? <Text style={s.photoCaption}>“{p.caption}”</Text> : null}
              <Text style={s.photoWhen}>{p.when}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
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
