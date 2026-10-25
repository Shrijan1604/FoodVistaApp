import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuthStore } from '../store/auth';
import { colors } from '../constants/theme';

export default function RootLayout() {
  const setUser = useAuthStore((state) => state.setUser);
  useEffect(() => {
    if (!auth) { useAuthStore.getState().finishInitialization(); return; }
    return onAuthStateChanged(auth, (user) => setUser(user ? { uid: user.uid, email: user.email ?? '' } : null));
  }, [setUser]);
  return <><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.canvas } }} /></>;
}
