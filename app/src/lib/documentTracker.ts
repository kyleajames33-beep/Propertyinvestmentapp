import { storage } from './storage';

export interface TrackedDocument {
  id: string;
  category: 'identity' | 'finance' | 'employment' | 'property' | 'insurance' | 'legal';
  name: string;
  description: string;
  required: boolean;
  status: 'not-started' | 'in-progress' | 'completed' | 'not-applicable';
  dueDate?: string;
  notes?: string;
  lenderSpecific?: boolean;
}

const STORAGE_KEY = 'document_tracker';

export const defaultDocuments: Omit<TrackedDocument, 'id'>[] = [
  { category: 'identity', name: 'Primary ID (Passport or Driver\'s Licence)', description: 'Valid government-issued photo ID', required: true, status: 'not-started' },
  { category: 'identity', name: 'Secondary ID (Medicare or Birth Certificate)', description: 'Secondary form of identification', required: true, status: 'not-started' },
  { category: 'finance', name: 'Last 2 Payslips', description: 'Most recent payslips showing YTD earnings', required: true, status: 'not-started' },
  { category: 'finance', name: 'Tax Returns (Last 2 years)', description: 'Notice of Assessment from the ATO', required: true, status: 'not-started' },
  { category: 'finance', name: 'Bank Statements (Last 3 months)', description: 'All accounts showing savings history', required: true, status: 'not-started' },
  { category: 'finance', name: 'Credit Card Statements', description: 'Showing limits and current balances', required: false, status: 'not-started' },
  { category: 'finance', name: 'Existing Loan Statements', description: 'If you have current mortgages or loans', required: false, status: 'not-started' },
  { category: 'employment', name: 'Employment Letter', description: 'Confirming position, salary, and employment type', required: true, status: 'not-started' },
  { category: 'employment', name: 'Contract of Employment', description: 'If casual or contract worker', required: false, status: 'not-started' },
  { category: 'property', name: 'Contract of Sale', description: 'Signed contract for the property you are buying', required: true, status: 'not-started' },
  { category: 'property', name: 'Building & Pest Inspection', description: 'Professional inspection report', required: true, status: 'not-started' },
  { category: 'property', name: 'Strata Report', description: 'If buying an apartment or townhouse', required: false, status: 'not-started' },
  { category: 'property', name: 'Valuation Report', description: 'Bank-ordered property valuation', required: false, status: 'not-started', lenderSpecific: true },
  { category: 'insurance', name: 'Building Insurance Quote', description: 'Quote for the property you are buying', required: true, status: 'not-started' },
  { category: 'insurance', name: 'Contents Insurance Quote', description: 'Optional but recommended', required: false, status: 'not-started' },
  { category: 'legal', name: 'Conveyancer / Solicitor Details', description: 'Contact details and engagement letter', required: true, status: 'not-started' },
  { category: 'legal', name: 'Mortgage Broker Details', description: 'If using a broker', required: false, status: 'not-started' },
  { category: 'legal', name: 'First Home Buyer Declaration', description: 'Required for stamp duty exemptions', required: false, status: 'not-started' },
  { category: 'finance', name: 'Gift Letter', description: 'If receiving deposit money as a gift', required: false, status: 'not-started' },
  { category: 'finance', name: 'FHSSS Release Request', description: 'First Home Super Saver Scheme release', required: false, status: 'not-started' },
];

export function getTrackedDocuments(): TrackedDocument[] {
  const saved = storage.get<TrackedDocument[]>(STORAGE_KEY);
  if (saved && saved.length > 0) return saved;
  
  // Initialise with defaults
  const initial = defaultDocuments.map(d => ({
    ...d,
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
  }));
  storage.set(STORAGE_KEY, initial);
  return initial;
}

export function updateDocumentStatus(id: string, status: TrackedDocument['status']): void {
  const docs = getTrackedDocuments();
  const idx = docs.findIndex(d => d.id === id);
  if (idx !== -1) {
    docs[idx].status = status;
    storage.set(STORAGE_KEY, docs);
  }
}

export function updateDocumentNotes(id: string, notes: string): void {
  const docs = getTrackedDocuments();
  const idx = docs.findIndex(d => d.id === id);
  if (idx !== -1) {
    docs[idx].notes = notes;
    storage.set(STORAGE_KEY, docs);
  }
}

export function updateDocumentDueDate(id: string, dueDate: string): void {
  const docs = getTrackedDocuments();
  const idx = docs.findIndex(d => d.id === id);
  if (idx !== -1) {
    docs[idx].dueDate = dueDate;
    storage.set(STORAGE_KEY, docs);
  }
}

export function resetDocumentTracker(): void {
  storage.remove(STORAGE_KEY);
}

export function getDocumentStats(docs: TrackedDocument[]) {
  const total = docs.length;
  const completed = docs.filter(d => d.status === 'completed').length;
  const inProgress = docs.filter(d => d.status === 'in-progress').length;
  const notStarted = docs.filter(d => d.status === 'not-started').length;
  const required = docs.filter(d => d.required);
  const requiredCompleted = required.filter(d => d.status === 'completed').length;
  const overdue = docs.filter(d => {
    if (!d.dueDate || d.status === 'completed' || d.status === 'not-applicable') return false;
    return new Date(d.dueDate) < new Date();
  }).length;

  return {
    total,
    completed,
    inProgress,
    notStarted,
    requiredTotal: required.length,
    requiredCompleted,
    overdue,
    pct: Math.round((completed / total) * 100),
    requiredPct: required.length ? Math.round((requiredCompleted / required.length) * 100) : 0,
  };
}

export const categoryLabels: Record<string, string> = {
  identity: 'Identity',
  finance: 'Finance',
  employment: 'Employment',
  property: 'Property',
  insurance: 'Insurance',
  legal: 'Legal',
};

export const categoryColours: Record<string, string> = {
  identity: 'bg-blue-50 text-blue-700 border-blue-200',
  finance: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  employment: 'bg-violet-50 text-violet-700 border-violet-200',
  property: 'bg-amber-50 text-amber-700 border-amber-200',
  insurance: 'bg-rose-50 text-rose-700 border-rose-200',
  legal: 'bg-slate-50 text-slate-700 border-slate-200',
};
