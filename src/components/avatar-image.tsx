import { useEffect, useState } from 'react';
import type { ImageStyle, StyleProp } from 'react-native';
import { Image } from 'react-native';

import { commonImages } from '@/constants/assets';

type AvatarImageProps = {
  avatarUrl: string | null;
  style: StyleProp<ImageStyle>;
};

export function AvatarImage({ avatarUrl, style }: AvatarImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const normalizedAvatarUrl = avatarUrl?.trim() || null;
  const shouldUseRemoteAvatar = normalizedAvatarUrl && normalizedAvatarUrl !== failedUrl;
  const source = shouldUseRemoteAvatar ? { uri: normalizedAvatarUrl } : commonImages.defaultProfile;

  useEffect(() => {
    setFailedUrl(null);
  }, [normalizedAvatarUrl]);

  return (
    <Image
      accessibilityIgnoresInvertColors
      onError={() => {
        if (normalizedAvatarUrl) {
          setFailedUrl(normalizedAvatarUrl);
        }
      }}
      source={source}
      style={style}
    />
  );
}
