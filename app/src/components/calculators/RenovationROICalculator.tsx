import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import {
  CalcLayout, TwoColumnLayout, SliderControl, KpiCard, KpiGrid,
  InfoRow, fmtDollarFull,
} from './CalculatorShell';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function RenovationROICalculator() {
  useEffect(() => { trackCalculatorUse('Renovation ROI'); }, []);
  const [currentValue, setCurrentValue] = useState(800000);
  const [renoCost, setRenoCost] = useState(50000);
  const [renoType, setRenoType] = useState<'kitchen' | 'bath' | 'ext' | 'full'>('kitchen');
  const [marketGrowth, setMarketGrowth] = useState(3.0);
  const [holdYears, setHoldYears] = useState(5);
  const [agentFee, setAgentFee] = useState(2.0);

  const results = useMemo(() => {
    // ROI data by renovation type (industry averages)
    const roiMultipliers: Record<string, number> = {
      kitchen: 1.15, // $1 return per $1.15 spent
      bath: 1.20,
      ext: 1.08,
      full: 1.25,
    };

    const valueAdded = renoCost * (roiMultipliers[renoType] || 1.0);
    const newValue = currentValue + valueAdded;
    const marketAppreciated = newValue * Math.pow(1 + marketGrowth / 100, holdYears);
    const saleCosts = marketAppreciated * (agentFee / 100);
    const netProceeds = marketAppreciated - saleCosts - renoCost;
    const noRenoProceeds = currentValue * Math.pow(1 + marketGrowth / 100, holdYears) * (1 - agentFee / 100);
    const advantage = netProceeds - noRenoProceeds;
    const roiPct = (advantage / renoCost) * 100;
    const breakEvenReno = renoCost / advantage > 0 ? holdYears / (advantage / renoCost) : Infinity;

    const renoLabels: Record<string, string> = {
      kitchen: 'Kitchen renovation',
      bath: 'Bathroom renovation',
      ext: 'External / landscaping',
      full: 'Full renovation',
    };

    return {
      valueAdded: Math.round(valueAdded),
      newValue: Math.round(newValue),
      marketAppreciated: Math.round(marketAppreciated),
      saleCosts: Math.round(saleCosts),
      netProceeds: Math.round(netProceeds),
      noRenoProceeds: Math.round(noRenoProceeds),
      advantage: Math.round(advantage),
      roiPct: Math.round(roiPct * 10) / 10,
      breakEvenReno: breakEvenReno < 50 ? Math.round(breakEvenReno * 10) / 10 : null,
      renoLabel: renoLabels[renoType],
    };
  }, [currentValue, renoCost, renoType, marketGrowth, holdYears, agentFee]);

  return (
    <CalcLayout title="Renovation ROI Calculator" subtitle="Will your renovation pay for itself when you sell?">
      <TwoColumnLayout
        leftTitle="Your renovation"
        left={
          <>
            <SliderControl label="Current property value" value={currentValue} min={300000} max={3000000} step={10000} format={(v) => '$' + v.toLocaleString()} onChange={setCurrentValue} />
            <SliderControl label="Renovation budget" value={renoCost} min={5000} max={300000} step={5000} format={(v) => '$' + v.toLocaleString()} onChange={setRenoCost} />
            <SliderControl label="Market growth / yr" value={marketGrowth} min={0} max={10} step={0.5} format={(v) => v.toFixed(1) + '%'} onChange={setMarketGrowth} />
            <SliderControl label="Years until sale" value={holdYears} min={1} max={20} step={1} format={(v) => v + ' yrs'} onChange={setHoldYears} />
            <SliderControl label="Agent fee on sale" value={agentFee} min={1} max={3.5} step={0.1} format={(v) => v.toFixed(1) + '%'} onChange={setAgentFee} />

            <div className="h-px bg-slate-200 my-4" />
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Renovation type</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'kitchen' as const, label: 'Kitchen', roi: '85-115% ROI' },
                { id: 'bath' as const, label: 'Bathroom', roi: '80-120% ROI' },
                { id: 'ext' as const, label: 'Exterior / Garden', roi: '60-108% ROI' },
                { id: 'full' as const, label: 'Full reno', roi: '100-125% ROI' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setRenoType(opt.id)}
                  className={`text-left p-3 rounded-xl border text-sm transition-all ${
                    renoType === opt.id
                      ? 'bg-teal-50 border-teal-300 text-teal-800'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-sm">{opt.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{opt.roi}</div>
                </button>
              ))}
            </div>
          </>
        }
        rightTitle="Results"
        right={
          <>
            <KpiGrid>
              <KpiCard label="Value added" value={fmtDollarFull(results.valueAdded)} sub={results.renoLabel} variant="accent" />
              <KpiCard label="New estimated value" value={fmtDollarFull(results.newValue)} sub="Post-renovation" variant="success" />
              <KpiCard label="Net advantage" value={results.advantage >= 0 ? '+' + fmtDollarFull(results.advantage) : fmtDollarFull(results.advantage)} sub="vs. not renovating" variant={results.advantage >= 0 ? 'success' : 'danger'} />
              <KpiCard label="ROI" value={results.roiPct + '%'} sub={`Over ${holdYears} years`} variant={results.roiPct >= 0 ? 'success' : 'danger'} />
            </KpiGrid>

            {/* Comparison */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Scenario comparison at Year {holdYears}</div>
              <InfoRow label="With renovation — sale price" value={fmtDollarFull(results.marketAppreciated)} />
              <InfoRow label="Agent fees & costs" value={fmtDollarFull(results.saleCosts)} />
              <InfoRow label="Less renovation cost" value={'−' + fmtDollarFull(renoCost)} />
              <InfoRow label="Net proceeds (with reno)" value={fmtDollarFull(results.netProceeds)} bold />
              <div className="h-px bg-slate-200 my-2" />
              <InfoRow label="Without renovation — sale price" value={fmtDollarFull(currentValue * Math.pow(1 + marketGrowth / 100, holdYears))} />
              <InfoRow label="Agent fees" value={fmtDollarFull(Math.round(currentValue * Math.pow(1 + marketGrowth / 100, holdYears) * agentFee / 100))} />
              <InfoRow label="Net proceeds (no reno)" value={fmtDollarFull(results.noRenoProceeds)} bold />
              <div className="h-px bg-slate-200 my-2" />
              <InfoRow label="Advantage of renovating" value={results.advantage >= 0 ? '+' + fmtDollarFull(results.advantage) : fmtDollarFull(results.advantage)} bold />
            </div>

            {/* Key insight */}
            <div className={`rounded-xl border p-4 ${results.advantage >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="text-sm font-semibold mb-1" style={{ color: results.advantage >= 0 ? '#166534' : '#991b1b' }}>
                {results.advantage >= 0 ? '✓ Renovation pays off' : '✗ Renovation loses money'}
              </div>
              <p className="text-sm" style={{ color: results.advantage >= 0 ? '#15803d' : '#b91c1c' }}>
                {results.advantage >= 0
                  ? `This ${results.renoLabel.toLowerCase()} returns $${(results.valueAdded / renoCost).toFixed(2)} per dollar spent. After ${holdYears} years of market growth, your net advantage is ${fmtDollarFull(results.advantage)}.`
                  : `This renovation costs more than it adds in value. Consider a smaller project or waiting for better market conditions.`}
              </p>
            </div>
          </>
        }
      />
      <CalculatorDisclaimer />
    </CalcLayout>
  );
}
