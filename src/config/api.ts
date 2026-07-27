import Constants from 'expo-constants';
import { Platform } from 'react-native';

const defaultBaseUrl = Platform.select({
  android: 'http://10.0.2.2:9000/api',
  default: 'http://localhost:9000/api',
});

type ExpoExtra = {
  backendApiUrl?: unknown;
};

const expoExtra = Constants.expoConfig?.extra as ExpoExtra | undefined;
const backendApiUrl = getStringValue(expoExtra?.backendApiUrl) ?? process.env.BACKEND_API_URL;

export const API_BASE_URL = (backendApiUrl?.trim() || defaultBaseUrl).replace(/\/$/, '');

function getStringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value : undefined;
}
