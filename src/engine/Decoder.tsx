// src/engine/Decoder.tsx
// The by-hand cryptogram surface for the unsent draft, using the standard
// cryptogram interaction: tap a letter IN the ciphertext (all instances
// highlight), then type the guess on the A–Z row below — it fills every
// instance at once. Tap a solved letter to change it; ⌫ clears the selected
// letter; "start over" (with confirm) wipes the whole mapping. No frequency
// helper, no validation until the whole text resolves — the length of the
// draft IS the difficulty. When every letter maps correctly, onDecoded fires.

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { decoderMapping, setDecoderMapping } from '../state';
import { colors, fonts } from '../theme';
import { isFullyDecoded } from './cipher';

const ROWS = ['abcdefghi', 'jklmnopqr', 'stuvwxyz'].map((r) => r.split(''));

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
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);
  const solved = isFullyDecoded(ciphertext, mapping);

  const save = (next: Record<string, string>) => {
    setMapping(next);
    setDecoderMapping(draftId, next);
    if (isFullyDecoded(ciphertext, next)) onDecoded();
  };

  const type = (plain: string) => {
    if (!selected) return;
    const next = { ...mapping };
    if (next[selected] === plain) delete next[selected];
    else next[selected] = plain;
    save(next);
  };

  const clearSelected = () => {
    if (!selected || !mapping[selected]) return;
    const next = { ...mapping };
    delete next[selected];
    save(next);
  };

  const wipe = () => {
    setConfirmWipe(false);
    setSelected(null);
    save({});
  };

  // plain letters used by 2+ cipher letters -> conflict, flagged not blocked
  const useCount: Record<string, number> = {};
  for (const p of Object.values(mapping)) useCount[p] = (useCount[p] ?? 0) + 1;
  const conflicted = (c: string) => {
    const p = mapping[c];
    return p != null && useCount[p] > 1;
  };

  // word-safe wrapping: each word is its own Text so lines break at spaces
  const words = ciphertext.split(/(\s+)/).filter((w) => w.trim().length > 0);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18 }}>
        <Text style={s.hintLine}>
          {solved
            ? 'the letters have stopped fighting you.'
            : selected
              ? `every “${selected.toUpperCase()}” is lit. type what it really is.`
              : 'tap a letter in the message. then type what it really is.'}
        </Text>
        <View style={s.words}>
          {words.map((word, wi) => (
            <View key={wi} style={s.word}>
              {word.split('').map((ch, i) => {
                const lower = ch.toLowerCase();
                const isLetter = lower >= 'a' && lower <= 'z';
                if (!isLetter)
                  return (
                    <Text key={i} style={s.punct}>
                      {ch}
                    </Text>
                  );
                const mapped = mapping[lower];
                const isSel = selected === lower;
                return (
                  <Pressable key={i} onPress={() => setSelected(isSel ? null : lower)}>
                    <View style={[s.cell, isSel && s.cellSel]}>
                      <Text
                        style={[
                          s.cellGuess,
                          conflicted(lower) && s.cellConflict,
                          !mapped && s.cellEmpty,
                        ]}
                      >
                        {mapped ? mapped.toUpperCase() : '·'}
                      </Text>
                      <Text style={[s.cellCipher, isSel && s.cellCipherSel]}>
                        {lower.toUpperCase()}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={s.tray}>
        {ROWS.map((row, ri) => (
          <View key={ri} style={s.keyRow}>
            {row.map((p) => {
              const used = useCount[p] > 0;
              return (
                <Pressable
                  key={p}
                  style={[s.key, !selected && s.keyDisabled]}
                  onPress={() => type(p)}
                >
                  <Text style={[s.keyText, used && s.keyUsed]}>{p.toUpperCase()}</Text>
                </Pressable>
              );
            })}
            {ri === 2 && (
              <Pressable
                style={[s.key, s.keyWide, !selected && s.keyDisabled]}
                onPress={clearSelected}
              >
                <Text style={s.keyText}>⌫</Text>
              </Pressable>
            )}
          </View>
        ))}
        <View style={s.trayFoot}>
          {confirmWipe ? (
            <>
              <Text style={s.wipeAsk}>forget everything you’ve tried?</Text>
              <Pressable onPress={wipe} hitSlop={8}>
                <Text style={s.wipeYes}>start over</Text>
              </Pressable>
              <Pressable onPress={() => setConfirmWipe(false)} hitSlop={8}>
                <Text style={s.wipeNo}>keep going</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={() => Object.keys(mapping).length > 0 && setConfirmWipe(true)}
              hitSlop={8}
            >
              <Text style={[s.wipeLink, Object.keys(mapping).length === 0 && s.keyDisabled]}>
                start over
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  hintLine: { fontFamily: fonts.sans, fontSize: 13, color: colors.faint, marginBottom: 16 },
  words: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 12 },
  word: { flexDirection: 'row', marginRight: 14 },
  cell: {
    width: 21,
    alignItems: 'center',
    borderRadius: 4,
    paddingVertical: 2,
  },
  cellSel: { backgroundColor: colors.accentDeep },
  cellGuess: { fontFamily: fonts.mono, fontSize: 16, color: colors.ghost, lineHeight: 19 },
  cellEmpty: { color: colors.faint },
  cellConflict: { color: colors.badge },
  cellCipher: { fontFamily: fonts.mono, fontSize: 10, color: colors.textDim, lineHeight: 12 },
  cellCipherSel: { color: colors.text },
  punct: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textDim,
    lineHeight: 31,
    marginRight: 1,
  },
  tray: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairline,
    paddingTop: 10,
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  keyRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 6 },
  key: {
    backgroundColor: colors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    minWidth: 34,
    paddingVertical: 9,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  keyWide: { minWidth: 48 },
  keyDisabled: { opacity: 0.35 },
  keyText: { fontFamily: fonts.mono, fontSize: 15, color: colors.text },
  keyUsed: { color: colors.faint },
  trayFoot: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 22,
    marginTop: 6,
  },
  wipeLink: { fontFamily: fonts.sans, fontSize: 13, color: colors.faint },
  wipeAsk: { fontFamily: fonts.sans, fontSize: 13, color: colors.textDim },
  wipeYes: { fontFamily: fonts.sans, fontSize: 13, color: colors.badge },
  wipeNo: { fontFamily: fonts.sans, fontSize: 13, color: colors.accent },
});
