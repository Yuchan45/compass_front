import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AvatarImage } from '@/components/avatar-image';
import { AppText as Text } from '@/components/app-text';
import { fontWeights, opacity, spacing, typography } from '@/constants/design';
import { useColorTheme } from '@/contexts/color-theme-context';

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
  const { colors: themeColors } = useColorTheme();

  return (
    <View style={styles.header}>
      <View style={styles.hero}>
        <View
          style={[
            styles.avatarFrame,
            {
              shadowColor: themeColors.black,
            },
          ]}
        >
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
          <Text numberOfLines={1} style={[styles.name, { color: themeColors.text }]}>
            {displayName}
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>online</Text>
          </View>
        </View>
        <Text numberOfLines={1} style={[styles.username, { color: themeColors.muted }]}>
          @{username}
        </Text>
        <Text numberOfLines={1} style={[styles.email, { color: themeColors.muted }]}>
          {email}
        </Text>
      </View>
    </View>
  );
}

function HeaderIconButton({ accessibilityLabel, icon, onPress }: HeaderIconButtonProps) {
  const { colors: themeColors } = useColorTheme();

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons color={themeColors.text} name={icon} size={30} />
    </Pressable>
  );
}

function MapPreview() {
  const { colors: themeColors } = useColorTheme();

  return (
    <View
      accessibilityLabel="Map preview"
      style={[
        styles.mapPreview,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.whiteAlpha90,
          shadowColor: themeColors.black,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.two,
  },
  hero: {
    minHeight: 345,
    overflow: 'hidden',
  },
  avatarFrame: {
    position: 'absolute',
    top: '-18%',
    left: '-18%',
    width: 380,
    height: 380,
    overflow: 'hidden',
    // borderBottomLeftRadius: 190,
    borderBottomRightRadius: 190,
    borderTopLeftRadius: 190,
    borderTopRightRadius: 190,
    backgroundColor: '#c8def8',
    shadowOffset: { width: 14, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
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
    left: 198,
    bottom: 18,
    width: 115,
    height: 115,
    overflow: 'hidden',
    borderRadius: 58,
    borderWidth: 4,
    shadowOffset: { width: 8, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 7,
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
    fontSize: typography.small,
  },
  email: {
    fontSize: typography.caption,
  },
});
