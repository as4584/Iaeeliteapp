// Runs Damian's v22 web app (his www/ folder) inside the native app, exactly as he designed it.
// On first launch the bundled HTML + media are written to <documents>/v22/ so relative paths
// like "assets/video-01.mp4" resolve, then WKWebView loads index.html from there.
import { Asset } from 'expo-asset';
import { Directory, File, Paths } from 'expo-file-system';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { V22_CONFIG_JSON } from './config';
import { V22_INDEX_HTML } from './indexHtml';
import { V22_MEDIA } from './media';

const BG = '#06050A';
// Bump when the bundled site changes so an updated app rewrites the cached copy.
const SITE_VERSION = 'v22-1';

async function prepareSite(): Promise<string> {
  const root = new Directory(Paths.document, 'v22');
  const marker = new File(root, '.version');
  const index = new File(root, 'index.html');
  if (marker.exists && index.exists && marker.textSync() === SITE_VERSION) return root.uri;

  if (root.exists) root.delete();
  root.create({ intermediates: true });
  const assetsDir = new Directory(root, 'assets');
  assetsDir.create();

  for (const [rel, mod] of Object.entries(V22_MEDIA)) {
    const asset = Asset.fromModule(mod);
    await asset.downloadAsync();
    if (!asset.localUri) throw new Error(`missing asset ${rel}`);
    new File(asset.localUri).copy(new File(root, rel));
  }
  new File(root, 'config.json').write(V22_CONFIG_JSON);
  index.write(V22_INDEX_HTML);
  marker.write(SITE_VERSION);
  return root.uri;
}

/** Anything that isn't the bundled site (tel:, mailto:, facetime:, wa.me, Instagram…) opens outside. */
export function shouldLoadInApp(url: string): boolean {
  return url.startsWith('file:') || url.startsWith('about:') || url.startsWith('data:') || url.startsWith('blob:');
}

export default function V22Shell({ onReady }: { onReady?: () => void }) {
  const [rootUri, setRootUri] = useState<string | null>(null);

  useEffect(() => {
    prepareSite().then(setRootUri, (e) => console.error('[v22] site prep failed', e));
  }, []);

  const onNav = (req: WebViewNavigation) => {
    if (shouldLoadInApp(req.url)) return true;
    Linking.openURL(req.url).catch(() => {});
    return false;
  };

  if (!rootUri) {
    return (
      <View style={styles.fill}>
        <ActivityIndicator color="#C9A24A" />
      </View>
    );
  }

  const base = rootUri.endsWith('/') ? rootUri : `${rootUri}/`;
  return (
    <WebView
      style={styles.web}
      source={{ uri: `${base}index.html` }}
      allowingReadAccessToURL={base}
      allowFileAccess
      originWhitelist={['*']}
      onShouldStartLoadWithRequest={onNav}
      setSupportMultipleWindows={false}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      contentInsetAdjustmentBehavior="never"
      bounces={false}
      allowsBackForwardNavigationGestures
      onLoadEnd={onReady}
    />
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' },
  web: { flex: 1, backgroundColor: BG },
});
