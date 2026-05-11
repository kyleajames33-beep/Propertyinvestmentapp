import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { Unlock } from 'lucide-react';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function EquityReleaseCalculator() {
  useEffect(() => { trackCalculatorUse('Equity Release'); }, []);
  const [inputs, setInputs] = useState({
    propertyValue: 1200000,
    currentLoan: 600000,
    targetLvr: 80,
    newPropertyPrice: 750000,
  });

  const results = useMemo(() => {
    const currentEquity = inputs.propertyValue - inputs.currentLoan;
    const currentLvr = (inputs.currentLoan / inputs.propertyValue) * 100;
    const maxLoanAtTarget = inputs.propertyValue * (inputs.targetLvr / 100);
    const availableEquity = maxLoanAtTarget - inputs.currentLoan;
    const canBuyDeposit = availableEquity >= (inputs.newPropertyPrice * 0.2);
    const fullPurchasePossible = availableEquity >= inputs.newPropertyPrice;

    return {
      currentEquity: Math.round(currentEquity),
      currentLvr: Math.round(currentLvr * 10) / 10,
      maxLoanAtTarget: Math.round(maxLoanAtTarget),
      availableEquity: Math.round(availableEquity),
      canBuyDeposit,
      fullPurchasePossible,
      depositOnNew: Math.round(inputs.newPropertyPrice * 0.2),
    };
  }, [inputs]);

  return (
    <div className="pp-calc-card">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center"><Unlock className="h-5 w-5 text-white" /></div>
        <div><h3 className="text-lg font-bold font-serif">Equity Release Calculator</h3><p className="text-sm text-slate-500">See how much equity you can access for your next property</p></div>
      </div>
      <div className="pp-calc-grid mt-6">
        <div className="pp-input-group"><label>Current property value</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span><input type="number" value={inputs.propertyValue} onChange={e => setInputs({...inputs, propertyValue: Number(e.target.value)})} className="pl-8" /></div></div>
        <div className="pp-input-group"><label>Current loan balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span><input type="number" value={inputs.currentLoan} onChange={e => setInputs({...inputs, currentLoan: Number(e.target.value)})} className="pl-8" /></div></div>
        <div className="pp-input-group"><label>Target LVR</label><select value={inputs.targetLvr} onChange={e => setInputs({...inputs, targetLvr: Number(e.target.value)})}><option value={70}>70%</option><option value={80}>80% (no LMI)</option></select></div>
        <div className="pp-input-group"><label>Next property price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span><input type="number" value={inputs.newPropertyPrice} onChange={e => setInputs({...inputs, newPropertyPrice: Number(e.target.value)})} className="pl-8" /></div></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-slate-50 rounded-xl p-4 text-center"><div className="text-xs text-slate-500 uppercase">Current equity</div><div className="text-2xl font-bold font-serif text-slate-700">${(results.currentEquity / 1000).toFixed(0)}k</div></div>
        <div className="bg-slate-50 rounded-xl p-4 text-center"><div className="text-xs text-slate-500 uppercase">Current LVR</div><div className="text-2xl font-bold font-serif text-slate-700">{results.currentLvr}%</div></div>
        <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200"><div className="text-xs text-slate-500 uppercase">Available equity</div><div className="text-2xl font-bold font-serif text-green-700">${(results.availableEquity / 1000).toFixed(0)}k</div></div>
      </div>
      {results.canBuyDeposit ? (
        <div className="pp-callout pp-callout-green mt-4"><span className="pp-callout-tag">Good news</span><div>You have enough equity for a 20% deposit on the new property (${results.depositOnNew.toLocaleString()}). This means no LMI on the new loan. {results.fullPurchasePossible ? "You could even cover the full purchase price with equity!" : "You will need a new loan for the balance."}</div></div>
      ) : (
        <div className="pp-callout pp-callout-amber mt-4"><span className="pp-callout-tag">Not enough</span><div>You need ${results.depositOnNew.toLocaleString()} for a 20% deposit. You are short by ${(results.depositOnNew - results.availableEquity).toLocaleString()}. Consider saving more or looking at a lower-priced property.</div></div>
      )}
      <CalculatorDisclaimer />
    </div>
  );
}
