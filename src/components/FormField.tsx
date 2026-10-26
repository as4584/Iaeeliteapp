import { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, type TextInputInstance, type TextInputProps, View } from 'react-native';

import { color, font, radius, space } from '@/theme/tokens';

import { Text } from './Text';

type Props = TextInputProps & { label: string; error?: string; optional?: boolean };

export const FormField = forwardRef<TextInputInstance, Props>(function FormField({ label, error, optional, style, ...rest }, ref) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text variant="overline" tone={focused ? 'gold' : 'muted'}>{label}</Text>
        {optional ? <Text variant="caption" tone="faint">Optional</Text> : null}
      </View>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        accessibilityHint={error}
        placeholderTextColor={color.textFaint}
        selectionColor={color.gold}
        keyboardAppearance="dark"
        maxFontSizeMultiplier={1.6}
        {...rest}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        style={[
          styles.input,
          rest.multiline && styles.multiline,
          focused && { borderColor: color.gold },
          !!error && { borderColor: color.danger },
          style,
        ]}
      />
      {error ? (
        <Text variant="caption" tone="danger" accessibilityLiveRegion="polite" accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: color.line,
    borderRadius: radius.cut,
    backgroundColor: color.surface,
    paddingHorizontal: space.lg,
    color: color.text,
    fontFamily: font.body,
    fontSize: 16,
  },
  multiline: { minHeight: 120, paddingTop: 14, textAlignVertical: 'top' },
});
