import { useState } from 'react';

interface LvrGaugeDiagramProps {
  propertyValue: number;
  loanAmount: number;
}

export function LvrGaugeDiagram({ propertyValue, loanAmount }: LvrGaugeDiagramProps) {
  const [inputValue, setInputValue] = useState(propertyValue);
  const [inputLoan, setInputLoan] = useState(loanAmount);

  const lvr = (inputLoan / inputValue) * 100;
  const equity = inputValue - inputLoan;

  // Gauge arc
  const cx = 350;
  const cy = 150;
  const r = 110;
  const startAngle = Math.PI * 0.75;
  const endAngle = Math.PI * 2.25;

  const lvrAngle = startAngle + (Math.min(lvr, 100) / 100) * (endAngle - startAngle);

  // Arc path helper
  function arcPath(start: number, end: number, radius: number) {
    const x1 = cx + radius * Math.cos(start);
    const y1 = cy + radius * Math.sin(start);
    const x2 = cx + radius * Math.cos(end);
    const y2 = cy + radius * Math.sin(end);
    const largeArc = end - start > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  }

  // Color based on LVR
  const lvrColor = lvr <= 60 ? '#22c55e' : lvr <= 80 ? '#3b82f6' : lvr <= 90 ? '#f59e0b' : '#ef4444';
  const lvrLabel = lvr <= 60 ? 'Low Risk' : lvr <= 80 ? 'Standard' : lvr <= 90 ? 'High — LMI Required' : 'Very High Risk';

  const needleX = cx + (r - 20) * Math.cos(lvrAngle);
  const needleY = cy + (r - 20) * Math.sin(lvrAngle);

  return (
    <div className="pp-diagram">
      <svg viewBox="0 0 700 280" className="w-full" style={{ maxHeight: 280 }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="80%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* Title */}
        <text x="350" y="24" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="700" fontFamily="Georgia, serif">
          Loan-to-Value Ratio (LVR)
        </text>

        {/* Background arc */}
        <path d={arcPath(startAngle, endAngle, r)} fill="none" stroke="#1e293b" strokeWidth="20" strokeLinecap="round" />

        {/* Colored arc up to current LVR */}
        <path d={arcPath(startAngle, lvrAngle, r)} fill="none" stroke="url(#gaugeGrad)" strokeWidth="20" strokeLinecap="round" />

        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={lvrColor} strokeWidth="3" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="8" fill={lvrColor} />

        {/* Labels */}
        <text x={cx + (r + 20) * Math.cos(startAngle)} y={cy + (r + 20) * Math.sin(startAngle) + 15} textAnchor="middle" fill="#94a3b8" fontSize="11">0%</text>
        <text x={cx} y={cy + r + 30} textAnchor="middle" fill="#94a3b8" fontSize="11">50%</text>
        <text x={cx + (r + 20) * Math.cos(endAngle)} y={cy + (r + 20) * Math.sin(endAngle) + 15} textAnchor="middle" fill="#94a3b8" fontSize="11">100%</text>

        {/* Center values */}
        <text x={cx} y={cy + 10} textAnchor="middle" fill="#f8fafc" fontSize="32" fontWeight="800">
          {Math.round(lvr * 10) / 10}%
        </text>
        <text x={cx} y={cy + 28} textAnchor="middle" fill={lvrColor} fontSize="12" fontWeight="600">
          {lvrLabel}
        </text>

        {/* Side info */}
        <g transform="translate(520, 80)">
          <rect x="0" y="0" width="150" height="70" rx="8" fill="#1e293b" stroke="#334155" />
          <text x="75" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">PROPERTY VALUE</text>
          <text x="75" y="45" textAnchor="middle" fill="#f8fafc" fontSize="18" fontWeight="700">${inputValue.toLocaleString()}</text>
        </g>

        <g transform="translate(520, 160)">
          <rect x="0" y="0" width="150" height="70" rx="8" fill="#1e293b" stroke="#334155" />
          <text x="75" y="22" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600">EQUITY</text>
          <text x="75" y="45" textAnchor="middle" fill="#22c55e" fontSize="18" fontWeight="700">${equity.toLocaleString()}</text>
        </g>
      </svg>

      {/* Controls below SVG */}
      <div className="flex gap-4 justify-center mt-2">
        <div className="pp-input-group !w-40">
          <label className="text-[11px] text-slate-400">Property value</label>
          <input
            type="number"
            className="!py-1 !text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
          />
        </div>
        <div className="pp-input-group !w-40">
          <label className="text-[11px] text-slate-400">Loan amount</label>
          <input
            type="number"
            className="!py-1 !text-sm"
            value={inputLoan}
            onChange={(e) => setInputLoan(Number(e.target.value))}
          />
        </div>
      </div>
      <p className="pp-diagram-caption">Interactive: adjust values to see LVR change</p>
    </div>
  );
}
