import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText as Text, AppTextInput } from '@/components/app-text';
import { colors, fontWeights, opacity, spacing, typography } from '@/constants/design';

type FriendsSearchBarProps = {
  onChangeText: (value: string) => void;
  onClear: () => void;
  helperText?: string | null;
  value: string;
};

export function FriendsSearchBar({
  onChangeText,
  onClear,
  helperText,
  value,
}: FriendsSearchBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons color={colors.muted} name="magnify" size={19} />
        <AppTextInput
          accessibilityLabel="Search friends"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={onChangeText}
          placeholder="Search by name or username"
          placeholderTextColor={colors.muted}
          returnKeyType="search"
          style={styles.input}
          value={value}
        />
        {value ? (
          <Pressable
            accessibilityLabel="Clear friend search"
            accessibilityRole="button"
            onPress={onClear}
            style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
          >
            <MaterialCommunityIcons color={colors.muted} name="close-circle" size={16} />
          </Pressable>
        ) : null}
      </View>

      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.compactGap,
  },
  searchBar: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.two,
    borderRadius: 22,
    backgroundColor: '#f0f1f6',
    paddingHorizontal: spacing.three,
  },
  input: {
    minWidth: 0,
    flex: 1,
    color: colors.muted,
    fontSize: typography.caption,
    fontWeight: fontWeights.medium,
    paddingVertical: 0,
  },
  clearButton: {
    minHeight: 28,
    minWidth: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: opacity.pressed,
  },
  helperText: {
    color: colors.alert,
    fontSize: typography.compact,
    fontWeight: fontWeights.semiBold,
    paddingHorizontal: spacing.one,
  },
});
