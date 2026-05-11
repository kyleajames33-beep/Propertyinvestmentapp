import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Share2, Download, CheckCircle2, X } from 'lucide-react';
import { trackActivity } from '@/lib/badges';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface ShareStageCompletionProps {
  stageNumber: number;
  stageTitle: string;
  onClose?: () => void;
}

export function ShareStageCompletion({ stageNumber, stageTitle, onClose }: ShareStageCompletionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const cardId = `stage-completion-${stageNumber}`;

  const handleShareText = async () => {
    const text = `I just completed Stage ${stageNumber}: ${stageTitle} on PropertyPath! 🏡\n\n8 stages to property confidence. Join me: ${window.location.origin}/#/journey`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'PropertyPath Progress', text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard!');
      }
      trackActivity('share');
    } catch {
      // User cancelled
    }
  };

  const handleDownloadImage = async () => {
    const card = document.getElementById(cardId);
    if (!card) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(card, { backgroundColor: '#ffffff', scale: 2 });
      const link = document.createElement('a');
      link.download = `propertypath-stage-${stageNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      trackActivity('share');
      toast.success('Image saved!');
    } catch {
      toast.error('Could not generate image');
    }
    setIsGenerating(false);
  };

  return (
    <Card className="p-6 relative overflow-hidden">
      {onClose && (
        <button onClick={onClose} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Hidden card for image generation */}
      <div id={cardId} className="bg-gradient-to-br from-[#1a2e35] to-[#2d4a3e] text-white p-8 rounded-xl mb-4 text-center">
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <p className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-1">Stage Complete</p>
        <h3 className="text-2xl font-bold mb-2">Stage {stageNumber}</h3>
        <p className="text-white/80 text-lg mb-4">{stageTitle}</p>
        <div className="flex items-center justify-center gap-1 mb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`h-2 w-6 rounded-full ${i < stageNumber ? 'bg-emerald-400' : 'bg-white/20'}`} />
          ))}
        </div>
        <p className="text-white/60 text-xs">PropertyPath — 8 stages to property confidence</p>
      </div>

      <div className="flex gap-2 justify-center">
        <Button size="sm" variant="outline" onClick={handleShareText} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button size="sm" variant="outline" onClick={handleDownloadImage} disabled={isGenerating} className="gap-2">
          <Download className="h-4 w-4" />
          {isGenerating ? 'Saving...' : 'Save Image'}
        </Button>
      </div>
    </Card>
  );
}
