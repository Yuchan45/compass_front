import { StyleSheet, View } from 'react-native';

import { BottomNavigationBar } from '@/components/bottom-navigation-bar';
import { colors } from '@/constants/design';

export function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.content} />
      <BottomNavigationBar activeItem="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
