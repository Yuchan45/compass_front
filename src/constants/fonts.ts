import type { TextStyle } from 'react-native';

export const fontFamilies = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
  black: 'Inter-Black',
} as const;

export const fontAssets = {
  [fontFamilies.regular]: require('../../assets/fonts/Inter-Regular.ttf'),
  [fontFamilies.medium]: require('../../assets/fonts/Inter-Medium.ttf'),
  [fontFamilies.semiBold]: require('../../assets/fonts/Inter-SemiBold.ttf'),
  [fontFamilies.bold]: require('../../assets/fonts/Inter-Bold.ttf'),
  [fontFamilies.extraBold]: require('../../assets/fonts/Inter-ExtraBold.ttf'),
  [fontFamilies.black]: require('../../assets/fonts/Inter-Black.ttf'),
} as const;

export function resolveFontFamily(fontWeight?: TextStyle['fontWeight']) {
  switch (fontWeight) {
    case '500':
    case 500:
      return fontFamilies.medium;
    case '600':
    case 600:
      return fontFamilies.semiBold;
    case '700':
    case 'bold':
    case 700:
      return fontFamilies.bold;
    case '800':
    case 800:
      return fontFamilies.extraBold;
    case '900':
    case 900:
      return fontFamilies.black;
    default:
      return fontFamilies.regular;
  }
}
