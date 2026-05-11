// Lightweight metadata — imported by HomePage and Layout (NOT the markdown content)
import type { Persona } from '@/types/content';

export const stageOrder = [
  '01-strategy',
  '02-finance-prep',
  '03-market-research',
  '04-shortlisting',
  '05-inspection-dd',
  '06-offer-negotiation',
  '07-contract-review',
  '08-settlement',
];

export const stageSlugs: Record<string, string> = {
  '01-strategy': 'strategy',
  '02-finance-prep': 'finance-prep',
  '03-market-research': 'market-research',
  '04-shortlisting': 'shortlisting',
  '05-inspection-dd': 'inspection-due-diligence',
  '06-offer-negotiation': 'offer-negotiation',
  '07-contract-review': 'contract-review',
  '08-settlement': 'settlement',
};

export const stageTitles: Record<string, string> = {
  '01-strategy': 'Strategy',
  '02-finance-prep': 'Finance Preparation',
  '03-market-research': 'Market Research',
  '04-shortlisting': 'Shortlisting',
  '05-inspection-dd': 'Inspection and Due Diligence',
  '06-offer-negotiation': 'Offer and Negotiation',
  '07-contract-review': 'Contract Review',
  '08-settlement': 'Settlement',
};

export const stageDescriptions: Record<string, string> = {
  '01-strategy': 'Set your direction and assess readiness',
  '02-finance-prep': 'Get your finances and pre-approval sorted',
  '03-market-research': 'Research suburbs and market conditions',
  '04-shortlisting': 'Narrow down and evaluate properties',
  '05-inspection-dd': 'Thorough due diligence before offering',
  '06-offer-negotiation': 'Make offers and negotiate terms',
  '07-contract-review': 'Legal review and contract exchange',
  '08-settlement': 'Finalise the purchase and take ownership',
};

export const personaLabels: Record<Persona, string> = {
  'fhb-oo': 'First Home Buyer',
  'inv-new': 'First-Time Investor',
  'inv-exp': 'Experienced Investor',
  'downsizer': 'Downsizer',
};

export const personaColors: Record<Persona, string> = {
  'fhb-oo': 'bg-sky-100 text-sky-800 border-sky-200',
  'inv-new': 'bg-teal-100 text-teal-800 border-teal-200',
  'inv-exp': 'bg-violet-100 text-violet-800 border-violet-200',
  'downsizer': 'bg-rose-100 text-rose-800 border-rose-200',
};

export const personaDescriptions: Record<Persona, string> = {
  'fhb-oo': 'Buying your first home to live in',
  'inv-new': 'Building your first investment property',
  'inv-exp': 'Scaling your property portfolio',
  'downsizer': 'Selling the family home and buying something smaller',
};

export const personaIcons: Record<Persona, string> = {
  'fhb-oo': 'Home',
  'inv-new': 'TrendingUp',
  'inv-exp': 'Building2',
  'downsizer': 'Minimize2',
};
