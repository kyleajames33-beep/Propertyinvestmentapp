import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { Home, TrendingDown, Calendar, BarChart3, RotateCcw } from 'lucide-react';
import { CalculatorCta } from './CalculatorCta';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';
import { EmailMyResult } from '@/components/EmailMyResult';
import { ShareResult } from '@/components/ShareResult';
import { usePersistedState, resetCalcState } from '@/lib/calc-persistence';
import { useCalcUrlState } from '@/lib/calc-url-state';

interface MortgageInputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  repaymentFrequency: 'weekly' | 'fortnightly' | 'monthly';
}

export function MortgageRepaymentCalculator() {
  useEffect(() => { trackCalculatorUse('Mortgage Repayment'); }, []);
  const [inputs, setInputs] = usePersistedState<MortgageInputs>('mortgage_repayment', 'inputs', {
    loanAmount: 730000,
    interestRate: 6.24,
    loanTerm: 30,
    repaymentFrequency: 'monthly',
  });
  const [prefilledFromProfile, setPrefilledFromProfile] = useState(false);

  useCalcUrlState('mortgage_repayment', {
    loanAmount: inputs.loanAmount,
    interestRate: inputs.interestRate,
    loanTerm: inputs.loanTerm,
    repaymentFrequency: inputs.repaymentFrequency,
  }, {
    loanAmount: (v) => setInputs((prev) => ({ ...prev, loanAmount: Number(v) })),
    interestRate: (v) => setInputs((prev) => ({ ...prev, interestRate: Number(v) })),
    loanTerm: (v) => setInputs((prev) => ({ ...prev, loanTerm: Number(v) })),
    repaymentFrequency: (v) => setInputs((prev) => ({ ...prev, repaymentFrequency: v as MortgageInputs['repaymentFrequency'] })),
  });

  const handleReset = () => {
    resetCalcState('mortgage_repayment');
    setInputs({
      loanAmount: 730000,
      interestRate: 6.24,
      loanTerm: 30,
      repaymentFrequency: 'monthly',
    });
  };

  useEffect(() => {
    const raw = localStorage.getItem('pp_property_profile');
    if (!raw) return;
    try {
      const profile = JSON.parse(raw) as { budgetMax?: number; depositSaved?: number };
      if (profile.budgetMax && profile.depositSaved && inputs.loanAmount === 730000) {
        const loan = Math.max(0, profile.budgetMax - profile.depositSaved);
        setInputs((prev) => ({ ...prev, loanAmount: loan }));
        setPrefilledFromProfile(true);
      }
    } catch {
      /* ignore invalid JSON */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const results = useMemo(() => {
    const r = inputs.interestRate / 100;
    const n = inputs.loanTerm;
    const P = inputs.loanAmount;

    // Monthly calculation
    const monthlyRate = r / 12;
    const numPayments = n * 12;
    const monthlyRepayment =
      P * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalRepaid = monthlyRepayment * numPayments;
    const totalInterest = totalRepaid - P;

    // Convert to selected frequency
    let repayment: number;
    let frequencyLabel: string;
    let numRepayments: number;
    switch (inputs.repaymentFrequency) {
      case 'weekly':
        repayment = (monthlyRepayment * 12) / 52;
        frequencyLabel = 'weekly';
        numRepayments = n * 52;
        break;
      case 'fortnightly':
        repayment = (monthlyRepayment * 12) / 26;
        frequencyLabel = 'fortnightly';
        numRepayments = n * 26;
        break;
      default:
        repayment = monthlyRepayment;
        frequencyLabel = 'monthly';
        numRepayments = numPayments;
    }

    // Amortisation data (first 12 months for chart)
    const amortisation = [];
    let balance = P;
    for (let month = 1; month <= Math.min(360, numPayments); month++) {
      const interest = balance * monthlyRate;
      const principal = monthlyRepayment - interest;
      balance = Math.max(0, balance - principal);
      amortisation.push({
        month,
        balance: Math.round(balance),
        principal: Math.round(principal),
        interest: Math.round(interest),
      });
      if (balance <= 0) break;
    }

    return {
      repayment: Math.round(repayment),
      monthlyRepayment: Math.round(monthlyRepayment),
      totalRepaid: Math.round(totalRepaid),
      totalInterest: Math.round(totalInterest),
      frequencyLabel,
      numRepayments,
      amortisation,
    };
  }, [inputs]);

  return (
    <div className="pp-calc-card">
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif">Mortgage Repayment Calculator</h3>
            <p className="text-sm text-slate-500">See your repayments and how your loan balance decreases over time</p>
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
          <label>Loan amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input type="number" value={inputs.loanAmount} onChange={(e) => setInputs({...inputs, loanAmount: Number(e.target.value)})} className="pl-8" />
          </div>
        </div>
        <div className="pp-input-group">
          <label>Interest rate (%)</label>
          <input type="number" step="0.01" value={inputs.interestRate} onChange={(e) => setInputs({...inputs, interestRate: Number(e.target.value)})} />
        </div>
        <div className="pp-input-group">
          <label>Loan term</label>
          <select value={inputs.loanTerm} onChange={(e) => setInputs({...inputs, loanTerm: Number(e.target.value)})}>
            <option value={20}>20 years</option>
            <option value={25}>25 years</option>
            <option value={30}>30 years</option>
          </select>
        </div>
        <div className="pp-input-group">
          <label>Repayment frequency</label>
          <select value={inputs.repaymentFrequency} onChange={(e) => setInputs({...inputs, repaymentFrequency: e.target.value as any})}>
            <option value="monthly">Monthly</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="pp-result-box mt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <div className="result-label">{results.frequencyLabel} repayment</div>
            <div className="result-value">${results.repayment.toLocaleString()}</div>
          </div>
          <div>
            <div className="result-label">Total interest over term</div>
            <div className="result-value text-amber-300">${(results.totalInterest / 1000).toFixed(0)}k</div>
          </div>
          <div>
            <div className="result-label">Total repaid</div>
            <div className="result-value">${(results.totalRepaid / 1000).toFixed(0)}k</div>
          </div>
        </div>
      </div>

      {/* Amortisation visual */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-slate-400" />
          Loan balance over time
        </h4>
        <div className="pp-diagram">
          <svg viewBox="0 0 700 200" className="w-full" style={{ maxHeight: 200 }}>
            {/* Background grid */}
            {[0, 50, 100, 150].map(y => (
              <line key={y} x1="60" y1={y + 20} x2="680" y2={y + 20} stroke="#1e293b" strokeWidth="1" />
            ))}
            {/* Balance line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2.5"
              points={results.amortisation.filter((_, i) => i % 6 === 0).map(d => {
                const x = 60 + (d.month / results.amortisation.length) * 620;
                const y = 180 - (d.balance / inputs.loanAmount) * 160;
                return `${x},${y}`;
              }).join(' ')}
            />
            {/* Principal paid area */}
            <polygon
              fill="rgba(59,130,246,0.15)"
              stroke="none"
              points={`60,180 ${results.amortisation.filter((_, i) => i % 6 === 0).map(d => {
                const x = 60 + (d.month / results.amortisation.length) * 620;
                const y = 180 - (d.balance / inputs.loanAmount) * 160;
                return `${x},${y}`;
              }).join(' ')} ${680},180`}
            />
            {/* Labels */}
            <text x="30" y="25" textAnchor="middle" fontSize="10" fill="#64748b">${(inputs.loanAmount / 1000000).toFixed(1)}M</text>
            <text x="30" y="105" textAnchor="middle" fontSize="10" fill="#64748b">${(inputs.loanAmount / 2000000).toFixed(1)}M</text>
            <text x="40" y="185" textAnchor="middle" fontSize="10" fill="#64748b">$0</text>
            <text x="60" y="198" textAnchor="middle" fontSize="9" fill="#64748b">Year 0</text>
            <text x="370" y="198" textAnchor="middle" fontSize="9" fill="#64748b">Year {Math.round(inputs.loanTerm / 2)}</text>
            <text x="680" y="198" textAnchor="middle" fontSize="9" fill="#64748b">Year {inputs.loanTerm}</text>
          </svg>
        </div>
      </div>

      {/* Interest vs Principal breakdown */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Principal</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">${(inputs.loanAmount / 1000).toFixed(0)}k</div>
          <div className="text-xs text-blue-500 mt-1">{Math.round((inputs.loanAmount / results.totalRepaid) * 100)}% of total</div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-600 uppercase tracking-wide">Interest</span>
          </div>
          <div className="text-2xl font-bold text-amber-700">${(results.totalInterest / 1000).toFixed(0)}k</div>
          <div className="text-xs text-amber-500 mt-1">{Math.round((results.totalInterest / results.totalRepaid) * 100)}% of total</div>
        </div>
      </div>

      <div className="pp-callout pp-callout-blue mt-4">
        <span className="pp-callout-tag">Tip</span>
        <div>
          Switching from monthly to fortnightly repayments means you make 26 half-payments per year 
          (equivalent to 13 monthly payments), not 24. This small change can save you thousands in 
          interest and cut years off your loan term.
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <ShareResult
          title="Mortgage Repayment Estimate"
          lines={[
            { label: 'Loan amount', value: `$${inputs.loanAmount.toLocaleString()}` },
            { label: 'Interest rate', value: `${inputs.interestRate}%` },
            { label: 'Loan term', value: `${inputs.loanTerm} years` },
            { label: `${results.frequencyLabel} repayment`, value: `$${results.repayment.toLocaleString()}` },
            { label: 'Total interest', value: `$${(results.totalInterest / 1000).toFixed(0)}k` },
          ]}
        />
      </div>
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <EmailMyResult
          calculatorName="Mortgage Repayment Calculator"
          resultText={`${results.frequencyLabel} repayment: $${results.repayment.toLocaleString()}\nTotal interest: $${results.totalInterest.toLocaleString()}`}
        />
      </div>
      <CalculatorDisclaimer />
      <CalculatorCta
        calculatorName="Mortgage Repayment"
        headline="Want to pay off your loan faster?"
        subline="A mortgage broker can show you offset accounts, redraw facilities, and refinancing options."
        ctaText="Connect with a broker"
        professionalType="mortgage broker"
      />
    </div>
  );
}




