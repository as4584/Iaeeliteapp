import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTabScreenInsets } from '@/lib/insets';

import { Button } from '@/components/Button';
import { Text } from '@/components/Text';
import { useContent } from '@/content/ContentProvider';
import { crest } from '@/content/media';
import { callNumber, composeEmail, openExternal } from '@/lib/contact';
import { color, gutter, space } from '@/theme/tokens';

export default function Connect() {
  const content = useContent();
  const { contact } = content;
  const insets = useTabScreenInsets();
  const [mailNote, setMailNote] = useState<string | null>(null);

  const email = async () => {
    const status = await composeEmail(contact.email, 'Inquiry: IAE Elite', '');
    // Honest, inline feedback for a plain email — no fake success.
    setMailNote(
      status === 'sent'
        ? 'Email sent from Mail.'
        : status === 'saved'
          ? 'Saved to your Mail drafts, not sent yet.'
          : status === 'handoff'
            ? 'Opened in your mail app. Send it from there.'
            : status === 'failed'
              ? `Mail isn’t available. Write to ${contact.email} from any account, or call.`
              : null,
    );
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingTop: insets.top + space.xl, paddingBottom: space.huge * 2 }} testID="connect">
      <View style={styles.pad}>
        <Image source={crest} style={styles.crest} contentFit="contain" accessibilityElementsHidden />
        <Text variant="overline" tone="gold" style={{ marginTop: space.xl }}>Direct line</Text>
        <Text variant="display" style={{ marginTop: space.sm }}>One line.{'\n'}<Text variant="display" italic inline tone="gold">Handled quietly.</Text></Text>
        <Text tone="muted" style={{ marginTop: space.xl }}>{contact.responseNote}</Text>
      </View>

      <View style={[styles.pad, { gap: space.md, marginTop: space.xxl }]}>
        <Button label={`Call ${contact.phoneDisplay}`} onPress={() => callNumber(contact.phoneE164)} testID="call" accessibilityHint="Opens the phone app" />
        <Button label="Email the team" kind="secondary" onPress={email} testID="email" accessibilityHint={`Writes to ${contact.email}`} />
        <Text variant="caption" tone="faint" style={{ textAlign: 'center' }} selectable>{contact.email}</Text>
        {mailNote ? <Text variant="caption" tone="gold" accessibilityLiveRegion="polite" style={{ textAlign: 'center' }}>{mailNote}</Text> : null}
      </View>

      <Pressable onPress={() => router.navigate('/request')} accessibilityRole="button" accessibilityLabel="Start a private request" style={styles.requestRow}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text variant="overline" tone="gold">Planning an engagement?</Text>
          <Text variant="heading">Send a full brief in under a minute.</Text>
        </View>
        <Text tone="gold" style={{ fontSize: 26 }} importantForAccessibility="no">›</Text>
      </Pressable>

      <Text variant="overline" tone="faint" style={[styles.pad, { marginTop: space.xxxl }]}>Follow & find us</Text>
      <View style={{ marginTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line }}>
        {content.socials.map((s) => (
          <Pressable key={s.id} onPress={() => openExternal(s.url)} accessibilityRole="link" accessibilityLabel={`${s.label}, ${s.handle}`} style={({ pressed }) => [styles.link, pressed && { backgroundColor: color.surface }]}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text variant="label">{s.label}</Text>
              <Text variant="caption" tone="muted">{s.handle}</Text>
            </View>
            <Text tone="gold" importantForAccessibility="no">↗</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.pad, styles.confid]}>
        <Text variant="overline" tone="muted">Handled in private. Spoken of to no one.</Text>
        <Text variant="bodySmall" tone="muted">{contact.confidentiality}</Text>
        <Text variant="caption" tone="faint">{contact.region}</Text>
        <Text variant="caption" tone="faint" style={{ marginTop: space.lg }}>{content.brand.name} · {content.brand.division}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  pad: { paddingHorizontal: gutter },
  crest: { width: 64, height: 64 },
  requestRow: { flexDirection: 'row', alignItems: 'center', gap: space.lg, marginTop: space.xxxl, marginHorizontal: gutter, padding: space.xl, borderWidth: 1, borderColor: color.goldDeep },
  link: { flexDirection: 'row', alignItems: 'center', minHeight: 64, paddingHorizontal: gutter, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: color.line },
  confid: { marginTop: space.xxxl, gap: space.sm },
});
