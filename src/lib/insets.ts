import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// On iOS the native tab bar sits at the bottom and is already part of the safe-area inset.
// The web build (QA/preview only) renders NativeTabs as a floating top bar, so tab screens reserve room for it.
const WEB_TAB_BAR = 72;

export function useTabScreenInsets() {
  const insets = useSafeAreaInsets();
  return Platform.OS === 'web' ? { ...insets, top: insets.top + WEB_TAB_BAR } : insets;
}
