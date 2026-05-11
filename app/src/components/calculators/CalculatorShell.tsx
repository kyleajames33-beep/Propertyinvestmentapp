import { type ReactNode, useState, useEffect, useRef } from 'react';
import { Printer } from 'lucide-react';

/* ─────────────────────────────────────────────
   Shared Calculator Shell Design System
   Matches the standalone calculator's premium look
   ───────────────────────────────────────────── */

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}

export function SliderControl({ label, value, min, max, step = 1, format, onChange }: SliderProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Sync display value when external value changes (e.g. reset, URL params)
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setDisplayValue(newValue);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, 80);
  };

  const handlePointerUp = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onChange(displayValue);
  };

  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="font-mono text-sm font-medium text-teal-700 tabular-nums min-w-[70px] text-right">
          {format(displayValue)}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-slate-400 tabular-nums min-w-[32px]">{format(min)}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={handleChange}
          onPointerUp={handlePointerUp}
          onTouchEnd={handlePointerUp}
          className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px]
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-700 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-[1.15]"
        />
        <span className="text-[11px] text-slate-400 tabular-nums min-w-[32px] text-right">{format(max)}</span>
      </div>
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  variant?: 'default' | 'accent' | 'success' | 'gold' | 'warning' | 'danger';
}

const kpiVariantClasses: Record<string, string> = {
  default: 'bg-slate-50 border-slate-200',
  accent: 'bg-teal-50 border-teal-200',
  success: 'bg-emerald-50 border-emerald-200',
  gold: 'bg-amber-50 border-amber-200',
  warning: 'bg-orange-50 border-orange-200',
  danger: 'bg-red-50 border-red-200',
};

export function KpiCard({ label, value, sub, variant = 'default' }: KpiCardProps) {
  return (
    <div className={`rounded-xl border p-4 transition-all ${kpiVariantClasses[variant]}`}>
      <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="font-mono text-lg font-semibold text-slate-800 tabular-nums leading-tight">{value}</div>
      {sub && <div className="text-[11px] text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

interface KpiGridProps {
  children: ReactNode;
}

export function KpiGrid({ children }: KpiGridProps) {
  return <div className="grid grid-cols-2 gap-3 mb-4">{children}</div>;
}

interface CalcLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  lastUpdated?: string;
  showDisclaimer?: boolean;
}

export function CalcLayout({ children, title, subtitle, lastUpdated = 'April 2025', showDisclaimer = true }: CalcLayoutProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      {(title || subtitle) && (
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {title && <h3 className="text-lg font-bold font-serif text-slate-900">{title}</h3>}
              {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-[10px] text-slate-500 font-medium hover:bg-slate-200 transition-colors no-print"
                aria-label="Print results"
              >
                <Printer className="h-3 w-3" />
                Print
              </button>
              {lastUpdated && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-[10px] text-slate-500 font-medium">
                  Updated {lastUpdated}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {showDisclaimer && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
          <CalcDisclaimer />
        </div>
      )}
    </div>
  );
}

export function CalcDisclaimer() {
  return (
    <p className="text-[11px] text-slate-400 leading-relaxed">
      <strong className="text-slate-500">Note:</strong> Results are estimates based on standard assumptions. 
      Actual figures vary by lender, property, and individual circumstances. 
      Always consult a licensed professional before making financial decisions. 
      <a href="#/disclosure" className="underline ml-1">Referral disclosure</a>.
    </p>
  );
}

interface TwoColumnLayoutProps {
  left: ReactNode;
  right: ReactNode;
  leftTitle?: string;
  rightTitle?: string;
}

export function TwoColumnLayout({ left, right, leftTitle, rightTitle }: TwoColumnLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
      {/* Left: Controls */}
      <div className="space-y-4">
        {leftTitle && <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">{leftTitle}</div>}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
          {left}
        </div>
      </div>
      {/* Right: Results / Chart */}
      <div className="space-y-4">
        {rightTitle && <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">{rightTitle}</div>}
        {right}
      </div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  bold?: boolean;
}

export function InfoRow({ label, value, bold }: InfoRowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 text-sm">
      <span className={`text-slate-500 ${bold ? 'font-medium text-slate-700' : ''}`}>{label}</span>
      <span className="font-mono font-medium text-slate-800 tabular-nums">{value}</span>
    </div>
  );
}

interface ChartPanelProps {
  title: string;
  subtitle?: string;
  legend?: Array<{ color: string; label: string }>;
  children: ReactNode;
  footer?: ReactNode;
}

export function ChartPanel({ title, subtitle, legend, children, footer }: ChartPanelProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <div className="text-base font-semibold text-slate-800">{title}</div>
          {subtitle && <div className="text-xs text-slate-500 mt-0.5">{subtitle}</div>}
        </div>
        {legend && (
          <div className="flex gap-3 flex-wrap">
            {legend.map((l, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="relative" style={{ minHeight: 280 }}>
        {children}
      </div>
      {footer && <div className="mt-3 pt-3 border-t border-slate-100">{footer}</div>}
    </div>
  );
}

interface PhaseBarProps {
  savePct: number;
  label: string;
}

export function PhaseBar({ savePct, label }: PhaseBarProps) {
  return (
    <div>
      <div className="flex h-2 rounded-full overflow-hidden bg-slate-200">
        <div
          className="bg-teal-700 transition-all duration-500"
          style={{ width: `${Math.max(2, savePct)}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[11px] text-slate-400">
        <span>{label}</span>
        <span>Remaining term →</span>
      </div>
    </div>
  );
}

/* Number formatting helpers */
export function fmtDollar(n: number): string {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return '$' + Math.round(n / 1_000).toLocaleString() + 'k';
  return '$' + Math.round(n).toLocaleString();
}

export function fmtDollarFull(n: number): string {
  return '$' + Math.round(n).toLocaleString();
}
