import { useState } from 'react';
import { MessageSquare, ArrowRight, X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { submitToForm, BASIN_ENDPOINT } from '@/lib/forms';
import { trackActivity } from '@/lib/badges';

interface CalculatorCtaProps {
  calculatorName: string;
  headline: string;
  subline: string;
  ctaText: string;
  professionalType?: string;
  nextStageSlug?: string;
  nextStageLabel?: string;
}

export function CalculatorCta({ headline, subline, ctaText, professionalType, nextStageSlug, nextStageLabel }: CalculatorCtaProps) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await submitToForm(BASIN_ENDPOINT, {
      email,
      phone,
      calculator_name: professionalType,
      form_name: 'calculator_cta',
    });
    setSubmitting(false);
    if (success || import.meta.env.DEV) {
      trackActivity('referral_request');
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-center">
        <div className="text-sm font-semibold text-emerald-800">Request sent!</div>
        <div className="text-xs text-emerald-600 mt-1">
          {professionalType ? `A ${professionalType} will reach out within 24 hours.` : "We'll be in touch within 24 hours."}
        </div>
        {nextStageSlug && (
          <div className="mt-3 pt-3 border-t border-emerald-200">
            <Link to={`/journey/${nextStageSlug}`} className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:underline">
              <BookOpen className="h-3 w-3" />
              Continue reading: {nextStageLabel}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
      {!showForm ? (
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-slate-800">{headline}</div>
            <div className="text-xs text-slate-500 mt-0.5">{subline}</div>
          </div>
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5 whitespace-nowrap flex-shrink-0">
            <MessageSquare className="h-3.5 w-3.5" />
            {ctaText}
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-800">{headline}</div>
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (optional)"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <Button type="submit" size="sm" className="w-full gap-1.5" disabled={submitting}>
            <MessageSquare className="h-3.5 w-3.5" />
            {submitting ? 'Sending...' : 'Send my request'}
          </Button>
          <div className="text-[11px] text-slate-400 text-center">
            No spam. We'll connect you with a vetted professional. Unsubscribe anytime.
          </div>
        </form>
      )}
    </div>
  );
}
