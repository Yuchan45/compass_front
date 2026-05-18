export const colors = {
  background: '#f4f7f3',
  alert: '#dc2626',
  alertSoft: '#fee2e2',
  border: '#cfdbd5',
  black: '#111111',
  blackSoft: '#151515',
  danger: '#b42318',
  google: '#4285f4',
  info: '#2563eb',
  infoSoft: '#dbeafe',
  muted: '#6b7c74',
  navActive: '#6d4ee8',
  navInactive: '#4f5965',
  primary: '#0f766e',
  primarySoft: '#d7f0ea',
  secondary: '#c05621',
  success: '#16a34a',
  successSoft: '#dcfce7',
  surface: '#ffffff',
  text: '#10231f',
  textSoft: '#40534d',
  transparent: 'transparent',
  warning: '#ca8a04',
  warningSoft: '#fef3c7',
  whiteAlpha16: 'rgba(255, 255, 255, 0.16)',
  whiteAlpha34: 'rgba(255, 255, 255, 0.34)',
  whiteAlpha42: 'rgba(255, 255, 255, 0.42)',
  whiteAlpha72: 'rgba(255, 255, 255, 0.72)',
  whiteAlpha78: 'rgba(255, 255, 255, 0.78)',
  whiteAlpha82: 'rgba(255, 255, 255, 0.82)',
  whiteAlpha86: 'rgba(255, 255, 255, 0.86)',
  whiteAlpha90: 'rgba(255, 255, 255, 0.9)',
};

export const gradients = {
  authBackground: ['#c392f7', '#83a6ff'] as const,
};

export const radii = {
  authControl: 5,
  small: 6,
  medium: 8,
};

export const borders = {
  defaultWidth: 1,
};

export const spacing = {
  compactGap: 4,
  one: 6,
  two: 10,
  three: 14,
  four: 20,
  five: 28,
  six: 36,
};

export const typography = {
  body: 16,
  caption: 12,
  compact: 11,
  control: 13,
  small: 14,
  authBrand: 22,
  authTitle: 25,
  authSubtitle: 22,
  googleMark: 18,
  title: 34,
};

export const lineHeights = {
  authError: 17,
  authTitle: 30,
  authSubtitle: 28,
};

export const fontWeights = {
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;

export const opacity = {
  pressed: 0.78,
  disabled: 0.55,
  disabledStrong: 0.52,
};

export const dimensions = {
  appMaxWidth: 520,
  authMaxWidth: 360,
  authBrandLogoSize: 150,
  authExternalIconSize: 20,
  authEntryMinHeight: 560,
  authFormMinHeight: 620,
  authGooglePopupHeight: 680,
  authGooglePopupWidth: 515,
  authButtonMinHeight: 48,
  authDividerMinHeight: 42,
  authDividerLineHeight: 1,
  authFieldMinHeight: 44,
  authFieldInputMinHeight: 42,
  authFooterMinHeight: 60,
  authForgotMinHeight: 26,
  authPasswordToggleMinHeight: 34,
  authPasswordToggleMinWidth: 48,
  authSwitchMinHeight: 54,
  buttonMinHeight: 48,
  inputMinHeight: 48,
  bottomNavigationHeight: 56,
  bottomNavigationIconSize: 24,
  bottomNavigationCenterButtonSize: 35,
  bottomNavigationCenterIconSize: 24,
  bottomNavigationItemMinHeight: 35,
  bottomNavigationItemMinWidth: 50,
  summaryItemMinHeight: 58,
};

export const navigationTheme = {
  colors: {
    active: colors.navActive,
    background: colors.surface,
    border: colors.border,
    centerButtonBackground: colors.navActive,
    centerButtonIcon: colors.surface,
    inactive: colors.navInactive,
  },
  dimensions: {
    centerButtonSize: dimensions.bottomNavigationCenterButtonSize,
    centerIconSize: dimensions.bottomNavigationCenterIconSize,
    height: dimensions.bottomNavigationHeight,
    iconSize: dimensions.bottomNavigationIconSize,
    itemMinHeight: dimensions.bottomNavigationItemMinHeight,
    itemMinWidth: dimensions.bottomNavigationItemMinWidth,
  },
  opacity: {
    pressed: opacity.pressed,
  },
  radii: {
    centerButton: dimensions.bottomNavigationCenterButtonSize / 2,
  },
};

export const authTheme = {
  colors: {
    backgroundGradient: gradients.authBackground,
    controlBackground: colors.surface,
    controlBorder: colors.whiteAlpha82,
    darkText: colors.black,
    divider: colors.whiteAlpha34,
    fieldBackground: colors.whiteAlpha16,
    fieldBorder: colors.whiteAlpha42,
    fieldPlaceholder: colors.whiteAlpha72,
    google: colors.google,
    mutedText: colors.whiteAlpha82,
    overlayText: colors.whiteAlpha86,
    primaryText: colors.surface,
    secondaryText: colors.whiteAlpha90,
    subduedText: colors.whiteAlpha78,
    textOnControl: colors.blackSoft,
    transparent: colors.transparent,
    validationError: colors.alert,
    validationSuccess: colors.success,
  },
  dimensions: {
    brandLogoSize: dimensions.authBrandLogoSize,
    buttonMinHeight: dimensions.authButtonMinHeight,
    dividerMinHeight: dimensions.authDividerMinHeight,
    dividerLineHeight: dimensions.authDividerLineHeight,
    entryMinHeight: dimensions.authEntryMinHeight,
    externalIconSize: dimensions.authExternalIconSize,
    fieldInputMinHeight: dimensions.authFieldInputMinHeight,
    fieldMinHeight: dimensions.authFieldMinHeight,
    footerMinHeight: dimensions.authFooterMinHeight,
    forgotMinHeight: dimensions.authForgotMinHeight,
    formMinHeight: dimensions.authFormMinHeight,
    googlePopupHeight: dimensions.authGooglePopupHeight,
    googlePopupWidth: dimensions.authGooglePopupWidth,
    maxWidth: dimensions.authMaxWidth,
    passwordToggleMinHeight: dimensions.authPasswordToggleMinHeight,
    passwordToggleMinWidth: dimensions.authPasswordToggleMinWidth,
    switchMinHeight: dimensions.authSwitchMinHeight,
  },
  fontWeights: {
    brand: fontWeights.extraBold,
    button: fontWeights.extraBold,
    error: fontWeights.extraBold,
    field: fontWeights.semiBold,
    link: fontWeights.bold,
    medium: fontWeights.medium,
    socialMark: fontWeights.black,
    socialText: fontWeights.extraBold,
    title: fontWeights.extraBold,
  },
  lineHeights: {
    error: lineHeights.authError,
    subtitle: lineHeights.authSubtitle,
    title: lineHeights.authTitle,
  },
  opacity: {
    disabled: opacity.disabledStrong,
    pressed: opacity.pressed,
  },
  radii: {
    control: radii.authControl,
  },
  spacing: {
    buttonHorizontal: 18,
    compactGap: 4,
    contentHorizontal: 22,
    contentVertical: 24,
    dividerGap: 12,
    entryCenterGap: 34,
    entryFooterGap: 12,
    fieldActionRight: 8,
    fieldHorizontal: 15,
    fieldInputActionRight: 66,
    formGap: 12,
    formTop: 50,
    headingBottom: 34,
    socialGap: 10,
    switchBottom: 2,
  },
  typography: {
    brand: typography.authBrand,
    compact: typography.compact,
    control: typography.control,
    error: typography.caption,
    googleMark: typography.googleMark,
    subtitle: typography.authSubtitle,
    title: typography.authTitle,
  },
};

export const toastTheme = {
  colors: {
    alert: {
      accent: colors.alert,
      background: colors.alertSoft,
    },
    info: {
      accent: colors.info,
      background: colors.infoSoft,
    },
    success: {
      accent: colors.success,
      background: colors.successSoft,
    },
    warning: {
      accent: colors.warning,
      background: colors.warningSoft,
    },
  },
  durationMs: 3000,
};
