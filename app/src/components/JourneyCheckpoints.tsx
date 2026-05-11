import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from './ScrollReveal';
import { HSCJourneyContent } from './HSCJourneyContent';
import {
  completeCheckpoint,
  isCheckpointComplete,
  getCheckpointProgress,
  getCheckpointPct,
} from '@/lib/checkpoints';
import {
  Lock, CheckCircle2, ArrowDown, Calculator, ArrowRight,
} from 'lucide-react';
import type { TocItem } from '@/lib/toc';

interface Props {
  content: string;
  tocItems?: TocItem[];
  stageId: string;
  stageSlug: string;
  persona: string;
}

/* ── Which calculators belong to which section keywords ── */
const CALCULATOR_PROMPTS: Array<{ keywords: string[]; title: string; description: string; link: string }> = [
  { keywords: ['deposit', 'saving', 'goal'], title: 'Deposit Goal Calculator', description: 'Work out exactly how much you need to save and by when.', link: '/calculators?c=deposit-goal' },
  { keywords: ['borrow', 'capacity', 'serviceability', 'pre-approval'], title: 'Borrowing Power Calculator', description: 'See how much a bank will lend you based on your income.', link: '/calculators?c=borrowing-power' },
  { keywords: ['stamp duty', 'transfer duty', 'tax'], title: 'Stamp Duty Calculator', description: 'Calculate NSW stamp duty and check if you qualify for exemptions.', link: '/calculators?c=stamp-duty' },
  { keywords: ['repayment', 'mortgage', 'interest rate', 'monthly'], title: 'Mortgage Repayment Calculator', description: 'See what your monthly repayments look like at different rates.', link: '/calculators?c=mortgage-repayment' },
  { keywords: ['rent', 'yield', 'cashflow', 'investment'], title: 'Investment Cashflow Calculator', description: 'Work out if an investment property will be positively or negatively geared.', link: '/calculators?c=investment-cashflow' },
  { keywords: ['equity', 'refinance', 'portfolio'], title: 'Equity Release Calculator', description: 'See how much equity you can access from existing properties.', link: '/calculators?c=equity-release' },
  { keywords: ['offset', 'redraw', 'interest saving'], title: 'Offset vs Redraw Calculator', description: 'Compare how much interest you save with an offset account.', link: '/calculators?c=offset-vs-redraw' },
  { keywords: ['comparison rate', 'fees', 'lender'], title: 'Comparison Rate Calculator', description: 'See the true cost of a loan including fees.', link: '/calculators?c=comparison-rate' },
];

function findCalculatorPrompt(sectionTitle: string): typeof CALCULATOR_PROMPTS[0] | null {
  const lower = sectionTitle.toLowerCase();
  return CALCULATOR_PROMPTS.find(c => c.keywords.some(k => lower.includes(k))) || null;
}

/* ── Section parser (same as HSCJourneyContent) ── */
function splitSections(content: string): Array<{ title: string; body: string; num: number }> {
  const sections: Array<{ title: string; body: string; num: number }> = [];
  const lines = content.split('\n');
  let currentTitle = '', currentBody: string[] = [], sectionNum = 0, inFrontmatter = false;
  for (const line of lines) {
    if (line.trim() === '---') { inFrontmatter = !inFrontmatter; continue; }
    if (inFrontmatter) continue;
    if (line.startsWith('## ')) {
      if (currentTitle || currentBody.length > 0) sections.push({ title: currentTitle, body: currentBody.join('\n'), num: sectionNum });
      sectionNum++; currentTitle = line.slice(3).trim(); currentBody = [];
    } else { currentBody.push(line); }
  }
  if (currentTitle || currentBody.length > 0) sections.push({ title: currentTitle, body: currentBody.join('\n'), num: sectionNum });
  return sections;
}

export function JourneyCheckpoints({ content, stageId, stageSlug, persona }: Props) {
  const sections = splitSections(content);
  const [completed, setCompleted] = useState<Set<string>>(new Set(getCheckpointProgress(stageId)));
  const [revealed, setRevealed] = useState<number>(() => {
    const prog = getCheckpointProgress(stageId);
    // Reveal up to the first incomplete section + 1
    for (let i = 0; i < sections.length; i++) {
      if (!prog.includes(sections[i].title)) return Math.min(i + 1, sections.length);
    }
    return sections.length;
  });

  const pct = getCheckpointPct(stageId, sections.length);

  const handleComplete = useCallback((title: string) => {
    completeCheckpoint(stageId, title);
    setCompleted(prev => new Set([...prev, title]));
    setRevealed(prev => Math.min(prev + 1, sections.length));
  }, [stageId, sections.length]);

  return (
    <div className="space-y-6">
      {/* Section progress */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
          {completed.size} of {sections.length} sections
        </span>
      </div>

      {/* Checkpoint steps */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-5 top-8 bottom-8 w-0.5 bg-muted hidden md:block" />

        {sections.map((section, idx) => {
          const isDone = completed.has(section.title);
          const isRevealed = idx < revealed;
          const isActive = isRevealed && !isDone;
          const isLocked = !isRevealed;
          const calcPrompt = findCalculatorPrompt(section.title);

          return (
            <ScrollReveal key={idx} delay={idx * 50}>
              <div className={`relative pl-0 md:pl-12 pb-8 ${isLocked ? 'opacity-50' : ''}`}>
                {/* Step indicator */}
                <div className={`hidden md:flex absolute left-0 top-0 w-10 h-10 rounded-full items-center justify-center text-sm font-bold border-2 z-10 ${
                  isDone
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700'
                    : isActive
                    ? 'bg-primary border-primary text-white'
                    : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                }`}>
                  {isDone ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                </div>

                {/* Content card */}
                <Card className={`overflow-hidden transition-all ${
                  isActive ? 'ring-1 ring-primary/20 shadow-md' : ''
                } ${isLocked ? 'grayscale' : ''}`}>
                  {/* Section header */}
                  <div className={`px-5 py-3 border-b flex items-center justify-between ${
                    isDone ? 'bg-emerald-50/50' : isActive ? 'bg-primary/5' : 'bg-muted/30'
                  }`}>
                    <div className="flex items-center gap-2">
                      {isDone && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                      <h2 className="font-semibold text-base">{section.title}</h2>
                    </div>
                    {isDone && (
                      <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                        Completed
                      </Badge>
                    )}
                  </div>

                  {/* Section body */}
                  <div className={`px-5 py-5 ${isLocked ? 'max-h-32 overflow-hidden' : ''}`}>
                    {isLocked ? (
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-4 bg-muted rounded w-1/2" />
                        <p className="text-xs text-muted-foreground mt-4">Complete the previous section to unlock</p>
                      </div>
                    ) : (
                      <>
                        <HSCJourneyContent content={`## ${section.title}\n${section.body}`} />

                        {/* Inline calculator prompt */}
                        {calcPrompt && (
                          <Card className="mt-6 p-4 border-primary/20 bg-primary/[0.02]">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Calculator className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm">{calcPrompt.title}</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">{calcPrompt.description}</p>
                                <Button size="sm" variant="link" asChild className="h-auto p-0 mt-1 text-xs">
                                  <a href={`/#${calcPrompt.link}`} target="_blank" rel="noopener noreferrer">
                                    Try the calculator <ArrowRight className="ml-1 h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </Card>
                        )}

                        {/* Complete button */}
                        {!isDone && (
                          <div className="mt-6 flex justify-center">
                            <Button
                              onClick={() => handleComplete(section.title)}
                              className="gap-2"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                              Mark section complete
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Stage completion celebration */}
      {completed.size === sections.length && sections.length > 0 && (
        <ScrollReveal>
          <Card className="p-6 text-center border-emerald-200 bg-emerald-50/50">
            <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-emerald-800">Stage complete!</h3>
            <p className="text-sm text-emerald-700 mt-1">
              You have finished all sections. Ready to move to the next stage?
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" asChild>
                <a href="#/journey">Back to journey</a>
              </Button>
              <Button asChild>
                <a href={`#/journey/${getNextStageSlug(stageSlug)}?persona=${persona}`}>
                  Next stage <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </div>
          </Card>
        </ScrollReveal>
      )}
    </div>
  );
}

function getNextStageSlug(current: string): string {
  const order = ['strategy', 'finance-prep', 'market-research', 'shortlisting', 'inspection-due-diligence', 'offer-negotiation', 'contract-review', 'settlement'];
  const idx = order.indexOf(current);
  return order[idx + 1] || order[0];
}
