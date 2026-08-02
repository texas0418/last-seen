// src/screens/CalendarScreen.tsx
// Quinn's calendar: a quiet list of a life mid-stride. Mostly noise by
// design — but appointments dated after Oct 12 do their own talking.

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CALENDAR } from '../content/calendar';
import { AppHeader, StatusBarRow, ui } from '../engine/ui';
import { isVisible } from '../models';
import { flagSet, markRead } from '../state';
import { colors, fonts } from '../theme';

export default function CalendarScreen({ onBack }: { onBack: () => void }) {
  const items = CALENDAR.filter((c) => isVisible(c, flagSet()));
  return (
    <View style={ui.screen}>
      <StatusBarRow />
      <AppHeader title="Calendar" subtitle="October 2026" onBack={onBack} />
      <ScrollView>
        {items.map((c) => {
          markRead(c.id);
          return (
            <View key={c.id} style={ui.row}>
              <Text style={s.when}>{c.when}</Text>
              <Text style={ui.rowTitle}>{c.title}</Text>
              {c.detail ? <Text style={ui.rowSub}>{c.detail}</Text> : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  when: { fontFamily: fonts.mono, fontSize: 11, color: colors.ghost, marginBottom: 3 },
});
