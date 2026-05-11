import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { Scale, Bed, Bath, Car, Star } from 'lucide-react';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';
import { ShareResult } from '@/components/ShareResult';

interface Property {
  name: string;
  price: number;
  landValue: number;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  suburb: string;
  weeklyRent: number;
  councilRates: number;
  strataFees: number;
  maintenance: number;
}

export function PropertyComparisonCalculator() {
  useEffect(() => { trackCalculatorUse('Property Comparison'); }, []);
  const [props, setProps] = useState<Property[]>([
    {
      name: 'Property A',
      price: 750000,
      landValue: 400000,
      bedrooms: 3,
      bathrooms: 2,
      garages: 1,
      suburb: 'Parramatta',
      weeklyRent: 620,
      councilRates: 1800,
      strataFees: 0,
      maintenance: 2500,
    },
    {
      name: 'Property B',
      price: 680000,
      landValue: 250000,
      bedrooms: 2,
      bathrooms: 2,
      garages: 1,
      suburb: 'Liverpool',
      weeklyRent: 550,
      councilRates: 1500,
      strataFees: 3200,
      maintenance: 1500,
    },
  ]);

  const [interestRate, setInterestRate] = useState(6.24);
  const [depositPercent, setDepositPercent] = useState(20);

  const results = useMemo(() => {
    return props.map((p) => {
      const deposit = p.price * (depositPercent / 100);
      const loan = p.price - deposit;
      const monthlyRate = interestRate / 100 / 12;
      const n = 30 * 12;
      const monthlyRepayment =
        loan * ((monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1));
      const annualRepayment = monthlyRepayment * 12;
      const annualRent = p.weeklyRent * 52;
      const annualCosts = annualRepayment + p.councilRates + p.strataFees + p.maintenance;
      const cashflow = annualRent - annualCosts;
      const grossYield = (annualRent / p.price) * 100;

      return {
        ...p,
        deposit: Math.round(deposit),
        loan: Math.round(loan),
        monthlyRepayment: Math.round(monthlyRepayment),
        annualRent: Math.round(annualRent),
        annualCosts: Math.round(annualCosts),
        cashflow: Math.round(cashflow),
        grossYield: Math.round(grossYield * 10) / 10,
      };
    });
  }, [props, interestRate, depositPercent]);

  const updateProperty = (idx: number, field: keyof Property, value: string | number) => {
    const next = [...props];
    next[idx] = { ...next[idx], [field]: value };
    setProps(next);
  };

  const bestCashflow = results.length > 1 ? Math.max(...results.map((r) => r.cashflow)) : 0;


  return (
    <div className="pp-calc-card">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center">
          <Scale className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-serif">Property Comparison</h3>
          <p className="text-sm text-slate-500">Compare up to 3 properties side by side</p>
        </div>
      </div>

      {/* Global inputs */}
      <div className="pp-calc-grid mt-6">
        <div className="pp-input-group">
          <label>Interest rate</label>
          <div className="relative">
            <input type="number" step="0.01" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
          </div>
        </div>
        <div className="pp-input-group">
          <label>Deposit</label>
          <div className="relative">
            <input type="number" value={depositPercent} onChange={(e) => setDepositPercent(Number(e.target.value))} />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
          </div>
        </div>
      </div>

      {/* Property cards */}
      <div className={`grid gap-4 mt-6 ${results.length === 2 ? 'grid-cols-1 md:grid-cols-2' : results.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
        {results.map((r, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="pp-input-group">
              <label>Property name</label>
              <input value={r.name} onChange={(e) => updateProperty(idx, 'name', e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="pp-input-group">
                <label>Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" className="pl-8" value={r.price} onChange={(e) => updateProperty(idx, 'price', Number(e.target.value))} />
                </div>
              </div>
              <div className="pp-input-group">
                <label>Weekly rent</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input type="number" className="pl-8" value={r.weeklyRent} onChange={(e) => updateProperty(idx, 'weeklyRent', Number(e.target.value))} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="pp-input-group">
                <label className="flex items-center gap-1"><Bed className="h-3 w-3" /> Beds</label>
                <input type="number" value={r.bedrooms} onChange={(e) => updateProperty(idx, 'bedrooms', Number(e.target.value))} />
              </div>
              <div className="pp-input-group">
                <label className="flex items-center gap-1"><Bath className="h-3 w-3" /> Baths</label>
                <input type="number" value={r.bathrooms} onChange={(e) => updateProperty(idx, 'bathrooms', Number(e.target.value))} />
              </div>
              <div className="pp-input-group">
                <label className="flex items-center gap-1"><Car className="h-3 w-3" /> Cars</label>
                <input type="number" value={r.garages} onChange={(e) => updateProperty(idx, 'garages', Number(e.target.value))} />
              </div>
            </div>

            {/* Results for this property */}
            <div className="bg-slate-50 rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly repayment</span>
                <span className="font-semibold">${r.monthlyRepayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Annual rent</span>
                <span className="font-semibold">${r.annualRent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gross yield</span>
                <span className={`font-semibold ${r.grossYield >= 5 ? 'text-emerald-600' : 'text-amber-600'}`}>{r.grossYield}%</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                <span className="text-slate-600 font-medium">Cashflow</span>
                <span className={`font-bold ${r.cashflow >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {r.cashflow >= 0 ? '+' : ''}${r.cashflow.toLocaleString()}/yr
                  {results.length > 1 && r.cashflow === bestCashflow && <Star className="h-3 w-3 inline ml-1 text-amber-500" />}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / remove */}
      <div className="flex gap-2 mt-4">
        {props.length < 3 && (
          <button
            onClick={() =>
              setProps([
                ...props,
                { name: `Property ${String.fromCharCode(67 + props.length)}`, price: 700000, landValue: 300000, bedrooms: 3, bathrooms: 2, garages: 1, suburb: '', weeklyRent: 600, councilRates: 1600, strataFees: 0, maintenance: 2000 },
              ])
            }
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            + Add property
          </button>
        )}
        {props.length > 2 && (
          <button onClick={() => setProps(props.slice(0, -1))} className="text-sm text-red-500 hover:text-red-600 font-medium">
            - Remove last
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 mt-4">
        <ShareResult
          title="Property Comparison Estimate"
          lines={[
            { label: 'Interest rate', value: `${interestRate}%` },
            { label: 'Deposit', value: `${depositPercent}%` },
            ...results.flatMap((r) => [
              { label: `${r.name} — Price`, value: `$${r.price.toLocaleString()}` },
              { label: `${r.name} — Gross yield`, value: `${r.grossYield}%` },
              { label: `${r.name} — Cashflow`, value: `${r.cashflow >= 0 ? '+' : ''}$${r.cashflow.toLocaleString()}/yr` },
            ]),
          ]}
        />
      </div>
      <CalculatorDisclaimer />
    </div>
  );
}
