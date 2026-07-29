import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { fontWeights, radii, spacing, typography } from '@/constants/design';
import { useColorTheme } from '@/contexts/color-theme-context';

export function FriendsEmptyState() {
  const { colors } = useColorTheme();

  return (
    <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
      <View style={[styles.iconFrame, { backgroundColor: colors.primarySoft }]}>
        <MaterialCommunityIcons color={colors.navActive} name="account-group-outline" size={36} />
      </View>
      <View style={styles.copy}>
        <Text style={[styles.title, { color: colors.text }]}>You have not added friends yet.</Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          Friends you add will appear here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.three,
    borderRadius: radii.medium,
    padding: spacing.five,
  },
  iconFrame: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 38,
  },
  copy: {
    alignItems: 'center',
    gap: spacing.one,
  },
  title: {
    fontSize: typography.body,
    fontWeight: fontWeights.extraBold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.small,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});
