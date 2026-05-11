import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (installed || dismissed || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 z-50 md:max-w-sm md:left-auto md:right-4">
      <Card className="p-4 shadow-lg border-primary/20 bg-primary text-primary-foreground">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium">Install PropertyPath</p>
            <p className="text-xs opacity-90 mt-0.5">
              Add to your home screen for offline access to calculators and checklists.
            </p>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleInstall}
              className="mt-2 gap-1 text-xs h-7"
            >
              <Download className="h-3 w-3" />
              Install
            </Button>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-primary-foreground/70 hover:text-primary-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
