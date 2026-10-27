import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Eyebrow, Field, Heading, Page } from '../../components/ui';
import { colors } from '../../constants/theme';
import { useAuthStore } from '../../store/auth';

export default function Login() {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('test1234');
  const login = useAuthStore((state) => state.login);

  function submit() {
    if (!login(email, password)) {
      Alert.alert('Check your details', 'Use the demo email and password shown below.');
      return;
    }
    router.replace('/(tabs)/scan');
  }

  return <Page style={{ justifyContent: 'center', gap: 28 }}>
    <View style={{ gap: 18 }}>
      <View style={{ width: 54, height: 54, borderRadius: 18, backgroundColor: colors.lime, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 27 }}>✳</Text></View>
      <Eyebrow>FOOD VISTA</Eyebrow>
      <Heading title="Welcome back." subtitle="Sign in to scan meals and keep your nutrition in view." />
    </View>
    <View style={{ gap: 13 }}>
      <Field placeholder="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
      <Field placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button onPress={submit}>Sign in</Button>
      <View style={{ backgroundColor: colors.pale, borderRadius: 15, padding: 14, gap: 4 }}>
        <Text style={{ color: colors.green, fontSize: 12, fontWeight: '700' }}>DEMO SIGN IN</Text>
        <Text style={{ color: colors.ink, fontSize: 13 }}>Email: test@test.com</Text>
        <Text style={{ color: colors.ink, fontSize: 13 }}>Password: test1234</Text>
      </View>
    </View>
  </Page>;
}
