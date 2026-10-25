import { Redirect, Stack } from 'expo-router';
import { useAuthStore } from '../../store/auth';
export default function AuthLayout() {
  const { user, initialized } = useAuthStore();
  if (initialized && user) return <Redirect href="/(tabs)/scan" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
