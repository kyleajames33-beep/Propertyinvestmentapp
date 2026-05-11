import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import {
  CalcLayout, TwoColumnLayout, SliderControl, KpiCard, KpiGrid,
  InfoRow, fmtDollarFull,
} from './CalculatorShell';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function StrataComparisonCalculator() {
  useEffect(() => { trackCalculatorUse('Strata Comparison'); }, []);
  const [housePrice, setHousePrice] = useState(950000);
  const [unitPrice, setUnitPrice] = useState(680000);
  const [houseLand, setHouseLand] = useState(450);
  const [unitStrata, setUnitStrata] = useState(3500);
  const [houseRates, setHouseRates] = useState(2200);
  const [houseMaint, setHouseMaint] = useState(3500);
  const [unitMaint, setUnitMaint] = useState(800);
  const [years, setYears] = useState(10);
  const [houseGrowth, setHouseGrowth] = useState(5.5);
  const [unitGrowth, setUnitGrowth] = useState(4.5);

  const results = useMemo(() => {
    // House costs
    const houseAnnual = houseRates + houseMaint + (houseLand > 0 ? 0 : 0); // land tax only if above threshold
    const houseTotalCosts = houseAnnual * years;
    const houseEndValue = housePrice * Math.pow(1 + houseGrowth / 100, years);
    const houseNet = houseEndValue - houseTotalCosts;

    // Unit costs
    const unitAnnual = unitStrata + unitMaint;
    const unitTotalCosts = unitAnnual * years;
    const unitEndValue = unitPrice * Math.pow(1 + unitGrowth / 100, years);
    const unitNet = unitEndValue - unitTotalCosts;

    // Deposit difference (assuming 20%)
    const houseDeposit = housePrice * 0.2;
    const unitDeposit = unitPrice * 0.2;
    const depositSaved = houseDeposit - unitDeposit;

    // If deposit saved was invested at 7%
    let investedValue = depositSaved;
    for (let i = 0; i < years * 12; i++) {
      investedValue *= (1 + 0.07 / 12);
    }

    const yearData = Array.from({ length: years + 1 }, (_, yr) => ({
      year: yr,
      houseValue: Math.round(housePrice * Math.pow(1 + houseGrowth / 100, yr)),
      unitValue: Math.round(unitPrice * Math.pow(1 + unitGrowth / 100, yr)),
      houseCumulativeCosts: Math.round(houseAnnual * yr),
      unitCumulativeCosts: Math.round(unitAnnual * yr),
    }));

    return {
      houseAnnual, houseTotalCosts, houseEndValue: Math.round(houseEndValue), houseNet: Math.round(houseNet),
      unitAnnual, unitTotalCosts, unitEndValue: Math.round(unitEndValue), unitNet: Math.round(unitNet),
      houseDeposit: Math.round(houseDeposit), unitDeposit: Math.round(unitDeposit), depositSaved: Math.round(depositSaved),
      investedValue: Math.round(investedValue),
      yearData,
      advantage: Math.round((unitNet + investedValue) - houseNet),
    };
  }, [housePrice, unitPrice, houseLand, unitStrata, houseRates, houseMaint, unitMaint, years, houseGrowth, unitGrowth]);

  return (
    <CalcLayout title="House vs Unit Comparison" subtitle="Strata fees vs. land rates and maintenance — which costs more over time?">
      <TwoColumnLayout
        leftTitle="The properties"
        left={
          <>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">House</div>
            <SliderControl label="House price" value={housePrice} min={300000} max={2000000} step={10000} format={(v) => '$' + v.toLocaleString()} onChange={setHousePrice} />
            <SliderControl label="Council rates / yr" value={houseRates} min={500} max={5000} step={100} format={(v) => '$' + v.toLocaleString()} onChange={setHouseRates} />
            <SliderControl label="Maintenance / yr" value={houseMaint} min={500} max={10000} step={250} format={(v) => '$' + v.toLocaleString()} onChange={setHouseMaint} />
            <SliderControl label="Land size (sqm)" value={houseLand} min={0} max={2000} step={50} format={(v) => v + ' m²'} onChange={setHouseLand} />
            <SliderControl label="Growth / yr" value={houseGrowth} min={0} max={12} step={0.5} format={(v) => v.toFixed(1) + '%'} onChange={setHouseGrowth} />

            <div className="h-px bg-slate-200 my-4" />
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Unit</div>
            <SliderControl label="Unit price" value={unitPrice} min={200000} max={1500000} step={10000} format={(v) => '$' + v.toLocaleString()} onChange={setUnitPrice} />
            <SliderControl label="Strata fees / quarter" value={unitStrata} min={500} max={8000} step={250} format={(v) => '$' + v.toLocaleString()} onChange={setUnitStrata} />
            <SliderControl label="Unit maintenance / yr" value={unitMaint} min={0} max={3000} step={100} format={(v) => '$' + v.toLocaleString()} onChange={setUnitMaint} />
            <SliderControl label="Growth / yr" value={unitGrowth} min={0} max={12} step={0.5} format={(v) => v.toFixed(1) + '%'} onChange={setUnitGrowth} />

            <div className="h-px bg-slate-200 my-4" />
            <SliderControl label="Comparison period" value={years} min={1} max={30} step={1} format={(v) => v + ' yrs'} onChange={setYears} />
          </>
        }
        rightTitle="10-year comparison"
        right={
          <>
            <KpiGrid>
              <KpiCard label="House end value" value={fmtDollarFull(results.houseEndValue)} sub={`After ${years} years`} variant="accent" />
              <KpiCard label="Unit end value" value={fmtDollarFull(results.unitEndValue)} sub={`After ${years} years`} variant="success" />
              <KpiCard label="House net (after costs)" value={fmtDollarFull(results.houseNet)} sub="Value − costs" variant="default" />
              <KpiCard label="Unit + invested deposit" value={fmtDollarFull(results.unitNet + results.investedValue)} sub="Saved deposit invested at 7%" variant="default" />
            </KpiGrid>

            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Annual ongoing costs</div>
              <InfoRow label="House — rates + maintenance" value={fmtDollarFull(results.houseAnnual)} />
              <InfoRow label="Unit — strata + maintenance" value={fmtDollarFull(results.unitAnnual)} />
              <InfoRow label="Difference / year" value={results.houseAnnual > results.unitAnnual ? 'House costs more' : 'Unit costs more'} bold />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Deposit comparison (20%)</div>
              <InfoRow label="House deposit needed" value={fmtDollarFull(results.houseDeposit)} />
              <InfoRow label="Unit deposit needed" value={fmtDollarFull(results.unitDeposit)} />
              <InfoRow label="Deposit saved buying unit" value={fmtDollarFull(results.depositSaved)} />
              <InfoRow label="If invested at 7% for ${years} yrs" value={fmtDollarFull(results.investedValue)} bold />
            </div>

            {/* Verdict */}
            <div className={`rounded-xl border p-4 ${results.advantage >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <p className={`text-sm font-medium ${results.advantage >= 0 ? 'text-emerald-800' : 'text-amber-800'}`}>
                {results.advantage >= 0
                  ? `The unit wins by ${fmtDollarFull(results.advantage)} over ${years} years when you factor in lower deposit, lower ongoing costs, and investing the difference.`
                  : `The house wins by ${fmtDollarFull(Math.abs(results.advantage))} over ${years} years due to stronger capital growth and land value appreciation.`}
              </p>
            </div>

            {/* Key insight */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs text-slate-500 leading-relaxed mt-4">
              <strong className="text-slate-700">The hidden cost of strata:</strong> Strata fees often increase 3–5% annually and special levies for building repairs are common in older blocks.
              Houses have higher maintenance but you control the timing and quality. Units may have better rental yield but lower capital growth.
            </div>
          </>
        }
      />
      <CalculatorDisclaimer />
    </CalcLayout>
  );
}
