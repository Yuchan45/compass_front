import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { useColorTheme } from '@/contexts/color-theme-context';
import {
  borders,
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
  const { colors } = useColorTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' && { backgroundColor: colors.primary },
        variant === 'secondary' && {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderWidth: borders.defaultWidth,
        },
        variant === 'quiet' && { backgroundColor: colors.transparent },
        pressed && !disabled && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.surface : colors.text} />
      ) : (
        <Text
          style={[styles.label, { color: variant === 'primary' ? colors.surface : colors.text }]}
        >
          {children}
        </Text>
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
  label: {
    fontSize: typography.body,
    fontWeight: fontWeights.bold,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  disabled: {
    opacity: opacity.disabled,
  },
});
