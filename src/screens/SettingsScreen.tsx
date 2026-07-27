// src/screens/SettingsScreen.tsx
// The phone's Settings app — diegetic. This is where a careful player first
// notices the second mail account exists at all. Airplane mode is a real
// toggle (v1: flavor + one Dae reaction; the trace-vs-restore dilemma is a
// pre-ship item). "Start over" is the only non-diegetic control.

import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { PERSONAL_ADDRESS, TIDEWATER_ADDRESS } from '../content/mail';
import { AppHeader, StatusBarRow, phoneClock, ui } from '../engine/ui';
import { hasFlag, resetWorld, setFlag } from '../state';
import { colors, fonts } from '../theme';

const ENDING_FLAGS = ['ending1', 'ending2', 'ending3', 'ending4'] as const;

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [armReset, setArmReset] = useState(false);
  const endingsSeen = ENDING_FLAGS.filter((f) => hasFlag(f)).length;
  const { battery } = phoneClock();
  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <AppHeader title="Settings" onBack={onBack} />
      <ScrollView>
        <Text style={s.section}>THIS PHONE</Text>
        <View style={ui.row}>
          <Text style={ui.rowTitle}>Quinn Mercer</Text>
          <Text style={ui.rowSub}>(360) 555-0198 · BrinePhone 11 · BrineOS 11</Text>
        </View>
        <View style={ui.row}>
          <Text style={ui.rowTitle}>Battery</Text>
          <Text style={ui.rowSub}>{battery}% — Low Power Mode is on</Text>
        </View>
        <View style={ui.row}>
          <Text style={ui.rowTitle}>Storage</Text>
          <Text style={ui.rowSub}>57.1 GB of 64 GB used</Text>
        </View>
        {hasFlag('act3') && (
          <Pressable
            style={ui.row}
            onPress={() => setFlag('cloudRestored')}
            disabled={hasFlag('cloudRestored')}
          >
            <Text style={[ui.rowTitle, !hasFlag('cloudRestored') && { color: colors.accent }]}>
              Cloud trash
            </Text>
            <Text style={ui.rowSub}>
              {hasFlag('cloudRestored')
                ? '1 conversation restored to Messages'
                : '1 deleted conversation can still be recovered. Restore?'}
            </Text>
          </Pressable>
        )}

        <Text style={s.section}>RADIO</Text>
        <View style={[ui.row, s.toggleRow]}>
          <View>
            <Text style={ui.rowTitle}>Airplane Mode</Text>
            <Text style={ui.rowSub}>
              {hasFlag('airplaneMode') ? 'No one can reach this phone. Or find it.' : 'Connected · BrineTel LTE'}
            </Text>
          </View>
          <Switch
            value={hasFlag('airplaneMode')}
            onValueChange={(v) => setFlag('airplaneMode', v)}
            trackColor={{ true: colors.accentDeep, false: colors.panelBorder }}
          />
        </View>

        <Text style={s.section}>MAIL ACCOUNTS</Text>
        <View style={ui.row}>
          <Text style={ui.rowTitle}>{PERSONAL_ADDRESS}</Text>
          <Text style={ui.rowSub}>{hasFlag('act2') ? 'Signed in' : 'Signed out — password required'}</Text>
        </View>
        <View style={ui.row}>
          <Text style={ui.rowTitle}>{TIDEWATER_ADDRESS}</Text>
          <Text style={[ui.rowSub, !hasFlag('act3') && { color: colors.ghost }]}>
            {hasFlag('act3') ? 'Signed in' : 'Signed out — added Jun 2026, never synced to cloud'}
          </Text>
        </View>

        {endingsSeen > 0 && (
          <>
            <Text style={s.section}>CASE</Text>
            <View style={ui.row}>
              <Text style={ui.rowTitle}>Endings</Text>
              <Text style={ui.rowSub}>{endingsSeen} of 4 seen</Text>
            </View>
          </>
        )}

        <Text style={s.section}>· · ·</Text>
        <Pressable
          style={ui.row}
          onPress={() => (armReset ? (resetWorld(), setArmReset(false)) : setArmReset(true))}
        >
          <Text style={[ui.rowTitle, { color: colors.badge }]}>
            {armReset ? 'Tap again to erase everything and start over' : 'Start over'}
          </Text>
          <Text style={ui.rowSub}>Returns the phone to the envelope. All progress is lost.</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  section: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.faint,
    letterSpacing: 1.5,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 6,
  },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
