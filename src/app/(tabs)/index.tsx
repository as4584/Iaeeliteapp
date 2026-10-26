import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Hero } from '@/components/Hero';
import { SectionHeader } from '@/components/SectionHeader';
import { Text } from '@/components/Text';
import { useCollections, useContent } from '@/content/ContentProvider';
import { resolveImage } from '@/content/media';
import { useRequest } from '@/features/request/RequestProvider';
import { color, gutter, space } from '@/theme/tokens';

export default function Home() {
  const content = useContent();
  const collections = useCollections();
  const { startWith } = useRequest();
  const featured = content.services.find((s) => s.featured) ?? content.services[0];

  const goRequest = (serviceId?: string) => {
    if (serviceId) startWith(serviceId);
    router.navigate('/request');
  };

  return (
    <ScrollView style={styles.root} contentInsetAdjustmentBehavior="never" testID="home">
      <Hero hero={content.hero} motto={content.brand.motto} onRequest={() => goRequest()} />

      {content.announcement?.active && content.announcement.text ? (
        <View style={styles.announce} accessibilityRole="summary">
          <Text variant="overline" tone="gold">Notice</Text>
          <Text variant="bodySmall">{content.announcement.text}</Text>
        </View>
      ) : null}

      {/* Featured offering */}
      <Pressable
        onPress={() => router.push({ pathname: '/service/[id]', params: { id: featured.id } })}
        accessibilityRole="button"
        accessibilityLabel={`Featured: ${featured.title}. ${featured.summary}`}
        style={styles.featured}>
        <Image source={resolveImage(featured.image)} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityIgnoresInvertColors />
        <LinearGradient colors={['transparent', 'rgba(10,10,11,0.92)']} locations={[0.25, 0.85]} style={StyleSheet.absoluteFill} />
        <View style={styles.featuredCopy}>
          {featured.badge ? <Badge {...featured.badge} glint /> : null}
          <Text variant="title">{featured.title}</Text>
          <Text tone="muted">{featured.summary}</Text>
          <Text variant="label" tone="gold" style={{ marginTop: space.sm }}>See what’s included</Text>
        </View>
      </Pressable>

      {/* Collections */}
      <SectionHeader overline="What we handle" title="Four ways in." style={styles.section} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail} decelerationRate="fast" snapToInterval={232}>
        {collections.map((c, i) => (
          <Pressable
            key={c.id}
            onPress={() => router.navigate({ pathname: '/services', params: { c: c.id } })}
            accessibilityRole="button"
            accessibilityLabel={`${c.overline}. ${c.title}`}
            style={styles.tile}>
            <Image source={resolveImage(c.image)} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityIgnoresInvertColors />
            <LinearGradient colors={['transparent', 'rgba(10,10,11,0.95)']} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.tileCopy}>
              <Text variant="overline" tone="gold">{String(i + 1).padStart(2, '0')} · {c.overline}</Text>
              <Text variant="heading" numberOfLines={3}>{c.title}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* The standard */}
      <View style={[styles.section, styles.padded, { gap: space.md }]}>
        <Text variant="overline" tone="gold">{content.standard.overline}</Text>
        <Text variant="title">{content.standard.title}</Text>
        <Text tone="muted">{content.standard.body}</Text>
      </View>

      {/* Scope & scale */}
      <View style={[styles.grid, styles.padded]}>
        {content.scale.map((s) => (
          <View key={s.label} style={styles.stat} accessible accessibilityLabel={`${s.value} ${s.label}. ${s.detail}`}>
            <Text variant="heading" tone="gold" style={{ fontSize: 26, lineHeight: 30 }}>{s.value}</Text>
            <Text variant="overline">{s.label}</Text>
            <Text variant="caption" tone="faint">{s.detail}</Text>
          </View>
        ))}
      </View>

      {/* How it works */}
      <SectionHeader overline="The Engagement" title="How it works, start to finish." style={styles.section} />
      <View style={[styles.padded, { marginTop: space.lg }]}>
        {content.process.map((p, i) => (
          <View key={p.step} style={[styles.step, i === content.process.length - 1 && { borderBottomWidth: 0 }]}>
            <Text variant="overline" tone="gold" style={{ width: 32 }}>{p.step}</Text>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="label">{p.title}</Text>
              <Text variant="bodySmall" tone="muted">{p.body}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Field record */}
      <SectionHeader overline="Field Record" title="The work, on the record." style={styles.section} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {content.field.map((f) => (
          <View key={f.caption} style={styles.field}>
            <Image source={resolveImage(f.image)} style={styles.fieldImg} contentFit="cover" accessibilityLabel={f.caption} />
            <Text variant="overline" tone="muted" style={{ marginTop: space.sm }}>{f.caption}</Text>
          </View>
        ))}
      </ScrollView>
      <Text variant="caption" tone="faint" style={[styles.padded, { marginTop: space.sm }]}>
        Representative of the standard we run to. Identifying detail withheld by default.
      </Text>

      {/* Mission */}
      <View style={[styles.section, styles.padded, styles.mission]}>
        <Text variant="overline" tone="gold">{content.mission.overline}</Text>
        <Text variant="title">{content.mission.title}</Text>
        <Text tone="muted">{content.mission.body}</Text>
        <Text variant="heading" italic tone="gold">“{content.mission.quote}”</Text>
      </View>

      {/* Close */}
      <View style={[styles.padded, styles.close]}>
        <Text variant="title" style={{ textAlign: 'center' }}>Tell us about the engagement.</Text>
        <Text tone="muted" style={{ textAlign: 'center' }}>{content.contact.responseNote}</Text>
        <Button label="Begin a request" onPress={() => goRequest()} style={{ alignSelf: 'stretch' }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  padded: { paddingHorizontal: gutter },
  section: { marginTop: space.huge },
  announce: { marginHorizontal: gutter, padding: space.lg, borderLeftWidth: 2, borderLeftColor: color.gold, backgroundColor: color.surface, gap: 4, marginBottom: space.xl },
  featured: { marginHorizontal: gutter, height: 440, backgroundColor: color.surface, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: color.goldDeep },
  featuredCopy: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: space.xl, gap: space.sm },
  rail: { paddingHorizontal: gutter, gap: space.md, paddingTop: space.xl },
  tile: { width: 220, height: 300, backgroundColor: color.surface, overflow: 'hidden' },
  tileCopy: { position: 'absolute', left: space.lg, right: space.lg, bottom: space.lg, gap: space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: space.xxl, borderTopWidth: StyleSheet.hairlineWidth, borderLeftWidth: StyleSheet.hairlineWidth, borderColor: color.line, marginHorizontal: gutter, paddingHorizontal: 0 },
  stat: { width: '50%', padding: space.lg, gap: 4, borderRightWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: color.line },
  step: { flexDirection: 'row', gap: space.md, paddingVertical: space.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: color.line },
  field: { width: 200 },
  fieldImg: { width: 200, height: 250, backgroundColor: color.surface },
  mission: { gap: space.md },
  close: { marginTop: space.huge, marginBottom: space.huge * 1.5, gap: space.lg, alignItems: 'center', paddingTop: space.xxl, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line, marginHorizontal: gutter, paddingHorizontal: 0 },
});
