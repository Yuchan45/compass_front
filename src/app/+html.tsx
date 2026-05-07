import type { ReactNode } from 'react';
import { ScrollViewStyleReset } from 'expo-router/html';

import { getGoogleAuthPopupCompletionScript } from '@/utils/google-auth-popup';

const authPopupCompletionScript = getGoogleAuthPopupCompletionScript();

type RootHtmlProps = {
  children: ReactNode;
};

export default function RootHtml({ children }: RootHtmlProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
        <meta content="width=device-width, initial-scale=1, shrink-to-fit=no" name="viewport" />
        <ScrollViewStyleReset />
        <script dangerouslySetInnerHTML={{ __html: authPopupCompletionScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
