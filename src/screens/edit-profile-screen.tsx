import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AvatarImage } from '@/components/avatar-image';
import { AppText as Text } from '@/components/app-text';
import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
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
import { useColorTheme } from '@/contexts/color-theme-context';
import { getAvatarPresetsRequest } from '@/services/api/avatars';
import type { AvatarPreset } from '@/types/avatars';

export function EditProfileScreen() {
  const { error, loading, session, updateProfile } = useAuth();
  const { colors: themeColors } = useColorTheme();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState(session?.user.avatarUrl ?? '');
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);
  const [avatarPresets, setAvatarPresets] = useState<AvatarPreset[]>([]);
  const [avatarPresetsError, setAvatarPresetsError] = useState<string | null>(null);
  const [avatarPresetsLoading, setAvatarPresetsLoading] = useState(false);
  const [avatarPresetsRetryKey, setAvatarPresetsRetryKey] = useState(0);
  const [displayName, setDisplayName] = useState(session?.user.displayName ?? '');
  const [localError, setLocalError] = useState<string | null>(null);
  const [username, setUsername] = useState(session?.user.username ?? '');

  const user = session?.user;
  const nextAvatarUrl = avatarUrl.trim();
  const nextDisplayName = displayName.trim();
  const nextUsername = username.trim();
  const displayNameValidation = getDisplayNameValidation(displayName);
  const usernameValidation = getUsernameValidation(username);
  const avatarPayload = nextAvatarUrl || null;
  const hasChanges =
    !!user &&
    (nextDisplayName !== user.displayName ||
      nextUsername !== user.username ||
      avatarPayload !== user.avatarUrl);
  const hasInvalidProfileFields = !displayNameValidation.valid || !usernameValidation.valid;
  const visibleError = localError ?? error;

  const loadAvatarPresets = useCallback(() => {
    if (!avatarModalVisible || avatarPresets.length > 0) {
      return;
    }

    let cancelled = false;

    setAvatarPresetsLoading(true);
    setAvatarPresetsError(null);

    getAvatarPresetsRequest()
      .then((response) => {
        if (!cancelled) {
          setAvatarPresets(response.data);
        }
      })
      .catch((caughtError: unknown) => {
        if (!cancelled) {
          setAvatarPresets([]);
          setAvatarPresetsError(
            caughtError instanceof Error ? caughtError.message : 'Could not load avatars.',
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setAvatarPresetsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [avatarModalVisible, avatarPresets.length]);

  useEffect(() => loadAvatarPresets(), [avatarPresetsRetryKey, loadAvatarPresets]);

  if (!session || !user) {
    return null;
  }

  function returnToProfile() {
    router.replace('/profile');
  }

  async function submitProfile() {
    if (hasInvalidProfileFields) {
      setLocalError('Complete the highlighted fields before saving.');
      return;
    }

    setLocalError(null);

    const updated = await updateProfile({
      avatarUrl: avatarPayload,
      displayName: nextDisplayName,
      username: nextUsername,
    });

    if (updated) {
      returnToProfile();
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.keyboardView, { backgroundColor: themeColors.background }]}
    >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
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
                style={({ pressed }) => [
                  styles.iconButton,
                  { backgroundColor: themeColors.surface },
                  pressed && styles.pressed,
                ]}
              >
                <MaterialCommunityIcons color={themeColors.text} name="arrow-left" size={26} />
              </Pressable>

              <View style={styles.headerText}>
                <Text style={[styles.title, { color: themeColors.text }]}>Edit Profile</Text>
                <Text numberOfLines={1} style={[styles.subtitle, { color: themeColors.muted }]}>
                  @{nextUsername || user.username}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.preview,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <Pressable
                accessibilityLabel="Change profile avatar"
                accessibilityRole="button"
                onPress={() => setAvatarModalVisible(true)}
                style={({ pressed }) => [styles.avatarButton, pressed && styles.pressed]}
              >
                <AvatarImage
                  avatarUrl={nextAvatarUrl}
                  style={[styles.avatar, { backgroundColor: themeColors.primarySoft }]}
                />
                <View
                  style={[
                    styles.avatarEditBadge,
                    {
                      backgroundColor: themeColors.navActive,
                      borderColor: themeColors.surface,
                    },
                  ]}
                >
                  <MaterialCommunityIcons color={themeColors.surface} name="pencil" size={15} />
                </View>
              </Pressable>
              <View style={styles.previewIdentity}>
                <Text numberOfLines={1} style={[styles.previewName, { color: themeColors.text }]}>
                  {nextDisplayName || user.displayName}
                </Text>
                <Text numberOfLines={1} style={[styles.previewEmail, { color: themeColors.muted }]}>
                  @{nextUsername || user.username}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.form,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <TextField
                autoCapitalize="words"
                label="Display name"
                onChangeText={setDisplayName}
                placeholder="Your name"
                validationMessage={displayNameValidation.message}
                validationState={displayNameValidation.state}
                value={displayName}
              />
              <TextField
                autoCapitalize="none"
                autoComplete="username"
                label="Username"
                onChangeText={setUsername}
                placeholder="yu_nakasone"
                validationMessage={usernameValidation.message}
                validationState={usernameValidation.state}
                value={username}
              />
              <Pressable
                accessibilityLabel="Choose profile avatar"
                accessibilityRole="button"
                onPress={() => setAvatarModalVisible(true)}
                style={({ pressed }) => [
                  styles.avatarField,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border,
                  },
                  pressed && styles.pressed,
                ]}
              >
                <View>
                  <Text style={[styles.avatarFieldLabel, { color: themeColors.text }]}>Avatar</Text>
                  <Text style={[styles.avatarFieldValue, { color: themeColors.muted }]}>
                    {avatarUrl ? 'Preset selected' : 'Tap your profile image to choose an avatar'}
                  </Text>
                </View>
                <MaterialCommunityIcons color={themeColors.muted} name="chevron-right" size={24} />
              </Pressable>

              {visibleError && (
                <Text style={[styles.error, { color: themeColors.danger }]}>{visibleError}</Text>
              )}

              <View style={styles.actions}>
                <Button
                  disabled={!hasChanges || hasInvalidProfileFields || loading}
                  loading={loading}
                  onPress={submitProfile}
                >
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
      <AvatarPickerModal
        currentAvatarUrl={avatarPayload}
        error={avatarPresetsError}
        loading={avatarPresetsLoading}
        onClose={() => setAvatarModalVisible(false)}
        onRetry={() => {
          setAvatarPresets([]);
          setAvatarPresetsError(null);
          setAvatarPresetsRetryKey((currentKey) => currentKey + 1);
        }}
        onSelect={(preset) => {
          setAvatarUrl(preset.url);
          setAvatarModalVisible(false);
        }}
        presets={avatarPresets}
        visible={avatarModalVisible}
      />
    </KeyboardAvoidingView>
  );
}

type AvatarPickerModalProps = {
  currentAvatarUrl: string | null;
  error: string | null;
  loading: boolean;
  onClose: () => void;
  onRetry: () => void;
  onSelect: (preset: AvatarPreset) => void;
  presets: AvatarPreset[];
  visible: boolean;
};

function AvatarPickerModal({
  currentAvatarUrl,
  error,
  loading,
  onClose,
  onRetry,
  onSelect,
  presets,
  visible,
}: AvatarPickerModalProps) {
  const { colors: themeColors } = useColorTheme();

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <Pressable accessibilityLabel="Close avatar picker" onPress={onClose} style={styles.backdrop}>
        <Pressable
          accessibilityRole="none"
          onPress={(event) => event.stopPropagation()}
          style={[styles.modal, { backgroundColor: themeColors.background }]}
        >
          <View style={styles.modalHeader}>
            <View>
              <Text style={[styles.modalTitle, { color: themeColors.text }]}>Choose Avatar</Text>
              <Text style={[styles.modalSubtitle, { color: themeColors.muted }]}>
                {presets.length} available presets
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Close avatar picker"
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [
                styles.modalCloseButton,
                { backgroundColor: themeColors.surface },
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons color={themeColors.text} name="close" size={22} />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.modalState}>
              <ActivityIndicator color={themeColors.navActive} />
              <Text style={[styles.modalStateText, { color: themeColors.muted }]}>
                Loading avatars...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.modalState}>
              <Text style={[styles.modalErrorText, { color: themeColors.danger }]}>{error}</Text>
              <Button onPress={onRetry} variant="secondary">
                Retry
              </Button>
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={styles.avatarGrid}
              showsVerticalScrollIndicator={false}
            >
              {presets.map((preset) => {
                const selected = preset.url === currentAvatarUrl;

                return (
                  <Pressable
                    accessibilityLabel={`Select ${preset.style} avatar`}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    key={preset.id}
                    onPress={() => onSelect(preset)}
                    style={({ pressed }) => [
                      styles.avatarOption,
                      {
                        backgroundColor: themeColors.surface,
                        borderColor: selected ? themeColors.navActive : themeColors.border,
                        borderWidth: selected ? 2 : borders.defaultWidth,
                      },
                      pressed && styles.pressed,
                    ]}
                  >
                    <Image
                      accessibilityIgnoresInvertColors
                      source={{ uri: preset.url }}
                      style={styles.avatarOptionImage}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

type ValidationState = 'default' | 'error' | 'success';

type ValidationResult = {
  message: string | null;
  state: ValidationState;
  valid: boolean;
};

function getDisplayNameValidation(value: string): ValidationResult {
  const displayName = value.trim();

  if (!displayName) {
    return validationError('Enter a display name.');
  }

  if (displayName.length > 80) {
    return validationError('Keep display name under 80 characters.');
  }

  return validationSuccess;
}

function getUsernameValidation(value: string): ValidationResult {
  const username = value.trim();

  if (!username) {
    return validationError('Choose username between 3-30 characters.');
  }

  if (username.length < 3 || username.length > 30) {
    return validationError('Choose username between 3-30 characters.');
  }

  if (username !== username.toLowerCase()) {
    return validationError('Must be all lowercase.');
  }

  if (!/^[a-z0-9_.]+$/.test(username)) {
    return validationError('Can only include letters, numbers, dots, or underscores.');
  }

  return validationSuccess;
}

const validationSuccess: ValidationResult = {
  message: null,
  state: 'success',
  valid: true,
};

function validationError(message: string): ValidationResult {
  return {
    message,
    state: 'error',
    valid: false,
  };
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
  avatarButton: {
    width: 78,
    height: 78,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderColor: colors.surface,
    borderWidth: 2,
    backgroundColor: colors.navActive,
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
  avatarField: {
    minHeight: dimensions.inputMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.two,
    borderRadius: radii.medium,
    borderColor: colors.border,
    borderWidth: borders.defaultWidth,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.three,
    paddingVertical: spacing.two,
  },
  avatarFieldLabel: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.bold,
  },
  avatarFieldValue: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium,
  },
  error: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: fontWeights.bold,
  },
  actions: {
    gap: spacing.two,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.36)',
  },
  modal: {
    maxHeight: '78%',
    gap: spacing.three,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.three,
    paddingTop: spacing.three,
    paddingBottom: spacing.four,
  },
  modalHeader: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.two,
  },
  modalTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.extraBold,
  },
  modalSubtitle: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeights.medium,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  modalState: {
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.two,
  },
  modalStateText: {
    color: colors.muted,
    fontSize: typography.small,
    fontWeight: fontWeights.semiBold,
  },
  modalErrorText: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.two,
    paddingBottom: spacing.two,
  },
  avatarOption: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderColor: colors.border,
    borderWidth: borders.defaultWidth,
    backgroundColor: colors.surface,
  },
  avatarOptionSelected: {
    borderColor: colors.navActive,
    borderWidth: 2,
  },
  avatarOptionImage: {
    width: 56,
    height: 56,
    borderRadius: 16,
  },
});
