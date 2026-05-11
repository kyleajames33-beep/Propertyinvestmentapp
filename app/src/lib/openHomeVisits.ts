import { storage } from './storage';

export interface OpenHomeVisit {
  id: string;
  propertyAddress: string;
  date: string;
  time: string;
  agentName?: string;
  agentPhone?: string;
  notes?: string;
  rating?: number;
  pros?: string[];
  cons?: string[];
  price?: number;
  status: 'upcoming' | 'attended' | 'cancelled';
  dateAdded: string;
}

const STORAGE_KEY = 'open_home_visits';

export function getOpenHomeVisits(): OpenHomeVisit[] {
  return storage.get<OpenHomeVisit[]>(STORAGE_KEY, []);
}

export function addOpenHomeVisit(visit: Omit<OpenHomeVisit, 'id' | 'dateAdded'>): OpenHomeVisit {
  const existing = getOpenHomeVisits();
  const newVisit: OpenHomeVisit = {
    ...visit,
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    dateAdded: new Date().toISOString(),
  };
  storage.set(STORAGE_KEY, [...existing, newVisit]);
  return newVisit;
}

export function updateOpenHomeVisit(id: string, updates: Partial<OpenHomeVisit>): OpenHomeVisit | null {
  const existing = getOpenHomeVisits();
  const idx = existing.findIndex(v => v.id === id);
  if (idx === -1) return null;
  const updated = { ...existing[idx], ...updates };
  existing[idx] = updated;
  storage.set(STORAGE_KEY, existing);
  return updated;
}

export function removeOpenHomeVisit(id: string): boolean {
  const existing = getOpenHomeVisits();
  const filtered = existing.filter(v => v.id !== id);
  if (filtered.length === existing.length) return false;
  storage.set(STORAGE_KEY, filtered);
  return true;
}

export function getUpcomingVisits(): OpenHomeVisit[] {
  const now = new Date().toISOString().split('T')[0];
  return getOpenHomeVisits()
    .filter(v => v.status === 'upcoming' && v.date >= now)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
}

export function getPastVisits(): OpenHomeVisit[] {
  const now = new Date().toISOString().split('T')[0];
  return getOpenHomeVisits()
    .filter(v => v.status === 'attended' || v.date < now)
    .sort((a, b) => b.date.localeCompare(a.date));
}
