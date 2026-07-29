import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { fontWeights, radii, spacing, typography } from '@/constants/design';
import { useColorTheme } from '@/contexts/color-theme-context';

type FriendRequestsSectionHeaderProps = {
  count: number;
  onSortPress: () => void;
  sortLabel: string;
};

export function FriendRequestsSectionHeader({
  count,
  onSortPress,
  sortLabel,
}: FriendRequestsSectionHeaderProps) {
  const { colors } = useColorTheme();

  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.text }]}>Friend Requests</Text>
        {count > 0 ? (
          <View style={[styles.badge, { backgroundColor: colors.navActive }]}>
            <Text style={[styles.badgeText, { color: colors.surface }]}>{count}</Text>
          </View>
        ) : null}
      </View>

      <Pressable
        accessibilityLabel={`Sort friend requests by ${sortLabel}`}
        accessibilityRole="button"
        onPress={onSortPress}
        style={({ pressed }) => [
          styles.sortPill,
          { backgroundColor: colors.primarySoft },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.sortText, { color: colors.muted }]}>Sort by: {sortLabel}</Text>
        <MaterialCommunityIcons color={colors.muted} name="chevron-down" size={14} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.two,
  },
  titleRow: {
    minWidth: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
  },
  title: {
    fontSize: typography.small,
    fontWeight: fontWeights.extraBold,
  },
  badge: {
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.small,
    paddingHorizontal: spacing.compactGap,
  },
  badgeText: {
    fontSize: typography.compact,
    fontWeight: fontWeights.extraBold,
  },
  sortPill: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.compactGap,
    borderRadius: 14,
    paddingHorizontal: spacing.two,
  },
  sortText: {
    fontSize: typography.compact,
    fontWeight: fontWeights.semiBold,
  },
  pressed: {
    opacity: 0.72,
  },
});
