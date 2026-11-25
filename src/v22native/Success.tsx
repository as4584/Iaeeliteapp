import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { media } from './media';
import { c, sans, serif } from './theme';
import { RichHeadline } from './ui';

/** .success-modal: shown only after Mail reports the request was sent. */
export function Success({ visible, onDone }: { visible: boolean; onDone: () => void }) {
  const pulse = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    if (!visible) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1300, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 1300, easing: Easing.inOut(Easing.ease), useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [visible, pulse]);

  // ringPulse: glow 32px → 46px and brighter at the midpoint.
  const shadowRadius = pulse.interpolate({ inputRange: [0, 1], outputRange: [32, 46] });
  const shadowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0.95] });

  return (
    <Modal visible={visible} animationType="fade" transparent statusBarTranslucent onRequestClose={onDone}>
      <View style={styles.wrap}>
        <Animated.View style={[styles.logoWrap, { shadowRadius, shadowOpacity }]}>
          <Image source={media.logo} contentFit="contain" style={styles.logo} accessibilityLabel="IAE" />
        </Animated.View>
        <View style={styles.check}>
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={c.g5} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <Path d="m5.5 12.6 4.2 4.2 8.8-9.2" />
          </Svg>
        </View>
        <RichHeadline segs={[{ t: 'Request\n' }, { t: 'Received.', em: true }]} style={styles.title} emStyle={{ fontFamily: serif(700, true) }} />
        <Text style={styles.body}>
          {'YOUR INQUIRY HAS BEEN SUBMITTED.\nAN IAE ELITE REPRESENTATIVE\nWILL CONTACT YOU WITHIN THE HOUR.\n\nPROFESSIONAL · DISCREET · ELITE'}
        </Text>
        <Pressable onPress={onDone} accessibilityRole="button" style={({ pressed }) => [styles.close, pressed && { backgroundColor: c.g3 }]}>
          {({ pressed }) => <Text style={[styles.closeTxt, pressed && { color: '#110800' }]}>DONE</Text>}
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: 'rgba(6,5,10,0.99)', alignItems: 'center', justifyContent: 'center', paddingVertical: 48, paddingHorizontal: 36 },
  logoWrap: { borderRadius: 38, marginBottom: 28, shadowColor: '#FFD700', shadowOffset: { width: 0, height: 0 } },
  logo: { width: 76, height: 76, borderRadius: 38, borderWidth: 2.5, borderColor: 'rgba(245,224,152,0.6)', padding: 3, backgroundColor: '#000' },
  check: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: c.g4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    marginBottom: 22,
    backgroundColor: 'rgba(232,204,106,0.1)',
    boxShadow: '0 0 22px rgba(245,224,152,0.4)',
  },
  title: { fontFamily: serif(700), fontSize: 44, lineHeight: 48.4, color: c.off, marginBottom: 18, textAlign: 'center' },
  body: { fontFamily: sans(400), fontSize: 10, letterSpacing: 2.5, lineHeight: 25, color: c.dim, textAlign: 'center', maxWidth: 250 },
  close: { marginTop: 36, borderWidth: 1.5, borderColor: 'rgba(232,204,106,0.44)', borderRadius: 5, paddingVertical: 15, paddingHorizontal: 40 },
  closeTxt: { fontFamily: sans(800), fontSize: 9, letterSpacing: 4.5, color: c.g4 },
});
