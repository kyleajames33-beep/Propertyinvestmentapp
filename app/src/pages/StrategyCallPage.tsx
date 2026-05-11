import { useState } from 'react';
import { Phone, Calendar, Clock, User, Mail, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { submitToForm, BASIN_ENDPOINT } from '@/lib/forms';

export function StrategyCallPage() {
  const [step, setStep] = useState<'form' | 'submitted'>('form');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    persona: '',
    topic: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitToForm(BASIN_ENDPOINT, {
      ...form,
      form_name: 'strategy_call_request',
    });
    if (success || import.meta.env.DEV) {
      setStep('submitted');
    }
  };

  return (
    <div className="pp-container py-10">
      <SEO title="Free Property Strategy Call — PropertyPath" description="Book a free 15-minute strategy call with a NSW property expert. No obligation." />
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Phone className="h-3.5 w-3.5" />
          Free for NSW property buyers
        </div>
        <h1 className="pp-title text-3xl md:text-4xl mb-3">Free 15-Minute Strategy Call</h1>
        <p className="pp-subtitle text-base">
          Talk through your property goals with an experienced strategist. No obligation, no sales pitch — 
          just clarity on your next steps.
        </p>
      </div>

      {step === 'submitted' ? (
        <div className="max-w-md mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-5">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Request received</h2>
          <p className="text-sm text-slate-500 mb-6">
            We will match you with a property strategist and send you a booking link within 24 hours.
          </p>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left text-sm text-slate-600 space-y-2">
            <p><strong>What happens next:</strong></p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>We review your request (within 24 hours)</li>
              <li>You receive a booking link for a 15-min call</li>
              <li>Your strategist prepares personalised guidance</li>
              <li>You leave with clear next steps</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-8 max-w-4xl mx-auto">
          {/* Form */}
          <div className="md:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Your name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="you@email.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone (optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="04XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">I am a...</label>
                <select
                  value={form.persona}
                  onChange={(e) => setForm({ ...form, persona: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Select your buyer type</option>
                  <option value="fhb">First home buyer (owner occupier)</option>
                  <option value="inv-new">First-time investor</option>
                  <option value="inv-exp">Experienced investor</option>
                  <option value="downsizer">Downsizer</option>
                  <option value="other">Not sure yet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">What do you want to discuss?</label>
                <select
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Select a topic</option>
                  <option value="strategy">Overall property strategy</option>
                  <option value="finance">Finance and borrowing power</option>
                  <option value="suburb">Suburb and market research</option>
                  <option value="investment">Investment property analysis</option>
                  <option value="buying-process">Understanding the buying process</option>
                  <option value="other">Something else</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Anything else we should know?</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    placeholder="e.g. Looking in Western Sydney, budget around $800K, pre-approved for $700K"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2">
                Request my free call
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-[11px] text-slate-400 text-center">
                No obligation. We may introduce you to a vetted property strategist. 
                <a href="#/disclosure" className="underline ml-1">Referral disclosure</a>.
              </p>
            </form>
          </div>

          {/* Info sidebar */}
          <div className="md:col-span-2 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                What to expect
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                  15-minute video or phone call
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                  Personalised to your situation
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                  Clear next steps after the call
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Availability
              </h3>
              <p className="text-sm text-slate-600">
                Weekdays 9am–7pm AEST. Most calls are scheduled within 48 hours of your request.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-semibold text-amber-800 mb-2 text-sm">Important</h3>
              <p className="text-xs text-amber-700">
                This is a general strategy discussion, not financial advice. For specific 
                financial, legal, or tax advice, you will need to consult the relevant 
                licensed professional.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
