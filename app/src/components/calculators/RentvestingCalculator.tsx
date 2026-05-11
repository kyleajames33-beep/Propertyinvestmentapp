import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  CalcLayout, TwoColumnLayout, SliderControl, KpiCard, KpiGrid,
  InfoRow, ChartPanel, fmtDollarFull,
} from './CalculatorShell';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function RentvestingCalculator() {
  useEffect(() => { trackCalculatorUse('Rentvesting'); }, []);
  const [liveRent, setLiveRent] = useState(3200);
  const [investPrice, setInvestPrice] = useState(550000);
  const [investRent, setInvestRent] = useState(520);
  const [investRate, setInvestRate] = useState(6.24);
  const [investGrowth, setInvestGrowth] = useState(5.5);
  const [deposit, setDeposit] = useState(110000);
  const [income, setIncome] = useState(100000);

  const results = useMemo(() => {
    const loan = investPrice - deposit;
    const monthlyRate = investRate / 100 / 12;
    const n = 30 * 12;
    const monthlyRepayment = loan * ((monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));
    const annualRepayment = monthlyRepayment * 12;
    const annualInvestRent = investRent * 52;
    const annualLiveRent = liveRent * 12;
    const annualCosts = annualRepayment + (investPrice * 0.015) + 2000; // 1.5% ownership + insurance
    const cashflow = annualInvestRent - annualCosts;

    // 30-year projection
    const years = Array.from({ length: 31 }, (_, i) => i);
    const chartData = years.map(yr => {
      const propertyValue = investPrice * Math.pow(1 + investGrowth / 100, yr);
      // Remaining balance approximation
      const remainingBal = loan > 0 ? loan * Math.pow(1 + investRate / 100 / 12, yr * 12) - monthlyRepayment * ((Math.pow(1 + investRate / 100 / 12, yr * 12) - 1) / (investRate / 100 / 12)) : 0;
      const equity = propertyValue - Math.max(0, remainingBal);
      const totalRentPaid = annualLiveRent * yr;
      const totalInvestIncome = annualInvestRent * yr;
      return {
        year: yr,
        equity: Math.round(equity),
        totalRentPaid: Math.round(totalRentPaid),
        netPosition: Math.round(equity - totalRentPaid),
        investIncome: Math.round(totalInvestIncome),
      };
    });

    const yr10 = chartData[10];
    const yr30 = chartData[30];

    return {
      monthlyRepayment: Math.round(monthlyRepayment),
      annualRepayment,
      annualInvestRent,
      annualLiveRent,
      annualCosts: Math.round(annualCosts),
      cashflow: Math.round(cashflow),
      chartData,
      yr10,
      yr30,
      lvr: Math.round((loan / investPrice) * 1000) / 10,
    };
  }, [liveRent, investPrice, investRent, investRate, investGrowth, deposit, income]);

  return (
    <CalcLayout title="Rentvesting Calculator" subtitle="Rent where you want to live, buy where you can afford — see if the numbers stack up">
      <TwoColumnLayout
        leftTitle="Your situation"
        left={
          <>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Where you live</div>
            <SliderControl label="Monthly rent (where you live)" value={liveRent} min={1000} max={6000} step={100} format={(v) => '$' + v.toLocaleString()} onChange={setLiveRent} />
            <SliderControl label="Your annual income" value={income} min={50000} max={300000} step={5000} format={(v) => '$' + v.toLocaleString()} onChange={setIncome} />

            <div className="h-px bg-slate-200 my-4" />
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Investment property</div>
            <SliderControl label="Investment property price" value={investPrice} min={200000} max={1200000} step={10000} format={(v) => '$' + v.toLocaleString()} onChange={setInvestPrice} />
            <SliderControl label="Deposit" value={deposit} min={20000} max={300000} step={5000} format={(v) => '$' + v.toLocaleString()} onChange={setDeposit} />
            <SliderControl label="Weekly rent received" value={investRent} min={300} max={1500} step={20} format={(v) => '$' + v.toLocaleString()} onChange={setInvestRent} />
            <SliderControl label="Interest rate" value={investRate} min={2} max={12} step={0.25} format={(v) => v.toFixed(2) + '%'} onChange={setInvestRate} />
            <SliderControl label="Property growth / yr" value={investGrowth} min={0} max={12} step={0.5} format={(v) => v.toFixed(1) + '%'} onChange={setInvestGrowth} />
          </>
        }
        rightTitle="Rentvesting results"
        right={
          <>
            <KpiGrid>
              <KpiCard label="Monthly mortgage" value={fmtDollarFull(results.monthlyRepayment)} sub="Investment property" variant="accent" />
              <KpiCard label="Annual cashflow" value={results.cashflow >= 0 ? '+' + fmtDollarFull(results.cashflow) : fmtDollarFull(results.cashflow)} sub="Rent − costs" variant={results.cashflow >= 0 ? 'success' : 'warning'} />
              <KpiCard label="Total rent you pay" value={fmtDollarFull(results.annualLiveRent)} sub="Per year (where you live)" variant="default" />
              <KpiCard label="LVR" value={results.lvr + '%'} sub="Loan-to-value ratio" variant={results.lvr > 80 ? 'warning' : 'default'} />
            </KpiGrid>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Annual breakdown</div>
              <InfoRow label="Rental income (investment)" value={fmtDollarFull(results.annualInvestRent)} />
              <InfoRow label="Mortgage repayments" value={fmtDollarFull(results.annualRepayment)} />
              <InfoRow label="Ownership costs" value={fmtDollarFull(results.annualCosts - results.annualRepayment)} />
              <InfoRow label="Total ownership costs" value={fmtDollarFull(results.annualCosts)} />
              <InfoRow label="Your rent (where you live)" value={fmtDollarFull(results.annualLiveRent)} bold />
              <InfoRow label="Net annual position" value={results.cashflow >= 0 ? '+' + fmtDollarFull(results.cashflow) : fmtDollarFull(results.cashflow)} bold />
            </div>

            {/* Chart */}
            <ChartPanel
              title="Your wealth position over 30 years"
              subtitle="Investment equity vs. total rent paid living elsewhere"
              legend={[{ color: '#0891b2', label: 'Investment equity' }, { color: '#ef4444', label: 'Total rent paid' }]}
            >
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={results.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="rvEquity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0891b2" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => v % 5 === 0 ? `Yr ${v}` : ''} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'ui-monospace' }} tickFormatter={(v) => fmtDollarFull(v)} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                    formatter={(value: number, name: string) => [fmtDollarFull(value), name]}
                    labelFormatter={(label: number) => `Year ${label}`}
                  />
                  <Area type="monotone" dataKey="equity" name="Investment equity" stroke="#0891b2" strokeWidth={2.5} fill="url(#rvEquity)" />
                  <Area type="monotone" dataKey="totalRentPaid" name="Total rent paid" stroke="#ef4444" strokeWidth={2} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartPanel>

            {/* Milestones */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-teal-700 uppercase tracking-widest mb-1">Year 10</div>
                <div className="font-mono font-semibold text-teal-800">{fmtDollarFull(results.yr10.equity)}</div>
                <div className="text-xs text-teal-600">Investment equity</div>
                <div className="text-xs text-teal-500 mt-1">Net position: {fmtDollarFull(results.yr10.netPosition)}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-1">Year 30</div>
                <div className="font-mono font-semibold text-emerald-800">{fmtDollarFull(results.yr30.equity)}</div>
                <div className="text-xs text-emerald-600">Investment equity</div>
                <div className="text-xs text-emerald-500 mt-1">Net position: {fmtDollarFull(results.yr30.netPosition)}</div>
              </div>
            </div>

            {/* Insight */}
            <div className={`mt-4 rounded-xl border p-4 ${results.cashflow >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <p className={`text-sm font-medium ${results.cashflow >= 0 ? 'text-emerald-800' : 'text-amber-800'}`}>
                {results.cashflow >= 0
                  ? `✓ Positive cashflow! Your investment property generates ${fmtDollarFull(results.cashflow)}/year after all costs. This helps cover your living rent.`
                  : `⚠ Negative cashflow. You pay ${fmtDollarFull(Math.abs(results.cashflow))}/year to hold the investment. Make sure you can afford this plus your living rent.`}
              </p>
            </div>
          </>
        }
      />
      <CalculatorDisclaimer />
    </CalcLayout>
  );
}
