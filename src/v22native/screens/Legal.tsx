import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { legal } from '../content';
import { c, sans, serif } from '../theme';
import { DiamondRule, GoldText, TopBar } from '../ui';

export function Legal({ back }: { back: () => void }) {
  return (
    <View style={styles.fill}>
      <TopBar
        sub="Privacy & Terms"
        right={
          <Pressable onPress={back} accessibilityRole="button" style={styles.back}>
            <Text style={styles.backTxt}>BACK</Text>
          </Pressable>
        }
      />
      <ScrollView style={styles.fill} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {legal.map((b, i) => {
          switch (b.kind) {
            case 'h2':
              return <Text key={i} style={styles.h2}>{b.text}</Text>;
            case 'date':
              return <Text key={i} style={styles.date}>{b.text!.toUpperCase()}</Text>;
            case 'h3':
              return <GoldText key={i} style={styles.h3}>{b.text!.toUpperCase()}</GoldText>;
            case 'div':
              return <DiamondRule key={i} style={{ marginHorizontal: 0, marginTop: 34, marginBottom: 26 }} />;
            default:
              return <Text key={i} style={styles.p}>{b.text}</Text>;
          }
        })}
        <Text style={styles.end}>INNOVATION BUSINESS DEVELOPMENT SOLUTIONS</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: c.bg },
  back: { borderWidth: 1.3, borderColor: 'rgba(232,204,106,0.5)', borderRadius: 4, paddingVertical: 9, paddingHorizontal: 16 },
  backTxt: { fontFamily: sans(900), fontSize: 9, letterSpacing: 2.4, color: c.g4 },
  body: { paddingTop: 28, paddingHorizontal: 22, paddingBottom: 60 },
  h2: { fontFamily: serif(700), fontSize: 36, lineHeight: 37.8, color: c.off, marginBottom: 6 },
  date: { fontFamily: sans(700), fontSize: 9, letterSpacing: 2, color: c.g4, marginBottom: 16 },
  h3: { fontFamily: sans(900), fontSize: 10.5, letterSpacing: 2.6, marginTop: 24, marginBottom: 8 },
  p: { fontFamily: sans(400), fontSize: 13.5, lineHeight: 23.6, color: 'rgba(242,239,232,0.74)', marginBottom: 10 },
  end: { marginTop: 34, textAlign: 'center', fontFamily: sans(700), fontSize: 8, letterSpacing: 2.6, color: 'rgba(232,204,106,0.5)' },
});
