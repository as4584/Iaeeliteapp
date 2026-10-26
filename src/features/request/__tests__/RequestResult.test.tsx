import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import RequestResult from '@/app/request-result';
import { ContentProvider } from '@/content/ContentProvider';
import * as feel from '@/lib/feel';

import { RequestProvider, useRequest } from '../RequestProvider';

let mockStatus: string | undefined = 'sent';
jest.mock('expo-router', () => ({
  router: { back: jest.fn(), dismissTo: jest.fn() },
  useLocalSearchParams: () => ({ status: mockStatus }),
}));
jest.mock('@/lib/contact', () => ({ callNumber: jest.fn(), copyText: jest.fn() }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));

function DraftProbe() {
  const { draft } = useRequest();
  return <Text testID="probe">{draft.serviceIds.join(',') || 'empty'}</Text>;
}
function Seed() {
  const { startWith } = useRequest();
  return <Text testID="seed" onPress={() => startWith('artist-transport')}>seed</Text>;
}

const renderResult = async () => {
  const r = await render(
    <ContentProvider>
      <RequestProvider>
        <Seed />
        <DraftProbe />
        <RequestResult />
      </RequestProvider>
    </ContentProvider>,
  );
  return r;
};

beforeEach(() => jest.clearAllMocks());

it('sent: success title, success haptic, and the draft is cleared', async () => {
  mockStatus = 'sent';
  const success = jest.spyOn(feel.feel, 'success');
  await renderResult();
  expect(screen.getByText('Request on its way.')).toBeTruthy();
  expect(screen.getByText('Request sent')).toBeTruthy();
  expect(screen.getByText('Done')).toBeTruthy();
  await waitFor(() => expect(success).toHaveBeenCalledTimes(1));
  expect(screen.getByTestId('probe').props.children).toBe('empty');
});

it.each([
  ['cancelled', 'Not sent.'],
  ['saved', 'Saved as a draft.'],
  ['handoff', 'Finish in your mail app.'],
  ['failed', 'Mail isn’t available.'],
])('%s: no success claim, keeps fallbacks', async (status, title) => {
  mockStatus = status;
  const success = jest.spyOn(feel.feel, 'success');
  await renderResult();
  expect(screen.getByText(title)).toBeTruthy();
  expect(screen.getByText('Request not yet sent')).toBeTruthy();
  expect(screen.queryByText('Request on its way.')).toBeNull();
  expect(screen.getByText('Call +1 (551) 301-4430')).toBeTruthy();
  expect(screen.getByText('Copy request text')).toBeTruthy();
  expect(success).not.toHaveBeenCalled();
});

it('unknown or tampered status (deep link) is treated as unconfirmed, not success', async () => {
  mockStatus = 'totally-sent';
  await renderResult();
  expect(screen.getByText('We can’t confirm it was sent.')).toBeTruthy();
});
