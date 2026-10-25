import type { Meal } from './meals';
const endpoint = process.env.EXPO_PUBLIC_AI_MODEL_API_URL;
export async function predictMeal(uri: string): Promise<Meal> {
  if (!endpoint) throw new Error('Add EXPO_PUBLIC_AI_MODEL_API_URL to enable food recognition.');
  const form = new FormData();
  form.append('image', { uri, name: 'meal.jpg', type: 'image/jpeg' } as unknown as Blob);
  const response = await fetch(endpoint, { method: 'POST', body: form, headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Food recognition failed (${response.status}). Try another photo.`);
  const json = await response.json();
  return { timestamp: new Date(), dishName: json.dishName, ingredients: json.ingredients ?? [], portion: json.portion ?? '1 serving', macros: json.macros, micros: json.micros, imageUrl: json.imageUrl };
}
