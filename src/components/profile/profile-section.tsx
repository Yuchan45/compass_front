import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { borders, fontWeights, radii, spacing, typography } from '@/constants/design';
import { useColorTheme } from '@/contexts/color-theme-context';

type ProfileSectionProps = {
  children: ReactNode;
  onSeeMorePress?: () => void;
  title: string;
};

export function ProfileSection({ children, onSeeMorePress, title }: ProfileSectionProps) {
  const { colors: themeColors } = useColorTheme();

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.textSoft }]}>{title}</Text>
        <Pressable
          accessibilityLabel={`See more ${title}`}
          accessibilityRole="button"
          onPress={onSeeMorePress}
          style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
        >
          <Text style={[styles.linkText, { color: themeColors.navActive }]}>See more</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.two,
    borderRadius: radii.medium,
    borderWidth: borders.defaultWidth,
    padding: spacing.three,
  },
  header: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.two,
  },
  title: {
    fontSize: typography.caption,
    fontWeight: fontWeights.semiBold,
  },
  linkButton: {
    minHeight: 22,
    justifyContent: 'center',
    paddingLeft: spacing.two,
  },
  linkText: {
    fontSize: typography.compact,
    fontWeight: fontWeights.bold,
  },
  pressed: {
    opacity: 0.72,
  },
});
