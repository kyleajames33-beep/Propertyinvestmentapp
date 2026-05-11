import { useState, useRef } from 'react';
import { trackActivity } from '@/lib/badges';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Share2, Link2, Image as ImageIcon } from 'lucide-react';
import { showToast } from '@/lib/toast';
import html2canvas from 'html2canvas';

interface ShareResultProps {
  title: string;
  lines: { label: string; value: string }[];
}

export function ShareResult({ title, lines }: ShareResultProps) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const text = `${title}\n\n${lines.map(l => `${l.label}: ${l.value}`).join('\n')}\n\nCalculated with PropertyPath — NSW Property Guidance`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      showToast.copy(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast.copy(text);
    }
  };

  const handleShare = async () => {
    trackActivity('share');
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch {}
    }
    setOpen(true);
  };

  const generateImage = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `propertypath-${title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast.success('Image downloaded');
    } catch {
      showToast.error('Failed to generate image');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={handleShare}>
        <Share2 className="h-3.5 w-3.5" />
        Share result
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Share your result</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div ref={cardRef} className="rounded-xl border bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Share2 className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="font-bold text-sm">PropertyPath</span>
              </div>
              <p className="font-semibold text-lg">{title}</p>
              {lines.map((l, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-300">{l.label}</span>
                  <span className="font-semibold">{l.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/10 text-[10px] text-slate-400">
                propertypath.com.au — NSW Property Guidance
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleCopy} variant="outline" className="w-full gap-1.5">
                <Link2 className="h-4 w-4" />
                Copy text
              </Button>
              <Button onClick={generateImage} disabled={generating} className="w-full gap-1.5">
                <ImageIcon className="h-4 w-4" />
                {generating ? 'Creating...' : 'Save image'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
