import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Meal = {
  id?: string;
  timestamp: Date;
  dishName: string;
  ingredients: string[];
  portion: string;
  macros: { calories: number; protein: number; carbs: number; fats: number };
  micros?: { fiber?: number; sugar?: number; sodium?: number; vitamins?: string[] };
  imageUrl?: string;
};

type MealState = { meals: Meal[]; addMeal: (meal: Meal) => void };
const useMealStore = create<MealState>()(persist((set) => ({
  meals: [],
  addMeal: (meal) => set((state) => ({ meals: [{ ...meal, id: meal.id ?? `${Date.now()}` }, ...state.meals] })),
}), {
  name: 'food-vista-meals',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: (state) => ({ meals: state.meals }) as MealState,
  merge: (persisted, current) => {
    const data = persisted as { meals?: (Omit<Meal, 'timestamp'> & { timestamp: Date | string })[] } | undefined;
    return {
      ...current,
      meals: (data?.meals ?? []).map((meal) => ({ ...meal, timestamp: new Date(meal.timestamp) })),
    };
  },
}));

let hydration: Promise<void> | undefined;
function ensureHydrated() {
  hydration ??= Promise.resolve(useMealStore.persist.rehydrate());
  return hydration;
}

export async function saveMeal(_uid: string, meal: Meal) {
  await ensureHydrated();
  useMealStore.getState().addMeal(meal);
}

export async function getRecentMeals(_uid: string) {
  await ensureHydrated();
  const since = new Date();
  since.setDate(since.getDate() - 7);
  return useMealStore.getState().meals
    .filter((meal) => meal.timestamp >= since)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
