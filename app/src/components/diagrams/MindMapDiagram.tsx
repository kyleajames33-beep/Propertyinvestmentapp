import { useState } from 'react';

interface MindMapNode {
  label: string;
  children?: MindMapNode[];
  color?: string;
}

interface MindMapDiagramProps {
  title: string;
  centerLabel: string;
  centerColor?: string;
  branches: MindMapNode[];
}

export function MindMapDiagram({ title, centerLabel, centerColor = '#2563eb', branches }: MindMapDiagramProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [hoveredChild, setHoveredChild] = useState<string | null>(null);

  const cx = 350;
  const cy = 160;
  const nodeRadius = 44;
  const branchRadius = 110;

  const angleStep = branches.length > 1 ? (Math.PI * 1.5) / (branches.length - 1) : 0;
  const startAngle = Math.PI * 0.75;

  return (
    <div className="pp-diagram">
      <svg viewBox="0 0 700 340" className="w-full" style={{ maxHeight: 340 }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Title */}
        <text x={cx} y="22" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="700" fontFamily="Georgia, serif">
          {title}
        </text>

        {/* Connection lines from center */}
        {branches.map((branch, i) => {
          const angle = startAngle + angleStep * i;
          const x2 = cx + branchRadius * Math.cos(angle);
          const y2 = cy + branchRadius * Math.sin(angle);
          const isHovered = hoveredIdx === i;
          return (
            <g key={`line-${i}`}>
              <line x1={cx} y1={cy} x2={x2} y2={y2}
                stroke={branch.color || '#475569'}
                strokeWidth={isHovered ? 3 : 2}
                opacity={isHovered ? 1 : 0.6}
              />
              {/* Sub-lines to children */}
              {branch.children?.map((_child, j) => {
                const childDist = branchRadius + 65;
                const childSpread = 0.35;
                const childAngle = angle + (j - (branch.children!.length - 1) / 2) * childSpread;
                const cx2 = cx + childDist * Math.cos(childAngle);
                const cy2 = cy + childDist * Math.sin(childAngle);
                const isChHovered = hoveredChild === `${i}-${j}`;
                return (
                  <g key={`child-line-${i}-${j}`}>
                    <line x1={x2} y1={y2} x2={cx2} y2={cy2}
                      stroke={branch.color || '#475569'}
                      strokeWidth={isChHovered ? 2 : 1}
                      opacity={isChHovered ? 0.9 : 0.4}
                    />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Center node */}
        <circle cx={cx} cy={cy} r={nodeRadius} fill={centerColor} opacity="0.2" filter="url(#glow)" />
        <circle cx={cx} cy={cy} r={nodeRadius - 4} fill={centerColor} opacity="0.9" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="12" fontWeight="700">
          {centerLabel.length > 10 ? centerLabel.substring(0, 10) + '...' : centerLabel}
        </text>
        {centerLabel.length > 10 && (
          <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="10">
            {centerLabel.substring(10, 20)}{centerLabel.length > 20 ? '...' : ''}
          </text>
        )}

        {/* Branch nodes */}
        {branches.map((branch, i) => {
          const angle = startAngle + angleStep * i;
          const x = cx + branchRadius * Math.cos(angle);
          const y = cy + branchRadius * Math.sin(angle);
          const isHovered = hoveredIdx === i;
          const r = isHovered ? 34 : 30;
          return (
            <g key={`branch-${i}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={x} cy={y} r={r + 4} fill={branch.color || '#334155'} opacity={isHovered ? 0.3 : 0} filter="url(#glow)" />
              <circle cx={x} cy={y} r={r} fill={branch.color || '#1e293b'} stroke={branch.color || '#475569'} strokeWidth={isHovered ? 3 : 2} />
              <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="10" fontWeight="600">
                {branch.label.length > 12 ? branch.label.substring(0, 12) + '...' : branch.label}
              </text>
              {branch.children && (
                <text x={x} y={y + 18} textAnchor="middle" fill="#94a3b8" fontSize="9">
                  {branch.children.length} items
                </text>
              )}
            </g>
          );
        })}

        {/* Child nodes */}
        {branches.map((branch, i) => {
          const angle = startAngle + angleStep * i;
          return branch.children?.map((_child, j) => {
            const childDist = branchRadius + 65;
            const childSpread = 0.35;
            const childAngle = angle + (j - (branch.children!.length - 1) / 2) * childSpread;
            const x = cx + childDist * Math.cos(childAngle);
            const y = cy + childDist * Math.sin(childAngle);
            const isChHovered = hoveredChild === `${i}-${j}`;
            return (
              <g key={`child-${i}-${j}`}
                onMouseEnter={() => { setHoveredIdx(i); setHoveredChild(`${i}-${j}`); }}
                onMouseLeave={() => setHoveredChild(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x={x - 38} y={y - 14} width="76" height="28" rx="6"
                  fill={isChHovered ? (branch.color || '#334155') : '#0f172a'}
                  stroke={branch.color || '#475569'}
                  strokeWidth={isChHovered ? 2 : 1}
                  opacity={isChHovered ? 1 : 0.85}
                />
                <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight={500}>
                  {_child.label.length > 14 ? _child.label.substring(0, 14) + '...' : _child.label}
                </text>
              </g>
            );
          });
        })}
      </svg>
      <p className="pp-diagram-caption">Interactive: hover nodes to explore concepts</p>
    </div>
  );
}
