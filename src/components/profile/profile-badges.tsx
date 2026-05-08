import { Image, StyleSheet, View } from 'react-native';

import { badgeImages } from '@/constants/assets';
import { spacing } from '@/constants/design';

const badges = [
  badgeImages.explorer,
  badgeImages.heart,
  badgeImages.nocturne,
  badgeImages.peak,
  badgeImages.popular,
];

export function ProfileBadges() {
  return (
    <View style={styles.badges}>
      {badges.map((badge, index) => (
        <Image accessibilityIgnoresInvertColors key={index} source={badge} style={styles.badge} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  badges: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.two,
  },
  badge: {
    width: 38,
    height: 38,
    resizeMode: 'contain',
  },
});
