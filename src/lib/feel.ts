import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

// Haptics are reserved for three moments (docs/DESIGN.md §Haptics). Do not add more call sites casually.
const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

export const feel = {
  select: () => enabled && Haptics.selectionAsync().catch(() => undefined),
  advance: () => enabled && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined),
  success: () =>
    enabled && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined),
};

export { useReducedMotion };
