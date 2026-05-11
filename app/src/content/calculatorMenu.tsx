import {
  Calculator, Receipt, Home, Play, TrendingUp, PiggyBank, ArrowRightLeft,
  RefreshCw, Unlock, Target, Landmark, Scale, Wrench, Percent, ShieldCheck,
  Gift, Truck, Map, Hammer, Briefcase, Clock, Users, Building2,
} from 'lucide-react';

export type CalcId =
  | 'borrowing' | 'stamp' | 'mortgage' | 'simulator' | 'rentvbuy' | 'cashflow' | 'offset'
  | 'refinance' | 'equity' | 'deposit' | 'landtax' | 'compare' | 'depreciation' | 'cgt'
  | 'stress' | 'grants' | 'moving' | 'suburbs' | 'reno' | 'rentvest' | 'timemachine' | 'cobuy' | 'strata';

export interface CalcMenuItem {
  id: CalcId;
  title: string;
  description: string;
  iconName: string;
  badge: string;
  color: string;
}

export const calcMenu: CalcMenuItem[] = [
  { id: 'simulator', title: 'Life Simulator', description: '10-year animated simulation with personalised family, pets, investments.', iconName: 'Play', badge: 'Flagship', color: 'from-violet-500 to-purple-400' },
  { id: 'borrowing', title: 'Borrowing Power', description: 'Income + expenses + deposit → max loan with live chart across rates.', iconName: 'TrendingUp', badge: 'Essential', color: 'from-blue-500 to-blue-400' },
  { id: 'stress', title: 'Rate Stress Test', description: 'See how your mortgage holds up if rates rise 1%, 2%, or 3%.', iconName: 'ShieldCheck', badge: 'Essential', color: 'from-red-500 to-orange-400' },
  { id: 'grants', title: 'FHBG Eligibility', description: 'Check what NSW First Home Buyer grants and schemes you qualify for.', iconName: 'Gift', badge: 'FHB', color: 'from-emerald-500 to-teal-400' },
  { id: 'stamp', title: 'Stamp Duty', description: 'NSW transfer duty with First Home Buyer concessions.', iconName: 'Receipt', badge: 'Essential', color: 'from-amber-500 to-orange-400' },
  { id: 'suburbs', title: 'Suburb Heatmap', description: 'Enter your budget and see which NSW suburbs you can afford.', iconName: 'Map', badge: 'Research', color: 'from-cyan-500 to-sky-400' },
  { id: 'mortgage', title: 'Mortgage', description: 'Weekly/fortnightly/monthly repayments with amortisation chart.', iconName: 'Home', badge: 'Finance', color: 'from-teal-500 to-emerald-400' },
  { id: 'rentvbuy', title: 'Rent vs Buy', description: 'Break-even analysis — when does buying beat renting + investing?', iconName: 'ArrowRightLeft', badge: 'Strategy', color: 'from-indigo-500 to-purple-400' },
  { id: 'rentvest', title: 'Rentvesting', description: 'Rent where you want to live, buy investment elsewhere.', iconName: 'Briefcase', badge: 'Strategy', color: 'from-pink-500 to-rose-400' },
  { id: 'cashflow', title: 'Cashflow', description: 'Rental income minus ALL expenses → weekly net cashflow.', iconName: 'PiggyBank', badge: 'Investor', color: 'from-emerald-500 to-green-400' },
  { id: 'offset', title: 'Offset vs Redraw', description: 'Interest saved comparison + tax implications.', iconName: 'Calculator', badge: 'Finance', color: 'from-orange-500 to-red-400' },
  { id: 'refinance', title: 'Refinance', description: 'Compare current loan to a new rate — savings, break-even.', iconName: 'RefreshCw', badge: 'Finance', color: 'from-cyan-500 to-blue-400' },
  { id: 'equity', title: 'Equity Release', description: 'How much equity can you access for your next property?', iconName: 'Unlock', badge: 'Investor', color: 'from-pink-500 to-rose-400' },
  { id: 'deposit', title: 'Deposit Goal', description: 'Set your target price and see when you will have enough saved.', iconName: 'Target', badge: 'Essential', color: 'from-sky-500 to-blue-400' },
  { id: 'moving', title: 'Moving Costs', description: 'All hidden costs of buying and moving.', iconName: 'Truck', badge: 'Planning', color: 'from-sky-500 to-cyan-400' },
  { id: 'reno', title: 'Renovation ROI', description: 'Will your renovation pay for itself when you sell?', iconName: 'Hammer', badge: 'Strategy', color: 'from-amber-600 to-orange-500' },
  { id: 'timemachine', title: 'Time Machine', description: 'What if you bought 5, 10, or 15 years ago?', iconName: 'Clock', badge: 'Insights', color: 'from-violet-600 to-purple-500' },
  { id: 'cobuy', title: 'Co-Buy', description: 'Buy with family or friends — split costs and equity fairly.', iconName: 'Users', badge: 'Planning', color: 'from-teal-600 to-emerald-500' },
  { id: 'strata', title: 'House vs Unit', description: 'Strata fees vs. land rates — which costs more over time?', iconName: 'Building2', badge: 'Strategy', color: 'from-yellow-600 to-amber-500' },
  { id: 'landtax', title: 'Land Tax', description: 'NSW land tax for investment properties and trusts.', iconName: 'Landmark', badge: 'Investor', color: 'from-yellow-600 to-amber-500' },
  { id: 'compare', title: 'Compare', description: 'Side-by-side property comparison — yield, cashflow, features.', iconName: 'Scale', badge: 'Strategy', color: 'from-violet-600 to-indigo-500' },
  { id: 'depreciation', title: 'Depreciation', description: 'Division 40 + 43 tax deductions for investors.', iconName: 'Wrench', badge: 'Investor', color: 'from-teal-600 to-emerald-500' },
  { id: 'cgt', title: 'CGT', description: 'Capital Gains Tax estimator with 50% discount.', iconName: 'Percent', badge: 'Investor', color: 'from-amber-600 to-orange-500' },
];

// Icon component map for rendering
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Play, TrendingUp, ShieldCheck, Gift, Receipt, Map, Home, ArrowRightLeft,
  Briefcase, PiggyBank, Calculator, RefreshCw, Unlock, Target, Truck, Hammer,
  Clock, Users, Building2, Landmark, Scale, Wrench, Percent,
};

export function getCalcIcon(iconName: string, className?: string) {
  const Icon = iconMap[iconName];
  return Icon ? <Icon className={className || 'h-5 w-5'} /> : null;
}
