import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle, Send, BookOpen, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitToForm, BASIN_ENDPOINT } from '@/lib/forms';

const journeyStages = [
  { id: 'strategy', label: 'Just starting — setting strategy' },
  { id: 'finance', label: 'Sorting out finance & pre-approval' },
  { id: 'research', label: 'Researching suburbs & properties' },
  { id: 'inspection', label: 'Inspecting properties' },
  { id: 'negotiation', label: 'Making offers / negotiating' },
  { id: 'contract', label: 'Contract review & exchange' },
  { id: 'settlement', label: 'Settlement & moving in' },
  { id: 'investing', label: 'Building an investment portfolio' },
];

const buyerTypes = [
  { id: 'fhb-oo', label: 'First Home Buyer' },
  { id: 'inv-new', label: 'First-Time Investor' },
  { id: 'inv-exp', label: 'Experienced Investor' },
  { id: 'downsizer', label: 'Downsizer' },
];

export function EmailCapture({ variant = 'default' }: { variant?: 'default' | 'compact' | 'inline' }) {
  const [email, setEmail] = useState('');
  const [stage, setStage] = useState('');
  const [buyerType, setBuyerType] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const success = await submitToForm(BASIN_ENDPOINT, {
      email,
      stage,
      buyer_type: buyerType,
      form_name: 'email_capture',
    });
    setSubmitting(false);
    if (success || import.meta.env.DEV) {
      setSubmitted(true);
    }
  };

  if (variant === 'compact') {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <Button type="submit" size="sm" className="gap-1" disabled={submitting}>
              <Send className="h-3.5 w-3.5" />
              {submitting ? 'Sending...' : 'Get tips'}
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">You are on the list! Check your inbox for a welcome email.</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-10 text-white">
      {!submitted ? (
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-serif mb-2">
              Get property tips tailored to your journey
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              We send one email per week with NSW property news, market updates, and tips relevant to where you are in the buying process. No spam. Unsubscribe anytime.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Your stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-slate-800 border border-slate-600 text-sm text-white"
                >
                  <option value="">Select stage</option>
                  {journeyStages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Buyer type</label>
                <select
                  value={buyerType}
                  onChange={(e) => setBuyerType(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-slate-800 border border-slate-600 text-sm text-white"
                >
                  <option value="">Select type</option>
                  {buyerTypes.map(b => <option key={b.id} value={b.id}>{b.label}</option>)}
                </select>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              <Send className="h-4 w-4" />
              {submitting ? 'Sending...' : 'Send me weekly tips'}
            </Button>

            <p className="text-xs text-slate-500 text-center">
              Your information is handled per our{' '}
              <Link to="/privacy" className="underline hover:text-slate-300">Privacy Policy</Link>.
              We never share your email with third parties without consent.
            </p>
          </form>
        </div>
      ) : (
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-7 w-7 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">You are on the list!</h3>
          <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
            Check your inbox for a welcome email. We will send you property tips tailored to{' '}
            {buyerType ? buyerTypes.find(b => b.id === buyerType)?.label.toLowerCase() : 'your situation'}
            {stage ? ` at the ${journeyStages.find(s => s.id === stage)?.label.toLowerCase()} stage` : ''}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> Weekly property insights</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> NSW market updates</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Unsubscribe anytime</span>
          </div>
        </div>
      )}
    </div>
  );
}
