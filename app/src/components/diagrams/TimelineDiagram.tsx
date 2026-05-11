import { useState } from 'react';

interface TimelineMilestone {
  week: number;
  label: string;
  description: string;
  color: string;
}

interface TimelineDiagramProps {
  title: string;
  milestones: TimelineMilestone[];
  totalWeeks: number;
}

export function TimelineDiagram({ title, milestones, totalWeeks }: TimelineDiagramProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const padding = 60;
  const barY = 120;
  const barWidth = 580;
  const barStart = padding;

  return (
    <div className="pp-diagram">
      <svg viewBox="0 0 700 260" className="w-full" style={{ maxHeight: 260 }}>
        {/* Title */}
        <text x="350" y="24" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="700" fontFamily="Georgia, serif">
          {title}
        </text>

        {/* Timeline bar */}
        <rect x={barStart} y={barY - 4} width={barWidth} height="8" rx="4" fill="#334155" />
        <rect x={barStart} y={barY - 4} width={barWidth} height="8" rx="4" fill="url(#barGrad)">
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </rect>

        {/* Week markers */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <g key={pct}>
            <line
              x1={barStart + barWidth * pct}
              x2={barStart + barWidth * pct}
              y1={barY - 12}
              y2={barY + 12}
              stroke="#475569"
              strokeWidth="1"
            />
            <text
              x={barStart + barWidth * pct}
              y={barY + 26}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
            >
              Week {Math.round(totalWeeks * pct)}
            </text>
          </g>
        ))}

        {/* Milestones */}
        {milestones.map((m, i) => {
          const x = barStart + (m.week / totalWeeks) * barWidth;
          const isTop = i % 2 === 0;
          const labelY = isTop ? barY - 40 : barY + 55;
          const lineEndY = isTop ? barY - 14 : barY + 14;
          const isActive = activeIdx === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Diamond marker */}
              <polygon
                points={`${x},${barY - 10} ${x + 10},${barY} ${x},${barY + 10} ${x - 10},${barY}`}
                fill={m.color}
                stroke={isActive ? '#fff' : 'none'}
                strokeWidth={isActive ? 2 : 0}
                opacity={isActive ? 1 : 0.9}
              />
              {/* Connector line */}
              <line x1={x} x2={x} y1={barY - 10} y2={lineEndY} stroke={m.color} strokeWidth="1.5" strokeDasharray={isTop ? '0' : '3,2'} />
              {/* Label */}
              <rect x={x - 70} y={labelY - 14} width="140" height="28" rx="6" fill={isActive ? '#1e293b' : '#0f172a'} stroke={isActive ? m.color : '#334155'} strokeWidth="1" />
              <text x={x} y={labelY + 4} textAnchor="middle" fill={isActive ? '#f8fafc' : '#cbd5e1'} fontSize="11" fontWeight={isActive ? '700' : '500'}>
                {m.label}
              </text>
            </g>
          );
        })}

        {/* Active description */}
        {activeIdx !== null && (
          <text x="350" y="235" textAnchor="middle" fill="#94a3b8" fontSize="12">
            {milestones[activeIdx].description}
          </text>
        )}
      </svg>
      <p className="pp-diagram-caption">Interactive: hover milestones for details</p>
    </div>
  );
}
