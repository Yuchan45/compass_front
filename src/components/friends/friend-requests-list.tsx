import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

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
          opacity: fadeValue,
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
      <AvatarImage avatarUrl={request.avatarUrl} style={styles.avatar} />

      <View style={styles.identity}>
        <Text numberOfLines={1} style={styles.name}>
          {request.displayName}
        </Text>
        <Text numberOfLines={1} style={styles.username}>
          @{request.username}
        </Text>
        <Text numberOfLines={1} style={styles.email}>
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
      <View style={[styles.actionIcon, primary ? styles.primaryAction : styles.secondaryAction]}>
        <MaterialCommunityIcons
          color={primary ? colors.surface : colors.muted}
          name={icon}
          size={20}
        />
      </View>
      <Text style={[styles.actionLabel, primary && styles.primaryLabel]}>{label}</Text>
    </Pressable>
  );
}

function RequestsEmptyState() {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <MaterialCommunityIcons color={colors.navActive} name="account-check-outline" size={34} />
      </View>
      <Text style={styles.emptyTitle}>No friend requests</Text>
      <Text style={styles.emptySubtitle}>Pending requests will appear here.</Text>
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
    borderColor: '#e6e8ef',
    borderWidth: borders.defaultWidth,
    backgroundColor: colors.surface,
    padding: spacing.two,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
  email: {
    color: colors.muted,
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
  primaryAction: {
    backgroundColor: colors.navActive,
  },
  secondaryAction: {
    backgroundColor: '#f1f2f7',
  },
  actionLabel: {
    color: colors.muted,
    fontSize: typography.compact,
    fontWeight: fontWeights.extraBold,
  },
  primaryLabel: {
    color: colors.navActive,
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
