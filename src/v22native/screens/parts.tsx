import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { c, sans, serif } from '../theme';
import { Corner, Film, GoldText, RichHeadline, type Seg } from '../ui';

/** .sec-hero: 300pt film band with bottom fade, gold corner brackets and the label. */
export function SecHero({ film, eyebrow, segs, height = 300, background }: { film?: number; eyebrow: string; segs: Seg[]; height?: number; background?: ReactNode }) {
  return (
    <View style={{ height, overflow: 'hidden', backgroundColor: c.bg }}>
      {background ?? (film !== undefined && <Film source={film} />)}
      <LinearGradient
        colors={['rgba(6,5,10,0.05)', 'rgba(6,5,10,0.52)', 'rgba(6,5,10,1)']}
        locations={[0, 0.6, 1]}
        style={[StyleSheet.absoluteFill, { zIndex: 2 }]}
        pointerEvents="none"
      />
      <Corner pos="tl" inset={{ x: 16, y: 14 }} />
      <Corner pos="tr" inset={{ x: 16, y: 14 }} />
      <View style={styles.label}>
        <SecEye>{eyebrow}</SecEye>
        <RichHeadline segs={segs} style={styles.h} emStyle={{ fontFamily: serif(700, true) }} />
      </View>
    </View>
  );
}

export function SecEye({ children }: { children: string }) {
  return <GoldText style={styles.eye}>{children.toUpperCase()}</GoldText>;
}

const styles = StyleSheet.create({
  label: { position: 'absolute', left: 22, right: 22, bottom: 24, zIndex: 3 },
  eye: { fontFamily: sans(800), fontSize: 7.5, letterSpacing: 6, marginBottom: 10 },
  h: { fontFamily: serif(700), fontSize: 44, color: c.off, lineHeight: 46.2, letterSpacing: -0.3 },
});
