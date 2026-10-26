import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SectionHeader } from '@/components/SectionHeader';
import { ServiceRow } from '@/components/ServiceRow';
import { Text } from '@/components/Text';
import { useCollections, useServicesIn } from '@/content/ContentProvider';
import { color, gutter, space } from '@/theme/tokens';

export default function Services() {
  const insets = useSafeAreaInsets();
  const collections = useCollections();
  const { c } = useLocalSearchParams<{ c?: string }>();
  // The ?c= param is the single source of truth (Home tiles and deep links set it too).
  const collection = collections.find((x) => x.id === c) ?? collections[0];
  const services = useServicesIn(collection.id);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]} testID="services">
      <View style={styles.top}>
        <Text variant="overline" tone="faint" style={{ paddingHorizontal: gutter }}>Services</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs} accessibilityRole="tablist">
          {collections.map((x) => {
            const selected = x.id === collection.id;
            return (
              <Pressable
                key={x.id}
                onPress={() => router.setParams({ c: x.id })}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={x.overline}
                hitSlop={8}
                style={[styles.tab, selected && styles.tabOn]}>
                <Text variant="label" tone={selected ? 'gold' : 'muted'}>{x.overline}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <FlatList
        key={collection.id}
        data={services}
        keyExtractor={(s) => s.id}
        ListHeaderComponent={
          <SectionHeader overline={collection.overline} title={collection.title} intro={collection.intro} style={{ paddingTop: space.xl, paddingBottom: space.lg }} />
        }
        renderItem={({ item, index }) => (
          <ServiceRow service={item} index={index} onPress={() => router.push({ pathname: '/service/[id]', params: { id: item.id } })} />
        )}
        ListEmptyComponent={
          <Text tone="muted" style={{ padding: gutter }}>Nothing listed here right now. Call or email and we’ll handle it directly.</Text>
        }
        contentContainerStyle={{ paddingBottom: space.huge * 2 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  top: { paddingTop: space.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: color.line, backgroundColor: color.bg },
  tabs: { paddingHorizontal: gutter, gap: space.xl, paddingTop: space.md },
  tab: { paddingVertical: space.md, borderBottomWidth: 2, borderBottomColor: 'transparent', minHeight: 44, justifyContent: 'center' },
  tabOn: { borderBottomColor: color.gold },
});
