import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Map, CheckCircle, Calculator, BookOpen, User, Sparkles } from 'lucide-react';
import { storage } from '@/lib/storage';
import type { Persona } from '@/types/content';
import { stageOrder, stageSlugs, stageTitles } from '@/content/metadata';

interface NextStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  to: string;
  priority: number;
}

export function SmartNextSteps() {
  const [steps, setSteps] = useState<NextStep[]>([]);

  useEffect(() => {
    const profile = storage.get<Record<string, unknown>>('property_profile', {});
    const progress = storage.get<{ completedStages?: string[] }>('journey_progress', {});
    const checked = storage.get<Record<string, boolean>>('checklist_checked', {});
    const usedCalcs = storage.get<string[]>('used_calculators', []);
    const visited = new Set(progress.completedStages || []);
    const checklistCount = Object.values(checked).filter(Boolean).length;

    const possibleSteps: NextStep[] = [];

    // Priority 1: No profile set
    if (!profile.buyerType) {
      possibleSteps.push({
        icon: <User className="h-5 w-5 text-blue-500" />,
        title: 'Set up your property profile',
        description: 'Tell us your budget, timeline, and goals. We will personalise every calculator and guide.',
        cta: 'Set up profile',
        to: '/',
        priority: 100,
      });
    }

    // Priority 2: No stages visited
    if (visited.size === 0) {
      possibleSteps.push({
        icon: <Map className="h-5 w-5 text-emerald-500" />,
        title: 'Start your property journey',
        description: 'Stage 1: Strategy covers deposit goals, borrowing power, and setting your direction.',
        cta: 'Begin Stage 1',
        to: '/journey/strategy',
        priority: 90,
      });
    }

    // Priority 3: Stage visited but no checklists
    if (visited.size > 0 && checklistCount === 0) {
      possibleSteps.push({
        icon: <CheckCircle className="h-5 w-5 text-violet-500" />,
        title: 'Complete your first checklist',
        description: 'Turn what you have learned into action. Our checklists save progress automatically.',
        cta: 'View checklists',
        to: '/checklists',
        priority: 85,
      });
    }

    // Priority 4: No calculators used
    if (usedCalcs.length === 0) {
      possibleSteps.push({
        icon: <Calculator className="h-5 w-5 text-amber-500" />,
        title: 'Run your first calculator',
        description: 'Try the Borrowing Power or Stamp Duty calculator to see real numbers for your situation.',
        cta: 'Try calculators',
        to: '/calculators',
        priority: 80,
      });
    }

    // Priority 5: Find next unvisited stage
    const nextStage = stageOrder.find(s => !visited.has(s));
    if (nextStage && visited.size > 0 && visited.size < 8) {
      const slug = stageSlugs[nextStage];
      const title = stageTitles[nextStage];
      possibleSteps.push({
        icon: <Map className="h-5 w-5 text-teal-500" />,
        title: `Continue to ${title}`,
        description: `You have explored ${visited.size} of 8 stages. Next up: ${title}.`,
        cta: `Start ${title}`,
        to: `/journey/${slug}`,
        priority: 70,
      });
    }

    // Priority 6: Read reference articles
    possibleSteps.push({
      icon: <BookOpen className="h-5 w-5 text-slate-500" />,
      title: 'Deep dive into reference guides',
      description: 'Stamp duty, grants, strata, inspections — authoritative guides you can trust.',
      cta: 'Browse references',
      to: '/reference',
      priority: 40,
    });

    // Priority 7: All stages visited — celebrate and connect
    if (visited.size >= 8) {
      possibleSteps.push({
        icon: <Sparkles className="h-5 w-5 text-amber-500" />,
        title: 'You have completed the journey!',
        description: 'Ready to talk to professionals? We will introduce you to vetted experts.',
        cta: 'Find professionals',
        to: '/professionals',
        priority: 95,
      });
    }

    // Sort by priority and take top 3
    const topSteps = possibleSteps.sort((a, b) => b.priority - a.priority).slice(0, 3);
    setSteps(topSteps);
  }, []);

  if (steps.length === 0) return null;

  return (
    <div className="space-y-3">
      {steps.map((step, i) => (
        <Card key={i} className="p-4 hover:shadow-md transition-shadow border-l-4 border-l-primary">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
              {step.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{step.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.description}</p>
              <Button size="sm" variant="link" asChild className="h-auto p-0 mt-1 text-xs">
                <Link to={step.to}>
                  {step.cta}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
