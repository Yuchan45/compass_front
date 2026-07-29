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
import { dimensions, fontWeights, opacity, spacing, typography } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useColorTheme } from '@/contexts/color-theme-context';
import { useToast } from '@/contexts/toast-context';
import { getAcceptedFriendsRequest } from '@/services/api/friendships';
import { MIN_USER_SEARCH_LENGTH } from '@/services/api/users';
import type { AcceptedFriendship } from '@/types/friendships';

type ProfileFriendsScreenProps = {
  onBackPress: () => void;
};

export function ProfileFriendsScreen({ onBackPress }: ProfileFriendsScreenProps) {
  const { session } = useAuth();
  const { colors: themeColors } = useColorTheme();
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
    <View style={[styles.screen, { backgroundColor: themeColors.background }]}>
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
                <MaterialCommunityIcons color={themeColors.text} name="arrow-left" size={26} />
              </Pressable>

              <View style={styles.headerText}>
                <Text style={[styles.title, { color: themeColors.text }]}>Friends</Text>
                <Text style={[styles.subtitle, { color: themeColors.muted }]}>
                  {friends.length} current friends
                </Text>
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
  const { colors } = useColorTheme();

  return (
    <View style={[styles.statusCard, { backgroundColor: colors.surface }]}>
      <ActivityIndicator color={colors.navActive} />
      <Text style={[styles.statusText, { color: colors.muted }]}>Loading friends...</Text>
    </View>
  );
}

type FriendsErrorStateProps = {
  message: string;
  onRetry: () => void;
};

function FriendsErrorState({ message, onRetry }: FriendsErrorStateProps) {
  const { colors } = useColorTheme();

  return (
    <View style={[styles.errorCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.errorText, { color: colors.danger }]}>{message}</Text>
      <Pressable
        accessibilityLabel="Retry loading friends"
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
    fontSize: 28,
    fontWeight: fontWeights.extraBold,
  },
  subtitle: {
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
    padding: spacing.four,
  },
  statusText: {
    fontSize: typography.small,
    fontWeight: fontWeights.semiBold,
  },
  errorCard: {
    gap: spacing.two,
    borderRadius: 8,
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
