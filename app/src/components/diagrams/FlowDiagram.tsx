import { useState } from 'react';

interface FlowStep {
  label: string;
  description: string;
  color: string;
  icon?: string;
}

interface FlowDiagramProps {
  title: string;
  steps: FlowStep[];
}

export function FlowDiagram({ title, steps }: FlowDiagramProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="pp-diagram">
      <svg viewBox="0 0 700 200" className="w-full" style={{ maxHeight: 200 }}>
        {/* Title */}
        <text x="350" y="24" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="700" fontFamily="Georgia, serif">
          {title}
        </text>

        {/* Flow steps */}
        {steps.map((step, i) => {
          const totalWidth = steps.length * 120 + (steps.length - 1) * 30;
          const startX = (700 - totalWidth) / 2;
          const x = startX + i * 150;
          const y = 85;
          const isActive = activeIdx === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Box */}
              <rect
                x={x}
                y={y}
                width="120"
                height="60"
                rx="10"
                fill={isActive ? step.color : '#1e293b'}
                stroke={step.color}
                strokeWidth={isActive ? 3 : 2}
                opacity={isActive ? 1 : 0.85}
              />
              {/* Step number */}
              <circle cx={x + 15} cy={y - 8} r="12" fill={step.color} />
              <text x={x + 15} y={y - 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="800">
                {i + 1}
              </text>
              {/* Label */}
              <text x={x + 60} y={y + 28} textAnchor="middle" fill={isActive ? '#fff' : '#f8fafc'} fontSize="11" fontWeight="600">
                {step.label.length > 14 ? step.label.substring(0, 14) + '...' : step.label}
              </text>
              <text x={x + 60} y={y + 44} textAnchor="middle" fill={isActive ? 'rgba(255,255,255,0.8)' : '#94a3b8'} fontSize="9">
                {step.description.length > 18 ? step.description.substring(0, 18) + '...' : step.description}
              </text>

              {/* Arrow to next */}
              {i < steps.length - 1 && (
                <g>
                  <line x1={x + 120} x2={x + 150} y1={y + 30} y2={y + 30} stroke="#475569" strokeWidth="2" />
                  <polygon points={`${x + 150},${y + 25} ${x + 158},${y + 30} ${x + 150},${y + 35}`} fill="#475576" />
                </g>
              )}
            </g>
          );
        })}

        {/* Bottom description */}
        {activeIdx !== null && (
          <text x="350" y="185" textAnchor="middle" fill="#94a3b8" fontSize="12">
            Step {activeIdx + 1}: {steps[activeIdx].description}
          </text>
        )}
      </svg>
      <p className="pp-diagram-caption">Interactive: hover each step for details</p>
    </div>
  );
}
