// src/screens/MessagesScreen.tsx
// Thread list + thread view + the live-script runtime (typing delays,
// choice chips, free-text gates). Dae's thread doubles as the only hint
// channel once her intro script has played out.

import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { THREADS } from '../content/threads';
import { checkGate, gateById } from '../engine/gates';
import { activeGates, hintLabel } from '../engine/hints';
import { currentStep, scriptHistory, threadStamp } from '../engine/script';
import { AppHeader, Bubble, ChromeText, ChromeTextInput, StatusBarRow, ui } from '../engine/ui';
import { isVisible, type ScriptStep, type Thread } from '../models';
import {
  flagSet,
  getKv,
  hasFlag,
  isReadAt,
  markRead,
  markReadAt,
  putKv,
  scriptIndex,
  setFlag,
  setScriptIndex,
} from '../state';
import { colors, fonts } from '../theme';

const choseKey = (threadId: string, i: number) => `chose:${threadId}:${i}`;
const hintKey = (gateId: string) => `hint:${gateId}`;

// Threads whose latest live message arrived seconds ago (this JS session
// only) — those type on letter by letter; history is always instant.
const freshDelivery: Record<string, number> = {};

function TypingBubble() {
  // Animated so a wait reads as "someone is typing", not a frozen glyph.
  const [n, setN] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setN((v) => (v % 3) + 1), 420);
    return () => clearInterval(t);
  }, []);
  return <Bubble from="them" body={'·'.repeat(n)} />;
}

function TypewriterBubble({ body }: { body: string }) {
  const [n, setN] = useState(1);
  useEffect(() => {
    if (n >= body.length) return undefined;
    // ~33ms/char, but long messages accelerate so nothing takes over ~4s
    const stride = Math.max(1, Math.round(body.length / 120));
    const t = setTimeout(() => setN(Math.min(body.length, n + stride)), 33);
    return () => clearTimeout(t);
  }, [n, body]);
  return (
    <Pressable onPress={() => setN(body.length)}>
      <Bubble from="them" body={body.slice(0, n)} />
    </Pressable>
  );
}

function LiveChoice({ thread, step, cursor }: { thread: Thread; step: ScriptStep; cursor: number }) {
  if (step.kind !== 'choice') return null;
  return (
    <View>
      {step.options.map((o) => (
        <Pressable
          key={o.label}
          style={ui.chip}
          onPress={() => {
            putKv(choseKey(thread.id, cursor), o.label);
            if (o.setsFlag) setFlag(o.setsFlag);
            setScriptIndex(thread.id, o.goto ?? cursor + 1);
          }}
        >
          <ChromeText style={ui.chipText}>{o.label}</ChromeText>
        </Pressable>
      ))}
    </View>
  );
}

function LiveFreetext({ thread, step, cursor }: { thread: Thread; step: ScriptStep; cursor: number }) {
  const [text, setText] = useState('');
  const [wrongBody, setWrongBody] = useState<string | null>(null);
  if (step.kind !== 'freetext') return null;
  const send = () => {
    if (!text.trim()) return;
    if (checkGate(step.gateId, text)) {
      putKv(choseKey(thread.id, cursor), step.echo ?? text.trim());
      const flag = gateById(step.gateId).setsFlag;
      if (flag) setFlag(flag);
      setScriptIndex(thread.id, cursor + 1);
    } else {
      setWrongBody(step.wrong);
      setText('');
    }
  };
  return (
    <View>
      {wrongBody ? <Bubble from="them" body={wrongBody} /> : null}
      <View style={s.inputRow}>
        <ChromeTextInput
          style={[ui.input, { flex: 1 }]}
          value={text}
          onChangeText={setText}
          placeholder="Text message"
          placeholderTextColor={colors.faint}
          autoCapitalize="none"
          onSubmitEditing={send}
        />
        <Pressable onPress={send} hitSlop={10}>
          <ChromeText style={s.send}>↑</ChromeText>
        </Pressable>
      </View>
    </View>
  );
}

function DaeHints() {
  const gates = activeGates(flagSet());
  return (
    <View style={s.hints}>
      {gates.map((g) => {
        const level = Number(getKv(hintKey(g.id)) ?? '0');
        return (
          <View key={g.id}>
            {level > 0 && <Bubble from="me" body={`about ${hintLabel(g)}…`} />}
            {level > 0 && <Bubble from="them" body={g.nudges[Math.min(level, 2) - 1]} />}
            {level < 2 && (
              <Pressable
                style={ui.chip}
                onPress={() => putKv(hintKey(g.id), String(level + 1))}
              >
                <ChromeText style={ui.chipText}>
                  {level === 0 ? `Ask about ${hintLabel(g)}` : 'I’m still stuck.'}
                </ChromeText>
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
}

function LiveArea({ thread }: { thread: Thread }) {
  const cursor = scriptIndex(thread.id);
  const steps = thread.live!.steps;
  const pending = currentStep(steps, cursor);
  // a waitFor-gated step is dormant until its flag exists
  const step =
    pending && pending.waitFor && !hasFlag(pending.waitFor) ? undefined : pending;
  // Typing is DERIVED: a pending 'them' step means she's typing. The effect
  // only schedules the delivery, which advances the external store.
  const typing = step?.kind === 'them';
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (step?.kind !== 'them') return undefined;
    // The deadline PERSISTS: time spent elsewhere in the phone counts, so
    // leaving a quiet thread and coming back never restarts the wait
    // (playtest 1: Mara's opener took three visits). A small floor keeps
    // the typing dots visible for a beat even when the wait already elapsed.
    const dueKey = `due:${thread.id}:${cursor}`;
    let due = Number(getKv(dueKey) ?? 0);
    if (!due) {
      due = Date.now() + (step.delayMs ?? 1500);
      putKv(dueKey, String(due));
    }
    timer.current = setTimeout(() => {
      freshDelivery[thread.id] = Date.now();
      setScriptIndex(thread.id, cursor + 1);
    }, Math.max(600, due - Date.now()));
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [cursor, step, thread.id]);

  const history = scriptHistory(steps, cursor, (i) => getKv(choseKey(thread.id, i)));
  const done = step === undefined || step.kind === 'end';
  const freshUntil = (freshDelivery[thread.id] ?? 0) + 8000;
  return (
    <View>
      {history.map((b, i) => {
        const isFreshLast =
          i === history.length - 1 && b.from === 'them' && Date.now() < freshUntil;
        return isFreshLast ? (
          <TypewriterBubble key={i} body={b.body} />
        ) : (
          <Bubble key={i} from={b.from} body={b.body} />
        );
      })}
      {typing && <TypingBubble />}
      {step && !typing && <LiveChoice thread={thread} step={step} cursor={cursor} />}
      {step && !typing && <LiveFreetext thread={thread} step={step} cursor={cursor} />}
      {thread.id === 'th-dae' && done && <DaeHints />}
    </View>
  );
}

function ThreadView({ thread, onBack }: { thread: Thread; onBack: () => void }) {
  const flags = flagSet();
  const scroll = useRef<ScrollView>(null);
  const stamp = threadStamp(thread, flags, scriptIndex(thread.id), hasFlag);
  useEffect(() => markReadAt(thread.id, stamp), [thread.id, stamp]);
  const liveActive = thread.live && flags.has(thread.live.trigger);
  return (
    <KeyboardAvoidingView
      style={ui.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBarRow />
      <AppHeader title={thread.contact} subtitle={thread.detail} onBack={onBack} />
      <ScrollView
        ref={scroll}
        contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
      >
        {thread.messages.filter((m) => isVisible(m, flags)).map((m, i) => (
          <View key={i}>
            <ChromeText style={s.when}>{m.when}</ChromeText>
            <Bubble from={m.from === 'quinn' ? 'me' : 'them'} body={m.body} />
          </View>
        ))}
        {liveActive && <LiveArea thread={thread} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function MessagesScreen({ onBack }: { onBack: () => void }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const flags = flagSet();
  const visible = THREADS.filter((t) => isVisible(t, flags));
  const open = visible.find((t) => t.id === openId);
  if (open) return <ThreadView thread={open} onBack={() => setOpenId(null)} />;
  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <AppHeader title="Messages" onBack={onBack} />
      <ScrollView>
        {visible.map((t) => {
          // preview only what the player is allowed to have seen — the raw
          // last message can belong to a night six chapters away
          const seen = t.messages.filter((m) => isVisible(m, flags));
          const last = seen[seen.length - 1];
          return (
            <Pressable key={t.id} style={ui.row} onPress={() => setOpenId(t.id)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ChromeText style={ui.rowTitle}>{t.contact}</ChromeText>
{!hasFlag('ending4') &&
                  !isReadAt(t.id, threadStamp(t, flags, scriptIndex(t.id), hasFlag)) && (
                    <View style={ui.threadDot} />
                  )}
              </View>
              <ChromeText style={ui.rowSub} numberOfLines={1}>
                {last?.body ?? 'New conversation'}
              </ChromeText>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  when: {
    textAlign: 'center',
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.faint,
    marginTop: 10,
    marginBottom: 2,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
  send: { color: colors.accent, fontSize: 26, fontWeight: '700' },
  hints: { marginTop: 14 },
});
