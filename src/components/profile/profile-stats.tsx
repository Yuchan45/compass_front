import { StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { colors, fontWeights, spacing, typography } from '@/constants/design';

type ProfileStatsProps = {
  friends?: number;
  meets?: number;
  places?: number;
};

const stats = [
  { key: 'friends', label: 'Friends' },
  { key: 'meets', label: 'Meets' },
  { key: 'places', label: 'Places' },
] as const;

export function ProfileStats({ friends = 0, meets = 0, places = 0 }: ProfileStatsProps) {
  const values = {
    friends,
    meets,
    places,
  };

  return (
    <View style={styles.stats}>
      {stats.map((item) => (
        <View key={item.key} style={styles.statItem}>
          <Text style={styles.statValue}>{values[item.key]}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stats: {
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.two,
  },
  statItem: {
    minWidth: 78,
    alignItems: 'center',
  },
  statValue: {
    color: colors.textSoft,
    fontSize: 32,
    fontWeight: fontWeights.extraBold,
    lineHeight: 36,
  },
  statLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    textTransform: 'uppercase',
  },
});
