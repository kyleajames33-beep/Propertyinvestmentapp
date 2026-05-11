import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Award, X, Footprints, Map, Trophy, Calculator, BarChart3, CheckSquare, ClipboardCheck, User, Share2, Handshake, BookOpen, Home } from 'lucide-react';
import { BADGES, getEarnedBadges } from '@/lib/badges';

const iconMap: Record<string, React.ReactNode> = {
  Footprints: <Footprints className="h-5 w-5" />,
  Map: <Map className="h-5 w-5" />,
  Trophy: <Trophy className="h-5 w-5" />,
  Calculator: <Calculator className="h-5 w-5" />,
  BarChart3: <BarChart3 className="h-5 w-5" />,
  CheckSquare: <CheckSquare className="h-5 w-5" />,
  ClipboardCheck: <ClipboardCheck className="h-5 w-5" />,
  User: <User className="h-5 w-5" />,
  Share2: <Share2 className="h-5 w-5" />,
  Handshake: <Handshake className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  Home: <Home className="h-5 w-5" />,
};

export function BadgePanel() {
  const [earned, setEarned] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setEarned(getEarnedBadges());
  }, [open]);

  const earnedCount = earned.length;
  const totalCount = BADGES.length;
  const nextBadges = BADGES.filter(b => !earned.includes(b.id)).slice(0, 3);

  if (earnedCount === 0 && !open) {
    return (
      <Card className="p-5 border-dashed border-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <Award className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Start your journey to earn badges</p>
            <p className="text-xs text-muted-foreground">Visit stages, use calculators, and complete checklists.</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>View all</Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Your badges</h3>
            <Badge variant="secondary" className="text-xs">{earnedCount}/{totalCount}</Badge>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>See all</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {BADGES.filter(b => earned.includes(b.id)).map(badge => (
            <div
              key={badge.id}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white ${badge.color}`}
              title={badge.description}
            >
              {iconMap[badge.icon] || <Award className="h-3.5 w-3.5" />}
              {badge.name}
            </div>
          ))}
        </div>

        {nextBadges.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">Next up</p>
            <div className="flex flex-wrap gap-2">
              {nextBadges.map(badge => (
                <div
                  key={badge.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground opacity-70"
                  title={badge.description}
                >
                  {iconMap[badge.icon] || <Award className="h-3.5 w-3.5" />}
                  {badge.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Badges ({earnedCount}/{totalCount})
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {BADGES.map(badge => {
              const isEarned = earned.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-opacity ${
                    isEarned ? 'bg-white' : 'bg-muted/30 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 ${
                    isEarned ? badge.color : 'bg-slate-300'
                  }`}>
                    {iconMap[badge.icon] || <Award className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isEarned ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {badge.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function NewBadgeToast({ badgeId, onDismiss }: { badgeId: string; onDismiss: () => void }) {
  const badge = BADGES.find(b => b.id === badgeId);
  if (!badge) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[90] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <Card className="p-4 shadow-xl border-primary/20 bg-white max-w-xs">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0 ${badge.color}`}>
            {iconMap[badge.icon] || <Award className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Badge earned!</p>
            <p className="text-sm font-medium">{badge.name}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
          </div>
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </div>
  );
}
