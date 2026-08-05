import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@/store/auth';
const client = new QueryClient();
export default function RootLayout() {
  const hydrate = useAuth((state) => state.hydrate);
  useEffect(() => { void hydrate(); }, [hydrate]);
  return <QueryClientProvider client={client}><Stack screenOptions={{ headerBackTitle: 'Back' }}><Stack.Screen name="index" options={{headerShown:false}} /><Stack.Screen name="(auth)" options={{headerShown:false}} /><Stack.Screen name="onboarding" options={{title:'Set up your preferences'}} /><Stack.Screen name="(tabs)" options={{headerShown:false}} /><Stack.Screen name="exercises" options={{headerShown:false}} /></Stack></QueryClientProvider>;
}
