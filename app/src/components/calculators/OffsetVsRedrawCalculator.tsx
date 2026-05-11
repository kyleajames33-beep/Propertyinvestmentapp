import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { ArrowRight, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function OffsetVsRedrawCalculator() {
  useEffect(() => { trackCalculatorUse('Offset vs Redraw'); }, []);
  const [inputs, setInputs] = useState({
    loanAmount: 500000,
    interestRate: 6.24,
    loanTerm: 30,
    savings: 50000,
    monthlySavings: 1000,
    isInvestment: false,
  });

  const results = useMemo(() => {
    const monthlyRate = inputs.interestRate / 100 / 12;
    const numPayments = inputs.loanTerm * 12;

    // Scenario 1: Offset account
    let offsetBalance = inputs.savings;
    let offsetLoanBalance = inputs.loanAmount;
    let offsetTotalInterest = 0;
    let offsetMonths = 0;

    for (let m = 0; m < numPayments; m++) {
      const effectiveBalance = Math.max(0, offsetLoanBalance - offsetBalance);
      const interest = effectiveBalance * monthlyRate;
      const repayment = inputs.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      const principal = repayment - interest;
      offsetLoanBalance -= principal;
      offsetTotalInterest += interest;
      offsetBalance += inputs.monthlySavings;
      offsetMonths++;
      if (offsetLoanBalance <= 0) break;
    }

    // Scenario 2: Redraw facility
    let redrawLoanBalance = inputs.loanAmount - inputs.savings;
    let redrawTotalInterest = 0;
    let redrawMonths = 0;
    let redrawAvailable = inputs.savings;

    const baseRepayment = inputs.loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

    for (let m = 0; m < numPayments; m++) {
      const interest = redrawLoanBalance * monthlyRate;
      const principal = baseRepayment - interest;
      redrawLoanBalance -= principal;
      redrawTotalInterest += interest;
      redrawAvailable += inputs.monthlySavings;
      redrawMonths++;
      if (redrawLoanBalance <= 0) break;
    }

    // Tax implication for investors
    const taxDifference = inputs.isInvestment ? inputs.savings * 0.325 : 0;

    return {
      offset: {
        totalInterest: Math.round(offsetTotalInterest),
        months: offsetMonths,
        interestSaved: Math.round(redrawTotalInterest - offsetTotalInterest),
        years: Math.round(offsetMonths / 12 * 10) / 10,
      },
      redraw: {
        totalInterest: Math.round(redrawTotalInterest),
        months: redrawMonths,
        years: Math.round(redrawMonths / 12 * 10) / 10,
      },
      taxDifference: Math.round(taxDifference),
      monthlyRepayment: Math.round(baseRepayment),
    };
  }, [inputs]);

  return (
    <div className="pp-calc-card">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-400 flex items-center justify-center">
          <ArrowRight className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-serif">Offset vs Redraw</h3>
          <p className="text-sm text-slate-500">See the difference in interest saved and tax implications</p>
        </div>
      </div>

      <div className="pp-calc-grid mt-6">
        <div className="pp-input-group">
          <label>Loan amount</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" value={inputs.loanAmount} onChange={e => setInputs({...inputs, loanAmount: Number(e.target.value)})} className="pl-8" /></div>
        </div>
        <div className="pp-input-group">
          <label>Interest rate (%)</label>
          <input type="number" step="0.01" value={inputs.interestRate} onChange={e => setInputs({...inputs, interestRate: Number(e.target.value)})} />
        </div>
        <div className="pp-input-group">
          <label>Starting savings</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" value={inputs.savings} onChange={e => setInputs({...inputs, savings: Number(e.target.value)})} className="pl-8" /></div>
        </div>
        <div className="pp-input-group">
          <label>Monthly savings added</label>
          <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" value={inputs.monthlySavings} onChange={e => setInputs({...inputs, monthlySavings: Number(e.target.value)})} className="pl-8" /></div>
        </div>
        <div className="pp-input-group">
          <label>Property use</label>
          <select value={inputs.isInvestment ? 'inv' : 'oo'} onChange={e => setInputs({...inputs, isInvestment: e.target.value === 'inv'})}>
            <option value="oo">Owner-occupied</option>
            <option value="inv">Investment</option>
          </select>
        </div>
        <div className="pp-input-group">
          <label>Loan term</label>
          <select value={inputs.loanTerm} onChange={e => setInputs({...inputs, loanTerm: Number(e.target.value)})}>
            <option value={20}>20 years</option><option value={25}>25 years</option><option value={30}>30 years</option>
          </select>
        </div>
      </div>

      {/* Side by side comparison */}
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        {/* Offset */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border-2 border-blue-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-bold text-blue-900">Offset Account</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-blue-700">Total interest paid</span><span className="font-semibold text-blue-900">${(results.offset.totalInterest / 1000).toFixed(0)}k</span></div>
            <div className="flex justify-between"><span className="text-sm text-blue-700">Loan paid off in</span><span className="font-semibold text-blue-900">{results.offset.years} years</span></div>
            <div className="bg-blue-200/50 rounded-lg p-3 mt-3">
              <div className="flex justify-between"><span className="text-sm text-blue-800">Interest saved vs redraw</span><span className="font-bold text-blue-900">${(results.offset.interestSaved / 1000).toFixed(0)}k</span></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2 text-xs text-blue-700">
              <TrendingUp className="h-3 w-3 flex-shrink-0 mt-0.5" />
              <span>Savings are separate — loan balance unchanged for tax</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-blue-700">
              <TrendingUp className="h-3 w-3 flex-shrink-0 mt-0.5" />
              <span>Easy access — works like a transaction account</span>
            </div>
            {inputs.isInvestment && (
              <div className="flex items-start gap-2 text-xs text-green-700 font-medium">
                <Shield className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <span>Preserves full loan deductibility for investors</span>
              </div>
            )}
          </div>
        </div>

        {/* Redraw */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-slate-400 flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
            <h4 className="font-bold text-slate-700">Redraw Facility</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-sm text-slate-600">Total interest paid</span><span className="font-semibold text-slate-800">${(results.redraw.totalInterest / 1000).toFixed(0)}k</span></div>
            <div className="flex justify-between"><span className="text-sm text-slate-600">Loan paid off in</span><span className="font-semibold text-slate-800">{results.redraw.years} years</span></div>
            <div className="bg-amber-50 rounded-lg p-3 mt-3 border border-amber-200">
              <div className="flex justify-between"><span className="text-sm text-amber-800">Extra interest vs offset</span><span className="font-bold text-amber-900">+${(results.offset.interestSaved / 1000).toFixed(0)}k</span></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <ArrowRight className="h-3 w-3 flex-shrink-0 mt-0.5" />
              <span>Extra repayments reduce loan balance directly</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <ArrowRight className="h-3 w-3 flex-shrink-0 mt-0.5" />
              <span>Redraw has limits — some lenders charge fees</span>
            </div>
            {inputs.isInvestment && (
              <div className="flex items-start gap-2 text-xs text-red-600 font-medium">
                <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                <span>Reducing balance reduces future tax deductions!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {inputs.isInvestment && (
        <div className="pp-callout pp-callout-red mt-4">
          <span className="pp-callout-tag">Investor warning</span>
          <div>
            With redraw, every dollar you pay off the loan reduces the deductible debt. 
            If you redraw later for personal use, the ATO may treat that portion as non-deductible. 
            Offset accounts keep savings separate, preserving your full loan deductibility. 
            This could save you ${(results.taxDifference / 1000).toFixed(1)}k+ in tax deductions over the life of the loan.
          </div>
        </div>
      )}

      <div className="pp-callout pp-callout-blue mt-4">
        <span className="pp-callout-tag">The key difference</span>
        <div>
          Both offset and redraw reduce the interest you pay. The difference is tax and flexibility: 
          offset keeps your savings accessible without changing the loan balance; redraw permanently 
          reduces the balance (good for owner-occupiers, risky for investors who need deductible debt).
        </div>
      </div>
      <CalculatorDisclaimer />
    </div>
  );
}
