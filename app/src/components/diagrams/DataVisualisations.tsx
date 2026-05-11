import { useState } from 'react';
import { Receipt, Percent } from 'lucide-react';

const stampDutyBrackets = [
  { price: 400000, duty: 13444, label: '$400k' },
  { price: 600000, duty: 22107, label: '$600k' },
  { price: 800000, duty: 30769, label: '$800k' },
  { price: 850000, duty: 33044, label: '$850k' },
  { price: 900000, duty: 35319, label: '$900k' },
  { price: 1000000, duty: 39869, label: '$1M' },
  { price: 1200000, duty: 50869, label: '$1.2M' },
  { price: 1500000, duty: 67369, label: '$1.5M' },
  { price: 2000000, duty: 94869, label: '$2M' },
];

const lmiData = [
  { lvr: '85%', lmi: 1.2, label: '85% LVR' },
  { lvr: '90%', lmi: 2.1, label: '90% LVR' },
  { lvr: '95%', lmi: 3.5, label: '95% LVR' },
];

function StampDutyChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxDuty = Math.max(...stampDutyBrackets.map(d => d.duty));

  return (
    <div className="pp-card">
      <div className="pp-card-header">
        <div className="pp-card-num"><Receipt className="h-4 w-4 text-white" /></div>
        <div><h3 className="pp-card-title">Stamp duty at different price points</h3><p className="text-xs text-slate-500">Standard rates for NSW (non-first-home buyer)</p></div>
      </div>
      <div className="pp-diagram" style={{ padding: '20px' }}>
        <svg viewBox="0 0 700 240" className="w-full" style={{ maxHeight: 240 }}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => {
            const y = 220 - (i * 50);
            return <g key={i}><line x1="60" y1={y} x2="680" y2={y} stroke="#1e293b" strokeWidth="0.5" /><text x="55" y={y + 4} textAnchor="end" fontSize="10" fill="#64748b">${(i * 25)}k</text></g>;
          })}
          {/* Bars */}
          {stampDutyBrackets.map((d, i) => {
            const x = 70 + i * 68;
            const barHeight = (d.duty / maxDuty) * 200;
            const isHovered = hovered === i;
            return (
              <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
                <rect x={x} y={220 - barHeight} width={50} height={barHeight} rx={4}
                  fill={isHovered ? '#fbbf24' : '#3b82f6'} opacity={isHovered ? 1 : 0.8} />
                {isHovered && (
                  <g><rect x={x - 10} y={220 - barHeight - 35} width={70} height={28} rx={6} fill="#0f172a" />
                    <text x={x + 25} y={220 - barHeight - 16} textAnchor="middle" fontSize="11" fill="white" fontWeight="600">${(d.duty / 1000).toFixed(0)}k</text>
                  </g>
                )}
                <text x={x + 25} y={235} textAnchor="middle" fontSize="9" fill="#94a3b8">{d.label}</text>
              </g>
            );
          })}
        </svg>
        <p className="pp-diagram-caption">Hover over bars to see exact duty amounts. First home buyers may pay $0 up to $800k.</p>
      </div>
    </div>
  );
}

function LVRChart() {
  const [propertyPrice, setPropertyPrice] = useState(850000);
  return (
    <div className="pp-card">
      <div className="pp-card-header">
        <div className="pp-card-num red">%</div>
        <div><h3 className="pp-card-title">LVR vs LMI cost</h3><p className="text-xs text-slate-500">See how deposit size affects Lenders Mortgage Insurance</p></div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-slate-700">Property price: ${propertyPrice.toLocaleString()}</label>
        <input type="range" min="500000" max="2000000" step="50000" value={propertyPrice}
          onChange={(e) => setPropertyPrice(Number(e.target.value))}
          className="w-full mt-2 accent-primary" />
        <div className="flex justify-between text-xs text-slate-400 mt-1"><span>$500k</span><span>$2M</span></div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {lmiData.map((lmi) => {
          const depositPct = 100 - parseInt(lmi.lvr);
          const deposit = Math.round(propertyPrice * (depositPct / 100));
          const lmiCost = Math.round(propertyPrice * (parseInt(lmi.lvr) / 100) * (lmi.lmi / 100));
          const isGood = depositPct >= 20;
          return (
            <div key={lmi.lvr} className={`rounded-xl p-4 border ${isGood ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="text-lg font-bold font-serif">{lmi.lvr}</div>
              <div className="text-xs text-slate-500 mb-2">Deposit: ${(deposit / 1000).toFixed(0)}k ({depositPct}%)</div>
              {isGood ? (
                <div className="text-sm font-medium text-green-700">No LMI!</div>
              ) : (
                <div>
                  <div className="text-sm text-amber-800">LMI: ~${(lmiCost / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-amber-600">({lmi.lmi}% of loan)</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RateImpactChart() {
  const [loanAmount, setLoanAmount] = useState(730000);
  const [term, setTerm] = useState(30);

  const rates = [4.5, 5.0, 5.5, 6.0, 6.24, 6.5, 7.0, 7.5];

  const calculateRepayment = (rate: number) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    return loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  };

  const maxRepayment = Math.max(...rates.map(calculateRepayment));

  return (
    <div className="pp-card">
      <div className="pp-card-header">
        <div className="pp-card-num"><Percent className="h-4 w-4 text-white" /></div>
        <div><h3 className="pp-card-title">Interest rate impact on repayments</h3><p className="text-xs text-slate-500">How rate changes affect your monthly repayment</p></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium">Loan amount: ${(loanAmount / 1000).toFixed(0)}k</label>
          <input type="range" min="200000" max="2000000" step="50000" value={loanAmount}
            onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full accent-primary" />
        </div>
        <div>
          <label className="text-sm font-medium">Term: {term} years</label>
          <input type="range" min="15" max="30" step="5" value={term}
            onChange={(e) => setTerm(Number(e.target.value))} className="w-full accent-primary" />
        </div>
      </div>

      <div className="pp-diagram" style={{ padding: '16px' }}>
        <svg viewBox="0 0 700 200" className="w-full" style={{ maxHeight: 200 }}>
          {rates.map((rate, i) => {
            const repayment = calculateRepayment(rate);
            const barHeight = (repayment / maxRepayment) * 160;
            const x = 50 + i * 80;
            const isCurrent = rate === 6.24;
            return (
              <g key={rate}>
                <rect x={x} y={180 - barHeight} width={60} height={barHeight} rx={4}
                  fill={isCurrent ? '#fbbf24' : '#3b82f6'} opacity={isCurrent ? 1 : 0.7} />
                <text x={x + 30} y={175 - barHeight} textAnchor="middle" fontSize="10" fill="white" fontWeight="600">${Math.round(repayment / 1000)}k</text>
                <text x={x + 30} y={195} textAnchor="middle" fontSize="10" fill={isCurrent ? '#fbbf24' : '#94a3b8'} fontWeight={isCurrent ? '700' : '400'}>{rate}%</text>
              </g>
            );
          })}
        </svg>
        <p className="pp-diagram-caption">Yellow = current average rate (6.24%). Monthly repayments at different interest rates.</p>
      </div>
    </div>
  );
}

export function DataVisualisations() {
  return (
    <div className="space-y-6">
      <StampDutyChart />
      <LVRChart />
      <RateImpactChart />
    </div>
  );
}
