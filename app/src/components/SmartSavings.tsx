import { useState } from 'react';
import { DollarSign, TrendingDown, Calculator, Receipt, Percent, PiggyBank, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SavingsLine {
  label: string;
  description: string;
  amount: number;
  checked: boolean;
  icon: React.ReactNode;
}

export function SmartSavings() {
  const [items, setItems] = useState<SavingsLine[]>([
    {
      label: 'Avoided Lenders Mortgage Insurance',
      description: 'Saved 20% deposit instead of paying LMI on a 10% deposit',
      amount: 15000,
      checked: true,
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      label: 'Found a lower interest rate',
      description: 'Used the borrowing power calculator to shop around — 0.4% lower rate',
      amount: 28000,
      checked: true,
      icon: <Percent className="h-4 w-4" />,
    },
    {
      label: 'Claimed First Home Buyer stamp duty exemption',
      description: 'Used our stamp duty calculator to claim the full concession',
      amount: 31155,
      checked: false,
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      label: 'Negotiated purchase price down',
      description: 'Used inspection report findings to negotiate $15K off the price',
      amount: 15000,
      checked: false,
      icon: <TrendingDown className="h-4 w-4" />,
    },
    {
      label: 'Avoided a property with hidden issues',
      description: 'Used our due diligence checklist to identify red flags before exchange',
      amount: 25000,
      checked: false,
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      label: 'Claimed depreciation tax deductions',
      description: 'Used our depreciation schedule tool for an investment property',
      amount: 8500,
      checked: false,
      icon: <Calculator className="h-4 w-4" />,
    },
    {
      label: 'Chose offset account over redraw',
      description: 'Used our comparison tool to pick the tax-efficient option',
      amount: 3200,
      checked: false,
      icon: <PiggyBank className="h-4 w-4" />,
    },
  ]);

  const toggle = (idx: number) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, checked: !item.checked } : item));
  };

  const totalSaved = items.filter(i => i.checked).reduce((s, i) => s + i.amount, 0);
  const totalPossible = items.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="pp-calc-card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center">
          <PiggyBank className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-serif">Smart Savings Tracker</h3>
          <p className="text-sm text-slate-500">Tick the items that apply to see how much PropertyPath could save you</p>
        </div>
      </div>

      {/* Total display */}
      <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 text-center">
        <p className="text-sm text-emerald-700 font-medium mb-1">Your potential savings</p>
        <div className="text-4xl font-bold font-serif text-emerald-800">
          ${totalSaved.toLocaleString()}
        </div>
        <p className="text-sm text-emerald-600 mt-1">
          of ${totalPossible.toLocaleString()} total possible savings
        </p>
        <div className="mt-3 h-3 bg-emerald-200 rounded-full overflow-hidden max-w-xs mx-auto">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${totalPossible > 0 ? (totalSaved / totalPossible) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Savings list */}
      <div className="mt-6 space-y-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => toggle(idx)}
            className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all ${
              item.checked
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-slate-50 border-slate-100 hover:border-slate-200'
            }`}
          >
            <div className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
              item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
            }`}>
              {item.checked && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-sm font-semibold ${item.checked ? 'text-emerald-800' : 'text-slate-700'}`}>
                  {item.label}
                </span>
                <span className={`text-sm font-bold font-serif flex-shrink-0 ${item.checked ? 'text-emerald-700' : 'text-slate-400'}`}>
                  ${item.amount.toLocaleString()}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${item.checked ? 'text-emerald-600' : 'text-slate-400'}`}>
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Reset */}
      <div className="flex gap-3 mt-6">
        <Button variant="outline" size="sm" onClick={() => setItems(prev => prev.map(i => ({ ...i, checked: false })))} className="gap-1">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={() => setItems(prev => prev.map(i => ({ ...i, checked: true })))} className="gap-1">
          Select all
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Call to action */}
      {totalSaved > 0 && (
        <div className="mt-6 pp-callout pp-callout-green">
          <span className="pp-callout-tag">Your Result</span>
          <p className="text-sm">
            Based on your selections, PropertyPath's tools and information could help you save{' '}
            <strong className="text-emerald-700">${totalSaved.toLocaleString()}</strong>{' '}
            on your property purchase. The more tools you use, the more you can save.
          </p>
        </div>
      )}
    </div>
  );
}
