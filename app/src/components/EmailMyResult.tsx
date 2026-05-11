import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { submitToForm, BASIN_ENDPOINT } from '@/lib/forms';
import { showToast } from '@/lib/toast';

interface EmailMyResultProps {
  calculatorName: string;
  resultText: string;
}

export function EmailMyResult({ calculatorName, resultText }: EmailMyResultProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const success = await submitToForm(BASIN_ENDPOINT, {
      email,
      calculator_name: calculatorName,
      result: resultText,
      form_name: 'email_my_result',
    });
    setSubmitting(false);
    if (success || import.meta.env.DEV) {
      setSubmitted(true);
      showToast.success('Result emailed', 'Check your inbox shortly.');
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Mail className="h-3.5 w-3.5" />
        Email my result
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Email my result</DialogTitle>
          </DialogHeader>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                We will send your {calculatorName} result to your inbox so you can reference it later.
              </p>
              <div className="rounded-xl border bg-slate-50 p-3 text-sm text-slate-700">
                {resultText}
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="w-full gap-1.5" disabled={submitting}>
                <Send className="h-4 w-4" />
                {submitting ? 'Sending...' : 'Send to my inbox'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-medium">On its way!</p>
              <p className="text-sm text-muted-foreground">Check your inbox for the result.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
