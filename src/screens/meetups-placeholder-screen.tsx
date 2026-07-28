import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText as Text } from '@/components/app-text';
import { BottomNavigationBar } from '@/components/bottom-navigation-bar';
import { BottomTabSwipeContainer } from '@/components/bottom-tab-swipe-container';
import {
  borders,
  colors,
  dimensions,
  fontWeights,
  radii,
  spacing,
  typography,
} from '@/constants/design';

export function MeetupsPlaceholderScreen() {
  return (
    <View style={styles.screen}>
      <BottomTabSwipeContainer activeItem="meetups">
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.placeholder}>
              <View style={styles.iconShell}>
                <MaterialCommunityIcons
                  color={colors.navActive}
                  name="calendar-month-outline"
                  size={42}
                />
              </View>
              <Text style={styles.title}>Meets</Text>
              <Text style={styles.subtitle}>Meetup planning will be added here.</Text>
            </View>
          </View>
        </SafeAreaView>
      </BottomTabSwipeContainer>
      <BottomNavigationBar activeItem="meetups" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    width: '100%',
    maxWidth: dimensions.appMaxWidth,
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    padding: spacing.three,
  },
  placeholder: {
    minHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.two,
    borderRadius: radii.medium,
    borderColor: colors.border,
    borderWidth: borders.defaultWidth,
    backgroundColor: colors.surface,
    padding: spacing.four,
  },
  iconShell: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 39,
    backgroundColor: colors.primarySoft,
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeights.extraBold,
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.body,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});
