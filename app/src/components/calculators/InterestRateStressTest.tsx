import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  CalcLayout, TwoColumnLayout, SliderControl, KpiCard, KpiGrid,
  InfoRow, ChartPanel, fmtDollar, fmtDollarFull,
} from './CalculatorShell';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function InterestRateStressTest() {
  useEffect(() => { trackCalculatorUse('Interest Rate Stress Test'); }, []);
  const [loan, setLoan] = useState(600000);
  const [rate, setRate] = useState(6.24);
  const [term, setTerm] = useState(30);
  const [income, setIncome] = useState(95000);
  const [expenses, setExpenses] = useState(800);
  const [stressScenarios] = useState([1, 2, 3]); // +1%, +2%, +3%

  const results = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const n = term * 12;
    const baseRepayment = loan * ((monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));
    const annualExpenses = expenses * 52;
    const netIncome = income - annualExpenses;
    const baseRatio = (baseRepayment * 12) / income * 100;

    const scenarios = stressScenarios.map(inc => {
      const newRate = rate + inc;
      const mRate = newRate / 100 / 12;
      const repayment = loan * ((mRate * Math.pow(1 + mRate, n)) / (Math.pow(1 + mRate, n) - 1));
      const annualRepayment = repayment * 12;
      const ratio = annualRepayment / income * 100;
      const excess = netIncome - annualRepayment;
      const weeklySurplus = excess / 52;
      return {
        increase: inc,
        rate: newRate,
        monthly: Math.round(repayment),
        annual: Math.round(annualRepayment),
        ratio: Math.round(ratio * 10) / 10,
        weeklySurplus: Math.round(weeklySurplus),
        safe: ratio < 30,
        warning: ratio >= 30 && ratio < 40,
        danger: ratio >= 40,
      };
    });

    // Chart data: repayment over rate range
    const chartData = Array.from({ length: 41 }, (_, i) => {
      const r = 2 + i * 0.25;
      const mr = r / 100 / 12;
      const rep = loan * ((mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1));
      const ann = rep * 12;
      return {
        rate: r,
        repayment: Math.round(rep),
        ratio: Math.round((ann / income) * 1000) / 10,
        safe30: income * 0.3 / 12, // 30% line
        safe35: income * 0.35 / 12, // 35% line
      };
    });

    return { baseRepayment: Math.round(baseRepayment), baseRatio: Math.round(baseRatio * 10) / 10, scenarios, chartData, netIncome };
  }, [loan, rate, term, income, expenses, stressScenarios]);

  const getScenarioColor = (s: typeof results.scenarios[0]) => {
    if (s.danger) return '#ef4444';
    if (s.warning) return '#f59e0b';
    return '#16a34a';
  };

  return (
    <CalcLayout title="Interest Rate Stress Test" subtitle="See how your mortgage holds up if rates rise 1%, 2%, or 3%">
      <TwoColumnLayout
        leftTitle="Your mortgage"
        left={
          <>
            <SliderControl label="Loan amount" value={loan} min={100000} max={2000000} step={10000} format={(v) => '$' + v.toLocaleString()} onChange={setLoan} />
            <SliderControl label="Current interest rate" value={rate} min={2} max={12} step={0.25} format={(v) => v.toFixed(2) + '%'} onChange={setRate} />
            <SliderControl label="Loan term" value={term} min={5} max={40} step={1} format={(v) => v + ' yrs'} onChange={setTerm} />
            <div className="h-px bg-slate-200 my-4" />
            <SliderControl label="Annual income (gross)" value={income} min={30000} max={300000} step={5000} format={(v) => '$' + v.toLocaleString()} onChange={setIncome} />
            <SliderControl label="Weekly expenses" value={expenses} min={0} max={3000} step={50} format={(v) => '$' + v.toLocaleString()} onChange={setExpenses} />
          </>
        }
        rightTitle="Stress test results"
        right={
          <>
            <KpiGrid>
              <KpiCard label="Current repayment" value={fmtDollarFull(results.baseRepayment) + '/mo'} sub={`${results.baseRatio}% of income`} variant="accent" />
              <KpiCard label="Net income after expenses" value={fmtDollarFull(results.netIncome)} sub="Annual" variant="default" />
            </KpiGrid>

            {/* Scenario cards */}
            <div className="space-y-2 mb-4">
              {results.scenarios.map((s) => (
                <div
                  key={s.increase}
                  className="rounded-xl border p-4 transition-all"
                  style={{
                    borderColor: getScenarioColor(s) + '40',
                    background: getScenarioColor(s) + '08',
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: getScenarioColor(s) }} />
                      <span className="text-sm font-semibold text-slate-700">
                        +{s.increase}% → {s.rate.toFixed(2)}%
                      </span>
                    </div>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: getScenarioColor(s) + '20',
                        color: getScenarioColor(s),
                      }}
                    >
                      {s.danger ? 'DANGER' : s.warning ? 'TIGHT' : 'OK'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xs text-slate-500">Monthly</div>
                      <div className="font-mono font-semibold text-slate-800">{fmtDollarFull(s.monthly)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">% of income</div>
                      <div className="font-mono font-semibold text-slate-800">{s.ratio}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500">Weekly surplus</div>
                      <div className={`font-mono font-semibold ${s.weeklySurplus < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {s.weeklySurplus >= 0 ? '+' : ''}{fmtDollarFull(s.weeklySurplus)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <ChartPanel
              title="Repayment vs interest rate"
              subtitle="Red zone = over 35% of income. Amber = 30–35%. Green = under 30%."
              legend={[
                { color: '#0891b2', label: 'Monthly repayment' },
                { color: '#f59e0b', label: 'Current rate' },
              ]}
            >
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={results.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0891b2" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="rate" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'ui-monospace' }} tickFormatter={(v) => fmtDollar(v)} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                    formatter={(value: number, name: string) => {
                      if (name === 'Repayment') return [fmtDollarFull(value), 'Monthly repayment'];
                      if (name === 'ratio') return [value + '%', '% of income'];
                      return [fmtDollarFull(value), name];
                    }}
                    labelFormatter={(label: number) => `${label}% interest`}
                  />
                  <Area type="monotone" dataKey="repayment" name="Repayment" stroke="#0891b2" strokeWidth={2.5} fill="url(#stressGrad)" />
                  <ReferenceLine x={rate} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartPanel>

            {/* Info rows */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mt-4">
              <InfoRow label="Total extra if rates rise +3%" value={fmtDollarFull(results.scenarios[2].annual - results.baseRepayment * 12)} bold />
              <InfoRow label="APRA stress test buffer" value="Current rate + 3% or 7.5% floor" />
            </div>
          </>
        }
      />
      <CalculatorDisclaimer />
    </CalcLayout>
  );
}
