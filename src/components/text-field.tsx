import { StyleSheet, View } from 'react-native';

import { AppText as Text, AppTextInput as TextInput } from '@/components/app-text';
import { useColorTheme } from '@/contexts/color-theme-context';
import { borders, dimensions, fontWeights, radii, spacing, typography } from '@/constants/design';

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
  const { colors } = useColorTheme();

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
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
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
          validationState === 'error' && { borderColor: colors.alert },
          validationState === 'success' && { borderColor: colors.success },
        ]}
        value={value}
      />
      {validationMessage ? (
        <Text style={[styles.validationMessage, { color: colors.alert }]}>{validationMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.one,
  },
  label: {
    fontSize: typography.small,
    fontWeight: fontWeights.bold,
  },
  input: {
    minHeight: dimensions.inputMinHeight,
    borderRadius: radii.medium,
    borderWidth: borders.defaultWidth,
    fontSize: typography.body,
    paddingHorizontal: spacing.three,
  },
  validationMessage: {
    fontSize: typography.caption,
    fontWeight: fontWeights.bold,
  },
});
