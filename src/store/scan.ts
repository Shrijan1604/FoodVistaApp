import { create } from 'zustand';
import type { Meal } from '../services/meals';
type ScanState = { result: Meal | null; setResult: (meal: Meal | null) => void };
export const useScanStore = create<ScanState>((set) => ({ result: null, setResult: (result) => set({ result }) }));
