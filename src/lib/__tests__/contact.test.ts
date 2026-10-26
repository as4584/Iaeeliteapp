import * as Linking from 'expo-linking';
import * as MailComposer from 'expo-mail-composer';

import { callNumber, composeEmail, openExternal } from '../contact';

jest.mock('expo-mail-composer', () => ({
  isAvailableAsync: jest.fn(),
  composeAsync: jest.fn(),
  MailComposerStatus: { SENT: 'sent', SAVED: 'saved', CANCELLED: 'cancelled', UNDETERMINED: 'undetermined' },
}));
jest.mock('expo-linking', () => ({ canOpenURL: jest.fn(), openURL: jest.fn() }));
jest.mock('expo-clipboard', () => ({ setStringAsync: jest.fn() }));

const mail = MailComposer as jest.Mocked<typeof MailComposer>;
const link = Linking as jest.Mocked<typeof Linking>;

beforeEach(() => jest.resetAllMocks());

describe('composeEmail reports what actually happened', () => {
  it.each([
    ['sent', 'sent'],
    ['saved', 'saved'],
    ['cancelled', 'cancelled'],
    ['undetermined', 'undetermined'],
  ])('Mail status %s → %s', async (status, expected) => {
    mail.isAvailableAsync.mockResolvedValue(true);
    mail.composeAsync.mockResolvedValue({ status } as never);
    expect(await composeEmail('a@b.co', 'S', 'B')).toBe(expected);
    expect(mail.composeAsync).toHaveBeenCalledWith({ recipients: ['a@b.co'], subject: 'S', body: 'B' });
  });

  it('falls back to a mailto: hand-off when Mail has no account', async () => {
    mail.isAvailableAsync.mockResolvedValue(false);
    link.canOpenURL.mockResolvedValue(true);
    expect(await composeEmail('a@b.co', 'S', 'B')).toBe('handoff');
    expect(link.openURL).toHaveBeenCalledWith('mailto:a@b.co?subject=S&body=B');
  });

  it('reports failure when no mail app can open', async () => {
    mail.isAvailableAsync.mockResolvedValue(false);
    link.canOpenURL.mockResolvedValue(false);
    expect(await composeEmail('a@b.co', 'S', 'B')).toBe('failed');
  });

  it('reports failure (never throws) when the composer crashes', async () => {
    mail.isAvailableAsync.mockResolvedValue(true);
    mail.composeAsync.mockRejectedValue(new Error('boom'));
    expect(await composeEmail('a@b.co', 'S', 'B')).toBe('failed');
  });
});

describe('links', () => {
  it('dials the E.164 number', async () => {
    link.openURL.mockResolvedValue(true);
    expect(await callNumber('+15513014430')).toBe(true);
    expect(link.openURL).toHaveBeenCalledWith('tel:+15513014430');
  });

  it('refuses non-https/mailto/tel URLs', async () => {
    expect(await openExternal('javascript:alert(1)')).toBe(false);
    expect(await openExternal('http://example.com')).toBe(false);
    expect(link.openURL).not.toHaveBeenCalled();
  });

  it('returns false instead of throwing when a link cannot open', async () => {
    link.openURL.mockRejectedValue(new Error('no handler'));
    expect(await openExternal('https://instagram.com/x')).toBe(false);
  });
});
