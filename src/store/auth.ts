import { create } from 'zustand';
export type AppUser = { uid: string; email: string };
type AuthState = { user: AppUser | null; initialized: boolean; setUser: (user: AppUser | null) => void; finishInitialization: () => void };
export const useAuthStore = create<AuthState>((set) => ({
  user: null, initialized: false,
  setUser: (user) => set({ user, initialized: true }),
  finishInitialization: () => set({ initialized: true }),
}));
