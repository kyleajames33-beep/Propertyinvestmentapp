import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface ComparisonColumn {
  header: string;
  color?: string;
  features: Array<{
    label?: string;
    value: string | boolean | number;
    highlight?: boolean;
  }>;
}

interface ComparisonTableProps {
  title: string;
  columns: ComparisonColumn[];
  rowLabels?: string[];
}

export function ComparisonTable({ title, columns, rowLabels }: ComparisonTableProps) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  const renderValue = (val: string | boolean | number) => {
    if (typeof val === 'boolean') {
      return val
        ? <Check className="h-4 w-4 text-emerald-500 mx-auto" />
        : <X className="h-4 w-4 text-red-400 mx-auto" />;
    }
    if (typeof val === 'number') {
      return <span className="font-mono text-sm">${val.toLocaleString()}</span>;
    }
    return <span className="text-sm">{val}</span>;
  };

  const maxRows = Math.max(...columns.map(c => c.features.length));
  const labels = rowLabels || Array.from({ length: maxRows }, (_, i) => `Feature ${i + 1}`);

  return (
    <div className="pp-diagram" style={{ background: '#0f172a', padding: '24px', borderRadius: '14px', margin: '20px 0' }}>
      <h4 style={{ color: '#f8fafc', fontSize: '15px', fontWeight: 700, fontFamily: 'Georgia, serif', textAlign: 'center', marginBottom: '16px' }}>
        {title}
      </h4>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ minWidth: 140, padding: '10px 12px', textAlign: 'left', color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '2px solid #334155' }}>
                Criteria
              </th>
              {columns.map((col, i) => (
                <th key={i}
                  onMouseEnter={() => setHoveredCol(i)}
                  onMouseLeave={() => setHoveredCol(null)}
                  style={{
                    minWidth: 120,
                    padding: '10px 12px',
                    textAlign: 'center',
                    color: col.color || '#f8fafc',
                    fontSize: 12,
                    fontWeight: 700,
                    borderBottom: `2px solid ${col.color || '#334155'}`,
                    background: hoveredCol === i ? 'rgba(255,255,255,0.04)' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labels.map((label, rowIdx) => (
              <tr key={rowIdx} style={{ borderBottom: '1px solid #1e293b' }}>
                <td style={{ padding: '10px 12px', color: '#cbd5e1', fontSize: 12, fontWeight: 600 }}>
                  {label}
                </td>
                {columns.map((col, colIdx) => {
                  const feature = col.features[rowIdx];
                  return (
                    <td key={colIdx}
                      onMouseEnter={() => setHoveredCol(colIdx)}
                      onMouseLeave={() => setHoveredCol(null)}
                      style={{
                        padding: '10px 12px',
                        textAlign: 'center',
                        color: '#e2e8f0',
                        background: hoveredCol === colIdx ? 'rgba(255,255,255,0.03)' : feature?.highlight ? 'rgba(255,255,255,0.04)' : 'transparent',
                        transition: 'background 0.2s',
                        borderLeft: colIdx === 0 ? 'none' : '1px solid #1e293b',
                      }}
                    >
                      {feature ? renderValue(feature.value) : <span className="text-slate-600">—</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="pp-diagram-caption">Hover columns to highlight. Green check = yes, red X = no.</p>
    </div>
  );
}
