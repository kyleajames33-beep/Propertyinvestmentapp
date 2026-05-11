import { Eye, DollarSign, Calendar, Shield, AlertTriangle, FileText, Home, TrendingUp, Users } from 'lucide-react';

interface GlanceItem {
  icon: 'money' | 'calendar' | 'shield' | 'warning' | 'document' | 'home' | 'trending' | 'people';
  label: string;
  value: string;
  color?: string;
}

interface AtAGlanceCardProps {
  title: string;
  items: GlanceItem[];
}

const ICON_MAP = {
  money: DollarSign,
  calendar: Calendar,
  shield: Shield,
  warning: AlertTriangle,
  document: FileText,
  home: Home,
  trending: TrendingUp,
  people: Users,
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  green:  { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  amber:  { bg: '#fffbeb', text: '#92400e', border: '#fde68a' },
  red:    { bg: '#fef2f2', text: '#991b1b', border: '#fecaca' },
  purple: { bg: '#faf5ff', text: '#6b21a8', border: '#e9d5ff' },
  slate:  { bg: '#f8fafc', text: '#334155', border: '#e2e8f0' },
  teal:   { bg: '#f0fdfa', text: '#115e59', border: '#99f6e4' },
};

export function AtAGlanceCard({ title, items }: AtAGlanceCardProps) {
  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px',
        fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px',
        color: '#d97706', paddingBottom: '8px', borderBottom: '2px solid #fbbf24',
      }}>
        <Eye className="h-3.5 w-3.5" />
        {title}
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px',
      }}>
        {items.map((item, i) => {
          const colors = COLOR_MAP[item.color || 'slate'];
          const Icon = ICON_MAP[item.icon];
          return (
            <div key={i} style={{
              background: colors.bg,
              border: `1.5px solid ${colors.border}`,
              borderRadius: '10px',
              padding: '14px',
              transition: 'transform 0.15s, box-shadow 0.15s',
              cursor: 'default',
            }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Icon className="h-3.5 w-3.5" style={{ color: colors.text }} />
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.text }}>
                  {item.label}
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: colors.text, fontFamily: 'Georgia, serif' }}>
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
