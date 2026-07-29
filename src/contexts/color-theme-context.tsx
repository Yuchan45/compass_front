import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { colors, darkColors, type AppColors } from '@/constants/design';
import { useAuth } from '@/contexts/auth-context';

export type ColorThemeMode = 'light' | 'dark';

type ColorThemeContextValue = {
  colors: AppColors;
  isDarkMode: boolean;
  mode: ColorThemeMode;
  setMode: (mode: ColorThemeMode) => Promise<void>;
  toggleMode: () => Promise<void>;
};

const ColorThemeContext = createContext<ColorThemeContextValue | null>(null);

type ColorThemeProviderProps = {
  children: ReactNode;
};

export function ColorThemeProvider({ children }: ColorThemeProviderProps) {
  const { session, updateUserSettings } = useAuth();
  const [mode, setModeState] = useState<ColorThemeMode>('light');

  useEffect(() => {
    setModeState(session?.user.settings?.colorTheme ?? 'light');
  }, [session?.user.settings?.colorTheme]);

  const setMode = useCallback(
    async (nextMode: ColorThemeMode) => {
      const previousMode = mode;

      setModeState(nextMode);

      if (!session) {
        return;
      }

      const updated = await updateUserSettings({
        colorTheme: nextMode,
      });

      if (!updated) {
        setModeState(previousMode);
      }
    },
    [mode, session, updateUserSettings],
  );

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
