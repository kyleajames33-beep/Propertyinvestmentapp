import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import {
  CalcLayout, TwoColumnLayout, SliderControl, KpiCard, KpiGrid,
  InfoRow, fmtDollarFull,
} from './CalculatorShell';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function PropertyTimeMachine() {
  useEffect(() => { trackCalculatorUse('Property Time Machine'); }, []);
  const [priceThen, setPriceThen] = useState(450000);
  const [yearThen, setYearThen] = useState(2015);
  const [depositThen, setDepositThen] = useState(90000);
  const [rateThen, setRateThen] = useState(4.5);
  const [yearsHeld, setYearsHeld] = useState(9);
  const [growthRate, setGrowthRate] = useState(6.0);
  const [rentSaved, setRentSaved] = useState(2200);

  const results = useMemo(() => {
    const currentYear = yearThen + yearsHeld;
    const currentPrice = priceThen * Math.pow(1 + growthRate / 100, yearsHeld);
    const equity = currentPrice - (priceThen - depositThen); // simplistic: assume paid off some
    const totalRentSaved = rentSaved * 12 * yearsHeld;
    const totalGain = currentPrice - priceThen;
    const roi = (totalGain / depositThen) * 100;
    const annualizedRoi = (Math.pow(currentPrice / priceThen, 1 / yearsHeld) - 1) * 100;

    // What if you rented instead?
    const investDeposit = depositThen;
    const monthlyInvest = rentSaved;
    const investReturn = 7.0;
    let renterWealth = investDeposit;
    for (let i = 0; i < yearsHeld * 12; i++) {
      renterWealth *= (1 + investReturn / 100 / 12);
      renterWealth += monthlyInvest;
    }

    return {
      currentPrice: Math.round(currentPrice),
      equity: Math.round(equity),
      totalRentSaved: Math.round(totalRentSaved),
      totalGain: Math.round(totalGain),
      roi: Math.round(roi * 10) / 10,
      annualizedRoi: Math.round(annualizedRoi * 10) / 10,
      renterWealth: Math.round(renterWealth),
      advantage: Math.round(currentPrice - priceThen + totalRentSaved - renterWealth),
      currentYear,
    };
  }, [priceThen, yearThen, depositThen, rateThen, yearsHeld, growthRate, rentSaved]);

  return (
    <CalcLayout title="Property Time Machine" subtitle="What if you bought back then? Compare buying vs. renting + investing">
      <TwoColumnLayout
        leftTitle="The past"
        left={
          <>
            <SliderControl label="Property price back then" value={priceThen} min={100000} max={2000000} step={10000} format={(v) => '$' + v.toLocaleString()} onChange={setPriceThen} />
            <SliderControl label="Year bought" value={yearThen} min={1990} max={2024} step={1} format={(v) => String(v)} onChange={setYearThen} />
            <SliderControl label="Deposit you had" value={depositThen} min={10000} max={500000} step={5000} format={(v) => '$' + v.toLocaleString()} onChange={setDepositThen} />
            <SliderControl label="Interest rate then" value={rateThen} min={2} max={15} step={0.25} format={(v) => v.toFixed(2) + '%'} onChange={setRateThen} />

            <div className="h-px bg-slate-200 my-4" />
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">What happened</div>
            <SliderControl label="Years held" value={yearsHeld} min={1} max={35} step={1} format={(v) => v + ' yrs'} onChange={setYearsHeld} />
            <SliderControl label="Annual property growth" value={growthRate} min={0} max={15} step={0.5} format={(v) => v.toFixed(1) + '%'} onChange={setGrowthRate} />
            <SliderControl label="Monthly rent you would have paid" value={rentSaved} min={500} max={5000} step={100} format={(v) => '$' + v.toLocaleString()} onChange={setRentSaved} />
          </>
        }
        rightTitle="Today"
        right={
          <>
            <KpiGrid>
              <KpiCard label="Property value now" value={fmtDollarFull(results.currentPrice)} sub={`Year ${results.currentYear}`} variant="accent" />
              <KpiCard label="Total capital gain" value={fmtDollarFull(results.totalGain)} sub={`${results.annualizedRoi}% annualized`} variant="success" />
              <KpiCard label="Rent you saved" value={fmtDollarFull(results.totalRentSaved)} sub={`Over ${yearsHeld} years`} variant="gold" />
              <KpiCard label="Your ROI" value={results.roi + '%'} sub="On your deposit" variant="success" />
            </KpiGrid>

            {/* Comparison */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">What actually happened vs. alternatives</div>
              <InfoRow label="If you bought" value={fmtDollarFull(results.currentPrice)} bold />
              <InfoRow label="If you rented + invested" value={fmtDollarFull(results.renterWealth)} />
              <InfoRow label="Buying advantage" value={results.advantage >= 0 ? '+' + fmtDollarFull(results.advantage) : fmtDollarFull(results.advantage)} bold />
            </div>

            {/* Insight */}
            <div className={`rounded-xl border p-4 ${results.advantage >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <p className={`text-sm font-medium ${results.advantage >= 0 ? 'text-emerald-800' : 'text-amber-800'}`}>
                {results.advantage >= 0
                  ? `Buying this property in ${yearThen} would have made you ${fmtDollarFull(results.advantage)} better off today than renting and investing in shares.`
                  : `In this scenario, renting and investing actually beat buying by ${fmtDollarFull(Math.abs(results.advantage))}. High property growth is needed for buying to win.`}
              </p>
            </div>

            {/* NSW median context */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-700">NSW context:</strong> Sydney median house price grew ~7.2% annually from 2015–2024.
              If you bought a $450K property in 2015 with 6% growth, it would be worth ~${fmtDollarFull(Math.round(450000 * Math.pow(1.06, 9)))} today.
              Actual outcomes depend heavily on suburb selection.
            </div>
          </>
        }
      />
      <CalculatorDisclaimer />
    </CalcLayout>
  );
}
