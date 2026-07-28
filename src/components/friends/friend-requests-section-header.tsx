import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { colors, fontWeights, radii, spacing, typography } from '@/constants/design';

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
  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Friend Requests</Text>
        {count > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        ) : null}
      </View>

      <Pressable
        accessibilityLabel={`Sort friend requests by ${sortLabel}`}
        accessibilityRole="button"
        onPress={onSortPress}
        style={({ pressed }) => [styles.sortPill, pressed && styles.pressed]}
      >
        <Text style={styles.sortText}>Sort by: {sortLabel}</Text>
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
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.extraBold,
  },
  badge: {
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.small,
    backgroundColor: colors.navActive,
    paddingHorizontal: spacing.compactGap,
  },
  badgeText: {
    color: colors.surface,
    fontSize: typography.compact,
    fontWeight: fontWeights.extraBold,
  },
  sortPill: {
    minHeight: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.compactGap,
    borderRadius: 14,
    backgroundColor: '#eff0f5',
    paddingHorizontal: spacing.two,
  },
  sortText: {
    color: colors.muted,
    fontSize: typography.compact,
    fontWeight: fontWeights.semiBold,
  },
  pressed: {
    opacity: 0.72,
  },
});
