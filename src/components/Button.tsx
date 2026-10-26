import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { color, motion, radius, space } from '@/theme/tokens';

import { Text } from './Text';

type Props = {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'quiet';
  disabled?: boolean;
  accessibilityHint?: string;
  style?: ViewStyle;
  testID?: string;
};

export function Button({ label, onPress, kind = 'primary', disabled, accessibilityHint, style, testID }: Props) {
  const pressed = useSharedValue(0);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.02 }],
    opacity: 1 - pressed.value * 0.12,
  }));

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => (pressed.value = withTiming(1, { duration: motion.press }))}
      onPressOut={() => (pressed.value = withTiming(0, { duration: motion.press }))}
      style={style}>
      <Animated.View style={[styles.base, styles[kind], disabled && styles.disabled, anim]}>
        <Text variant="label" tone={kind === 'primary' ? 'onGold' : kind === 'quiet' ? 'gold' : 'default'} style={styles.label}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: space.xl,
    borderRadius: radius.cut,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: color.gold },
  secondary: { borderWidth: 1, borderColor: color.goldDeep, backgroundColor: 'transparent' },
  quiet: { minHeight: 44, paddingHorizontal: 0 },
  disabled: { opacity: 0.4 },
  label: { textAlign: 'center' },
});
