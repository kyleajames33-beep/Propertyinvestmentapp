import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { TrendingUp, Calendar, Receipt, Percent, Info } from 'lucide-react';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function CGTCalculator() {
  useEffect(() => { trackCalculatorUse('Capital Gains Tax'); }, []);
  const [purchasePrice, setPurchasePrice] = useState(650000);
  const [salePrice, setSalePrice] = useState(920000);
  const [purchaseCosts, setPurchaseCosts] = useState(25000); // stamp duty, legal, etc
  const [saleCosts, setSaleCosts] = useState(18000); // agent, legal, etc
  const [improvements, setImprovements] = useState(45000);
  const [yearsHeld, setYearsHeld] = useState(7);
  const [isInvestment, setIsInvestment] = useState(true);
  const [taxableIncome, setTaxableIncome] = useState(95000);

  const results = useMemo(() => {
    const capitalGain = salePrice - purchasePrice - purchaseCosts - saleCosts - improvements;
    
    // 50% discount if held > 12 months and is investment/PPOR eligible
    const discountRate = yearsHeld >= 1 && isInvestment ? 0.5 : 0;
    const discountedGain = Math.max(0, capitalGain * (1 - discountRate));
    
    // CGT tax rates (individual marginal rates)
    // Simplified: add gain to income, tax at marginal rate
    const totalIncome = taxableIncome + discountedGain;
    
    // Australian marginal tax rates 2024-25
    function taxOnIncome(income: number): number {
      if (income <= 18200) return 0;
      if (income <= 45000) return (income - 18200) * 0.16;
      if (income <= 135000) return 4288 + (income - 45000) * 0.30;
      if (income <= 190000) return 31288 + (income - 135000) * 0.37;
      return 51638 + (income - 190000) * 0.45;
    }
    
    const baseTax = taxOnIncome(taxableIncome);
    const totalTax = taxOnIncome(totalIncome);
    const cgtLiability = Math.max(0, totalTax - baseTax);
    
    return {
      capitalGain: Math.round(capitalGain),
      discountApplied: discountRate > 0,
      discountAmount: Math.round(capitalGain * discountRate),
      discountedGain: Math.round(discountedGain),
      cgtLiability: Math.round(cgtLiability),
      netProfit: Math.round(capitalGain - cgtLiability),
      effectiveRate: capitalGain > 0 ? Math.round((cgtLiability / capitalGain) * 1000) / 10 : 0,
    };
  }, [purchasePrice, salePrice, purchaseCosts, saleCosts, improvements, yearsHeld, isInvestment, taxableIncome]);

  return (
    <div className="pp-calc-card">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-orange-500 flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-serif">Capital Gains Tax Estimator</h3>
          <p className="text-sm text-slate-500">Estimate CGT on property sale (NSW)</p>
        </div>
      </div>

      <div className="pp-calc-grid mt-6">
        <div className="pp-input-group">
          <label>Purchase price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" className="pl-8" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} />
          </div>
        </div>
        <div className="pp-input-group">
          <label>Sale price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" className="pl-8" value={salePrice} onChange={(e) => setSalePrice(Number(e.target.value))} />
          </div>
        </div>
        <div className="pp-input-group">
          <label className="flex items-center gap-1.5"><Receipt className="h-3.5 w-3.5" /> Purchase costs</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" className="pl-8" value={purchaseCosts} onChange={(e) => setPurchaseCosts(Number(e.target.value))} />
          </div>
        </div>
        <div className="pp-input-group">
          <label className="flex items-center gap-1.5"><Receipt className="h-3.5 w-3.5" /> Sale costs</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" className="pl-8" value={saleCosts} onChange={(e) => setSaleCosts(Number(e.target.value))} />
          </div>
        </div>
        <div className="pp-input-group">
          <label>Capital improvements</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" className="pl-8" value={improvements} onChange={(e) => setImprovements(Number(e.target.value))} />
          </div>
        </div>
        <div className="pp-input-group">
          <label className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Years held</label>
          <input type="number" value={yearsHeld} onChange={(e) => setYearsHeld(Number(e.target.value))} />
        </div>
        <div className="pp-input-group">
          <label>Property type</label>
          <select value={isInvestment ? 'investment' : 'ppor'} onChange={(e) => setIsInvestment(e.target.value === 'investment')}>
            <option value="investment">Investment property</option>
            <option value="ppor">Primary residence (PPOR)</option>
          </select>
        </div>
        <div className="pp-input-group">
          <label className="flex items-center gap-1.5"><Percent className="h-3.5 w-3.5" /> Your taxable income</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" className="pl-8" value={taxableIncome} onChange={(e) => setTaxableIncome(Number(e.target.value))} />
          </div>
        </div>
      </div>

      {/* Results */}
      {results.capitalGain !== 0 && (
        <div className="mt-8 space-y-4">
          {/* Step-by-step calculation */}
          <div className="pp-worked-example">
            <span className="pp-we-label">CGT Calculation</span>
            
            <div className="pp-step">
              <div className="pp-step-num">1</div>
              <div className="pp-step-body">
                <p><strong>Capital proceeds</strong> (sale price minus costs):</p>
                <p className="font-mono text-sm">${salePrice.toLocaleString()} − ${saleCosts.toLocaleString()} = <strong>${(salePrice - saleCosts).toLocaleString()}</strong></p>
              </div>
            </div>
            
            <div className="pp-step">
              <div className="pp-step-num">2</div>
              <div className="pp-step-body">
                <p><strong>Cost base</strong> (purchase + costs + improvements):</p>
                <p className="font-mono text-sm">${purchasePrice.toLocaleString()} + ${purchaseCosts.toLocaleString()} + ${improvements.toLocaleString()} = <strong>${(purchasePrice + purchaseCosts + improvements).toLocaleString()}</strong></p>
              </div>
            </div>
            
            <div className="pp-step">
              <div className="pp-step-num">3</div>
              <div className="pp-step-body">
                <p><strong>Capital gain</strong>:</p>
                <p className="font-mono text-sm">${(salePrice - saleCosts).toLocaleString()} − ${(purchasePrice + purchaseCosts + improvements).toLocaleString()} = <strong className="text-blue-700">${results.capitalGain.toLocaleString()}</strong></p>
              </div>
            </div>

            {results.discountApplied && (
              <div className="pp-step">
                <div className="pp-step-num">4</div>
                <div className="pp-step-body">
                  <p><strong>50% CGT discount</strong> applied (held {yearsHeld} years):</p>
                  <p className="font-mono text-sm">${results.capitalGain.toLocaleString()} × 50% = discount of <strong className="text-emerald-600">${results.discountAmount.toLocaleString()}</strong></p>
                </div>
              </div>
            )}

            <div className="pp-step">
              <div className="pp-step-num">{results.discountApplied ? 5 : 4}</div>
              <div className="pp-step-body">
                <p><strong>Net capital gain</strong> added to taxable income:</p>
                <p className="font-mono text-sm"><strong className="text-amber-700">${results.discountedGain.toLocaleString()}</strong></p>
              </div>
            </div>

            <div className="pp-we-answer">
              <p className="font-semibold text-blue-800">Estimated CGT payable: ${results.cgtLiability.toLocaleString()} ({results.effectiveRate}% of gross gain)</p>
              <p>Net profit after tax: ${results.netProfit.toLocaleString()}</p>
            </div>
          </div>

          {/* Key result */}
          <div className="pp-result-box">
            <span className="result-label">Net profit after CGT</span>
            <div className="result-value">${results.netProfit.toLocaleString()}</div>
            <p className="result-note">${results.cgtLiability.toLocaleString()} tax payable on ${results.capitalGain.toLocaleString()} gain</p>
          </div>
        </div>
      )}

      {/* Info callout */}
      <div className="pp-callout pp-callout-amber mt-6">
        <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <strong>CGT Discount:</strong> Australian residents get a 50% discount on capital gains for assets held {'>'} 12 months. 
          Primary residences are generally CGT-exempt. This calculator provides an estimate — consult a tax professional for advice specific to your situation.
        </div>
      </div>
      <CalculatorDisclaimer />
    </div>
  );
}
