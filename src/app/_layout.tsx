import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { fontAssets } from '@/constants/fonts';
import { AuthProvider } from '@/contexts/auth-context';
import { FriendRequestsProvider } from '@/contexts/friend-requests-context';
import { ToastProvider } from '@/contexts/toast-context';
import {
  closeGoogleAuthPopup,
  hideGoogleAuthPopupDocument,
  isGoogleAuthPopupCallback,
  postGoogleAuthPopupResultToParent,
} from '@/utils/google-auth-popup';

const webAuthCompletion = completeWebAuthSession();

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontLoadError] = useFonts(fontAssets);

  useEffect(() => {
    if (fontsLoaded || fontLoadError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontLoadError, fontsLoaded]);

  if (webAuthCompletion.shouldRenderCompletion) {
    return null;
  }

  if (!fontsLoaded && !fontLoadError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <FriendRequestsProvider>
          <ToastProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="map" options={{ animation: 'none' }} />
              <Stack.Screen name="meetups" options={{ animation: 'none' }} />
              <Stack.Screen name="friends" options={{ animation: 'none' }} />
              <Stack.Screen name="profile" options={{ animation: 'none' }} />
            </Stack>
            <StatusBar style="dark" />
          </ToastProvider>
        </FriendRequestsProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

type WebAuthCompletion = {
  shouldRenderCompletion: boolean;
};

function completeWebAuthSession(): WebAuthCompletion {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return { shouldRenderCompletion: false };
  }

  if (!isGoogleAuthPopupCallback(window)) {
    WebBrowser.maybeCompleteAuthSession();
    return { shouldRenderCompletion: false };
  }

  try {
    hideGoogleAuthPopupDocument(document);
    const result = WebBrowser.maybeCompleteAuthSession({ skipRedirectCheck: true });

    if (result.type === 'success') {
      closeGoogleAuthPopup(window);
      return { shouldRenderCompletion: true };
    }
  } catch {
    // Fall back to a direct message below when Expo cannot complete the popup.
  }

  if (postGoogleAuthPopupResultToParent(window)) {
    closeGoogleAuthPopup(window);
  }

  return { shouldRenderCompletion: true };
}
