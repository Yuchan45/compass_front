import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText as Text } from '@/components/app-text';
import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { commonImages } from '@/constants/assets';
import {
  borders,
  colors,
  dimensions,
  fontWeights,
  opacity,
  radii,
  spacing,
  typography,
} from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';

export function EditProfileScreen() {
  const { error, loading, session, updateProfile } = useAuth();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(session?.user.avatarUrl ?? '');
  const [displayName, setDisplayName] = useState(session?.user.displayName ?? '');
  const [localError, setLocalError] = useState<string | null>(null);

  if (!session) {
    return null;
  }

  const { user } = session;
  const nextAvatarUrl = avatarUrl.trim();
  const nextDisplayName = displayName.trim();
  const avatarSource: ImageSourcePropType = nextAvatarUrl
    ? { uri: nextAvatarUrl }
    : commonImages.defaultProfile;
  const avatarPayload = nextAvatarUrl || null;
  const hasChanges = nextDisplayName !== user.displayName || avatarPayload !== user.avatarUrl;
  const visibleError = localError ?? error;

  function returnToProfile() {
    router.replace('/profile');
  }

  async function submitProfile() {
    if (!nextDisplayName) {
      setLocalError('Enter a display name.');
      return;
    }

    setLocalError(null);

    const updated = await updateProfile({
      avatarUrl: avatarPayload,
      displayName: nextDisplayName,
    });

    if (updated) {
      returnToProfile();
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <Pressable
                accessibilityLabel="Back to profile"
                accessibilityRole="button"
                onPress={returnToProfile}
                style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
              >
                <MaterialCommunityIcons color={colors.text} name="arrow-left" size={26} />
              </Pressable>

              <View style={styles.headerText}>
                <Text style={styles.title}>Edit Profile</Text>
                <Text numberOfLines={1} style={styles.subtitle}>
                  @{user.username}
                </Text>
              </View>
            </View>

            <View style={styles.preview}>
              <Image accessibilityIgnoresInvertColors source={avatarSource} style={styles.avatar} />
              <View style={styles.previewIdentity}>
                <Text numberOfLines={1} style={styles.previewName}>
                  {nextDisplayName || user.displayName}
                </Text>
                <Text numberOfLines={1} style={styles.previewEmail}>
                  {user.email}
                </Text>
              </View>
            </View>

            <View style={styles.form}>
              <TextField
                autoCapitalize="words"
                label="Display name"
                onChangeText={setDisplayName}
                placeholder="Your name"
                value={displayName}
              />
              <TextField
                autoCapitalize="none"
                label="Avatar URL"
                onChangeText={setAvatarUrl}
                placeholder="https://example.com/avatar.png"
                value={avatarUrl}
              />

              {visibleError && <Text style={styles.error}>{visibleError}</Text>}

              <View style={styles.actions}>
                <Button disabled={!hasChanges || loading} loading={loading} onPress={submitProfile}>
                  Save
                </Button>
                <Button disabled={loading} onPress={returnToProfile} variant="secondary">
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.four,
    paddingVertical: spacing.three,
  },
  container: {
    width: '100%',
    maxWidth: dimensions.appMaxWidth,
    alignSelf: 'center',
    gap: spacing.four,
  },
  header: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.surface,
  },
  pressed: {
    opacity: opacity.pressed,
  },
  headerText: {
    minWidth: 0,
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: fontWeights.extraBold,
  },
  subtitle: {
    color: colors.muted,
    fontSize: typography.small,
  },
  preview: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.three,
    borderRadius: radii.medium,
    borderColor: colors.border,
    borderWidth: borders.defaultWidth,
    backgroundColor: colors.surface,
    padding: spacing.three,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.primarySoft,
  },
  previewIdentity: {
    minWidth: 0,
    flex: 1,
    gap: spacing.one,
  },
  previewName: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.extraBold,
  },
  previewEmail: {
    color: colors.muted,
    fontSize: typography.small,
  },
  form: {
    gap: spacing.three,
    borderRadius: radii.medium,
    borderColor: colors.border,
    borderWidth: borders.defaultWidth,
    backgroundColor: colors.surface,
    padding: spacing.four,
  },
  error: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: fontWeights.bold,
  },
  actions: {
    gap: spacing.two,
  },
});
