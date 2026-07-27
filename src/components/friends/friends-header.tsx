import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/design';

import { FriendsSearchBar } from './friends-search-bar';
import { type FriendsTab, FriendsTopTabs } from './friends-top-tabs';

type FriendsHeaderProps = {
  activeTab: FriendsTab;
  onClearSearch: () => void;
  onQueryChange: (value: string) => void;
  onTabChange: (tab: FriendsTab) => void;
  searchHelperText?: string | null;
  query: string;
  requestCount: number;
};

export function FriendsHeader({
  activeTab,
  onClearSearch,
  onQueryChange,
  onTabChange,
  searchHelperText,
  query,
  requestCount,
}: FriendsHeaderProps) {
  return (
    <View style={styles.header}>
      <FriendsTopTabs activeTab={activeTab} onTabChange={onTabChange} requestCount={requestCount} />

      <FriendsSearchBar
        helperText={searchHelperText}
        onChangeText={onQueryChange}
        onClear={onClearSearch}
        value={query}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.three,
  },
});
