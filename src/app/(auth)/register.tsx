import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { Button, Eyebrow, Field, Heading, Page } from '../../components/ui';
import { colors } from '../../constants/theme';
export default function Register() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [loading, setLoading] = useState(false);
  async function submit() { if (!auth) return Alert.alert('Connect Firebase', 'Add your Firebase values to .env to create an account.'); setLoading(true); try { await createUserWithEmailAndPassword(auth, email.trim(), password); } catch (e) { Alert.alert('Could not create account', e instanceof Error ? e.message : 'Please try again.'); } finally { setLoading(false); } }
  return <Page style={{ justifyContent: 'center', gap: 28 }}><View style={{ gap: 18 }}><Eyebrow>YOUR FOOD, IN FOCUS</Eyebrow><Heading title="Start with a fresh plate." subtitle="Create an account to save meals and track your nutrition." /></View><View style={{ gap: 13 }}><Field placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" /><Field placeholder="Password (6+ characters)" value={password} onChangeText={setPassword} secureTextEntry /><Button loading={loading} onPress={submit}>Create account</Button></View><Text style={{ color: colors.muted, textAlign: 'center' }}>Already have an account? <Link href="/(auth)/login" style={{ color: colors.green, fontWeight: '700' }}>Sign in</Link></Text></Page>;
}
