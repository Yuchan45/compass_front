import { StyleSheet, View } from 'react-native';

import { AppText as Text, AppTextInput as TextInput } from '@/components/app-text';
import {
  borders,
  colors,
  dimensions,
  fontWeights,
  radii,
  spacing,
  typography,
} from '@/constants/design';

type TextFieldProps = {
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'username' | 'password' | 'off';
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  label: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  validationMessage?: string | null;
  validationState?: 'default' | 'error' | 'success';
  value: string;
};

export function TextField({
  autoCapitalize = 'none',
  autoComplete = 'off',
  keyboardType = 'default',
  label,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  validationMessage,
  validationState = 'default',
  value,
}: TextFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          validationState === 'error' && styles.inputError,
          validationState === 'success' && styles.inputSuccess,
        ]}
        value={value}
      />
      {validationMessage ? <Text style={styles.validationMessage}>{validationMessage}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.one,
  },
  label: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: fontWeights.bold,
  },
  input: {
    minHeight: dimensions.inputMinHeight,
    borderRadius: radii.medium,
    borderColor: colors.border,
    borderWidth: borders.defaultWidth,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: typography.body,
    paddingHorizontal: spacing.three,
  },
  inputError: {
    borderColor: colors.alert,
  },
  inputSuccess: {
    borderColor: colors.success,
  },
  validationMessage: {
    color: colors.alert,
    fontSize: typography.caption,
    fontWeight: fontWeights.bold,
  },
});
