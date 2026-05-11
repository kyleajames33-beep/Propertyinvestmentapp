import { Info } from 'lucide-react';

export function CalculatorDisclaimer() {
  return (
    <div className="mt-6 p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-xs text-amber-800 leading-relaxed flex gap-2.5 items-start">
      <Info className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold">Estimate only — not financial advice.</span>{' '}
        This calculator provides mathematical estimates for educational purposes. 
        Results depend on your specific circumstances, lender criteria, and current market conditions. 
        Speak to a qualified mortgage broker, financial adviser, or accountant before making decisions.
      </div>
    </div>
  );
}
