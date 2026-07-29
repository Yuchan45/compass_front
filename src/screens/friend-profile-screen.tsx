import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText as Text } from '@/components/app-text';
import { BottomNavigationBar } from '@/components/bottom-navigation-bar';
import { type Friend } from '@/components/friends';
import {
  LastMeetings,
  ProfileBadges,
  ProfileHeader,
  ProfileSection,
  ProfileStats,
  TopStreaks,
} from '@/components/profile';
import { dimensions, fontWeights, opacity, spacing, typography } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useColorTheme } from '@/contexts/color-theme-context';
import { useToast } from '@/contexts/toast-context';
import { getAcceptedFriendsRequest } from '@/services/api/friendships';
import type { AcceptedFriendship } from '@/types/friendships';

type FriendProfileScreenProps = {
  friendId: string;
};

export function FriendProfileScreen({ friendId }: FriendProfileScreenProps) {
  const { session } = useAuth();
  const { colors: themeColors } = useColorTheme();
  const { showToast } = useToast();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    if (!session) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getAcceptedFriendsRequest(session.accessToken);
      setFriends(response.data.map(mapAcceptedFriend));
    } catch (caughtError) {
      const message = getErrorMessage(caughtError, 'Could not load friend profile.');
      setError(message);
      showToast({ message, mode: 'alert' });
    } finally {
      setLoading(false);
    }
  }, [session, showToast]);

  useEffect(() => {
    void loadFriends();
  }, [loadFriends]);

  const friend = useMemo(
    () => friends.find((candidate) => candidate.id === friendId) ?? null,
    [friendId, friends],
  );

  if (!session) {
    return null;
  }

  return (
    <View style={[styles.screen, { backgroundColor: themeColors.background }]}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {loading ? (
              <StatusState message="Loading friend profile..." />
            ) : error ? (
              <ErrorState message={error} onRetry={() => void loadFriends()} />
            ) : friend ? (
              <>
                <ProfileHeader
                  actionsVisible={false}
                  avatarUrl={friend.avatarUrl}
                  displayName={friend.displayName}
                  email={friend.email}
                  username={friend.username}
                />

                <View style={styles.body}>
                  <ProfileStats friends={friends.length} />

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
              </>
            ) : (
              <StatusState message="This profile is not available in your friends list." />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomNavigationBar activeItem="profile" />
    </View>
  );
}

function mapAcceptedFriend(relationship: AcceptedFriendship): Friend {
  return {
    avatarUrl: relationship.friend.avatarUrl,
    displayName: relationship.friend.displayName,
    email: relationship.friend.email,
    id: relationship.friend.id,
    lastSeenAt: relationship.friend.lastSeenAt,
    username: relationship.friend.username,
  };
}

function getErrorMessage(caughtError: unknown, fallback: string) {
  return caughtError instanceof Error ? caughtError.message : fallback;
}

type StatusStateProps = {
  message: string;
};

function StatusState({ message }: StatusStateProps) {
  const { colors } = useColorTheme();

  return (
    <View style={[styles.statusCard, { backgroundColor: colors.surface }]}>
      <ActivityIndicator color={colors.navActive} />
      <Text style={[styles.statusText, { color: colors.muted }]}>{message}</Text>
    </View>
  );
}

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { colors } = useColorTheme();

  return (
    <View style={[styles.errorCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.errorText, { color: colors.danger }]}>{message}</Text>
      <Pressable
        accessibilityLabel="Retry loading friend profile"
        accessibilityRole="button"
        onPress={onRetry}
        style={({ pressed }) => [
          styles.retryButton,
          { backgroundColor: colors.navActive },
          pressed && styles.pressed,
        ]}
      >
        <Text style={[styles.retryText, { color: colors.surface }]}>Retry</Text>
      </Pressable>
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
  statusCard: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.two,
    borderRadius: 8,
    marginHorizontal: spacing.two,
    padding: spacing.four,
  },
  statusText: {
    fontSize: typography.small,
    fontWeight: fontWeights.semiBold,
    textAlign: 'center',
  },
  errorCard: {
    gap: spacing.two,
    borderRadius: 8,
    marginHorizontal: spacing.two,
    padding: spacing.three,
  },
  errorText: {
    fontSize: typography.small,
    fontWeight: fontWeights.bold,
  },
  retryButton: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.one,
  },
  retryText: {
    fontSize: typography.caption,
    fontWeight: fontWeights.extraBold,
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
