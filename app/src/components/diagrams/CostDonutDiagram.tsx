import { useState } from 'react';

interface CostItem {
  label: string;
  amount: number;
  color: string;
}

interface CostDonutDiagramProps {
  title: string;
  items: CostItem[];
  centerLabel?: string;
  centerValue?: string;
}

export function CostDonutDiagram({ title, items, centerLabel, centerValue }: CostDonutDiagramProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = items.reduce((s, i) => s + i.amount, 0);

  // SVG donut math
  const cx = 200;
  const cy = 140;
  const radius = 100;
  const strokeWidth = 28;

  let cumulativePct = 0;
  const segments = items.map((item) => {
    const pct = item.amount / total;
    const startAngle = cumulativePct * Math.PI * 2 - Math.PI / 2;
    cumulativePct += pct;
    const endAngle = cumulativePct * Math.PI * 2 - Math.PI / 2;
    const largeArc = pct > 0.5 ? 1 : 0;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    return {
      ...item,
      pct: Math.round(pct * 1000) / 10,
      d: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
    };
  });

  return (
    <div className="pp-diagram">
      <svg viewBox="0 0 700 280" className="w-full" style={{ maxHeight: 280 }}>
        {/* Title */}
        <text x="350" y="24" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="700" fontFamily="Georgia, serif">
          {title}
        </text>

        {/* Donut */}
        <g>
          {segments.map((seg, i) => (
            <path
              key={i}
              d={seg.d}
              fill="none"
              stroke={seg.color}
              strokeWidth={hoveredIdx === i ? strokeWidth + 6 : strokeWidth}
              opacity={hoveredIdx !== null && hoveredIdx !== i ? 0.4 : 1}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              strokeLinecap="round"
            />
          ))}
          {/* Center hole (dark bg) */}
          <circle cx={cx} cy={cy} r={radius - strokeWidth / 2 - 2} fill="#0f172a" />
          {/* Center text */}
          <text x={cx} y={cy - 8} textAnchor="middle" fill="#f8fafc" fontSize="13" fontWeight="700">
            {centerValue || `$${total.toLocaleString()}`}
          </text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="#94a3b8" fontSize="10">
            {centerLabel || 'Total'}
          </text>
        </g>

        {/* Legend on right */}
        {segments.map((seg, i) => (
          <g
            key={`legend-${i}`}
            transform={`translate(420, ${55 + i * 36})`}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect x="0" y="-8" width="16" height="16" rx="4" fill={seg.color} opacity={hoveredIdx !== null && hoveredIdx !== i ? 0.4 : 1} />
            <text x="26" y="4" fill={hoveredIdx === i ? '#f8fafc' : '#cbd5e1'} fontSize="13" fontWeight={hoveredIdx === i ? '700' : '500'}>
              {seg.label}
            </text>
            <text x="26" y="18" fill="#94a3b8" fontSize="11">
              ${seg.amount.toLocaleString()} ({seg.pct}%)
            </text>
          </g>
        ))}

        {/* Hover tooltip */}
        {hoveredIdx !== null && (
          <g>
            <rect x="160" y="205" width="180" height="28" rx="6" fill="#1e293b" stroke={segments[hoveredIdx].color} strokeWidth="1" />
            <text x="250" y="224" textAnchor="middle" fill="#f8fafc" fontSize="12" fontWeight="600">
              {segments[hoveredIdx].label}: ${segments[hoveredIdx].amount.toLocaleString()}
            </text>
          </g>
        )}
      </svg>
      <p className="pp-diagram-caption">Interactive: hover segments to see amounts</p>
    </div>
  );
}
