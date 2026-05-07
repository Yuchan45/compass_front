import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { AuthProvider } from '@/contexts/auth-context';
import {
  closeGoogleAuthPopup,
  hideGoogleAuthPopupDocument,
  isGoogleAuthPopupCallback,
  postGoogleAuthPopupResultToParent,
} from '@/utils/google-auth-popup';

const webAuthCompletion = completeWebAuthSession();

export default function RootLayout() {
  if (webAuthCompletion.shouldRenderCompletion) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="dark" />
    </AuthProvider>
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
