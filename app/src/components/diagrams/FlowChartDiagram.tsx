import { useState } from 'react';

type FlowNodeType = 'start' | 'process' | 'decision' | 'end' | 'note';

interface FlowNode {
  id: string;
  label: string;
  type: FlowNodeType;
  description?: string;
  color?: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
}

interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

interface FlowChartDiagramProps {
  title: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export function FlowChartDiagram({ title, nodes, edges }: FlowChartDiagramProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  const getNodeCenter = (node: FlowNode) => ({
    cx: node.x + (node.w || 120) / 2,
    cy: node.y + (node.h || 40) / 2,
  });

  const renderNode = (node: FlowNode) => {
    const isActive = activeNode === node.id;
    const color = node.color || '#3b82f6';
    const w = node.w || 120;
    const h = node.h || 40;

    const commonProps = {
      onMouseEnter: () => setActiveNode(node.id),
      onMouseLeave: () => setActiveNode(null),
      style: { cursor: 'pointer' } as React.CSSProperties,
    };

    const glow = isActive ? (
      <filter id={`glow-${node.id}`}>
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    ) : null;

    switch (node.type) {
      case 'start':
        return (
          <g key={node.id} {...commonProps}>
            {glow}
            <rect x={node.x} y={node.y} width={w} height={h} rx={h / 2}
              fill={color} opacity={isActive ? 1 : 0.9} />
            <text x={node.x + w / 2} y={node.y + h / 2 + 4} textAnchor="middle"
              fill="white" fontSize="11" fontWeight="700">{node.label}</text>
          </g>
        );
      case 'decision':
        return (
          <g key={node.id} {...commonProps}>
            {glow}
            <polygon
              points={`${node.x + w / 2},${node.y} ${node.x + w},${node.y + h / 2} ${node.x + w / 2},${node.y + h} ${node.x},${node.y + h / 2}`}
              fill={isActive ? color : '#1e293b'}
              stroke={color} strokeWidth={isActive ? 3 : 2} opacity={isActive ? 1 : 0.85} />
            <text x={node.x + w / 2} y={node.y + h / 2 + 3} textAnchor="middle"
              fill="white" fontSize="9" fontWeight="600">{node.label.length > 16 ? node.label.substring(0, 16) + '...' : node.label}</text>
          </g>
        );
      case 'end':
        return (
          <g key={node.id} {...commonProps}>
            {glow}
            <rect x={node.x} y={node.y} width={w} height={h} rx={h / 2}
              fill={color} opacity={isActive ? 1 : 0.9} />
            <text x={node.x + w / 2} y={node.y + h / 2 + 4} textAnchor="middle"
              fill="white" fontSize="11" fontWeight="700">{node.label}</text>
          </g>
        );
      case 'note':
        return (
          <g key={node.id} {...commonProps}>
            {glow}
            <rect x={node.x} y={node.y} width={w} height={h} rx="4"
              fill="#fef9e8" stroke="#fbbf24" strokeWidth="1" opacity={0.95} />
            <text x={node.x + w / 2} y={node.y + h / 2 + 3} textAnchor="middle"
              fill="#92400e" fontSize="9" fontWeight="500">{node.label}</text>
          </g>
        );
      default:
        return (
          <g key={node.id} {...commonProps}>
            {glow}
            <rect x={node.x} y={node.y} width={w} height={h} rx="8"
              fill={isActive ? color : '#1e293b'}
              stroke={color} strokeWidth={isActive ? 3 : 2}
              opacity={isActive ? 1 : 0.85} />
            <text x={node.x + w / 2} y={node.y + h / 2 + 4} textAnchor="middle"
              fill="white" fontSize="10" fontWeight="600">{node.label.length > 18 ? node.label.substring(0, 18) + '...' : node.label}</text>
          </g>
        );
    }
  };

  const renderEdge = (edge: FlowEdge) => {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) return null;

    const fromCenter = getNodeCenter(fromNode);
    const toCenter = getNodeCenter(toNode);

    // Simple straight line for now
    const dx = toCenter.cx - fromCenter.cx;
    const dy = toCenter.cy - fromCenter.cy;
    const len = Math.sqrt(dx * dx + dy * dy);
    const offset = 20;

    const x1 = fromCenter.cx + (dx / len) * offset;
    const y1 = fromCenter.cy + (dy / len) * offset;
    const x2 = toCenter.cx - (dx / len) * offset;
    const y2 = toCenter.cy - (dy / len) * offset;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    return (
      <g key={`${edge.from}-${edge.to}`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#475569" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
        {edge.label && (
          <rect x={midX - 22} y={midY - 10} width="44" height="18" rx="4"
            fill="#0f172a" stroke="#475569" strokeWidth="1" />
        )}
        {edge.label && (
          <text x={midX} y={midY + 4} textAnchor="middle" fill="#94a3b8" fontSize="8">
            {edge.label}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="pp-diagram">
      <svg viewBox="0 0 700 320" className="w-full" style={{ maxHeight: 320 }}>
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
        </defs>

        <text x="350" y="22" textAnchor="middle" fill="#f8fafc" fontSize="15" fontWeight="700" fontFamily="Georgia, serif">
          {title}
        </text>

        {edges.map(renderEdge)}
        {nodes.map(renderNode)}

        {/* Active description */}
        {activeNode && nodeMap.get(activeNode)?.description && (
          <g>
            <rect x="150" y="290" width="400" height="24" rx="6" fill="#1e293b" stroke="#334155" />
            <text x="350" y="306" textAnchor="middle" fill="#94a3b8" fontSize="11">
              {nodeMap.get(activeNode)?.description}
            </text>
          </g>
        )}
      </svg>
      <p className="pp-diagram-caption">Interactive: hover nodes for details. Diamonds are decisions.</p>
    </div>
  );
}
