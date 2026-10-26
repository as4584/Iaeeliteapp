import { Tabs } from 'expo-router';

import { color, font } from '@/theme/tokens';

// Web preview only. NativeTabs renders as a floating top pill on web, which pushes the hero
// down and misrepresents the iPhone layout; this bottom bar matches what iOS shows.
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: color.gold,
        tabBarInactiveTintColor: color.textMuted,
        tabBarStyle: { backgroundColor: color.bg, borderTopColor: color.line, height: 60 },
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: { fontFamily: font.tactical, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' },
        tabBarItemStyle: { justifyContent: 'center' },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="services/index" options={{ title: 'Services' }} />
      <Tabs.Screen name="request" options={{ title: 'Request' }} />
      <Tabs.Screen name="connect" options={{ title: 'Connect' }} />
    </Tabs>
  );
}
