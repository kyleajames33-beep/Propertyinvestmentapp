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
import { CalculatorCta } from './CalculatorCta';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';
import { ShareResult } from '@/components/ShareResult';

export function RentVsBuyCalculator() {
  useEffect(() => { trackCalculatorUse('Rent vs Buy'); }, []);
  const [price, setPrice] = useState(900000);
  const [depositPct, setDepositPct] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(6.0);
  const [rent, setRent] = useState(2800);
  const [rentGrowth, setRentGrowth] = useState(3.0);
  const [propGrowth, setPropGrowth] = useState(5.0);
  const [investReturn, setInvestReturn] = useState(7.0);
  const [ownCosts, setOwnCosts] = useState(1.5);

  const results = useMemo(() => {
    const deposit = price * depositPct / 100;
    const loan = price - deposit;
    const stampDuty = price <= 1000000 ? (price <= 300000 ? 8990 + (price - 300000) * 0.045 : 40490 + (price - 1000000) * 0.055) : 150490 + (price - 3000000) * 0.07;
    const lvr = loan / price;
    const lmi = lvr > 0.80 ? loan * (lvr <= 0.85 ? 0.008 : lvr <= 0.90 ? 0.016 : 0.032) : 0;
    const totalUpfront = deposit + stampDuty + lmi;

    const monthlyRate = mortgageRate / 100 / 12;
    const termMonths = 30 * 12;
    const monthlyMortgage = loan * ((monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1));
    const monthlyOwnership = price * ownCosts / 100 / 12;
    const buyerMonthly = monthlyMortgage + monthlyOwnership;

    const YEARS = 30;
    const buyerWealth: number[] = [];
    const renterWealth: number[] = [];
    const labels: number[] = [];
    const snapData: Record<number, { buyerEq: number; renterW: number; propVal: number; mortgagePaid: number; rentPaid: number; mortgageBalance: number }> = {};

    let propVal = price;
    let mortgageBalance = loan;
    let renterW = deposit;
    let currentRent = rent;
    let totalMortgagePaid = stampDuty + lmi;
    let totalRentPaid = 0;

    for (let yr = 0; yr <= YEARS; yr++) {
      const buyerEq = propVal - mortgageBalance - stampDuty - lmi;
      labels.push(yr);
      buyerWealth.push(buyerEq);
      renterWealth.push(renterW);

      snapData[yr] = {
        buyerEq, renterW, propVal,
        mortgagePaid: totalMortgagePaid,
        rentPaid: totalRentPaid,
        mortgageBalance,
      };

      if (yr < YEARS) {
        for (let m = 0; m < 12; m++) {
          propVal *= (1 + propGrowth / 100 / 12);
          if (mortgageBalance > 0) {
            const interest = mortgageBalance * (mortgageRate / 100 / 12);
            const principal = Math.min(monthlyMortgage - interest, mortgageBalance);
            mortgageBalance = Math.max(0, mortgageBalance - principal);
            totalMortgagePaid += monthlyMortgage;
          }
          renterW *= (1 + investReturn / 100 / 12);
          const diff = buyerMonthly - currentRent;
          renterW += diff;
          if (renterW < 0) renterW = 0;
          totalRentPaid += currentRent;
        }
        currentRent *= (1 + rentGrowth / 100);
      }
    }

    // Break-even
    let breakEvenYear: number | null = null;
    for (let i = 1; i <= YEARS; i++) {
      if (buyerWealth[i] >= renterWealth[i] && buyerWealth[i - 1] < renterWealth[i - 1]) {
        breakEvenYear = i;
        break;
      }
    }
    if (!breakEvenYear && buyerWealth[YEARS] > renterWealth[YEARS]) breakEvenYear = 0; // buyer ahead from start
    if (!breakEvenYear && buyerWealth[YEARS] <= renterWealth[YEARS]) breakEvenYear = -1; // renter always ahead

    return {
      labels, buyerWealth, renterWealth, breakEvenYear,
      deposit, loan, stampDuty, lmi, totalUpfront,
      monthlyMortgage, monthlyOwnership, buyerMonthly,
      snapData,
    };
  }, [price, depositPct, mortgageRate, rent, rentGrowth, propGrowth, investReturn, ownCosts]);

  const [selectedYear, setSelectedYear] = useState(10);
  const snap = results.snapData[Math.min(selectedYear, 30)];

  const verdict = results.breakEvenYear === null || results.breakEvenYear === -1
    ? { icon: 'ðŸ“ˆ', color: 'rent', title: 'Renting + investing wins over 30 years', text: 'With high investment returns or slow property growth, renting and investing beats buying.' }
    : results.breakEvenYear === 0
    ? { icon: 'ðŸ ', color: 'buy', title: 'Buying wins â€” ahead from the start', text: 'Property growth and equity building outpace renter investment returns immediately.' }
    : { icon: 'ðŸ ', color: 'buy', title: `Buying wins at Year ${results.breakEvenYear}`, text: 'After the break-even point, buying builds significantly more wealth than renting + investing.' };

  const diff = results.buyerMonthly - rent;
  const chartData = results.labels.map((yr, i) => ({
    year: yr,
    buyer: Math.round(results.buyerWealth[i]),
    renter: Math.round(results.renterWealth[i]),
  }));

  return (
    <CalcLayout title="Rent vs Buy Break-Even" subtitle="Compare your net wealth position over time â€” buying equity vs. investing your deposit & monthly savings">
      {/* Verdict Banner */}
      <div className={`rounded-xl p-4 mb-6 border flex items-start gap-3 ${
        verdict.color === 'buy' ? 'bg-teal-50 border-teal-200' : 'bg-amber-50 border-amber-200'
      }`}>
        <span className="text-2xl">{verdict.icon}</span>
        <div>
          <div className="font-semibold text-sm text-slate-800">{verdict.title}</div>
          <div className="text-xs text-slate-500 mt-0.5">{verdict.text}</div>
        </div>
      </div>

      <TwoColumnLayout
        leftTitle="Parameters"
        left={
          <>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Property</div>
            <SliderControl label="Property price" value={price} min={300000} max={2000000} step={10000} format={(v) => '$' + v.toLocaleString()} onChange={setPrice} />
            <SliderControl label="Deposit" value={depositPct} min={5} max={40} step={1} format={(v) => v + '%'} onChange={setDepositPct} />
            <SliderControl label="Mortgage rate" value={mortgageRate} min={2} max={12} step={0.25} format={(v) => v.toFixed(2) + '%'} onChange={setMortgageRate} />

            <div className="h-px bg-slate-200 my-4" />
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Renting</div>
            <SliderControl label="Monthly rent" value={rent} min={500} max={6000} step={50} format={(v) => '$' + v.toLocaleString()} onChange={setRent} />
            <SliderControl label="Annual rent growth" value={rentGrowth} min={0} max={8} step={0.5} format={(v) => v.toFixed(1) + '%'} onChange={setRentGrowth} />

            <div className="h-px bg-slate-200 my-4" />
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Growth & Returns</div>
            <SliderControl label="Property growth / yr" value={propGrowth} min={0} max={12} step={0.5} format={(v) => v.toFixed(1) + '%'} onChange={setPropGrowth} />
            <SliderControl label="Investment return / yr" value={investReturn} min={0} max={14} step={0.5} format={(v) => v.toFixed(1) + '%'} onChange={setInvestReturn} />
            <SliderControl label="Annual ownership costs" value={ownCosts} min={0.5} max={3} step={0.1} format={(v) => v.toFixed(1) + '%'} onChange={setOwnCosts} />

            {/* Upfront costs panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 mt-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Upfront Costs (NSW est.)</div>
              <InfoRow label="Loan amount" value={fmtDollarFull(results.loan)} />
              <InfoRow label="Deposit" value={fmtDollarFull(results.deposit)} />
              <InfoRow label="Stamp duty" value={fmtDollarFull(results.stampDuty)} />
              <InfoRow label="LMI (if >80% LVR)" value={results.lmi > 0 ? fmtDollarFull(results.lmi) : '$0'} />
              <InfoRow label="Total upfront" value={fmtDollarFull(results.totalUpfront)} bold />
            </div>
          </>
        }
        rightTitle="Results"
        right={
          <>
            {/* Chart */}
            <ChartPanel
              title="Net Wealth: Buyer vs Renter"
              subtitle="Property equity vs. invested deposit + monthly savings difference"
              legend={[{ color: '#0891b2', label: 'Buyer (equity)' }, { color: '#d19900', label: 'Renter (invested)' }]}
              footer={
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    Hover chart for exact values Â· Drag sliders to update
                  </span>
                  {results.breakEvenYear !== null && results.breakEvenYear > 0 && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">
                      âš¡ Break-even: Year {results.breakEvenYear}
                    </span>
                  )}
                </div>
              }
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="buyerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0891b2" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#0891b2" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="renterGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d19900" stopOpacity={0.12} />
                      <stop offset="100%" stopColor="#d19900" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => v % 5 === 0 ? `Yr ${v}` : ''} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'ui-monospace' }} tickFormatter={(v) => fmtDollar(v)} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                    formatter={(value: number, name: string) => [fmtDollarFull(value), name]}
                    labelFormatter={(label: number) => `Year ${label}`}
                  />
                  <Area type="monotone" dataKey="buyer" name="Buyer equity" stroke="#0891b2" strokeWidth={2.5} fill="url(#buyerGrad)" />
                  <Area type="monotone" dataKey="renter" name="Renter wealth" stroke="#d19900" strokeWidth={2.5} fill="url(#renterGrad)" />
                  {results.breakEvenYear && results.breakEvenYear > 0 && (
                    <ReferenceLine x={results.breakEvenYear} stroke="#0891b2" strokeDasharray="5 4" strokeWidth={1.5} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </ChartPanel>

            {/* Snapshot */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mt-4">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <div className="text-base font-semibold text-slate-800">Position Snapshot</div>
                  <div className="text-xs text-slate-500">Compare net wealth at specific milestone years</div>
                </div>
                <div className="flex gap-1 bg-slate-100 rounded-full p-1">
                  {[10, 20, 30].map((yr) => (
                    <button
                      key={yr}
                      onClick={() => setSelectedYear(yr)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                        selectedYear === yr
                          ? 'bg-teal-700 text-white'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Yr {yr}
                    </button>
                  ))}
                </div>
              </div>

              <KpiGrid>
                <KpiCard label="ðŸ  Buyer equity" value={fmtDollarFull(snap.buyerEq)} sub={`Prop. value: ${fmtDollar(snap.propVal)}`} variant="accent" />
                <KpiCard label="ðŸ“ˆ Renter wealth" value={fmtDollarFull(snap.renterW)} sub={snap.renterW > snap.buyerEq ? 'ðŸ“ˆ Renter ahead' : 'ðŸ  Buyer ahead'} variant="gold" />
                <KpiCard label="ðŸ  Mortgage paid" value={fmtDollarFull(snap.mortgagePaid)} sub={`Remaining: ${fmtDollar(snap.mortgageBalance)}`} variant="warning" />
                <KpiCard label="ðŸ˜ï¸ Rent paid" value={fmtDollarFull(snap.rentPaid)} sub="Cumulative" variant="default" />
              </KpiGrid>

              {/* Monthly comparison bars */}
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 mt-4">Monthly Cost Comparison</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-teal-700 w-14">Buyer</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-600 rounded-full" style={{ width: `${(results.buyerMonthly / Math.max(results.buyerMonthly, rent) * 100)}%` }} />
                  </div>
                  <span className="text-xs font-mono text-slate-700 w-16 text-right">{fmtDollarFull(results.buyerMonthly)}/mo</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-amber-600 w-14">Renter</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(rent / Math.max(results.buyerMonthly, rent) * 100)}%` }} />
                  </div>
                  <span className="text-xs font-mono text-slate-700 w-16 text-right">{fmtDollarFull(rent)}/mo</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {diff > 0
                  ? `Buyer pays ${fmtDollarFull(diff)}/mo more Â· Renter invests this difference`
                  : diff < 0
                  ? `Buyer pays ${fmtDollarFull(Math.abs(diff))}/mo less Â· Renter pays more in rent`
                  : 'Monthly costs are equal'}
              </p>
            </div>

            {/* Assumptions */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 leading-relaxed mt-4">
              <strong className="text-slate-700">Assumptions:</strong> Buyer's net wealth = property value âˆ’ remaining mortgage âˆ’ stamp duty âˆ’ LMI (sunk costs).
              Renter's net wealth = deposit invested at the set return rate + monthly savings difference invested.
              Ownership costs cover council rates, maintenance, insurance. Stamp duty is NSW estimated.
              This model does not include negative gearing tax offsets, agent fees on sale, or emotional value of ownership.
            </div>
          </>
        }
      />
      <div className="flex items-center gap-2 mt-4">
        <ShareResult
          title="Rent vs Buy Break-Even Estimate"
          lines={[
            { label: 'Property price', value: `$${price.toLocaleString()}` },
            { label: 'Deposit', value: `${depositPct}%` },
            { label: 'Monthly rent', value: `$${rent.toLocaleString()}` },
            { label: 'Break-even', value: results.breakEvenYear !== null && results.breakEvenYear > 0 ? `Year ${results.breakEvenYear}` : results.breakEvenYear === 0 ? 'Buyer ahead from start' : 'Renter always ahead' },
            { label: `Buyer equity (Yr ${selectedYear})`, value: fmtDollarFull(snap.buyerEq) },
            { label: `Renter wealth (Yr ${selectedYear})`, value: fmtDollarFull(snap.renterW) },
          ]}
        />
      </div>
      <CalculatorDisclaimer />
      <CalculatorCta
        calculatorName="Rent vs Buy"
        headline="Not sure whether to buy or keep renting?"
        subline="A property strategist can run personalised scenarios based on your life goals and financial situation."
        ctaText="Talk to a strategist"
        professionalType="property strategist"
      />
    </CalcLayout>
  );
}

