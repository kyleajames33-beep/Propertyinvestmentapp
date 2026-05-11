import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, Sparkles, Zap } from 'lucide-react';

const features = [
  { name: '23 calculators', free: true, pro: true },
  { name: '8-stage journey guides', free: true, pro: true },
  { name: 'Interactive checklists', free: true, pro: true },
  { name: 'Question scripts', free: true, pro: true },
  { name: 'Save calculator scenarios', free: false, pro: true },
  { name: 'Export checklists as PDF', free: false, pro: true },
  { name: 'Advanced calculators (portfolio, DSR)', free: false, pro: true },
  { name: 'Priority professional matching', free: false, pro: true },
  { name: 'Monthly market report', free: false, pro: true },
  { name: 'Ad-free experience', free: false, pro: true },
];

export function ProUpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-amber-500" />
            PropertyPath Pro
          </DialogTitle>
        </DialogHeader>

        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            Power tools for serious property buyers. Upgrade when you are ready.
          </p>
        </div>

        {/* Pricing toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border bg-muted p-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${billing === 'monthly' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${billing === 'yearly' ? 'bg-white shadow-sm' : 'text-muted-foreground'}`}
            >
              Yearly <span className="text-[10px] text-emerald-600 font-bold">SAVE 30%</span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border p-5">
            <div className="text-sm font-medium text-muted-foreground mb-1">Free</div>
            <div className="text-3xl font-bold mb-4">$0</div>
            <ul className="space-y-2 text-sm">
              {features.slice(0, 4).map(f => (
                <li key={f.name} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  {f.name}
                </li>
              ))}
              {features.slice(4).map(f => (
                <li key={f.name} className="flex items-center gap-2 text-muted-foreground">
                  <X className="h-4 w-4 text-slate-300 flex-shrink-0" />
                  {f.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border-2 border-primary p-5 bg-primary/[0.02] relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <div className="text-sm font-medium text-primary mb-1">Pro</div>
            <div className="text-3xl font-bold mb-1">
              ${billing === 'monthly' ? '12' : '99'}
              <span className="text-sm font-normal text-muted-foreground">/{billing === 'monthly' ? 'month' : 'year'}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Cancel anytime. No lock-in.</p>
            <ul className="space-y-2 text-sm">
              {features.map(f => (
                <li key={f.name} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  {f.name}
                </li>
              ))}
            </ul>
            <Button className="w-full mt-5 gap-1.5" onClick={() => {
              // In a real app, this would open Stripe
              alert('Stripe checkout would open here. This is a demo.');
            }}>
              <Sparkles className="h-4 w-4" />
              Upgrade to Pro
            </Button>
          </div>
        </div>

        <div className="text-center">
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground underline">
            Maybe later — I will stick with free for now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ProFeatureLock({ children }: { children: React.ReactNode; feature?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => setOpen(true)}>
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg">
            <Zap className="h-3 w-3" />
            Pro feature
          </div>
        </div>
        {children}
      </div>
      <ProUpgradeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

