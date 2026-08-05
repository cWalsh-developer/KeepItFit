import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/store/auth';
export default function Index() {
  const { hydrated, accessToken, onboardingComplete } = useAuth();
  if (!hydrated) return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator accessibilityLabel="Loading app" /></View>;
  if (!accessToken) return <Redirect href="/(auth)/welcome" />;
  if (!onboardingComplete) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
