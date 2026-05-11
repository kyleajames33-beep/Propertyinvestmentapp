import { storage } from './storage';

export interface InspectionCheck {
  id: string;
  category: 'exterior' | 'interior' | 'kitchen' | 'bathroom' | 'bedroom' | 'living' | 'outdoor' | 'services';
  item: string;
  description: string;
  critical: boolean;
  status: 'not-checked' | 'pass' | 'fail' | 'concern';
  notes?: string;
  photoUrl?: string;
}

const STORAGE_KEY = 'inspection_checks';

export const defaultInspectionChecks: Omit<InspectionCheck, 'id'>[] = [
  // Exterior
  { category: 'exterior', item: 'Roof condition', description: 'Look for missing tiles, rust, sagging', critical: true, status: 'not-checked' },
  { category: 'exterior', item: 'Gutters and downpipes', description: 'Check for blockages, rust, proper drainage', critical: false, status: 'not-checked' },
  { category: 'exterior', item: 'External walls', description: 'Cracks, damp spots, peeling paint', critical: true, status: 'not-checked' },
  { category: 'exterior', item: 'Foundation', description: 'Large cracks, subsidence, unevenness', critical: true, status: 'not-checked' },
  { category: 'exterior', item: 'Windows and frames', description: 'Rot, cracks, proper sealing, open/close smoothly', critical: false, status: 'not-checked' },
  { category: 'exterior', item: 'Doors and locks', description: 'All doors open/close, locks work', critical: false, status: 'not-checked' },
  { category: 'exterior', item: 'Fencing', description: 'Stability, boundary alignment, condition', critical: false, status: 'not-checked' },
  { category: 'exterior', item: 'Driveway and paths', description: 'Cracks, drainage, trip hazards', critical: false, status: 'not-checked' },
  // Interior
  { category: 'interior', item: 'Ceilings', description: 'Cracks, stains, sagging, mould', critical: true, status: 'not-checked' },
  { category: 'interior', item: 'Walls', description: 'Cracks, damp patches, bubbling paint', critical: true, status: 'not-checked' },
  { category: 'interior', item: 'Floors', description: 'Level, squeaks, stains, damage under rugs', critical: false, status: 'not-checked' },
  { category: 'interior', item: 'Skirting boards', description: 'Gaps, rot, termite damage', critical: false, status: 'not-checked' },
  { category: 'interior', item: 'Power points', description: 'All working, sufficient number per room', critical: false, status: 'not-checked' },
  { category: 'interior', item: 'Light switches', description: 'All functioning, properly mounted', critical: false, status: 'not-checked' },
  // Kitchen
  { category: 'kitchen', item: 'Benchtop condition', description: 'Cracks, burns, water damage', critical: false, status: 'not-checked' },
  { category: 'kitchen', item: 'Cupboards and drawers', description: 'Open/close smoothly, hinges intact', critical: false, status: 'not-checked' },
  { category: 'kitchen', item: 'Sink and taps', description: 'Water pressure, drainage, leaks', critical: true, status: 'not-checked' },
  { category: 'kitchen', item: 'Oven and cooktop', description: 'All elements working, fans operating', critical: false, status: 'not-checked' },
  { category: 'kitchen', item: 'Rangehood', description: 'Extracts properly, clean filters', critical: false, status: 'not-checked' },
  { category: 'kitchen', item: 'Dishwasher', description: 'Run a cycle if possible, check for leaks', critical: false, status: 'not-checked' },
  // Bathroom
  { category: 'bathroom', item: 'Water pressure', description: 'Shower and taps have good flow', critical: true, status: 'not-checked' },
  { category: 'bathroom', item: 'Hot water', description: 'Water heats up, sufficient capacity', critical: true, status: 'not-checked' },
  { category: 'bathroom', item: 'Drainage', description: 'Sinks and shower drain properly', critical: true, status: 'not-checked' },
  { category: 'bathroom', item: 'Toilet', description: 'Flushes properly, no leaks, stable', critical: true, status: 'not-checked' },
  { category: 'bathroom', item: 'Mould and damp', description: 'Check ceilings, corners, grout', critical: true, status: 'not-checked' },
  { category: 'bathroom', item: 'Exhaust fan', description: 'Works properly, vents outside', critical: false, status: 'not-checked' },
  { category: 'bathroom', item: 'Waterproofing', description: 'Grout condition, sealant around fixtures', critical: true, status: 'not-checked' },
  // Bedroom
  { category: 'bedroom', item: 'Wardrobes', description: 'Doors slide/open, shelving intact', critical: false, status: 'not-checked' },
  { category: 'bedroom', item: 'Natural light', description: 'Window size, aspect, morning/afternoon sun', critical: false, status: 'not-checked' },
  { category: 'bedroom', item: 'Noise levels', description: 'Street noise, neighbours, aircraft', critical: false, status: 'not-checked' },
  { category: 'bedroom', item: 'Built-ins', description: 'Condition, sufficient storage', critical: false, status: 'not-checked' },
  // Living
  { category: 'living', item: 'Room size and layout', description: 'Furniture fit, flow between rooms', critical: false, status: 'not-checked' },
  { category: 'living', item: 'Heating/cooling', description: 'Reverse cycle, gas, fireplace condition', critical: false, status: 'not-checked' },
  { category: 'living', item: 'Natural ventilation', description: 'Cross breeze, window placement', critical: false, status: 'not-checked' },
  // Outdoor
  { category: 'outdoor', item: 'Garden and drainage', description: 'Slope away from house, soggy spots', critical: true, status: 'not-checked' },
  { category: 'outdoor', item: 'Trees and roots', description: 'Proximity to house, sewer lines', critical: true, status: 'not-checked' },
  { category: 'outdoor', item: 'Balcony/deck', description: 'Rot, rust, structural integrity', critical: true, status: 'not-checked' },
  { category: 'outdoor', item: 'Pool or spa', description: 'Pump, filter, fence compliance', critical: false, status: 'not-checked' },
  // Services
  { category: 'services', item: 'Electrical switchboard', description: 'Age, capacity, safety switches', critical: true, status: 'not-checked' },
  { category: 'services', item: 'Hot water system', description: 'Age, type, capacity, condition', critical: true, status: 'not-checked' },
  { category: 'services', item: 'Air conditioning', description: 'Age, service history, operation', critical: false, status: 'not-checked' },
  { category: 'services', item: 'NBN connection', description: 'Technology type, speed available', critical: false, status: 'not-checked' },
  { category: 'services', item: 'Gas connection', description: 'Meter location, leak test', critical: false, status: 'not-checked' },
  { category: 'services', item: 'Smoke alarms', description: 'Number, location, compliance', critical: true, status: 'not-checked' },
];

export function getInspectionChecks(): InspectionCheck[] {
  const saved = storage.get<InspectionCheck[]>(STORAGE_KEY);
  if (saved && saved.length > 0) return saved;
  const initial = defaultInspectionChecks.map(c => ({
    ...c,
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
  }));
  storage.set(STORAGE_KEY, initial);
  return initial;
}

export function updateInspectionCheck(id: string, updates: Partial<InspectionCheck>): void {
  const checks = getInspectionChecks();
  const idx = checks.findIndex(c => c.id === id);
  if (idx !== -1) {
    checks[idx] = { ...checks[idx], ...updates };
    storage.set(STORAGE_KEY, checks);
  }
}

export function resetInspectionChecks(): void {
  storage.remove(STORAGE_KEY);
}

export function getInspectionStats(checks: InspectionCheck[]) {
  const total = checks.length;
  const checked = checks.filter(c => c.status !== 'not-checked').length;
  const passed = checks.filter(c => c.status === 'pass').length;
  const failed = checks.filter(c => c.status === 'fail').length;
  const concerns = checks.filter(c => c.status === 'concern').length;
  const criticalFails = checks.filter(c => c.critical && c.status === 'fail').length;
  return { total, checked, passed, failed, concerns, criticalFails, pct: total ? Math.round((checked / total) * 100) : 0 };
}

export const inspectionCategoryLabels: Record<string, string> = {
  exterior: 'Exterior',
  interior: 'Interior',
  kitchen: 'Kitchen',
  bathroom: 'Bathroom',
  bedroom: 'Bedroom',
  living: 'Living',
  outdoor: 'Outdoor',
  services: 'Services',
};
