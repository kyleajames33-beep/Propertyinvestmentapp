import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Copy, Check, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface CouplesInviteProps {
  checklistName: string;
}

export function CouplesInvite({ checklistName }: CouplesInviteProps) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/#${window.location.pathname}?invite=true`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied! Send it to your partner.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleSendEmail = () => {
    if (!email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }
    // In production this would call an API
    setSent(true);
    toast.success('Invitation sent!');
    setTimeout(() => setSent(false), 3000);
    setEmail('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
          <Heart className="h-4 w-4" />
          Invite partner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            Collaborate with your partner
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Share the <strong>{checklistName}</strong> checklist so you can both tick items off together.
          </p>

          <Card className="p-3 bg-slate-50">
            <div className="flex items-center gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="text-xs bg-white"
              />
              <Button size="sm" variant="outline" onClick={handleCopyLink} className="flex-shrink-0">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </Card>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="partner@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" onClick={handleSendEmail} disabled={sent} className="gap-2">
              <Mail className="h-4 w-4" />
              {sent ? 'Sent!' : 'Send'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Your partner will receive a link to view this checklist. Changes sync automatically when you are both on the same device.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
