// src/engine/Decoder.tsx
// The by-hand cryptogram surface for the unsent draft. The player taps a
// cipher letter, then picks what they believe it stands for. No frequency
// helper, no "auto" button, no validation until the whole text resolves —
// the length of the draft IS the difficulty. When every letter present is
// mapped correctly the plaintext settles in and `onDecoded` fires once.

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { decoderMapping, setDecoderMapping } from '../state';
import { colors, fonts } from '../theme';
import { applyMapping, cipherLetters, isFullyDecoded } from './cipher';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default function Decoder({
  draftId,
  ciphertext,
  onDecoded,
}: {
  draftId: string;
  ciphertext: string;
  onDecoded: () => void;
}) {
  const [mapping, setMapping] = useState<Record<string, string>>(() =>
    decoderMapping(draftId),
  );
  const [picking, setPicking] = useState<string | null>(null);
  const solved = isFullyDecoded(ciphertext, mapping);

  const assign = (plain: string) => {
    if (!picking) return;
    const next = { ...mapping };
    if (next[picking] === plain) delete next[picking];
    else next[picking] = plain;
    setMapping(next);
    setDecoderMapping(draftId, next);
    setPicking(null);
    if (isFullyDecoded(ciphertext, next)) onDecoded();
  };

  const rendered = applyMapping(ciphertext, mapping);
  const letters = cipherLetters(ciphertext);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18 }}>
        <Text style={s.hintLine}>
          {solved
            ? 'the letters have stopped fighting you.'
            : 'tap a letter below, then tell it what it really is.'}
        </Text>
        <Text style={s.cipherBlock}>
          {rendered.map((r, i) => (
            <Text key={i} style={r.decoded ? s.plain : s.cipher}>
              {r.ch}
            </Text>
          ))}
        </Text>
      </ScrollView>
      <View style={s.tray}>
        {picking ? (
          <View style={s.grid}>
            <Text style={s.trayLabel}>“{picking.toUpperCase()}” is really…</Text>
            <View style={s.gridRow}>
              {ALPHABET.map((p) => (
                <Pressable key={p} style={s.key} onPress={() => assign(p)}>
                  <Text style={s.keyText}>{p.toUpperCase()}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable onPress={() => setPicking(null)}>
              <Text style={s.cancel}>cancel</Text>
            </Pressable>
          </View>
        ) : (
          <View style={s.gridRow}>
            {letters.map((c) => (
              <Pressable key={c} style={s.key} onPress={() => setPicking(c)}>
                <Text style={[s.keyText, mapping[c] && s.keyMapped]}>
                  {c.toUpperCase()}
                  {mapping[c] ? `→${mapping[c].toUpperCase()}` : ''}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hintLine: { fontFamily: fonts.sans, fontSize: 13, color: colors.faint, marginBottom: 14 },
  cipherBlock: { lineHeight: 32 },
  cipher: { fontFamily: fonts.mono, fontSize: 17, color: colors.textDim, letterSpacing: 1.5 },
  plain: { fontFamily: fonts.mono, fontSize: 17, color: colors.ghost, letterSpacing: 1.5 },
  tray: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
    padding: 10,
    paddingBottom: 28,
  },
  grid: { alignItems: 'center' },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  trayLabel: { fontFamily: fonts.sans, fontSize: 13, color: colors.textDim, marginBottom: 8 },
  key: {
    backgroundColor: colors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    paddingHorizontal: 8,
    paddingVertical: 7,
    margin: 2,
  },
  keyText: { fontFamily: fonts.mono, fontSize: 13, color: colors.text },
  keyMapped: { color: colors.ghost },
  cancel: { fontFamily: fonts.sans, color: colors.accent, marginTop: 10 },
});
