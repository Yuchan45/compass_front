import { StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { colors, fontWeights, radii, spacing, typography } from '@/constants/design';

export function FriendsTopTabs() {
  return (
    <View style={styles.tabs}>
      <View style={[styles.tab, styles.activeTab]}>
        <Text style={[styles.tabText, styles.activeTabText]}>Search</Text>
      </View>
      <View style={styles.tab}>
        <Text style={styles.tabText}>Requests</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.one,
  },
  tab: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.one,
    borderRadius: 17,
    backgroundColor: '#eff0f5',
    paddingHorizontal: spacing.three,
  },
  activeTab: {
    backgroundColor: colors.navActive,
  },
  tabText: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeights.extraBold,
  },
  activeTabText: {
    color: colors.surface,
  },
  badge: {
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.small,
    backgroundColor: '#f06273',
    paddingHorizontal: spacing.compactGap,
  },
  badgeText: {
    color: colors.surface,
    fontSize: typography.compact,
    fontWeight: fontWeights.extraBold,
  },
});
