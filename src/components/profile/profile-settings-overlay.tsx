import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText as Text } from '@/components/app-text';
import {
  borders,
  fontWeights,
  opacity,
  radii,
  spacing,
  typography,
  type AppColors,
} from '@/constants/design';
import { useColorTheme } from '@/contexts/color-theme-context';

type ProfileSettingsOverlayProps = {
  onClose: () => void;
  onLogout: () => void;
  visible: boolean;
};

type SettingOption = {
  disabled?: boolean;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  key: string;
  label: string;
  onPress?: () => void;
  rightContent?: ReactNode;
  tone?: 'default' | 'danger';
};

export function ProfileSettingsOverlay({
  onClose,
  onLogout,
  visible,
}: ProfileSettingsOverlayProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDarkMode, toggleMode } = useColorTheme();
  const options: SettingOption[] = [
    {
      icon: 'palette-outline',
      key: 'color-theme',
      label: 'Color Theme',
      onPress: () => void toggleMode(),
      rightContent: <ThemeSwitch colors={colors} enabled={isDarkMode} />,
    },
    {
      disabled: true,
      icon: 'shield-lock-outline',
      key: 'privacy',
      label: 'Privacy',
    },
    {
      disabled: true,
      icon: 'bell-outline',
      key: 'notifications',
      label: 'Notifications',
    },
    {
      disabled: true,
      icon: 'translate',
      key: 'language',
      label: 'Language',
    },
    {
      disabled: true,
      icon: 'map-marker-radius-outline',
      key: 'location-sharing',
      label: 'Location Sharing',
    },
    {
      icon: 'logout',
      key: 'logout',
      label: 'Logout',
      onPress: onLogout,
      tone: 'danger',
    },
  ];

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <Pressable accessibilityLabel="Close settings" onPress={onClose} style={styles.backdrop}>
        <Pressable
          accessibilityRole="menu"
          onPress={(event) => event.stopPropagation()}
          style={[
            styles.panel,
            {
              backgroundColor: colors.surface,
              paddingBottom: insets.bottom + spacing.three,
            },
          ]}
        >
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>Account preferences</Text>
            </View>

            <Pressable
              accessibilityLabel="Close settings"
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <MaterialCommunityIcons color={colors.text} name="close" size={24} />
            </Pressable>
          </View>

          <View style={styles.options}>
            {options.map((option) => (
              <SettingRow colors={colors} key={option.key} option={option} />
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type SettingRowProps = {
  colors: AppColors;
  option: SettingOption;
};

function SettingRow({ colors, option }: SettingRowProps) {
  const disabled = option.disabled || !option.onPress;
  const danger = option.tone === 'danger';
  const foregroundColor = danger ? colors.danger : colors.text;
  const iconColor = danger ? colors.danger : colors.navActive;

  return (
    <Pressable
      accessibilityRole="menuitem"
      disabled={disabled}
      onPress={option.onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        disabled && !danger && styles.disabledOption,
        pressed && styles.pressed,
      ]}
    >
      <View
        style={[
          styles.optionIcon,
          { backgroundColor: danger ? colors.alertSoft : colors.primarySoft },
        ]}
      >
        <MaterialCommunityIcons color={iconColor} name={option.icon} size={22} />
      </View>
      <Text style={[styles.optionLabel, { color: foregroundColor }]}>{option.label}</Text>
      {option.rightContent ? (
        option.rightContent
      ) : disabled && !danger ? (
        <Text style={[styles.comingSoon, { color: colors.muted }]}>Soon</Text>
      ) : (
        <MaterialCommunityIcons color={colors.muted} name="chevron-right" size={20} />
      )}
    </Pressable>
  );
}

type ThemeSwitchProps = {
  colors: AppColors;
  enabled: boolean;
};

function ThemeSwitch({ colors, enabled }: ThemeSwitchProps) {
  return (
    <View
      style={[
        styles.switchTrack,
        {
          backgroundColor: enabled ? colors.navActive : colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.switchKnob,
          {
            backgroundColor: colors.surface,
            transform: [{ translateX: enabled ? 20 : 0 }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(16, 35, 31, 0.42)',
  },
  panel: {
    gap: spacing.three,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: spacing.three,
    paddingTop: spacing.three,
  },
  header: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.three,
  },
  title: {
    fontSize: 24,
    fontWeight: fontWeights.extraBold,
  },
  subtitle: {
    fontSize: typography.small,
    fontWeight: fontWeights.medium,
  },
  closeButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: {
    gap: spacing.one,
  },
  option: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
    borderRadius: radii.medium,
    borderWidth: borders.defaultWidth,
    paddingHorizontal: spacing.two,
  },
  disabledOption: {
    opacity: 0.82,
  },
  optionIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
  optionLabel: {
    minWidth: 0,
    flex: 1,
    fontSize: typography.body,
    fontWeight: fontWeights.bold,
  },
  comingSoon: {
    fontSize: typography.compact,
    fontWeight: fontWeights.extraBold,
    textTransform: 'uppercase',
  },
  switchTrack: {
    width: 46,
    height: 26,
    justifyContent: 'center',
    borderRadius: 13,
    paddingHorizontal: 3,
  },
  switchKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
