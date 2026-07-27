import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import {
  borders,
  colors,
  dimensions,
  fontWeights,
  opacity,
  radii,
  spacing,
  typography,
} from '@/constants/design';

type ButtonVariant = 'primary' | 'secondary' | 'quiet';

type ButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  variant?: ButtonVariant;
};

export function Button({
  children,
  disabled = false,
  loading = false,
  onPress,
  variant = 'primary',
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && !disabled && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.surface : colors.text} />
      ) : (
        <Text style={[styles.label, variant === 'primary' && styles.primaryLabel]}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: dimensions.buttonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.medium,
    paddingHorizontal: spacing.four,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: borders.defaultWidth,
  },
  quiet: {
    backgroundColor: colors.transparent,
  },
  label: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.bold,
  },
  primaryLabel: {
    color: colors.surface,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  disabled: {
    opacity: opacity.disabled,
  },
});
