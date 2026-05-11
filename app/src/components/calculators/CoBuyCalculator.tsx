import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import {
  CalcLayout, TwoColumnLayout, SliderControl, KpiCard, KpiGrid,
  fmtDollarFull,
} from './CalculatorShell';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function CoBuyCalculator() {
  useEffect(() => { trackCalculatorUse('Co-Buy'); }, []);
  const [numBuyers, setNumBuyers] = useState(2);
  const [propertyPrice, setPropertyPrice] = useState(900000);
  const [depositPct, setDepositPct] = useState(20);
  const [rate, setRate] = useState(6.24);
  const [incomeA, setIncomeA] = useState(85000);
  const [incomeB, setIncomeB] = useState(75000);
  const [incomeC, setIncomeC] = useState(60000);
  const [term, setTerm] = useState(30);

  const results = useMemo(() => {
    const deposit = propertyPrice * depositPct / 100;
    const loan = propertyPrice - deposit;
    const monthlyRate = rate / 100 / 12;
    const n = term * 12;
    const monthlyRepayment = loan * ((monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));
    const monthlyOwnership = propertyPrice * 0.015 / 12;
    const totalMonthly = monthlyRepayment + monthlyOwnership;

    const incomes = [incomeA, incomeB, ...(numBuyers >= 3 ? [incomeC] : [])];
    const totalIncome = incomes.reduce((s, i) => s + i, 0);
    const shares = incomes.map(i => i / totalIncome);

    const buyerData = shares.map((share, idx) => ({
      name: `Buyer ${String.fromCharCode(65 + idx)}`,
      income: incomes[idx],
      share: Math.round(share * 1000) / 10,
      deposit: Math.round(deposit * share),
      monthly: Math.round(totalMonthly * share),
      annual: Math.round(totalMonthly * share * 12),
      equity: Math.round(propertyPrice * share),
    }));

    return {
      deposit, loan, monthlyRepayment, monthlyOwnership, totalMonthly,
      totalIncome, buyerData,
    };
  }, [numBuyers, propertyPrice, depositPct, rate, incomeA, incomeB, incomeC, term]);

  return (
    <CalcLayout title="Co-Buy / Shared Ownership" subtitle="Buying with family, friends, or a partner? Split costs and equity fairly">
      <TwoColumnLayout
        leftTitle="The property"
        left={
          <>
            <SliderControl label="Property price" value={propertyPrice} min={300000} max={2000000} step={10000} format={(v) => '$' + v.toLocaleString()} onChange={setPropertyPrice} />
            <SliderControl label="Deposit" value={depositPct} min={5} max={40} step={1} format={(v) => v + '%'} onChange={setDepositPct} />
            <SliderControl label="Interest rate" value={rate} min={2} max={12} step={0.25} format={(v) => v.toFixed(2) + '%'} onChange={setRate} />
            <SliderControl label="Loan term" value={term} min={5} max={40} step={1} format={(v) => v + ' yrs'} onChange={setTerm} />

            <div className="h-px bg-slate-200 my-4" />
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Number of buyers</div>
            <div className="flex gap-2">
              {[2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setNumBuyers(n)}
                  className={`flex-1 text-center py-3 rounded-xl border text-sm font-medium transition-all ${
                    numBuyers === n
                      ? 'bg-teal-50 border-teal-300 text-teal-800'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {n} buyers
                </button>
              ))}
            </div>

            <div className="h-px bg-slate-200 my-4" />
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Each buyer's income</div>
            <SliderControl label="Buyer A annual income" value={incomeA} min={30000} max={300000} step={5000} format={(v) => '$' + v.toLocaleString()} onChange={setIncomeA} />
            <SliderControl label="Buyer B annual income" value={incomeB} min={30000} max={300000} step={5000} format={(v) => '$' + v.toLocaleString()} onChange={setIncomeB} />
            {numBuyers >= 3 && (
              <SliderControl label="Buyer C annual income" value={incomeC} min={30000} max={300000} step={5000} format={(v) => '$' + v.toLocaleString()} onChange={setIncomeC} />
            )}
          </>
        }
        rightTitle="Split breakdown"
        right={
          <>
            <KpiGrid>
              <KpiCard label="Total deposit" value={fmtDollarFull(results.deposit)} sub={`${depositPct}% of price`} variant="accent" />
              <KpiCard label="Total loan" value={fmtDollarFull(results.loan)} sub="Shared liability" variant="default" />
              <KpiCard label="Monthly repayment" value={fmtDollarFull(results.monthlyRepayment)} sub="Total" variant="gold" />
              <KpiCard label="Ownership costs" value={fmtDollarFull(results.monthlyOwnership)} sub="Rates, insurance, maintenance" variant="default" />
            </KpiGrid>

            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Each buyer's share</div>
            <div className="space-y-3">
              {results.buyerData.map((b, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-800">{b.name}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                      {b.share}% share
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-slate-500">Income</span>
                    <span className="font-mono text-slate-800 text-right">{fmtDollarFull(b.income)}</span>
                    <span className="text-slate-500">Deposit contribution</span>
                    <span className="font-mono text-slate-800 text-right">{fmtDollarFull(b.deposit)}</span>
                    <span className="text-slate-500">Monthly payment</span>
                    <span className="font-mono text-slate-800 text-right">{fmtDollarFull(b.monthly)}</span>
                    <span className="text-slate-500">Equity share</span>
                    <span className="font-mono text-slate-800 text-right">{fmtDollarFull(b.equity)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Key considerations */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-widest mb-2">Before you co-buy</div>
              <ul className="space-y-1.5 text-sm text-amber-700">
                <li className="flex items-start gap-2"><span>•</span>Get a co-ownership agreement drafted by a solicitor</li>
                <li className="flex items-start gap-2"><span>•</span>Agree on exit strategy upfront — what if someone wants to sell?</li>
                <li className="flex items-start gap-2"><span>•</span>Consider joint vs. tenants in common ownership structure</li>
                <li className="flex items-start gap-2"><span>•</span>Plan for one buyer losing income — can others cover?</li>
                <li className="flex items-start gap-2"><span>•</span>Discuss renovation decisions, rental income splits, etc.</li>
              </ul>
            </div>
          </>
        }
      />
      <CalculatorDisclaimer />
    </CalcLayout>
  );
}
