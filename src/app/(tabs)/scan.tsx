import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as ImageManipulator from 'expo-image-manipulator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, CircleHelp, Flashlight, RotateCcw, Sparkles } from 'lucide-react-native';
import { Button, Eyebrow, Heading, Page } from '../../components/ui';
import { colors } from '../../constants/theme';
import { predictMeal } from '../../services/predict';
import { saveMeal } from '../../services/meals';
import { useAuthStore } from '../../store/auth';
import { useScanStore } from '../../store/scan';

export default function ScanScreen() {
  const camera = useRef<CameraView>(null); const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const [flat, setFlat] = useState(false); const [steady, setSteady] = useState(true); const [busy, setBusy] = useState(false); const [flash, setFlash] = useState(false);
  const user = useAuthStore((s) => s.user); const result = useScanStore((s) => s.result); const setResult = useScanStore((s) => s.setResult);
  useEffect(() => {
    Accelerometer.setUpdateInterval(300); Gyroscope.setUpdateInterval(300);
    const a = Accelerometer.addListener(({ x, y, z }) => { setFlat(z > 0.94 && Math.abs(x) < 0.22 && Math.abs(y) < 0.22); });
    let last = 0; const g = Gyroscope.addListener(({ x, y, z }) => { const speed = Math.abs(x) + Math.abs(y) + Math.abs(z); if (Date.now() - last > 350) { setSteady(speed < 1.15); last = Date.now(); } });
    return () => { a.remove(); g.remove(); };
  }, []);
  async function capture() {
    if (!camera.current || busy) return;
    if (!flat) return Alert.alert('Adjust angle', 'Hold the phone parallel to the table, facing straight down.');
    if (!steady) return Alert.alert('Hold still', 'Wait for the camera to steady before capturing.');
    try {
      setBusy(true); const photo = await camera.current.takePictureAsync({ quality: 0.9, skipProcessing: false });
      if (!photo?.uri) throw new Error('The photo could not be captured.');
      const processed = await ImageManipulator.manipulateAsync(photo.uri, [{ resize: { width: 1280 } }], { compress: 0.78, format: ImageManipulator.SaveFormat.JPEG });
      const meal = await predictMeal(processed.uri); setResult({ ...meal, imageUrl: meal.imageUrl ?? processed.uri });
    } catch (error) { Alert.alert('Scan unavailable', error instanceof Error ? error.message : 'Try again in a moment.'); } finally { setBusy(false); }
  }
  async function save() { if (!result || !user) return; try { await saveMeal(user.uid, result); setResult(null); Alert.alert('Meal saved', 'Added to your last 7 days.'); } catch (e) { Alert.alert('Could not save', e instanceof Error ? e.message : 'Please try again.'); } }
  if (!permission?.granted) return <Page style={{ justifyContent: 'center', gap: 18 }}><Heading title="Camera access needed" subtitle="NutriVision uses your camera to identify meals and estimate portions." /><Button onPress={requestPermission}>Allow camera</Button></Page>;
  if (result) return <Page style={{ paddingTop: insets.top + 14, gap: 18 }}><Heading title={result.dishName} subtitle={`${result.portion} · ${result.macros.calories} kcal`} />{result.imageUrl && <Image source={{ uri: result.imageUrl }} style={{ height: 210, borderRadius: 24 }} />}
    <View style={{ backgroundColor: colors.paper, borderRadius: 22, padding: 18, gap: 13 }}><Eyebrow>MACROS · ESTIMATE</Eyebrow><Text style={{ color: colors.ink, fontSize: 15 }}>Protein {result.macros.protein}g   ·   Carbs {result.macros.carbs}g   ·   Fat {result.macros.fats}g</Text>{result.micros?.fiber != null && <Text style={{ color: colors.muted }}>Fiber {result.micros.fiber}g · Sodium {result.micros.sodium ?? '—'}mg</Text>}</View>
    <View style={{ backgroundColor: colors.paper, borderRadius: 22, padding: 18, gap: 10 }}><Eyebrow>INGREDIENTS</Eyebrow><Text style={{ color: colors.ink, lineHeight: 23 }}>{result.ingredients.join(' · ') || 'No ingredients returned'}</Text></View><Button onPress={save}>Save meal</Button><Button style={{ backgroundColor: colors.pale }} onPress={() => setResult(null)}><Text style={{ color: colors.green, fontWeight: '700' }}>Scan another</Text></Button></Page>;
  return <View style={{ flex: 1, backgroundColor: '#101712', paddingTop: insets.top }}><View style={{ paddingHorizontal: 22, paddingTop: 12, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><View><Eyebrow>YOUR DAILY SNAPSHOT</Eyebrow><Text style={{ color: 'white', fontSize: 24, fontWeight: '700', marginTop: 5 }}>Scan your plate</Text></View><Sparkles color={colors.lime} size={24} /></View>
    <View style={{ flex: 1, marginHorizontal: 13, overflow: 'hidden', borderRadius: 30, backgroundColor: '#27342D' }}><CameraView ref={camera} style={{ flex: 1 }} facing="back" enableTorch={flash} /><View pointerEvents="none" style={{ position: 'absolute', left: 24, right: 24, top: '22%', bottom: '23%', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.75)', borderRadius: 30, alignItems: 'center', justifyContent: 'center' }}><View style={{ height: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.25)' }} /><Text style={{ position: 'absolute', top: 12, backgroundColor: 'rgba(14,25,18,0.62)', color: 'white', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12, fontSize: 12 }}>Fit plate + utensil inside</Text><View style={{ position: 'absolute', width: 8, height: 8, borderRadius: 5, backgroundColor: colors.lime }} /></View>
      <View style={{ position: 'absolute', top: 15, left: 15, right: 15, flexDirection: 'row', justifyContent: 'space-between' }}><View style={{ backgroundColor: 'rgba(17,29,21,.76)', paddingHorizontal: 12, paddingVertical: 9, borderRadius: 18, flexDirection: 'row', gap: 6, alignItems: 'center' }}>{flat && steady ? <Check color={colors.lime} size={15} /> : <CircleHelp color="#FFD38C" size={15} />}<Text style={{ color: 'white', fontSize: 12 }}>{!flat ? 'Tilt phone flat' : !steady ? 'Hold steady' : 'Angle looks good'}</Text></View><Text onPress={() => setFlash(!flash)} style={{ color: 'white', backgroundColor: 'rgba(17,29,21,.76)', padding: 10, borderRadius: 16 }}>{flash ? 'Flash on' : 'Flash off'}</Text></View>
    </View><View style={{ paddingHorizontal: 22, paddingTop: 17, paddingBottom: Math.max(insets.bottom, 18), gap: 13 }}><Text style={{ color: '#D6DDD6', fontSize: 13, lineHeight: 19, textAlign: 'center' }}>Keep the full plate in frame · Add one spoon or fork for scale</Text><Button loading={busy} onPress={capture} style={{ backgroundColor: colors.lime, height: 60, borderRadius: 22 }}><Text style={{ color: colors.ink, fontWeight: '800', fontSize: 16 }}>{busy ? 'Analyzing plate…' : 'Capture meal'}</Text></Button><Text style={{ color: '#A8B3A9', textAlign: 'center', fontSize: 11 }}>Check focus and lighting before you capture</Text></View></View>;
}
