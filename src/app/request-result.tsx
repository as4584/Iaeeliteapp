import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Rule } from '@/components/Rule';
import { Text } from '@/components/Text';
import { useContent } from '@/content/ContentProvider';
import { crest } from '@/content/media';
import { buildRequestEmail, type DeliveryStatus, toOutcome } from '@/features/request/model';
import { useRequest } from '@/features/request/RequestProvider';
import { callNumber, copyText } from '@/lib/contact';
import { feel, useReducedMotion } from '@/lib/feel';
import { color, gutter, space } from '@/theme/tokens';

const STATUSES: DeliveryStatus[] = ['sent', 'saved', 'cancelled', 'undetermined', 'handoff', 'failed'];

/** Signature moment 3 — but only when iOS Mail actually reports `sent`. */
export default function RequestResult() {
  const params = useLocalSearchParams<{ status?: string }>();
  const status: DeliveryStatus = STATUSES.includes(params.status as DeliveryStatus) ? (params.status as DeliveryStatus) : 'undetermined';
  const outcome = toOutcome(status);
  const content = useContent();
  const { draft, reset } = useRequest();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  // Snapshot before a successful send clears the draft.
  const [mail] = useState(() => buildRequestEmail(draft, content));

  useEffect(() => {
    if (outcome.success) {
      feel.success();
      reset();
    }
  }, [outcome.success, reset]);

  const enter = (d: number) => (reduce ? undefined : FadeInDown.duration(480).delay(d));

  return (
    <ScrollView style={styles.root} contentContainerStyle={[styles.body, { paddingTop: insets.top + space.xxxl, paddingBottom: insets.bottom + space.xxxl }]} testID={`result-${status}`}>
      <Animated.View entering={reduce ? undefined : outcome.success ? ZoomIn.springify().damping(16) : FadeIn} style={styles.crestWrap}>
        <Image source={crest} style={[styles.crest, !outcome.success && { opacity: 0.55 }]} contentFit="contain" accessibilityElementsHidden />
      </Animated.View>

      <Animated.View entering={enter(200)} style={{ alignItems: 'center', gap: space.md }}>
        <Text variant="overline" tone={outcome.success ? 'gold' : 'muted'}>{outcome.success ? 'Request sent' : 'Request not yet sent'}</Text>
        <Text variant="display" style={{ textAlign: 'center', fontSize: 34, lineHeight: 40 }} accessibilityLiveRegion="polite">{outcome.title}</Text>
      </Animated.View>
      <Rule draw={outcome.success} delay={500} width={72} style={{ alignSelf: 'center', marginVertical: space.xl }} />
      <Animated.View entering={enter(320)}>
        <Text tone="muted" style={{ textAlign: 'center' }}>{outcome.message}</Text>
      </Animated.View>

      {outcome.success ? (
        <Animated.View entering={enter(520)} style={styles.timeline}>
          <Text variant="overline" tone="faint" style={{ marginBottom: space.sm }}>What happens next</Text>
          {content.process.slice(0, 4).map((p, i) => (
            <View key={p.step} style={styles.tlRow}>
              <View style={[styles.dot, i === 0 && styles.dotOn]} />
              <View style={{ flex: 1 }}>
                <Text variant="label" tone={i === 0 ? 'gold' : 'default'}>{p.step} · {p.title}{i === 0 ? '  ✓' : ''}</Text>
                <Text variant="caption" tone="muted">{p.body}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      ) : null}

      <View style={styles.actions}>
        {outcome.success ? (
          <Button label="Done" onPress={() => router.dismissTo('/')} testID="done" />
        ) : (
          <>
            {status !== 'failed' ? <Button label="Back to my request" onPress={() => router.back()} testID="back-to-request" /> : null}
            <Button label={`Call ${content.contact.phoneDisplay}`} kind={status === 'failed' ? 'primary' : 'secondary'} onPress={() => callNumber(content.contact.phoneE164)} />
            <Button
              label={copied ? 'Copied — paste into any email' : 'Copy request text'}
              kind="quiet"
              arrow={false}
              onPress={async () => {
                await copyText(`To: ${mail.to}\nSubject: ${mail.subject}\n\n${mail.body}`);
                setCopied(true);
              }}
              style={{ alignSelf: 'center' }}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  body: { paddingHorizontal: gutter },
  crestWrap: { alignItems: 'center', marginBottom: space.xl },
  crest: { width: 120, height: 120 },
  timeline: { marginTop: space.xxl, padding: space.lg, borderWidth: StyleSheet.hairlineWidth, borderColor: color.line, gap: space.md },
  tlRow: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, marginTop: 4, borderWidth: 1, borderColor: color.textFaint, transform: [{ rotate: '45deg' }] },
  dotOn: { backgroundColor: color.gold, borderColor: color.gold },
  actions: { marginTop: space.xxl, gap: space.md },
});
