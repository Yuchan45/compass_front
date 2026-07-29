import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { AvatarImage } from '@/components/avatar-image';
import { AppText as Text } from '@/components/app-text';
import { useColorTheme } from '@/contexts/color-theme-context';
import { borders, fontWeights, opacity, radii, spacing, typography } from '@/constants/design';

export type FriendRequest = {
  avatarUrl: string | null;
  createdAt: string;
  email: string;
  id: string;
  displayName: string;
  updatedAt: string;
  username: string;
};

type FriendRequestsListProps = {
  onAccept: (id: string) => Promise<boolean>;
  onReject: (id: string) => Promise<boolean>;
  onResolved: (id: string) => void;
  requests: FriendRequest[];
};

export function FriendRequestsList({
  onAccept,
  onReject,
  onResolved,
  requests,
}: FriendRequestsListProps) {
  if (requests.length === 0) {
    return <RequestsEmptyState />;
  }

  return (
    <View style={styles.list}>
      {requests.map((request) => (
        <FriendRequestCard
          key={request.id}
          onAccept={() => onAccept(request.id)}
          onReject={() => onReject(request.id)}
          onResolved={() => onResolved(request.id)}
          request={request}
        />
      ))}
    </View>
  );
}

type FriendRequestCardProps = {
  onAccept: () => Promise<boolean>;
  onReject: () => Promise<boolean>;
  onResolved: () => void;
  request: FriendRequest;
};

function FriendRequestCard({ onAccept, onReject, onResolved, request }: FriendRequestCardProps) {
  const { colors } = useColorTheme();
  const [resolving, setResolving] = useState(false);
  const fadeValue = useRef(new Animated.Value(1)).current;

  async function resolveWithFade(onResolve: () => Promise<boolean>) {
    if (resolving) {
      return;
    }

    setResolving(true);
    const resolved = await onResolve();

    if (!resolved) {
      setResolving(false);
      return;
    }

    Animated.timing(fadeValue, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onResolved();
      }
    });
  }

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: fadeValue,
          shadowColor: colors.black,
          transform: [
            {
              scale: fadeValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.96, 1],
              }),
            },
            {
              translateY: fadeValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-8, 0],
              }),
            },
          ],
        },
      ]}
    >
      <AvatarImage
        avatarUrl={request.avatarUrl}
        style={[styles.avatar, { backgroundColor: colors.primarySoft }]}
      />

      <View style={styles.identity}>
        <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
          {request.displayName}
        </Text>
        <Text numberOfLines={1} style={[styles.username, { color: colors.muted }]}>
          @{request.username}
        </Text>
        <Text numberOfLines={1} style={[styles.email, { color: colors.muted }]}>
          {request.email}
        </Text>
      </View>

      <View style={styles.actions}>
        <ActionButton
          accessibilityLabel={`Reject ${request.displayName}`}
          disabled={resolving}
          icon="close"
          label="Reject"
          onPress={() => resolveWithFade(onReject)}
          variant="secondary"
        />
        <ActionButton
          accessibilityLabel={`Accept ${request.displayName}`}
          disabled={resolving}
          icon="check"
          label="Accept"
          onPress={() => resolveWithFade(onAccept)}
          variant="primary"
        />
      </View>
    </Animated.View>
  );
}

type ActionButtonProps = {
  accessibilityLabel: string;
  disabled?: boolean;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  variant: 'primary' | 'secondary';
};

function ActionButton({
  accessibilityLabel,
  disabled = false,
  icon,
  label,
  onPress,
  variant,
}: ActionButtonProps) {
  const { colors } = useColorTheme();
  const primary = variant === 'primary';

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View
        style={[
          styles.actionIcon,
          { backgroundColor: primary ? colors.navActive : colors.primarySoft },
        ]}
      >
        <MaterialCommunityIcons
          color={primary ? colors.surface : colors.muted}
          name={icon}
          size={20}
        />
      </View>
      <Text style={[styles.actionLabel, { color: primary ? colors.navActive : colors.muted }]}>
        {label}
      </Text>
    </Pressable>
  );
}

function RequestsEmptyState() {
  const { colors } = useColorTheme();

  return (
    <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.primarySoft }]}>
        <MaterialCommunityIcons color={colors.navActive} name="account-check-outline" size={34} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No friend requests</Text>
      <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
        Pending requests will appear here.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.two,
  },
  card: {
    minHeight: 104,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
    borderRadius: radii.medium,
    borderWidth: borders.defaultWidth,
    padding: spacing.two,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  email: {
    fontSize: typography.compact,
    fontWeight: fontWeights.semiBold,
    paddingTop: spacing.compactGap,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.one,
  },
  action: {
    width: 50,
    alignItems: 'center',
    gap: spacing.compactGap,
  },
  actionIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  actionLabel: {
    fontSize: typography.compact,
    fontWeight: fontWeights.extraBold,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  disabled: {
    opacity: opacity.disabled,
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
