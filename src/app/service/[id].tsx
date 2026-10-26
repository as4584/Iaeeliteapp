import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Rule } from '@/components/Rule';
import { ServiceRow } from '@/components/ServiceRow';
import { Text } from '@/components/Text';
import { useContent, useService, useServicesIn } from '@/content/ContentProvider';
import { resolveImage } from '@/content/media';
import { useRequest } from '@/features/request/RequestProvider';
import { color, gutter, space } from '@/theme/tokens';

export default function ServiceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const service = useService(id);
  const content = useContent();
  const siblings = useServicesIn(service?.collection ?? '');
  const { startWith } = useRequest();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  if (!service) {
    return (
      <View style={[styles.root, styles.missing, { paddingTop: insets.top + 80 }]}>
        <Text variant="title">This service has moved.</Text>
        <Text tone="muted">It may have been renamed or retired. Browse current services, or ask us directly.</Text>
        <Button label="Browse services" onPress={() => router.replace('/services')} />
      </View>
    );
  }

  const collection = content.collections.find((c) => c.id === service.collection);
  const related = siblings.filter((s) => s.id !== service.id).slice(0, 3);

  const request = () => {
    startWith(service.id);
    router.navigate('/request');
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 + insets.bottom }} testID="service-detail">
        <View style={{ height: Math.min(width * 1.2, 560) }}>
          <Image source={resolveImage(service.image)} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityIgnoresInvertColors />
          <LinearGradient colors={['rgba(10,10,11,0.5)', 'transparent', color.bg]} locations={[0, 0.35, 1]} style={StyleSheet.absoluteFill} />
        </View>
        <View style={[styles.pad, { marginTop: -96, gap: space.md }]}>
          {collection ? <Text variant="overline" tone="gold">{collection.overline}</Text> : null}
          <Text variant="display" style={{ fontSize: 36, lineHeight: 42 }}>{service.title}</Text>
          <Text variant="heading" italic tone="gold">{service.tagline}</Text>
          {service.badge ? <Badge {...service.badge} glint /> : null}
          <Rule width={56} style={{ marginVertical: space.sm }} />
          <Text>{service.body ?? service.summary}</Text>
          {service.note ? (
            <View style={styles.note} accessible accessibilityLabel={`Important: ${service.note}`}>
              <Text variant="overline" tone="muted">A note on scope</Text>
              <Text variant="bodySmall" tone="muted">{service.note}</Text>
            </View>
          ) : null}
          <View style={styles.assurance}>
            <Text variant="overline" tone="faint">Confidential by default</Text>
            <Text variant="bodySmall" tone="muted">{content.contact.confidentiality}</Text>
          </View>
        </View>

        {related.length ? (
          <View style={{ marginTop: space.xxxl }}>
            <Text variant="overline" tone="faint" style={styles.pad}>Often booked with</Text>
            <View style={{ marginTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line }}>
              {related.map((s) => (
                <ServiceRow key={s.id} service={s} onPress={() => router.setParams({ id: s.id })} />
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      {service.requestable ? (
        <View style={[styles.dock, { paddingBottom: insets.bottom + space.md }]}>
          <Button label="Request this service" onPress={request} testID="request-service" accessibilityHint="Starts a request with this service selected" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  pad: { paddingHorizontal: gutter },
  missing: { paddingHorizontal: gutter, gap: space.lg },
  note: { marginTop: space.md, padding: space.lg, gap: space.sm, borderLeftWidth: 2, borderLeftColor: color.slate, backgroundColor: color.surface },
  assurance: { marginTop: space.md, gap: space.sm, paddingTop: space.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line },
  dock: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: gutter, paddingTop: space.md, backgroundColor: 'rgba(10,10,11,0.94)', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line },
});
