import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthRequestPromptOptions, AuthSessionResult } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText as Text, AppTextInput as TextInput } from '@/components/app-text';
import { brandImages, externalImages } from '@/constants/assets';
import { authTheme, borders } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';
import { googleAuthPopupWindowName } from '@/utils/google-auth-popup';

type AuthMode = 'entry' | 'login' | 'register';
type ButtonVariant = 'primary' | 'outline' | 'link';

const googleClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID?.trim() ?? '';
const authColors = authTheme.colors;
const authDimensions = authTheme.dimensions;
const authFontWeights = authTheme.fontWeights;
const authLineHeights = authTheme.lineHeights;
const authOpacity = authTheme.opacity;
const authRadii = authTheme.radii;
const authSpacing = authTheme.spacing;
const authTypography = authTheme.typography;

export function AuthScreen() {
  const { booting, error, googleLogin, loading, login, register } = useAuth();
  const [mode, setMode] = useState<AuthMode>('entry');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const googleLoginRef = useRef(googleLogin);
  const handledGoogleResponseKeyRef = useRef<string | null>(null);
  const [googleRequest, googleResponse, promptGoogleAuth] = Google.useIdTokenAuthRequest({
    clientId: googleClientId,
    scopes: ['openid', 'profile', 'email'],
    selectAccount: true,
    webClientId: googleClientId,
  });

  const isRegister = mode === 'register';
  const googleAuthConfigured = googleClientId.length > 0;
  const visibleError = localError ?? error;

  useEffect(() => {
    googleLoginRef.current = googleLogin;
  }, [googleLogin]);

  useEffect(() => {
    if (!googleResponse) {
      return;
    }

    const responseKey = getGoogleResponseKey(googleResponse);

    if (handledGoogleResponseKeyRef.current === responseKey) {
      return;
    }

    handledGoogleResponseKeyRef.current = responseKey;

    async function completeGoogleLogin() {
      if (googleResponse?.type === 'success') {
        const idToken = googleResponse.params.id_token ?? googleResponse.authentication?.idToken;

        if (!idToken) {
          setLocalError('Google did not return an ID token.');
          return;
        }

        setLocalError(null);
        await googleLoginRef.current({ idToken });
        return;
      }

      if (googleResponse?.type === 'error') {
        setLocalError(getGoogleAuthErrorMessage(googleResponse));
      }
    }

    void completeGoogleLogin();
  }, [googleResponse]);

  function changeMode(nextMode: AuthMode) {
    setLocalError(null);
    setMode(nextMode);
  }

  async function submitLogin() {
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier || loginPassword.length < 8) {
      setLocalError('Enter your email and a password with at least 8 characters.');
      return;
    }

    setLocalError(null);
    await login({
      identifier: trimmedIdentifier,
      password: loginPassword,
    });
  }

  async function submitRegister() {
    const email = registerEmail.trim().toLowerCase();

    if (!email || registerPassword.length < 8) {
      setLocalError('Enter your email and a password with at least 8 characters.');
      return;
    }

    if (registerPassword !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    setLocalError(null);
    await register({
      displayName: getDisplayNameFromEmail(email),
      email,
      password: registerPassword,
      username: getUsernameFromEmail(email),
    });
  }

  async function submitGoogle() {
    if (!googleAuthConfigured) {
      setLocalError('Google login is not configured.');
      return;
    }

    setLocalError(null);

    try {
      await promptGoogleAuth(getGooglePromptOptions());
    } catch (caughtError) {
      setLocalError(
        caughtError instanceof Error ? caughtError.message : 'Could not open Google login.',
      );
    }
  }

  function showUnavailableGuestMessage() {
    setLocalError('Guest access is not available yet.');
  }

  function showUnavailablePasswordMessage() {
    setLocalError('Password recovery is not available yet.');
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}
    >
      <LinearGradient colors={authColors.backgroundGradient} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            style={styles.scrollView}
          >
            {mode === 'entry' ? (
              <EntryPoint
                error={localError}
                onContinueAsGuest={showUnavailableGuestMessage}
                onLogin={() => changeMode('login')}
                onRegister={() => changeMode('register')}
              />
            ) : (
              <View style={styles.formShell}>
                <View style={styles.heading}>
                  <Text style={styles.headingTitle}>
                    {isRegister ? 'Create Account' : 'Welcome,'}
                  </Text>
                  <Text style={styles.headingSubtitle}>
                    {isRegister ? 'to get started now!' : 'Glad to see you!'}
                  </Text>
                </View>

                <View style={styles.form}>
                  {isRegister ? (
                    <>
                      <AuthField
                        accessibilityLabel="Email Address"
                        autoComplete="email"
                        keyboardType="email-address"
                        onChangeText={setRegisterEmail}
                        placeholder="Email Address"
                        value={registerEmail}
                      />
                      <AuthField
                        accessibilityLabel="Password"
                        autoComplete="password"
                        onChangeText={setRegisterPassword}
                        placeholder="Password"
                        rightContent={
                          <PasswordToggle
                            onPress={() => setShowRegisterPassword((current) => !current)}
                            visible={showRegisterPassword}
                          />
                        }
                        secureTextEntry={!showRegisterPassword}
                        value={registerPassword}
                      />
                      <AuthField
                        accessibilityLabel="Confirm Password"
                        autoComplete="password"
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm Password"
                        rightContent={
                          <PasswordToggle
                            onPress={() => setShowConfirmPassword((current) => !current)}
                            visible={showConfirmPassword}
                          />
                        }
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                      />
                    </>
                  ) : (
                    <>
                      <AuthField
                        accessibilityLabel="Email Address"
                        autoComplete="email"
                        keyboardType="email-address"
                        onChangeText={setIdentifier}
                        placeholder="Email Address"
                        value={identifier}
                      />
                      <AuthField
                        accessibilityLabel="Password"
                        autoComplete="password"
                        onChangeText={setLoginPassword}
                        placeholder="Password"
                        rightContent={
                          <PasswordToggle
                            onPress={() => setShowLoginPassword((current) => !current)}
                            visible={showLoginPassword}
                          />
                        }
                        secureTextEntry={!showLoginPassword}
                        value={loginPassword}
                      />
                      <Pressable
                        accessibilityRole="button"
                        onPress={showUnavailablePasswordMessage}
                        style={styles.forgotButton}
                      >
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                      </Pressable>
                    </>
                  )}

                  {visibleError && <Text style={styles.error}>{visibleError}</Text>}

                  <AuthButton
                    disabled={booting}
                    loading={loading || booting}
                    onPress={isRegister ? submitRegister : submitLogin}
                    variant="primary"
                  >
                    {isRegister ? 'Sign Up' : 'Login'}
                  </AuthButton>

                  <AuthDivider label={isRegister ? 'Or Sign Up with' : 'Or Login with'} />

                  <GoogleButton
                    disabled={booting || loading || !googleAuthConfigured || !googleRequest}
                    loading={loading || booting}
                    onPress={submitGoogle}
                  />
                </View>

                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => changeMode(isRegister ? 'login' : 'register')}
                  >
                    <Text style={styles.switchAction}>
                      {isRegister ? 'Login Now' : 'Sign Up Now'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

type EntryPointProps = {
  error: string | null;
  onContinueAsGuest: () => void;
  onLogin: () => void;
  onRegister: () => void;
};

function EntryPoint({ error, onContinueAsGuest, onLogin, onRegister }: EntryPointProps) {
  return (
    <View style={styles.entryShell}>
      <View style={styles.entryCenter}>
        <Image
          accessibilityLabel="Compass"
          resizeMode="contain"
          source={brandImages.compassVertical}
          style={styles.brandLogo}
        />

        <View style={styles.entryActions}>
          <AuthButton onPress={onLogin} variant="primary">
            Login
          </AuthButton>
          <AuthButton onPress={onRegister} variant="outline">
            Sign Up
          </AuthButton>
        </View>
      </View>

      <View style={styles.entryFooter}>
        {error && <Text style={styles.entryError}>{error}</Text>}
        <Pressable accessibilityRole="button" onPress={onContinueAsGuest}>
          <Text style={styles.guestText}>Continue as a guest</Text>
        </Pressable>
      </View>
    </View>
  );
}

type AuthButtonProps = {
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  variant: ButtonVariant;
};

function AuthButton({
  children,
  disabled = false,
  loading = false,
  onPress,
  variant,
}: AuthButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.authButton,
        styles[`${variant}Button`],
        pressed && !disabled && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? authColors.darkText : authColors.primaryText} />
      ) : (
        <Text style={[styles.authButtonText, isPrimary && styles.primaryButtonText]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

type AuthFieldProps = {
  accessibilityLabel: string;
  autoComplete?: 'email' | 'username' | 'password' | 'off';
  keyboardType?: 'default' | 'email-address';
  onChangeText: (value: string) => void;
  placeholder: string;
  rightContent?: ReactNode;
  secureTextEntry?: boolean;
  value: string;
};

function AuthField({
  accessibilityLabel,
  autoComplete = 'off',
  keyboardType = 'default',
  onChangeText,
  placeholder,
  rightContent,
  secureTextEntry = false,
  value,
}: AuthFieldProps) {
  return (
    <View style={styles.fieldBox}>
      <TextInput
        accessibilityLabel={accessibilityLabel}
        autoCapitalize="none"
        autoComplete={autoComplete}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={authColors.fieldPlaceholder}
        secureTextEntry={secureTextEntry}
        selectionColor={authColors.primaryText}
        style={[styles.fieldInput, rightContent ? styles.fieldInputWithAction : null]}
        value={value}
      />
      {rightContent && <View style={styles.fieldAction}>{rightContent}</View>}
    </View>
  );
}

type PasswordToggleProps = {
  onPress: () => void;
  visible: boolean;
};

function PasswordToggle({ onPress, visible }: PasswordToggleProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.passwordToggle}>
      <Text style={styles.passwordToggleText}>{visible ? 'Hide' : 'Show'}</Text>
    </Pressable>
  );
}

type AuthDividerProps = {
  label: string;
};

function AuthDivider({ label }: AuthDividerProps) {
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerText}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

type GoogleButtonProps = {
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
};

function GoogleButton({ disabled, loading, onPress }: GoogleButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.googleButton,
        pressed && !disabled && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={authColors.darkText} />
      ) : (
        <>
          <Image
            accessibilityIgnoresInvertColors
            resizeMode="contain"
            source={externalImages.googleG}
            style={styles.googleMark}
          />
          <Text style={styles.googleText}>Google</Text>
        </>
      )}
    </Pressable>
  );
}

function getGoogleResponseKey(response: AuthSessionResult) {
  if (response.type === 'success' || response.type === 'error') {
    return response.url || JSON.stringify(response.params);
  }

  return response.type;
}

function getGoogleAuthErrorMessage(response: AuthSessionResult) {
  if (response.type !== 'error') {
    return 'Could not login with Google.';
  }

  return (
    response.error?.message ||
    response.params.error_description ||
    response.params.error ||
    'Could not login with Google.'
  );
}

function getGooglePromptOptions(): AuthRequestPromptOptions | undefined {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return undefined;
  }

  const width = authDimensions.googlePopupWidth;
  const height = authDimensions.googlePopupHeight;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));

  return {
    windowName: googleAuthPopupWindowName,
    windowFeatures: {
      height,
      left,
      popup: true,
      top,
      width,
    },
  };
}

function getUsernameFromEmail(email: string) {
  const sanitized = email
    .toLowerCase()
    .replace(/@/g, '_')
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return (sanitized.length >= 3 ? sanitized : `user_${sanitized}`).slice(0, 30);
}

function getDisplayNameFromEmail(email: string) {
  const localPart = email.split('@')[0] ?? 'Compass User';
  const displayName = localPart.replace(/[._-]+/g, ' ').trim();

  return (displayName || 'Compass User').slice(0, 80);
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: authSpacing.contentHorizontal,
    paddingVertical: authSpacing.contentVertical,
  },
  entryShell: {
    width: '100%',
    maxWidth: authDimensions.maxWidth,
    minHeight: authDimensions.entryMinHeight,
    flexGrow: 1,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  entryCenter: {
    flex: 1,
    justifyContent: 'center',
    gap: authSpacing.entryCenterGap,
  },
  brandLogo: {
    alignSelf: 'center',
    height: authDimensions.brandLogoSize,
    width: authDimensions.brandLogoSize,
  },
  entryActions: {
    gap: authSpacing.socialGap,
  },
  entryFooter: {
    minHeight: authDimensions.footerMinHeight,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: authSpacing.entryFooterGap,
  },
  guestText: {
    color: authColors.mutedText,
    fontSize: authTypography.error,
    fontWeight: authFontWeights.medium,
  },
  formShell: {
    width: '100%',
    maxWidth: authDimensions.maxWidth,
    minHeight: authDimensions.formMinHeight,
    flexGrow: 1,
    alignSelf: 'center',
    justifyContent: 'space-between',
    paddingTop: authSpacing.formTop,
  },
  heading: {
    alignItems: 'center',
    marginBottom: authSpacing.headingBottom,
  },
  headingTitle: {
    color: authColors.primaryText,
    fontSize: authTypography.title,
    fontWeight: authFontWeights.title,
    lineHeight: authLineHeights.title,
  },
  headingSubtitle: {
    color: authColors.secondaryText,
    fontSize: authTypography.subtitle,
    fontWeight: authFontWeights.medium,
    lineHeight: authLineHeights.subtitle,
  },
  form: {
    gap: authSpacing.formGap,
  },
  fieldBox: {
    minHeight: authDimensions.fieldMinHeight,
    justifyContent: 'center',
    borderRadius: authRadii.control,
    borderColor: authColors.fieldBorder,
    borderWidth: borders.defaultWidth,
    backgroundColor: authColors.fieldBackground,
  },
  fieldInput: {
    minHeight: authDimensions.fieldInputMinHeight,
    color: authColors.primaryText,
    fontSize: authTypography.control,
    fontWeight: authFontWeights.field,
    paddingHorizontal: authSpacing.fieldHorizontal,
  },
  fieldInputWithAction: {
    paddingRight: authSpacing.fieldInputActionRight,
  },
  fieldAction: {
    position: 'absolute',
    right: authSpacing.fieldActionRight,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  passwordToggle: {
    minWidth: authDimensions.passwordToggleMinWidth,
    minHeight: authDimensions.passwordToggleMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordToggleText: {
    color: authColors.subduedText,
    fontSize: authTypography.compact,
    fontWeight: authFontWeights.link,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    minHeight: authDimensions.forgotMinHeight,
    justifyContent: 'center',
  },
  forgotText: {
    color: authColors.primaryText,
    fontSize: authTypography.compact,
    fontWeight: authFontWeights.link,
  },
  error: {
    color: authColors.primaryText,
    fontSize: authTypography.error,
    fontWeight: authFontWeights.error,
    lineHeight: authLineHeights.error,
    textAlign: 'center',
  },
  entryError: {
    color: authColors.primaryText,
    fontSize: authTypography.error,
    fontWeight: authFontWeights.error,
    lineHeight: authLineHeights.error,
    textAlign: 'center',
  },
  authButton: {
    minHeight: authDimensions.buttonMinHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: authRadii.control,
    paddingHorizontal: authSpacing.buttonHorizontal,
  },
  primaryButton: {
    backgroundColor: authColors.controlBackground,
  },
  outlineButton: {
    borderColor: authColors.controlBorder,
    borderWidth: borders.defaultWidth,
    backgroundColor: authColors.transparent,
  },
  linkButton: {
    backgroundColor: authColors.transparent,
  },
  authButtonText: {
    color: authColors.primaryText,
    fontSize: authTypography.control,
    fontWeight: authFontWeights.button,
  },
  primaryButtonText: {
    color: authColors.textOnControl,
  },
  dividerRow: {
    minHeight: authDimensions.dividerMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: authSpacing.dividerGap,
  },
  dividerLine: {
    height: authDimensions.dividerLineHeight,
    flex: 1,
    backgroundColor: authColors.divider,
  },
  dividerText: {
    color: authColors.overlayText,
    fontSize: authTypography.compact,
    fontWeight: authFontWeights.field,
  },
  googleButton: {
    minHeight: authDimensions.buttonMinHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: authSpacing.socialGap,
    borderRadius: authRadii.control,
    backgroundColor: authColors.controlBackground,
  },
  googleMark: {
    height: authDimensions.externalIconSize,
    width: authDimensions.externalIconSize,
  },
  googleText: {
    color: authColors.textOnControl,
    fontSize: authTypography.control,
    fontWeight: authFontWeights.socialText,
  },
  switchRow: {
    minHeight: authDimensions.switchMinHeight,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'center',
    columnGap: authSpacing.compactGap,
    rowGap: authSpacing.compactGap,
    paddingBottom: authSpacing.switchBottom,
  },
  switchText: {
    color: authColors.darkText,
    fontSize: authTypography.compact,
    fontWeight: authFontWeights.medium,
  },
  switchAction: {
    color: authColors.primaryText,
    fontSize: authTypography.compact,
    fontWeight: authFontWeights.button,
  },
  pressed: {
    opacity: authOpacity.pressed,
  },
  disabled: {
    opacity: authOpacity.disabled,
  },
});
