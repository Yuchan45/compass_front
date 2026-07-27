import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { borders, colors, fontWeights, radii, spacing, typography } from '@/constants/design';

type ProfileSectionProps = {
  children: ReactNode;
  onSeeMorePress?: () => void;
  title: string;
};

export function ProfileSection({ children, onSeeMorePress, title }: ProfileSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable
          accessibilityLabel={`See more ${title}`}
          accessibilityRole="button"
          onPress={onSeeMorePress}
          style={({ pressed }) => [styles.linkButton, pressed && styles.pressed]}
        >
          <Text style={styles.linkText}>See more</Text>
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
    borderColor: colors.border,
    borderWidth: borders.defaultWidth,
    backgroundColor: colors.surface,
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
    color: colors.textSoft,
    fontSize: typography.caption,
    fontWeight: fontWeights.semiBold,
  },
  linkButton: {
    minHeight: 22,
    justifyContent: 'center',
    paddingLeft: spacing.two,
  },
  linkText: {
    color: colors.navActive,
    fontSize: typography.compact,
    fontWeight: fontWeights.bold,
  },
  pressed: {
    opacity: 0.72,
  },
});
