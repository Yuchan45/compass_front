import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { colors, fontWeights, radii, spacing, typography } from '@/constants/design';

export function FriendsEmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.iconFrame}>
        <MaterialCommunityIcons color={colors.navActive} name="account-group-outline" size={36} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>You have not added friends yet.</Text>
        <Text style={styles.subtitle}>Friends you add will appear here.</Text>
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
    backgroundColor: colors.surface,
    padding: spacing.five,
  },
  iconFrame: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 38,
    backgroundColor: '#eee9ff',
  },
  copy: {
    alignItems: 'center',
    gap: spacing.one,
  },
  title: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.extraBold,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});
