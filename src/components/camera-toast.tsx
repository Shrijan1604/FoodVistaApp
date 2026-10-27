import { useEffect, useState } from 'react';
import { Animated, Text } from 'react-native';
import { Check, CircleHelp } from 'lucide-react-native';
import { colors } from '../constants/theme';

const reminders = ['Keep the entire bowl or plate in frame', 'Include one spoon or fork for scale'];
export function CameraToast({ flat, steady }: { flat: boolean; steady: boolean }) {
  const [reminder, setReminder] = useState(0); const [opacity] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (!flat || !steady) return;
    const interval = setInterval(() => {
      Animated.sequence([Animated.timing(opacity, { toValue: 0.3, duration: 160, useNativeDriver: true }), Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true })]).start();
      setReminder((value) => (value + 1) % reminders.length);
    }, 3600);
    return () => clearInterval(interval);
  }, [flat, steady, opacity]);
  const message = !flat ? 'Adjust angle: tilt flat' : !steady ? 'Hold still for a clear shot' : reminders[reminder];
  return <Animated.View style={{ opacity, backgroundColor: 'rgba(17,29,21,0.82)', paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18, flexDirection: 'row', gap: 7, alignItems: 'center' }}>
    {flat && steady ? <Check color={colors.lime} size={15} /> : <CircleHelp color="#FFD38C" size={15} />}
    <Text style={{ color: 'white', fontSize: 12 }}>{message}</Text>
  </Animated.View>;
}
