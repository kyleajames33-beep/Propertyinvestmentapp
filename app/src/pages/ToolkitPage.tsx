import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, CheckCircle, Mail, ArrowRight, ClipboardList, Calculator, FileQuestion, BookOpen, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { submitToForm, BASIN_ENDPOINT } from '@/lib/forms';
import { SEO } from '@/components/SEO';

export function ToolkitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const success = await submitToForm(BASIN_ENDPOINT, {
      email,
      form_name: 'toolkit_download',
    });
    setSubmitting(false);
    if (success || import.meta.env.DEV) {
      setSubmitted(true);
    }
  };

  const resources = [
    { icon: <ClipboardList className="h-5 w-5" />, title: 'Stage-by-Stage Checklists', desc: '8 checklists covering every step from strategy to settlement' },
    { icon: <FileQuestion className="h-5 w-5" />, title: 'Question Scripts', desc: 'What to ask mortgage brokers, conveyancers, inspectors, and agents' },
    { icon: <Calculator className="h-5 w-5" />, title: 'Calculator Summary Sheets', desc: 'Key formulas and worked examples from all 23 calculators' },
    { icon: <BookOpen className="h-5 w-5" />, title: 'NSW Reference Guide', desc: 'Stamp duty tables, grant thresholds, and key dates' },
    { icon: <FileText className="h-5 w-5" />, title: 'Due Diligence Template', desc: 'Property evaluation scorecard for inspections' },
  ];

  return (
    <div className="pp-container py-10">
      <SEO title="NSW Property Toolkit — PropertyPath" description="Download free checklists, question scripts, calculator guides, and due diligence templates for NSW property buyers." />
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 mb-4">
            <Download className="h-7 w-7 text-primary" />
          </div>
          <h1 className="pp-title text-3xl md:text-4xl mb-3">NSW Property Toolkit</h1>
          <p className="pp-subtitle text-base">
            Everything you need to buy property in NSW — checklists, question scripts, 
            calculator guides, and due diligence templates. Sent straight to your inbox.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-5">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Check your inbox</h2>
            <p className="text-sm text-slate-500 mb-6">
              Your NSW Property Toolkit is on its way to {email}.
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-left max-w-md mx-auto">
              <p className="text-sm font-medium text-slate-700 mb-3">While you wait, explore the site:</p>
              <div className="space-y-2">
                <Link to="/calculators" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Calculator className="h-4 w-4" /> Try our 23 calculators
                </Link>
                <Link to="/journey" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <BookOpen className="h-4 w-4" /> Start the 8-stage journey
                </Link>
                <Link to="/professionals" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <FileQuestion className="h-4 w-4" /> Find a professional
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Resources list */}
            <div className="space-y-3 mb-8">
              {resources.map((r, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {r.icon}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{r.title}</div>
                    <div className="text-sm text-slate-500">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pro upsell */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 text-sm">Want the Premium Toolkit?</h3>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                    Includes editable spreadsheets, deposit tracker, settlement timeline, 
                    and suburb comparison matrix. Share PropertyPath with 3 friends to unlock it free.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 text-amber-700 border-amber-300 hover:bg-amber-100" asChild>
                    <Link to="/">Share to unlock</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="font-semibold text-slate-800 mb-1">Get the toolkit</h3>
              <p className="text-sm text-slate-500 mb-4">Enter your email and we will send you the complete toolkit.</p>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <Button type="submit" className="gap-1.5" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Send it'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[11px] text-slate-400 mt-3">
                No spam. Unsubscribe anytime. We respect your privacy — 
                <Link to="/privacy" className="underline">read our policy</Link>.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
