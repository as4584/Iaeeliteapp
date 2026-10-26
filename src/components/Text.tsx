import { Text as RNText, type TextProps, type TextStyle, StyleSheet } from 'react-native';

import { color, font } from '@/theme/tokens';

export type TextVariant = 'display' | 'title' | 'heading' | 'overline' | 'body' | 'bodySmall' | 'label' | 'caption';

type Props = TextProps & {
  variant?: TextVariant;
  tone?: 'default' | 'muted' | 'faint' | 'gold' | 'onGold' | 'danger';
  italic?: boolean;
};

const tones = {
  default: color.text,
  muted: color.textMuted,
  faint: color.textFaint,
  gold: color.gold,
  onGold: color.onGold,
  danger: color.danger,
};

export function Text({ variant = 'body', tone = 'default', italic, style, ...rest }: Props) {
  const isDisplay = variant === 'display' || variant === 'title' || variant === 'heading';
  return (
    <RNText
      maxFontSizeMultiplier={isDisplay ? 1.3 : 1.6}
      accessibilityRole={isDisplay ? 'header' : undefined}
      {...rest}
      style={[styles[variant], { color: tones[tone] }, italic && isDisplay && styles.italic, style]}
    />
  );
}

const styles = StyleSheet.create<Record<TextVariant | 'italic', TextStyle>>({
  display: { fontFamily: font.display, fontSize: 40, lineHeight: 46, letterSpacing: -0.4 },
  title: { fontFamily: font.display, fontSize: 30, lineHeight: 36, letterSpacing: -0.2 },
  heading: { fontFamily: font.display, fontSize: 22, lineHeight: 28 },
  overline: { fontFamily: font.tactical, fontSize: 11, lineHeight: 14, letterSpacing: 2.2, textTransform: 'uppercase' },
  body: { fontFamily: font.body, fontSize: 16, lineHeight: 24 },
  bodySmall: { fontFamily: font.body, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: font.tactical, fontSize: 13, lineHeight: 16, letterSpacing: 1.6, textTransform: 'uppercase' },
  caption: { fontFamily: font.bodyMedium, fontSize: 12, lineHeight: 16 },
  italic: { fontFamily: font.displayItalic },
});
