import { View, type ViewStyle } from 'react-native';

import { gutter, space } from '@/theme/tokens';

import { Rule } from './Rule';
import { Text } from './Text';

export function SectionHeader({ overline, title, intro, style }: { overline: string; title?: string; intro?: string; style?: ViewStyle }) {
  return (
    <View style={[{ paddingHorizontal: gutter, gap: space.md }, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <Rule width={24} />
        <Text variant="overline" tone="gold">{overline}</Text>
      </View>
      {title ? <Text variant="title">{title}</Text> : null}
      {intro ? <Text tone="muted">{intro}</Text> : null}
    </View>
  );
}
