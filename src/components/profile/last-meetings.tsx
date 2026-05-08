import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { colors, fontWeights, spacing, typography } from '@/constants/design';

export function LastMeetings() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.iconShell}>
        <MaterialCommunityIcons color={colors.navActive} name="calendar-blank-outline" size={22} />
      </View>
      <Text style={styles.emptyTitle}>No meetings yet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
    borderRadius: 6,
    backgroundColor: '#f6f5ff',
    paddingHorizontal: spacing.three,
  },
  iconShell: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    color: colors.textSoft,
    fontSize: typography.small,
    fontWeight: fontWeights.bold,
  },
});
