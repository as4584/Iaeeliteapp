import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming, Easing } from 'react-native-reanimated';

import type { BadgeKind } from '@/content/schema';
import { useReducedMotion } from '@/lib/feel';
import { color, motion, radius } from '@/theme/tokens';

import { Text } from './Text';

type Props = { kind: BadgeKind; label: string; glint?: boolean };

/** Semantic badge — see docs/DESIGN.md §Badge system. One per item, max three per screen. */
export function Badge({ kind, label, glint = false }: Props) {
  const reduce = useReducedMotion();
  const sweep = useSharedValue(-1);

  useEffect(() => {
    if (glint && !reduce && kind === 'flagship') {
      sweep.value = withDelay(500, withTiming(1, { duration: 900, easing: Easing.bezier(...motion.ease) }));
    }
  }, [glint, reduce, kind, sweep]);

  const shine = useAnimatedStyle(() => ({ transform: [{ translateX: sweep.value * 120 }, { skewX: '-20deg' }] }));

  return (
    <View
      accessible
      accessibilityLabel={`Badge: ${label}`}
      style={[styles.base, styles[kind]]}>
      {kind === 'flagship' ? <View style={styles.diamond} /> : null}
      <Text variant="overline" style={[styles.text, { color: textColor[kind] }]} maxFontSizeMultiplier={1.3}>
        {label}
      </Text>
      {kind === 'flagship' ? <Animated.View pointerEvents="none" style={[styles.shine, shine]} /> : null}
    </View>
  );
}

const textColor: Record<BadgeKind, string> = { flagship: color.onGold, rapid: color.gold, licensed: color.text };

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.cut,
    overflow: 'hidden',
  },
  flagship: { backgroundColor: color.gold },
  rapid: { borderWidth: 1, borderColor: color.gold },
  licensed: { backgroundColor: color.night, borderWidth: 1, borderColor: '#2C3B52' },
  text: { fontSize: 10.5, letterSpacing: 1.8 },
  diamond: { width: 5, height: 5, backgroundColor: color.onGold, transform: [{ rotate: '45deg' }] },
  shine: { position: 'absolute', top: -4, bottom: -4, width: 18, left: -10, backgroundColor: 'rgba(255,255,255,0.45)' },
});
