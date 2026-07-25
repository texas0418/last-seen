// src/engine/cipher.ts
// Pure module: "the game" — the sisters' childhood cipher. It is atbash
// (A<->Z, B<->Y, ...): exactly the kind of cipher two kids invent and never
// outgrow. The PUZZLE is not the math; it is (a) realizing the garbage
// strings on this phone are a cipher at all, (b) reconstructing the rule
// from a torn photo of the childhood chart, and (c) the sheer length of the
// final draft. Never name "atbash" anywhere the player can read.

const A = 'a'.charCodeAt(0);
const Z = 'z'.charCodeAt(0);

/** Atbash a single character, preserving case; non-letters pass through. */
export const flipChar = (ch: string): string => {
  const code = ch.charCodeAt(0);
  if (code >= A && code <= Z) return String.fromCharCode(Z - (code - A));
  const cA = 'A'.charCodeAt(0);
  const cZ = 'Z'.charCodeAt(0);
  if (code >= cA && code <= cZ) return String.fromCharCode(cZ - (code - cA));
  return ch;
};

/** Atbash is its own inverse: encode === decode. */
export const flip = (s: string): string => [...s].map(flipChar).join('');

/** Distinct cipher letters used in a text — the decoder's working set. */
export const cipherLetters = (s: string): string[] => [
  ...new Set([...s.toLowerCase()].filter((c) => c >= 'a' && c <= 'z')),
];

/**
 * Decoder progress: the player assigns plain letters to cipher letters by
 * hand. The draft "resolves" when every cipher letter present is mapped to
 * its true (atbash) plaintext letter.
 */
export const isFullyDecoded = (
  ciphertext: string,
  mapping: Readonly<Record<string, string>>,
): boolean =>
  cipherLetters(ciphertext).every((c) => mapping[c] === flipChar(c));

/** Render ciphertext through a partial mapping; unmapped letters stay as-is. */
export const applyMapping = (
  ciphertext: string,
  mapping: Readonly<Record<string, string>>,
): { ch: string; decoded: boolean }[] =>
  [...ciphertext].map((raw) => {
    const lower = raw.toLowerCase();
    const mapped = mapping[lower];
    if (mapped && lower >= 'a' && lower <= 'z')
      return { ch: raw === lower ? mapped : mapped.toUpperCase(), decoded: true };
    return { ch: raw, decoded: false };
  });
