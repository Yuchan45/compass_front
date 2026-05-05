import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { API_BASE_URL } from '@/config/api';
import { colors, radii, spacing, typography } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';

type AuthMode = 'login' | 'register';

export function AuthScreen() {
  const { booting, error, loading, login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [languageId, setLanguageId] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const isRegister = mode === 'register';

  async function submit() {
    if (isRegister) {
      await register({
        displayName,
        email,
        languageId: languageId || undefined,
        password,
        username,
      });
      return;
    }

    await login({ identifier, password });
  }

  function toggleMode() {
    setMode(isRegister ? 'login' : 'register');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <Screen>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Compass</Text>
          <Text style={styles.title}>{isRegister ? 'Crear cuenta' : 'Iniciar sesion'}</Text>
          <Text style={styles.subtitle}>{API_BASE_URL}</Text>
        </View>

        <View style={styles.panel}>
          <View style={styles.segmentedControl}>
            <Button onPress={() => setMode('login')} variant={isRegister ? 'quiet' : 'secondary'}>
              Login
            </Button>
            <Button
              onPress={() => setMode('register')}
              variant={isRegister ? 'secondary' : 'quiet'}
            >
              Registro
            </Button>
          </View>

          <View style={styles.fields}>
            {isRegister ? (
              <>
                <TextField
                  autoComplete="email"
                  keyboardType="email-address"
                  label="Email"
                  onChangeText={setEmail}
                  placeholder="user@example.com"
                  value={email}
                />
                <TextField
                  autoComplete="username"
                  label="Username"
                  onChangeText={setUsername}
                  placeholder="user_123"
                  value={username}
                />
                <TextField
                  autoCapitalize="words"
                  label="Display name"
                  onChangeText={setDisplayName}
                  placeholder="User One"
                  value={displayName}
                />
                <TextField
                  keyboardType="number-pad"
                  label="Language ID"
                  onChangeText={setLanguageId}
                  placeholder="Opcional"
                  value={languageId}
                />
              </>
            ) : (
              <TextField
                autoComplete="username"
                label="Email o username"
                onChangeText={setIdentifier}
                placeholder="user@example.com"
                value={identifier}
              />
            )}

            <TextField
              autoComplete="password"
              label="Password"
              onChangeText={setPassword}
              placeholder="secret123"
              secureTextEntry
              value={password}
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <Button disabled={booting} loading={loading || booting} onPress={submit}>
            {isRegister ? 'Crear cuenta' : 'Entrar'}
          </Button>

          <Button onPress={toggleMode} variant="quiet">
            {isRegister ? 'Ya tengo cuenta' : 'Crear una cuenta'}
          </Button>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  header: {
    marginBottom: spacing.five,
    gap: spacing.one,
  },
  eyebrow: {
    color: colors.secondary,
    fontSize: typography.small,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: colors.text,
    fontSize: typography.title,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: typography.small,
  },
  panel: {
    gap: spacing.four,
    padding: spacing.four,
    borderRadius: radii.medium,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  segmentedControl: {
    flexDirection: 'row',
    gap: spacing.two,
  },
  fields: {
    gap: spacing.three,
  },
  error: {
    color: colors.danger,
    fontSize: typography.small,
    fontWeight: '700',
  },
});
