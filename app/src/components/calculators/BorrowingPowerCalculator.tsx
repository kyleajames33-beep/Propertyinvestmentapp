import { useState, useMemo, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  CalcLayout, TwoColumnLayout, SliderControl, KpiCard, KpiGrid,
  InfoRow, ChartPanel, PhaseBar, fmtDollar, fmtDollarFull,
} from './CalculatorShell';
import { CalculatorCta } from './CalculatorCta';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';
import { EmailMyResult } from '@/components/EmailMyResult';
import { Badge } from '@/components/ui/badge';
import { trackCalculatorUse } from '@/lib/badges';
import { usePersistedState, resetCalcState } from '@/lib/calc-persistence';
import { useCalcUrlState } from '@/lib/calc-url-state';

export function BorrowingPowerCalculator() {
  useEffect(() => { trackCalculatorUse('Borrowing Power'); }, []);
  const [income, setIncome] = usePersistedState('borrowing_power', 'income', 90000);
  const [partnerIncome, setPartnerIncome] = usePersistedState('borrowing_power', 'partnerIncome', 0);
  const [expenses, setExpenses] = usePersistedState('borrowing_power', 'expenses', 400);
  const [rate, setRate] = usePersistedState('borrowing_power', 'rate', 6.24);
  const [deposit, setDeposit] = usePersistedState('borrowing_power', 'deposit', 120000);
  const [existingDebt, setExistingDebt] = usePersistedState('borrowing_power', 'existingDebt', 0);
  const [prefilledFromProfile, setPrefilledFromProfile] = useState(false);

  useCalcUrlState('borrowing_power', {
    income, partnerIncome, expenses, rate, deposit, existingDebt,
  }, {
    income: (v) => setIncome(Number(v)),
    partnerIncome: (v) => setPartnerIncome(Number(v)),
    expenses: (v) => setExpenses(Number(v)),
    rate: (v) => setRate(Number(v)),
    deposit: (v) => setDeposit(Number(v)),
    existingDebt: (v) => setExistingDebt(Number(v)),
  });

  useEffect(() => {
    const raw = localStorage.getItem('pp_property_profile');
    if (!raw) return;
    try {
      const profile = JSON.parse(raw) as { budgetMax?: number; depositSaved?: number };
      let didPrefill = false;
      if (profile.depositSaved && deposit === 120000) {
        setDeposit(profile.depositSaved);
        didPrefill = true;
      }
      if (profile.budgetMax && income === 90000) {
        const estimatedIncome = Math.round(profile.budgetMax / 5 / 1000) * 1000;
        setIncome(estimatedIncome);
        didPrefill = true;
      }
      if (didPrefill) setPrefilledFromProfile(true);
    } catch {
      /* ignore invalid JSON */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalIncome = income + partnerIncome;

  const results = useMemo(() => {
    const annualExpenses = expenses * 52;
    const annualDebt = existingDebt * 12;
    const netIncome = totalIncome - annualExpenses - annualDebt;

    // APRA serviceability: assess at min(rate + 3%, or floor 7.5%)
    const assessRate = Math.max(rate + 3, 7.5);
    const monthlyAssessRate = assessRate / 100 / 12;
    const maxMonthlyRepayment = netIncome * 0.3 / 12; // 30% of net income

    // Max loan at assessment rate over 30 years
    const n = 30 * 12;
    const maxLoan = maxMonthlyRepayment * ((Math.pow(1 + monthlyAssessRate, n) - 1) / (monthlyAssessRate * Math.pow(1 + monthlyAssessRate, n)));

    // Actual repayment at current rate
    const _actualRate = rate / 100 / 12;
    const actualMonthlyRepayment = maxLoan * ((_actualRate * Math.pow(1 + _actualRate, n)) / (Math.pow(1 + _actualRate, n) - 1));

    const maxPrice = maxLoan + deposit;
    const lvr = deposit / maxPrice * 100;
    const lmi = lvr < 20 ? maxLoan * 0.015 : 0;

    // Build chart data: affordability across different interest rates
    const chartData = Array.from({ length: 21 }, (_, i) => {
      const r = 2 + i * 0.5; // 2% to 12%
      const assessR = Math.max(r + 3, 7.5);
      const aRate = assessR / 100 / 12;
      const aN = 30 * 12;
      const aRepay = netIncome * 0.3 / 12;
      const aLoan = aRepay * ((Math.pow(1 + aRate, aN) - 1) / (aRate * Math.pow(1 + aRate, aN)));
      const aPrice = aLoan + deposit;
      return { rate: r, price: Math.round(aPrice), loan: Math.round(aLoan) };
    });

    return {
      maxLoan: Math.round(maxLoan),
      maxPrice: Math.round(maxPrice),
      actualMonthlyRepayment: Math.round(actualMonthlyRepayment),
      lvr: Math.round(lvr * 10) / 10,
      lmi: Math.round(lmi),
      assessRate: assessRate,
      netIncome,
      chartData,
    };
  }, [income, partnerIncome, expenses, rate, deposit, existingDebt, totalIncome]);

  // Find current rate point in chart
  const currentPoint = results.chartData.find(d => d.rate >= rate) || results.chartData[results.chartData.length - 1];

  const handleReset = () => {
    resetCalcState('borrowing_power');
    setIncome(90000);
    setPartnerIncome(0);
    setExpenses(400);
    setRate(6.24);
    setDeposit(120000);
    setExistingDebt(0);
  };

  const sliderProps = {
    income: { label: 'Your annual income (gross)', value: income, min: 30000, max: 300000, step: 1000, format: (v: number) => '$' + v.toLocaleString(), onChange: setIncome },
    partnerIncome: { label: 'Partner income (0 if single)', value: partnerIncome, min: 0, max: 300000, step: 1000, format: (v: number) => '$' + v.toLocaleString(), onChange: setPartnerIncome },
    expenses: { label: 'Weekly living expenses', value: expenses, min: 0, max: 3000, step: 50, format: (v: number) => '$' + v.toLocaleString(), onChange: setExpenses },
    rate: { label: 'Interest rate', value: rate, min: 2, max: 12, step: 0.25, format: (v: number) => v.toFixed(2) + '%', onChange: setRate },
    deposit: { label: 'Deposit saved', value: deposit, min: 10000, max: 500000, step: 5000, format: (v: number) => '$' + v.toLocaleString(), onChange: setDeposit },
    existingDebt: { label: 'Existing monthly debt repayments', value: existingDebt, min: 0, max: 5000, step: 100, format: (v: number) => '$' + v.toLocaleString(), onChange: setExistingDebt },
  };

  return (
    <CalcLayout title="Borrowing Power Calculator" subtitle="See how much you can borrow based on income, expenses, and current interest rates">
      {prefilledFromProfile && (
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
            Pre-filled from your profile
          </span>
        </div>
      )}
      <TwoColumnLayout
        left={
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Your details</span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Reset calculator"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>
            <SliderControl {...sliderProps.income} />
            <SliderControl {...sliderProps.partnerIncome} />
            <div className="h-px bg-slate-200 my-4" />
            <SliderControl {...sliderProps.expenses} />
            <SliderControl {...sliderProps.existingDebt} />
            <div className="h-px bg-slate-200 my-4" />
            <SliderControl {...sliderProps.deposit} />
            <SliderControl {...sliderProps.rate} />
          </>
        }
        rightTitle="Results"
        right={
          <>
            {/* KPI Cards */}
            <KpiGrid>
              <KpiCard label="Max loan" value={fmtDollarFull(results.maxLoan)} sub="At assessment rate" variant="accent" />
              <KpiCard label="Max property price" value={fmtDollarFull(results.maxPrice)} sub="Deposit + loan" variant="success" />
              <KpiCard label="Monthly repayment" value={fmtDollarFull(results.actualMonthlyRepayment)} sub={`At ${rate}%`} variant="gold" />
              <KpiCard label="LVR" value={results.lvr + '%'} sub={results.lvr < 20 ? 'LMI required' : 'No LMI'} variant={results.lvr < 20 ? 'warning' : 'default'} />
            </KpiGrid>

            {/* Details */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
              <InfoRow label="Annual net income (after expenses)" value={fmtDollarFull(results.netIncome)} />
              <InfoRow label="Assessment rate (APRA buffer)" value={results.assessRate.toFixed(2) + '%'} />
              <InfoRow label="Estimated LMI" value={results.lmi > 0 ? fmtDollarFull(results.lmi) : '$0'} bold={results.lmi > 0} />
            </div>

            {/* Chart */}
            <ChartPanel
              title="Affordability across interest rates"
              subtitle="How much you could buy at different rates with your current deposit"
              legend={[{ color: '#0891b2', label: 'Max property price' }, { color: '#f59e0b', label: 'Your current rate' }]}
              footer={
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    At {rate}%: {fmtDollarFull(currentPoint.price)}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Rates between 2%â€“12% shown. Hover for values.
                  </span>
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={results.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0891b2" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="rate" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${v}%`} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'ui-monospace' }} tickFormatter={(v) => fmtDollar(v)} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                    formatter={(value: number) => [fmtDollarFull(value), 'Max price']}
                    labelFormatter={(label: number) => `${label}% interest`}
                  />
                  <Area type="monotone" dataKey="price" stroke="#0891b2" strokeWidth={2.5} fill="url(#bpGrad)" />
                  <ReferenceLine x={rate} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartPanel>

            {/* Phase bar */}
            <PhaseBar savePct={(deposit / results.maxPrice) * 100} label={`${Math.round((deposit / results.maxPrice) * 100)}% deposit`} />
          </>
        }
      />

      {/* Note */}
      <div className="mt-6 pp-callout pp-callout-amber">
        <span className="pp-callout-tag">Note</span>
        <p className="text-sm">
          This calculator uses APRA serviceability guidelines (assess at the higher of your rate + 3% or 7.5%).
          Actual borrowing power varies by lender. LMI estimate assumes single premium. Consult a mortgage broker for a precise assessment.
        </p>
      </div>
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <EmailMyResult
          calculatorName="Borrowing Power Calculator"
          resultText={`Max loan: $${Math.round(results.maxLoan).toLocaleString()}\
Monthly repayment: $${Math.round(results.actualMonthlyRepayment).toLocaleString()}`}
        />
      </div>
      <CalculatorDisclaimer />
      <CalculatorCta
        calculatorName="Borrowing Power"
        headline="Want a precise borrowing assessment?"
        subline="A mortgage broker can check lender-specific criteria and find you the best rate."
        ctaText="Connect with a broker"
        professionalType="mortgage broker"
      />
    </CalcLayout>
  );
}



