import { Tabs, Redirect } from 'expo-router';
import { Camera, ChartNoAxesColumn, UserRound } from 'lucide-react-native';
import { useAuthStore } from '../../store/auth';
import { colors } from '../../constants/theme';
export default function TabsLayout() {
  const { user, initialized } = useAuthStore();
  if (initialized && !user) return <Redirect href="/(auth)/login" />;
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.green, tabBarInactiveTintColor: colors.muted, tabBarStyle: { height: 82, paddingTop: 11, borderTopColor: colors.line, backgroundColor: colors.paper }, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}><Tabs.Screen name="scan" options={{ title: 'Scan', tabBarIcon: ({ color, size }) => <Camera color={color} size={size} /> }} /><Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: ({ color, size }) => <ChartNoAxesColumn color={color} size={size} /> }} /><Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} /> }} /></Tabs>;
}
