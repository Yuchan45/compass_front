import { Platform } from 'react-native';

const defaultBaseUrl = Platform.select({
  android: 'http://10.0.2.2:9000/api',
  default: 'http://localhost:9000/api',
});

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL?.trim() || defaultBaseUrl).replace(
  /\/$/,
  '',
);
