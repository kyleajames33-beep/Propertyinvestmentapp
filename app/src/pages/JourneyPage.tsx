import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { storage } from '@/lib/storage';
import type { JourneyProgress } from '@/lib/storage';

import { NewBadgeToast } from '@/components/BadgePanel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HSCJourneyContent } from '@/components/HSCJourneyContent';
import { JourneyCheckpoints } from '@/components/JourneyCheckpoints';
import { JourneyEmbeds } from '@/components/JourneyEmbeds';
import { ReferralCTA } from '@/components/ReferralCTA';
import { StickyHelpBar } from '@/components/StickyHelpBar';
import { EmailCapture } from '@/components/EmailCapture';
import {
  stageOrder, stageSlugs,
  personaLabels, personaColors, stageTitles, stageDescriptions
} from '@/content/metadata';
import { getJourneyContent } from '@/content/loader';
import type { ParsedContent } from '@/content/parser';
import type { Persona } from '@/types/content';
import {
  ChevronLeft, ChevronRight, Home, TrendingUp, Building2, Minimize2,
  CheckCircle, AlertTriangle, Clock, List, ChevronDown, ChevronUp
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { trackEvent } from '@/lib/analytics';
import { ContentFeedback } from '@/components/ContentFeedback';
import { extractHeadings, type TocItem } from '@/lib/toc';
import { StageQuiz } from '@/components/StageQuiz';
import { stageQuizzes } from '@/lib/stageQuizzes';
import { PropertyDiary } from '@/components/PropertyDiary';
import { BookmarkButton } from '@/components/BookmarkButton';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ShareStageCompletion } from '@/components/ShareStageCompletion';

const slugToStageId = Object.fromEntries(
  Object.entries(stageSlugs).map(([k, v]) => [v, k])
);

const personaIcons: Record<Persona, React.ReactNode> = {
  'fhb-oo': <Home className="h-4 w-4" />,
  'inv-new': <TrendingUp className="h-4 w-4" />,
  'inv-exp': <Building2 className="h-4 w-4" />,
  'downsizer': <Minimize2 className="h-4 w-4" />,
};

export function JourneyPage() {
  const { stageSlug } = useParams<{ stageSlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPersona = searchParams.get('persona') as Persona | null;
  const [selectedPersona, setSelectedPersona] = useState<Persona>(urlPersona || 'fhb-oo');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  useEffect(() => {
    if (urlPersona && ['fhb-oo', 'inv-new', 'inv-exp', 'downsizer'].includes(urlPersona)) {
      setSelectedPersona(urlPersona);
    }
  }, [urlPersona]);

  const handlePersonaChange = (p: Persona) => {
    setSelectedPersona(p);
    const params = new URLSearchParams(searchParams);
    params.set('persona', p);
    setSearchParams(params);
  };

  // If no stage slug, show the journey overview
  if (!stageSlug) {
    return (
      <>
        <SEO title="Property Buying Journey — PropertyPath" description="Follow our 8-stage property buying journey tailored to first home buyers, investors, and downsizers in NSW." />
        <JourneyOverview selectedPersona={selectedPersona} onPersonaChange={handlePersonaChange} />
      </>
    );
  }

  const stageId = slugToStageId[stageSlug];
  const currentStageIdx = stageOrder.indexOf(stageId);
  const stageNumber = currentStageIdx + 1;
  const stageTitle = stageId ? stageTitles[stageId] || stageId.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

  const [content, setContent] = useState<ParsedContent | null>(null);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    if (stageId) {
      setContentLoading(true);
      getJourneyContent(stageId, selectedPersona).then(data => {
        setContent(data);
        setContentLoading(false);
      });
    } else {
      setContent(null);
    }
  }, [stageId, selectedPersona]);

  const readingTime = useMemo(() => {
    if (!content?.body) return 0;
    const wordCount = content.body.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(wordCount / 200));
  }, [content?.body]);

  const tocItems = useMemo(() => {
    if (!content?.body) return [];
    return extractHeadings(content.body);
  }, [content?.body]);

  // Track progress
  useEffect(() => {
    if (stageId) {
      const progress = storage.get<JourneyProgress>('journey_progress', {});
      const visited = new Set(progress.completedStages || []);
      visited.add(stageId);
      storage.set('journey_progress', {
        ...progress,
        lastStageSlug: stageSlug,
        lastStageTitle: stageTitle,
        completedStages: Array.from(visited),
      });
      trackEvent('stage_viewed', { stageId });
    }
  }, [stageId, stageSlug, stageTitle]);

  const prevStage = currentStageIdx > 0 ? stageOrder[currentStageIdx - 1] : null;
  const nextStage = currentStageIdx < stageOrder.length - 1 ? stageOrder[currentStageIdx + 1] : null;
  const prevSlug = prevStage ? stageSlugs[prevStage] : null;
  const nextSlug = nextStage ? stageSlugs[nextStage] : null;

  if (contentLoading) {
    return (
      <div className="pp-container py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-full animate-pulse" />
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-muted rounded w-4/5 animate-pulse" />
          <div className="h-32 bg-muted rounded w-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title={`${stageTitle} — PropertyPath Journey`} description={`Stage ${stageNumber} of 8: ${stageTitle}. Learn about buying property in NSW with calculators, checklists, and guides.`} />
      <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 border-r bg-muted/20 flex-shrink-0 overflow-y-auto sticky top-14 h-[calc(100vh-3.5rem)]">
        <SidebarContent
          selectedPersona={selectedPersona}
          onPersonaChange={handlePersonaChange}
          currentStageId={stageId}
        />
      </aside>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)}>
          <div className="absolute left-0 top-14 bottom-0 w-80 bg-background border-r overflow-y-auto" onClick={e => e.stopPropagation()}>
            <SidebarContent
              selectedPersona={selectedPersona}
              onPersonaChange={handlePersonaChange}
              currentStageId={stageId}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      {newBadge && <NewBadgeToast badgeId={newBadge} onDismiss={() => setNewBadge(null)} />}
      <div className="flex-1 min-w-0 pp-page-soft">
        {/* Mobile persona + sidebar toggle */}
        <div className="lg:hidden pp-container py-3 border-b bg-background">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Button variant="outline" size="sm" onClick={() => setMobileSidebarOpen(true)}>
              Stages
            </Button>
            {(['fhb-oo', 'inv-new', 'inv-exp', 'downsizer'] as Persona[]).map(p => (
              <Button
                key={p}
                size="sm"
                variant={selectedPersona === p ? 'default' : 'outline'}
                onClick={() => handlePersonaChange(p)}
                className="whitespace-nowrap"
              >
                {personaIcons[p]}
                <span className="ml-1.5">{personaLabels[p]}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="flex max-w-7xl mx-auto">
          <div className="flex-1 min-w-0">
            <div className="pp-container-narrow py-8">
              {/* Mobile TOC */}
              {tocItems.length > 0 && (
                <div className="lg:hidden mb-6">
                  <TocAccordion items={tocItems} />
                </div>
              )}

              {/* Stage Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    Stage {stageNumber} of 8
                  </Badge>
                  <Badge className={`text-xs ${personaColors[selectedPersona]}`}>
                    {personaLabels[selectedPersona]}
                  </Badge>
                  {readingTime > 0 && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {readingTime} min read
                    </span>
                  )}
                  {content?.frontmatter?.last_reviewed && (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Updated {String(content.frontmatter.last_reviewed)}
                    </Badge>
                  )}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {String(content?.frontmatter?.title || stageTitle)}
                  </h1>
                  <BookmarkButton
                    bookmark={{
                      id: `stage-${stageId}`,
                      type: 'stage',
                      title: String(content?.frontmatter?.title || stageTitle),
                      url: `/journey/${stageSlug}?persona=${selectedPersona}`,
                    }}
                  />
                </div>
                {content?.frontmatter?.description && (
                  <p className="text-lg text-muted-foreground mt-2">
                    {String(content.frontmatter.description)}
                  </p>
                )}
              </div>

              {/* Disclaimer Banner */}
              <Card className="mb-8 border-amber-200 bg-amber-50/50">
                <div className="p-4 flex gap-3 items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">This content is for educational purposes only.</p>
                    <p className="mt-1">
                      It does not constitute financial, legal, or tax advice. 
                      Every property purchase is different. You should seek independent professional advice 
                      tailored to your circumstances before making any property decisions.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Content */}
              {content?.body ? (
                <>
                  <JourneyCheckpoints
                    content={content.body}
                    tocItems={tocItems}
                    stageId={stageId || ''}
                    stageSlug={stageSlug || ''}
                    persona={selectedPersona}
                  />

              {/* Sources */}
              {content.frontmatter?.sources && (
                <div className="mt-10 pt-6 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">Sources</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {(content.frontmatter.sources as string[]).map((src: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 mt-1 flex-shrink-0" />
                        {src}
                      </li>
                    ))}
                  </ul>
                  {content.frontmatter?.last_reviewed && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Last reviewed: {String(content.frontmatter.last_reviewed)}
                    </p>
                  )}
                </div>
              )}

              {/* Interactive Calculators & Diagrams */}
              {stageId && <JourneyEmbeds stageId={stageId} persona={selectedPersona} />}

              {/* Referral CTAs */}
              <ReferralCTA stageId={stageId || ''} persona={selectedPersona} />

              {/* Stage Quiz */}
              {stageId && stageQuizzes[stageId] && (
                <StageQuiz stageId={stageId} questions={stageQuizzes[stageId]} />
              )}

              {/* Property Diary */}
              {stageId && <PropertyDiary stageId={stageId} />}

              {/* Share Stage Completion */}
              {stageId && (
                <div className="mt-8">
                  <ShareStageCompletion
                    stageNumber={stageOrder.indexOf(stageId) + 1}
                    stageTitle={stageTitles[stageId] || stageId}
                  />
                </div>
              )}

              {/* Email capture */}
              <div className="mt-10">
                <EmailCapture variant="default" />
              </div>

              {/* Sticky help bar */}
              <StickyHelpBar persona={selectedPersona} />

              {/* General Disclaimer */}
              <Card className="mt-10 border-primary/10 bg-primary/5">
                <div className="p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">General information disclaimer</p>
                  <p>
                    The content on this page is general in nature and does not take into account your personal circumstances, 
                    financial situation, or objectives. Before acting on any information, you should consider whether it is 
                    appropriate for your situation and seek independent professional advice. PropertyPath receives referral 
                    fees from professionals we introduce. This does not influence our content or recommendations.
                  </p>
                </div>
              </Card>
            </>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              <p>Content not found for this stage and persona.</p>
              <Button asChild className="mt-4">
                <Link to="/journey">View all stages</Link>
              </Button>
            </div>
          )}

              <ContentFeedback pageId={stageSlug || 'overview'} pageType="journey" />

              {/* Navigation */}
              <div className="mt-12 pt-8 border-t flex items-center justify-between">
                {prevSlug ? (
                  <Button variant="outline" asChild>
                    <Link to={`/journey/${prevSlug}?persona=${selectedPersona}`}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous stage
                    </Link>
                  </Button>
                ) : <div />}
                {nextSlug && (
                  <Button asChild>
                    <Link to={`/journey/${nextSlug}?persona=${selectedPersona}`}>
                      Next stage
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Desktop TOC Sidebar */}
          {tocItems.length > 0 && (
            <aside className="hidden lg:block w-60 flex-shrink-0 border-l bg-muted/20 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
              <TocSidebar items={tocItems} />
            </aside>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

function JourneyOverview({ selectedPersona, onPersonaChange }: {
  selectedPersona: Persona;
  onPersonaChange: (p: Persona) => void;
}) {
  const [visitedStages, setVisitedStages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const progress = storage.get<JourneyProgress>('journey_progress', {});
    setVisitedStages(new Set(progress.completedStages || []));
  }, []);

  return (
    <div className="pp-container py-12">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Your property journey</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Eight stages from first thought to final settlement. Select your buyer type and start exploring.
            </p>
          </div>
        </ScrollReveal>

        {/* Persona selector */}
        <div className="flex justify-center gap-3 mb-10">
          {(['fhb-oo', 'inv-new', 'inv-exp', 'downsizer'] as Persona[]).map(p => (
            <Button
              key={p}
              variant={selectedPersona === p ? 'default' : 'outline'}
              onClick={() => onPersonaChange(p)}
              className="gap-2"
            >
              {personaIcons[p]}
              {personaLabels[p]}
            </Button>
          ))}
        </div>

        {/* Stage list */}
        <div className="space-y-4">
          {stageOrder.map((stageId, idx) => {
            const slug = stageSlugs[stageId];
            const title = stageTitles[stageId] || stageId.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            const description = stageDescriptions[stageId] || '';
            const isVisited = visitedStages.has(stageId);

            return (
              <ScrollReveal key={stageId} delay={idx * 60}>
              <Link
                to={`/journey/${slug}?persona=${selectedPersona}`}
                className="flex items-start gap-4 p-5 rounded-lg border hover:shadow-md hover:border-primary/20 transition-all group block"
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  isVisited ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary'
                }`}>
                  {isVisited ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    {isVisited && (
                      <Badge variant="secondary" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                        Visited
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-2" />
              </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ selectedPersona, onPersonaChange, currentStageId }: {
  selectedPersona: Persona;
  onPersonaChange: (p: Persona) => void;
  currentStageId: string;
}) {
  const [visitedStages, setVisitedStages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const progress = storage.get<JourneyProgress>('journey_progress', {});
    setVisitedStages(new Set(progress.completedStages || []));
  }, [currentStageId]);

  return (
    <div className="p-4">
      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3 px-2">
        Your Profile
      </h2>
      <div className="space-y-1 mb-6">
        {(['fhb-oo', 'inv-new', 'inv-exp', 'downsizer'] as Persona[]).map(p => (
          <button
            key={p}
            onClick={() => onPersonaChange(p)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPersona === p
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {personaIcons[p]}
            {personaLabels[p]}
          </button>
        ))}
      </div>

      <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-3 px-2">
        Journey Stages
      </h2>
      <nav className="space-y-0.5">
        {stageOrder.map((stageId, idx) => {
          const slug = stageSlugs[stageId];
          const title = stageTitles[stageId] || stageId.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          const isActive = stageId === currentStageId;
          const isVisited = visitedStages.has(stageId);

          return (
            <Link
              key={stageId}
              to={`/journey/${slug}?persona=${selectedPersona}`}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                isActive ? 'bg-primary text-white' : isVisited ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'
              }`}>
                {isVisited && !isActive ? <CheckCircle className="h-3 w-3" /> : idx + 1}
              </span>
              <span className="truncate">{title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function TocAccordion({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  if (items.length === 0) return null;
  return (
    <div className="border rounded-lg bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium"
      >
        <span className="flex items-center gap-2">
          <List className="h-4 w-4" />
          Table of Contents
        </span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <div className="px-4 pb-3 border-t pt-2">
          <TocList items={items} />
        </div>
      )}
    </div>
  );
}

function TocSidebar({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
        On this page
      </h3>
      <TocList items={items} />
    </div>
  );
}

function TocList({ items }: { items: TocItem[] }) {
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleClick(item.id)}
          className={`block w-full text-left text-sm transition-colors hover:text-primary ${
            item.level === 2
              ? 'font-medium text-foreground'
              : 'pl-3 text-muted-foreground'
          }`}
        >
          {item.text}
        </button>
      ))}
    </nav>
  );
}
