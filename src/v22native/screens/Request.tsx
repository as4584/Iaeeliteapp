import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { toOutcome } from '@/features/request/model';
import { composeEmail } from '@/lib/contact';

import { buildRequestBody, contact, isFormValid, processSteps, REQUEST_SUBJECT, type RequestForm, serviceOptions } from '../content';
import { media } from '../media';
import { c, sans, serif } from '../theme';
import { Chevron, DiamondRule, GoldButton, GoldText, RichHeadline, TopBar } from '../ui';
import { SecHero } from './parts';

type Props = {
  form: RequestForm;
  setForm: (f: RequestForm) => void;
  onSent: () => void;
  openLegal: () => void;
};

function Label({ children }: { children: string }) {
  return (
    <View style={styles.lblRow}>
      <Text style={styles.lblDia}>◆</Text>
      <GoldText style={styles.lbl}>{children.toUpperCase()}</GoldText>
    </View>
  );
}

function Input(props: TextInputProps) {
  const [focus, setFocus] = useState(false);
  return (
    <TextInput
      placeholderTextColor={c.off} // his -webkit-text-fill-color makes placeholders ivory on iOS
      keyboardAppearance="dark"
      selectionColor={c.g4}
      {...props}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={[styles.input, focus && styles.inputFocus, props.style]}
    />
  );
}

/** A tappable field styled like his inputs, for the select and the date. */
function FieldButton({ value, placeholder, onPress, chevron, label }: { value: string; placeholder: string; onPress: () => void; chevron?: boolean; label: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${label}: ${value || placeholder}`} style={[styles.input, { justifyContent: 'center' }]}>
      <Text style={[styles.inputTxt, !value && { fontSize: 14 }]} numberOfLines={1}>{value || placeholder}</Text>
      {chevron && (
        <View style={styles.selChevron}>
          <View style={{ transform: [{ rotate: '90deg' }] }}>
            <Chevron size={18} color="rgba(232,204,106,0.55)" />
          </View>
        </View>
      )}
    </Pressable>
  );
}

const toISO = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const fromISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const pretty = (s: string) => (s ? fromISO(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '');

export function Request({ form, setForm, onSent, openLegal }: Props) {
  const insets = useSafeAreaInsets();
  const [err, setErr] = useState(false);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [picker, setPicker] = useState<null | 'service' | 'date'>(null);
  const [draftDate, setDraftDate] = useState(new Date());
  const set = (k: keyof RequestForm) => (v: string) => setForm({ ...form, [k]: v });

  const submit = async () => {
    if (!isFormValid(form)) {
      setErr(true);
      return;
    }
    setErr(false);
    setNote('');
    setBusy(true);
    const status = await composeEmail(contact.email, REQUEST_SUBJECT, buildRequestBody(form));
    setBusy(false);
    const outcome = toOutcome(status);
    // Only a confirmed send shows "Request Received" — never on cancel, draft or failure.
    if (outcome.success) onSent();
    else setNote(outcome.message);
  };

  return (
    <View style={styles.fill}>
      <TopBar sub="Confidential Request" />
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.fill} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <SecHero film={media.filmRequest} eyebrow="The Engagement" segs={[{ t: 'Book an ' }, { t: 'event.', em: true }]} />
          <View style={styles.intro}>
            <Text style={styles.introTxt}>One request. One accountable process. From first contact to confirmed dates.</Text>
          </View>

          <DiamondRule style={{ marginVertical: 26 }} />
          <View style={styles.process}>
            <RichHeadline segs={[{ t: 'How it ' }, { t: 'works.', em: true }]} style={styles.processTitle} emStyle={{ fontFamily: serif(700, true) }} />
            {processSteps.map((s, i) => (
              <View key={s.name} style={styles.step}>
                {i < processSteps.length - 1 && <View style={styles.stepLine} />}
                <View style={styles.stepNum}>
                  <GoldText style={styles.stepNumTxt}>{String(i + 1)}</GoldText>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepName}>{s.name.toUpperCase()}</Text>
                  <Text style={styles.stepDesc}>{s.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          <DiamondRule style={{ marginVertical: 26 }} />
          <View style={styles.form}>
            <View style={styles.grp}>
              <Label>Service Requested</Label>
              <FieldButton label="Service Requested" value={form.service} placeholder="Select a service" chevron onPress={() => setPicker('service')} />
            </View>
            <DiamondRule style={{ marginHorizontal: 0, marginTop: 0, marginBottom: 20 }} /* top margin collapses into the group's 22 */ />
            <View style={styles.grp}>
              <Label>Name</Label>
              <Input value={form.name} onChangeText={set('name')} placeholder="Your name" autoComplete="name" textContentType="name" accessibilityLabel="Name" />
            </View>
            <View style={styles.grp}>
              <Label>Organization / Management</Label>
              <Input value={form.org} onChangeText={set('org')} placeholder="Label, management, or production" textContentType="organizationName" accessibilityLabel="Organization" />
            </View>
            <View style={styles.row}>
              <View style={[styles.grp, { flex: 1 }]}>
                <Label>Event Date</Label>
                <FieldButton
                  label="Event Date"
                  value={pretty(form.date)}
                  placeholder="mm/dd/yyyy"
                  onPress={() => {
                    setDraftDate(form.date ? fromISO(form.date) : new Date());
                    setPicker('date');
                  }}
                />
              </View>
              <View style={[styles.grp, { flex: 1 }]}>
                <Label>City</Label>
                <Input value={form.city} onChangeText={set('city')} placeholder="City" textContentType="addressCity" accessibilityLabel="City" />
              </View>
            </View>
            <View style={styles.grp}>
              <Label>Phone</Label>
              <Input value={form.phone} onChangeText={set('phone')} placeholder="Best number to reach you" keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" accessibilityLabel="Phone" />
            </View>
            <View style={styles.grp}>
              <Label>Email</Label>
              <Input value={form.email} onChangeText={set('email')} placeholder="your@email.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" accessibilityLabel="Email" />
            </View>
            <View style={styles.grp}>
              <Label>Details</Label>
              <Input value={form.details} onChangeText={set('details')} placeholder="Describe what you need handled..." multiline style={styles.ta} accessibilityLabel="Details" />
            </View>
            {err && <Text style={styles.err}>Please complete all required fields.</Text>}
            <GoldButton label={busy ? 'Opening Mail…' : 'Send Elite Service Request'} onPress={submit} testID="send-request" />
            {!!note && <Text style={styles.outcome}>{note}</Text>}
            <Text style={styles.note}>
              Your request opens pre-filled in your mail app — just review and press Send. We never share principal details. By sending, you agree to our{' '}
              <Text style={styles.noteLink} onPress={openLegal} accessibilityRole="link">Privacy Policy &amp; Terms</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={picker !== null} transparent animationType="slide" onRequestClose={() => setPicker(null)}>
        <Pressable style={styles.sheetBackdrop} onPress={() => setPicker(null)} accessibilityLabel="Close" />
        <View style={[styles.sheet, { paddingBottom: 16 + insets.bottom }]}>
          <View style={styles.sheetBar}>
            <GoldText style={styles.sheetTitle}>{picker === 'date' ? 'EVENT DATE' : 'SERVICE REQUESTED'}</GoldText>
            {picker === 'date' && (
              <Pressable
                onPress={() => {
                  set('date')(toISO(draftDate));
                  setPicker(null);
                }}
                accessibilityRole="button"
              >
                <Text style={styles.sheetDone}>DONE</Text>
              </Pressable>
            )}
          </View>
          {picker === 'service' &&
            serviceOptions.map((o) => (
              <Pressable
                key={o}
                onPress={() => {
                  set('service')(o);
                  setPicker(null);
                }}
                style={({ pressed }) => [styles.opt, pressed && { backgroundColor: 'rgba(201,168,76,0.08)' }]}
                accessibilityRole="button"
                accessibilityState={{ selected: form.service === o }}
              >
                <Text style={[styles.optTxt, form.service === o && { color: c.g4 }]}>{o}</Text>
                {form.service === o && <Text style={styles.optTick}>◆</Text>}
              </Pressable>
            ))}
          {picker === 'date' && (
            <DateTimePicker
              value={draftDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              themeVariant="dark"
              accentColor={c.g4}
              minimumDate={new Date()}
              onChange={(_, d) => {
                if (!d) return;
                setDraftDate(d);
                if (Platform.OS !== 'ios') {
                  set('date')(toISO(d));
                  setPicker(null);
                }
              }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: c.bg },
  intro: { paddingTop: 32, paddingHorizontal: 22 },
  introTxt: { fontFamily: sans(400), fontSize: 15, color: c.white, lineHeight: 25.5, textAlign: 'center' },
  process: { paddingHorizontal: 22, paddingBottom: 32 },
  processTitle: { fontFamily: serif(700), fontSize: 36, color: c.off, marginBottom: 20, lineHeight: 39.6 },
  step: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 26 },
  stepLine: { position: 'absolute', left: 17, top: 38, bottom: -22, width: 1, backgroundImage: 'linear-gradient(to bottom, rgba(232,204,106,0.55), rgba(232,204,106,0.05))' },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(245,224,152,0.6)',
    backgroundImage: 'radial-gradient(circle, rgba(232,204,106,0.2), rgba(201,168,76,0.04))',
    boxShadow: '0 0 16px rgba(201,168,76,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumTxt: { fontFamily: serif(700), fontSize: 18, lineHeight: 22 },
  stepName: { fontFamily: sans(800), fontSize: 12.5, letterSpacing: 2, color: c.off, marginBottom: 5 },
  stepDesc: { fontFamily: sans(300), fontSize: 11, color: c.muted, lineHeight: 19.25 },
  form: { paddingHorizontal: 22, paddingBottom: 64 },
  grp: { marginBottom: 22 },
  row: { flexDirection: 'row', gap: 18 },
  lblRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  lblDia: { fontSize: 6, color: c.g4, marginRight: 9 },
  lbl: { fontFamily: sans(900), fontSize: 7.5, letterSpacing: 4 },
  input: {
    minHeight: 52,
    backgroundColor: 'rgba(201,168,76,0.045)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.28)',
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 16,
    fontFamily: sans(300),
    fontSize: 15,
    color: c.off,
    boxShadow: 'inset 0 1px 0 rgba(255,248,190,0.04)',
  },
  inputFocus: {
    borderColor: c.g4,
    backgroundColor: 'rgba(201,168,76,0.08)',
    boxShadow: '0 0 0 3px rgba(232,204,106,0.12), 0 0 22px rgba(201,168,76,0.28)',
  },
  inputTxt: { fontFamily: sans(300), fontSize: 15, color: c.off, paddingRight: 24 },
  selChevron: { position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' },
  ta: { height: 104, lineHeight: 24.5, fontSize: 14, textAlignVertical: 'top' },
  err: { fontFamily: sans(600), fontSize: 10, color: '#c05050', marginBottom: 14, letterSpacing: 1 },
  outcome: { fontFamily: sans(500), fontSize: 12.5, color: c.g5, lineHeight: 21, textAlign: 'center', marginTop: 4 },
  note: { fontFamily: sans(400), fontSize: 12.5, color: c.white, lineHeight: 22.5, letterSpacing: 0.2, textAlign: 'center', marginTop: 22, paddingHorizontal: 2 },
  noteLink: { color: c.g5, fontFamily: sans(700), textDecorationLine: 'underline' },
  sheetBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: '#0E0B06', borderTopWidth: 1.5, borderTopColor: 'rgba(232,204,106,0.45)', paddingTop: 8, paddingHorizontal: 18 },
  sheetBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  sheetTitle: { fontFamily: sans(900), fontSize: 9, letterSpacing: 3.5 },
  sheetDone: { fontFamily: sans(900), fontSize: 11, letterSpacing: 3, color: c.g4, padding: 6 },
  opt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.12)' },
  optTxt: { fontFamily: sans(500), fontSize: 15, color: c.off },
  optTick: { fontSize: 8, color: c.g4 },
});
