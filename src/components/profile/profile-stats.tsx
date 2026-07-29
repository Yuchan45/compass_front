import { Pressable, StyleSheet, View } from 'react-native';

import { AppText as Text } from '@/components/app-text';
import { fontWeights, spacing, typography } from '@/constants/design';
import { useColorTheme } from '@/contexts/color-theme-context';

type ProfileStatsProps = {
  friends?: number;
  meets?: number;
  onFriendsPress?: () => void;
  places?: number;
};

const stats = [
  { key: 'friends', label: 'Friends' },
  { key: 'meets', label: 'Meets' },
  { key: 'places', label: 'Places' },
] as const;

export function ProfileStats({
  friends = 0,
  meets = 0,
  onFriendsPress,
  places = 0,
}: ProfileStatsProps) {
  const { colors: themeColors } = useColorTheme();
  const values = {
    friends,
    meets,
    places,
  };

  return (
    <View style={styles.stats}>
      {stats.map((item) => (
        <Pressable
          accessibilityLabel={item.key === 'friends' ? 'Open friends list' : undefined}
          accessibilityRole={item.key === 'friends' ? 'button' : undefined}
          disabled={item.key !== 'friends'}
          key={item.key}
          onPress={item.key === 'friends' ? onFriendsPress : undefined}
          style={({ pressed }) => [
            styles.statItem,
            item.key === 'friends' && styles.pressableStat,
            pressed && styles.pressed,
          ]}
        >
          <Text style={[styles.statValue, { color: themeColors.textSoft }]}>
            {values[item.key]}
          </Text>
          <Text style={[styles.statLabel, { color: themeColors.muted }]}>{item.label}</Text>
        </Pressable>
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
    minHeight: 62,
    minWidth: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableStat: {
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.78,
  },
  statValue: {
    fontSize: 32,
    fontWeight: fontWeights.extraBold,
    lineHeight: 36,
  },
  statLabel: {
    fontSize: typography.caption,
    textTransform: 'uppercase',
  },
});
