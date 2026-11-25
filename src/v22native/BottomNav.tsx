import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import type { Tab } from './content';
import { c, sans } from './theme';

// His five bespoke icons, path for path. "fl" parts are filled with the current colour; "hl" are dark cut lines.
function Icon({ tab, color }: { tab: Tab; color: string }) {
  const s = { stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  const fl = { fill: color, fillOpacity: 0.92 };
  const hl = { stroke: '#06050A', strokeOpacity: 0.55, strokeWidth: 1.4, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (tab) {
    case 'home':
      return (
        <Svg width={27} height={27} viewBox="0 0 24 24">
          <Path d="M2.8 8.2 7.6 12.4 12 4.6l4.4 7.8 4.8-4.2-1.9 10.6H4.7z" {...s} {...fl} />
          <Path d="M5.2 21.2h13.6" {...s} />
          <Circle cx={2.8} cy={7.6} r={1.4} {...s} {...fl} />
          <Circle cx={12} cy={3.9} r={1.5} {...s} {...fl} />
          <Circle cx={21.2} cy={7.6} r={1.4} {...s} {...fl} />
        </Svg>
      );
    case 'services':
      return (
        <Svg width={27} height={27} viewBox="0 0 24 24">
          <Path d="M3.8 17.2a8.2 8.2 0 0 1 16.4 0z" {...s} {...fl} />
          <Path d="M2.4 20.6h19.2" {...s} />
          <Path d="M12 6.2v1.6" {...s} />
          <Circle cx={12} cy={5.2} r={1.5} {...s} {...fl} />
          <Path d="M7.6 13.4a4.6 4.6 0 0 1 2.6-3.2" {...hl} />
        </Svg>
      );
    case 'blackcar':
      return (
        <Svg width={27} height={27} viewBox="0 0 24 24">
          <Path d="M2.4 16.6v-3.5c0-.6.4-1.1 1-1.3l2.5-.8 1.9-3.2c.4-.7 1.1-1 1.8-1h5.2c.7 0 1.4.3 1.8.9l2 3.2 2.5.7c.8.2 1.4.9 1.4 1.8v3.2z" {...s} {...fl} />
          <Path d="M7.6 8.4 6.4 11h11.3l-1.5-2.6zM12 8.4V11" {...hl} />
          <Circle cx={7} cy={17.2} r={2.5} {...s} fill="#06050A" />
          <Circle cx={17.2} cy={17.2} r={2.5} {...s} fill="#06050A" />
          <Circle cx={7} cy={17.2} r={0.9} {...s} {...fl} />
          <Circle cx={17.2} cy={17.2} r={0.9} {...s} {...fl} />
        </Svg>
      );
    case 'request':
      return (
        <Svg width={27} height={27} viewBox="0 0 24 24">
          <Rect x={3} y={4.6} width={18} height={16.4} rx={2.6} {...s} />
          <Path d="M3 9.8h18M8 2.6v4M16 2.6v4" {...s} />
          <Path d="m8.4 15.4 2.6 2.6 4.8-5.2" {...s} />
        </Svg>
      );
    case 'connect':
      return (
        <Svg width={27} height={27} viewBox="0 0 24 24">
          <Path
            d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"
            {...s}
            {...fl}
          />
        </Svg>
      );
  }
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'blackcar', label: 'Black Car' },
  { id: 'request', label: 'Request' },
  { id: 'connect', label: 'Connect' },
];

export function BottomNav({ active, go }: { active: Tab | null; go: (t: Tab) => void }) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={['#0E0B06', '#06050A']} style={[styles.bar, { paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['rgba(245,224,152,0)', 'rgba(245,224,152,0.7)', 'rgba(255,215,0,1)', 'rgba(245,224,152,0.7)', 'rgba(245,224,152,0)']}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.topLine}
      />
      <View style={styles.row} accessibilityRole="tablist">
        {TABS.map((t) => {
          const on = active === t.id;
          const color = on ? c.g5 : 'rgba(242,239,232,0.58)';
          return (
            <Pressable key={t.id} onPress={() => go(t.id)} style={styles.btn} accessibilityRole="tab" accessibilityLabel={t.label} accessibilityState={{ selected: on }} testID={`tab-${t.id}`}>
              {({ pressed }) => (
                <>
                  {on && (
                    <LinearGradient
                      colors={['rgba(245,224,152,0)', c.g5, 'rgba(245,224,152,0)']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={styles.activeBar}
                    />
                  )}
                  <View style={[styles.ico, on && styles.icoOn, pressed && { transform: [{ scale: 0.92 }] }]}>
                    <View style={on ? { transform: [{ scale: 1.06 }], filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.85))' } : undefined}>
                      <Icon tab={t.id} color={color} />
                    </View>
                  </View>
                  <Text style={[styles.lbl, { color }]} numberOfLines={1}>{t.label.toUpperCase()}</Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bar: { boxShadow: '0 -10px 34px rgba(0,0,0,0.7)' },
  topLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 1.5, boxShadow: '0 0 14px rgba(255,200,0,0.55)' },
  row: { flexDirection: 'row' },
  btn: { flex: 1, alignItems: 'center', paddingVertical: 11, paddingHorizontal: 2, gap: 6 },
  activeBar: { position: 'absolute', top: -1, left: '14%', right: '14%', height: 3, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, boxShadow: '0 0 16px rgba(245,224,152,0.75)' },
  ico: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: 'rgba(232,204,106,0.28)',
    backgroundImage: 'radial-gradient(circle at 50% 35%, rgba(232,204,106,0.12), rgba(242,239,232,0.02))',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icoOn: {
    borderColor: 'rgba(255,224,130,0.9)',
    backgroundImage: 'radial-gradient(circle at 50% 35%, rgba(245,224,152,0.3), rgba(201,168,76,0.08))',
    boxShadow: '0 0 22px rgba(245,224,152,0.5), inset 0 0 12px rgba(245,224,152,0.14)',
  },
  lbl: { fontFamily: sans(900), fontSize: 8.5, letterSpacing: 1.4, lineHeight: 10 },
});
