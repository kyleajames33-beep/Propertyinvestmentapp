import { storage } from './storage';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: 0,
  }).format(value);
}

export interface ComparedProperty {
  id: string;
  address: string;
  price: number;
  stampDuty: number;
  strataFees?: number;
  councilRates?: number;
  waterRates?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  landSize?: number;
  commuteTime?: number;
  inspectionDate?: string;
  inspectionNotes?: string;
  pros: string[];
  cons: string[];
  score?: number;
  imageUrl?: string;
  dateAdded: string;
}

const STORAGE_KEY = 'compare_properties';

export function getComparedProperties(): ComparedProperty[] {
  return storage.get<ComparedProperty[]>(STORAGE_KEY, []);
}

export function addComparedProperty(property: Omit<ComparedProperty, 'id' | 'dateAdded'>): ComparedProperty {
  const existing = getComparedProperties();
  const newProperty: ComparedProperty = {
    ...property,
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
    dateAdded: new Date().toISOString(),
  };
  storage.set(STORAGE_KEY, [...existing, newProperty]);
  return newProperty;
}

export function updateComparedProperty(id: string, updates: Partial<ComparedProperty>): ComparedProperty | null {
  const existing = getComparedProperties();
  const idx = existing.findIndex(p => p.id === id);
  if (idx === -1) return null;
  const updated = { ...existing[idx], ...updates };
  existing[idx] = updated;
  storage.set(STORAGE_KEY, existing);
  return updated;
}

export function removeComparedProperty(id: string): boolean {
  const existing = getComparedProperties();
  const filtered = existing.filter(p => p.id !== id);
  if (filtered.length === existing.length) return false;
  storage.set(STORAGE_KEY, filtered);
  return true;
}

export function clearComparedProperties(): void {
  storage.remove(STORAGE_KEY);
}

export function getPropertyComparisonStats(properties: ComparedProperty[]) {
  if (properties.length === 0) return null;
  
  const prices = properties.map(p => p.price).filter(Boolean);
  const duties = properties.map(p => p.stampDuty).filter(Boolean);
  const strata = properties.map(p => p.strataFees).filter(Boolean);
  const commutes = properties.map(p => p.commuteTime).filter(Boolean);
  
  return {
    cheapest: prices.length ? Math.min(...prices) : null,
    mostExpensive: prices.length ? Math.max(...prices) : null,
    lowestStampDuty: duties.length ? Math.min(...duties) : null,
    lowestStrata: strata.length ? Math.min(...strata) : null,
    shortestCommute: commutes.length ? Math.min(...commutes) : null,
    avgPrice: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null,
  };
}
