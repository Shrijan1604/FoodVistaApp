import { Alert, Text, View } from 'react-native';
import { signOut } from 'firebase/auth';
import { Mail, ShieldCheck } from 'lucide-react-native';
import { Button, Eyebrow, Heading, Page } from '../../components/ui';
import { colors } from '../../constants/theme';
import { auth } from '../../services/firebase';
import { useAuthStore } from '../../store/auth';
export default function Profile() {
  const user = useAuthStore((s) => s.user);
  async function logout() { if (!auth) return Alert.alert('Firebase is not configured'); try { await signOut(auth); } catch (e) { Alert.alert('Could not sign out', e instanceof Error ? e.message : 'Please try again.'); } }
  return <Page style={{ paddingTop: 26, gap: 26 }}><View style={{ gap: 9 }}><Eyebrow>YOUR SPACE</Eyebrow><Heading title="Profile" subtitle="Your food journey, made personal." /></View><View style={{ backgroundColor: colors.paper, padding: 18, borderRadius: 23, gap: 14 }}><View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><View style={{ backgroundColor: colors.lime, width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}><Mail color={colors.green} size={21} /></View><View><Text style={{ color: colors.muted, fontSize: 12 }}>SIGNED IN AS</Text><Text style={{ color: colors.ink, fontWeight: '700', marginTop: 4 }}>{user?.email}</Text></View></View><View style={{ height: 1, backgroundColor: colors.line }} /><View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><ShieldCheck color={colors.green} size={18} /><Text style={{ color: colors.muted, flex: 1, fontSize: 12, lineHeight: 18 }}>Your meals are stored privately in your Firebase account.</Text></View></View><Button onPress={logout} style={{ backgroundColor: colors.pale }}><Text style={{ color: colors.green, fontWeight: '700' }}>Sign out</Text></Button></Page>;
}
