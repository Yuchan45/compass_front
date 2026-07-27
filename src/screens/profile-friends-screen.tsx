import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText as Text } from '@/components/app-text';
import {
  FriendsList,
  FriendsSearchBar,
  FriendsSectionHeader,
  type Friend,
} from '@/components/friends';
import { colors, dimensions, fontWeights, opacity, spacing, typography } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { getAcceptedFriendsRequest } from '@/services/api/friendships';
import { MIN_USER_SEARCH_LENGTH } from '@/services/api/users';
import type { AcceptedFriendship } from '@/types/friendships';

type ProfileFriendsScreenProps = {
  onBackPress: () => void;
};

export function ProfileFriendsScreen({ onBackPress }: ProfileFriendsScreenProps) {
  const { session } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsError, setFriendsError] = useState<string | null>(null);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [query, setQuery] = useState('');

  const loadFriends = useCallback(async () => {
    if (!session) {
      return;
    }

    setFriendsLoading(true);
    setFriendsError(null);

    try {
      const response = await getAcceptedFriendsRequest(session.accessToken);
      setFriends(response.data.map(mapAcceptedFriend));
    } catch (caughtError) {
      const message = getErrorMessage(caughtError, 'Could not load friends.');
      setFriendsError(message);
      showToast({ message, mode: 'alert' });
    } finally {
      setFriendsLoading(false);
    }
  }, [session, showToast]);

  useEffect(() => {
    void loadFriends();
  }, [loadFriends]);

  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const searchReady = trimmedQuery.length >= MIN_USER_SEARCH_LENGTH;
  const visibleFriends = useMemo(() => {
    if (!searchReady) {
      return friends;
    }

    return friends.filter((friend) => {
      const displayName = friend.displayName.toLowerCase();
      const email = friend.email.toLowerCase();
      const username = friend.username.toLowerCase();

      return (
        displayName.includes(normalizedQuery) ||
        email.includes(normalizedQuery) ||
        username.includes(normalizedQuery)
      );
    });
  }, [friends, normalizedQuery, searchReady]);
  const helperText =
    trimmedQuery.length > 0 && !searchReady
      ? `Type at least ${MIN_USER_SEARCH_LENGTH} letters to search.`
      : null;

  if (!session) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Pressable
                accessibilityLabel="Back to profile"
                accessibilityRole="button"
                onPress={onBackPress}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              >
                <MaterialCommunityIcons color={colors.text} name="arrow-left" size={26} />
              </Pressable>

              <View style={styles.headerText}>
                <Text style={styles.title}>Friends</Text>
                <Text style={styles.subtitle}>{friends.length} current friends</Text>
              </View>
            </View>

            <FriendsSearchBar
              helperText={helperText}
              onChangeText={setQuery}
              onClear={() => setQuery('')}
              value={query}
            />

            <View style={styles.section}>
              <FriendsSectionHeader count={visibleFriends.length} />
              {friendsLoading ? (
                <FriendsLoadingState />
              ) : (
                <>
                  {friendsError ? (
                    <FriendsErrorState message={friendsError} onRetry={() => void loadFriends()} />
                  ) : null}
                  <FriendsList
                    friends={visibleFriends}
                    onProfilePress={(friend) =>
                      router.push({
                        pathname: '/friend-profile',
                        params: {
                          id: friend.id,
                        },
                      })
                    }
                  />
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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

function FriendsLoadingState() {
  return (
    <View style={styles.statusCard}>
      <ActivityIndicator color={colors.navActive} />
      <Text style={styles.statusText}>Loading friends...</Text>
    </View>
  );
}

type FriendsErrorStateProps = {
  message: string;
  onRetry: () => void;
};

function FriendsErrorState({ message, onRetry }: FriendsErrorStateProps) {
  return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>{message}</Text>
      <Pressable
        accessibilityLabel="Retry loading friends"
        accessibilityRole="button"
        onPress={onRetry}
        style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}
      >
        <Text style={styles.retryText}>Retry</Text>
      </Pressable>
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
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
  },
  backButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    minWidth: 0,
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeights.extraBold,
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium,
  },
  section: {
    gap: spacing.two,
  },
  statusCard: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.two,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: spacing.four,
  },
  statusText: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeights.semiBold,
  },
  errorCard: {
    gap: spacing.two,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: spacing.three,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: fontWeights.bold,
  },
  retryButton: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    backgroundColor: colors.navActive,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.one,
  },
  retryText: {
    color: colors.surface,
    fontSize: typography.caption,
    fontWeight: fontWeights.extraBold,
  },
  pressed: {
    opacity: opacity.pressed,
  },
});
