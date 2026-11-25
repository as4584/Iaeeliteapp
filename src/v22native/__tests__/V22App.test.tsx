import { fireEvent, render, screen } from '@testing-library/react-native';

import { composeEmail, openExternal } from '@/lib/contact';

import V22App from '../V22App';

jest.mock('@/lib/contact', () => ({ composeEmail: jest.fn(async () => 'sent'), openExternal: jest.fn(async () => true) }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));
// Render the gradient child only (the mask is a visual duplicate of the same text).
jest.mock('@react-native-masked-view/masked-view', () => function MaskedViewMock({ children }: { children: React.ReactNode }) {
  return children;
});
jest.mock('expo-video', () => ({ useVideoPlayer: () => ({ play: jest.fn(), pause: jest.fn() }), VideoView: () => null }));
jest.mock('expo', () => ({ ...jest.requireActual('expo'), useEventListener: jest.fn() }));
jest.mock('@react-native-community/datetimepicker', () => () => null);

const mockedCompose = composeEmail as jest.Mock;

beforeEach(() => jest.clearAllMocks());

it('opens on Home and moves between the five tabs', async () => {
  await render(<V22App />);
  expect(screen.getAllByText(/We move the people/).length).toBeGreaterThan(0);
  await fireEvent.press(screen.getByTestId('tab-services'));
  expect(screen.getByText('Venue Facilitation')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('tab-blackcar'));
  expect(screen.getByText('VETTED PROFESSIONAL DRIVERS')).toBeTruthy();
  await fireEvent.press(screen.getByTestId('tab-connect'));
  expect(screen.getByText('innovationbusiness@icloud.com')).toBeTruthy();
});

it('booking a service jumps to Request with it preselected', async () => {
  await render(<V22App />);
  await fireEvent.press(screen.getByTestId('tab-services'));
  await fireEvent.press(screen.getByLabelText('Protective Detail'));
  expect(screen.getByLabelText('Service Requested: Protective Detail')).toBeTruthy();
});

it('blocks sending until required fields are filled', async () => {
  await render(<V22App />);
  await fireEvent.press(screen.getByTestId('tab-request'));
  await fireEvent.press(screen.getByTestId('send-request'));
  expect(screen.getByText('Please complete all required fields.')).toBeTruthy();
  expect(mockedCompose).not.toHaveBeenCalled();
});

async function fillAndSend() {
  await fireEvent.press(screen.getByTestId('tab-services'));
  await fireEvent.press(screen.getByLabelText('Artist Transport'));
  await fireEvent.changeText(screen.getByLabelText('Name'), 'Ann');
  await fireEvent.changeText(screen.getByLabelText('Phone'), '5551234');
  await fireEvent.press(screen.getByTestId('send-request'));
}

it('shows Request Received only when Mail reports sent', async () => {
  await render(<V22App />);
  await fillAndSend();
  expect(mockedCompose).toHaveBeenCalledWith('innovationbusiness@icloud.com', 'IAE Elite Service Request', expect.stringContaining('Service: Artist Transport'));
  expect(await screen.findByText('DONE')).toBeTruthy();
});

it('does not show success when the email is cancelled', async () => {
  mockedCompose.mockResolvedValueOnce('cancelled');
  await render(<V22App />);
  await fillAndSend();
  expect(await screen.findByText(/closed without sending/)).toBeTruthy();
  expect(screen.queryByText('DONE')).toBeNull();
});

it('Connect buttons open the right destinations', async () => {
  await render(<V22App />);
  await fireEvent.press(screen.getByTestId('tab-connect'));
  await fireEvent.press(screen.getByLabelText('Call Now'));
  await fireEvent.press(screen.getByLabelText('FaceTime Apple Devices'));
  await fireEvent.press(screen.getByLabelText('WhatsApp Video & Voice'));
  await fireEvent.press(screen.getByLabelText('Instagram'));
  await fireEvent.press(screen.getByLabelText('Facebook'));
  expect((openExternal as jest.Mock).mock.calls.map((c) => c[0])).toEqual([
    'tel:+15513014430',
    'facetime:innovationbusiness@icloud.com',
    'https://wa.me/18623325004',
    'https://instagram.com/GETYOURBUSINESSSTARTEDNOW',
    'https://www.facebook.com/share/1Ca3KKBmwC/',
  ]);
});
