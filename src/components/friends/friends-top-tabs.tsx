import { Pressable, StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { colors, fontWeights, opacity, radii, spacing, typography } from '@/constants/design';

export type FriendsTab = 'search' | 'requests';

type FriendsTopTabsProps = {
  activeTab: FriendsTab;
  onTabChange: (tab: FriendsTab) => void;
  requestCount: number;
};

export function FriendsTopTabs({ activeTab, onTabChange, requestCount }: FriendsTopTabsProps) {
  return (
    <View style={styles.tabs}>
      <TabButton
        active={activeTab === 'search'}
        label="Search"
        onPress={() => onTabChange('search')}
      />
      <TabButton
        active={activeTab === 'requests'}
        label="Requests"
        onPress={() => onTabChange('requests')}
        requestCount={requestCount}
      />
    </View>
  );
}

type TabButtonProps = {
  active: boolean;
  label: string;
  onPress: () => void;
  requestCount?: number;
};

function TabButton({ active, label, onPress, requestCount }: TabButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [styles.tab, active && styles.activeTab, pressed && styles.pressed]}
    >
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
      {requestCount !== undefined && requestCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{requestCount}</Text>
        </View>
      ) : null}
    </Pressable>
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
    flex: 1,
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
  pressed: {
    opacity: opacity.pressed,
  },
});
