import { addDoc, collection, getDocs, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { db } from './firebase';
export type Meal = {
  id?: string; timestamp: Date; dishName: string; ingredients: string[];
  portion: string; macros: { calories: number; protein: number; carbs: number; fats: number };
  micros?: { fiber?: number; sugar?: number; sodium?: number; vitamins?: string[] }; imageUrl?: string;
};
export async function saveMeal(uid: string, meal: Meal) {
  if (!db) throw new Error('Connect Firebase to save meals.');
  const { id, ...data } = meal;
  await addDoc(collection(db, 'users', uid, 'meals'), { ...data, timestamp: Timestamp.fromDate(meal.timestamp) });
}
export async function getRecentMeals(uid: string) {
  if (!db) return [] as Meal[];
  const since = new Date(); since.setDate(since.getDate() - 7);
  const q = query(collection(db, 'users', uid, 'meals'), where('timestamp', '>=', Timestamp.fromDate(since)), orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => { const data = doc.data(); return { id: doc.id, ...data, timestamp: (data.timestamp as Timestamp).toDate() } as Meal; });
}
