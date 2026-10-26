// Design tokens. Source of truth: docs/DESIGN.md (derived from iaeelite.com CSS).

export const color = {
  bg: '#0A0A0B',
  surface: '#141417',
  surfaceRaised: '#1B1B20',
  line: '#2A2D33',
  text: '#F4F1EA',
  textMuted: '#A2A2A8',
  textFaint: '#8A8A91',
  gold: '#D9B25E',
  goldDeep: '#A67C22',
  goldShadow: '#5E4410',
  night: '#16202E',
  slate: '#8A97A6',
  danger: '#E07A6A',
  onGold: '#0A0A0B',
} as const;

export const font = {
  display: 'BodoniModa_500Medium',
  displaySemi: 'BodoniModa_600SemiBold',
  displayItalic: 'BodoniModa_500Medium_Italic',
  tactical: 'Archivo_700Bold',
  tacticalHeavy: 'Archivo_800ExtraBold',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodySemi: 'Manrope_600SemiBold',
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48, huge: 64 } as const;
export const gutter = 20;

export const radius = { cut: 2, frame: 14 } as const;

export const motion = {
  press: 160,
  state: 240,
  entrance: 420,
  // The site's --ease: cubic-bezier(.22,.61,.36,1)
  ease: [0.22, 0.61, 0.36, 1] as const,
} as const;

export const hitSlop = { top: 8, bottom: 8, left: 8, right: 8 } as const;
