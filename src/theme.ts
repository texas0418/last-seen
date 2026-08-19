// src/theme.ts — Last Seen renders a PHONE, not an app. The whole game is the
// screen of Quinn's "BrinePhone" — a slightly-off fictional OS. Dark-only by
// design: the player is Casey at a kitchen table at night. The palette is
// OLED black with cold blues (the phone's chrome), one warm accent for
// notification badges/danger, and paper-white message text.

import { Platform } from 'react-native';

export const colors = {
  bg: '#0a0c10', // OLED black with a breath of blue
  panel: '#14181f', // cards, bubbles (theirs), app tiles
  panelBorder: '#232a35',
  hairline: '#1a1f28',
  text: '#dde3ea', // primary reading text
  textDim: '#8b95a3', // timestamps, previews
  faint: '#4a5361', // hints, placeholders, footers
  accent: '#6ea8d8', // BrineOS chrome blue: links, sent bubbles, toggles
  accentDeep: '#2b5d8a', // sent-bubble fill
  badge: '#d0654f', // unread badges, warnings — the one warm thing
  ghost: '#93a89a', // Quinn's presence: lock screen, decoded cipher text
  ok: '#7fae8b',
} as const;

/**
 * Dynamic Type ceilings (maxFontSizeMultiplier) per surface. React 19
 * silently ignores Text.defaultProps, so these must ride every component —
 * use the capped wrappers in src/engine/ui.tsx (ChromeText / BodyText /
 * PuzzleText / ChromeTextInput), never raw <Text>. Anchored on the old
 * (dead) global cap of 1.4:
 * - chrome 1.3: BrineOS furniture — status bar, headers, app tiles, rows,
 *   keypads, chips, buttons. Tighter than the old global: the fake phone
 *   only reads as a real phone if its chrome keeps OS proportions.
 * - body 1.6: evidence prose — bubbles, mail, notes, transcripts, photo
 *   alt/closer text, Casey's narration. Reading IS the game; scale
 *   generously past the old global.
 * - puzzle 1.2: ciphertext and decoder surfaces — the fixed-width cell
 *   grid, its key tray, the ciphered login hint. Alignment is the puzzle,
 *   and doctrine says ciphertext stays crisp.
 */
export const TYPE_CAPS = {
  chrome: 1.3,
  body: 1.6,
  puzzle: 1.2,
} as const;

export const fonts = {
  /** Everything the phone renders — a modern OS is sans. */
  // iOS: UNSET so the OS renders SF Pro — the actual iPhone system font.
  // Naming a family here gets a legacy face that reads spindly/stretched,
  // especially in TextInput placeholders. Mono/serif stay deliberate.
  sans: Platform.select({ ios: undefined, default: 'sans-serif' }) as unknown as string,
  /** Ciphertext, passwords, timestamps, the decoder. */
  mono: Platform.select({ ios: 'Menlo', default: 'monospace' })!,
  /** Casey's narration between screens — the only non-phone voice. */
  serif: Platform.select({ ios: 'Georgia', default: 'serif' })!,
} as const;

export const type = {
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 22, color: colors.text },
  dim: { fontFamily: fonts.sans, fontSize: 13, color: colors.textDim },
  chrome: { fontFamily: fonts.sans, fontSize: 12, color: colors.faint, letterSpacing: 0.5 },
  mono: { fontFamily: fonts.mono, fontSize: 15, color: colors.ghost, letterSpacing: 1 },
  narration: { fontFamily: fonts.serif, fontSize: 18, lineHeight: 30, color: colors.text },
} as const;
