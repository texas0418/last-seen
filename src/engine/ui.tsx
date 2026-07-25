// src/engine/ui.tsx
// The BrineOS chrome every fake app shares: status bar, headers, rows,
// bubbles. The status bar's clock and battery are SCRIPTED — the night at
// Casey's kitchen table advances as acts unlock, and the battery only falls.

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { hasFlag } from '../state';
import { colors, fonts } from '../theme';

export function phoneClock(): { time: string; battery: number } {
  if (hasFlag('draftDecoded')) return { time: '4:44 AM', battery: 9 };
  if (hasFlag('act3')) return { time: '3:08 AM', battery: 23 };
  if (hasFlag('act2')) return { time: '1:23 AM', battery: 47 };
  return { time: '11:47 PM', battery: 61 };
}

export function StatusBarRow() {
  const { time, battery } = phoneClock();
  const airplane = hasFlag('airplaneMode');
  return (
    <View style={ui.status}>
      <Text style={ui.statusText}>{airplane ? '✈' : 'BrineTel'}</Text>
      <Text style={ui.statusText}>{time}</Text>
      <Text style={[ui.statusText, battery <= 15 && { color: colors.badge }]}>
        {battery}%
      </Text>
    </View>
  );
}

export function AppHeader({
  title,
  onBack,
  subtitle,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  return (
    <View style={ui.header}>
      <Pressable onPress={onBack} hitSlop={12}>
        <Text style={ui.back}>‹</Text>
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={ui.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={ui.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

export function Bubble({ from, body }: { from: 'them' | 'me' | 'quinn'; body: string }) {
  const mine = from !== 'them';
  return (
    <View style={[ui.bubble, mine ? ui.bubbleMe : ui.bubbleThem]}>
      <Text style={[ui.bubbleText, mine && { color: '#eef4fa' }]}>{body}</Text>
    </View>
  );
}

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  status: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 6,
  },
  statusText: { fontFamily: fonts.mono, fontSize: 12, color: colors.textDim },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  back: { color: colors.accent, fontSize: 34, lineHeight: 34, paddingHorizontal: 6 },
  title: { fontFamily: fonts.sans, fontSize: 17, fontWeight: '600', color: colors.text },
  subtitle: { fontFamily: fonts.sans, fontSize: 12, color: colors.faint },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairline,
  },
  rowTitle: { fontFamily: fonts.sans, fontSize: 16, fontWeight: '600', color: colors.text },
  rowSub: { fontFamily: fonts.sans, fontSize: 13, color: colors.textDim, marginTop: 3 },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.badge,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginVertical: 3,
  },
  bubbleThem: { backgroundColor: colors.panel, alignSelf: 'flex-start' },
  bubbleMe: { backgroundColor: colors.accentDeep, alignSelf: 'flex-end' },
  bubbleText: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 21, color: colors.text },
  chip: {
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginVertical: 4,
    alignSelf: 'flex-end',
  },
  chipText: { color: colors.accent, fontFamily: fonts.sans, fontSize: 15 },
  input: {
    backgroundColor: colors.panel,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    color: colors.text,
    fontFamily: fonts.sans,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
});
