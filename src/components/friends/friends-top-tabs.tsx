import { Pressable, StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { fontWeights, opacity, radii, spacing, typography } from '@/constants/design';
import { useColorTheme } from '@/contexts/color-theme-context';

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
  const { colors: themeColors } = useColorTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tab,
        {
          backgroundColor: active ? themeColors.navActive : themeColors.primarySoft,
        },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.tabText, { color: active ? themeColors.surface : themeColors.muted }]}>
        {label}
      </Text>
      {requestCount !== undefined && requestCount > 0 ? (
        <View style={styles.badge}>
          <Text style={[styles.badgeText, { color: themeColors.surface }]}>{requestCount}</Text>
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
    paddingHorizontal: spacing.three,
  },
  tabText: {
    fontSize: typography.caption,
    fontWeight: fontWeights.extraBold,
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
    fontSize: typography.compact,
    fontWeight: fontWeights.extraBold,
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
