import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText as Text } from '@/components/app-text';
import { BottomNavigationBar } from '@/components/bottom-navigation-bar';
import {
  type Friend,
  type FriendRequest,
  FriendRequestsList,
  FriendRequestsSectionHeader,
  FriendSearchResultsList,
  FriendsHeader,
  FriendsList,
  FriendsSectionHeader,
  type FriendsTab,
} from '@/components/friends';
import { colors, dimensions, fontWeights, opacity, spacing, typography } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import {
  acceptFriendshipRequest,
  declineFriendshipRequest,
  getAcceptedFriendsRequest,
  getReceivedPendingFriendshipsRequest,
} from '@/services/api/friendships';
import { MIN_USER_SEARCH_LENGTH, searchUsersRequest } from '@/services/api/users';
import type { AcceptedFriendship, Friendship } from '@/types/friendships';
import type { SearchUserResult } from '@/types/users';

export function FriendsScreen() {
  const { session } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<FriendsTab>('search');
  const [query, setQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsError, setFriendsError] = useState<string | null>(null);
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [userSearchError, setUserSearchError] = useState<string | null>(null);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState<SearchUserResult[]>([]);

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

  const loadFriendRequests = useCallback(async () => {
    if (!session) {
      return;
    }

    setRequestsLoading(true);
    setRequestsError(null);

    try {
      const friendships = await getReceivedPendingFriendshipsRequest(session.accessToken);
      setFriendRequests(friendships.map(mapReceivedFriendRequest));
    } catch (caughtError) {
      const message = getErrorMessage(caughtError, 'Could not load friend requests.');
      setRequestsError(message);
      showToast({ message, mode: 'alert' });
    } finally {
      setRequestsLoading(false);
    }
  }, [session, showToast]);

  useEffect(() => {
    void loadFriends();
    void loadFriendRequests();
  }, [loadFriends, loadFriendRequests]);

  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const visibleRequests = useMemo(() => {
    if (!normalizedQuery) {
      return friendRequests;
    }

    return friendRequests.filter((request) => {
      const displayName = request.displayName.toLowerCase();
      const username = request.username.toLowerCase();

      return displayName.includes(normalizedQuery) || username.includes(normalizedQuery);
    });
  }, [friendRequests, normalizedQuery]);
  const helperText =
    trimmedQuery.length > 0 && trimmedQuery.length < MIN_USER_SEARCH_LENGTH
      ? `Type at least ${MIN_USER_SEARCH_LENGTH} letters to search.`
      : null;
  const hasSubmittedSearch =
    submittedQuery.length >= MIN_USER_SEARCH_LENGTH && submittedQuery === trimmedQuery;

  async function acceptReceivedRequest(id: string) {
    if (!session) {
      return false;
    }

    setRequestsError(null);

    try {
      await acceptFriendshipRequest(session.accessToken, id);
      await loadFriends();
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
    setFriendRequests((currentRequests) => currentRequests.filter((request) => request.id !== id));
  }

  async function submitUserSearch() {
    if (!session) {
      return;
    }

    const searchQuery = trimmedQuery;

    if (!searchQuery) {
      clearUserSearch();
      return;
    }

    if (searchQuery.length < MIN_USER_SEARCH_LENGTH) {
      setSubmittedQuery('');
      setUserSearchError(null);
      setUserSearchResults([]);
      return;
    }

    setSubmittedQuery(searchQuery);
    setUserSearchLoading(true);
    setUserSearchError(null);
    setUserSearchResults([]);

    try {
      const response = await searchUsersRequest(session.accessToken, searchQuery);
      setUserSearchResults(response.data);
    } catch (caughtError) {
      const message = getErrorMessage(caughtError, 'Could not search users.');
      setUserSearchError(message);
      setUserSearchResults([]);
      showToast({ message, mode: 'alert' });
    } finally {
      setUserSearchLoading(false);
    }
  }

  function clearUserSearch() {
    setQuery('');
    setSubmittedQuery('');
    setUserSearchError(null);
    setUserSearchResults([]);
  }

  if (!session) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <FriendsHeader
              activeTab={activeTab}
              onClearSearch={clearUserSearch}
              onQueryChange={setQuery}
              onRequestsPress={() => setActiveTab('requests')}
              onSearchPress={() => setActiveTab('search')}
              onSubmitSearch={submitUserSearch}
              searchHelperText={activeTab === 'search' ? helperText : null}
              query={query}
              requestCount={friendRequests.length}
            />

            <View style={styles.section}>
              {activeTab === 'requests' ? (
                <>
                  <FriendRequestsSectionHeader count={visibleRequests.length} />
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
              ) : (
                <>
                  {hasSubmittedSearch ? (
                    <>
                      <FriendsSectionHeader
                        count={userSearchResults.length}
                        title="Search Results"
                      />
                      {userSearchLoading ? (
                        <UserSearchLoadingState />
                      ) : (
                        <>
                          {userSearchError ? (
                            <RequestsErrorState
                              message={userSearchError}
                              onRetry={() => void submitUserSearch()}
                            />
                          ) : null}
                          <FriendSearchResultsList results={userSearchResults} />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <FriendsSectionHeader count={friends.length} />
                      {friendsLoading ? (
                        <FriendsLoadingState />
                      ) : (
                        <>
                          {friendsError ? (
                            <RequestsErrorState
                              message={friendsError}
                              onRetry={() => void loadFriends()}
                            />
                          ) : null}
                          <FriendsList friends={friends} />
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <BottomNavigationBar activeItem="friends" />
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

function mapReceivedFriendRequest(friendship: Friendship): FriendRequest {
  return {
    avatarUrl: friendship.requester.avatarUrl,
    displayName: friendship.requester.displayName,
    email: friendship.requester.email,
    id: friendship.id,
    username: friendship.requester.username,
  };
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

function FriendsLoadingState() {
  return (
    <View style={styles.statusCard}>
      <ActivityIndicator color={colors.navActive} />
      <Text style={styles.statusText}>Loading friends...</Text>
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
