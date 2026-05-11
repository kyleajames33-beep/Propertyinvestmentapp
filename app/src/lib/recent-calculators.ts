import { storage } from '@/lib/storage';

export type RecentCalc = {
  id: string;
  title: string;
  openedAt: number;
};

const STORAGE_KEY = 'recent_calculators';
const MAX_RECENT = 5;

export function trackCalcOpen(calcId: string, calcTitle: string) {
  const existing = getRecentCalculators();
  const filtered = existing.filter((c) => c.id !== calcId);
  const updated: RecentCalc[] = [
    { id: calcId, title: calcTitle, openedAt: Date.now() },
    ...filtered,
  ].slice(0, MAX_RECENT);
  storage.set(STORAGE_KEY, updated);
}

export function getRecentCalculators(): RecentCalc[] {
  return storage.get<RecentCalc[]>(STORAGE_KEY, []);
}

export function clearRecentCalculators() {
  storage.remove(STORAGE_KEY);
}
