import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText as Text } from '@/components/app-text';
import {
  borders,
  colors,
  dimensions,
  fontWeights,
  radii,
  spacing,
  toastTheme,
  typography,
} from '@/constants/design';

export type ToastMode = 'alert' | 'info' | 'success' | 'warning';

export type ToastProps = {
  durationMs?: number;
  message: string;
  mode: ToastMode;
  onDismiss: () => void;
};

const toastIcons: Record<ToastMode, keyof typeof MaterialCommunityIcons.glyphMap> = {
  alert: 'alert-circle',
  info: 'information',
  success: 'check-circle',
  warning: 'alert',
};

export function Toast({
  durationMs = toastTheme.durationMs,
  message,
  mode,
  onDismiss,
}: ToastProps) {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;
  const palette = toastTheme.colors[mode];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();

    const timeoutId = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -8,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          onDismiss();
        }
      });
    }, durationMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [durationMs, onDismiss, opacity, translateY]);

  return (
    <View
      pointerEvents="box-none"
      style={[styles.overlay, { paddingTop: insets.top + spacing.two }]}
    >
      <Animated.View
        accessibilityLiveRegion="polite"
        accessibilityRole="alert"
        style={[
          styles.toast,
          {
            backgroundColor: palette.background,
            borderColor: palette.accent,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={[styles.iconFrame, { backgroundColor: palette.accent }]}>
          <MaterialCommunityIcons color={colors.surface} name={toastIcons[mode]} size={18} />
        </View>
        <Text numberOfLines={2} style={styles.message}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 50,
    alignItems: 'center',
    paddingHorizontal: spacing.two,
  },
  toast: {
    width: '100%',
    maxWidth: dimensions.appMaxWidth,
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
    borderRadius: radii.medium,
    borderWidth: borders.defaultWidth,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.two,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 4,
  },
  iconFrame: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  message: {
    minWidth: 0,
    flex: 1,
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.bold,
  },
});
