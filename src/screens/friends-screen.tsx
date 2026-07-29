import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText as Text } from '@/components/app-text';
import { BottomNavigationBar } from '@/components/bottom-navigation-bar';
import { BottomTabSwipeContainer } from '@/components/bottom-tab-swipe-container';
import {
  type FriendRequest,
  FriendRequestsList,
  FriendRequestsSectionHeader,
  FriendSearchResultsList,
  FriendsHeader,
  FriendsSectionHeader,
  type FriendsTab,
} from '@/components/friends';
import { colors, dimensions, fontWeights, opacity, spacing, typography } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useFriendRequests } from '@/contexts/friend-requests-context';
import { useToast } from '@/contexts/toast-context';
import {
  acceptFriendshipRequest,
  createFriendshipRequest,
  declineFriendshipRequest,
  getReceivedPendingFriendshipsRequest,
} from '@/services/api/friendships';
import { MIN_USER_SEARCH_LENGTH, searchUsersRequest } from '@/services/api/users';
import type { Friendship } from '@/types/friendships';
import type { SearchUserResult } from '@/types/users';

type RequestSortMode = 'recent' | 'oldest' | 'nameAsc' | 'nameDesc';

const requestSortOptions: {
  label: string;
  value: RequestSortMode;
}[] = [
  {
    label: 'Recent',
    value: 'recent',
  },
  {
    label: 'Oldest',
    value: 'oldest',
  },
  {
    label: 'A-Z',
    value: 'nameAsc',
  },
  {
    label: 'Z-A',
    value: 'nameDesc',
  },
];

export function FriendsScreen() {
  const { session } = useAuth();
  const { setPendingRequestCount } = useFriendRequests();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<FriendsTab>('search');
  const [query, setQuery] = useState('');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [requestSortMode, setRequestSortMode] = useState<RequestSortMode>('recent');
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [addingUserIds, setAddingUserIds] = useState<Set<string>>(() => new Set());
  const [searchRetryKey, setSearchRetryKey] = useState(0);
  const [userSearchError, setUserSearchError] = useState<string | null>(null);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState<SearchUserResult[]>([]);

  const loadFriendRequests = useCallback(async () => {
    if (!session) {
      return;
    }

    setRequestsLoading(true);
    setRequestsError(null);

    try {
      const friendships = await getReceivedPendingFriendshipsRequest(session.accessToken);
      const requests = friendships.map(mapReceivedFriendRequest);
      setFriendRequests(requests);
      setPendingRequestCount(requests.length);
    } catch (caughtError) {
      const message = getErrorMessage(caughtError, 'Could not load friend requests.');
      setRequestsError(message);
      showToast({ message, mode: 'alert' });
    } finally {
      setRequestsLoading(false);
    }
  }, [session, setPendingRequestCount, showToast]);

  useEffect(() => {
    void loadFriendRequests();
  }, [loadFriendRequests]);

  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const visibleRequests = useMemo(() => {
    const filteredRequests = !normalizedQuery
      ? friendRequests
      : friendRequests.filter((request) => {
          const displayName = request.displayName.toLowerCase();
          const email = request.email.toLowerCase();
          const username = request.username.toLowerCase();

          return (
            displayName.includes(normalizedQuery) ||
            email.includes(normalizedQuery) ||
            username.includes(normalizedQuery)
          );
        });

    return [...filteredRequests].sort((left, right) =>
      compareRequests(left, right, requestSortMode),
    );
  }, [friendRequests, normalizedQuery, requestSortMode]);
  const requestSortLabel =
    requestSortOptions.find((option) => option.value === requestSortMode)?.label ?? 'Recent';

  function cycleRequestSortMode() {
    setRequestSortMode((currentMode) => {
      const currentIndex = requestSortOptions.findIndex((option) => option.value === currentMode);
      const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % requestSortOptions.length : 0;

      return requestSortOptions[nextIndex].value;
    });
  }

  const helperText =
    activeTab === 'search' &&
    trimmedQuery.length > 0 &&
    trimmedQuery.length < MIN_USER_SEARCH_LENGTH
      ? `Type at least ${MIN_USER_SEARCH_LENGTH} letters to search.`
      : null;

  useEffect(() => {
    if (!session || activeTab !== 'search') {
      return;
    }

    const searchQuery = trimmedQuery;

    if (searchQuery.length < MIN_USER_SEARCH_LENGTH) {
      setUserSearchLoading(false);
      setUserSearchError(null);
      setUserSearchResults([]);
      return;
    }

    let cancelled = false;

    setUserSearchLoading(true);
    setUserSearchError(null);

    const timeout = setTimeout(() => {
      searchUsersRequest(session.accessToken, searchQuery)
        .then((response) => {
          if (!cancelled) {
            setUserSearchResults(response.data);
          }
        })
        .catch((caughtError: unknown) => {
          if (!cancelled) {
            const message = getErrorMessage(caughtError, 'Could not search users.');
            setUserSearchError(message);
            setUserSearchResults([]);
            showToast({ message, mode: 'alert' });
          }
        })
        .finally(() => {
          if (!cancelled) {
            setUserSearchLoading(false);
          }
        });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [activeTab, searchRetryKey, session, showToast, trimmedQuery]);

  async function acceptReceivedRequest(id: string) {
    if (!session) {
      return false;
    }

    setRequestsError(null);

    try {
      await acceptFriendshipRequest(session.accessToken, id);
      return true;
    } catch (caughtError) {
      const message = getErrorMessage(caughtError, 'Could not accept friend request.');
      setRequestsError(message);
      showToast({ message, mode: 'alert' });
      return false;
    }
  }

  async function declineReceivedRequest(id: string) {
    if (!session) {
      return false;
    }

    setRequestsError(null);

    try {
      await declineFriendshipRequest(session.accessToken, id);
      return true;
    } catch (caughtError) {
      const message = getErrorMessage(caughtError, 'Could not reject friend request.');
      setRequestsError(message);
      showToast({ message, mode: 'alert' });
      return false;
    }
  }

  function removeRequest(id: string) {
    setFriendRequests((currentRequests) => {
      const nextRequests = currentRequests.filter((request) => request.id !== id);
      setPendingRequestCount(nextRequests.length);

      return nextRequests;
    });
  }

  async function addFriend(userId: string) {
    if (!session || addingUserIds.has(userId)) {
      return;
    }

    setAddingUserIds((currentIds) => new Set(currentIds).add(userId));

    try {
      const friendship = await createFriendshipRequest(session.accessToken, userId);

      setUserSearchResults((currentResults) =>
        currentResults.map((result) =>
          result.profile.id === userId
            ? {
                ...result,
                relationship: {
                  direction: 'sent',
                  id: friendship.id,
                  status: friendship.status,
                },
              }
            : result,
        ),
      );
      showToast({ message: 'Friend request sent.', mode: 'success' });
    } catch (caughtError) {
      const message = getErrorMessage(caughtError, 'Could not send friend request.');
      showToast({ message, mode: 'alert' });
    } finally {
      setAddingUserIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(userId);
        return nextIds;
      });
    }
  }

  function clearUserSearch() {
    setQuery('');
    setUserSearchError(null);
    setUserSearchResults([]);
  }

  if (!session) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <BottomTabSwipeContainer activeItem="friends">
        <SafeAreaView edges={['top']} style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <FriendsHeader
                activeTab={activeTab}
                onClearSearch={clearUserSearch}
                onQueryChange={setQuery}
                onTabChange={setActiveTab}
                searchHelperText={helperText}
                query={query}
                requestCount={friendRequests.length}
              />

              <View style={styles.section}>
                {activeTab === 'search' ? (
                  <>
                    <FriendsSectionHeader count={userSearchResults.length} title="Search Results" />
                    {trimmedQuery.length < MIN_USER_SEARCH_LENGTH ? (
                      <UserSearchIdleState />
                    ) : userSearchLoading ? (
                      <UserSearchLoadingState />
                    ) : (
                      <>
                        {userSearchError ? (
                          <RequestsErrorState
                            message={userSearchError}
                            onRetry={() => setSearchRetryKey((currentKey) => currentKey + 1)}
                          />
                        ) : null}
                        <FriendSearchResultsList
                          addingUserIds={addingUserIds}
                          onAddFriend={(userId) => void addFriend(userId)}
                          results={userSearchResults}
                        />
                      </>
                    )}
                  </>
                ) : null}

                {activeTab === 'requests' ? (
                  <>
                    <FriendRequestsSectionHeader
                      count={visibleRequests.length}
                      onSortPress={cycleRequestSortMode}
                      sortLabel={requestSortLabel}
                    />
                    {requestsLoading ? (
                      <RequestsLoadingState />
                    ) : (
                      <>
                        {requestsError ? (
                          <RequestsErrorState
                            message={requestsError}
                            onRetry={() => void loadFriendRequests()}
                          />
                        ) : null}
                        <FriendRequestsList
                          onAccept={acceptReceivedRequest}
                          onReject={declineReceivedRequest}
                          onResolved={removeRequest}
                          requests={visibleRequests}
                        />
                      </>
                    )}
                  </>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </BottomTabSwipeContainer>
      <BottomNavigationBar activeItem="friends" />
    </View>
  );
}

function mapReceivedFriendRequest(friendship: Friendship): FriendRequest {
  return {
    avatarUrl: friendship.requester.avatarUrl,
    createdAt: friendship.createdAt,
    displayName: friendship.requester.displayName,
    email: friendship.requester.email,
    id: friendship.id,
    updatedAt: friendship.updatedAt,
    username: friendship.requester.username,
  };
}

function compareRequests(left: FriendRequest, right: FriendRequest, sortMode: RequestSortMode) {
  if (sortMode === 'nameAsc' || sortMode === 'nameDesc') {
    const direction = sortMode === 'nameAsc' ? 1 : -1;
    const nameComparison = left.displayName.localeCompare(right.displayName, undefined, {
      sensitivity: 'base',
    });

    if (nameComparison !== 0) {
      return nameComparison * direction;
    }

    return (
      left.username.localeCompare(right.username, undefined, { sensitivity: 'base' }) * direction
    );
  }

  const direction = sortMode === 'recent' ? -1 : 1;
  const leftTime = new Date(left.createdAt).getTime();
  const rightTime = new Date(right.createdAt).getTime();
  const dateComparison = leftTime - rightTime;

  if (dateComparison !== 0) {
    return dateComparison * direction;
  }

  return left.displayName.localeCompare(right.displayName, undefined, { sensitivity: 'base' });
}

function getErrorMessage(caughtError: unknown, fallback: string) {
  return caughtError instanceof Error ? caughtError.message : fallback;
}

function RequestsLoadingState() {
  return (
    <View style={styles.statusCard}>
      <ActivityIndicator color={colors.navActive} />
      <Text style={styles.statusText}>Loading friend requests...</Text>
    </View>
  );
}

function UserSearchLoadingState() {
  return (
    <View style={styles.statusCard}>
      <ActivityIndicator color={colors.navActive} />
      <Text style={styles.statusText}>Searching users...</Text>
    </View>
  );
}

function UserSearchIdleState() {
  return (
    <View style={styles.statusCard}>
      <Text style={styles.statusText}>Type at least 2 letters to find new friends.</Text>
    </View>
  );
}

type RequestsErrorStateProps = {
  message: string;
  onRetry: () => void;
};

function RequestsErrorState({ message, onRetry }: RequestsErrorStateProps) {
  return (
    <View style={styles.errorCard}>
      <Text style={styles.errorText}>{message}</Text>
      <Pressable
        accessibilityLabel="Retry loading friend requests"
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
