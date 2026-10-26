import type { Content } from '@/content/schema';

export type RequestDraft = {
  serviceIds: string[];
  date: string; // free text: "Mar 14" / "Mar 14–16" / "flexible"
  city: string;
  name: string;
  organization: string;
  phone: string;
  email: string;
  details: string;
};

export const emptyDraft: RequestDraft = {
  serviceIds: [],
  date: '',
  city: '',
  name: '',
  organization: '',
  phone: '',
  email: '',
  details: '',
};

export type StepId = 'what' | 'when' | 'who' | 'review';
export const STEPS: { id: StepId; label: string }[] = [
  { id: 'what', label: 'What' },
  { id: 'when', label: 'When' },
  { id: 'who', label: 'Who' },
  { id: 'review', label: 'Review' },
];

export type FieldErrors = Partial<Record<keyof RequestDraft, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateStep(step: StepId, d: RequestDraft): FieldErrors {
  const e: FieldErrors = {};
  if (step === 'what' || step === 'review') {
    if (d.serviceIds.length === 0) e.serviceIds = 'Choose at least one thing to handle.';
  }
  if (step === 'when' || step === 'review') {
    if (!d.city.trim()) e.city = 'Which city is this in?';
  }
  if (step === 'who' || step === 'review') {
    if (!d.name.trim()) e.name = 'Add a name we can address.';
    if (!d.email.trim() && !d.phone.trim()) {
      e.email = 'Add an email or a phone number so we can reply.';
    } else if (d.email.trim() && !EMAIL_RE.test(d.email.trim())) {
      e.email = 'That email address looks incomplete.';
    }
    if (d.phone.trim() && d.phone.replace(/\D/g, '').length < 7) {
      e.phone = 'That number looks too short.';
    }
  }
  return e;
}

export function isValid(errors: FieldErrors): boolean {
  return Object.keys(errors).length === 0;
}

/**
 * Selecting "Full Engagement" covers everything, so it replaces individual picks;
 * picking an individual service removes Full Engagement.
 */
export function toggleService(ids: string[], id: string, fullId: string): string[] {
  if (ids.includes(id)) return ids.filter((x) => x !== id);
  if (id === fullId) return [fullId];
  return [...ids.filter((x) => x !== fullId), id];
}

export function buildRequestEmail(d: RequestDraft, content: Content) {
  const titles = d.serviceIds
    .map((id) => content.services.find((s) => s.id === id)?.title)
    .filter((t): t is string => Boolean(t));
  const what = titles.length ? titles.join(', ') : 'Not specified';
  const line = (label: string, value: string) => `${label}: ${value.trim() || '—'}`;

  const subject = `Elite Service Request — ${titles[0] ?? 'Consultation'}${titles.length > 1 ? ` +${titles.length - 1}` : ''}${d.city.trim() ? ` · ${d.city.trim()}` : ''}`;
  const body = [
    'ELITE SERVICE REQUEST',
    '',
    line('What needs handling', what),
    line('Event date', d.date),
    line('City', d.city),
    '',
    line('Name', d.name),
    line('Organization / Management', d.organization),
    line('Best number', d.phone),
    line('Email', d.email),
    '',
    'Details:',
    d.details.trim() || '—',
    '',
    '— Sent from the IAE Elite iPhone app',
  ].join('\n');

  return { to: content.contact.email, subject, body };
}

export function mailtoUrl(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** What actually happened when we tried to deliver the request. */
export type DeliveryStatus = 'sent' | 'saved' | 'cancelled' | 'undetermined' | 'handoff' | 'failed';

export type Outcome = {
  status: DeliveryStatus;
  title: string;
  message: string;
  success: boolean;
};

export function toOutcome(status: DeliveryStatus): Outcome {
  switch (status) {
    case 'sent':
      return {
        status,
        success: true,
        title: 'Request on its way.',
        message: 'Mail has your request queued to send. We respond privately — usually within the hour during active hours.',
      };
    case 'saved':
      return {
        status,
        success: false,
        title: 'Saved as a draft.',
        message: 'Your request is in Mail’s Drafts and has not been sent yet. Open Mail and press Send when you’re ready.',
      };
    case 'cancelled':
      return {
        status,
        success: false,
        title: 'Not sent.',
        message: 'The email was closed without sending. Your details are still here — try again, or call the private line.',
      };
    case 'handoff':
      return {
        status,
        success: false,
        title: 'Finish in your mail app.',
        message: 'We opened your mail app with the request filled in. It is only sent once you press Send there.',
      };
    case 'undetermined':
      return {
        status,
        success: false,
        title: 'We can’t confirm it was sent.',
        message: 'Check your Mail outbox. If it isn’t there, try again or call the private line.',
      };
    case 'failed':
      return {
        status,
        success: false,
        title: 'Mail isn’t available.',
        message: 'This device can’t compose email right now. Call the private line, or copy the request and send it from any account.',
      };
  }
}
