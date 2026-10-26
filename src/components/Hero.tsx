import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useCallback } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTabScreenInsets } from '@/lib/insets';

import { crest, resolveImage, resolveVideo } from '@/content/media';
import type { Content } from '@/content/schema';
import { useReducedMotion } from '@/lib/feel';
import { color, font, gutter, space } from '@/theme/tokens';

import { Button } from './Button';
import { Text } from './Text';

/** Signature moment 1: muted film loop behind the crest and the line. */
export function Hero({ hero, motto, onRequest }: { hero: Content['hero']; motto: string; onRequest: () => void }) {
  const { height, width } = useWindowDimensions();
  // Larger headline; one step down on compact phones (iPhone SE) so it stays on four lines.
  const headlineSize = width < 390 ? 42 : 48;
  const insets = useTabScreenInsets();
  const reduce = useReducedMotion();
  const reel = hero.film[0];
  const source = reel && !reduce ? resolveVideo(reel.video) : null;

  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
  });

  // Play only while Home is the visible tab — no background looping.
  useFocusEffect(
    useCallback(() => {
      if (!source) return;
      player.play();
      return () => player.pause();
    }, [player, source]),
  );

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
        colors={['rgba(10,10,11,0.45)', 'rgba(10,10,11,0)', 'rgba(10,10,11,0.8)', color.bg]}
        locations={[0, 0.22, 0.62, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.content, { paddingTop: insets.top + space.xs }]}>
        <Animated.View entering={reduce ? undefined : FadeIn.duration(700)} style={styles.crestWrap}>
          <Image source={crest} style={height < 740 ? styles.crestSmall : styles.crest} contentFit="contain" accessibilityLabel="IAE Elite crest" />
        </Animated.View>
        <View style={{ flex: 1 }} />
        <Animated.View entering={enter(150)}>
          <Text variant="overline" tone="gold">{hero.overline}</Text>
        </Animated.View>
        <Animated.View entering={enter(260)}>
          <Text variant="display" style={{ marginTop: space.md, fontSize: headlineSize, lineHeight: headlineSize * 1.12 }}>
            {hero.headline}{' '}
            <Text variant="display" italic inline tone="gold" style={{ fontSize: headlineSize, lineHeight: headlineSize * 1.12 }}>
              {hero.accentWord}
            </Text>
          </Text>
        </Animated.View>
        <Animated.View entering={enter(420)} style={{ marginTop: space.lg }}>
          <Text style={styles.subhead}>{hero.subhead}</Text>
        </Animated.View>
        <Animated.View entering={enter(560)} style={{ marginTop: space.xl, gap: space.md }}>
          <Button label={hero.primaryCta} onPress={onRequest} testID="hero-cta" accessibilityHint="Starts a private request" />
          <Text variant="overline" tone="gold" style={{ textAlign: 'center' }}>{motto}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: color.bg, overflow: 'hidden' },
  content: { flex: 1, paddingHorizontal: gutter, paddingBottom: space.xxl },
  // Top-left, high in the frame; sized so the crest's lettering stays legible without covering the film.
  crestWrap: { alignItems: 'flex-start' },
  crest: { width: 112, height: 112 },
  crestSmall: { width: 80, height: 80 },
  // Two weight steps heavier (Manrope 400 -> 600) and full white for contrast over the film.
  subhead: { fontFamily: font.bodySemi, fontSize: 17, lineHeight: 26, color: color.text },
});
