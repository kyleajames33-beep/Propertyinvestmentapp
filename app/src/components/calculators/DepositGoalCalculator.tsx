import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { Target, Calendar } from 'lucide-react';
import { CalculatorCta } from './CalculatorCta';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';
import { EmailMyResult } from '@/components/EmailMyResult';
import { ShareResult } from '@/components/ShareResult';

export function DepositGoalCalculator() {
  useEffect(() => { trackCalculatorUse('Deposit Goal'); }, []);
  const [inputs, setInputs] = useState({
    propertyPrice: 800000,
    depositPercent: 20,
    currentSavings: 50000,
    monthlySavings: 2000,
    existingGrowth: 3,
  });
  const [prefilledFromProfile, setPrefilledFromProfile] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('pp_property_profile');
    if (!raw) return;
    try {
      const profile = JSON.parse(raw) as { budgetMax?: number; budgetMin?: number; depositSaved?: number };
      let didPrefill = false;
      const price = profile.budgetMax || profile.budgetMin;
      if (price && inputs.propertyPrice === 800000) {
        setInputs((prev) => ({ ...prev, propertyPrice: price }));
        didPrefill = true;
      }
      if (profile.depositSaved && inputs.currentSavings === 50000) {
        setInputs((prev) => ({ ...prev, currentSavings: profile.depositSaved! }));
        didPrefill = true;
      }
      if (didPrefill) setPrefilledFromProfile(true);
    } catch {
      /* ignore invalid JSON */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo(() => {
    const depositNeeded = inputs.propertyPrice * (inputs.depositPercent / 100);
    const shortfall = depositNeeded - inputs.currentSavings;
    const monthsToGoal = shortfall > 0 ? Math.ceil(shortfall / inputs.monthlySavings) : 0;
    const goalDate = new Date();
    goalDate.setMonth(goalDate.getMonth() + monthsToGoal);
    const stampDuty = inputs.propertyPrice <= 800000 && inputs.depositPercent >= 20 ? 0 : inputs.propertyPrice * 0.035;
    const totalNeeded = depositNeeded + stampDuty + 5000;

    return {
      depositNeeded: Math.round(depositNeeded),
      shortfall: Math.round(shortfall),
      monthsToGoal,
      goalDate: goalDate.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' }),
      stampDuty: Math.round(stampDuty),
      totalNeeded: Math.round(totalNeeded),
    };
  }, [inputs]);

  return (
    <div className="pp-calc-card">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-400 flex items-center justify-center"><Target className="h-5 w-5 text-white" /></div>
        <div><h3 className="text-lg font-bold font-serif">Deposit Goal Calculator</h3><p className="text-sm text-slate-500">How long until you can buy?</p></div>
      </div>
      {prefilledFromProfile && (
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
            Pre-filled from your profile
          </span>
        </div>
      )}
      <div className="pp-calc-grid mt-6">
        <div className="pp-input-group"><label>Target property price</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span><input type="number" value={inputs.propertyPrice} onChange={e => setInputs({...inputs, propertyPrice: Number(e.target.value)})} className="pl-8" /></div></div>
        <div className="pp-input-group"><label>Deposit goal (%)</label><select value={inputs.depositPercent} onChange={e => setInputs({...inputs, depositPercent: Number(e.target.value)})}><option value={10}>10% (LMI applies)</option><option value={15}>15% (LMI applies)</option><option value={20}>20% (no LMI)</option></select></div>
        <div className="pp-input-group"><label>Current savings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span><input type="number" value={inputs.currentSavings} onChange={e => setInputs({...inputs, currentSavings: Number(e.target.value)})} className="pl-8" /></div></div>
        <div className="pp-input-group"><label>Monthly savings</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span><input type="number" value={inputs.monthlySavings} onChange={e => setInputs({...inputs, monthlySavings: Number(e.target.value)})} className="pl-8" /></div></div>
      </div>
      <div className="pp-result-box mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><div className="result-label">Deposit needed</div><div className="result-value">${results.depositNeeded.toLocaleString()}</div></div>
          <div><div className="result-label">Stamp duty (est.)</div><div className="result-value text-amber-300">${results.stampDuty.toLocaleString()}</div></div>
          <div><div className="result-label">Total needed</div><div className="result-value">${results.totalNeeded.toLocaleString()}</div></div>
          <div><div className="result-label">Goal date</div><div className="result-value text-green-300">{results.goalDate}</div></div>
        </div>
      </div>
      {results.shortfall > 0 ? (
        <div className="mt-4 flex items-center gap-3 bg-slate-50 rounded-xl p-4">
          <Calendar className="h-5 w-5 text-primary" />
          <div><p className="font-medium text-slate-800">{results.monthsToGoal} months to go</p><p className="text-sm text-slate-500">You need ${results.shortfall.toLocaleString()} more. At ${inputs.monthlySavings.toLocaleString()}/month, you will reach your goal by {results.goalDate}.</p></div>
        </div>
      ) : (
        <div className="pp-callout pp-callout-green mt-4"><span className="pp-callout-tag">Ready!</span><div>You have enough saved! Time to get pre-approval and start looking.</div></div>
      )}
      <div className="flex items-center gap-2 mt-4">
        <ShareResult
          title="Deposit Goal Estimate"
          lines={[
            { label: 'Property price', value: `$${inputs.propertyPrice.toLocaleString()}` },
            { label: 'Deposit goal', value: `${inputs.depositPercent}%` },
            { label: 'Deposit needed', value: `$${results.depositNeeded.toLocaleString()}` },
            { label: 'Stamp duty (est.)', value: `$${results.stampDuty.toLocaleString()}` },
            { label: 'Total needed', value: `$${results.totalNeeded.toLocaleString()}` },
            { label: 'Goal date', value: results.goalDate },
          ]}
        />
      </div>
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <EmailMyResult
          calculatorName="Deposit Goal Calculator"
          resultText={`Deposit needed: $${results.depositNeeded.toLocaleString()}\nMonths to goal: ${results.monthsToGoal}`}
        />
      </div>
      <CalculatorDisclaimer />
      <CalculatorCta
        calculatorName="Deposit Goal"
        headline="Need help saving faster or structuring your deposit?"
        subline="A financial advisor can optimise your savings strategy and government grant access."
        ctaText="Talk to an advisor"
        professionalType="financial advisor"
      />
    </div>
  );
}




