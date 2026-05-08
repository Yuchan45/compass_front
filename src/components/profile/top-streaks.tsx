import { Image, StyleSheet, View } from 'react-native';

import { commonImages } from '@/constants/assets';
import { colors, spacing } from '@/constants/design';

const placeholderSlots = ['streak-1', 'streak-2', 'streak-3'] as const;

export function TopStreaks() {
  return (
    <View style={styles.list}>
      {placeholderSlots.map((slot) => (
        <View key={slot} style={styles.item}>
          <View style={styles.avatarShell}>
            <Image
              accessibilityIgnoresInvertColors
              source={commonImages.defaultStreakProfile}
              style={styles.avatar}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: spacing.two,
  },
  item: {
    width: 72,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarShell: {
    width: 46,
    height: 46,
    overflow: 'hidden',
    borderRadius: 23,
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
