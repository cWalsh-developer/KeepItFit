import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type Tokens = { access_token: string; refresh_token: string };
type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  hydrated: boolean;
  onboardingComplete: boolean;
  hydrate: () => Promise<void>;
  signIn: (tokens: Tokens) => Promise<void>;
  finishOnboarding: () => Promise<void>;
  signOut: () => Promise<void>;
};

const ACCESS = "workout.accessToken";
const REFRESH = "workout.refreshToken";
const ONBOARDING = "workout.onboardingComplete";

export const useAuth = create<AuthState>((set) => ({
  hydrated: false,
  onboardingComplete: false,
  hydrate: async () => {
    const [accessToken, refreshToken, onboarding] = await Promise.all([
      SecureStore.getItemAsync(ACCESS),
      SecureStore.getItemAsync(REFRESH),
      SecureStore.getItemAsync(ONBOARDING),
    ]);
    set({
      accessToken: accessToken ?? undefined,
      refreshToken: refreshToken ?? undefined,
      onboardingComplete: onboarding === "true",
      hydrated: true,
    });
  },
  signIn: async (tokens) => {
    await Promise.all([
      SecureStore.setItemAsync(ACCESS, tokens.access_token),
      SecureStore.setItemAsync(REFRESH, tokens.refresh_token),
    ]);
    set({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    });
  },
  finishOnboarding: async () => {
    await SecureStore.setItemAsync(ONBOARDING, "true");
    set({ onboardingComplete: true });
  },
  signOut: async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS),
      SecureStore.deleteItemAsync(REFRESH),
    ]);
    set({ accessToken: undefined, refreshToken: undefined });
  },
}));
