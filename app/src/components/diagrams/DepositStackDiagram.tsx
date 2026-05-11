import { useState } from 'react';

interface DepositSource {
  label: string;
  amount: number;
  color: string;
  icon: string;
}

interface DepositStackDiagramProps {
  sources: DepositSource[];
  targetDeposit: number;
}

export function DepositStackDiagram({ sources, targetDeposit }: DepositStackDiagramProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = sources.reduce((s, src) => s + src.amount, 0);
  const pct = Math.min(100, Math.round((total / targetDeposit) * 100));

  const sorted = [...sources].sort((a, b) => b.amount - a.amount);
  let yOffset = 0;

  return (
    <div className="pp-diagram">
      <svg viewBox="0 0 700 280" className="w-full" style={{ maxHeight: 280 }}>
        {/* Title */}
        <text x="350" y="24" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="700" fontFamily="Georgia, serif">
          Building Your Deposit
        </text>

        {/* Bar container */}
        <rect x="80" y="50" width="400" height="200" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />

        {/* Target line */}
        <line x1="80" x2="480" y1="50" y2="50" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
        <text x="490" y="55" fill="#94a3b8" fontSize="10" fontWeight="600">TARGET</text>

        {/* Stacked segments */}
        {sorted.map((src, i) => {
          const h = Math.max(20, (src.amount / targetDeposit) * 200);
          const y = 250 - yOffset - h;
          yOffset += h;
          const isHovered = hoveredIdx === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x="85"
                y={y}
                width="390"
                height={h - 2}
                rx={4}
                fill={src.color}
                opacity={isHovered ? 1 : 0.85}
                stroke={isHovered ? '#fff' : 'none'}
                strokeWidth={isHovered ? 2 : 0}
              >
                <animate attributeName="opacity" from="0" to="0.85" dur="0.4s" fill="freeze" />
              </rect>
              {h > 30 && (
                <text x="280" y={y + h / 2 + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="700" opacity={isHovered ? 1 : 0.9}>
                  {src.label} — ${src.amount.toLocaleString()}
                </text>
              )}
            </g>
          );
        })}

        {/* Percentage labels */}
        <text x="350" y="160" textAnchor="middle" fill="#f8fafc" fontSize="36" fontWeight="800">
          {pct}%
        </text>
        <text x="350" y="182" textAnchor="middle" fill="#94a3b8" fontSize="11">
          ${total.toLocaleString()} of ${targetDeposit.toLocaleString()} target
        </text>

        {/* Legend on right */}
        {sorted.map((src, i) => (
          <g key={`legend-${i}`} transform={`translate(510, ${60 + i * 32})`}>
            <rect x="0" y="-8" width="16" height="16" rx="3" fill={src.color} />
            <text x="24" y="4" fill="#cbd5e1" fontSize="12" fontWeight="500">{src.label}</text>
            <text x="24" y="16" fill="#94a3b8" fontSize="10">${src.amount.toLocaleString()}</text>
          </g>
        ))}
      </svg>
      <p className="pp-diagram-caption">Interactive: hover segments to highlight each deposit source</p>
    </div>
  );
}
