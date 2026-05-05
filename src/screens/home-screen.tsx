import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import {
  borders,
  colors,
  dimensions,
  fontWeights,
  radii,
  spacing,
  typography,
} from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';

export function HomeScreen() {
  const { error, loading, logout, refreshMe, session, updateProfile } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState(session?.user.avatarUrl ?? '');
  const [displayName, setDisplayName] = useState(session?.user.displayName ?? '');

  if (!session) {
    return null;
  }

  const { user } = session;

  async function submitProfile() {
    await updateProfile({
      avatarUrl: avatarUrl || null,
      displayName,
    });
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Compass</Text>
        <Text style={styles.title}>{user.displayName}</Text>
        <Text style={styles.subtitle}>@{user.username}</Text>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Email</Text>
          <Text style={styles.summaryValue}>{user.email}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Role</Text>
          <Text style={styles.roleBadge}>{user.roleCode}</Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionTitle}>Perfil</Text>
        <TextField label="Display name" onChangeText={setDisplayName} value={displayName} />
        <TextField
          autoCapitalize="none"
          label="Avatar URL"
          onChangeText={setAvatarUrl}
          placeholder="https://example.com/avatar.png"
          value={avatarUrl}
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <Button loading={loading} onPress={submitProfile}>
          Guardar perfil
        </Button>
        <Button loading={loading} onPress={refreshMe} variant="secondary">
          Refrescar
        </Button>
        <Button onPress={logout} variant="quiet">
          Cerrar sesion
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.four,
    gap: spacing.one,
  },
  eyebrow: {
    color: colors.secondary,
    fontSize: typography.small,
    fontWeight: fontWeights.extraBold,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: fontWeights.extraBold,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: typography.body,
  },
  summary: {
    gap: spacing.two,
    marginBottom: spacing.four,
  },
  summaryItem: {
    minHeight: dimensions.summaryItemMinHeight,
    justifyContent: 'center',
    gap: spacing.one,
    borderRadius: radii.medium,
    borderColor: colors.border,
    borderWidth: borders.defaultWidth,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.three,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeights.extraBold,
    textTransform: 'uppercase',
  },
  summaryValue: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.bold,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    color: colors.primary,
    backgroundColor: colors.primarySoft,
    borderRadius: radii.small,
    fontSize: typography.caption,
    fontWeight: fontWeights.extraBold,
    overflow: 'hidden',
    paddingHorizontal: spacing.two,
    paddingVertical: spacing.one,
  },
  panel: {
    gap: spacing.three,
    borderRadius: radii.medium,
    borderColor: colors.border,
    borderWidth: borders.defaultWidth,
    backgroundColor: colors.surface,
    padding: spacing.four,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: fontWeights.extraBold,
  },
  error: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: fontWeights.bold,
  },
});
