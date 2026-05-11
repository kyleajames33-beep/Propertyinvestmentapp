import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItem {
  title: string;
  content: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  defaultOpen?: boolean;
}

interface AccordionContainerProps {
  title?: string;
  items: AccordionItem[];
}

export function AccordionContainer({ title, items }: AccordionContainerProps) {
  const [open, setOpen] = useState<Record<number, boolean>>(
    Object.fromEntries(items.map((item, i) => [i, item.defaultOpen || false]))
  );

  const toggle = (i: number) => setOpen(prev => ({ ...prev, [i]: !prev[i] }));

  const allOpen = Object.values(open).every(Boolean);
  const toggleAll = () => {
    const next = Object.fromEntries(items.map((_, i) => [i, !allOpen]));
    setOpen(next);
  };

  return (
    <div style={{ margin: '20px 0' }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '12px',
        }}>
          <span style={{
            fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px',
            color: '#d97706', paddingBottom: '8px', borderBottom: '2px solid #fbbf24',
          }}>
            {title}
          </span>
          <button onClick={toggleAll} style={{
            fontSize: '11px', fontWeight: 600, color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer',
          }}>
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item, i) => {
          const isOpen = open[i];
          return (
            <div key={i} style={{
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'border-color 0.2s',
              borderColor: isOpen ? '#93c5fd' : '#e2e8f0',
            }}>
              <button onClick={() => toggle(i)} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                width: '100%', padding: '14px 18px',
                background: isOpen ? '#eff6ff' : '#f8fafc',
                border: 'none', cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.2s',
              }}>
                {isOpen
                  ? <ChevronUp className="h-4 w-4 flex-shrink-0" style={{ color: '#2563eb' }} />
                  : <ChevronDown className="h-4 w-4 flex-shrink-0" style={{ color: '#94a3b8' }} />
                }
                <span style={{
                  flex: 1, fontSize: '14px', fontWeight: 600,
                  color: isOpen ? '#1e40af' : '#334155',
                }}>
                  {item.title}
                </span>
                {item.badge && (
                  <span style={{
                    fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px',
                    padding: '3px 8px', borderRadius: '100px', flexShrink: 0,
                    background: item.badgeColor || '#e2e8f0',
                    color: item.badgeColor ? '#fff' : '#475569',
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>

              {isOpen && (
                <div style={{
                  padding: '16px 18px 16px 46px',
                  background: '#fff',
                  fontSize: '14px', lineHeight: 1.7, color: '#475569',
                  borderTop: '1px solid #dbeafe',
                }}>
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
