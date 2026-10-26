// Minimal Reanimated stand-in for Jest. Reanimated 4.7's own mock loads its native
// initializer under jest-expo and throws (`setCSSEventHandler` not available in JSReanimated).
// Covers only the API this app uses; animations resolve to their final values.
const { View, Text, ScrollView, Image } = require('react-native');

const chain = () => {
  const c = {};
  for (const k of ['duration', 'delay', 'springify', 'damping', 'easing']) c[k] = () => c;
  return c;
};

const Animated = {
  View,
  Text,
  ScrollView,
  Image,
  createAnimatedComponent: (c) => c,
};

module.exports = {
  __esModule: true,
  default: Animated,
  ...Animated,
  useSharedValue: (v) => ({ value: v }),
  useAnimatedStyle: (fn) => fn(),
  withTiming: (v) => v,
  withDelay: (_d, v) => v,
  withSpring: (v) => v,
  useReducedMotion: () => false,
  Easing: { bezier: () => (t) => t, linear: (t) => t },
  FadeIn: chain(),
  FadeInDown: chain(),
  FadeInRight: chain(),
  FadeOutLeft: chain(),
  ZoomIn: chain(),
};
