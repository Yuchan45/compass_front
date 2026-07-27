import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AvatarImage } from '@/components/avatar-image';
import { AppText as Text } from '@/components/app-text';
import { borders, colors, fontWeights, radii, spacing, typography } from '@/constants/design';
import type { SearchUserResult } from '@/types/users';

type FriendSearchResultsListProps = {
  addingUserIds?: Set<string>;
  onAddFriend?: (userId: string) => void;
  results: SearchUserResult[];
};

export function FriendSearchResultsList({
  addingUserIds,
  onAddFriend,
  results,
}: FriendSearchResultsListProps) {
  if (results.length === 0) {
    return <SearchNoResults />;
  }

  return (
    <View style={styles.list}>
      {results.map((result) => (
        <SearchResultCard
          adding={addingUserIds?.has(result.profile.id) ?? false}
          key={result.profile.id}
          onAddFriend={onAddFriend}
          result={result}
        />
      ))}
    </View>
  );
}

type SearchResultCardProps = {
  adding: boolean;
  onAddFriend?: (userId: string) => void;
  result: SearchUserResult;
};

function SearchResultCard({ adding, onAddFriend, result }: SearchResultCardProps) {
  const relationshipLabel = getRelationshipLabel(result.relationship);
  const canAddFriend = !result.relationship && onAddFriend;

  return (
    <View style={styles.card}>
      <AvatarImage avatarUrl={result.profile.avatarUrl} style={styles.avatar} />

      <View style={styles.identity}>
        <Text numberOfLines={1} style={styles.name}>
          {result.profile.displayName}
        </Text>
        <Text numberOfLines={1} style={styles.username}>
          @{result.profile.username}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {result.mutualFriendsCount} mutual friends
        </Text>
      </View>

      {canAddFriend ? (
        <Pressable
          accessibilityLabel={`Add ${result.profile.displayName}`}
          accessibilityRole="button"
          disabled={adding}
          onPress={() => onAddFriend(result.profile.id)}
          style={({ pressed }) => [
            styles.addButton,
            adding && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          {adding ? (
            <ActivityIndicator color={colors.surface} size="small" />
          ) : (
            <MaterialCommunityIcons color={colors.surface} name="account-plus" size={18} />
          )}
        </Pressable>
      ) : relationshipLabel ? (
        <View style={styles.statusPill}>
          <Text numberOfLines={1} style={styles.statusText}>
            {relationshipLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function SearchNoResults() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons color={colors.navActive} name="account-search-outline" size={34} />
      </View>
      <Text style={styles.emptyTitle}>No users found</Text>
      <Text style={styles.emptySubtitle}>Try another name, username, or email.</Text>
    </View>
  );
}

function getRelationshipLabel(relationship: SearchUserResult['relationship']) {
  if (!relationship) {
    return null;
  }

  if (relationship.status === 'ACCEPTED') {
    return 'Friends';
  }

  if (relationship.status === 'PENDING') {
    return relationship.direction === 'received' ? 'Request received' : 'Pending';
  }

  if (relationship.status === 'DECLINED') {
    return 'Declined';
  }

  return 'Blocked';
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
  statusPill: {
    maxWidth: 112,
    borderRadius: 999,
    backgroundColor: '#eee9ff',
    paddingHorizontal: spacing.two,
    paddingVertical: spacing.one,
  },
  statusText: {
    color: colors.navActive,
    fontSize: typography.compact,
    fontWeight: fontWeights.extraBold,
  },
  addButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    backgroundColor: colors.navActive,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.78,
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
