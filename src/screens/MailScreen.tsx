// src/screens/MailScreen.tsx
// Two mailboxes behind two passwords. The personal login is act break 1->2
// (and the paywall moment); the tidewater login is act break 2->3, its hint
// line rendered in the sisters' cipher. The tidewater Drafts folder holds
// the ciphered unsent draft, opened in the Decoder.

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  DRAFT_BODY_CIPHER,
  DRAFT_ID,
  EMAILS,
  PERSONAL_ADDRESS,
  TIDEWATER_ADDRESS,
  TIDEWATER_HINT,
} from '../content/mail';
import Decoder from '../engine/Decoder';
import { checkGate, gateById } from '../engine/gates';
import {
  AppHeader,
  BodyText,
  ChromeText,
  ChromeTextInput,
  PuzzleText,
  StatusBarRow,
  ui,
} from '../engine/ui';
import { isVisible, type Email } from '../models';
import { useStoryUnlocked } from '../proAccess';
import { flagSet, hasFlag, isRead, markRead, putKv, setFlag } from '../state';
import { colors, fonts } from '../theme';
import PaywallScreen from './PaywallScreen';

function Login({
  address,
  hint,
  gateId,
  onSolved,
}: {
  address: string;
  hint?: string;
  gateId: 'mail' | 'tidewater';
  onSolved: () => void;
}) {
  const [pw, setPw] = useState('');
  const [wrongs, setWrongs] = useState(0);
  const [msg, setMsg] = useState('');
  const submit = () => {
    if (checkGate(gateId, pw)) return onSolved();
    const wrong = gateById(gateId).wrong;
    setMsg(wrong[Math.min(wrongs, wrong.length - 1)]);
    setWrongs(wrongs + 1);
    setPw('');
  };
  return (
    <View style={s.login}>
      <ChromeText style={s.loginAddress}>{address}</ChromeText>
      {hint ? <PuzzleText style={s.loginHint}>hint: {hint}</PuzzleText> : null}
      <ChromeTextInput
        style={[ui.input, { marginTop: 14 }]}
        value={pw}
        onChangeText={setPw}
        placeholder="Password"
        placeholderTextColor={colors.faint}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        onSubmitEditing={submit}
      />
      {msg ? <ChromeText style={s.wrong}>{msg}</ChromeText> : null}
      <Pressable style={s.loginBtn} onPress={submit}>
        <ChromeText style={s.loginBtnText}>Sign in</ChromeText>
      </Pressable>
    </View>
  );
}

function EmailView({ email, onBack }: { email: Email; onBack: () => void }) {
  markRead(email.id);
  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <AppHeader title={email.from} subtitle={email.when} onBack={onBack} />
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        <BodyText style={s.subject}>{email.subject}</BodyText>
        <BodyText selectable style={s.body}>{email.body}</BodyText>
        {(email.attachments ?? []).map((a) => (
          <View key={a.name} style={s.attach}>
            <ChromeText style={s.attachName}>📎 {a.name}</ChromeText>
            <BodyText style={s.attachBody}>{a.body}</BodyText>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function MailScreen({ onBack }: { onBack: () => void }) {
  const [account, setAccount] = useState<'personal' | 'tidewater'>('personal');
  const [openId, setOpenId] = useState<string | null>(null);
  const [paywall, setPaywall] = useState(false);
  const unlocked = useStoryUnlocked();
  const flags = flagSet();

  if (!hasFlag('act2')) {
    if (paywall && !unlocked)
      return <PaywallScreen onDone={() => setPaywall(false)} />;
    return (
      <View style={ui.screen}>
        <StatusBarRow />
        <AppHeader title="Mail" onBack={onBack} />
        <Login
          address={PERSONAL_ADDRESS}
          gateId="mail"
          onSolved={() => {
            putKv('mailSolved', '1');
            if (unlocked) setFlag('act2');
            else setPaywall(true);
          }}
        />
      </View>
    );
  }

  const emails = EMAILS.filter(
    (e) => e.account === account && isVisible(e, flags),
  );
  const open = emails.find((e) => e.id === openId);
  if (open && open.id === DRAFT_ID && hasFlag('act3')) {
    markRead(DRAFT_ID); // the decoder route must clear unread too
    return (
      <View style={ui.screen}>
        <StatusBarRow />
        <AppHeader
          title="Draft — never sent"
          subtitle="saved Oct 11, 11:41 PM"
          onBack={() => setOpenId(null)}
        />
        <Decoder
          draftId={DRAFT_ID}
          ciphertext={DRAFT_BODY_CIPHER}
          onDecoded={() => setFlag('draftDecoded')}
        />
      </View>
    );
  }
  if (open) return <EmailView email={open} onBack={() => setOpenId(null)} />;

  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <AppHeader title="Mail" onBack={onBack} />
      <View style={s.tabs}>
        {(['personal', 'tidewater'] as const).map((a) => (
          <Pressable key={a} style={[s.tab, account === a && s.tabOn]} onPress={() => setAccount(a)}>
            <ChromeText style={[s.tabText, account === a && { color: colors.text }]}>
              {a === 'personal' ? 'Personal' : `${hasFlag('act3') ? '' : '🔒 '}tidewater.ledger`}
            </ChromeText>
          </Pressable>
        ))}
      </View>
      {account === 'tidewater' && !hasFlag('act3') ? (
        <Login
          address={TIDEWATER_ADDRESS}
          hint={TIDEWATER_HINT}
          gateId="tidewater"
          onSolved={() => setFlag('act3')}
        />
      ) : (
        <ScrollView>
          {emails.map((e) => (
            <Pressable key={e.id} style={ui.row} onPress={() => setOpenId(e.id)}>
              <ChromeText style={[ui.rowTitle, !isRead(e.id) && ui.rowTitleUnread]}>
                {!isRead(e.id) ? <ChromeText style={ui.unreadDot}>{'● '}</ChromeText> : null}
                {e.folder === 'drafts' ? '✏️ ' : ''}
                {e.from}
              </ChromeText>
              <ChromeText style={ui.rowSub} numberOfLines={1}>
                {e.subject}
              </ChromeText>
              <ChromeText style={s.rowWhen}>{e.when}</ChromeText>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  login: { padding: 24, marginTop: 30 },
  loginAddress: { fontFamily: fonts.mono, fontSize: 15, color: colors.text, textAlign: 'center' },
  loginHint: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ghost,
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: 1,
  },
  wrong: { fontFamily: fonts.mono, fontSize: 12, color: colors.badge, marginTop: 8, textAlign: 'center' },
  loginBtn: {
    marginTop: 16,
    backgroundColor: colors.accentDeep,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  loginBtnText: { color: '#eef4fa', fontFamily: fonts.sans, fontSize: 16, fontWeight: '600' },
  subject: { fontFamily: fonts.sans, fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 23, color: colors.text },
  attach: {
    marginTop: 16,
    backgroundColor: colors.panel,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    padding: 12,
  },
  attachName: { fontFamily: fonts.sans, fontSize: 13, color: colors.accent, marginBottom: 8 },
  attachBody: { fontFamily: fonts.mono, fontSize: 12.5, lineHeight: 19, color: colors.textDim },
  tabs: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 8, gap: 8 },
  tab: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.panel,
  },
  tabOn: { backgroundColor: colors.accentDeep },
  tabText: { fontFamily: fonts.sans, fontSize: 13, color: colors.textDim },
  rowWhen: { fontFamily: fonts.sans, fontSize: 11, color: colors.faint, marginTop: 3 },
});
