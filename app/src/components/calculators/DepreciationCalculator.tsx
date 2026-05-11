import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { Calculator, Home, Hammer, Wrench, TrendingDown } from 'lucide-react';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

interface DepreciableAsset {
  name: string;
  value: number;
  effectiveLife: number;
  method: 'diminishing' | 'primeCost';
}

const DEFAULT_ASSETS: DepreciableAsset[] = [
  { name: 'Carpets', value: 4500, effectiveLife: 10, method: 'diminishing' },
  { name: 'Hot water system', value: 1800, effectiveLife: 12, method: 'diminishing' },
  { name: 'Oven / cooktop', value: 2200, effectiveLife: 12, method: 'diminishing' },
  { name: 'Air conditioning', value: 3500, effectiveLife: 15, method: 'diminishing' },
  { name: 'Blinds / curtains', value: 2800, effectiveLife: 10, method: 'diminishing' },
  { name: 'Dishwasher', value: 1200, effectiveLife: 10, method: 'diminishing' },
  { name: 'Rangehood', value: 900, effectiveLife: 10, method: 'diminishing' },
  { name: 'Smoke alarms', value: 600, effectiveLife: 20, method: 'diminishing' },
];

export function DepreciationCalculator() {
  useEffect(() => { trackCalculatorUse('Depreciation'); }, []);
  const [propertyBuilt, setPropertyBuilt] = useState(2015);
  const [constructionCost, setConstructionCost] = useState(220000);
  const [assets, setAssets] = useState<DepreciableAsset[]>(DEFAULT_ASSETS);
  const [years, setYears] = useState(5);
  const [taxRate, setTaxRate] = useState(32.5);

  const division43Rate = 2.5; // building allowance

  const results = useMemo(() => {
    const annualDiv43 = constructionCost * (division43Rate / 100);

    const yearlyResults = Array.from({ length: years }, (_, yearIndex) => {
      let div40Total = 0;
      const assetBreakdown = assets.map((asset) => {
        let deduction = 0;
        if (asset.method === 'diminishing') {
          let remaining = asset.value;
          for (let y = 0; y <= yearIndex; y++) {
            deduction = remaining * (1.5 / asset.effectiveLife);
            remaining -= deduction;
            if (y < yearIndex) remaining = Math.max(0, remaining);
          }
        } else {
          deduction = asset.value / asset.effectiveLife;
        }
        deduction = Math.round(deduction);
        div40Total += deduction;
        return { name: asset.name, deduction, method: asset.method };
      });

      const totalDeduction = Math.round(annualDiv43 + div40Total);
      const taxSaved = Math.round(totalDeduction * (taxRate / 100));

      return {
        year: yearIndex + 1,
        div43: Math.round(annualDiv43),
        div40: div40Total,
        total: totalDeduction,
        taxSaved,
        assets: assetBreakdown,
      };
    });

    const totalDeductionAll = yearlyResults.reduce((s, y) => s + y.total, 0);
    const totalTaxSaved = yearlyResults.reduce((s, y) => s + y.taxSaved, 0);

    return { yearly: yearlyResults, totalDeduction: totalDeductionAll, totalTaxSaved };
  }, [assets, constructionCost, years, taxRate]);

  const updateAsset = (idx: number, field: keyof DepreciableAsset, value: string | number) => {
    const next = [...assets];
    next[idx] = { ...next[idx], [field]: value };
    setAssets(next);
  };

  return (
    <div className="pp-calc-card">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-serif">Depreciation Schedule</h3>
          <p className="text-sm text-slate-500">Division 40 (plant) and Division 43 (capital works) for investment properties</p>
        </div>
      </div>

      {/* Property details */}
      <div className="pp-calc-grid mt-6">
        <div className="pp-input-group">
          <label className="flex items-center gap-1.5"><Home className="h-3.5 w-3.5" /> Year property built</label>
          <input type="number" value={propertyBuilt} onChange={(e) => setPropertyBuilt(Number(e.target.value))} />
        </div>
        <div className="pp-input-group">
          <label className="flex items-center gap-1.5"><Hammer className="h-3.5 w-3.5" /> Construction cost</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" className="pl-8" value={constructionCost} onChange={(e) => setConstructionCost(Number(e.target.value))} />
          </div>
        </div>
        <div className="pp-input-group">
          <label>Project years</label>
          <input type="number" min={1} max={40} value={years} onChange={(e) => setYears(Math.min(40, Math.max(1, Number(e.target.value))))} />
        </div>
        <div className="pp-input-group">
          <label>Your marginal tax rate</label>
          <div className="relative">
            <input type="number" step="0.5" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
          </div>
        </div>
      </div>

      {/* Division 43 note */}
      <div className="pp-callout pp-callout-teal mt-4">
        <span className="pp-callout-tag">Division 43</span>
        <div className="text-sm">
          Capital works deduction at <strong>2.5% per year</strong> of construction cost = <strong>${Math.round(constructionCost * 0.025).toLocaleString()}/year</strong> for 40 years.
          Applies to residential properties built after 17 July 1985.
        </div>
      </div>

      {/* Assets list */}
      <h4 className="pp-section-label flex items-center gap-2 mt-6">
        <Wrench className="h-4 w-4" />
        Division 40 — Plant & Equipment
      </h4>
      <div className="space-y-2">
        {assets.map((asset, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2 items-end bg-slate-50 rounded-lg p-3">
            <div className="col-span-4 pp-input-group !m-0">
              <label className="text-[11px]">Asset</label>
              <input value={asset.name} onChange={(e) => updateAsset(idx, 'name', e.target.value)} className="!py-1.5 !text-sm" />
            </div>
            <div className="col-span-3 pp-input-group !m-0">
              <label className="text-[11px]">Value</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input type="number" className="!py-1.5 !text-sm pl-7" value={asset.value} onChange={(e) => updateAsset(idx, 'value', Number(e.target.value))} />
              </div>
            </div>
            <div className="col-span-2 pp-input-group !m-0">
              <label className="text-[11px]">Life (yrs)</label>
              <input type="number" className="!py-1.5 !text-sm" value={asset.effectiveLife} onChange={(e) => updateAsset(idx, 'effectiveLife', Number(e.target.value))} />
            </div>
            <div className="col-span-3 pp-input-group !m-0">
              <label className="text-[11px]">Method</label>
              <select className="!py-1.5 !text-sm" value={asset.method} onChange={(e) => updateAsset(idx, 'method', e.target.value as 'diminishing' | 'primeCost')}>
                <option value="diminishing">Diminishing</option>
                <option value="primeCost">Prime Cost</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Add asset */}
      <button
        onClick={() => setAssets([...assets, { name: 'New asset', value: 1000, effectiveLife: 10, method: 'diminishing' }])}
        className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
      >
        + Add asset
      </button>

      {/* Results */}
      <h4 className="pp-section-label mt-6">Annual Deductions</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 font-semibold text-slate-600">Year</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-600">Div 43 (Building)</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-600">Div 40 (Plant)</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-600">Total</th>
              <th className="text-right py-2 px-3 font-semibold text-emerald-600">Tax Saved</th>
            </tr>
          </thead>
          <tbody>
            {results.yearly.map((y) => (
              <tr key={y.year} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-3 font-medium">Year {y.year}</td>
                <td className="py-2 px-3 text-right">${y.div43.toLocaleString()}</td>
                <td className="py-2 px-3 text-right">${y.div40.toLocaleString()}</td>
                <td className="py-2 px-3 text-right font-semibold">${y.total.toLocaleString()}</td>
                <td className="py-2 px-3 text-right font-semibold text-emerald-600">${y.taxSaved.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="bg-slate-100 font-bold">
              <td className="py-2 px-3">Total ({years} years)</td>
              <td className="py-2 px-3 text-right">${((results.yearly[0]?.div43 || 0) * years).toLocaleString()}</td>
              <td className="py-2 px-3 text-right">${(results.totalDeduction - (results.yearly[0]?.div43 || 0) * years).toLocaleString()}</td>
              <td className="py-2 px-3 text-right text-blue-700">${results.totalDeduction.toLocaleString()}</td>
              <td className="py-2 px-3 text-right text-emerald-700">${results.totalTaxSaved.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="pp-result-box mt-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingDown className="h-4 w-4 opacity-80" />
          <span className="result-label">Total tax benefit over {years} years</span>
        </div>
        <div className="result-value">${results.totalTaxSaved.toLocaleString()}</div>
        <p className="result-note">Based on marginal tax rate of {taxRate}%</p>
      </div>
      <CalculatorDisclaimer />
    </div>
  );
}
