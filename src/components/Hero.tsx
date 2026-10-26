import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { crest, resolveImage, resolveVideo } from '@/content/media';
import type { Content } from '@/content/schema';
import { useReducedMotion } from '@/lib/feel';
import { color, gutter, space } from '@/theme/tokens';

import { Button } from './Button';
import { Rule } from './Rule';
import { Text } from './Text';

/** Signature moment 1: muted film loop behind the crest and the line. */
export function Hero({ hero, motto, onRequest }: { hero: Content['hero']; motto: string; onRequest: () => void }) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const reel = hero.film[0];
  const source = reel && !reduce ? resolveVideo(reel.video) : null;

  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const enter = (delay: number) => (reduce ? undefined : FadeInDown.duration(520).delay(delay));

  return (
    <View style={[styles.root, { minHeight: Math.max(560, height * 0.86) }]}>
      {reel ? (
        <Image source={resolveImage(reel.poster)} style={StyleSheet.absoluteFill} contentFit="cover" accessibilityIgnoresInvertColors />
      ) : null}
      {source ? (
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          nativeControls={false}
          allowsPictureInPicture={false}
          accessible={false}
        />
      ) : null}
      <LinearGradient
        colors={['rgba(10,10,11,0.55)', 'rgba(10,10,11,0.15)', 'rgba(10,10,11,0.85)', color.bg]}
        locations={[0, 0.3, 0.68, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.content, { paddingTop: insets.top + space.lg }]}>
        <Animated.View entering={reduce ? undefined : FadeIn.duration(700)} style={styles.crestWrap}>
          <Image source={crest} style={styles.crest} contentFit="contain" accessibilityLabel="IAE Elite crest" />
        </Animated.View>
        <View style={{ flex: 1 }} />
        <Animated.View entering={enter(150)}>
          <Text variant="overline" tone="gold">{hero.overline}</Text>
        </Animated.View>
        <Animated.View entering={enter(260)}>
          <Text variant="display" style={{ marginTop: space.md }}>
            {hero.headline}{' '}
            <Text variant="display" italic tone="gold">{hero.accentWord}</Text>
          </Text>
        </Animated.View>
        <Rule draw delay={700} width={88} style={{ marginVertical: space.lg }} />
        <Animated.View entering={enter(420)}>
          <Text tone="muted">{hero.subhead}</Text>
        </Animated.View>
        <Animated.View entering={enter(560)} style={{ marginTop: space.xl, gap: space.md }}>
          <Button label={hero.primaryCta} onPress={onRequest} testID="hero-cta" accessibilityHint="Starts a private request" />
          <Text variant="overline" tone="faint" style={{ textAlign: 'center' }}>{motto}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: color.bg, overflow: 'hidden' },
  content: { flex: 1, paddingHorizontal: gutter, paddingBottom: space.xxl },
  crestWrap: { alignItems: 'center' },
  crest: { width: 92, height: 92 },
});
