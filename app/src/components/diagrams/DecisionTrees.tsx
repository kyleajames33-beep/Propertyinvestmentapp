import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface DecisionNode {
  question?: string;
  yes?: string;
  no?: string;
  result?: string;
  resultType?: 'eligible' | 'ineligible' | 'maybe';
}

const fhbSchemeTree: Record<string, DecisionNode> = {
  start: { question: 'Have you ever owned property in Australia?', yes: 'not_fhb', no: 'q2' },
  q2: { question: 'Is the property valued at $800,000 or less?', yes: 'q3_800k', no: 'q4_over_800k' },
  q3_800k: { question: 'Is the property new or existing?', yes: 'q5_new', no: 'q5_existing' },
  q4_over_800k: { question: 'Is the property between $800,001 and $1,000,000?', yes: 'q6_partial', no: 'over_1m' },
  q5_existing: { question: 'Will you live in it within 12 months?', yes: 'full_exemption', no: 'not_occupy' },
  q5_new: { question: 'Will you live in it within 12 months?', yes: 'full_exemption_grant', no: 'not_occupy' },
  q6_partial: { question: 'Will you live in it within 12 months?', yes: 'partial_concession', no: 'not_occupy' },
  full_exemption: { result: 'Full stamp duty exemption! You pay $0 transfer duty.', resultType: 'eligible' },
  full_exemption_grant: { result: 'Full stamp duty exemption + $10,000 First Home Owner Grant!', resultType: 'eligible' },
  partial_concession: { result: 'Partial stamp duty concession applies. Use our Stamp Duty Calculator for the exact amount.', resultType: 'maybe' },
  not_fhb: { result: 'Standard stamp duty rates apply. You are not eligible for first home buyer schemes.', resultType: 'ineligible' },
  not_occupy: { result: 'You must intend to occupy within 12 months. For investment, standard rates apply.', resultType: 'ineligible' },
  over_1m: { result: 'Properties over $1M do not qualify for FHB concessions. Standard rates apply.', resultType: 'ineligible' },
};

const inspectionTree: Record<string, DecisionNode> = {
  start: { question: 'Are you buying a house/townhouse (not apartment)?', yes: 'q2_house', no: 'q2_apartment' },
  q2_house: { question: 'Is the property more than 5 years old?', yes: 'q3_old', no: 'q3_new' },
  q2_apartment: { question: 'Is this off-the-plan or a new apartment?', yes: 'new_apartment', no: 'q4_strata' },
  q3_old: { question: 'Buying at auction (no cooling off)?', yes: 'pre_auction', no: 'with_cooling' },
  q3_new: { question: 'Does builder offer structural warranty?', yes: 'warranty_ok', no: 'townhouse_check' },
  q4_strata: { question: 'Did strata report find building defects?', yes: 'defects_found', no: 'strata_clean' },
  townhouse_check: { question: 'Is this a townhouse (shared walls)?', yes: 'townhouse_inspect', no: 'new_house_ok' },
  pre_auction: { result: 'Get building AND pest inspection BEFORE auction. Budget $500-800.', resultType: 'eligible' },
  with_cooling: { result: 'Get inspection during cooling off. You can withdraw if major defects found.', resultType: 'maybe' },
  warranty_ok: { result: 'Builder warranty covers structural (6 years NSW). Inspection is optional but wise.', resultType: 'maybe' },
  townhouse_inspect: { result: 'Get building inspection even though new. Budget $400-600.', resultType: 'eligible' },
  new_house_ok: { result: 'With warranty, full inspection is optional. Consider handover inspection ($300-500).', resultType: 'maybe' },
  defects_found: { result: 'Building inspection strongly recommended. Budget $500-700 + strata report.', resultType: 'eligible' },
  strata_clean: { result: 'Strata report essential. Building inspection recommended for apartments 10+ years.', resultType: 'maybe' },
  new_apartment: { result: 'Focus on strata report and defects warranty. Inspection optional.', resultType: 'maybe' },
};

const saleMethodTree: Record<string, DecisionNode> = {
  start: { question: 'Is the property being sold at auction?', yes: 'q2_auction', no: 'private_treaty' },
  q2_auction: { question: 'Have you inspected thoroughly?', yes: 'q3_finance', no: 'inspect_first' },
  private_treaty: { question: 'Is price at top of budget?', yes: 'q4_budget', no: 'q5_room' },
  q3_finance: { question: 'Pre-approval confirmed?', yes: 'auction_ready', no: 'get_finance' },
  q4_budget: { question: 'On market 30+ days?', yes: 'negotiate_hard', no: 'act_fast' },
  q5_room: { question: 'Competing offers?', yes: 'competing', no: 'low_offer' },
  inspect_first: { result: 'Inspect twice before auction. Get reports. Observe other auctions.', resultType: 'maybe' },
  auction_ready: { result: 'Set absolute max before auction. Do not exceed it. Consider buyer\'s agent.', resultType: 'eligible' },
  get_finance: { result: 'Get pre-approval before bidding. Auction = unconditional commitment.', resultType: 'ineligible' },
  negotiate_hard: { result: 'Offer 5-10% below asking. Include conditions.', resultType: 'eligible' },
  act_fast: { result: 'New listings move quickly. Offer near asking with short settlement.', resultType: 'maybe' },
  competing: { result: 'Multiple offers favour seller. Offer best price upfront.', resultType: 'maybe' },
  low_offer: { result: 'No competition = room to negotiate. Start 8-12% below asking.', resultType: 'eligible' },
};

function DecisionTree({ title, subtitle, tree }: { title: string; subtitle: string; tree: Record<string, DecisionNode> }) {
  const [current, setCurrent] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const node = tree[current];

  const go = (next: string) => { setHistory(h => [...h, current]); setCurrent(next); };
  const back = () => { if (history.length) { setCurrent(history[history.length - 1]); setHistory(h => h.slice(0, -1)); } };
  const reset = () => { setCurrent('start'); setHistory([]); };

  return (
    <div className="pp-card">
      <div className="pp-card-header">
        <div className="pp-card-num teal">?</div>
        <div><h3 className="pp-card-title">{title}</h3><p className="text-xs text-slate-500">{subtitle}</p></div>
      </div>
      {node.result ? (
        <div className="mt-4">
          <div className={`p-4 rounded-xl ${node.resultType === 'eligible' ? 'bg-green-50 border border-green-200' : node.resultType === 'ineligible' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-start gap-3">
              {node.resultType === 'eligible' ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /> : node.resultType === 'ineligible' ? <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" /> : <HelpCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />}
              <p className={`text-sm font-medium ${node.resultType === 'eligible' ? 'text-green-800' : node.resultType === 'ineligible' ? 'text-red-800' : 'text-amber-800'}`}>{node.result}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            {history.length > 0 && <Button variant="outline" size="sm" onClick={back}><ArrowRight className="h-3 w-3 rotate-180 mr-1" />Back</Button>}
            <Button variant="outline" size="sm" onClick={reset}><RotateCcw className="h-3 w-3 mr-1" />Start over</Button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-base font-medium text-slate-800 mb-4">{node.question}</p>
          <div className="flex flex-col gap-2">
            {node.yes && <Button onClick={() => go(node.yes!)} className="justify-start h-auto py-3 px-4"><CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" /><span className="text-left">Yes</span></Button>}
            {node.no && <Button variant="outline" onClick={() => go(node.no!)} className="justify-start h-auto py-3 px-4"><XCircle className="h-4 w-4 mr-2 flex-shrink-0" /><span className="text-left">No</span></Button>}
          </div>
          {history.length > 0 && <div className="flex gap-2 mt-4"><Button variant="ghost" size="sm" onClick={back}><ArrowRight className="h-3 w-3 rotate-180 mr-1" />Back</Button></div>}
        </div>
      )}
    </div>
  );
}

export function DecisionTrees() {
  return (
    <div className="space-y-6">
      <DecisionTree title="Which FHB scheme am I eligible for?" subtitle="3-4 questions to find your NSW entitlements" tree={fhbSchemeTree} />
      <DecisionTree title="Do I need a building inspection?" subtitle="Find what inspections you need" tree={inspectionTree} />
      <DecisionTree title="Auction vs private treaty strategy?" subtitle="Right approach for your situation" tree={saleMethodTree} />
    </div>
  );
}
