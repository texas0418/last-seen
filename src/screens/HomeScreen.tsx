// src/screens/HomeScreen.tsx
// BrineOS home: a grid of the six apps. Badges are honest unread counts so
// the phone itself points at new evidence without ever explaining it.

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CALENDAR } from '../content/calendar';
import { EMAILS } from '../content/mail';
import { NOTES, PHOTOS, VOICEMAILS } from '../content/other';
import { THREADS } from '../content/threads';
import { StatusBarRow, ui } from '../engine/ui';
import { isVisible } from '../models';
import { flagSet, hasFlag, isRead } from '../state';
import { colors, fonts } from '../theme';

export type AppId =
  | 'messages'
  | 'mail'
  | 'voicemail'
  | 'notes'
  | 'photos'
  | 'calendar'
  | 'settings';

const APPS: { id: AppId; label: string; emoji: string }[] = [
  { id: 'messages', label: 'Messages', emoji: '💬' },
  { id: 'mail', label: 'Mail', emoji: '✉️' },
  { id: 'voicemail', label: 'Phone', emoji: '📞' },
  { id: 'notes', label: 'Notes', emoji: '📝' },
  { id: 'photos', label: 'Photos', emoji: '🌁' },
  { id: 'calendar', label: 'Calendar', emoji: '📅' },
  { id: 'settings', label: 'Settings', emoji: '⚙️' },
];

function unreadCount(app: AppId): number {
  const flags = flagSet();
  if (app === 'messages')
    return THREADS.filter((t) => isVisible(t, flags) && !isRead(t.id)).length;
  if (app === 'mail') {
    if (!hasFlag('act2')) return 1; // the locked account itself demands attention
    return EMAILS.filter(
      (e) =>
        isVisible(e, flags) &&
        !isRead(e.id) &&
        (e.account === 'personal' || hasFlag('act3')),
    ).length;
  }
  if (app === 'voicemail')
    return VOICEMAILS.filter((v) => isVisible(v, flags) && !isRead(v.id)).length;
  if (app === 'notes')
    return NOTES.filter((n) => isVisible(n, flags) && !isRead(n.id)).length;
  if (app === 'photos')
    return PHOTOS.filter((p) => isVisible(p, flags) && !isRead(p.id)).length;
  if (app === 'calendar')
    return CALENDAR.filter((c) => isVisible(c, flags) && !isRead(c.id)).length;
  return 0;
}

export default function HomeScreen({ onOpen }: { onOpen: (app: AppId) => void }) {
  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <Text style={s.owner}>Quinn’s phone</Text>
      <View style={s.grid}>
        {APPS.map((a) => {
          const n = unreadCount(a.id);
          return (
            <Pressable key={a.id} style={s.tile} onPress={() => onOpen(a.id)}>
              {n > 0 && (
                <View style={[ui.badge, s.tileBadge]}>
                  <Text style={ui.badgeText}>{n}</Text>
                </View>
              )}
              <Text style={s.tileEmoji}>{a.emoji}</Text>
              <Text style={s.tileLabel}>{a.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={s.footer}>BrineOS 11 · storage almost full</Text>
    </View>
  );
}

const s = StyleSheet.create({
  owner: {
    fontFamily: fonts.sans,
    color: colors.faint,
    textAlign: 'center',
    fontSize: 13,
    marginTop: 18,
    letterSpacing: 1,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 18,
    padding: 24,
  },
  tile: {
    width: 96,
    height: 96,
    borderRadius: 22,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileBadge: { position: 'absolute', top: -6, right: -6 },
  tileEmoji: { fontSize: 34 },
  tileLabel: { fontFamily: fonts.sans, fontSize: 12, color: colors.textDim, marginTop: 6 },
  footer: {
    textAlign: 'center',
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.faint,
    paddingBottom: 26,
  },
});
