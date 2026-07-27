import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AvatarImage } from '@/components/avatar-image';
import { AppText as Text } from '@/components/app-text';
import {
  borders,
  colors,
  fontWeights,
  opacity,
  radii,
  spacing,
  typography,
} from '@/constants/design';

export type Friend = {
  avatarUrl: string | null;
  email: string;
  id: string;
  displayName: string;
  lastSeenAt: string | null;
  username: string;
};

type FriendsListProps = {
  friends: Friend[];
  onProfilePress?: (friend: Friend) => void;
};

export function FriendsList({ friends, onProfilePress }: FriendsListProps) {
  if (friends.length === 0) {
    return <FriendsNoResults />;
  }

  return (
    <View style={styles.list}>
      {friends.map((friend) => (
        <FriendCard friend={friend} key={friend.id} onProfilePress={onProfilePress} />
      ))}
    </View>
  );
}

type FriendCardProps = {
  friend: Friend;
  onProfilePress?: (friend: Friend) => void;
};

function FriendCard({ friend, onProfilePress }: FriendCardProps) {
  return (
    <View style={styles.card}>
      <AvatarImage avatarUrl={friend.avatarUrl} style={styles.avatar} />

      <View style={styles.identity}>
        <Text numberOfLines={1} style={styles.name}>
          {friend.displayName}
        </Text>
        <Text numberOfLines={1} style={styles.username}>
          @{friend.username}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {friend.email}
        </Text>
      </View>

      <Pressable
        accessibilityLabel={`Open ${friend.displayName} profile`}
        accessibilityRole="button"
        onPress={() => onProfilePress?.(friend)}
        style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}
      >
        <MaterialCommunityIcons color={colors.navActive} name="account" size={22} />
      </Pressable>
    </View>
  );
}

function FriendsNoResults() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons color={colors.navActive} name="account-search-outline" size={34} />
      </View>
      <Text style={styles.emptyTitle}>No friends found</Text>
      <Text style={styles.emptySubtitle}>Try another name or username.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.two,
  },
  card: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
    borderRadius: radii.medium,
    borderColor: '#e6e8ef',
    borderWidth: borders.defaultWidth,
    backgroundColor: colors.surface,
    padding: spacing.two,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#e9edf2',
  },
  identity: {
    minWidth: 0,
    flex: 1,
    gap: 3,
  },
  name: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.extraBold,
  },
  username: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeights.medium,
  },
  meta: {
    color: colors.textSoft,
    fontSize: typography.compact,
    fontWeight: fontWeights.semiBold,
    paddingTop: spacing.compactGap,
  },
  profileButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: '#eee9ff',
  },
  pressed: {
    opacity: opacity.pressed,
  },
  emptyState: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.one,
    borderRadius: radii.medium,
    backgroundColor: colors.surface,
    padding: spacing.five,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    backgroundColor: '#eee9ff',
    marginBottom: spacing.two,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.extraBold,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});
