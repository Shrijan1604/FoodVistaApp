import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AppUser = { uid: string; email: string };
type AuthState = {
  user: AppUser | null;
  initialized: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  finishInitialization: () => void;
};

const DEMO_EMAIL = 'test@test.com';
const DEMO_PASSWORD = 'test1234';

export const useAuthStore = create<AuthState>()(persist((set) => ({
  user: null,
  initialized: false,
  login: (email, password) => {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) return false;
    set({ user: { uid: 'food-vista-demo', email: DEMO_EMAIL } });
    return true;
  },
  logout: () => set({ user: null }),
  finishInitialization: () => set({ initialized: true }),
}), {
  name: 'food-vista-session',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({ user: state.user }) as AuthState,
  onRehydrateStorage: () => (state) => state?.finishInitialization(),
}));
