import { Asset } from 'expo-asset';
import type { StyleProp, ViewStyle } from 'react-native';

// Web preview: plain full-bleed <video> (expo-video's web view keeps intrinsic size). See FilmLayer.web.tsx.
export function Film({ source }: { source: number; style?: StyleProp<ViewStyle> }) {
  return (
    <video
      src={Asset.fromModule(source).uri}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
  );
}
