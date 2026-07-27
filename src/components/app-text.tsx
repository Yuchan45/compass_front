import { forwardRef, type ElementRef } from 'react';
import {
  StyleSheet,
  Text as NativeText,
  TextInput as NativeTextInput,
  type TextInputProps,
  type TextProps,
  type TextStyle,
} from 'react-native';

import { resolveFontFamily } from '@/constants/fonts';

export function AppText({ style, ...props }: TextProps) {
  return <NativeText {...props} style={[getFontStyle(style), style]} />;
}

type NativeTextInputRef = ElementRef<typeof NativeTextInput>;

export const AppTextInput = forwardRef<NativeTextInputRef, TextInputProps>(function AppTextInput(
  { style, ...props },
  ref,
) {
  return <NativeTextInput ref={ref} {...props} style={[getFontStyle(style), style]} />;
});

function getFontStyle(style: TextProps['style'] | TextInputProps['style']) {
  const flattened = StyleSheet.flatten(style) as TextStyle | undefined;

  if (flattened?.fontFamily) {
    return undefined;
  }

  return {
    fontFamily: resolveFontFamily(flattened?.fontWeight),
  };
}
