import Constants from 'expo-constants';

export const PRODUCT_NAME = 'Workout App';
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Constants.expoConfig?.hostUri
    ? `http://${Constants.expoConfig.hostUri.split(':')[0]}:8000/api/v1`
    : 'http://localhost:8000/api/v1');

