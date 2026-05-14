import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { colors, fontWeights, spacing, typography } from '@/constants/design';

export function FriendsSearchBar() {
  return (
    <View accessibilityLabel="Search friends" style={styles.searchBar}>
      <MaterialCommunityIcons color={colors.muted} name="magnify" size={19} />
      <Text numberOfLines={1} style={styles.placeholder}>
        Search by name or username
      </Text>
      <MaterialCommunityIcons color={colors.muted} name="close-circle" size={16} />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
    borderRadius: 22,
    backgroundColor: '#f0f1f6',
    paddingHorizontal: spacing.three,
  },
  placeholder: {
    minWidth: 0,
    flex: 1,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeights.medium,
  },
});
