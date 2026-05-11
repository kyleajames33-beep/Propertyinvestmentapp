import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { storage } from '@/lib/storage';
import { showToast } from '@/lib/toast';

interface ContentFeedbackProps {
  pageId: string;
  pageType: 'journey' | 'reference' | 'calculator' | 'tool';
}

export function ContentFeedback({ pageId, pageType }: ContentFeedbackProps) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const storageKey = `feedback_${pageType}_${pageId}`;

  useEffect(() => {
    const saved = storage.get<'up' | 'down' | null>(storageKey, null);
    if (saved) setFeedback(saved);
  }, [storageKey]);

  const handleFeedback = (type: 'up' | 'down') => {
    if (feedback === type) {
      // Toggle off
      storage.remove(storageKey);
      setFeedback(null);
      return;
    }
    storage.set(storageKey, type);
    setFeedback(type);
    if (type === 'up') {
      showToast.success('Thanks for the feedback!');
    }
  };

  return (
    <div className="flex items-center gap-3 py-4 border-t mt-8">
      <span className="text-sm text-muted-foreground">Was this helpful?</span>
      <button
        onClick={() => handleFeedback('up')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          feedback === 'up'
            ? 'bg-primary/10 text-primary'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
        aria-label="This was helpful"
        aria-pressed={feedback === 'up'}
      >
        <ThumbsUp className="h-4 w-4" />
        Yes
      </button>
      <button
        onClick={() => handleFeedback('down')}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          feedback === 'down'
            ? 'bg-destructive/10 text-destructive'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
        aria-label="This was not helpful"
        aria-pressed={feedback === 'down'}
      >
        <ThumbsDown className="h-4 w-4" />
        No
      </button>
    </div>
  );
}
