import { Link, useLocation } from 'react-router-dom';
import { stageOrder, stageSlugs, stageTitles } from '@/content/metadata';
import { storage } from '@/lib/storage';
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export function JourneyProgressBar() {
  const location = useLocation();
  const isJourneyPage = location.pathname.startsWith('/journey/');
  const [visitedStages, setVisitedStages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const progress = storage.get<{ completedStages?: string[] }>('journey_progress', {});
    setVisitedStages(new Set(progress.completedStages || []));
  }, [location.pathname]);

  if (!isJourneyPage) return null;

  const currentSlug = location.pathname.split('/journey/')[1]?.split('/')[0];
  const currentStageId = Object.entries(stageSlugs).find(([, s]) => s === currentSlug)?.[0];
  const currentIdx = currentStageId ? stageOrder.indexOf(currentStageId) : -1;

  return (
    <div className="sticky top-14 z-40 bg-background/95 backdrop-blur border-b">
      <div className="pp-container py-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {stageOrder.map((stageId, idx) => {
            const slug = stageSlugs[stageId];
            const title = stageTitles[stageId] || '';
            const isCurrent = idx === currentIdx;
            const isVisited = visitedStages.has(stageId);
            const isPast = idx < currentIdx;

            return (
              <Link
                key={stageId}
                to={`/journey/${slug}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isPast || isVisited
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  isCurrent ? 'bg-white text-primary' : isPast || isVisited ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {isPast || isVisited ? <CheckCircle className="h-3 w-3" /> : idx + 1}
                </span>
                <span className="hidden sm:inline">{title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
