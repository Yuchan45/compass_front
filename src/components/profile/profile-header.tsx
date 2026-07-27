import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AvatarImage } from '@/components/avatar-image';
import { AppText as Text } from '@/components/app-text';
import { colors, fontWeights, opacity, spacing, typography } from '@/constants/design';

type ProfileHeaderProps = {
  actionsVisible?: boolean;
  avatarUrl: string | null;
  displayName: string;
  email: string;
  onEditPress?: () => void;
  onSettingsPress?: () => void;
  username: string;
};

type HeaderIconButtonProps = {
  accessibilityLabel: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
};

export function ProfileHeader({
  actionsVisible = true,
  avatarUrl,
  displayName,
  email,
  onEditPress,
  onSettingsPress,
  username,
}: ProfileHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.hero}>
        <View style={styles.avatarFrame}>
          <AvatarImage avatarUrl={avatarUrl} style={styles.avatar} />
        </View>

        {actionsVisible ? (
          <View style={styles.actionStack}>
            <HeaderIconButton accessibilityLabel="Settings" icon="cog" onPress={onSettingsPress} />
            <HeaderIconButton
              accessibilityLabel="Edit profile"
              icon="pencil"
              onPress={onEditPress}
            />
            <HeaderIconButton accessibilityLabel="Open chat" icon="chat-processing" />
          </View>
        ) : null}

        <MapPreview />
      </View>

      <View style={styles.identity}>
        <View style={styles.nameRow}>
          <Text numberOfLines={1} style={styles.name}>
            {displayName}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>online</Text>
          </View>
        </View>
        <Text numberOfLines={1} style={styles.username}>
          @{username}
        </Text>
        <Text numberOfLines={1} style={styles.email}>
          {email}
        </Text>
      </View>
    </View>
  );
}

function HeaderIconButton({ accessibilityLabel, icon, onPress }: HeaderIconButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons color={colors.blackSoft} name={icon} size={30} />
    </Pressable>
  );
}

function MapPreview() {
  return <View accessibilityLabel="Map preview" style={styles.mapPreview} />;
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.two,
  },
  hero: {
    minHeight: 326,
    overflow: 'hidden',
  },
  avatarFrame: {
    position: 'absolute',
    top: '-18%',
    left: '-18%',
    width: 380,
    height: 380,
    overflow: 'hidden',
    borderRadius: 190,
    backgroundColor: '#c8def8',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionStack: {
    position: 'absolute',
    top: spacing.one,
    right: spacing.one,
    gap: spacing.three,
    alignItems: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: opacity.pressed,
  },
  mapPreview: {
    position: 'absolute',
    right: 30,
    bottom: 24,
    width: 96,
    height: 96,
    overflow: 'hidden',
    borderRadius: 48,
    borderColor: colors.whiteAlpha90,
    borderWidth: 2,
    backgroundColor: colors.surface,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 5,
  },
  identity: {
    gap: 2,
    paddingLeft: spacing.two + spacing.three,
    paddingRight: spacing.two,
  },
  nameRow: {
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
  },
  name: {
    maxWidth: '76%',
    color: colors.text,
    fontSize: 26,
    fontWeight: fontWeights.extraBold,
  },
  statusBadge: {
    borderRadius: 999,
    backgroundColor: '#dcf9df',
    paddingHorizontal: spacing.two,
    paddingVertical: 3,
  },
  statusText: {
    color: '#12a646',
    fontSize: typography.caption,
    fontWeight: fontWeights.extraBold,
  },
  username: {
    color: colors.muted,
    fontSize: typography.small,
  },
  email: {
    color: colors.muted,
    fontSize: typography.caption,
  },
});
