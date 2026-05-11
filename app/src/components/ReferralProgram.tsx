import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gift, Link2, Share2, Users, CheckCircle, Award, TrendingUp } from 'lucide-react';
import { storage } from '@/lib/storage';
import { showToast } from '@/lib/toast';
import { submitToForm, BASIN_ENDPOINT } from '@/lib/forms';
import { trackActivity } from '@/lib/badges';

export function ReferralProgram({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shareCount, setShareCount] = useState(0);

  useEffect(() => {
    const count = storage.get<number>('referral_share_count', 0);
    setShareCount(count);
  }, [open]);

  const referralLink = typeof window !== 'undefined'
    ? `${window.location.origin}/#/welcome`
    : 'https://propertypath.com.au/#/welcome';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      showToast.copy(referralLink);
      incrementShareCount();
    } catch {
      const ta = document.createElement('textarea');
      ta.value = referralLink;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast.copy(referralLink);
      incrementShareCount();
    }
  };

  const incrementShareCount = () => {
    const newCount = shareCount + 1;
    setShareCount(newCount);
    storage.set('referral_share_count', newCount);
  };

  const handleShare = async () => {
    trackActivity('share');
    const text = 'I have been using PropertyPath to learn about buying property in NSW. Check it out:';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'PropertyPath', text, url: referralLink });
        incrementShareCount();
        return;
      } catch {}
    }
    handleCopy();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    const success = await submitToForm(BASIN_ENDPOINT, {
      email,
      form_name: 'referral_tracking',
    });
    setSubmitting(false);
    if (success || import.meta.env.DEV) {
      storage.set('referral_email', email);
      setSubmitted(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Share PropertyPath
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <p className="text-sm text-muted-foreground">
            Know someone buying property in NSW? Send them PropertyPath and help them buy with confidence. 
            Share with 3 friends and get a free 15-minute strategy call with a property expert.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border bg-slate-50 p-3 text-center">
              <Users className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold">{shareCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Shares</div>
            </div>
            <div className="rounded-xl border bg-slate-50 p-3 text-center">
              <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold">240+</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Buyers helped</div>
            </div>
            <div className="rounded-xl border bg-slate-50 p-3 text-center">
              <Award className="h-5 w-5 text-primary mx-auto mb-1" />
              <div className="text-lg font-bold">{shareCount >= 3 ? 'Unlocked' : 'Locked'}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Free strategy call</div>
            </div>
          </div>

          {/* Share link */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Your share link</Label>
            <div className="flex gap-2">
              <div className="flex-1 rounded-md border bg-slate-50 px-3 py-2 text-xs text-slate-600 truncate">
                {referralLink}
              </div>
              <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1">
                <Link2 className="h-3.5 w-3.5" />
                Copy
              </Button>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex gap-2">
            <Button onClick={handleShare} className="flex-1 gap-1.5">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Email capture for referrer */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t">
              <Label htmlFor="referrer-email" className="text-xs">Want to track your referrals?</Label>
              <div className="flex gap-2">
                <Input
                  id="referrer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={submitting}>{submitting ? '...' : 'Notify me'}</Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                We will let you know when your friends join. No spam.
              </p>
            </form>
          ) : (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-center">
              <CheckCircle className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-emerald-800">You are on the list!</p>
              <p className="text-xs text-emerald-600">We will notify you when friends join.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
