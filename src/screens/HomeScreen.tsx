// src/screens/HomeScreen.tsx
// BrineOS home: a ledger of the phone's apps, one row each, the way a small
// carrier's OS might do it. Unread counts are honest and written out, so the
// phone points at new evidence without a red badge ever explaining it.

import { Pressable, StyleSheet, View } from 'react-native';

import { CALENDAR } from '../content/calendar';
import { EMAILS } from '../content/mail';
import { NOTES, PHOTOS, VOICEMAILS } from '../content/other';
import { THREADS } from '../content/threads';
import { ChromeText, StatusBarRow, ui } from '../engine/ui';
import { isVisible } from '../models';
import { threadUnreadCount } from '../engine/script';
import { flagSet, hasFlag, isRead, readStamp, scriptIndex } from '../state';
import { colors, fonts } from '../theme';

export type AppId =
  | 'messages'
  | 'mail'
  | 'voicemail'
  | 'notes'
  | 'photos'
  | 'calendar'
  | 'settings';

const APPS: { id: AppId; label: string; code: string }[] = [
  { id: 'messages', label: 'Messages', code: 'MSG' },
  { id: 'mail', label: 'Mail', code: 'MAIL' },
  { id: 'voicemail', label: 'Phone', code: 'TEL' },
  { id: 'notes', label: 'Notes', code: 'NOTE' },
  { id: 'photos', label: 'Photos', code: 'IMG' },
  { id: 'calendar', label: 'Calendar', code: 'CAL' },
  { id: 'settings', label: 'Settings', code: 'SYS' },
];

function unreadCount(app: AppId): number {
  const flags = flagSet();
  if (app === 'messages')
    return THREADS.filter((t) => isVisible(t, flags)).reduce(
      (n, t) =>
        n + threadUnreadCount(t, flags, scriptIndex(t.id), hasFlag, readStamp(t.id)),
      0,
    );
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
      <ChromeText style={s.owner}>Quinn’s phone</ChromeText>
      <View style={s.list}>
        {APPS.map((a) => {
          const n = unreadCount(a.id);
          return (
            <Pressable key={a.id} style={s.row} onPress={() => onOpen(a.id)}>
              <View style={s.codeBox}>
                <ChromeText style={s.code}>{a.code}</ChromeText>
              </View>
              <ChromeText style={s.rowLabel}>{a.label}</ChromeText>
              <ChromeText style={[s.rowCount, n > 0 && s.rowCountOn]}>
                {n > 0 ? `${n} unread` : ''}
              </ChromeText>
            </Pressable>
          );
        })}
      </View>
      <ChromeText style={s.footer}>BrineOS 11 · storage almost full</ChromeText>
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
  list: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.panel,
    borderLeftWidth: 3,
    borderLeftColor: colors.accentDeep,
  },
  codeBox: {
    width: 52,
    paddingVertical: 4,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    alignItems: 'center',
  },
  code: { fontFamily: fonts.mono, fontSize: 11, color: colors.accent, letterSpacing: 1 },
  rowLabel: { flex: 1, fontFamily: fonts.sans, fontSize: 16, color: colors.text },
  rowCount: { fontFamily: fonts.mono, fontSize: 12, color: colors.faint },
  rowCountOn: { color: colors.badge },
  footer: {
    textAlign: 'center',
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.faint,
    paddingBottom: 26,
  },
});
