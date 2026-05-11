import { useState } from 'react';
import { CheckCircle2, Circle, ClipboardCheck } from 'lucide-react';

interface CheckInItem {
  label: string;
  checked?: boolean;
}

interface CheckInCardProps {
  title: string;
  subtitle: string;
  items: CheckInItem[];
}

export function CheckInCard({ title, subtitle, items }: CheckInCardProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>(
    Object.fromEntries(items.map((item, i) => [i, item.checked || false]))
  );

  const completed = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((completed / items.length) * 100);

  return (
    <div style={{
      margin: '20px 0',
      background: 'linear-gradient(135deg, #1a2d4a 0%, #243b5d 100%)',
      borderRadius: '16px',
      padding: '28px 32px',
      color: 'white',
      borderLeft: '5px solid #f59e0b',
      boxShadow: '0 8px 32px rgba(26, 45, 74, 0.2)',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <ClipboardCheck className="h-5 w-5 text-amber-400" />
        <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 700, color: '#fbbf24', margin: 0 }}>
          {title}
        </h3>
      </div>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', lineHeight: 1.6 }}>
        {subtitle}
      </p>

      {/* Progress bar */}
      <div style={{
        height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px',
        marginBottom: '16px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: pct === 100 ? '#22c55e' : '#f59e0b',
          borderRadius: '3px', transition: 'width 0.4s ease',
        }} />
      </div>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px', fontWeight: 600 }}>
        {completed} of {items.length} completed ({pct}%)
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item, i) => {
          const isChecked = checked[i];
          return (
            <button key={i}
              onClick={() => setChecked(prev => ({ ...prev, [i]: !prev[i] }))}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', borderRadius: '8px',
                background: isChecked ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                border: `1.5px solid ${isChecked ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 0.2s',
              }}
            >
              {isChecked
                ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: '#4ade80' }} />
                : <Circle className="h-5 w-5 flex-shrink-0" style={{ color: 'rgba(255,255,255,0.3)' }} />
              }
              <span style={{
                fontSize: '13px', fontWeight: isChecked ? 600 : 400,
                color: isChecked ? '#bbf7d0' : 'rgba(255,255,255,0.9)',
                textDecoration: isChecked ? 'line-through' : 'none',
                textDecorationColor: 'rgba(34,197,94,0.5)',
                transition: 'all 0.2s',
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {pct === 100 && (
        <div style={{
          marginTop: '14px', padding: '10px 14px', borderRadius: '8px',
          background: 'rgba(34,197,94,0.15)', border: '1.5px solid rgba(34,197,94,0.3)',
          fontSize: '13px', fontWeight: 700, color: '#4ade80', textAlign: 'center',
        }}>
          All checked! You are ready to proceed to the next stage.
        </div>
      )}
    </div>
  );
}
