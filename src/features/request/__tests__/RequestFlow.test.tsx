import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import RequestScreen from '@/app/(tabs)/request';
import { ContentProvider } from '@/content/ContentProvider';
import { composeEmail } from '@/lib/contact';

import { RequestProvider } from '../RequestProvider';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (...a: unknown[]) => mockPush(...a), navigate: jest.fn() } }));
jest.mock('@/lib/contact', () => ({ composeEmail: jest.fn(async () => 'sent') }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));

const renderFlow = () =>
  render(
    <ContentProvider>
      <RequestProvider>
        <RequestScreen />
      </RequestProvider>
    </ContentProvider>,
  );

beforeEach(() => jest.clearAllMocks());

it('blocks progress until a service is chosen', async () => {
  await renderFlow();
  await fireEvent.press(screen.getByTestId('continue'));
  expect(await screen.findByText('Choose at least one thing to handle.')).toBeTruthy();
  expect(screen.getByText('What do you need handled?')).toBeTruthy();
});

it('walks What → When → Who → Review and sends the exact brief to the business', async () => {
  await renderFlow();

  await fireEvent.press(screen.getByTestId('select-artist-transport'));
  expect(screen.getByText('Continue · 1')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('continue'));

  // Step 2: city is required
  await fireEvent.press(await screen.findByTestId('continue'));
  expect(await screen.findByText('Which city is this in?')).toBeTruthy();
  await fireEvent.press(screen.getByText('New York'));
  await fireEvent.press(screen.getByTestId('continue'));

  // Step 3
  await fireEvent.changeText(await screen.findByLabelText('Name'), 'Jordan Reyes');
  await fireEvent.changeText(screen.getByLabelText('Email'), 'jordan@example.com');
  await fireEvent.press(screen.getByTestId('continue'));

  // Review
  expect(await screen.findByText('Your brief.')).toBeTruthy();
  expect(screen.getByText('Artist Transport')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('send-request'));

  await waitFor(() => expect(composeEmail).toHaveBeenCalledTimes(1));
  const [to, subject, body] = (composeEmail as jest.Mock).mock.calls[0];
  expect(to).toBe('innovationbusiness@icloud.com');
  expect(subject).toBe('Elite Service Request — Artist Transport · New York');
  expect(body).toContain('Name: Jordan Reyes');
  expect(body).toContain('Email: jordan@example.com');
  expect(mockPush).toHaveBeenCalledWith({ pathname: '/request-result', params: { status: 'sent' } });
});

it('passes a cancelled composer through honestly', async () => {
  (composeEmail as jest.Mock).mockResolvedValueOnce('cancelled');
  await renderFlow();
  await fireEvent.press(screen.getByTestId('select-full-engagement'));
  await fireEvent.press(screen.getByTestId('continue'));
  await fireEvent.changeText(await screen.findByLabelText('City'), 'Newark');
  await fireEvent.press(screen.getByTestId('continue'));
  await fireEvent.changeText(await screen.findByLabelText('Name'), 'A');
  await fireEvent.changeText(screen.getByLabelText('Best number'), '5513014430');
  await fireEvent.press(screen.getByTestId('continue'));
  await fireEvent.press(await screen.findByTestId('send-request'));
  await waitFor(() => expect(mockPush).toHaveBeenCalledWith({ pathname: '/request-result', params: { status: 'cancelled' } }));
});
