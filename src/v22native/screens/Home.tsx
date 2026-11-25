import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { media } from '../media';
import { c, clampVw, GD_BRAND, sans, serif } from '../theme';
import { Crest, Film, GoldButton, GoldText, RichHeadline, RoundChevron } from '../ui';

type Props = { go: (s: 'blackcar' | 'request') => void; statsPlayed: boolean; onStatsPlayed: () => void };

/** .home-stat-num: counts up (7+, 24/7) with the spinIn flourish, once per launch. */
function Stat({ target, suffix, text, label, play }: { target?: number; suffix?: string; text?: string; label: string; play: boolean }) {
  const { width } = useWindowDimensions();
  const [n, setN] = useState(play ? 0 : (target ?? 0));
  const spin = useState(() => new Animated.Value(play ? 0 : 1))[0];

  useEffect(() => {
    if (!play) return;
    Animated.timing(spin, { toValue: 1, duration: 700, easing: Easing.bezier(0.34, 1.56, 0.64, 1), useNativeDriver: true }).start();
    if (target === undefined) return;
    let cur = 0;
    const t = setInterval(() => {
      cur += Math.ceil(target / 30);
      if (cur >= target) {
        cur = target;
        clearInterval(t);
      }
      setN(cur);
    }, 30);
    return () => clearInterval(t);
  }, [play, spin, target]);

  const rotateY = spin.interpolate({ inputRange: [0, 0.6, 1], outputRange: ['90deg', '-10deg', '0deg'] });
  const scale = spin.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.6, 1.05, 1] });
  const numSize = clampVw(Math.min(width, 430), 25, 7.2, 36);

  return (
    <View style={styles.stat}>
      <Animated.View style={{ opacity: spin, transform: [{ perspective: 600 }, { rotateY }, { scale }] }}>
        <GoldText style={[styles.statNum, { fontSize: numSize, lineHeight: numSize * 1.15 }]} numberOfLines={1}>{text ?? `${n}${suffix}`}</GoldText>
      </Animated.View>
      <GoldText style={styles.statLbl}>{label.toUpperCase()}</GoldText>
    </View>
  );
}

export function Home({ go, statsPlayed, onStatsPlayed }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const w = Math.min(width, 430);
  const [play] = useState(!statsPlayed);
  useEffect(() => {
    if (play) onStatsPlayed();
  }, [play, onStatsPlayed]);

  return (
    <View style={styles.fill}>
      <Film source={media.filmHome} />
      <LinearGradient
        colors={['rgba(6,5,10,0.12)', 'rgba(6,5,10,0)', 'rgba(6,5,10,0.35)', 'rgba(6,5,10,0.97)', 'rgba(6,5,10,1)']}
        locations={[0, 0.1, 0.48, 0.72, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={[styles.floatBar, { paddingTop: 26 + insets.top }]}>
        <Crest size={88} ring={2.5} glow="0 0 32px rgba(201,168,76,0.8), 0 0 80px rgba(201,168,76,0.32), 0 0 120px rgba(201,168,76,0.12)" />
        <GoldText grad={GD_BRAND} style={[styles.tag, { fontSize: clampVw(w, 9, 2.8, 11.5) }]}>{'INNOVATION ARTIST ESCORT\nELITE SERVICES'}</GoldText>
      </View>

      <View style={styles.content}>
        <RichHeadline
          segs={[{ t: 'We move the people\nthe world is ' }, { t: 'watching.', em: true }]}
          style={[styles.hl, { fontSize: clampVw(w, 31, 9.3, 50), lineHeight: clampVw(w, 31, 9.3, 50) * 1.06 }]}
          emStyle={{ fontFamily: serif(700, true) }}
        />
        <View style={styles.rule}>
          <LinearGradient
            colors={['rgba(245,224,152,0)', 'rgba(245,224,152,0.55)', 'rgba(255,200,0,1)', 'rgba(245,224,152,0.55)', 'rgba(245,224,152,0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.ruleLine}
          />
          <View style={styles.ruleDiamond} />
        </View>
        <View style={styles.stats}>
          <Stat target={7} suffix="+" label="Elite Services" play={play} />
          <Stat target={24} suffix="/7" label="Always Available" play={play} />
          <Stat text="NY · NJ" label="Nationwide Service" play={play} />
        </View>

        <Pressable onPress={() => go('blackcar')} style={styles.bc} accessibilityRole="button" accessibilityLabel="Black Car Service, now booking">
          <Image source={media.blackCarStill} contentFit="cover" contentPosition={{ left: '60%', top: '60%' }} style={styles.bcImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bcK}>NOW BOOKING</Text>
            <Text style={styles.bcN}>Black Car Service</Text>
          </View>
          <RoundChevron size={32} border="rgba(232,204,106,0.5)" bg="transparent" icon={17} />
        </Pressable>

        <GoldButton label="Request a Confidential Consultation" onPress={() => go('request')} />
        <GoldText style={styles.ticker} numberOfLines={1}>{'ANYWHERE  ·  ANY PLACE  ·  ANYTIME'}</GoldText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: c.bg },
  floatBar: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 22 },
  tag: { fontFamily: sans(900), letterSpacing: 1.8, lineHeight: 24, textAlign: 'right' },
  content: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5, paddingHorizontal: 22, paddingBottom: 22 },
  hl: { fontFamily: serif(700), color: c.off, letterSpacing: -0.5 }, // his 10px bottom margin collapses into the rule's 20px
  rule: { height: 1.5, marginTop: 20, marginBottom: 18, justifyContent: 'center', alignItems: 'center', overflow: 'visible' },
  ruleLine: { position: 'absolute', left: 0, right: 0, height: 1.5, boxShadow: '0 0 14px rgba(255,200,0,0.45), 0 1px 6px rgba(255,200,0,0.2)' },
  ruleDiamond: { position: 'absolute', top: -3.25, width: 8, height: 8, backgroundColor: c.g4, transform: [{ rotate: '45deg' }], boxShadow: '0 0 14px rgba(255,200,0,0.9)' },
  stats: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginBottom: 22 },
  stat: { flex: 1, minWidth: 0, alignItems: 'center' },
  statNum: { fontFamily: serif(700) },
  statLbl: { fontFamily: sans(800), fontSize: 7.5, letterSpacing: 1.3, marginTop: 8, lineHeight: 12, textAlign: 'center' },
  bc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(232,204,106,0.45)',
    borderRadius: 4,
    backgroundImage: 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(6,5,10,0.78))',
    boxShadow: '0 0 22px rgba(201,168,76,0.18)',
  },
  bcImg: { width: 58, height: 58, borderRadius: 3, borderWidth: 1, borderColor: 'rgba(232,204,106,0.5)' },
  bcK: { fontFamily: sans(800), fontSize: 8, letterSpacing: 3, color: c.g4 },
  bcN: { fontFamily: serif(700), fontSize: 24, color: c.off, lineHeight: 26.4, marginTop: 3 },
  ticker: { fontFamily: sans(800), fontSize: 9.5, letterSpacing: 3.2, textAlign: 'center' },
});
