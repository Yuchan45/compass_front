import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNavigationBar } from '@/components/bottom-navigation-bar';
import {
  type Friend,
  type FriendRequest,
  FriendRequestsList,
  FriendRequestsSectionHeader,
  FriendsHeader,
  FriendsList,
  FriendsSectionHeader,
  type FriendsTab,
} from '@/components/friends';
import { colors, dimensions, spacing } from '@/constants/design';

const initialFriends: Friend[] = [
  {
    id: 'valentina-russo',
    displayName: 'Valentina Russo',
    username: 'valen.russo',
    lastMeetup: 'Last meetup: Palermo Woods',
  },
  {
    id: 'diego-mendez',
    displayName: 'Diego Mendez',
    username: 'diegomendez',
    lastMeetup: 'Last meetup: Coffee Lab',
  },
  {
    id: 'ana-beltran',
    displayName: 'Ana Beltran',
    username: 'ana.beltran',
    lastMeetup: 'Last meetup: San Telmo Market',
  },
];

const initialFriendRequests: FriendRequest[] = [
  {
    id: 'maria-gonzalez',
    displayName: 'Maria Gonzalez',
    username: 'maria.gonzalez',
    mutualFriends: 12,
  },
  {
    id: 'tomas-rodriguez',
    displayName: 'Tomas Rodriguez',
    username: 'tomas.rodriguez',
    mutualFriends: 8,
  },
  {
    id: 'julieta-alvarez',
    displayName: 'Julieta Alvarez',
    username: 'julieta.alvarez',
    mutualFriends: 6,
  },
  {
    id: 'mateo-lopez',
    displayName: 'Mateo Lopez',
    username: 'mateolopez',
    mutualFriends: 10,
  },
  {
    id: 'camila-torres',
    displayName: 'Camila Torres',
    username: 'camila.torres',
    mutualFriends: 7,
  },
  {
    id: 'nicolas-fernandez',
    displayName: 'Nicolas Fernandez',
    username: 'nicolasfdez',
    mutualFriends: 5,
  },
  {
    id: 'sofia-martinez',
    displayName: 'Sofia Martinez',
    username: 'sofia.martinez',
    mutualFriends: 9,
  },
  {
    id: 'lucas-pereyra',
    displayName: 'Lucas Pereyra',
    username: 'lucaspereyra',
    mutualFriends: 4,
  },
];

export function FriendsScreen() {
  const [activeTab, setActiveTab] = useState<FriendsTab>('search');
  const [query, setQuery] = useState('');
  const [friends] = useState(initialFriends);
  const [friendRequests, setFriendRequests] = useState(initialFriendRequests);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleFriends = useMemo(() => {
    if (!normalizedQuery) {
      return friends;
    }

    return friends.filter((friend) => {
      const displayName = friend.displayName.toLowerCase();
      const username = friend.username.toLowerCase();

      return displayName.includes(normalizedQuery) || username.includes(normalizedQuery);
    });
  }, [friends, normalizedQuery]);

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

  function resolveRequest(id: string) {
    setFriendRequests((currentRequests) => currentRequests.filter((request) => request.id !== id));
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <FriendsHeader
              activeTab={activeTab}
              onClearSearch={() => setQuery('')}
              onQueryChange={setQuery}
              onRequestsPress={() => setActiveTab('requests')}
              onSearchPress={() => setActiveTab('search')}
              query={query}
              requestCount={friendRequests.length}
            />

            <View style={styles.section}>
              {activeTab === 'requests' ? (
                <>
                  <FriendRequestsSectionHeader count={visibleRequests.length} />
                  <FriendRequestsList
                    onAccept={resolveRequest}
                    onReject={resolveRequest}
                    requests={visibleRequests}
                  />
                </>
              ) : (
                <>
                  <FriendsSectionHeader count={visibleFriends.length} />
                  <FriendsList friends={visibleFriends} />
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
});
