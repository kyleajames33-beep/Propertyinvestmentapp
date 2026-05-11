import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { TrendingDown } from 'lucide-react';
import { CalculatorCta } from './CalculatorCta';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function RefinanceCalculator() {
  useEffect(() => { trackCalculatorUse('Refinance'); }, []);
  const [inputs, setInputs] = useState({
    currentLoan: 500000,
    currentRate: 6.49,
    newRate: 5.89,
    loanTerm: 25,
    switchingCost: 1500,
  });

  const results = useMemo(() => {
    const monthlyCurrent = inputs.currentRate / 100 / 12;
    const monthlyNew = inputs.newRate / 100 / 12;
    const n = inputs.loanTerm * 12;

    const currentRepayment = inputs.currentLoan * (monthlyCurrent * Math.pow(1 + monthlyCurrent, n)) / (Math.pow(1 + monthlyCurrent, n) - 1);
    const newRepayment = inputs.currentLoan * (monthlyNew * Math.pow(1 + monthlyNew, n)) / (Math.pow(1 + monthlyNew, n) - 1);

    const monthlySaving = currentRepayment - newRepayment;
    const yearlySaving = monthlySaving * 12;
    const totalSavingOverTerm = yearlySaving * inputs.loanTerm;
    const paybackMonths = inputs.switchingCost / monthlySaving;

    return {
      currentRepayment: Math.round(currentRepayment),
      newRepayment: Math.round(newRepayment),
      monthlySaving: Math.round(monthlySaving),
      yearlySaving: Math.round(yearlySaving),
      totalSaving: Math.round(totalSavingOverTerm),
      paybackMonths: Math.round(paybackMonths * 10) / 10,
    };
  }, [inputs]);

  return (
    <div className="pp-calc-card">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-400 flex items-center justify-center"><TrendingDown className="h-5 w-5 text-white" /></div>
        <div><h3 className="text-lg font-bold font-serif">Refinance Savings Calculator</h3><p className="text-sm text-slate-500">See how much you could save by switching lenders</p></div>
      </div>
      <div className="pp-calc-grid mt-6">
        <div className="pp-input-group"><label>Current loan balance</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span><input type="number" value={inputs.currentLoan} onChange={e => setInputs({...inputs, currentLoan: Number(e.target.value)})} className="pl-8" /></div></div>
        <div className="pp-input-group"><label>Current interest rate (%)</label><input type="number" step="0.01" value={inputs.currentRate} onChange={e => setInputs({...inputs, currentRate: Number(e.target.value)})} /></div>
        <div className="pp-input-group"><label>New interest rate (%)</label><input type="number" step="0.01" value={inputs.newRate} onChange={e => setInputs({...inputs, newRate: Number(e.target.value)})} /></div>
        <div className="pp-input-group"><label>Remaining term (years)</label><select value={inputs.loanTerm} onChange={e => setInputs({...inputs, loanTerm: Number(e.target.value)})}><option value={15}>15</option><option value={20}>20</option><option value={25}>25</option><option value={30}>30</option></select></div>
        <div className="pp-input-group"><label>Switching costs</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span><input type="number" value={inputs.switchingCost} onChange={e => setInputs({...inputs, switchingCost: Number(e.target.value)})} className="pl-8" /></div></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-slate-50 rounded-xl p-4 text-center"><div className="text-xs text-slate-500 uppercase">Current monthly</div><div className="text-xl font-bold font-serif text-slate-700">${results.currentRepayment.toLocaleString()}</div></div>
        <div className="bg-green-50 rounded-xl p-4 text-center"><div className="text-xs text-slate-500 uppercase">New monthly</div><div className="text-xl font-bold font-serif text-green-700">${results.newRepayment.toLocaleString()}</div></div>
        <div className="bg-blue-50 rounded-xl p-4 text-center"><div className="text-xs text-slate-500 uppercase">Monthly saving</div><div className="text-xl font-bold font-serif text-blue-700">${results.monthlySaving.toLocaleString()}</div></div>
        <div className="bg-amber-50 rounded-xl p-4 text-center"><div className="text-xs text-slate-500 uppercase">Payback period</div><div className="text-xl font-bold font-serif text-amber-700">{results.paybackMonths} mo</div></div>
      </div>
      {results.monthlySaving > 0 ? (
        <div className="pp-callout pp-callout-green mt-4"><span className="pp-callout-tag">Saving</span><div>Switching saves you ${results.yearlySaving.toLocaleString()} per year. Over {inputs.loanTerm} years, that is ${(results.totalSaving / 1000).toFixed(0)}k in total savings (after ${inputs.switchingCost.toLocaleString()} switching cost).</div></div>
      ) : (
        <div className="pp-callout pp-callout-amber mt-4"><span className="pp-callout-tag">Warning</span><div>The new rate is not lower enough to justify switching after costs. You need a rate at least {(results.paybackMonths / 12).toFixed(1)} percentage points lower to break even in 2 years.</div></div>
      )}
      <CalculatorDisclaimer />
      <CalculatorCta
        calculatorName="Refinance"
        headline="Ready to refinance?"
        subline="A mortgage broker can compare rates across 40+ lenders and handle the paperwork for you."
        ctaText="Connect with a broker"
        professionalType="mortgage broker"
      />
    </div>
  );
}
