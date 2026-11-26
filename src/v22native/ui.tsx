// Native equivalents of the shared v22 pieces: gold lettering, buttons, dividers, brackets, top bar, films.
import RNMaskedView from '@react-native-masked-view/masked-view';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { type ComponentType, type ReactElement, type ReactNode, useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  type TextStyle,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { media } from './media';
import { c, clampVw, GD, GD_BRAND, GD_TXT, sans } from './theme';

type Grad = typeof GD_TXT | typeof GD_BRAND;

const webGold = (g: Grad) =>
  ({
    backgroundImage: `linear-gradient(120deg, ${g.colors.map((col, i) => `${col} ${g.locations[i] * 100}%`).join(', ')})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  }) as unknown as TextStyle;

// The package's class typings predate React 19's JSX types; the runtime component is fine.
const MaskedView = RNMaskedView as unknown as ComponentType<{ maskElement: ReactElement; children: ReactNode; style?: StyleProp<ViewStyle> }>;

/** Text filled with a gold gradient (his `background:var(--gd-txt); background-clip:text`). */
export function GoldText({ style, children, grad = GD_TXT, numberOfLines, testID }: { style: StyleProp<TextStyle>; children: ReactNode; grad?: Grad; numberOfLines?: number; testID?: string }) {
  if (Platform.OS === 'web') {
    // Web preview only: masked-view has no web renderer, so use CSS background-clip text.
    return <Text testID={testID} numberOfLines={numberOfLines} style={[style, webGold(grad)]}>{children}</Text>;
  }
  return (
    <MaskedView maskElement={<Text style={[style, { color: '#000' }]} numberOfLines={numberOfLines}>{children}</Text>}>
      <LinearGradient colors={grad.colors} locations={grad.locations} start={grad.start} end={grad.end}>
        <Text testID={testID} style={[style, { opacity: 0 }]} numberOfLines={numberOfLines}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

export type Seg = { t: string; em?: boolean };

/**
 * A headline where only the <em> words are gold-gradient italics and the rest is plain ivory.
 * The gradient sits behind the whole run; the plain words are painted over it in ivory,
 * and the mask (the same text) keeps everything inside the glyphs.
 */
export function RichHeadline({ segs, style, emStyle }: { segs: Seg[]; style: StyleProp<TextStyle>; emStyle: StyleProp<TextStyle> }) {
  const flat = StyleSheet.flatten(style);
  const ivory = (flat?.color as string | undefined) ?? c.off;
  // Nested runs must carry the headline's metrics, or the italic run sets its own line box.
  const metrics = { fontSize: flat?.fontSize, lineHeight: flat?.lineHeight };
  const em: StyleProp<TextStyle> = [metrics, emStyle];
  if (Platform.OS === 'web') {
    return (
      <Text style={style}>
        {segs.map((sg, i) => (
          <Text key={i} style={sg.em ? [em, webGold(GD_TXT)] : null}>{sg.t}</Text>
        ))}
      </Text>
    );
  }
  return (
    <MaskedView
      maskElement={
        <Text style={[style, { color: '#000' }]}>
          {segs.map((s, i) => (
            <Text key={i} style={s.em ? em : null}>{s.t}</Text>
          ))}
        </Text>
      }
    >
      <View>
        <LinearGradient colors={GD_TXT.colors} locations={GD_TXT.locations} start={GD_TXT.start} end={GD_TXT.end} style={StyleSheet.absoluteFill} />
        <Text style={style}>
          {segs.map((s, i) => (
            <Text key={i} style={[s.em ? em : null, { color: s.em ? 'transparent' : ivory }]}>{s.t}</Text>
          ))}
        </Text>
      </View>
    </MaskedView>
  );
}

/** .btn-primary: metallic gold slab with the travelling sheen. */
export function GoldButton({ label, onPress, style, testID }: { label: string; onPress: () => void; style?: StyleProp<ViewStyle>; testID?: string }) {
  const { width } = useWindowDimensions();
  const w = Math.min(width, 430);
  const [bw, setBw] = useState(0);
  const sheen = useState(() => new Animated.Value(0))[0];

  useEffect(() => {
    // keyframes sheen: 0% left:-130% → 60% left:230% → hold to 100%, 3s, ease-in-out
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sheen, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.delay(1200),
        Animated.timing(sheen, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [sheen]);

  const translateX = sheen.interpolate({ inputRange: [0, 1], outputRange: [-1.3 * bw, 2.3 * bw] });

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} testID={testID} style={({ pressed }) => [styles.btnWrap, pressed && { transform: [{ scale: 0.963 }] }, style]}>
      <LinearGradient colors={GD.colors} locations={GD.locations} start={GD.start} end={GD.end} style={styles.btn} onLayout={(e) => setBw(e.nativeEvent.layout.width)}>
        <LinearGradient colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0)']} locations={[0, 0.55]} style={StyleSheet.absoluteFill} pointerEvents="none" />
        <Animated.View pointerEvents="none" style={[styles.sheen, { width: bw * 0.48, transform: [{ translateX }] }]}>
          <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFill} />
        </Animated.View>
        <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} style={[styles.btnTxt, { fontSize: clampVw(w, 8.5, 2.5, 10), letterSpacing: clampVw(w, 1.6, 0.7, 3.4) }]}>
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

/** .btn-secondary: outlined gold. */
export function OutlineButton({ label, onPress, style }: { label: string; onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.btn2, pressed && { backgroundColor: 'rgba(201,168,76,0.14)', borderColor: 'rgba(245,224,152,0.65)', transform: [{ scale: 0.97 }] }, style]}
    >
      <Text numberOfLines={1} style={styles.btn2Txt}>{label}</Text>
    </Pressable>
  );
}

/** .sec-div / .conn-div / .grid-rule: hairline with the centred gold diamond. */
export function DiamondRule({ style, alpha = 0.35 }: { style?: StyleProp<ViewStyle>; alpha?: number }) {
  return (
    <View style={[{ height: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 22, marginVertical: 22, overflow: 'visible' }, style]}>
      <LinearGradient
        colors={['rgba(232,204,106,0)', `rgba(232,204,106,${alpha})`, 'rgba(232,204,106,0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 1 }}
      />
      <View style={{ width: 46, height: 9, backgroundColor: c.bg, position: 'absolute', top: -4 }} />
      <View style={[styles.diamond, { position: 'absolute', top: -3 }]} />
    </View>
  );
}

/** Corner bracket (the gold L-shapes on heroes, tiles, the VIP card). */
export function Corner({ pos, size = 22, inset, color = 'rgba(245,224,152,0.75)' }: { pos: 'tl' | 'tr' | 'bl' | 'br'; size?: number; inset: { x: number; y: number }; color?: string; glow?: boolean }) {
  const s: ViewStyle = { position: 'absolute', width: size, height: size, borderColor: color, zIndex: 4 };
  if (pos[0] === 't') Object.assign(s, { top: inset.y, borderTopWidth: 1.5 });
  else Object.assign(s, { bottom: inset.y, borderBottomWidth: 1.5 });
  if (pos[1] === 'l') Object.assign(s, { left: inset.x, borderLeftWidth: 1.5 });
  else Object.assign(s, { right: inset.x, borderRightWidth: 1.5 });
  return <View pointerEvents="none" style={s} />;
}

/** The round crest logo with its gold ring and glow. */
export function Crest({ size, ring, glow }: { size: number; ring: number; glow: string }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, boxShadow: glow }}>
      <Image
        source={media.logo}
        contentFit="contain"
        style={{ width: size, height: size, borderRadius: size / 2, borderWidth: ring, borderColor: 'rgba(245,224,152,0.7)', backgroundColor: '#000', padding: 2 }}
        accessibilityLabel="IAE"
      />
    </View>
  );
}

/** .topbar: crest, brand lettering, optional right-hand slot. Sticky at the top of each inner screen. */
export function TopBar({ sub, right }: { sub: string; right?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ zIndex: 50 }}>
      <LinearGradient colors={['rgba(14,11,6,0.98)', 'rgba(6,5,10,0.97)']} style={[styles.topbar, { paddingTop: 10 + insets.top }]}>
        <View style={{ borderRadius: 22, boxShadow: '0 0 18px rgba(201,168,76,0.55), 0 0 50px rgba(201,168,76,0.14)' }}>
          <Image source={media.logo} contentFit="contain" style={styles.tbLogo} accessibilityLabel="IAE" />
        </View>
        <View style={{ flexShrink: 1 }}>
          <GoldText style={styles.tbName} numberOfLines={1}>IAE ELITE SERVICES</GoldText>
          <GoldText style={styles.tbSub} grad={GD_BRAND} numberOfLines={1}>{sub.toUpperCase()}</GoldText>
        </View>
        <View style={{ marginLeft: 'auto' }}>{right}</View>
      </LinearGradient>
      <LinearGradient
        colors={['rgba(245,224,152,0)', 'rgba(245,224,152,0.7)', 'rgba(255,215,0,0.95)', 'rgba(245,224,152,0.7)', 'rgba(245,224,152,0)']}
        locations={[0, 0.3, 0.5, 0.7, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.tbLine}
      />
    </View>
  );
}

/** The "ELITE / SERVICES" stack on the right of the top bar. */
export function TopBarElite() {
  return <GoldText style={styles.tbRight} grad={GD_BRAND}>{'ELITE\nSERVICES'}</GoldText>;
}

export { Film } from './Film';

export function Chevron({ size = 18, color = c.g4 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="m9.5 6.5 5.5 5.5-5.5 5.5" />
    </Svg>
  );
}

export function ArrowUpRight({ size = 15, color = c.g4 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M7 17 17 7M9 7h8v8" />
    </Svg>
  );
}

/** Round outlined chevron used on rows and cards (.svc-arr / .brief-arr / .home-bc-a). */
export function RoundChevron({ size = 34, border = 'rgba(232,204,106,0.38)', bg = 'rgba(201,168,76,0.06)', icon = 18 }: { size?: number; border?: string; bg?: string; icon?: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.3, borderColor: border, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 14px rgba(201,168,76,0.12)' }}>
      <Chevron size={icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  btnWrap: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 4,
    boxShadow: '0 10px 40px rgba(201,168,76,0.6), 0 4px 14px rgba(201,168,76,0.4), 0 1px 3px rgba(201,168,76,0.6), inset 0 2px 0 rgba(255,248,190,0.7), inset 0 -2px 0 rgba(44,29,0,0.5)',
  },
  btn: { borderRadius: 4, paddingVertical: 20, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sheen: { position: 'absolute', top: 0, bottom: 0, left: 0 },
  btnTxt: { fontFamily: sans(900), color: '#110800', textTransform: 'uppercase' },
  btn2: {
    width: '100%',
    paddingVertical: 19,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(201,168,76,0.07)',
    borderWidth: 1.5,
    borderColor: 'rgba(232,204,106,0.42)',
    borderRadius: 4,
    alignItems: 'center',
    boxShadow: '0 0 24px rgba(201,168,76,0.1), inset 0 1px 0 rgba(255,248,190,0.1)',
  },
  btn2Txt: { fontFamily: sans(800), fontSize: 10, letterSpacing: 4, color: c.g5, textTransform: 'uppercase' },
  diamond: {
    width: 7,
    height: 7,
    transform: [{ rotate: '45deg' }],
    backgroundColor: c.bg,
    borderWidth: 1.2,
    borderColor: c.g4,
    boxShadow: '0 0 10px rgba(245,224,152,0.7)',
  },
  topbar: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingBottom: 10 },
  tbLine: { height: 1, boxShadow: '0 0 12px rgba(255,200,0,0.5)' },
  tbLogo: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: 'rgba(232,204,106,0.55)', backgroundColor: '#000', padding: 2 },
  tbName: { fontFamily: sans(900), fontSize: 11.5, letterSpacing: 3 },
  tbSub: { fontFamily: sans(800), fontSize: 7.5, letterSpacing: 2.4, marginTop: 4 },
  tbRight: { fontFamily: sans(800), fontSize: 7.5, letterSpacing: 1.8, lineHeight: 14.25, textAlign: 'right' },
});
