import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Keyboard, Command, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Search, Home, Map, Calculator, BookOpen, Phone, HelpCircle } from 'lucide-react';

const shortcuts = [
  { keys: ['?'], description: 'Show this help', icon: <HelpCircle className="h-4 w-4" /> },
  { keys: ['/'], description: 'Open search', icon: <Search className="h-4 w-4" /> },
  { keys: ['g', 'h'], description: 'Go to Home', icon: <Home className="h-4 w-4" /> },
  { keys: ['g', 'j'], description: 'Go to Journey', icon: <Map className="h-4 w-4" /> },
  { keys: ['g', 'c'], description: 'Go to Calculators', icon: <Calculator className="h-4 w-4" /> },
  { keys: ['g', 'r'], description: 'Go to Reference', icon: <BookOpen className="h-4 w-4" /> },
  { keys: ['g', 'p'], description: 'Go to Professionals', icon: <Phone className="h-4 w-4" /> },
  { keys: ['Esc'], description: 'Close modals / go back', icon: <ArrowLeft className="h-4 w-4" /> },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const buffer: string[] = [];
    let timeout: ReturnType<typeof setTimeout>;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === '?') {
        e.preventDefault();
        setOpen(prev => !prev);
        buffer.length = 0;
        return;
      }

      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }

      buffer.push(e.key.toLowerCase());
      clearTimeout(timeout);
      timeout = setTimeout(() => { buffer.length = 0; }, 800);

      // Check for g + letter sequences
      if (buffer.length >= 2 && buffer[0] === 'g') {
        const second = buffer[1];
        const routes: Record<string, string> = {
          h: '/',
          j: '/journey',
          c: '/calculators',
          r: '/reference',
          p: '/professionals',
        };
        if (routes[second]) {
          e.preventDefault();
          window.location.hash = '#!' + routes[second];
          buffer.length = 0;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 mt-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {s.icon}
                {s.description}
              </div>
              <div className="flex gap-1">
                {s.keys.map((k, j) => (
                  <kbd key={j} className="px-1.5 py-0.5 text-xs font-mono bg-muted rounded border">
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press <kbd className="px-1 py-0.5 text-xs font-mono bg-muted rounded border">?</kbd> anywhere to toggle this dialog.
        </p>
      </DialogContent>
    </Dialog>
  );
}
