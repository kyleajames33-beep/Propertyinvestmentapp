import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { Landmark } from 'lucide-react';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function LandTaxCalculator() {
  useEffect(() => { trackCalculatorUse('Land Tax'); }, []);
  const [inputs, setInputs] = useState({
    landValue: 600000,
    isInvestment: true,
    isTrust: false,
    isForeign: false,
  });

  const results = useMemo(() => {
    const threshold = 1075000;
    const premiumThreshold = 6576000;
    let tax = 0;
    let premium = false;

    if (inputs.isInvestment || inputs.isTrust) {
      if (inputs.landValue > threshold) {
        if (inputs.landValue <= premiumThreshold) {
          tax = 100 + (inputs.landValue - threshold) * 0.016;
        } else {
          tax = 88400 + (inputs.landValue - premiumThreshold) * 0.02;
          premium = true;
        }
      }
    }

    if (inputs.isTrust && inputs.landValue > threshold) {
      tax = Math.max(tax, inputs.landValue * 0.015);
    }

    if (inputs.isForeign) {
      tax += inputs.landValue * 0.04;
    }

    return {
      tax: Math.round(tax),
      weekly: Math.round(tax / 52),
      premium,
      threshold,
    };
  }, [inputs]);

  return (
    <div className="pp-calc-card">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center"><Landmark className="h-5 w-5 text-white" /></div>
        <div><h3 className="text-lg font-bold font-serif">NSW Land Tax Calculator</h3><p className="text-sm text-slate-500">Estimate your annual land tax liability</p></div>
      </div>
      <div className="pp-calc-grid mt-6">
        <div className="pp-input-group"><label>Land value (not property value)</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span><input type="number" value={inputs.landValue} onChange={e => setInputs({...inputs, landValue: Number(e.target.value)})} className="pl-8" /></div></div>
        <div className="pp-input-group"><label>Property use</label><select value={inputs.isInvestment ? 'inv' : 'ppor'} onChange={e => setInputs({...inputs, isInvestment: e.target.value === 'inv'})}><option value="ppor">Principal place of residence (exempt)</option><option value="inv">Investment</option></select></div>
        <div className="pp-input-group"><label>Ownership</label><select value={inputs.isTrust ? 'trust' : 'personal'} onChange={e => setInputs({...inputs, isTrust: e.target.value === 'trust'})}><option value="personal">Personal name</option><option value="trust">Trust</option></select></div>
        <div className="pp-input-group"><label>Are you a foreign person?</label><select value={inputs.isForeign ? 'yes' : 'no'} onChange={e => setInputs({...inputs, isForeign: e.target.value === 'yes'})}><option value="no">No</option><option value="yes">Yes (+4% surcharge)</option></select></div>
      </div>
      {!inputs.isInvestment ? (
        <div className="pp-callout pp-callout-green mt-6"><span className="pp-callout-tag">Exempt</span><div>Your principal place of residence is exempt from land tax in NSW. No land tax payable.</div></div>
      ) : (
        <div className="mt-6">
          {results.tax > 0 ? (
            <div className="pp-result-box">
              <div className="grid grid-cols-2 gap-4">
                <div><div className="result-label">Annual land tax</div><div className="result-value">${results.tax.toLocaleString()}</div></div>
                <div><div className="result-label">Weekly cost</div><div className="result-value">${results.weekly}/wk</div></div>
              </div>
              {results.premium && <div className="result-note mt-2">Premium land tax rate applies</div>}
            </div>
          ) : (
            <div className="pp-callout pp-callout-green mt-4"><span className="pp-callout-tag">Below threshold</span><div>Your land value is below the ${results.threshold.toLocaleString()} threshold. No land tax payable.</div></div>
          )}
          {inputs.isTrust && (
            <div className="pp-callout pp-callout-amber mt-4"><span className="pp-callout-tag">Trust note</span><div>Trusts pay land tax from the first dollar — there is no threshold. Discretionary trusts also attract a surcharge. Talk to an accountant about whether a trust structure makes sense for your situation.</div></div>
          )}
        </div>
      )}
      <CalculatorDisclaimer />
    </div>
  );
}
