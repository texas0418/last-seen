// src/engine/ui.tsx
// The BrineOS chrome every fake app shares: status bar, headers, rows,
// bubbles. The status bar's clock and battery are SCRIPTED — the night at
// Casey's kitchen table advances as acts unlock, and the battery only falls.

import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type TextProps,
  View,
} from 'react-native';

import { hasFlag } from '../state';
import { colors, fonts, TYPE_CAPS } from '../theme';

// Text with explicit Dynamic Type ceilings (theme.TYPE_CAPS). Use these
// instead of raw <Text>: Text.defaultProps is silently dead under React 19,
// so the cap must ride every component.

/** BrineOS furniture: status bar, headers, tiles, rows, keypads, buttons. */
export const ChromeText = (props: TextProps) => (
  <Text maxFontSizeMultiplier={TYPE_CAPS.chrome} {...props} />
);

/** Evidence prose: bubbles, mail, notes, transcripts, narration. */
export const BodyText = (props: TextProps) => (
  <Text maxFontSizeMultiplier={TYPE_CAPS.body} {...props} />
);

/** Ciphertext and decoder cells: tight — alignment IS the puzzle. */
export const PuzzleText = (props: TextProps) => (
  <Text maxFontSizeMultiplier={TYPE_CAPS.puzzle} {...props} />
);

export const ChromeTextInput = (props: TextInputProps) => (
  <TextInput maxFontSizeMultiplier={TYPE_CAPS.chrome} {...props} />
);

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
      <ChromeText style={ui.statusText}>{airplane ? '✈' : 'BrineTel'}</ChromeText>
      <ChromeText style={ui.statusText}>{time}</ChromeText>
      <ChromeText style={[ui.statusText, battery <= 15 && { color: colors.badge }]}>
        {battery}%
      </ChromeText>
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
        <ChromeText style={ui.back}>‹</ChromeText>
      </Pressable>
      <View style={{ flex: 1 }}>
        <ChromeText style={ui.title} numberOfLines={1}>
          {title}
        </ChromeText>
        {subtitle ? <ChromeText style={ui.subtitle}>{subtitle}</ChromeText> : null}
      </View>
    </View>
  );
}

export function Bubble({ from, body }: { from: 'them' | 'me' | 'quinn'; body: string }) {
  const mine = from !== 'them';
  return (
    <View style={[ui.bubble, mine ? ui.bubbleMe : ui.bubbleThem]}>
      <BodyText selectable style={[ui.bubbleText, mine && { color: '#eef4fa' }]}>{body}</BodyText>
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
  unreadDot: { color: colors.accent, fontSize: 11 },
  /** iOS Messages-style unread mark: a small blue dot, never a red pill. */
  threadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginLeft: 8,
  },
  rowTitleUnread: { fontWeight: '600' },
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
    // long labels must stay visibly right-aligned options, never wrap into
    // something that reads as a full-width incoming message
    maxWidth: '82%',
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
