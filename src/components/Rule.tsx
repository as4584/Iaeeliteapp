import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { useReducedMotion } from '@/lib/feel';
import { color, motion } from '@/theme/tokens';

/** The gold hairline — the brand's recurring motif. `draw` animates it in from the left. */
export function Rule({ draw = false, delay = 0, width = 56, tone = 'gold', style }: {
  draw?: boolean;
  delay?: number;
  width?: number | `${number}%`;
  tone?: 'gold' | 'line';
  style?: ViewStyle;
}) {
  const reduce = useReducedMotion();
  const p = useSharedValue(draw && !reduce ? 0 : 1);
  useEffect(() => {
    if (draw && !reduce) p.value = withDelay(delay, withTiming(1, { duration: 700, easing: Easing.bezier(...motion.ease) }));
  }, [draw, reduce, delay, p]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scaleX: p.value }] }));
  return (
    <View style={[{ width, height: StyleSheet.hairlineWidth * 2, overflow: 'hidden' }, style]}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { backgroundColor: tone === 'gold' ? color.gold : color.line, transformOrigin: 'left' }, anim]}
      />
    </View>
  );
}
