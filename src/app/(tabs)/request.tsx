import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, type ScrollViewInstance, StyleSheet, type TextInputInstance, View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useTabScreenInsets } from '@/lib/insets';

import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { Text } from '@/components/Text';
import { sortServices, useCollections, useContent } from '@/content/ContentProvider';
import { buildRequestEmail, type FieldErrors, isValid, STEPS, type StepId, toggleService, validateStep } from '@/features/request/model';
import { useRequest } from '@/features/request/RequestProvider';
import { SelectRow } from '@/features/request/SelectRow';
import { composeEmail } from '@/lib/contact';
import { feel, useReducedMotion } from '@/lib/feel';
import { color, gutter, radius, space } from '@/theme/tokens';

const WHEN_CHIPS = ['Within 24 hours', 'This week', 'This month', 'Dates flexible'];
const CITY_CHIPS = ['New York', 'New Jersey'];

export default function RequestScreen() {
  // Remounting on a new generation returns the flow to step 1 with fresh local state.
  const { generation } = useRequest();
  return <RequestFlow key={generation} />;
}

function RequestFlow() {
  const content = useContent();
  const collections = useCollections();
  const { draft, update } = useRequest();
  const insets = useTabScreenInsets();
  const reduce = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  // State updates are async; a ref blocks a second tap landing before the re-render.
  const sendingRef = useRef(false);
  const scroll = useRef<ScrollViewInstance>(null);
  const orgRef = useRef<TextInputInstance>(null);
  const phoneRef = useRef<TextInputInstance>(null);
  const emailRef = useRef<TextInputInstance>(null);
  const detailsRef = useRef<TextInputInstance>(null);

  const step: StepId = STEPS[stepIndex].id;
  const fullId = content.requestOptions.fullEngagementId;
  const full = content.services.find((s) => s.id === fullId);
  const selectedTitles = useMemo(
    () => draft.serviceIds.map((id) => content.services.find((s) => s.id === id)?.title).filter(Boolean) as string[],
    [draft.serviceIds, content.services],
  );

  const goTo = (i: number) => {
    setErrors({});
    setStepIndex(i);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };

  const next = () => {
    const e = validateStep(step, draft);
    setErrors(e);
    if (!isValid(e)) return;
    feel.advance();
    goTo(stepIndex + 1);
  };

  const send = async () => {
    const e = validateStep('review', draft);
    if (!isValid(e)) {
      setErrors(e);
      // Jump back to the first step with a problem.
      goTo(e.serviceIds ? 0 : e.city ? 1 : 2);
      setErrors(e);
      return;
    }
    if (sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    try {
      const mail = buildRequestEmail(draft, content);
      const status = await composeEmail(mail.to, mail.subject, mail.body);
      router.push({ pathname: '/request-result', params: { status } });
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const toggle = (id: string) => {
    feel.select();
    update({ serviceIds: toggleService(draft.serviceIds, id, fullId) });
    if (errors.serviceIds) setErrors({});
  };

  const transition = reduce ? undefined : FadeInRight.duration(260);
  const exit = reduce ? undefined : FadeOutLeft.duration(160);

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined} testID="request">
      <View style={[styles.header, { paddingTop: insets.top + space.md }]}>
        <Text variant="overline" tone="gold">Private request</Text>
        <View style={styles.progress} accessibilityRole="progressbar" accessibilityLabel={`Step ${stepIndex + 1} of ${STEPS.length}: ${STEPS[stepIndex].label}`}>
          {STEPS.map((s, i) => (
            <Pressable key={s.id} style={styles.seg} disabled={i >= stepIndex} onPress={() => goTo(i)} accessibilityRole="button" accessibilityLabel={`Back to ${s.label}`} accessibilityElementsHidden={i >= stepIndex}>
              <View style={[styles.bar, i <= stepIndex && styles.barOn]} />
              <Text variant="overline" tone={i === stepIndex ? 'default' : i < stepIndex ? 'gold' : 'faint'} style={styles.segLabel} numberOfLines={1}>
                {String(i + 1).padStart(2, '0')} {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: 160 }}>
        <Animated.View key={step} entering={transition} exiting={exit}>
          {step === 'what' && (
            <View>
              <StepIntro title="What do you need handled?" body="Choose everything that applies. Full engagement covers all of it." />
              {full ? <SelectRow service={full} large selected={draft.serviceIds.includes(full.id)} onToggle={() => toggle(full.id)} /> : null}
              {errors.serviceIds ? <Text tone="danger" variant="caption" accessibilityRole="alert" style={styles.err}>{errors.serviceIds}</Text> : null}
              {collections.map((c) => {
                const items = sortServices(content.services.filter((s) => s.collection === c.id && s.requestable && s.id !== fullId));
                if (!items.length) return null;
                return (
                  <View key={c.id} style={{ marginTop: space.xxl }}>
                    <Text variant="overline" tone="faint" style={styles.groupLabel}>{c.overline}</Text>
                    {items.map((s) => (
                      <SelectRow key={s.id} service={s} selected={draft.serviceIds.includes(s.id)} onToggle={() => toggle(s.id)} />
                    ))}
                  </View>
                );
              })}
            </View>
          )}

          {step === 'when' && (
            <View style={styles.form}>
              <StepIntro title="When and where?" body="An exact date helps. Approximate is fine — we confirm everything in writing." inset={false} />
              <FormField label="Event date" value={draft.date} onChangeText={(date) => update({ date })} placeholder="e.g. March 14, or March 14–16" optional returnKeyType="next" />
              <Chips options={WHEN_CHIPS} value={draft.date} onPick={(date) => update({ date })} />
              <FormField label="City" value={draft.city} onChangeText={(city) => update({ city })} placeholder="City or venue area" error={errors.city} autoCapitalize="words" returnKeyType="done" />
              <Chips options={CITY_CHIPS} value={draft.city} onPick={(city) => update({ city })} />
              <Text variant="caption" tone="faint">{content.contact.region} Global travel arranged anywhere.</Text>
            </View>
          )}

          {step === 'who' && (
            <View style={styles.form}>
              <StepIntro title="Who should we reply to?" body="An email or a phone number is enough. Principal details are never shared." inset={false} />
              <FormField label="Name" value={draft.name} onChangeText={(name) => update({ name })} error={errors.name} textContentType="name" autoComplete="name" autoCapitalize="words" returnKeyType="next" onSubmitEditing={() => orgRef.current?.focus()} />
              <FormField ref={orgRef} label="Organization / Management" value={draft.organization} onChangeText={(organization) => update({ organization })} optional textContentType="organizationName" returnKeyType="next" onSubmitEditing={() => phoneRef.current?.focus()} />
              <FormField ref={phoneRef} label="Best number" value={draft.phone} onChangeText={(phone) => update({ phone })} error={errors.phone} keyboardType="phone-pad" textContentType="telephoneNumber" autoComplete="tel" returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()} />
              <FormField ref={emailRef} label="Email" value={draft.email} onChangeText={(email) => update({ email })} error={errors.email} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} textContentType="emailAddress" autoComplete="email" returnKeyType="next" onSubmitEditing={() => detailsRef.current?.focus()} />
              <FormField ref={detailsRef} label="Details" value={draft.details} onChangeText={(details) => update({ details })} optional multiline placeholder="Guests, timing, venue, anything we should know." />
            </View>
          )}

          {step === 'review' && (
            <View style={styles.form}>
              <StepIntro title="Your brief." body="This is exactly what we’ll receive." inset={false} />
              <ReviewBlock label="What" value={selectedTitles.join('\n')} onEdit={() => goTo(0)} />
              <ReviewBlock label="When & where" value={[draft.date || 'Date to confirm', draft.city].join('\n')} onEdit={() => goTo(1)} />
              <ReviewBlock label="Who" value={[draft.name, draft.organization, draft.phone, draft.email].filter(Boolean).join('\n')} onEdit={() => goTo(2)} />
              {draft.details ? <ReviewBlock label="Details" value={draft.details} onEdit={() => goTo(2)} /> : null}
              <Text variant="caption" tone="faint">{content.requestOptions.disclaimer}</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <View style={[styles.dock, { paddingBottom: Math.max(insets.bottom, space.md) }]}>
        {stepIndex > 0 ? (
          <Button label="Back" kind="secondary" arrow={false} onPress={() => goTo(stepIndex - 1)} style={{ flex: 0.6 }} />
        ) : null}
        {step === 'review' ? (
          <Button label={sending ? 'Opening Mail…' : 'Send request'} onPress={send} disabled={sending} style={{ flex: 1 }} testID="send-request" accessibilityHint="Opens a pre-filled email for you to send" />
        ) : (
          <Button
            label={step === 'what' && draft.serviceIds.length ? `Continue · ${draft.serviceIds.length}` : 'Continue'}
            onPress={next}
            style={{ flex: 1 }}
            testID="continue"
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function StepIntro({ title, body, inset = true }: { title: string; body: string; inset?: boolean }) {
  return (
    <View style={[{ gap: space.sm, paddingTop: space.xl, paddingBottom: space.xl }, inset && { paddingHorizontal: gutter }]}>
      <Text variant="title">{title}</Text>
      <Text tone="muted">{body}</Text>
    </View>
  );
}

function Chips({ options, value, onPick }: { options: string[]; value: string; onPick: (v: string) => void }) {
  return (
    <View style={styles.chips}>
      {options.map((o) => {
        const on = value === o;
        return (
          <Pressable key={o} onPress={() => onPick(o)} accessibilityRole="button" accessibilityState={{ selected: on }} style={[styles.chip, on && styles.chipOn]}>
            <Text variant="caption" tone={on ? 'gold' : 'muted'}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ReviewBlock({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <View style={styles.review}>
      <View style={{ flex: 1, gap: 4 }}>
        <Text variant="overline" tone="gold">{label}</Text>
        <Text>{value || '—'}</Text>
      </View>
      <Pressable onPress={onEdit} hitSlop={12} accessibilityRole="button" accessibilityLabel={`Edit ${label}`} style={{ minHeight: 44, justifyContent: 'center' }}>
        <Text variant="label" tone="gold">Edit</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
  header: { paddingHorizontal: gutter, paddingBottom: space.md, gap: space.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: color.line },
  progress: { flexDirection: 'row', gap: 6 },
  seg: { flex: 1, gap: 6 },
  bar: { height: 2, backgroundColor: color.line },
  barOn: { backgroundColor: color.gold },
  segLabel: { fontSize: 9, letterSpacing: 1.2 },
  groupLabel: { paddingHorizontal: gutter, paddingBottom: space.sm },
  err: { paddingHorizontal: gutter, marginTop: space.md },
  form: { paddingHorizontal: gutter, gap: space.lg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: -space.sm },
  chip: { borderWidth: 1, borderColor: color.line, borderRadius: radius.cut, paddingHorizontal: space.md, minHeight: 36, justifyContent: 'center' },
  chipOn: { borderColor: color.gold },
  review: { flexDirection: 'row', gap: space.md, paddingVertical: space.lg, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: color.line },
  dock: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: space.md, paddingHorizontal: gutter, paddingTop: space.md, backgroundColor: 'rgba(10,10,11,0.96)', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: color.line },
});
