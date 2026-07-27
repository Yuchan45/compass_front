import { StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { colors, fontWeights, spacing } from '@/constants/design';

import { FriendsSearchBar } from './friends-search-bar';
import { type FriendsTab, FriendsTopTabs } from './friends-top-tabs';

type FriendsHeaderProps = {
  activeTab: FriendsTab;
  onClearSearch: () => void;
  onQueryChange: (value: string) => void;
  onRequestsPress: () => void;
  onSearchPress: () => void;
  onSubmitSearch: () => void;
  searchHelperText?: string | null;
  query: string;
  requestCount: number;
};

export function FriendsHeader({
  activeTab,
  onClearSearch,
  onQueryChange,
  onRequestsPress,
  onSearchPress,
  onSubmitSearch,
  searchHelperText,
  query,
  requestCount,
}: FriendsHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Friends</Text>
        <FriendsTopTabs
          activeTab={activeTab}
          onRequestsPress={onRequestsPress}
          onSearchPress={onSearchPress}
          requestCount={requestCount}
        />
      </View>

      <FriendsSearchBar
        helperText={searchHelperText}
        onChangeText={onQueryChange}
        onClear={onClearSearch}
        onSubmitSearch={onSubmitSearch}
        value={query}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.three,
  },
  topRow: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.three,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeights.extraBold,
  },
});
