import { StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { fontWeights, spacing, typography } from '@/constants/design';
import { useColorTheme } from '@/contexts/color-theme-context';

type FriendsSectionHeaderProps = {
  count: number;
  title?: string;
};

export function FriendsSectionHeader({ count, title = 'Friends' }: FriendsSectionHeaderProps) {
  const { colors } = useColorTheme();

  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: colors.text }]}>
        {title} ({count})
      </Text>
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
    fontSize: typography.small,
    fontWeight: fontWeights.extraBold,
  },
});
