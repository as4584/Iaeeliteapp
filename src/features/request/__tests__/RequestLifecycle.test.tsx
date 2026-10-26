import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';

import RequestScreen from '@/app/(tabs)/request';
import { ContentProvider } from '@/content/ContentProvider';
import { composeEmail } from '@/lib/contact';

import { RequestProvider, useRequest } from '../RequestProvider';

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (...a: unknown[]) => mockPush(...a), navigate: jest.fn() } }));
jest.mock('@/lib/contact', () => ({ composeEmail: jest.fn() }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));

/** Stand-ins for the other screens that touch the shared draft. */
function Controls() {
  const { reset, startWith } = useRequest();
  return (
    <>
      <Pressable testID="ext-reset" onPress={reset}><Text>reset</Text></Pressable>
      <Pressable testID="ext-start-venue" onPress={() => startWith('venue-facilitation')}><Text>start</Text></Pressable>
    </>
  );
}

const renderApp = () =>
  render(
    <ContentProvider>
      <RequestProvider>
        <RequestScreen />
        <Controls />
      </RequestProvider>
    </ContentProvider>,
  );

async function walkToReview() {
  await fireEvent.press(screen.getByTestId('select-artist-transport'));
  await fireEvent.press(screen.getByTestId('continue'));
  await fireEvent.press(await screen.findByText('New York'));
  await fireEvent.press(screen.getByTestId('continue'));
  await fireEvent.changeText(await screen.findByLabelText('Name'), 'Jordan Reyes');
  await fireEvent.changeText(screen.getByLabelText('Email'), 'jordan@example.com');
  await fireEvent.press(screen.getByTestId('continue'));
  await screen.findByText('Your brief.');
}

beforeEach(() => jest.clearAllMocks());

it('opens Mail only once when Send is double-tapped', async () => {
  let finish: (s: string) => void = () => undefined;
  (composeEmail as jest.Mock).mockImplementation(() => new Promise((r) => (finish = r)));
  await renderApp();
  await walkToReview();

  const send = screen.getByTestId('send-request');
  await act(async () => {
    fireEvent.press(send);
    fireEvent.press(send);
  });
  await act(async () => finish('sent'));

  expect(composeEmail).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1));
});

it('shows "Opening Mail…" and a disabled button while the composer is up', async () => {
  let finish: (s: string) => void = () => undefined;
  (composeEmail as jest.Mock).mockImplementation(() => new Promise((r) => (finish = r)));
  await renderApp();
  await walkToReview();
  // Not awaited: the handler stays pending while Mail is "open".
  await act(async () => {
    fireEvent.press(screen.getByTestId('send-request'));
  });
  expect(screen.getByText('Opening Mail…')).toBeTruthy();
  expect(screen.getByTestId('send-request').props.accessibilityState).toMatchObject({ disabled: true });
  await act(async () => finish('cancelled'));
  expect(await screen.findByText('Send request')).toBeTruthy();
});

it('starts a fresh request at step 1 after a completed request is reset', async () => {
  await renderApp();
  await walkToReview();
  await fireEvent.press(screen.getByTestId('ext-reset')); // what the result screen does after "sent"
  expect(await screen.findByText('What do you need handled?')).toBeTruthy();
  expect(screen.queryByText('Your brief.')).toBeNull();
});

it('"Request this service" restarts at step 1 with that service selected, keeping contact details', async () => {
  await renderApp();
  await walkToReview();
  await fireEvent.press(screen.getByTestId('ext-start-venue'));
  expect(await screen.findByText('What do you need handled?')).toBeTruthy();
  expect(screen.getByTestId('select-venue-facilitation').props.accessibilityState).toMatchObject({ checked: true });
  expect(screen.getByTestId('select-artist-transport').props.accessibilityState).toMatchObject({ checked: false });
  // Contact details survive
  await fireEvent.press(screen.getByTestId('continue'));
  await fireEvent.press(screen.getByTestId('continue'));
  expect((await screen.findByLabelText('Name')).props.value).toBe('Jordan Reyes');
});
