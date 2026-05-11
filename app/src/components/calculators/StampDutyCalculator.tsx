import { useState, useMemo, useEffect } from 'react';
import { Receipt, Home, HelpCircle, RotateCcw } from 'lucide-react';
import { trackCalculatorUse } from '@/lib/badges';
import { CalculatorCta } from './CalculatorCta';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';
import { ShareResult } from '@/components/ShareResult';
import { usePersistedState, resetCalcState } from '@/lib/calc-persistence';
import { useCalcUrlState } from '@/lib/calc-url-state';

type BuyerType = 'fhb-ppor' | 'fhb-investment' | 'investor' | 'foreign';

interface StampDutyInputs {
  propertyPrice: number;
  buyerType: BuyerType;
  isNewHome: boolean;
  isVacantLand: boolean;
}

export function StampDutyCalculator() {
  const [hasTracked, setHasTracked] = useState(false);
  useEffect(() => {
    if (!hasTracked) {
      trackCalculatorUse('Stamp Duty');
      setHasTracked(true);
    }
  }, [hasTracked]);
  const [inputs, setInputs] = usePersistedState<StampDutyInputs>('stamp_duty', 'inputs', {
    propertyPrice: 850000,
    buyerType: 'fhb-ppor',
    isNewHome: false,
    isVacantLand: false,
  });
  const [prefilledFromProfile, setPrefilledFromProfile] = useState(false);

  useCalcUrlState('stamp_duty', {
    propertyPrice: inputs.propertyPrice,
    buyerType: inputs.buyerType,
    isNewHome: inputs.isNewHome,
    isVacantLand: inputs.isVacantLand,
  }, {
    propertyPrice: (v) => setInputs((prev) => ({ ...prev, propertyPrice: Number(v) })),
    buyerType: (v) => setInputs((prev) => ({ ...prev, buyerType: v as BuyerType })),
    isNewHome: (v) => setInputs((prev) => ({ ...prev, isNewHome: v === 'true' })),
    isVacantLand: (v) => setInputs((prev) => ({ ...prev, isVacantLand: v === 'true' })),
  });

  const handleReset = () => {
    resetCalcState('stamp_duty');
    setInputs({
      propertyPrice: 850000,
      buyerType: 'fhb-ppor',
      isNewHome: false,
      isVacantLand: false,
    });
  };

  useEffect(() => {
    const raw = localStorage.getItem('pp_property_profile');
    if (!raw) return;
    try {
      const profile = JSON.parse(raw) as { budgetMax?: number; budgetMin?: number };
      const price = profile.budgetMax || profile.budgetMin;
      if (price && inputs.propertyPrice === 850000) {
        setInputs((prev) => ({ ...prev, propertyPrice: price }));
        setPrefilledFromProfile(true);
      }
    } catch {
      /* ignore invalid JSON */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = useMemo(() => {
    const price = inputs.propertyPrice;
    let duty = 0;
    let concession = 0;
    let fhbGrant = 0;
    let foreignSurcharge = 0;
    let notes: string[] = [];

    // Calculate standard duty
    if (price <= 17000) {
      duty = price * 0.0125;
    } else if (price <= 36000) {
      duty = 212.5 + (price - 17000) * 0.015;
    } else if (price <= 93000) {
      duty = 497.5 + (price - 36000) * 0.0175;
    } else if (price <= 351000) {
      duty = 1494.5 + (price - 93000) * 0.035;
    } else if (price <= 1168000) {
      duty = 10519.5 + (price - 351000) * 0.045;
    } else if (price <= 3505000) {
      duty = 56229.5 + (price - 1168000) * 0.055;
    } else {
      duty = price * 0.07;
    }

    // FHB concessions
    if (inputs.buyerType === 'fhb-ppor') {
      if (price <= 800000 && !inputs.isVacantLand) {
        // Full exemption for existing homes up to $800k
        concession = duty;
        notes.push('Full stamp duty exemption â€” First Home Buyer Assistance Scheme');
      } else if (price <= 1000000 && !inputs.isVacantLand) {
        // Concessional rate
        const standardDuty = duty;
        duty = standardDuty * ((1000000 - price) / 200000);
        concession = standardDuty - duty;
        notes.push('Partial stamp duty concession â€” First Home Buyer Assistance Scheme');
      }

      // First Home Owner Grant
      if (inputs.isNewHome && price <= 750000) {
        fhbGrant = 10000;
        notes.push('$10,000 First Home Owner Grant (New Homes)');
      }
    }

    // Foreign purchaser surcharge (9% from Jan 2025)
    if (inputs.buyerType === 'foreign') {
      foreignSurcharge = price * 0.09;
      notes.push('9% foreign purchaser surcharge applied');
    }

    const total = duty + foreignSurcharge;
    const effectiveTotal = total - fhbGrant;

    return {
      standardDuty: Math.round(duty),
      concession: Math.round(concession),
      fhbGrant,
      foreignSurcharge: Math.round(foreignSurcharge),
      total: Math.round(total),
      effectiveTotal: Math.round(effectiveTotal),
      notes,
    };
  }, [inputs]);

  return (
    <div className="pp-calc-card">
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center">
            <Receipt className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif">NSW Stamp Duty Calculator</h3>
            <p className="text-sm text-slate-500">Includes First Home Buyer concessions and foreign purchaser surcharge</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          aria-label="Reset calculator"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {prefilledFromProfile && (
        <div className="mt-2">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200">
            Pre-filled from your profile
          </span>
        </div>
      )}
      <div className="pp-calc-grid mt-6">
        <div className="pp-input-group">
          <label>Property price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input
              type="number"
              value={inputs.propertyPrice}
              onChange={(e) => setInputs({ ...inputs, propertyPrice: Number(e.target.value) })}
              className="pl-8"
            />
          </div>
        </div>
        <div className="pp-input-group">
          <label>Buyer type</label>
          <select
            value={inputs.buyerType}
            onChange={(e) => setInputs({ ...inputs, buyerType: e.target.value as BuyerType })}
          >
            <option value="fhb-ppor">First Home Buyer (owner-occupied)</option>
            <option value="investor">Investor / Upsizer</option>
            <option value="foreign">Foreign purchaser</option>
          </select>
        </div>
        <div className="pp-input-group">
          <label>Property type</label>
          <select
            value={inputs.isNewHome ? 'new' : inputs.isVacantLand ? 'land' : 'existing'}
            onChange={(e) => {
              const val = e.target.value;
              setInputs({
                ...inputs,
                isNewHome: val === 'new',
                isVacantLand: val === 'land',
              });
            }}
          >
            <option value="existing">Existing home</option>
            <option value="new">New home / off-the-plan</option>
            <option value="land">Vacant land</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-3">
        {result.concession > 0 && (
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Stamp duty concession</span>
            </div>
            <span className="text-xl font-bold text-green-700">-${result.concession.toLocaleString()}</span>
          </div>
        )}

        {result.fhbGrant > 0 && (
          <div className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border border-teal-200">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-teal-600" />
              <span className="font-medium text-teal-800">First Home Owner Grant</span>
            </div>
            <span className="text-xl font-bold text-teal-700">-${result.fhbGrant.toLocaleString()}</span>
          </div>
        )}

        {result.foreignSurcharge > 0 && (
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">Foreign purchaser surcharge (9%)</span>
            </div>
            <span className="text-xl font-bold text-red-700">+${result.foreignSurcharge.toLocaleString()}</span>
          </div>
        )}

        <div className="pp-result-box">
          <div className="flex items-center justify-between">
            <div>
              <div className="result-label">Total transfer duty payable</div>
              <div className="result-value">${result.effectiveTotal.toLocaleString()}</div>
            </div>
            <Receipt className="h-10 w-10 opacity-30" />
          </div>
        </div>
      </div>

      {result.notes.length > 0 && (
        <div className="mt-4 space-y-2">
          {result.notes.map((note, i) => (
            <div key={i} className="pp-callout pp-callout-teal">
              <span className="pp-callout-tag">Applied</span>
              <div>{note}</div>
            </div>
          ))}
        </div>
      )}

      <div className="pp-callout pp-callout-amber mt-4">
        <span className="pp-callout-tag">Eligibility check</span>
        <div>
          First Home Buyer Assistance requires: never owned property in Australia, 
          intend to occupy within 12 months, property value under $800k for full exemption 
          (or under $1M for partial concession). Verify current thresholds with 
          <a href="https://www.revenue.nsw.gov.au" target="_blank" rel="noopener noreferrer" className="underline"> Revenue NSW</a>.
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <ShareResult
          title="NSW Stamp Duty Estimate"
          lines={[
            { label: 'Property price', value: `$${inputs.propertyPrice.toLocaleString()}` },
            { label: 'Buyer type', value: inputs.buyerType === 'fhb-ppor' ? 'First Home Buyer' : inputs.buyerType === 'foreign' ? 'Foreign purchaser' : 'Investor' },
            { label: 'Total duty payable', value: `$${result.effectiveTotal.toLocaleString()}` },
          ]}
        />
      </div>
      <CalculatorDisclaimer />
      <CalculatorCta
        calculatorName="Stamp Duty"
        headline="Want to estimate your stamp duty?"
        subline="A conveyancer can explain eligibility for exemptions and concessions."
        ctaText="Connect with a conveyancer"
        professionalType="conveyancer"
        nextStageSlug="finance-prep"
        nextStageLabel="Finance Preparation"
      />
    </div>
  );
}







