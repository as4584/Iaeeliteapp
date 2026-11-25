import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { services } from '../content';
import { media } from '../media';
import { c, sans, serif } from '../theme';
import { Corner, DiamondRule, GoldButton, GoldText, RoundChevron, TopBar, TopBarElite } from '../ui';
import { SecHero } from './parts';

type Props = { go: (s: 'blackcar' | 'request') => void; book: (service: string) => void };

const tiles = [
  { img: media.tileFleet, name: 'Black Car', sub: 'Fleet Service', svc: 'Artist Transport' },
  { img: media.tileMotorcade, name: 'Motorcade', sub: 'Arrival & Egress', svc: 'Artist Transport' },
  { img: media.tilePersonnel, name: 'Personnel', sub: 'Vetted & Briefed', svc: 'Protective Detail' },
  { img: media.tileEscort, name: 'Principal Escort', sub: 'Secure Movement', svc: 'Protective Detail' },
];

export function Services({ go, book }: Props) {
  return (
    <View style={styles.fill}>
      <TopBar sub="Innovation Artist Escort" right={<TopBarElite />} />
      <ScrollView style={styles.fill} showsVerticalScrollIndicator={false}>
        <SecHero
          film={media.filmServices}
          eyebrow="Capabilities"
          segs={[{ t: 'Everything around\nthe artist, ' }, { t: 'run by\none operation.', em: true }]}
        />

        <Pressable onPress={() => go('blackcar')} style={styles.bc} accessibilityRole="button" accessibilityLabel="Featured: Black Car Service">
          <Image source={media.blackCarStill} contentFit="cover" contentPosition={{ left: '60%', top: '60%' }} style={styles.bcImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bcK}>FEATURED</Text>
            <Text style={styles.bcN}>Black Car Service</Text>
            <Text style={styles.bcD}>Sedans, SUVs &amp; convoys — on call 24/7</Text>
          </View>
          <RoundChevron />
        </Pressable>

        {services.map((s, i) => (
          <Pressable key={s.name} onPress={() => book(s.name)} accessibilityRole="button" accessibilityLabel={s.name}>
            {({ pressed }) => (
              <View style={[styles.item, pressed && { backgroundColor: 'rgba(201,168,76,0.05)' }]}>
                {pressed && (
                  <LinearGradient colors={['rgba(232,204,106,0)', c.g4, 'rgba(232,204,106,0)']} style={styles.itemBar} />
                )}
                <GoldText style={styles.num}>{String(i + 1).padStart(2, '0')}</GoldText>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{s.name}</Text>
                  <Text style={styles.desc}>{s.desc}</Text>
                  <View style={styles.tagRow}>
                    <Text style={styles.tagDash}>—</Text>
                    <GoldText style={styles.tag}>{s.tag.toUpperCase()}</GoldText>
                  </View>
                </View>
                <RoundChevron />
              </View>
            )}
          </Pressable>
        ))}

        <View style={styles.grid}>
          <GoldText style={styles.gridEye}>FIELD RECORD</GoldText>
          <Text style={styles.gridTitle}>The fleet.</Text>
          <GoldText style={[styles.gridTitle, styles.gridEm]}>The personnel.</GoldText>
          <DiamondRule alpha={0.4} style={{ marginHorizontal: 0, marginTop: 10, marginBottom: 22 }} />
          <Text style={styles.gridBody}>Motorcade-grade vehicles and vetted personnel — positioned, briefed, and moving before the call comes in.</Text>
          <View style={styles.tiles}>
            {tiles.map((t) => (
              <Pressable
                key={t.name}
                onPress={() => book(t.svc)}
                accessibilityRole="button"
                accessibilityLabel={t.name}
                style={({ pressed }) => [styles.tile, pressed && { opacity: 0.78, transform: [{ scale: 0.98 }] }]}
              >
                <Image source={t.img} contentFit="cover" style={StyleSheet.absoluteFill} />
                <LinearGradient colors={['rgba(6,5,10,0)', 'rgba(6,5,10,0.88)']} locations={[0.4, 1]} style={StyleSheet.absoluteFill} />
                <Corner pos="tl" size={16} inset={{ x: 9, y: 9 }} color="rgba(245,224,152,0.85)" glow={false} />
                <Corner pos="br" size={16} inset={{ x: 9, y: 9 }} color="rgba(245,224,152,0.6)" glow={false} />
                <View style={styles.tileLabel}>
                  <GoldText style={styles.tileName} numberOfLines={1}>{t.name.toUpperCase()}</GoldText>
                  <Text style={styles.tileSub} numberOfLines={1}>{t.sub.toUpperCase()}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.cta}>
          <GoldButton label="Request a Consultation" onPress={() => go('request')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: c.bg },
  bc: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201,168,76,0.18)',
    backgroundImage: 'linear-gradient(90deg, rgba(201,168,76,0.12), rgba(201,168,76,0.02))',
    marginTop: 4,
  },
  bcImg: { width: 84, height: 64, borderRadius: 3, borderWidth: 1, borderColor: 'rgba(232,204,106,0.5)' },
  bcK: { fontFamily: sans(800), fontSize: 8, letterSpacing: 3, color: c.g4 },
  bcN: { fontFamily: serif(700), fontSize: 25, color: c.off, lineHeight: 27.5, marginTop: 3, marginBottom: 4 },
  bcD: { fontFamily: sans(400), fontSize: 11.5, color: 'rgba(242,239,232,0.6)', lineHeight: 16 },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 18, paddingVertical: 26, paddingHorizontal: 22, borderBottomWidth: 1, borderBottomColor: 'rgba(201,168,76,0.09)' },
  itemBar: { position: 'absolute', left: 0, top: '22%', bottom: '22%', width: 2, boxShadow: '0 0 10px rgba(245,224,152,0.8)' },
  num: { fontFamily: serif(600, true), fontSize: 17, minWidth: 26, paddingTop: 5, opacity: 0.75 },
  name: { fontFamily: serif(700), fontSize: 28, color: c.off, lineHeight: 30.2, letterSpacing: -0.2, marginBottom: 8 },
  desc: { fontFamily: sans(300), fontSize: 12, color: c.muted, lineHeight: 21.8 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 11 },
  tagDash: { fontFamily: sans(800), fontSize: 7, color: c.g3 },
  tag: { fontFamily: sans(800), fontSize: 7, letterSpacing: 4 },
  grid: { paddingTop: 36, paddingHorizontal: 22 },
  gridEye: { fontFamily: sans(800), fontSize: 7.5, letterSpacing: 6, marginBottom: 16, textAlign: 'center' },
  gridTitle: { fontFamily: serif(700), fontSize: 42, color: c.off, lineHeight: 45.4 },
  gridEm: { fontFamily: serif(700, true) },
  gridBody: { fontFamily: sans(300), fontSize: 12, color: c.muted, lineHeight: 21.8, marginBottom: 22 },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  tile: {
    width: '48.5%',
    flexGrow: 1,
    flexBasis: '45%',
    aspectRatio: 0.82,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(232,204,106,0.3)',
    boxShadow: '0 6px 26px rgba(0,0,0,0.6), 0 0 18px rgba(201,168,76,0.1)',
  },
  tileLabel: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingTop: 11, paddingHorizontal: 13, paddingBottom: 14 },
  tileName: { fontFamily: sans(900), fontSize: 8.5, letterSpacing: 2.5, marginBottom: 3 },
  tileSub: { fontFamily: sans(500), fontSize: 7, letterSpacing: 2, color: 'rgba(242,239,232,0.4)' },
  cta: { paddingTop: 8, paddingHorizontal: 22, paddingBottom: 36 },
});
