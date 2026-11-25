import { V22_INDEX_HTML } from './indexHtml';
import { V22_MEDIA } from './media';

jest.mock('expo-asset', () => ({ Asset: { fromModule: jest.fn() } }));
jest.mock('expo-file-system', () => ({}));
jest.mock('react-native-webview', () => ({ WebView: () => null }));
// eslint-disable-next-line import/first
import { shouldLoadInApp } from './V22Shell';

describe('v22 shell', () => {
  it('bundles every media file index.html references', () => {
    const refs = new Set(V22_INDEX_HTML.match(/assets\/(?:img|video)-[\w-]+\.\w+/g));
    expect(refs.size).toBeGreaterThan(0);
    for (const r of refs) expect(V22_MEDIA[r]).toBeDefined();
  });

  it('keeps the bundled site in-app and sends contact links to the OS', () => {
    expect(shouldLoadInApp('file:///docs/v22/index.html')).toBe(true);
    for (const u of ['tel:+15513014430', 'mailto:innovationbusiness@icloud.com', 'facetime:innovationbusiness@icloud.com', 'https://wa.me/18623325004', 'https://instagram.com/GETYOURBUSINESSSTARTEDNOW'])
      expect(shouldLoadInApp(u)).toBe(false);
  });
});
