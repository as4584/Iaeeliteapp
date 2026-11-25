import { type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGrad, Path, Rect, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

import { openExternal } from '@/lib/contact';

import { contact, links } from '../content';
import { media } from '../media';
import { c, sans, serif } from '../theme';
import { ArrowUpRight, Corner, DiamondRule, Film, GoldButton, GoldText, OutlineButton, RichHeadline, RoundChevron, TopBar } from '../ui';
import { SecEye } from './parts';

const open = (url: string) => () => void openExternal(url);

function FaceTimeIcon() {
  return (
    <Svg width={56} height={56} viewBox="0 0 48 48">
      <Defs>
        <SvgGrad id="ftg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6BE87F" />
          <Stop offset="1" stopColor="#1FB83A" />
        </SvgGrad>
      </Defs>
      <Rect width={48} height={48} rx={11} fill="url(#ftg)" />
      <Rect x={8} y={14} width={22} height={20} rx={5} fill="#fff" />
      <Path d="M33 21.5l7-4.6c.7-.5 1.6 0 1.6.9v13.4c0 .9-.9 1.4-1.6.9l-7-4.6z" fill="#fff" />
    </Svg>
  );
}

function WhatsAppIcon() {
  return (
    <Svg width={56} height={56} viewBox="0 0 48 48">
      <Defs>
        <SvgGrad id="wag" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#5BF08A" />
          <Stop offset="1" stopColor="#20BD5A" />
        </SvgGrad>
      </Defs>
      <Rect width={48} height={48} rx={11} fill="url(#wag)" />
      <Path d="M24 8.5a15.2 15.2 0 0 0-13 23l-1.9 7 7.2-1.9A15.2 15.2 0 1 0 24 8.5z" fill="none" stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
      <Path
        d="M19 16.5c-.5-1-1.1-1-1.6-1-.5 0-1.3.2-2 1-.7.8-2.2 2.1-2.2 5.1s2.2 5.9 2.5 6.3c.3.4 4.3 6.8 10.6 9.2 5.3 2 6.3 1.6 7.4 1.5 1.1-.1 3.6-1.5 4.1-2.9.5-1.4.5-2.6.3-2.9-.1-.3-.6-.4-1.3-.8l-3.6-1.7c-.5-.2-.9-.3-1.3.3-.4.6-1.5 1.9-1.8 2.3-.3.4-.7.4-1.3.1-.6-.3-2.5-.9-4.8-3-1.8-1.6-3-3.5-3.3-4.1-.3-.6 0-.9.3-1.2l.9-1c.3-.3.4-.6.6-1 .2-.4.1-.7 0-1z"
        fill="#fff"
        transform="translate(0.2,-4.5) scale(0.94)"
      />
    </Svg>
  );
}

function InstagramIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="white">
      <Path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </Svg>
  );
}

function FacebookIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="white">
      <Path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </Svg>
  );
}

function VipButton({ icon, name, sub, onPress }: { icon: ReactNode; name: string; sub: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`${name} ${sub}`} style={({ pressed }) => [styles.vipBtn, pressed && { transform: [{ scale: 0.96 }], borderColor: c.g5 }]}>
      <View style={{ marginBottom: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.6)', borderRadius: 13 }}>{icon}</View>
      <Text style={styles.vipBn}>{name.toUpperCase()}</Text>
      <Text style={styles.vipBs}>{sub.toUpperCase()}</Text>
    </Pressable>
  );
}

export function Connect({ goRequest, openLegal }: { goRequest: () => void; openLegal: () => void }) {
  return (
    <View style={styles.fill}>
      <TopBar sub="Direct Line" />
      <ScrollView style={styles.fill} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <SecEye>Direct Line</SecEye>
          <RichHeadline segs={[{ t: 'One line.\n' }, { t: 'Handled quietly.', em: true }]} style={styles.title} emStyle={{ fontFamily: serif(700, true) }} />
          <Text style={styles.sub}>We respond privately, usually within the hour during active hours.</Text>
        </View>
        <DiamondRule alpha={0.38} style={{ marginVertical: 28 }} />

        <View style={styles.body}>
          <View style={styles.vid}>
            <Film source={media.filmConnect} />
            <LinearGradient colors={['rgba(6,5,10,0)', 'rgba(6,5,10,0.88)']} locations={[0.38, 1]} style={StyleSheet.absoluteFill} />
            <Corner pos="tl" size={18} inset={{ x: 10, y: 10 }} color="rgba(245,224,152,0.85)" glow={false} />
            <Corner pos="br" size={18} inset={{ x: 10, y: 10 }} color="rgba(245,224,152,0.85)" glow={false} />
          </View>

          <View style={styles.vip}>
            <Corner pos="tl" size={18} inset={{ x: 7, y: 7 }} color={c.g5} glow={false} />
            <Corner pos="br" size={18} inset={{ x: 7, y: 7 }} color={c.g5} glow={false} />
            <GoldText style={styles.vipEye}>{'PRIORITY ACCESS  ·  CONFIRMED CLIENTS'}</GoldText>
            <RichHeadline segs={[{ t: 'VIP ' }, { t: 'Video Line', em: true }]} style={styles.vipTitle} emStyle={{ fontFamily: serif(700, true) }} />
            <Text style={styles.vipSub}>Face to face with the IAE team. One tap, no dialing, no waiting room.</Text>
            <View style={styles.vipRow}>
              <VipButton icon={<FaceTimeIcon />} name="FaceTime" sub="Apple Devices" onPress={open(links.facetime)} />
              <VipButton icon={<WhatsAppIcon />} name="WhatsApp" sub="Video & Voice" onPress={open(links.whatsapp)} />
            </View>
            <Text style={styles.vipFoot}>{'PRIVATE  ·  ENCRYPTED  ·  ANSWERED BY A LIVE REPRESENTATIVE'}</Text>
          </View>

          <GoldButton label="Call Now" onPress={open(links.tel)} style={{ marginBottom: 12 }} />
          <OutlineButton label="Email the Team" onPress={open(`mailto:${contact.email}`)} style={{ marginBottom: 8 }} />
          <Text style={styles.email}>{contact.email}</Text>

          <View style={styles.socialRow}>
            <Pressable onPress={open(contact.instagram)} accessibilityRole="link" accessibilityLabel="Instagram" style={({ pressed }) => [styles.socialWrap, pressed && styles.socialPressed]}>
              <LinearGradient colors={['#405DE6', '#833AB4', '#C13584', '#E1306C', '#F77737', '#FFDC80']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.social}>
                <InstagramIcon />
                <Text style={styles.socialTxt}>INSTAGRAM</Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={open(contact.facebook)} accessibilityRole="link" accessibilityLabel="Facebook" style={({ pressed }) => [styles.socialWrap, pressed && styles.socialPressed]}>
              <View style={[styles.social, { backgroundColor: '#1877F2' }]}>
                <FacebookIcon />
                <Text style={styles.socialTxt}>FACEBOOK</Text>
              </View>
            </Pressable>
          </View>

          <Pressable onPress={goRequest} accessibilityRole="button" accessibilityLabel="Planning an engagement? Send a full brief" style={({ pressed }) => [styles.brief, pressed && { borderColor: 'rgba(245,224,152,0.55)', transform: [{ scale: 0.98 }] }]}>
            <View style={{ flex: 1 }}>
              <GoldText style={styles.briefEye}>PLANNING AN ENGAGEMENT?</GoldText>
              <Text style={styles.briefHead}>Send a full brief in under a minute.</Text>
            </View>
            <RoundChevron size={36} border="rgba(232,204,106,0.4)" bg="rgba(201,168,76,0.07)" />
          </Pressable>

          <Text style={styles.follow}>FIND US ONLINE</Text>
          {contact.websites.map((w) => (
            <Pressable key={w.url} onPress={open(w.url)} accessibilityRole="link" accessibilityLabel={w.name} style={({ pressed }) => [styles.web, pressed && { transform: [{ scale: 0.97 }], borderColor: c.g5 }]}>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.webN}>{w.name}</Text>
                <Text style={styles.webA}>{w.label}</Text>
              </View>
              <View style={styles.webAr}>
                <ArrowUpRight />
              </View>
            </Pressable>
          ))}

          <Pressable onPress={openLegal} accessibilityRole="button" style={styles.lgLink}>
            <Text style={styles.lgLinkTxt}>PRIVACY POLICY &amp; TERMS OF USE</Text>
          </Pressable>
          <Text style={styles.disc}>
            Handled in private. Spoken of to no one. Non‑disclosure is standard on every engagement. Principal details, schedules, and locations are never shared or disclosed.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: c.bg },
  hero: { paddingTop: 40, paddingHorizontal: 22 },
  title: { fontFamily: serif(700), fontSize: 56, lineHeight: 56, color: c.off, marginBottom: 6 },
  sub: { fontFamily: sans(300), fontSize: 13, color: c.muted, lineHeight: 23.4, marginTop: 14 },
  body: { paddingHorizontal: 22, paddingBottom: 56 },
  vid: { height: 196, overflow: 'hidden', borderRadius: 4, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(232,204,106,0.34)', boxShadow: '0 10px 36px rgba(201,168,76,0.2)' },
  vip: {
    marginBottom: 26,
    paddingTop: 26,
    paddingHorizontal: 18,
    paddingBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245,224,152,0.6)',
    borderRadius: 4,
    backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(232,204,106,0.22), rgba(201,168,76,0.04) 60%, rgba(6,5,10,0.9))',
    boxShadow: '0 0 34px rgba(201,168,76,0.28), inset 0 0 26px rgba(201,168,76,0.07)',
  },
  vipEye: { fontFamily: sans(900), fontSize: 8, letterSpacing: 3.4, marginBottom: 12, textAlign: 'center' },
  vipTitle: { fontFamily: serif(700), fontSize: 42, lineHeight: 42, color: c.off, marginBottom: 12, textAlign: 'center' },
  vipSub: { fontFamily: sans(400), fontSize: 15.5, lineHeight: 25.6, color: c.white, marginBottom: 22, textAlign: 'center' },
  vipRow: { flexDirection: 'row', gap: 12, alignSelf: 'stretch' },
  vipBtn: { flex: 1, alignItems: 'center', gap: 6, paddingTop: 18, paddingHorizontal: 8, paddingBottom: 14, borderWidth: 1, borderColor: 'rgba(232,204,106,0.4)', borderRadius: 4, backgroundColor: 'rgba(6,5,10,0.6)' },
  vipBn: { fontFamily: sans(900), fontSize: 12, letterSpacing: 2.4, color: c.g5 },
  vipBs: { fontFamily: sans(700), fontSize: 8.5, letterSpacing: 1.6, color: 'rgba(242,239,232,0.5)' },
  vipFoot: { fontFamily: sans(700), fontSize: 8, letterSpacing: 1.8, color: 'rgba(232,204,106,0.6)', marginTop: 16, lineHeight: 13.6, textAlign: 'center' },
  email: { fontFamily: sans(600), fontSize: 14.5, color: c.white, letterSpacing: 0.6, textAlign: 'center', marginTop: -6, marginBottom: 28 },
  socialRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  socialWrap: { flex: 1, borderRadius: 4, overflow: 'hidden' },
  socialPressed: { opacity: 0.7, transform: [{ scale: 0.96 }] },
  social: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 8 },
  socialTxt: { fontFamily: sans(900), fontSize: 8.5, letterSpacing: 2, color: '#fff' },
  brief: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(232,204,106,0.34)',
    borderRadius: 4,
    backgroundImage: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.03))',
    boxShadow: '0 2px 14px rgba(201,168,76,0.07)',
  },
  briefEye: { fontFamily: sans(800), fontSize: 7, letterSpacing: 4, marginBottom: 6 },
  briefHead: { fontFamily: serif(600), fontSize: 21, color: c.off, lineHeight: 25.2 },
  follow: { fontFamily: sans(800), fontSize: 10.5, letterSpacing: 4, color: c.white, marginBottom: 16 },
  web: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(232,204,106,0.45)',
    borderRadius: 4,
    backgroundImage: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.03))',
    boxShadow: '0 0 22px rgba(201,168,76,0.1), inset 0 1px 0 rgba(255,248,190,0.08)',
  },
  webN: { fontFamily: sans(900), fontSize: 11, letterSpacing: 2.4, color: c.off, lineHeight: 16.5 },
  webA: { fontFamily: sans(700), fontSize: 11, letterSpacing: 0.5, color: c.g4, marginTop: 5 },
  webAr: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.3, borderColor: 'rgba(232,204,106,0.45)', alignItems: 'center', justifyContent: 'center' },
  lgLink: { marginTop: 10, // 22 collapsed with the web button's 12
    marginBottom: 4, padding: 15, borderWidth: 1, borderColor: 'rgba(232,204,106,0.3)', borderRadius: 4, alignItems: 'center' },
  lgLinkTxt: { fontFamily: sans(800), fontSize: 9.5, letterSpacing: 2.2, color: c.g4 },
  disc: {
    fontFamily: sans(500),
    fontSize: 12.5,
    lineHeight: 22.5,
    letterSpacing: 0.2,
    color: c.white,
    textAlign: 'center',
    paddingTop: 24,
    paddingHorizontal: 4,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    marginTop: 8,
  },
});
