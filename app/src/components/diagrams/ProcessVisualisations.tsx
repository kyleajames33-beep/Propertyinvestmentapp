import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, FileText, Search, Handshake, FileCheck, Key, Home } from 'lucide-react';

const conveyancingSteps = [
  { icon: <FileText className="h-5 w-5" />, title: 'Contract review', desc: 'Your conveyancer reviews the contract, s10.7 certificate, and strata report.', who: 'Conveyancer', weeks: 'Week 1' },
  { icon: <Search className="h-5 w-5" />, title: 'Searches and enquiries', desc: 'Title search, plan search, and council enquiries to verify property details.', who: 'Conveyancer', weeks: 'Week 1-2' },
  { icon: <Handshake className="h-5 w-5" />, title: 'Exchange of contracts', desc: 'You pay the deposit (usually 10%). Cooling off period begins (5 business days for private treaty).', who: 'You + Conveyancer', weeks: 'Week 2' },
  { icon: <FileCheck className="h-5 w-5" />, title: 'Finance approval', desc: 'Your lender conducts valuation and issues formal approval. Unconditional approval = no going back.', who: 'Mortgage Broker + Bank', weeks: 'Week 2-4' },
  { icon: <Home className="h-5 w-5" />, title: 'Pre-settlement inspection', desc: 'Inspect the property 1-3 days before settlement. Check inclusions and condition.', who: 'You', weeks: 'Day before' },
  { icon: <Key className="h-5 w-5" />, title: 'Settlement', desc: 'Funds transferred via PEXA. Keys handed over. You are now the owner.', who: 'Conveyancer + Bank', weeks: 'Settlement day' },
];

const offerToSettlementSteps = [
  { icon: <Home className="h-5 w-5" />, title: 'Make offer', desc: 'Submit written offer with price, deposit, and settlement terms.', who: 'You / Buyer\'s agent', weeks: 'Week 1' },
  { icon: <FileText className="h-5 w-5" />, title: 'Negotiate', desc: 'Counter offers on price, inclusions, settlement date. Go back and forth.', who: 'You / Buyer\'s agent', weeks: 'Week 1-2' },
  { icon: <Handshake className="h-5 w-5" />, title: 'Offer accepted', desc: 'Both parties sign the contract. 0.25% holding deposit paid.', who: 'Both parties', weeks: 'Week 2' },
  { icon: <FileCheck className="h-5 w-5" />, title: 'Cooling off / Unconditional', desc: '5 business days cooling off (0.25% fee if withdrawn). Or go unconditional.', who: 'You', weeks: 'Week 2' },
  { icon: <Search className="h-5 w-5" />, title: 'Conveyancing + Finance', desc: 'Legal work + bank processes loan. Takes 4-6 weeks typically.', who: 'Conveyancer + Bank', weeks: 'Week 2-6' },
  { icon: <Key className="h-5 w-5" />, title: 'Settlement day', desc: 'Balance paid, title transferred, keys collected.', who: 'Conveyancer', weeks: 'Settlement' },
];

const trustStructureComparison = [
  { feature: 'Asset protection', personal: 'Low — personal assets exposed', trust: 'High — property held by trustee', company: 'High — limited liability' },
  { feature: 'Land tax', personal: 'Standard thresholds', trust: 'No threshold — surcharge applies', company: 'Standard thresholds' },
  { feature: 'Capital gains discount', personal: '50% discount', trust: '50% discount can flow to beneficiaries', company: 'No discount (30% flat)' },
  { feature: 'Borrowing complexity', personal: 'Simple', trust: 'More complex — lenders cautious', company: 'Moderate' },
  { feature: 'Setup cost', personal: '$0', trust: '$1,500-$3,000', company: '$800-$1,500 + annual ASIC fee' },
  { feature: 'Ongoing admin', personal: 'Minimal', trust: 'Annual tax return + resolutions', company: 'Annual return + ASIC fee' },
];

function Timeline({ steps, title }: { steps: typeof conveyancingSteps; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="pp-card">
      <div className="pp-card-header">
        <div className="pp-card-num amber">{steps.length}</div>
        <div><h3 className="pp-card-title">{title}</h3></div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <button key={i} onClick={() => setActive(i)} className="flex flex-col items-center min-w-[60px]">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all ${
              i === active ? 'bg-primary scale-110' : i < active ? 'bg-primary/60' : 'bg-slate-200'
            }`}>
              {step.icon}
            </div>
            {i < steps.length - 1 && <div className={`h-0.5 w-full mt-2 ${i < active ? 'bg-primary/60' : 'bg-slate-200'}`} />}
          </button>
        ))}
      </div>

      {/* Active step detail */}
      <div className="bg-slate-50 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            {steps[active].icon}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">{steps[active].title}</h4>
            {'weeks' in steps[active] && <span className="text-xs text-slate-500">{steps[active].weeks}</span>}
          </div>
        </div>
        <p className="text-sm text-slate-600 mb-2">{steps[active].desc}</p>
        <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{steps[active].who}</span>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" size="sm" onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" />Previous
        </Button>
        <span className="text-sm text-slate-400 pt-1">{active + 1} of {steps.length}</span>
        <Button variant="outline" size="sm" onClick={() => setActive(Math.min(steps.length - 1, active + 1))} disabled={active === steps.length - 1}>
          Next<ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

function ComparisonTable() {
  return (
    <div className="pp-card">
      <div className="pp-card-header">
        <div className="pp-card-num red">vs</div>
        <div><h3 className="pp-card-title">Ownership structure comparison</h3><p className="text-xs text-slate-500">Personal name vs Trust vs Company</p></div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-slate-50"><th className="text-left p-3 font-semibold">Feature</th><th className="text-left p-3 font-semibold text-blue-700">Personal</th><th className="text-left p-3 font-semibold text-purple-700">Trust</th><th className="text-left p-3 font-semibold text-teal-700">Company</th></tr></thead>
          <tbody>
            {trustStructureComparison.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="p-3 font-medium text-slate-700">{row.feature}</td>
                <td className="p-3 text-slate-600">{row.personal}</td>
                <td className="p-3 text-slate-600">{row.trust}</td>
                <td className="p-3 text-slate-600">{row.company}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProcessVisualisations() {
  return (
    <div className="space-y-6">
      <Timeline steps={conveyancingSteps} title="The conveyancing timeline" />
      <Timeline steps={offerToSettlementSteps} title="From offer to settlement" />
      <ComparisonTable />
    </div>
  );
}
