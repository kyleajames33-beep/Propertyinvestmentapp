import { BookOpen, Calculator, FileText, Scale, Home, Shield, Landmark, Receipt, Percent, Building2 } from 'lucide-react';

export interface ReferenceItem {
  slug: string;
  title: string;
  description: string;
  iconName: string;
  tag: string;
}

export const references: ReferenceItem[] = [
  {
    slug: 'nsw-stamp-duty-rules',
    title: 'NSW stamp duty rules',
    description: 'Complete guide to stamp duty brackets, first home buyer concessions, foreign purchaser surcharge, and worked examples for NSW.',
    iconName: 'Receipt',
    tag: 'Essential',
  },
  {
    slug: 'nsw-fhb-schemes',
    title: 'NSW first home buyer schemes',
    description: 'All first home buyer assistance programs: FHBAS, FHOG, Shared Equity, Help to Buy, Home Guarantee, and First Home Super Saver.',
    iconName: 'Home',
    tag: 'FHB',
  },
  {
    slug: 'nsw-land-tax',
    title: 'NSW land tax',
    description: 'Land tax thresholds, foreign owner surcharge, trust treatment, and worked examples for investors.',
    iconName: 'Landmark',
    tag: 'Investor',
  },
  {
    slug: 'apra-serviceability-basics',
    title: 'APRA serviceability basics',
    description: 'How lenders assess your borrowing capacity, serviceability buffers, LVR requirements, and current lending rules.',
    iconName: 'Calculator',
    tag: 'Finance',
  },
  {
    slug: 'ato-investment-property-basics',
    title: 'ATO investment property basics',
    description: 'Rental income, deductions, depreciation, negative gearing, capital gains tax, and record keeping requirements.',
    iconName: 'Percent',
    tag: 'Tax',
  },
  {
    slug: 'strata-vs-torrens',
    title: 'Strata vs torrens title',
    description: 'Understanding the difference, strata levies, bylaws, common issues, and due diligence for apartments.',
    iconName: 'Building2',
    tag: 'Essential',
  },
  {
    slug: 'building-pest-inspection-guide',
    title: 'Building and pest inspection guide',
    description: 'What inspections cover, when to get them, how to read reports, and common issues in NSW properties.',
    iconName: 'Shield',
    tag: 'Essential',
  },
  {
    slug: 'conveyancer-vs-solicitor-nsw',
    title: 'Conveyancer vs solicitor in NSW',
    description: 'Key differences, when to use which, typical fees, the conveyancing process, and PEXA.',
    iconName: 'Scale',
    tag: 'Essential',
  },
  {
    slug: 'offset-vs-redraw',
    title: 'Offset account vs redraw facility',
    description: 'Key differences, tax implications for investors, and which works better for your situation.',
    iconName: 'Calculator',
    tag: 'Finance',
  },
  {
    slug: 'pre-approval-process',
    title: 'Understanding the pre-approval process',
    description: 'What pre-approval actually is, the application process, expiry, and common pitfalls.',
    iconName: 'FileText',
    tag: 'Finance',
  },
];

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  BookOpen, Calculator, FileText, Scale, Home, Shield, Landmark, Receipt, Percent, Building2,
};

export function getRefIcon(iconName: string, className?: string) {
  const Icon = iconMap[iconName];
  return Icon ? <Icon className={className || 'h-5 w-5'} /> : null;
}
