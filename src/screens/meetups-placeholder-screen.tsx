import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText as Text } from '@/components/app-text';
import { BottomNavigationBar } from '@/components/bottom-navigation-bar';
import { BottomTabSwipeContainer } from '@/components/bottom-tab-swipe-container';
import { borders, dimensions, fontWeights, radii, spacing, typography } from '@/constants/design';
import { useColorTheme } from '@/contexts/color-theme-context';

export function MeetupsPlaceholderScreen() {
  const { colors } = useColorTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <BottomTabSwipeContainer activeItem="meetups">
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <View style={styles.container}>
            <View
              style={[
                styles.placeholder,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={[styles.iconShell, { backgroundColor: colors.primarySoft }]}>
                <MaterialCommunityIcons
                  color={colors.navActive}
                  name="calendar-month-outline"
                  size={42}
                />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>Meets</Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Meetup planning will be added here.
              </Text>
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
    borderWidth: borders.defaultWidth,
    padding: spacing.four,
  },
  iconShell: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 39,
  },
  title: {
    fontSize: typography.title,
    fontWeight: fontWeights.extraBold,
  },
  subtitle: {
    fontSize: typography.body,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});
