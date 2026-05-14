import { StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { colors, fontWeights, spacing, typography } from '@/constants/design';

type FriendsSectionHeaderProps = {
  count: number;
};

export function FriendsSectionHeader({ count }: FriendsSectionHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Friends ({count})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.two,
  },
  title: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.extraBold,
  },
});
