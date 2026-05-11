import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle, Calculator, BookOpen, User, ArrowRight, Award } from 'lucide-react';
import { storage } from '@/lib/storage';
import confetti from 'canvas-confetti';

interface ReadinessFactor {
  id: string;
  label: string;
  icon: React.ReactNode;
  max: number;
  getValue: () => number;
  cta: { label: string; to: string };
}

function getChecklistProgress(): number {
  const checked = storage.get<Record<string, boolean>>('checklist_checked', {});
  const total = Object.values(checked).filter(Boolean).length;
  return Math.min(total, 20); // cap at 20 for scoring
}

function getStageProgress(): number {
  const progress = storage.get<{ completedStages?: string[] }>('journey_progress', {});
  return (progress.completedStages || []).length;
}

function getCalculatorProgress(): number {
  const used = storage.get<string[]>('used_calculators', []);
  return used.length;
}

function getProfileProgress(): number {
  const profile = storage.get<Record<string, unknown>>('property_profile', {});
  let score = 0;
  if (profile.buyerType) score += 1;
  if (profile.targetSuburb) score += 1;
  if (profile.budgetMin || profile.budgetMax) score += 1;
  if (profile.depositSaved) score += 1;
  if (profile.timeline) score += 1;
  return score;
}

function getReferenceProgress(): number {
  const counts = storage.get<Record<string, number>>('activity_counts', {});
  return counts.reference_read || 0;
}

const factors: ReadinessFactor[] = [
  {
    id: 'profile',
    label: 'Profile complete',
    icon: <User className="h-4 w-4" />,
    max: 5,
    getValue: getProfileProgress,
    cta: { label: 'Set up profile', to: '/' },
  },
  {
    id: 'stages',
    label: 'Stages explored',
    icon: <BookOpen className="h-4 w-4" />,
    max: 8,
    getValue: getStageProgress,
    cta: { label: 'Explore stages', to: '/journey' },
  },
  {
    id: 'checklists',
    label: 'Checklist items done',
    icon: <CheckCircle className="h-4 w-4" />,
    max: 20,
    getValue: getChecklistProgress,
    cta: { label: 'View checklists', to: '/checklists' },
  },
  {
    id: 'calculators',
    label: 'Calculators used',
    icon: <Calculator className="h-4 w-4" />,
    max: 8,
    getValue: getCalculatorProgress,
    cta: { label: 'Try calculators', to: '/calculators' },
  },
  {
    id: 'research',
    label: 'Articles read',
    icon: <BookOpen className="h-4 w-4" />,
    max: 5,
    getValue: getReferenceProgress,
    cta: { label: 'Read references', to: '/reference' },
  },
];

function calculateScore(): { total: number; breakdown: Record<string, number> } {
  let total = 0;
  const breakdown: Record<string, number> = {};
  factors.forEach(f => {
    const val = f.getValue();
    const pct = Math.min(val / f.max, 1);
    const pts = Math.round(pct * 20); // each factor worth 20 pts
    total += pts;
    breakdown[f.id] = pts;
  });
  return { total: Math.min(total, 100), breakdown };
}

export function PropertyReadinessScore() {
  const [score, setScore] = useState(0);
  
  const [celebrated, setCelebrated] = useState(false);

  useEffect(() => {
    const { total } = calculateScore();
    setScore(total);
    
  }, []);

  useEffect(() => {
    if (score >= 80 && !celebrated) {
      setCelebrated(true);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#22c55e', '#4ade80', '#f59e0b', '#3b82f6'],
      });
    }
  }, [score, celebrated]);

  const getLabel = (s: number) => {
    if (s >= 80) return { text: 'Property Ready', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (s >= 50) return { text: 'Getting There', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { text: 'Just Starting', color: 'text-slate-700 bg-slate-50 border-slate-200' };
  };

  const label = getLabel(score);

  return (
    <Card className="p-5 border-2 border-primary/10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Target className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Your Property Readiness Score</h3>
          <p className="text-xs text-muted-foreground">Complete tasks to increase your score</p>
        </div>
        <div className={`ml-auto px-3 py-1 rounded-full text-xs font-bold border ${label.color}`}>
          {label.text}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className={score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-primary'}
              strokeDasharray={`${score}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{score}</span>
          </div>
        </div>
        <div className="flex-1">
          <Progress value={score} className="h-2.5 mb-1" />
          <p className="text-xs text-muted-foreground">
            {score >= 80 ? 'You are well prepared to buy with confidence.' :
             score >= 50 ? 'Keep going — you are building solid foundations.' :
             'Start with a profile and your first checklist to build momentum.'}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {factors.map(f => {
          const val = f.getValue();
          const pct = Math.min((val / f.max) * 100, 100);
          const isComplete = pct >= 100;
          return (
            <div key={f.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                {isComplete ? <CheckCircle className="h-4 w-4" /> : f.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="font-medium text-foreground">{f.label}</span>
                  <span className="text-muted-foreground">{val}/{f.max}</span>
                </div>
                <Progress value={pct} className="h-1.5" />
              </div>
              {!isComplete && (
                <Button size="sm" variant="ghost" asChild className="text-xs h-7 px-2">
                  <Link to={f.cta.to}>
                    {f.cta.label}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {score >= 80 && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center animate-in fade-in zoom-in-95">
          <Award className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
          <p className="text-sm font-semibold text-emerald-800">You are Property Ready!</p>
          <p className="text-xs text-emerald-600">You have done the homework. Time to talk to professionals with confidence.</p>
        </div>
      )}
    </Card>
  );
}


