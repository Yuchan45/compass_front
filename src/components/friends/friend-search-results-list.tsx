import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AvatarImage } from '@/components/avatar-image';
import { AppText as Text } from '@/components/app-text';
import { borders, fontWeights, radii, spacing, typography } from '@/constants/design';
import { useColorTheme } from '@/contexts/color-theme-context';
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
  const { colors } = useColorTheme();
  const relationshipLabel = getRelationshipLabel(result.relationship);
  const canAddFriend = !result.relationship && onAddFriend;

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
        avatarUrl={result.profile.avatarUrl}
        style={[styles.avatar, { backgroundColor: colors.primarySoft }]}
      />

      <View style={styles.identity}>
        <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
          {result.profile.displayName}
        </Text>
        <Text numberOfLines={1} style={[styles.username, { color: colors.muted }]}>
          @{result.profile.username}
        </Text>
        <Text numberOfLines={1} style={[styles.meta, { color: colors.textSoft }]}>
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
            { backgroundColor: colors.navActive },
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
        <View style={[styles.statusPill, { backgroundColor: colors.primarySoft }]}>
          <Text numberOfLines={1} style={[styles.statusText, { color: colors.navActive }]}>
            {relationshipLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function SearchNoResults() {
  const { colors } = useColorTheme();

  return (
    <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
        <MaterialCommunityIcons color={colors.navActive} name="account-search-outline" size={34} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No users found</Text>
      <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
        Try another name, username, or email.
      </Text>
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
  statusPill: {
    maxWidth: 112,
    borderRadius: 999,
    paddingHorizontal: spacing.two,
    paddingVertical: spacing.one,
  },
  statusText: {
    fontSize: typography.compact,
    fontWeight: fontWeights.extraBold,
  },
  addButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
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
