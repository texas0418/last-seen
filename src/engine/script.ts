// src/engine/script.ts
// Pure module: live-thread script logic. A script is an array of steps; the
// persisted cursor is an index into it. History = steps before the cursor,
// rendered from what actually happened (which choice was taken, what was
// typed). The screen only schedules timers and writes the cursor forward.

import type { ScriptStep } from '../models';

export interface RenderedBubble {
  from: 'them' | 'me';
  body: string;
}

/** kv lookup for the label chosen at a given step index, or typed echo. */
export type ChoiceLookup = (stepIndex: number) => string | undefined;

export function scriptHistory(
  steps: ScriptStep[],
  cursor: number,
  chosen: ChoiceLookup,
): RenderedBubble[] {
  const out: RenderedBubble[] = [];
  for (let i = 0; i < Math.min(cursor, steps.length); i += 1) {
    const s = steps[i];
    if (s.kind === 'them') out.push({ from: 'them', body: s.body });
    if (s.kind === 'choice') {
      const label = chosen(i);
      if (label) out.push({ from: 'me', body: label });
    }
    if (s.kind === 'freetext') {
      const echo = chosen(i);
      if (echo) out.push({ from: 'me', body: echo });
    }
  }
  return out;
}

export const currentStep = (
  steps: ScriptStep[],
  cursor: number,
): ScriptStep | undefined => steps[cursor];

/** Where the cursor goes after taking a choice option. */
export const nextCursor = (
  cursor: number,
  goto: number | undefined,
): number => goto ?? cursor + 1;
