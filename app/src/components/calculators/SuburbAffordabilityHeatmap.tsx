import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import {
  CalcLayout, TwoColumnLayout, SliderControl, KpiCard, KpiGrid,
  fmtDollarFull,
} from './CalculatorShell';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function SuburbAffordabilityHeatmap() {
  useEffect(() => { trackCalculatorUse('Suburb Affordability Heatmap'); }, []);
  const [budget, setBudget] = useState(850000);
  const [deposit, setDeposit] = useState(150000);
  const [income, setIncome] = useState(90000);
  const [rate, setRate] = useState(6.24);
  const [lifestyle, setLifestyle] = useState<'family' | 'young' | 'retiree'>('family');

  const suburbs = useMemo(() => {
    const allSuburbs = [
      { name: 'Parramatta', median: 780000, type: 'unit', distance: 24, train: true, schools: 8, crime: 'low' },
      { name: 'Castle Hill', median: 1050000, type: 'house', distance: 32, train: true, schools: 12, crime: 'very low' },
      { name: 'Liverpool', median: 680000, type: 'house', distance: 32, train: true, schools: 6, crime: 'moderate' },
      { name: 'Penrith', median: 720000, type: 'house', distance: 52, train: true, schools: 7, crime: 'moderate' },
      { name: 'Hornsby', median: 980000, type: 'house', distance: 22, train: true, schools: 10, crime: 'very low' },
      { name: 'Blacktown', median: 750000, type: 'house', distance: 35, train: true, schools: 8, crime: 'low' },
      { name: 'Campbelltown', median: 650000, type: 'house', distance: 55, train: true, schools: 9, crime: 'moderate' },
      { name: 'Wollongong', median: 820000, type: 'house', distance: 85, train: true, schools: 11, crime: 'low' },
      { name: 'Newcastle', median: 780000, type: 'house', distance: 160, train: true, schools: 10, crime: 'low' },
      { name: 'Gosford', median: 620000, type: 'house', distance: 80, train: true, schools: 5, crime: 'low' },
      { name: 'Maitland', median: 580000, type: 'house', distance: 165, train: true, schools: 6, crime: 'low' },
      { name: 'Wagga Wagga', median: 480000, type: 'house', distance: 460, train: false, schools: 8, crime: 'very low' },
      { name: 'Albury', median: 520000, type: 'house', distance: 550, train: false, schools: 7, crime: 'very low' },
      { name: 'Dubbo', median: 420000, type: 'house', distance: 400, train: false, schools: 5, crime: 'low' },
      { name: 'Tamworth', median: 450000, type: 'house', distance: 420, train: false, schools: 6, crime: 'low' },
    ];

    return allSuburbs.map(s => {
      const affordable = s.median <= budget;
      const gap = s.median - budget;
      const gapPct = (gap / budget) * 100;
      const lvr = ((s.median - deposit) / s.median) * 100;
      const monthlyRepayment = lvr > 0
        ? (s.median - deposit) * ((rate/100/12 * Math.pow(1+rate/100/12, 30*12)) / (Math.pow(1+rate/100/12, 30*12)-1))
        : 0;

      // Lifestyle score 0-100
      let lifestyleScore = 50;
      if (lifestyle === 'family') {
        lifestyleScore = (s.schools * 5) + (s.crime === 'very low' ? 30 : s.crime === 'low' ? 20 : 10) + (s.train ? 15 : 0) - (s.distance > 50 ? 20 : 0);
      } else if (lifestyle === 'young') {
        lifestyleScore = (s.train ? 30 : 0) + (s.distance < 30 ? 25 : s.distance < 50 ? 15 : 5) + (s.type === 'unit' ? 20 : 10) + 20;
      } else {
        lifestyleScore = (s.crime === 'very low' ? 35 : s.crime === 'low' ? 25 : 10) + (s.distance > 50 ? 20 : 5) + (s.median < 600000 ? 25 : 10);
      }
      lifestyleScore = Math.min(100, Math.max(0, lifestyleScore));

      return {
        ...s,
        affordable,
        gap,
        gapPct: Math.round(gapPct * 10) / 10,
        lvr: Math.round(lvr * 10) / 10,
        monthlyRepayment: Math.round(monthlyRepayment),
        lifestyleScore: Math.round(lifestyleScore),
      };
    }).sort((a, b) => {
      if (a.affordable && !b.affordable) return -1;
      if (!a.affordable && b.affordable) return 1;
      return b.lifestyleScore - a.lifestyleScore;
    });
  }, [budget, deposit, income, rate, lifestyle]);

  const affordableCount = suburbs.filter(s => s.affordable).length;

  return (
    <CalcLayout title="Suburb Affordability Heatmap" subtitle="Where can you afford to buy? Filter by budget and lifestyle priorities">
      <TwoColumnLayout
        leftTitle="Your budget"
        left={
          <>
            <SliderControl label="Total budget (deposit + loan)" value={budget} min={300000} max={2000000} step={10000} format={(v) => '$' + v.toLocaleString()} onChange={setBudget} />
            <SliderControl label="Deposit available" value={deposit} min={20000} max={500000} step={5000} format={(v) => '$' + v.toLocaleString()} onChange={setDeposit} />
            <SliderControl label="Annual income" value={income} min={40000} max={300000} step={5000} format={(v) => '$' + v.toLocaleString()} onChange={setIncome} />
            <SliderControl label="Interest rate" value={rate} min={2} max={12} step={0.25} format={(v) => v.toFixed(2) + '%'} onChange={setRate} />

            <div className="h-px bg-slate-200 my-4" />
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Lifestyle priority</div>
            <div className="flex gap-2">
              {[
                { id: 'family' as const, label: 'Family', icon: '👨‍👩‍👧‍👦' },
                { id: 'young' as const, label: 'Young Professional', icon: '💼' },
                { id: 'retiree' as const, label: 'Downsizer / Retiree', icon: '🌿' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setLifestyle(opt.id)}
                  className={`flex-1 text-center p-3 rounded-xl border text-sm transition-all ${
                    lifestyle === opt.id
                      ? 'bg-teal-50 border-teal-300 text-teal-800'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <div className="text-xl mb-1">{opt.icon}</div>
                  <div className="text-xs font-medium">{opt.label}</div>
                </button>
              ))}
            </div>
          </>
        }
        rightTitle="Suburb results"
        right={
          <>
            <KpiGrid>
              <KpiCard label="Affordable suburbs" value={`${affordableCount}`} sub={`of ${suburbs.length} suburbs`} variant="accent" />
              <KpiCard label="Max LVR" value={`${Math.round((budget - deposit) / budget * 100)}%`} sub="Based on your deposit" variant={deposit / budget < 0.2 ? 'warning' : 'success'} />
            </KpiGrid>

            <div className="space-y-2">
              {suburbs.map((s) => (
                <div
                  key={s.name}
                  className={`rounded-xl border p-4 transition-all ${
                    s.affordable ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          s.affordable ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {s.affordable ? '✓ Affordable' : '× Over budget'}
                        </span>
                        <span className="font-semibold text-slate-800">{s.name}</span>
                        <span className="text-xs text-slate-400">{s.distance}km from CBD</span>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>Median: {fmtDollarFull(s.median)}</span>
                        <span>Type: {s.type}</span>
                        <span>Train: {s.train ? '✓' : '✗'}</span>
                        <span>Schools: {s.schools}</span>
                        <span>Crime: {s.crime}</span>
                      </div>
                      {s.affordable && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                            Monthly: {fmtDollarFull(s.monthlyRepayment)}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Lifestyle score: {s.lifestyleScore}/100
                          </span>
                        </div>
                      )}
                      {!s.affordable && (
                        <div className="text-xs text-red-500 mt-1">
                          {s.gapPct > 0 ? `${s.gapPct}% over budget` : `${Math.abs(s.gapPct)}% under budget`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        }
      />
      <CalculatorDisclaimer />
    </CalcLayout>
  );
}
