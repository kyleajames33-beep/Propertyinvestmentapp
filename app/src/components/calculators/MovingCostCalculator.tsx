import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import {
  CalcLayout, TwoColumnLayout, SliderControl, KpiCard, KpiGrid,
  InfoRow, fmtDollarFull,
} from './CalculatorShell';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

export function MovingCostCalculator() {
  useEffect(() => { trackCalculatorUse('Moving Cost'); }, []);
  const [propertyValue, setPropertyValue] = useState(750000);
  const [distanceKm, setDistanceKm] = useState(25);
  const [hasFurniture, setHasFurniture] = useState(true);
  const [needsStorage, setNeedsStorage] = useState(false);
  const [needsCleaning, setNeedsCleaning] = useState(true);
  const [needsPets, setNeedsPets] = useState(false);
  const [needsConnection, setNeedsConnection] = useState(true);
  const [needsPacking, setNeedsPacking] = useState(false);
  const [isRegional, setIsRegional] = useState(false);
  const [hasStairs, setHasStairs] = useState(false);

  const results = useMemo(() => {
    const costs: Array<{ label: string; amount: number; optional: boolean }> = [];

    // 1. Stamp duty (already calculated by stamp duty calc, but rough estimate here)
    const stampDuty = propertyValue <= 800000 && propertyValue > 0 ? 0 : propertyValue * 0.046;
    costs.push({ label: 'Stamp duty (estimate)', amount: Math.round(stampDuty), optional: false });

    // 2. Conveyancing
    costs.push({ label: 'Conveyancer / solicitor', amount: 1800, optional: false });

    // 3. Building & pest inspection
    costs.push({ label: 'Building & pest inspection', amount: 650, optional: false });

    // 4. Mortgage fees
    costs.push({ label: 'Mortgage application & valuation', amount: 500, optional: false });

    // 5. Removalist
    let removalistBase = distanceKm <= 10 ? 800 : distanceKm <= 50 ? 1200 : 2000;
    if (hasFurniture) removalistBase *= 1.5;
    if (hasStairs) removalistBase += 300;
    if (needsPacking) removalistBase += 400;
    if (isRegional) removalistBase += 500;
    costs.push({ label: 'Removalist', amount: Math.round(removalistBase), optional: false });

    // 6. Storage
    if (needsStorage) {
      costs.push({ label: 'Storage (1 month)', amount: 250, optional: true });
    }

    // 7. Cleaning
    if (needsCleaning) {
      costs.push({ label: 'End-of-lease / bond clean', amount: 350, optional: true });
    }

    // 8. Pet transport
    if (needsPets) {
      costs.push({ label: 'Pet transport / boarding', amount: 200, optional: true });
    }

    // 9. Utility connections
    if (needsConnection) {
      costs.push({ label: 'Utility connection fees', amount: 150, optional: true });
    }

    // 10. New items (rough estimate)
    costs.push({ label: 'New locks, keys, small items', amount: 200, optional: false });

    const total = costs.reduce((s, c) => s + c.amount, 0);
    const essentialTotal = costs.filter(c => !c.optional).reduce((s, c) => s + c.amount, 0);
    const optionalTotal = costs.filter(c => c.optional).reduce((s, c) => s + c.amount, 0);

    return { costs, total, essentialTotal, optionalTotal };
  }, [propertyValue, distanceKm, hasFurniture, needsStorage, needsCleaning, needsPets, needsConnection, needsPacking, isRegional, hasStairs]);

  return (
    <CalcLayout title="Moving Cost Calculator" subtitle="All the hidden costs of buying and moving — don't get caught short">
      <TwoColumnLayout
        leftTitle="Your move"
        left={
          <>
            <SliderControl label="Property price" value={propertyValue} min={200000} max={2000000} step={25000} format={(v) => '$' + v.toLocaleString()} onChange={setPropertyValue} />
            <SliderControl label="Distance (km)" value={distanceKm} min={1} max={500} step={5} format={(v) => v + ' km'} onChange={setDistanceKm} />

            <div className="h-px bg-slate-200 my-4" />

            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Options</div>
            {[
              { label: 'Moving furniture (not just boxes)', value: hasFurniture, onChange: () => setHasFurniture(!hasFurniture) },
              { label: 'Needs temporary storage', value: needsStorage, onChange: () => setNeedsStorage(!needsStorage) },
              { label: 'Professional cleaning required', value: needsCleaning, onChange: () => setNeedsCleaning(!needsCleaning) },
              { label: 'Packing service needed', value: needsPacking, onChange: () => setNeedsPacking(!needsPacking) },
              { label: 'Pets to move', value: needsPets, onChange: () => setNeedsPets(!needsPets) },
              { label: 'New utility connections', value: needsConnection, onChange: () => setNeedsConnection(!needsConnection) },
              { label: 'Moving to/from regional area', value: isRegional, onChange: () => setIsRegional(!isRegional) },
              { label: 'Stairs at either property', value: hasStairs, onChange: () => setHasStairs(!hasStairs) },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.onChange}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-left text-sm transition-all mb-1.5 ${
                  item.value ? 'bg-teal-50 border-teal-200' : 'bg-white border-slate-200'
                }`}
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${item.value ? 'bg-teal-600 border-teal-600' : 'border-slate-300'}`}>
                  {item.value && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M5 13l4 4L19 7" /></svg>}
                </div>
                {item.label}
              </button>
            ))}
          </>
        }
        rightTitle="Cost breakdown"
        right={
          <>
            <KpiGrid>
              <KpiCard label="Total cost" value={fmtDollarFull(results.total)} sub="All fees included" variant="accent" />
              <KpiCard label="Essential" value={fmtDollarFull(results.essentialTotal)} sub="Cannot avoid" variant="default" />
              <KpiCard label="Optional" value={fmtDollarFull(results.optionalTotal)} sub="Based on your selections" variant="gold" />
              <KpiCard label="% of property price" value={(results.total / propertyValue * 100).toFixed(2) + '%'} sub="Upfront costs ratio" variant="default" />
            </KpiGrid>

            {/* Cost breakdown list */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Line items</div>
              <div className="space-y-1">
                {results.costs.map((c) => (
                  <InfoRow key={c.label} label={c.label + (c.optional ? ' (optional)' : '')} value={fmtDollarFull(c.amount)} />
                ))}
              </div>
              <div className="h-px bg-slate-200 my-3" />
              <InfoRow label="TOTAL" value={fmtDollarFull(results.total)} bold />
            </div>

            {/* Don't forget */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-amber-800 uppercase tracking-widest mb-2">Don't forget</div>
              <ul className="space-y-1.5 text-sm text-amber-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Change of address notifications (banks, ATO, Medicare, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Redirect mail with Australia Post (~$80–$200)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>Contents insurance starts on settlement day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500">•</span>
                  <span>New appliances, furniture, curtains, internet setup</span>
                </li>
              </ul>
            </div>
          </>
        }
      />
      <CalculatorDisclaimer />
    </CalcLayout>
  );
}
