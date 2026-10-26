import { NativeTabs } from 'expo-router/native-tabs';

import { color } from '@/theme/tokens';

export default function TabsLayout() {
  return (
    <NativeTabs tintColor={color.gold} backgroundColor={color.bg} labelStyle={{ color: color.textMuted, selected: { color: color.gold } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'crown', selected: 'crown.fill' }} md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="services">
        <NativeTabs.Trigger.Label>Services</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }} md="grid_view" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="request">
        <NativeTabs.Trigger.Label>Request</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'paperplane', selected: 'paperplane.fill' }} md="send" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="connect">
        <NativeTabs.Trigger.Label>Connect</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'phone', selected: 'phone.fill' }} md="call" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
