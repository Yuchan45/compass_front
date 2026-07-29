import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigationBar } from '@/components/bottom-navigation-bar';
import { BottomTabSwipeContainer } from '@/components/bottom-tab-swipe-container';
import {
  LastMeetings,
  ProfileBadges,
  ProfileHeader,
  ProfileSection,
  ProfileSettingsOverlay,
  ProfileStats,
  TopStreaks,
} from '@/components/profile';
import { dimensions, spacing } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useColorTheme } from '@/contexts/color-theme-context';
import { getAcceptedFriendsRequest } from '@/services/api/friendships';

export function ProfileScreen() {
  const { logout, session } = useAuth();
  const { colors: themeColors } = useColorTheme();
  const router = useRouter();
  const [friendsCount, setFriendsCount] = useState(0);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const loadFriendsCount = useCallback(async () => {
    if (!session) {
      return;
    }

    try {
      const response = await getAcceptedFriendsRequest(session.accessToken);
      setFriendsCount(response.data.length);
    } catch {
      setFriendsCount(0);
    }
  }, [session]);

  useEffect(() => {
    void loadFriendsCount();
  }, [loadFriendsCount]);

  if (!session) {
    return null;
  }

  const { user } = session;

  async function submitLogout() {
    setSettingsVisible(false);
    await logout();
  }

  return (
    <View style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <BottomTabSwipeContainer activeItem="profile">
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <ProfileHeader
                avatarUrl={user.avatarUrl}
                displayName={user.displayName}
                email={user.email}
                onEditPress={() => router.push('/edit-profile')}
                onSettingsPress={() => setSettingsVisible(true)}
                username={user.username}
              />

              <View style={styles.body}>
                <ProfileStats
                  friends={friendsCount}
                  onFriendsPress={() => router.push('/profile-friends')}
                />

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
      </BottomTabSwipeContainer>
      <ProfileSettingsOverlay
        onClose={() => setSettingsVisible(false)}
        onLogout={() => void submitLogout()}
        visible={settingsVisible}
      />
      <BottomNavigationBar activeItem="profile" />
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
