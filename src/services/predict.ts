import type { Meal } from './meals';
const endpoint = process.env.EXPO_PUBLIC_AI_MODEL_API_URL;
export async function predictMeal(uri: string): Promise<Meal> {
  if (!endpoint) throw new Error('Add EXPO_PUBLIC_AI_MODEL_API_URL to enable food recognition.');
  const form = new FormData();
  form.append('image', { uri, name: 'meal.jpg', type: 'image/jpeg' } as unknown as Blob);
  const response = await fetch(endpoint, { method: 'POST', body: form, headers: { Accept: 'application/json' } });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 422) throw new Error(json.message ?? 'This photo looks blurry or too dark. Retake it in brighter light with the full plate in focus.');
    throw new Error(json.message ?? `Food recognition failed (${response.status}). Try again.`);
  }
  if (typeof json.dishName !== 'string' || !json.dishName || !json.macros || !Number.isFinite(json.macros.calories) || !Number.isFinite(json.macros.protein) || !Number.isFinite(json.macros.carbs) || !Number.isFinite(json.macros.fats)) {
    throw new Error('The recognition service returned incomplete nutrition data. Try again.');
  }
  return { timestamp: new Date(), dishName: json.dishName, ingredients: json.ingredients ?? [], portion: json.portion ?? '1 serving', macros: json.macros, micros: json.micros, imageUrl: json.imageUrl };
}
