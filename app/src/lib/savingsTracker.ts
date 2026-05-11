import { storage } from './storage';

export interface SavingsEntry {
  id: string;
  date: string;
  amount: number;
  note?: string;
  source: 'salary' | 'bonus' | 'gift' | 'investment' | 'fhsss' | 'other';
}

export interface SavingsGoal {
  targetAmount: number;
  targetDate?: string;
  propertyPriceEstimate?: number;
  monthlyCommitment?: number;
}

const ENTRIES_KEY = 'savings_entries';
const GOAL_KEY = 'savings_goal';

export function getSavingsEntries(): SavingsEntry[] {
  return storage.get<SavingsEntry[]>(ENTRIES_KEY, []);
}

export function addSavingsEntry(entry: Omit<SavingsEntry, 'id'>): SavingsEntry {
  const existing = getSavingsEntries();
  const newEntry: SavingsEntry = {
    ...entry,
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
  };
  storage.set(ENTRIES_KEY, [...existing, newEntry]);
  return newEntry;
}

export function removeSavingsEntry(id: string): boolean {
  const existing = getSavingsEntries();
  const filtered = existing.filter(e => e.id !== id);
  if (filtered.length === existing.length) return false;
  storage.set(ENTRIES_KEY, filtered);
  return true;
}

export function getSavingsGoal(): SavingsGoal | null {
  return storage.get<SavingsGoal | null>(GOAL_KEY, null);
}

export function setSavingsGoal(goal: SavingsGoal): void {
  storage.set(GOAL_KEY, goal);
}

export function getTotalSaved(): number {
  return getSavingsEntries().reduce((sum, e) => sum + e.amount, 0);
}

export function getMonthlyTotals(): Array<{ month: string; amount: number; entries: number }> {
  const entries = getSavingsEntries();
  const byMonth = new Map<string, { amount: number; entries: number }>();
  
  for (const entry of entries) {
    const month = entry.date.slice(0, 7); // YYYY-MM
    const current = byMonth.get(month) || { amount: 0, entries: 0 };
    byMonth.set(month, { amount: current.amount + entry.amount, entries: current.entries + 1 });
  }
  
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({ month, ...data }));
}

export function getAverageMonthlySavings(): number {
  const monthly = getMonthlyTotals();
  if (monthly.length === 0) return 0;
  return Math.round(monthly.reduce((sum, m) => sum + m.amount, 0) / monthly.length);
}

export function getProjectedDate(targetAmount: number): string | null {
  const current = getTotalSaved();
  if (current >= targetAmount) return null;
  
  const monthlyAvg = getAverageMonthlySavings();
  if (monthlyAvg <= 0) return null;
  
  const remaining = targetAmount - current;
  const monthsNeeded = Math.ceil(remaining / monthlyAvg);
  
  const projected = new Date();
  projected.setMonth(projected.getMonth() + monthsNeeded);
  return projected.toISOString().split('T')[0];
}

export function getSavingsStreak(): number {
  const monthly = getMonthlyTotals();
  if (monthly.length === 0) return 0;
  
  // Sort descending
  const sorted = [...monthly].sort((a, b) => b.month.localeCompare(a.month));
  
  let streak = 0;
  const now = new Date();
  
  for (let i = 0; i < sorted.length; i++) {
    const [year, month] = sorted[i].month.split('-').map(Number);
    const entryDate = new Date(year, month - 1);
    const expectedDate = new Date(now.getFullYear(), now.getMonth() - i);
    
    if (entryDate.getFullYear() === expectedDate.getFullYear() && 
        entryDate.getMonth() === expectedDate.getMonth()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export const sourceLabels: Record<string, string> = {
  salary: 'Salary',
  bonus: 'Bonus',
  gift: 'Gift',
  investment: 'Investment',
  fhsss: 'FHSSS',
  other: 'Other',
};

export const sourceColours: Record<string, string> = {
  salary: '#2d6a4f',
  bonus: '#40916c',
  gift: '#52b788',
  investment: '#74c69d',
  fhsss: '#95d5b2',
  other: '#b7e4c7',
};
