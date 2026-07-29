import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { colors, darkColors, type AppColors } from '@/constants/design';

export type ColorThemeMode = 'light' | 'dark';

type ColorThemeContextValue = {
  colors: AppColors;
  isDarkMode: boolean;
  mode: ColorThemeMode;
  setMode: (mode: ColorThemeMode) => Promise<void>;
  toggleMode: () => Promise<void>;
};

const THEME_KEY = 'compass.colorTheme';
const ColorThemeContext = createContext<ColorThemeContextValue | null>(null);

type ColorThemeProviderProps = {
  children: ReactNode;
};

export function ColorThemeProvider({ children }: ColorThemeProviderProps) {
  const [mode, setModeState] = useState<ColorThemeMode>('light');

  useEffect(() => {
    let active = true;

    async function restoreTheme() {
      const storedMode = await getStoredThemeMode();

      if (active && storedMode) {
        setModeState(storedMode);
      }
    }

    void restoreTheme();

    return () => {
      active = false;
    };
  }, []);

  const setMode = useCallback(async (nextMode: ColorThemeMode) => {
    setModeState(nextMode);
    await setStoredThemeMode(nextMode);
  }, []);

  const toggleMode = useCallback(async () => {
    await setMode(mode === 'dark' ? 'light' : 'dark');
  }, [mode, setMode]);

  const value = useMemo<ColorThemeContextValue>(
    () => ({
      colors: mode === 'dark' ? darkColors : colors,
      isDarkMode: mode === 'dark',
      mode,
      setMode,
      toggleMode,
    }),
    [mode, setMode, toggleMode],
  );

  return <ColorThemeContext.Provider value={value}>{children}</ColorThemeContext.Provider>;
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext);

  if (!context) {
    throw new Error('useColorTheme must be used inside ColorThemeProvider.');
  }

  return context;
}

async function getStoredThemeMode() {
  const value =
    Platform.OS === 'web'
      ? getWebStorage()?.getItem(THEME_KEY)
      : await SecureStore.getItemAsync(THEME_KEY);

  return value === 'dark' || value === 'light' ? value : null;
}

async function setStoredThemeMode(mode: ColorThemeMode) {
  if (Platform.OS === 'web') {
    getWebStorage()?.setItem(THEME_KEY, mode);
    return;
  }

  await SecureStore.setItemAsync(THEME_KEY, mode);
}

function getWebStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}
