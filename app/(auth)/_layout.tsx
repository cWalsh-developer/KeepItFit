import { Stack } from "expo-router";
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Log in" }} />
      <Stack.Screen name="register" options={{ title: "Create account" }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Reset password" }}
      />
    </Stack>
  );
}
