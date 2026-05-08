import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigationBar } from '@/components/bottom-navigation-bar';
import {
  LastMeetings,
  ProfileBadges,
  ProfileHeader,
  ProfileSection,
  ProfileStats,
  TopStreaks,
} from '@/components/profile';
import { colors, dimensions, spacing } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';

export function ProfileScreen() {
  const { session } = useAuth();

  if (!session) {
    return null;
  }

  const { user } = session;

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <ProfileHeader
              avatarUrl={user.avatarUrl}
              displayName={user.displayName}
              email={user.email}
              username={user.username}
            />

            <View style={styles.body}>
              <ProfileStats />

              <ProfileSection title="Top Streaks">
                <TopStreaks />
              </ProfileSection>

              <ProfileSection title="Badges">
                <ProfileBadges />
              </ProfileSection>

              <ProfileSection title="Last Meetings">
                <LastMeetings />
              </ProfileSection>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomNavigationBar activeItem="profile" />
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
  },
  container: {
    width: '100%',
    maxWidth: dimensions.appMaxWidth,
    alignSelf: 'center',
    gap: spacing.two,
  },
  body: {
    gap: spacing.two,
    paddingHorizontal: spacing.two,
  },
});
