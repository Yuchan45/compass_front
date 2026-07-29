import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AvatarImage } from '@/components/avatar-image';
import { AppText as Text } from '@/components/app-text';
import { useColorTheme } from '@/contexts/color-theme-context';
import { borders, fontWeights, opacity, radii, spacing, typography } from '@/constants/design';

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
  const { colors } = useColorTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.black,
        },
      ]}
    >
      <AvatarImage
        avatarUrl={friend.avatarUrl}
        style={[styles.avatar, { backgroundColor: colors.primarySoft }]}
      />

      <View style={styles.identity}>
        <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
          {friend.displayName}
        </Text>
        <Text numberOfLines={1} style={[styles.username, { color: colors.muted }]}>
          @{friend.username}
        </Text>
        <Text numberOfLines={1} style={[styles.meta, { color: colors.textSoft }]}>
          {friend.email}
        </Text>
      </View>

      <Pressable
        accessibilityLabel={`Open ${friend.displayName} profile`}
        accessibilityRole="button"
        onPress={() => onProfilePress?.(friend)}
        style={({ pressed }) => [
          styles.profileButton,
          { backgroundColor: colors.primarySoft },
          pressed && styles.pressed,
        ]}
      >
        <MaterialCommunityIcons color={colors.navActive} name="account" size={22} />
      </Pressable>
    </View>
  );
}

function FriendsNoResults() {
  const { colors } = useColorTheme();

  return (
    <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
        <MaterialCommunityIcons color={colors.navActive} name="account-search-outline" size={34} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No friends found</Text>
      <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
        Try another name or username.
      </Text>
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
    borderWidth: borders.defaultWidth,
    padding: spacing.two,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  identity: {
    minWidth: 0,
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: typography.small,
    fontWeight: fontWeights.extraBold,
  },
  username: {
    fontSize: typography.caption,
    fontWeight: fontWeights.medium,
  },
  meta: {
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
    padding: spacing.five,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 36,
    marginBottom: spacing.two,
  },
  emptyTitle: {
    fontSize: typography.body,
    fontWeight: fontWeights.extraBold,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: typography.small,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});
