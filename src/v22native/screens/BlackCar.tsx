import { Image } from 'expo-image';
import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';

import { blackCarFeatures } from '../content';
import { media } from '../media';
import { c, sans, serif } from '../theme';
import { DiamondRule, GoldButton, GoldText, TopBar, TopBarElite } from '../ui';
import { SecHero } from './parts';

/** .bc-hero: slow-zooming still; every 3.8s the commercial clip fades in, plays once, fades out. */
function BlackCarHeroMedia() {
  const zoom = useState(() => new Animated.Value(0))[0];
  const vid = useState(() => new Animated.Value(0))[0];
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const player = useVideoPlayer(media.filmBlackCar, (p) => {
    p.muted = true;
    p.loop = false;
  });

  const cycle = () => {
    timers.current.push(
      setTimeout(() => {
        player.currentTime = 0;
        player.play();
        Animated.timing(vid, { toValue: 1, duration: 900, easing: Easing.ease, useNativeDriver: true }).start();
      }, 3800),
    );
  };

  useEventListener(player, 'playToEnd', () => {
    Animated.timing(vid, { toValue: 0, duration: 900, easing: Easing.ease, useNativeDriver: true }).start();
    timers.current.push(setTimeout(cycle, 900));
  });

  useEffect(() => {
    // keyframes bcZoom: scale 1.02 → 1.16, 14s, ease-in-out, alternate
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(zoom, { toValue: 1, duration: 14000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(zoom, { toValue: 0, duration: 14000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ]),
    );
    loop.start();
    cycle();
    const t = timers.current;
    return () => {
      loop.stop();
      t.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scale = zoom.interpolate({ inputRange: [0, 1], outputRange: [1.02, 1.16] });

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX: 14 }, { translateY: 14 }, { scale }, { translateX: -14 }, { translateY: -14 }] }]}>
        <Image source={media.blackCarStill} contentFit="cover" contentPosition={{ left: '50%', top: '62%' }} style={StyleSheet.absoluteFill} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: vid }]}>
        <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} allowsPictureInPicture={false} accessible={false} />
      </Animated.View>
    </>
  );
}

export function BlackCar({ book }: { book: (service: string) => void }) {
  return (
    <View style={styles.fill}>
      <TopBar sub="Black Car Service" right={<TopBarElite />} />
      <ScrollView style={styles.fill} showsVerticalScrollIndicator={false}>
        <SecHero
          height={340}
          eyebrow="Black Car Service"
          segs={[{ t: 'The car is\n' }, { t: 'already waiting.', em: true }]}
          background={<BlackCarHeroMedia />}
        />
        <View style={styles.body}>
          <Text style={styles.lead}>Black SUVs, sedans, and motorcade-grade convoys. Vetted drivers, timed arrivals, door to door — before the call comes in.</Text>
          <View style={styles.stats}>
            {[
              ['24/7', 'On Call'],
              ['NY · NJ', 'And Nationwide'],
              ['1', 'Point Of Contact'],
            ].map(([n, l]) => (
              <View key={l} style={styles.stat}>
                <GoldText style={styles.statN} numberOfLines={1}>{n}</GoldText>
                <Text style={styles.statL}>{l.toUpperCase()}</Text>
              </View>
            ))}
          </View>
          <DiamondRule style={{ marginHorizontal: 0, marginVertical: 22 }} />
          {blackCarFeatures.map((f) => (
            <View key={f.t} style={styles.feat}>
              <View style={styles.dia} />
              <View style={{ flex: 1 }}>
                <Text style={styles.ft}>{f.t.toUpperCase()}</Text>
                <Text style={styles.fd}>{f.d}</Text>
              </View>
            </View>
          ))}
          <View style={{ paddingTop: 26, paddingBottom: 8 }}>
            <GoldButton label="Book A Black Car" onPress={() => book('Black Car Service')} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: c.bg },
  body: { paddingTop: 6, paddingHorizontal: 22, paddingBottom: 30 },
  lead: { fontFamily: sans(400), fontSize: 14.5, lineHeight: 25.4, color: 'rgba(242,239,232,0.78)', marginTop: 6, marginBottom: 22 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginBottom: 8 },
  stat: { flex: 1, alignItems: 'center' },
  statN: { fontFamily: serif(700), fontSize: 27, lineHeight: 32 },
  statL: { fontFamily: sans(800), fontSize: 8, letterSpacing: 2, color: c.g4, marginTop: 5, textAlign: 'center' },
  feat: { flexDirection: 'row', gap: 16, alignItems: 'flex-start', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.1)' },
  dia: { width: 9, height: 9, marginTop: 7, transform: [{ rotate: '45deg' }], backgroundColor: c.g4, boxShadow: '0 0 12px rgba(255,200,0,0.8)' },
  ft: { fontFamily: sans(800), fontSize: 11.5, letterSpacing: 2, color: c.off, marginBottom: 6 },
  fd: { fontFamily: sans(400), fontSize: 13, lineHeight: 21.5, color: 'rgba(242,239,232,0.6)' },
});
