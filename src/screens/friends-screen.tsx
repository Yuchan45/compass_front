import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigationBar } from '@/components/bottom-navigation-bar';
import {
  FriendsEmptyState,
  FriendsSearchBar,
  FriendsSectionHeader,
  FriendsTopTabs,
} from '@/components/friends';
import { AppText as Text } from '@/components/app-text';
import { colors, dimensions, fontWeights, spacing } from '@/constants/design';

const friendCount = 0;

export function FriendsScreen() {
  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Friends</Text>
              <FriendsTopTabs />
            </View>

            <FriendsSearchBar />

            <View style={styles.section}>
              <FriendsSectionHeader count={friendCount} />
              <FriendsEmptyState />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomNavigationBar activeItem="friends" />
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
  content: {
    flexGrow: 1,
    paddingBottom: spacing.three,
    paddingHorizontal: spacing.two,
    paddingTop: spacing.four,
  },
  container: {
    width: '100%',
    maxWidth: dimensions.appMaxWidth,
    alignSelf: 'center',
    gap: spacing.three,
  },
  header: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.three,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeights.extraBold,
  },
  section: {
    gap: spacing.two,
  },
});
