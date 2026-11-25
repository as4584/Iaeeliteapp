// Design tokens transcribed from Damian's v22 handoff (www/index.html :root + refinement layers).
// Sizes are CSS px from his stylesheet; on iOS 1 CSS px == 1 pt, so values carry over 1:1.

export const c = {
  g1: '#2C1D00',
  g2: '#7A5810',
  g3: '#C9A84C',
  g4: '#E8CC6A',
  g5: '#F5E098',
  g6: '#FFF8D0',
  bg: '#06050A',
  bg2: '#0C0B10',
  off: '#F2EFE8',
  muted: 'rgba(242,239,232,0.5)',
  dim: 'rgba(242,239,232,0.26)',
  dimmer: 'rgba(242,239,232,0.14)',
  white: '#FFFFFF',
};

/** --gd: the metallic gold used for primary buttons (135deg). */
export const GD = {
  colors: ['#2C1D00', '#7A5810', '#C9A84C', '#F5E098', '#C9A84C', '#7A5810', '#2C1D00'] as const,
  locations: [0, 0.15, 0.32, 0.5, 0.68, 0.85, 1] as const,
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
};

/** --gd-txt: the gold used inside lettering (120deg). */
export const GD_TXT = {
  colors: ['#C9A84C', '#F5E098', '#FFD700', '#F5E098', '#C9A84C'] as const,
  locations: [0, 0.35, 0.5, 0.65, 1] as const,
  start: { x: 0, y: 0.25 },
  end: { x: 1, y: 0.75 },
};

/** The brighter brand-lettering gold from the v13 legibility pass (home tag, top bar sub-lines). */
export const GD_BRAND = {
  colors: ['#E8CC6A', '#FFF1B0', '#FFD700', '#E8CC6A'] as const,
  locations: [0, 0.4, 0.6, 1] as const,
  start: { x: 0, y: 0.25 },
  end: { x: 1, y: 0.75 },
};

type Weight = 300 | 400 | 500 | 600 | 700 | 800 | 900;

const montserrat: Record<Weight, string> = {
  300: 'Montserrat_300Light',
  400: 'Montserrat_400Regular',
  500: 'Montserrat_500Medium',
  600: 'Montserrat_600SemiBold',
  700: 'Montserrat_700Bold',
  800: 'Montserrat_800ExtraBold',
  900: 'Montserrat_900Black',
};

/** Montserrat at a CSS font-weight. */
export const sans = (w: Weight) => montserrat[w];

/** Cormorant Garamond at a CSS font-weight, optionally italic (the <em> style). */
export const serif = (w: 300 | 600 | 700, italic = false) => {
  const base = w === 300 ? 'CormorantGaramond_300Light' : w === 600 ? 'CormorantGaramond_600SemiBold' : 'CormorantGaramond_700Bold';
  return italic ? `${base}_Italic` : base;
};

/** CSS clamp(min, vw*width/100, max). */
export const clampVw = (width: number, min: number, vw: number, max: number) => Math.min(max, Math.max(min, (vw * width) / 100));
