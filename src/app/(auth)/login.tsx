import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../services/firebase';
import { Button, Eyebrow, Field, Heading, Page } from '../../components/ui';
import { colors } from '../../constants/theme';
export default function Login() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false);
  async function submit() { if (!auth) return Alert.alert('Connect Firebase', 'Add your Firebase values to .env to sign in.'); setLoading(true); try { await signInWithEmailAndPassword(auth, email.trim(), password); } catch (e) { Alert.alert('Could not sign in', e instanceof Error ? e.message : 'Please try again.'); } finally { setLoading(false); } }
  return <Page style={{ justifyContent: 'center', gap: 28 }}><View style={{ gap: 18 }}><View style={{ width: 54, height: 54, borderRadius: 18, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 27 }}>✳</Text></View><Eyebrow>NUTRIVISION</Eyebrow><Heading title="Eat well, know more." subtitle="Sign in to keep your nutrition journey in focus." /></View><View style={{ gap: 13 }}><Field placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /><Field placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry /><Button loading={loading} onPress={submit}>Sign in</Button>{!isFirebaseConfigured && <Text style={{ color: colors.muted, textAlign: 'center', fontSize: 12 }}>Firebase keys needed to enable your account.</Text>}</View><Text style={{ color: colors.muted, textAlign: 'center' }}>New to NutriVision? <Link href="/(auth)/register" style={{ color: colors.green, fontWeight: '700' }}>Create account</Link></Text></Page>;
}
