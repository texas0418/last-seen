// src/engine/script.ts
// Pure module: live-thread script logic. A script is an array of steps; the
// persisted cursor is an index into it. History = steps before the cursor,
// rendered from what actually happened (which choice was taken, what was
// typed). The screen only schedules timers and writes the cursor forward.

import type { Flag, FlagSet, ScriptStep, Thread } from '../models';
import { isVisible } from '../models';

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

/** A step is "ready" when it exists, isn't the terminator, and either has no
 *  waitFor or its waitFor flag is set. A parked waitFor step is NOT ready. */
export const isStepReady = (
  step: ScriptStep | undefined,
  has: (f: Flag) => boolean,
): boolean =>
  !!step && step.kind !== 'end' && (!step.waitFor || has(step.waitFor));

/** Fingerprint of everything the player could currently SEE in a thread:
 *  visible archived messages, script position, and whether someone is
 *  waiting on them right now. Stored when the thread is opened; any change
 *  makes it unread again — which is how a real phone behaves and how the
 *  player learns that T, Mara or Dae have said something new. */
export function threadStamp(
  thread: Thread,
  flags: FlagSet,
  cursor: number,
  has: (f: Flag) => boolean,
): string {
  const seen = thread.messages.filter((m) => isVisible(m, flags)).length;
  const live = thread.live && flags.has(thread.live.trigger);
  const ready = live ? isStepReady(currentStep(thread.live!.steps, cursor), has) : false;
  return `${seen}.${cursor}.${ready ? 1 : 0}`;
}

/** How many new things the player hasn't seen in this thread, iOS-style
 *  (a count of messages, not "1 per thread"). Compares the stored stamp
 *  against the live one. No stamp = never opened = everything is new. */
export function threadUnreadCount(
  thread: Thread,
  flags: FlagSet,
  cursor: number,
  has: (f: Flag) => boolean,
  storedStamp: string | undefined,
): number {
  const seen = thread.messages.filter((m) => isVisible(m, flags)).length;
  const live = thread.live && flags.has(thread.live.trigger);
  const ready = live ? isStepReady(currentStep(thread.live!.steps, cursor), has) : false;
  if (!storedStamp) return seen + (ready ? 1 : 0);
  const [pm, pc, pr] = storedStamp.split('.').map(Number);
  return (
    Math.max(0, seen - (pm || 0)) +
    Math.max(0, cursor - (pc || 0)) +
    (ready && !pr ? 1 : 0)
  );
}
