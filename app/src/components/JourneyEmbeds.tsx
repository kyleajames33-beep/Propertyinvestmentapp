import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DepositStackDiagram,
  TimelineDiagram,
  CostDonutDiagram,
  FlowDiagram,
  LvrGaugeDiagram,
} from '@/components/diagrams';
import type { Persona } from '@/types/content';

// Lazy load calculators to avoid bundling all into journey pages
const BorrowingPowerCalculator = lazy(() => import('@/components/calculators/BorrowingPowerCalculator').then(m => ({ default: m.BorrowingPowerCalculator })));
const DepositGoalCalculator = lazy(() => import('@/components/calculators/DepositGoalCalculator').then(m => ({ default: m.DepositGoalCalculator })));
const StampDutyCalculator = lazy(() => import('@/components/calculators/StampDutyCalculator').then(m => ({ default: m.StampDutyCalculator })));
const MortgageRepaymentCalculator = lazy(() => import('@/components/calculators/MortgageRepaymentCalculator').then(m => ({ default: m.MortgageRepaymentCalculator })));
const LifeSimulator = lazy(() => import('@/components/calculators/LifeSimulator').then(m => ({ default: m.LifeSimulator })));
const PropertyComparisonCalculator = lazy(() => import('@/components/calculators/PropertyComparisonCalculator').then(m => ({ default: m.PropertyComparisonCalculator })));
const InvestmentCashflowCalculator = lazy(() => import('@/components/calculators/InvestmentCashflowCalculator').then(m => ({ default: m.InvestmentCashflowCalculator })));
const OffsetVsRedrawCalculator = lazy(() => import('@/components/calculators/OffsetVsRedrawCalculator').then(m => ({ default: m.OffsetVsRedrawCalculator })));
const CGTCalculator = lazy(() => import('@/components/calculators/CGTCalculator').then(m => ({ default: m.CGTCalculator })));
const EquityReleaseCalculator = lazy(() => import('@/components/calculators/EquityReleaseCalculator').then(m => ({ default: m.EquityReleaseCalculator })));

function CalcWrapper({ title, children }: { title: string; children: React.ReactNode; calcId?: string }) {
  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/calculators`}>Open full calculator →</Link>
        </Button>
      </div>
      <Suspense fallback={<div className="pp-calc-card text-center py-12 text-slate-400">Loading calculator...</div>}>
        {children}
      </Suspense>
    </div>
  );
}

function DiagramWrapper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="my-8">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-teal-600" />
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ───────────────────────────────────────────
   Stage-specific embeds
   ─────────────────────────────────────────── */

function Stage01_Strategy({ }: { persona: Persona }) {
  return (
    <>
      <DiagramWrapper title="Deposit Building Blocks">
        <DepositStackDiagram
          sources={[
            { label: 'Personal Savings', amount: 45000, color: '#2563eb', icon: '' },
            { label: 'First Home Guarantee', amount: 0, color: '#7c3aed', icon: '' },
            { label: 'Super Saver', amount: 15000, color: '#0891b2', icon: '' },
            { label: 'Gift / Inheritance', amount: 20000, color: '#059669', icon: '' },
            { label: 'Investments Sold', amount: 10000, color: '#d97706', icon: '' },
          ]}
          targetDeposit={120000}
        />
      </DiagramWrapper>

      <DiagramWrapper title="The Property Buying Journey">
        <FlowDiagram
          title="From Decision to Keys"
          steps={[
            { label: 'Strategy', description: 'Define your goals and budget', color: '#2563eb' },
            { label: 'Save Deposit', description: 'Build your deposit + get pre-approval', color: '#3b82f6' },
            { label: 'Research', description: 'Find suburbs and properties', color: '#06b6d4' },
            { label: 'Inspect', description: 'Attend opens and due diligence', color: '#0891b2' },
            { label: 'Negotiate', description: 'Make offers or bid at auction', color: '#059669' },
            { label: 'Contract', description: 'Exchange and cooling off', color: '#22c55e' },
            { label: 'Settlement', description: 'Final checks and ownership transfer', color: '#16a34a' },
          ]}
        />
      </DiagramWrapper>

      <CalcWrapper title="Can you afford it? Try the Life Simulator" calcId="simulator">
        <LifeSimulator />
      </CalcWrapper>
    </>
  );
}

function Stage02_FinancePrep({ persona }: { persona: Persona }) {
  return (
    <>
      <DiagramWrapper title="Your LVR Position">
        <LvrGaugeDiagram propertyValue={800000} loanAmount={640000} />
      </DiagramWrapper>

      <CalcWrapper title="How much can you borrow?" calcId="borrowing">
        <BorrowingPowerCalculator />
      </CalcWrapper>

      <CalcWrapper title="Deposit Goal Planner" calcId="deposit">
        <DepositGoalCalculator />
      </CalcWrapper>

      {persona === 'fhb-oo' && (
        <DiagramWrapper title="Saving Your Deposit — Typical Timeline">
          <TimelineDiagram
            title="Path to Your Deposit Goal"
            totalWeeks={156}
            milestones={[
              { week: 4, label: 'Budget set', description: 'Weekly savings plan in place', color: '#2563eb' },
              { week: 26, label: '10% saved', description: '$12,000 milestone reached', color: '#3b82f6' },
              { week: 52, label: '1 year', description: '$24,000 saved — LMI territory', color: '#06b6d4' },
              { week: 78, label: 'Pre-approval', description: 'Approach lenders with 15%', color: '#0891b2' },
              { week: 104, label: '20% target', description: '$48,000 — avoid LMI!', color: '#059669' },
              { week: 130, label: 'Extra buffer', description: 'Stamp duty + costs covered', color: '#22c55e' },
              { week: 156, label: 'Ready!', description: 'Full deposit + costs ready', color: '#16a34a' },
            ]}
          />
        </DiagramWrapper>
      )}
    </>
  );
}

function Stage03_MarketResearch({ persona }: { persona: Persona }) {
  return (
    <>
      <DiagramWrapper title="Cost Breakdown on a Typical Purchase">
        <CostDonutDiagram
          title="Where Your Money Goes"
          items={[
            { label: 'Property Price', amount: 800000, color: '#2563eb' },
            { label: 'Stamp Duty', amount: 31155, color: '#f59e0b' },
            { label: 'Conveyancing', amount: 2000, color: '#7c3aed' },
            { label: 'Building Report', amount: 600, color: '#06b6d4' },
            { label: 'Pest Report', amount: 400, color: '#0891b2' },
            { label: 'LMI (if <20%)', amount: 0, color: '#ef4444' },
            { label: 'Other Costs', amount: 1500, color: '#94a3b8' },
          ]}
          centerLabel="Total"
          centerValue="$835k+"
        />
      </DiagramWrapper>

      <CalcWrapper title="Stamp Duty Calculator (NSW)" calcId="stamp">
        <StampDutyCalculator />
      </CalcWrapper>

      {persona !== 'fhb-oo' && (
        <CalcWrapper title="Investment Cashflow" calcId="cashflow">
          <InvestmentCashflowCalculator />
        </CalcWrapper>
      )}
    </>
  );
}

function Stage04_Shortlisting() {
  return (
    <>
      <DiagramWrapper title="Property Comparison Framework">
        <FlowDiagram
          title="Evaluating Properties"
          steps={[
            { label: 'Price', description: 'Within budget?', color: '#2563eb' },
            { label: 'Location', description: 'Growth + livability', color: '#3b82f6' },
            { label: 'Condition', description: 'Renovation needed?', color: '#06b6d4' },
            { label: 'Rental', description: 'If investing — yield?', color: '#0891b2' },
            { label: 'Due Diligence', description: 'Reports + checks', color: '#059669' },
          ]}
        />
      </DiagramWrapper>

      <CalcWrapper title="Compare Properties Side by Side" calcId="compare">
        <PropertyComparisonCalculator />
      </CalcWrapper>
    </>
  );
}

function Stage05_Inspection() {
  return (
    <>
      <DiagramWrapper title="Pre-Purchase Cost Overview">
        <CostDonutDiagram
          title="Upfront Costs Breakdown"
          items={[
            { label: 'Deposit (20%)', amount: 160000, color: '#2563eb' },
            { label: 'Stamp Duty', amount: 31155, color: '#f59e0b' },
            { label: 'Legal Fees', amount: 2000, color: '#7c3aed' },
            { label: 'Inspections', amount: 1000, color: '#06b6d4' },
            { label: 'Misc', amount: 2000, color: '#94a3b8' },
          ]}
          centerLabel="Total Upfront"
          centerValue="$196k+"
        />
      </DiagramWrapper>
    </>
  );
}

function Stage06_OfferNegotiation() {
  return (
    <>
      <DiagramWrapper title="Offer to Exchange Timeline">
        <TimelineDiagram
          title="Making an Offer to Exchange"
          totalWeeks={8}
          milestones={[
            { week: 1, label: 'Offer made', description: 'Written offer submitted', color: '#2563eb' },
            { week: 3, label: 'Negotiation', description: 'Counter offers and terms', color: '#3b82f6' },
            { week: 5, label: 'Offer accepted', description: 'Verbal agreement reached', color: '#06b6d4' },
            { week: 6, label: 'Contract review', description: 'Solicitor checks contract', color: '#059669' },
            { week: 7, label: 'Deposit paid', description: '0.25% holding deposit', color: '#22c55e' },
            { week: 8, label: 'Exchange', description: 'Contracts signed — legally binding', color: '#16a34a' },
          ]}
        />
      </DiagramWrapper>

      <CalcWrapper title="Mortgage Repayment Calculator" calcId="mortgage">
        <MortgageRepaymentCalculator />
      </CalcWrapper>
    </>
  );
}

function Stage07_ContractReview({ persona }: { persona: Persona }) {
  return (
    <>
      <DiagramWrapper title="Exchange to Settlement Process">
        <FlowDiagram
          title="From Exchange to Keys"
          steps={[
            { label: 'Exchange', description: 'Contracts signed, deposit paid', color: '#2563eb' },
            { label: 'Cooling Off', description: '5 business days (private treaty)', color: '#3b82f6' },
            { label: 'Finance', description: 'Final loan approval', color: '#06b6d4' },
            { label: 'Inspections', description: 'Building, pest, survey', color: '#0891b2' },
            { label: 'Insurance', description: 'Building insurance starts', color: '#059669' },
            { label: 'Settlement', description: 'Funds transfer, title registered', color: '#22c55e' },
            { label: 'Keys!', description: 'You are now a property owner', color: '#16a34a' },
          ]}
        />
      </DiagramWrapper>

      {persona !== 'fhb-oo' && (
        <CalcWrapper title="Offset vs Redraw — What's Better?" calcId="offset">
          <OffsetVsRedrawCalculator />
        </CalcWrapper>
      )}
    </>
  );
}

function Stage08_Settlement({ persona }: { persona: Persona }) {
  const isInvestor = persona !== 'fhb-oo';
  return (
    <>
      <DiagramWrapper title="Your Post-Settlement Timeline">
        <TimelineDiagram
          title="First Year as a Property Owner"
          totalWeeks={52}
          milestones={[
            { week: 1, label: 'Move in / Tenant', description: 'Property is now yours', color: '#2563eb' },
            { week: 4, label: 'First repayment', description: 'Mortgage payments begin', color: '#3b82f6' },
            { week: 13, label: '3-month check', description: 'Budget review, any issues?', color: '#06b6d4' },
            { week: 26, label: '6 months', description: 'Consider extra repayments', color: '#0891b2' },
            { week: 39, label: 'Rate check', description: 'Compare your rate to market', color: '#059669' },
            { week: 52, label: '1 year!', description: 'Review equity, plan next steps', color: '#16a34a' },
          ]}
        />
      </DiagramWrapper>

      {isInvestor && (
        <>
          <CalcWrapper title="Capital Gains Tax Estimator" calcId="cgt">
            <CGTCalculator />
          </CalcWrapper>
          <CalcWrapper title="Equity Release Calculator" calcId="equity">
            <EquityReleaseCalculator />
          </CalcWrapper>
        </>
      )}

      {persona === 'fhb-oo' && (
        <CalcWrapper title="52-Week Life Simulator" calcId="simulator">
          <LifeSimulator />
        </CalcWrapper>
      )}
    </>
  );
}

/* ───────────────────────────────────────────
   Main export — maps stage IDs to embeds
   ─────────────────────────────────────────── */

interface JourneyEmbedsProps {
  stageId: string;
  persona: Persona;
}

export function JourneyEmbeds({ stageId, persona }: JourneyEmbedsProps) {
  return (
    <div className="border-t border-dashed border-slate-200 pt-8 mt-8">
      <h2 className="text-xl font-bold font-serif mb-6 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-blue-600" />
        Interactive Tools for This Stage
      </h2>

      {stageId === '01-strategy' && <Stage01_Strategy persona={persona} />}
      {stageId === '02-finance-prep' && <Stage02_FinancePrep persona={persona} />}
      {stageId === '03-market-research' && <Stage03_MarketResearch persona={persona} />}
      {stageId === '04-shortlisting' && <Stage04_Shortlisting />}
      {stageId === '05-inspection-dd' && <Stage05_Inspection />}
      {stageId === '06-offer-negotiation' && <Stage06_OfferNegotiation />}
      {stageId === '07-contract-review' && <Stage07_ContractReview persona={persona} />}
      {stageId === '08-settlement' && <Stage08_Settlement persona={persona} />}
    </div>
  );
}
