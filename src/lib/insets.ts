import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Tab screens use the plain safe-area insets on every platform: iOS NativeTabs sit at the bottom
// (already part of the inset), and the web preview uses a bottom bar too ((tabs)/_layout.web.tsx).
export function useTabScreenInsets() {
  return useSafeAreaInsets();
}
