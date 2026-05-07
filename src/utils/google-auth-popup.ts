import { colors } from '@/constants/design';

const authCallbackParamPattern = /(?:^|[?&#])(access_token|code|error|id_token|state)=/;
const authCallbackParamPatternSource = '(?:^|[?&#])(access_token|code|error|id_token|state)=';
const authPopupCallbackMarker = '__COMPASS_AUTH_POPUP_CALLBACK__';
const authPopupBackground = colors.background;
const expoWebBrowserRedirectHandleStorageKey = 'ExpoWebBrowserRedirectHandle';
const popupCloseRetryDelayMs = 50;

export const googleAuthPopupWindowName = 'compass-google-auth';

type GoogleAuthPopupWindow = Window &
  typeof globalThis & {
    __COMPASS_AUTH_POPUP_CALLBACK__?: boolean;
  };

export function getGoogleAuthPopupCompletionScript() {
  return `
;(function () {
  var callbackParams = window.location.search + '&' + window.location.hash;
  var hasAuthCallbackParams = new RegExp(${JSON.stringify(authCallbackParamPatternSource)}).test(callbackParams);
  var hasPopupParent = !!(window.opener && window.opener !== window);
  var isGoogleAuthPopup = window.name === ${JSON.stringify(googleAuthPopupWindowName)};

  if (!hasAuthCallbackParams || (!hasPopupParent && !isGoogleAuthPopup)) {
    return;
  }

  window[${JSON.stringify(authPopupCallbackMarker)}] = true;
  document.documentElement.style.visibility = 'hidden';
  document.documentElement.style.background = ${JSON.stringify(authPopupBackground)};

  try {
    var handle = window.localStorage && window.localStorage.getItem(${JSON.stringify(expoWebBrowserRedirectHandleStorageKey)});

    if (handle && window.opener) {
      window.opener.postMessage(
        {
          expoSender: handle,
          url: window.location.href
        },
        window.location.origin
      );
    }
  } catch (error) {}

  window.setTimeout(function () {
    window.close();
  }, 0);
  window.setTimeout(function () {
    window.close();
  }, ${popupCloseRetryDelayMs});
})();
`;
}

export function isGoogleAuthPopupCallback(popupWindow: GoogleAuthPopupWindow) {
  return (
    hasAuthCallbackParams(popupWindow) &&
    (hasPopupParent(popupWindow) ||
      popupWindow.name === googleAuthPopupWindowName ||
      Boolean(popupWindow[authPopupCallbackMarker]))
  );
}

export function hideGoogleAuthPopupDocument(documentRef: Document) {
  documentRef.documentElement.style.visibility = 'hidden';
  documentRef.documentElement.style.background = authPopupBackground;
}

export function postGoogleAuthPopupResultToParent(popupWindow: GoogleAuthPopupWindow) {
  const handle = popupWindow.localStorage.getItem(expoWebBrowserRedirectHandleStorageKey);
  const parentWindow = popupWindow.opener;

  if (!handle || !parentWindow) {
    return false;
  }

  parentWindow.postMessage(
    {
      expoSender: handle,
      url: popupWindow.location.href,
    },
    popupWindow.location.origin,
  );

  return true;
}

export function closeGoogleAuthPopup(popupWindow: GoogleAuthPopupWindow) {
  popupWindow.setTimeout(() => {
    popupWindow.close();
  }, 0);
}

function hasAuthCallbackParams(popupWindow: Window) {
  const callbackUrlParts = `${popupWindow.location.search}&${popupWindow.location.hash}`;

  return authCallbackParamPattern.test(callbackUrlParts);
}

function hasPopupParent(popupWindow: Window) {
  return Boolean(popupWindow.opener && popupWindow.opener !== popupWindow);
}
