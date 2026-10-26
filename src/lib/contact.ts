import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import * as MailComposer from 'expo-mail-composer';

import { type DeliveryStatus, mailtoUrl } from '@/features/request/model';

/** The only place the app talks to Mail / Phone / external URLs. */

export async function composeEmail(to: string, subject: string, body: string): Promise<DeliveryStatus> {
  try {
    if (await MailComposer.isAvailableAsync()) {
      const { status } = await MailComposer.composeAsync({ recipients: [to], subject, body });
      switch (status) {
        case MailComposer.MailComposerStatus.SENT:
          return 'sent';
        case MailComposer.MailComposerStatus.SAVED:
          return 'saved';
        case MailComposer.MailComposerStatus.CANCELLED:
          return 'cancelled';
        default:
          return 'undetermined';
      }
    }
    const url = mailtoUrl(to, subject, body);
    if (await Linking.canOpenURL(url)) {
      await Linking.openURL(url);
      return 'handoff';
    }
    return 'failed';
  } catch {
    return 'failed';
  }
}

export async function callNumber(e164: string): Promise<boolean> {
  const url = `tel:${e164}`;
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

export async function openExternal(url: string): Promise<boolean> {
  if (!/^(https:|mailto:|tel:)/.test(url)) return false;
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}

export async function copyText(text: string): Promise<void> {
  await Clipboard.setStringAsync(text);
}
