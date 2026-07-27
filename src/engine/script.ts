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
  // Follow the PATH the player actually took (gotos and all) — a linear
  // scan would render "them" bubbles from branches never visited. Backward
  // gotos (the ending loop) can revisit a step; the guard set stops the
  // walk from looping past the same choice twice with a stale answer.
  const out: RenderedBubble[] = [];
  const visited = new Set<number>();
  let i = 0;
  while (i < cursor && i < steps.length) {
    const s = steps[i];
    if (s.kind === 'end') break;
    if (s.kind === 'them') {
      out.push({ from: 'them', body: s.body });
      i += 1;
      continue;
    }
    const answer = chosen(i);
    if (!answer) break;
    out.push({ from: 'me', body: answer });
    if (s.kind === 'choice') {
      if (visited.has(i)) break;
      visited.add(i);
      const opt = s.options.find((o) => o.label === answer);
      i = opt?.goto ?? i + 1;
    } else {
      i += 1;
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
