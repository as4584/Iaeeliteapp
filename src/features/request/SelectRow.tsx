import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Badge } from '@/components/Badge';
import { Text } from '@/components/Text';
import type { Service } from '@/content/schema';
import { color, gutter, motion, radius, space } from '@/theme/tokens';

/** Signature moment 2: a gold rail draws on selection; square check (not a pill). */
export function SelectRow({ service, selected, onToggle, large }: { service: Service; selected: boolean; onToggle: () => void; large?: boolean }) {
  const rail = useAnimatedStyle(() => ({
    transform: [{ scaleY: withTiming(selected ? 1 : 0, { duration: motion.state }) }],
  }));
  const fill = useAnimatedStyle(() => ({
    backgroundColor: withTiming(selected ? color.surfaceRaised : 'rgba(0,0,0,0)', { duration: motion.state }),
  }));

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${service.title}${service.badge ? `, ${service.badge.label}` : ''}`}
      accessibilityHint={service.summary}
      testID={`select-${service.id}`}>
      <Animated.View style={[styles.row, large && styles.large, fill]}>
        <Animated.View style={[styles.rail, rail]} />
        <View style={[styles.box, selected && styles.boxOn]}>
          {selected ? <Text variant="label" tone="onGold" style={styles.tick}>✓</Text> : null}
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          {service.badge ? <Badge {...service.badge} glint={large} /> : null}
          <Text variant={large ? 'heading' : 'body'} style={!large && styles.title}>{service.title}</Text>
          <Text variant="caption" tone="muted" numberOfLines={large ? 3 : 1}>{large ? service.summary : service.tagline}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    paddingVertical: space.lg,
    paddingHorizontal: gutter,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.line,
    minHeight: 64,
  },
  large: { paddingVertical: space.xl, borderWidth: 1, borderColor: color.goldDeep, marginHorizontal: gutter, paddingHorizontal: space.lg, borderBottomColor: color.goldDeep },
  rail: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: color.gold, transformOrigin: 'top' },
  box: { width: 24, height: 24, borderRadius: radius.cut, borderWidth: 1.5, borderColor: color.textFaint, alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: color.gold, borderColor: color.gold },
  tick: { fontSize: 14, lineHeight: 16, letterSpacing: 0 },
  title: { fontFamily: 'Manrope_600SemiBold' },
});
