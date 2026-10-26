import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import type { Service } from '@/content/schema';
import { resolveImage } from '@/content/media';
import { color, gutter, space } from '@/theme/tokens';

import { Badge } from './Badge';
import { Text } from './Text';

/** A row, not a card: thumbnail, title, tagline, hairline. */
export function ServiceRow({ service, index, onPress }: { service: Service; index?: number; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${service.title}. ${service.tagline}`}
      accessibilityHint="Opens service details"
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: color.surface }]}>
      <Image source={resolveImage(service.image)} style={styles.thumb} contentFit="cover" transition={200} accessibilityIgnoresInvertColors />
      <View style={styles.copy}>
        {index !== undefined ? (
          <Text variant="overline" tone="faint">
            {String(index + 1).padStart(2, '0')}
          </Text>
        ) : null}
        <Text variant="heading" style={styles.title} numberOfLines={2}>
          {service.title}
        </Text>
        <Text variant="bodySmall" tone="muted" numberOfLines={1}>
          {service.tagline}
        </Text>
        {service.badge ? <View style={{ marginTop: space.sm }}><Badge {...service.badge} /></View> : null}
      </View>
      <Text tone="gold" style={styles.chev} importantForAccessibility="no">›</Text>
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
  },
  thumb: { width: 84, height: 104, backgroundColor: color.surface },
  copy: { flex: 1, gap: 4 },
  title: { fontSize: 20, lineHeight: 25 },
  chev: { fontSize: 26, lineHeight: 28 },
});
