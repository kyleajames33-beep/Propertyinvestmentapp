import { useState, useEffect } from 'react';
import { trackActivity, trackChecklistCompletion } from '@/lib/badges';
import { NewBadgeToast } from '@/components/BadgePanel';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ClipboardList, Download, Home, TrendingUp, Building2, Minimize2, CheckSquare, Inbox } from 'lucide-react';
import type { Persona } from '@/types/content';
import { personaLabels, personaColors } from '@/content/metadata';
import { SEO } from '@/components/SEO';
import { trackEvent } from '@/lib/analytics';
import { EmptyState } from '@/components/EmptyState';
import { CouplesInvite } from '@/components/CouplesInvite';
import { ScrollReveal } from '@/components/ScrollReveal';

const personaIcons: Record<Persona, React.ReactNode> = {
  'fhb-oo': <Home className="h-4 w-4" />,
  'inv-new': <TrendingUp className="h-4 w-4" />,
  'inv-exp': <Building2 className="h-4 w-4" />,
  'downsizer': <Minimize2 className="h-4 w-4" />,
};

const checklistData: Array<{
  id: string;
  stage: string;
  stageNum: number;
  persona: Persona;
  title: string;
  description: string;
  items: string[];
}> = [
  {
    id: '01-strategy-fhb-oo', stage: 'Strategy', stageNum: 1, persona: 'fhb-oo',
    title: 'Strategy Checklist — First Home Buyer',
    description: 'Assess your readiness, understand your schemes, and set your buying direction.',
    items: [
      'Calculate your total deposit (savings + gifts + FHSSS)',
      'Check your credit score via Equifax, Experian, or Illion',
      'Estimate your borrowing capacity using online calculators',
      'Research NSW first home buyer schemes you may qualify for',
      'Decide on house vs apartment, established vs new build',
      'Identify 3-5 target suburbs based on commute and budget',
      'Set a realistic timeline (6-12 months typical for FHBs)',
      'Consider exploring pre-approval before attending serious inspections',
      'Attend 5+ open homes to calibrate your expectations',
      'Document your must-haves vs nice-to-haves',
    ]
  },
  {
    id: '01-strategy-inv-new', stage: 'Strategy', stageNum: 1, persona: 'inv-new',
    title: 'Strategy Checklist — First-Time Investor',
    description: 'Define your investment strategy and structure before you start searching.',
    items: [
      'Choose your strategy: cashflow vs capital growth vs hybrid',
      'Calculate your investment borrowing capacity',
      'Understand how rental income shading affects serviceability',
      'Research tax implications: negative gearing, deductions, CGT',
      'Decide on ownership structure: personal, trust, or SMSF',
      'Set your target yield and cashflow requirements',
      'Identify 2-3 target markets for research',
      'Confirm if pre-approval is available for investment lending',
      'Engage a property-savvy accountant for structure advice',
      'Set your maximum purchase price and stick to it',
    ]
  },
  {
    id: '01-strategy-inv-exp', stage: 'Strategy', stageNum: 1, persona: 'inv-exp',
    title: 'Strategy Checklist — Experienced Investor',
    description: 'Review portfolio position, plan equity release, and set acquisition criteria.',
    items: [
      'Review current portfolio LVR and equity position',
      'Identify equity release opportunities',
      'Assess cross-collateralisation risks in current structure',
      'Set acquisition criteria: yield, growth, value-add potential',
      'Review land tax position and plan for new purchase impact',
      'Confirm financing strategy: new loan vs equity release',
      'Set maximum all-in purchase price including stamp duty',
      'Engage broker for portfolio-level pre-approval',
    ]
  },
  {
    id: '02-finance-fhb-oo', stage: 'Finance Prep', stageNum: 2, persona: 'fhb-oo',
    title: 'Finance Preparation — First Home Buyer',
    description: 'Get your finances in order before you start making offers.',
    items: [
      'Gather 3 months of bank statements for all accounts',
      'Collect 2 most recent payslips or tax returns if self-employed',
      'Explore pre-approval with a lender or mortgage broker',
      'Calculate total purchase costs including stamp duty',
      'Confirm FHOG eligibility if buying new',
      'Set up savings discipline: automate transfers',
      'Understand how credit card limits affect serviceability',
      'Avoid applying for new credit during pre-approval period',
      'Understand LMI costs if deposit is under 20%',
      'Confirm genuine savings requirements with your lender',
    ]
  },
  {
    id: '02-finance-inv-new', stage: 'Finance Prep', stageNum: 2, persona: 'inv-new',
    title: 'Finance Preparation — First-Time Investor',
    description: 'Secure investment-specific pre-approval and understand lender requirements.',
    items: [
      'Confirm rental income shading with lender (typically 80%)',
      'Understand investment LVR requirements (often 90% max)',
      'Research interest-only vs principal-and-interest options',
      'Compare fixed vs variable rates for investment loans',
      'Set up offset account for holding deposit and cash buffer',
      'Get pre-approval specific to investment property',
      'Calculate cashflow: rent minus all expenses including vacancy',
      'Confirm deposit source (equity vs cash)',
      'Understand lender requirements for rental income evidence',
    ]
  },
  {
    id: '02-finance-inv-exp', stage: 'Finance Prep', stageNum: 2, persona: 'inv-exp',
    title: 'Finance Preparation — Experienced Investor',
    description: 'Optimise portfolio finance for the next acquisition.',
    items: [
      'Review portfolio servicing with broker',
      'Confirm equity release amount available',
      'Structure loan to avoid cross-collateralisation',
      'Ensure sufficient cash buffer for 3 months expenses',
    ]
  },
  {
    id: '05-inspection-fhb-oo', stage: 'Inspection', stageNum: 5, persona: 'fhb-oo',
    title: 'Inspection Checklist — First Home Buyer',
    description: 'Thorough due diligence before you commit to buying.',
    items: [
      'Arrange building and pest inspection with a licensed inspector',
      'Review strata report if buying apartment',
      'Check flood zone mapping on NSW Planning Portal',
      'Verify bushfire prone land status',
      'Confirm no outstanding council orders',
      'Check for easements and covenants on title',
      'Inspect property at different times of day',
      'Test all taps, toilets, and electrical outlets',
      'Check for signs of water damage and damp',
      'Review recent comparable sales for price validation',
    ]
  },
  {
    id: '07-contract-fhb-oo', stage: 'Contract', stageNum: 7, persona: 'fhb-oo',
    title: 'Contract Review Checklist — First Home Buyer',
    description: 'Protect yourself during the legal phase of the purchase.',
    items: [
      'Engage a conveyancer or solicitor when ready',
      'Review the contract before signing',
      'Check if the contract includes a cooling off period',
      'Verify property boundaries',
      'Confirm inclusions and exclusions (fixtures, appliances)',
      'Check for special conditions that favour the vendor',
      'Verify deposit amount and payment timing',
      'Confirm settlement date works for your finance',
      'Review strata by-laws if applicable',
      'Consider waiting to exchange until finance is unconditionally approved',
    ]
  },
];

export function ChecklistsPage() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>('fhb-oo');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<typeof checklistData[0] | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [newBadge, setNewBadge] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('pp_checklists');
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pp_checklists', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const filtered = checklistData.filter(c => c.persona === selectedPersona);

  const openChecklist = (cl: typeof checklistData[0]) => {
    setSelectedChecklist(cl);
    setDialogOpen(true);
  };

  const toggleItem = (itemId: string, itemText: string) => {
    setCheckedItems(prev => {
      const next = { ...prev, [itemId]: !prev[itemId] };
      if (next[itemId]) {
        trackEvent('checklist_item_checked', { itemId, itemText });
      }
      const newBadges = trackActivity('checklist_check');
      if (newBadges.length > 0) setNewBadge(newBadges[0]);
      return next;
    });
  };

  const completedCount = selectedChecklist
    ? selectedChecklist.items.filter((_, i) => checkedItems[`${selectedChecklist.id}-${i}`]).length
    : 0;

  useEffect(() => {
    if (selectedChecklist && completedCount === selectedChecklist.items.length && completedCount > 0) {
      const { newBadges } = trackChecklistCompletion(selectedChecklist.items.length, completedCount);
      if (newBadges.length > 0) setNewBadge(newBadges[0]);
    }
  }, [completedCount, selectedChecklist]);

  return (
    <div className="pp-container py-12">
      <SEO title="Property Buying Checklists — PropertyPath" description="Printable checklists for every stage of buying property in NSW." />
      {newBadge && <NewBadgeToast badgeId={newBadge} onDismiss={() => setNewBadge(null)} />}
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <ClipboardList className="h-8 w-8 text-primary mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Checklists</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Printable checklists for every stage of your property journey. Take them to inspections, 
              meetings with professionals, and settlement.
            </p>
          </div>
        </ScrollReveal>

        {/* Persona filter */}
        <div className="flex justify-center gap-2 mb-8">
          {(['fhb-oo', 'inv-new', 'inv-exp'] as Persona[]).map(p => (
            <Button
              key={p}
              variant={selectedPersona === p ? 'default' : 'outline'}
              onClick={() => setSelectedPersona(p)}
              className="gap-2"
            >
              {personaIcons[p]}
              {personaLabels[p]}
            </Button>
          ))}
        </div>

        {/* Checklist grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((cl, i) => (
            <ScrollReveal key={cl.id} delay={i * 80}>
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openChecklist(cl)}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={`text-xs ${personaColors[cl.persona]}`}>{cl.stage}</Badge>
                  <span className="text-xs text-muted-foreground">Stage {cl.stageNum}</span>
                </div>
                <CardTitle className="text-base">{cl.title}</CardTitle>
                <CardDescription>{cl.description}</CardDescription>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                  <CheckSquare className="h-4 w-4" />
                  {cl.items.length} items
                </div>
              </CardHeader>
            </Card>
            </ScrollReveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <EmptyState
            icon={<Inbox className="h-8 w-8 text-slate-400" />}
            title="No checklists yet"
            description="Checklists for this buyer type are coming soon. In the meantime, explore our other buyer types or start your journey."
            action={{ label: 'Browse journeys', to: '/journey' }}
          />
        )}

        {/* Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedChecklist?.title}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{selectedChecklist?.stage}</Badge>
                <span className="text-sm text-muted-foreground">
                  {completedCount} of {selectedChecklist?.items.length || 0} completed
                </span>
              </div>
            </DialogHeader>
            <div className="space-y-3 mt-4">
              {selectedChecklist?.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                  <Checkbox
                    checked={checkedItems[`${selectedChecklist.id}-${idx}`] || false}
                    onCheckedChange={() => toggleItem(`${selectedChecklist.id}-${idx}`, item)}
                    className="mt-0.5"
                  />
                  <span className="text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6">
              <CouplesInvite checklistName={selectedChecklist?.title || 'Checklist'} />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setCheckedItems({})}>Reset</Button>
                <Button variant="outline" onClick={() => window.print()}>
                  <Download className="mr-2 h-4 w-4" />
                  Print
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
