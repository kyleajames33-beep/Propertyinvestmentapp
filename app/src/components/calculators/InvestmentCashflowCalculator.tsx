import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { TrendingUp, AlertTriangle, Info } from 'lucide-react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts';
import {
  SliderControl, KpiCard, KpiGrid, CalcLayout, TwoColumnLayout,
  InfoRow, ChartPanel, fmtDollar, fmtDollarFull,
} from './CalculatorShell';
import { CalculatorCta } from './CalculatorCta';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';
import { ShareResult } from '@/components/ShareResult';

/* ─── Tax helpers ─── */
function getMarginalRate(income: number): number {
  if (income <= 18_200) return 0;
  if (income <= 45_000) return 0.19;
  if (income <= 120_000) return 0.325;
  if (income <= 180_000) return 0.37;
  return 0.45;
}
function getMedicareRate(income: number): number {
  // Medicare levy 2% for most; reduced for low income
  if (income <= 24_276) return 0;
  if (income <= 30_345) return (income - 24_276) * 0.10 / income; // roughly phased
  return 0.02;
}
function getEffectiveTaxRate(income: number): number {
  return getMarginalRate(income) + getMedicareRate(income);
}

/* ─── P&I amortisation helper ─── */
function calcYearlyBalances(principal: number, annualRate: number, years: number, projectionYears: number) {
  const monthlyRate = annualRate / 12 / 100;
  const months = years * 12;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / months
      : principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  let balance = principal;
  const yearly: Array<{ year: number; balance: number; interestPaid: number; principalPaid: number }> = [];
  for (let y = 1; y <= projectionYears; y++) {
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;
    for (let m = 0; m < 12; m++) {
      if (balance <= 0) break;
      const interest = balance * monthlyRate;
      let principalPortion = monthlyPayment - interest;
      if (principalPortion > balance) principalPortion = balance;
      balance -= principalPortion;
      yearlyInterest += interest;
      yearlyPrincipal += principalPortion;
    }
    yearly.push({ year: y, balance: Math.max(0, balance), interestPaid: yearlyInterest, principalPaid: yearlyPrincipal });
  }
  return { monthlyPayment, yearly };
}

export function InvestmentCashflowCalculator() {
  useEffect(() => { trackCalculatorUse('Investment Cashflow'); }, []);
  const [inputs, setInputs] = useState({
    price: 900_000,
    depositPct: 20,
    rate: 6.49,
    term: 30,
    weeklyRent: 700,
    rentGrowth: 3,
    mgmtFee: 7.5,
    vacancy: 5,
    rates: 2000,
    insurance: 1500,
    maintenancePct: 1.0, // % of property value per year
    strata: 0,
    depreciation: 6000,
    income: 100_000,
    propertyGrowth: 4,
  });

  const update = (k: keyof typeof inputs, v: number) => setInputs((p) => ({ ...p, [k]: v }));

  const results = useMemo(() => {
    const loan = inputs.price * (1 - inputs.depositPct / 100);
    const deposit = inputs.price - loan;
    const { monthlyPayment, yearly: loanSchedule } = calcYearlyBalances(loan, inputs.rate, inputs.term, 30);
    const annualPAndI = monthlyPayment * 12;

    // ── Year 1 only (for waterfall & KPIs) ──
    const annualRent = inputs.weeklyRent * 52;
    const vacancyLoss = annualRent * (inputs.vacancy / 100);
    const effectiveRent = annualRent - vacancyLoss;
    const mgmtCost = effectiveRent * (inputs.mgmtFee / 100);
    const maintenanceCost = inputs.price * (inputs.maintenancePct / 100);
    const annualInterestY1 = loanSchedule[0]?.interestPaid ?? loan * (inputs.rate / 100);

    const operatingExpenses =
      inputs.rates +
      inputs.insurance +
      inputs.strata +
      maintenanceCost +
      mgmtCost +
      vacancyLoss;

    const totalExpenses = operatingExpenses + annualPAndI;
    const netCashflow = effectiveRent - totalExpenses;
    const weeklyCashflow = netCashflow / 52;

    const grossYield = (annualRent / inputs.price) * 100;
    const netYield = (netCashflow / inputs.price) * 100;

    // Tax
    const taxRate = getEffectiveTaxRate(inputs.income);
    const deductions =
      annualInterestY1 +
      inputs.rates +
      inputs.insurance +
      inputs.strata +
      maintenanceCost +
      mgmtCost +
      vacancyLoss +
      inputs.depreciation;
    const taxSaved = deductions * taxRate;
    const afterTaxCashflow = netCashflow + taxSaved;
    const afterTaxWeekly = afterTaxCashflow / 52;

    // ── 30-year projection ──
    const projection = [];
    let cumulativeCashflow = 0;
    let cumulativeTaxSaved = 0;
    let currentRent = inputs.weeklyRent;
    let currentValue = inputs.price;

    for (let y = 1; y <= 30; y++) {
      const yrRent = currentRent * 52;
      const yrVacancy = yrRent * (inputs.vacancy / 100);
      const yrEffectiveRent = yrRent - yrVacancy;
      const yrMgmt = yrEffectiveRent * (inputs.mgmtFee / 100);
      const yrMaintenance = currentValue * (inputs.maintenancePct / 100);
      const yrInterest = loanSchedule[y - 1]?.interestPaid ?? 0;
      const yrPandI = loanSchedule[y - 1] ? loanSchedule[y - 1].interestPaid + loanSchedule[y - 1].principalPaid : annualPAndI;

      const yrOpEx = inputs.rates + inputs.insurance + inputs.strata + yrMaintenance + yrMgmt + yrVacancy;
      const yrTotalEx = yrOpEx + yrPandI;
      const yrNet = yrEffectiveRent - yrTotalEx;

      const yrDeductions = yrInterest + inputs.rates + inputs.insurance + inputs.strata + yrMaintenance + yrMgmt + yrVacancy + inputs.depreciation;
      const yrTaxSaved = yrDeductions * taxRate;
      const yrAfterTax = yrNet + yrTaxSaved;

      cumulativeCashflow += yrAfterTax;
      cumulativeTaxSaved += yrTaxSaved;

      const loanBal = loanSchedule[y - 1]?.balance ?? 0;
      const equity = currentValue - loanBal;
      const totalReturn = equity + cumulativeCashflow;

      projection.push({
        year: y,
        propertyValue: Math.round(currentValue),
        loanBalance: Math.round(loanBal),
        equity: Math.round(equity),
        cumulativeCashflow: Math.round(cumulativeCashflow),
        totalReturn: Math.round(totalReturn),
        yearlyCashflow: Math.round(yrNet),
        yearlyAfterTax: Math.round(yrAfterTax),
        yrRent: Math.round(yrEffectiveRent),
        yrEx: Math.round(yrTotalEx),
      });

      currentRent *= 1 + inputs.rentGrowth / 100;
      currentValue *= 1 + inputs.propertyGrowth / 100;
    }

    const y30 = projection[29];

    return {
      loan: Math.round(loan),
      deposit: Math.round(deposit),
      monthlyPayment: Math.round(monthlyPayment),
      annualPAndI: Math.round(annualPAndI),
      annualRent: Math.round(annualRent),
      vacancyLoss: Math.round(vacancyLoss),
      effectiveRent: Math.round(effectiveRent),
      mgmtCost: Math.round(mgmtCost),
      maintenanceCost: Math.round(maintenanceCost),
      operatingExpenses: Math.round(operatingExpenses),
      totalExpenses: Math.round(totalExpenses),
      netCashflow: Math.round(netCashflow),
      weeklyCashflow: Math.round(weeklyCashflow),
      grossYield: Math.round(grossYield * 100) / 100,
      netYield: Math.round(netYield * 100) / 100,
      taxRate: Math.round(taxRate * 1000) / 1000,
      taxSaved: Math.round(taxSaved),
      afterTaxCashflow: Math.round(afterTaxCashflow),
      afterTaxWeekly: Math.round(afterTaxWeekly),
      annualInterestY1: Math.round(annualInterestY1),
      deductions: Math.round(deductions),
      projection,
      y30,
      loanSchedule,
    };
  }, [inputs]);

  const isPositive = results.netCashflow >= 0;
  const isPosAfterTax = results.afterTaxCashflow >= 0;

  // Waterfall data
  const waterfallData = [
    { name: 'Gross Rent', value: results.annualRent, fill: '#10b981' },
    { name: 'Vacancy', value: -results.vacancyLoss, fill: '#f59e0b' },
    { name: 'Mgmt', value: -results.mgmtCost, fill: '#ef4444' },
    { name: 'Rates', value: -inputs.rates, fill: '#ef4444' },
    { name: 'Insurance', value: -inputs.insurance, fill: '#ef4444' },
    { name: 'Strata', value: -inputs.strata, fill: '#ef4444' },
    { name: 'Maint.', value: -results.maintenanceCost, fill: '#ef4444' },
    { name: 'Mortgage', value: -results.annualPAndI, fill: '#dc2626' },
    { name: 'Net', value: results.netCashflow, fill: isPositive ? '#059669' : '#dc2626' },
  ];

  const gearingText = isPositive ? 'Positive gearing' : 'Negative gearing';
  const gearingSub = isPositive
    ? `Your rent covers ALL costs by $${Math.abs(results.netCashflow).toLocaleString()}/yr`
    : `Rent falls short by $${Math.abs(results.netCashflow).toLocaleString()}/yr — tax deductions help offset this`;

  return (
    <CalcLayout title="Investment Property Cashflow" subtitle="Rental income minus ALL costs → weekly net. Tax included. 30-year outlook.">
      {/* ── Gearing Banner ── */}
      <div className={`mb-6 rounded-xl border px-5 py-4 flex items-start gap-3 ${isPositive ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
        {isPositive ? <TrendingUp className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />}
        <div>
          <div className={`font-semibold text-sm ${isPositive ? 'text-emerald-800' : 'text-red-800'}`}>{gearingText}</div>
          <div className={`text-xs mt-0.5 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>{gearingSub}</div>
        </div>
      </div>

      <TwoColumnLayout
        leftTitle="Your Property"
        rightTitle="Year 1 Results"
        left={
          <div className="space-y-5">
            {/* Property & Finance */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Property & Finance</div>
              <SliderControl label="Property price" value={inputs.price} min={300_000} max={3_000_000} step={10_000} format={fmtDollar} onChange={(v) => update('price', v)} />
              <SliderControl label="Deposit %" value={inputs.depositPct} min={5} max={50} step={5} format={(v) => v + '%'} onChange={(v) => update('depositPct', v)} />
              <SliderControl label="Interest rate" value={inputs.rate} min={2} max={10} step={0.05} format={(v) => v.toFixed(2) + '%'} onChange={(v) => update('rate', v)} />
              <SliderControl label="Loan term" value={inputs.term} min={10} max={40} step={5} format={(v) => v + ' yr'} onChange={(v) => update('term', v)} />
            </div>

            {/* Rental Income */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Rental Income</div>
              <SliderControl label="Weekly rent" value={inputs.weeklyRent} min={300} max={2500} step={10} format={(v) => '$' + v} onChange={(v) => update('weeklyRent', v)} />
              <SliderControl label="Rent growth / yr" value={inputs.rentGrowth} min={0} max={8} step={0.5} format={(v) => v + '%'} onChange={(v) => update('rentGrowth', v)} />
            </div>

            {/* Annual Costs */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Annual Costs</div>
              <SliderControl label="Property management %" value={inputs.mgmtFee} min={0} max={15} step={0.5} format={(v) => v + '%'} onChange={(v) => update('mgmtFee', v)} />
              <SliderControl label="Vacancy rate" value={inputs.vacancy} min={0} max={20} step={0.5} format={(v) => v + '%'} onChange={(v) => update('vacancy', v)} />
              <SliderControl label="Council rates" value={inputs.rates} min={0} max={10_000} step={100} format={fmtDollar} onChange={(v) => update('rates', v)} />
              <SliderControl label="Insurance" value={inputs.insurance} min={0} max={5_000} step={100} format={fmtDollar} onChange={(v) => update('insurance', v)} />
              <SliderControl label="Maintenance % of value" value={inputs.maintenancePct} min={0} max={3} step={0.1} format={(v) => v.toFixed(1) + '%'} onChange={(v) => update('maintenancePct', v)} />
              <SliderControl label="Strata / body corp" value={inputs.strata} min={0} max={15_000} step={500} format={fmtDollar} onChange={(v) => update('strata', v)} />
              <SliderControl label="Depreciation (Div 40+43)" value={inputs.depreciation} min={0} max={25_000} step={500} format={fmtDollar} onChange={(v) => update('depreciation', v)} />
            </div>

            {/* Tax & Projections */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Tax & Projections</div>
              <SliderControl label="Your annual income" value={inputs.income} min={30_000} max={300_000} step={5_000} format={fmtDollar} onChange={(v) => update('income', v)} />
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-100 rounded-lg px-3 py-2">
                <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                Marginal tax rate estimated at {(results.taxRate * 100).toFixed(1)}% incl. Medicare
              </div>
              <SliderControl label="Property growth / yr" value={inputs.propertyGrowth} min={0} max={10} step={0.5} format={(v) => v + '%'} onChange={(v) => update('propertyGrowth', v)} />
            </div>
          </div>
        }
        right={
          <div className="space-y-4">
            {/* KPI Cards */}
            <KpiGrid>
              <KpiCard label="Gross Yield" value={results.grossYield.toFixed(2) + '%'} sub="Rent ÷ Price" variant="accent" />
              <KpiCard label="Net Yield" value={results.netYield.toFixed(2) + '%'} sub="After all costs" variant={isPositive ? 'success' : 'danger'} />
              <KpiCard label="Weekly Cashflow" value={(isPositive ? '+' : '') + '$' + Math.round(results.weeklyCashflow)} sub="Pre-tax" variant={isPositive ? 'success' : 'danger'} />
              <KpiCard label="After-Tax Weekly" value={(isPosAfterTax ? '+' : '') + '$' + Math.round(results.afterTaxWeekly)} sub="With tax deductions" variant={isPosAfterTax ? 'success' : 'danger'} />
            </KpiGrid>

            {/* Annual Summary */}
            <ChartPanel title="Annual Breakdown" subtitle="Year 1 cashflow waterfall">
              <div className="space-y-1">
                <InfoRow label="Gross annual rent" value={'$' + results.annualRent.toLocaleString()} />
                <InfoRow label="Vacancy loss" value={'-$' + Math.round(results.vacancyLoss).toLocaleString()} />
                <InfoRow label="Effective rent" value={'$' + Math.round(results.effectiveRent).toLocaleString()} bold />
                <div className="h-px bg-slate-200 my-2" />
                <InfoRow label="Property management" value={'-$' + Math.round(results.mgmtCost).toLocaleString()} />
                <InfoRow label="Council rates" value={'-$' + inputs.rates.toLocaleString()} />
                <InfoRow label="Insurance" value={'-$' + inputs.insurance.toLocaleString()} />
                <InfoRow label="Strata / body corp" value={'-$' + inputs.strata.toLocaleString()} />
                <InfoRow label="Maintenance" value={'-$' + Math.round(results.maintenanceCost).toLocaleString()} />
                <InfoRow label="Mortgage (P&I)" value={'-$' + Math.round(results.annualPAndI).toLocaleString()} />
                <div className="h-px bg-slate-200 my-2" />
                <InfoRow label="Net cashflow (pre-tax)" value={(isPositive ? '+$' : '-$') + Math.abs(Math.round(results.netCashflow)).toLocaleString()} bold />
                <InfoRow label="Tax saved (est.)" value={'+$' + Math.round(results.taxSaved).toLocaleString()} />
                <InfoRow label="After-tax cashflow" value={(isPosAfterTax ? '+$' : '-$') + Math.abs(Math.round(results.afterTaxCashflow)).toLocaleString()} bold />
              </div>
            </ChartPanel>

            {/* Waterfall Chart */}
            <ChartPanel
              title="Cashflow Waterfall"
              subtitle="Where every dollar of rent goes"
              legend={[
                { color: '#10b981', label: 'Income' },
                { color: '#ef4444', label: 'Expense' },
              ]}
            >
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v: number) => '$' + (Math.abs(v) >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value: number) => ['$' + Math.abs(value).toLocaleString(), value >= 0 ? 'Income' : 'Expense']}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 4, 4]} maxBarSize={48}>
                    {waterfallData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartPanel>
          </div>
        }
      />

      {/* ── 30-Year Projection ── */}
      <div className="mt-6">
        <ChartPanel
          title="30-Year Projection"
          subtitle="Equity, cumulative after-tax cashflow & total return"
          legend={[
            { color: '#0d9488', label: 'Equity' },
            { color: '#6366f1', label: 'Cumulative Cashflow' },
            { color: '#f59e0b', label: 'Total Return' },
          ]}
          footer={
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Assumes rent grows at {inputs.rentGrowth}%/yr and property at {inputs.propertyGrowth}%/yr</span>
              <span className="font-medium text-slate-700">Year 30 total return: {fmtDollar(results.y30?.totalReturn ?? 0)}</span>
            </div>
          }
        >
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={results.projection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} label={{ value: 'Year', position: 'insideBottom', offset: -2, style: { fontSize: 11, fill: '#94a3b8' } }} />
              <YAxis tickFormatter={(v: number) => '$' + (v >= 1_000_000 ? (v / 1_000_000).toFixed(1) + 'M' : (v / 1000).toFixed(0) + 'k')} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(value: number, name: string) => [fmtDollarFull(value), name]}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Area type="monotone" dataKey="equity" stroke="#0d9488" strokeWidth={2} fill="url(#colorEquity)" name="Equity" dot={false} />
              <Area type="monotone" dataKey="cumulativeCashflow" stroke="#6366f1" strokeWidth={2} fill="url(#colorCash)" name="Cumulative Cashflow" dot={false} />
              <Area type="monotone" dataKey="totalReturn" stroke="#f59e0b" strokeWidth={2} fill="url(#colorTotal)" name="Total Return" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      {/* ── Year 30 Highlight ── */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Year 30 Property Value" value={fmtDollar(results.y30?.propertyValue ?? 0)} sub={`Grew at ${inputs.propertyGrowth}%/yr`} variant="gold" />
        <KpiCard label="Year 30 Loan Balance" value={fmtDollar(results.y30?.loanBalance ?? 0)} sub="Remaining principal" variant="default" />
        <KpiCard label="Year 30 Equity" value={fmtDollar(results.y30?.equity ?? 0)} sub="Value minus loan" variant="accent" />
        <KpiCard label="Total Return" value={fmtDollar(results.y30?.totalReturn ?? 0)} sub="Equity + cashflow" variant="success" />
      </div>

      {/* ── Loan Schedule snippet ── */}
      <div className="mt-6">
        <ChartPanel title="Loan Amortisation" subtitle="Principal vs interest each year">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={results.loanSchedule.slice(0, inputs.term)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v: number) => '$' + (v / 1000).toFixed(0) + 'k'} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: number) => [fmtDollarFull(value), '']} contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
              <Bar dataKey="interestPaid" stackId="a" fill="#94a3b8" radius={[0, 0, 0, 0]} name="Interest" />
              <Bar dataKey="principalPaid" stackId="a" fill="#0d9488" radius={[4, 4, 0, 0]} name="Principal" />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <ShareResult
          title="Investment Property Cashflow Estimate"
          lines={[
            { label: 'Property price', value: fmtDollarFull(inputs.price) },
            { label: 'Deposit', value: `${inputs.depositPct}%` },
            { label: 'Weekly rent', value: `$${inputs.weeklyRent}` },
            { label: 'Gross yield', value: `${results.grossYield.toFixed(2)}%` },
            { label: 'Net cashflow', value: `${results.netCashflow >= 0 ? '+' : ''}$${Math.abs(results.netCashflow).toLocaleString()}/yr` },
            { label: 'After-tax cashflow', value: `${results.afterTaxCashflow >= 0 ? '+' : ''}$${Math.abs(results.afterTaxCashflow).toLocaleString()}/yr` },
          ]}
        />
      </div>
      <CalculatorDisclaimer />
      <CalculatorCta
        calculatorName="Investment Cashflow"
        headline="Need help finding cashflow-positive properties?"
        subline="A buyer's agent can identify suburbs and properties that match your investment criteria."
        ctaText="Talk to a buyer's agent"
        professionalType="buyer's agent"
      />
    </CalcLayout>
  );
}
