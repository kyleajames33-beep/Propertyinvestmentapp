import { useState, useEffect, useCallback } from 'react';
import { X, Mail, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { submitToForm, BASIN_ENDPOINT } from '@/lib/forms';

export function ExitIntentPopup() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [triggered, setTriggered] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY < 50 && !triggered && !localStorage.getItem('pp_exit_intent_dismissed')) {
      setShow(true);
      setTriggered(true);
    }
  }, [triggered]);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [handleMouseLeave]);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pp_exit_intent_dismissed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitToForm(BASIN_ENDPOINT, {
      email,
      form_name: 'exit_intent_email_capture',
    });
    if (success || import.meta.env.DEV) {
      setSubmitted(true);
      localStorage.setItem('pp_exit_intent_dismissed', 'true');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!submitted ? (
          <>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Before you go — grab your free NSW Property Toolkit
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Get our checklists, question scripts, and calculator results sent straight to your inbox. No spam, unsubscribe anytime.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <Button type="submit" size="sm" className="gap-1.5 whitespace-nowrap">
                  Send it
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                We respect your privacy. No spam, ever.
              </p>
            </form>
            <button
              onClick={handleDismiss}
              className="mt-3 w-full text-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              No thanks, I already know everything about NSW property
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mx-auto">
              <Mail className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">You are on the list!</h3>
            <p className="text-sm text-slate-500 mb-4">
              Check your inbox in a few minutes for your NSW Property Toolkit.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => { setShow(false); navigate('/toolkit'); }}
            >
              <Download className="h-3.5 w-3.5" />
              View toolkit page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
