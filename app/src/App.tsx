import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { OfflinePage } from '@/pages/OfflinePage';
import { pageView } from '@/lib/analytics';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PageTransition } from '@/components/PageTransition';
import { ScrollRestoration } from '@/components/ScrollRestoration';
import { PageSkeleton, CalculatorSkeleton } from '@/components/PageSkeleton';
import { Toaster } from '@/components/ui/sonner';
import { useEngagementTracking, useScrollMilestones } from '@/lib/engagement';

const JourneyPage = lazy(() => import('@/pages/JourneyPage').then(m => ({ default: m.JourneyPage })));
const ReferencePage = lazy(() => import('@/pages/ReferencePage').then(m => ({ default: m.ReferencePage })));
const ReferenceArticlePage = lazy(() => import('@/pages/ReferenceArticlePage').then(m => ({ default: m.ReferenceArticlePage })));
const ChecklistsPage = lazy(() => import('@/pages/ChecklistsPage').then(m => ({ default: m.ChecklistsPage })));
const QuestionsPage = lazy(() => import('@/pages/QuestionsPage').then(m => ({ default: m.QuestionsPage })));
const CalculatorsPage = lazy(() => import('@/pages/CalculatorsPage').then(m => ({ default: m.CalculatorsPage })));
const ToolsPage = lazy(() => import('@/pages/ToolsPage').then(m => ({ default: m.ToolsPage })));
const DisclosurePage = lazy(() => import('@/pages/DisclosurePage').then(m => ({ default: m.DisclosurePage })));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const ProfessionalsPage = lazy(() => import('@/pages/ProfessionalsPage').then(m => ({ default: m.ProfessionalsPage })));
const StrategyCallPage = lazy(() => import('@/pages/StrategyCallPage').then(m => ({ default: m.StrategyCallPage })));
const ToolkitPage = lazy(() => import('@/pages/ToolkitPage').then(m => ({ default: m.ToolkitPage })));
const MySavedPage = lazy(() => import('@/pages/MySavedPage').then(m => ({ default: m.MySavedPage })));
const ComparePropertiesPage = lazy(() => import('@/pages/ComparePropertiesPage').then(m => ({ default: m.ComparePropertiesPage })));
const OpenHomeTrackerPage = lazy(() => import('@/pages/OpenHomeTrackerPage').then(m => ({ default: m.OpenHomeTrackerPage })));
const DocumentTrackerPage = lazy(() => import('@/pages/DocumentTrackerPage').then(m => ({ default: m.DocumentTrackerPage })));
const SavingsTrackerPage = lazy(() => import('@/pages/SavingsTrackerPage').then(m => ({ default: m.SavingsTrackerPage })));
const PostSettlementPage = lazy(() => import('@/pages/PostSettlementPage').then(m => ({ default: m.PostSettlementPage })));
const InspectionChecklistPage = lazy(() => import('@/pages/InspectionChecklistPage').then(m => ({ default: m.InspectionChecklistPage })));
const SuburbComparisonPage = lazy(() => import('@/pages/SuburbComparisonPage').then(m => ({ default: m.SuburbComparisonPage })));
const AuditPage = lazy(() => import('@/pages/AuditPage').then(m => ({ default: m.AuditPage })));

function PageLoader() {
  return <PageSkeleton />;
}
function CalcLoader() {
  return <CalculatorSkeleton />;
}

function RouteTracker() {
  const location = useLocation();
  const path = location.pathname + location.search;

  useEffect(() => {
    pageView(path);
  }, [path]);

  useEngagementTracking(path);
  useScrollMilestones(path);

  return null;
}

function App() {
  return (
    <HashRouter>
      <ScrollRestoration />
      <RouteTracker />
      <Layout>
        <ErrorBoundary>
          <PageTransition>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/journey" element={<Suspense fallback={<PageLoader />}><JourneyPage /></Suspense>} />
              <Route path="/journey/:stageSlug" element={<Suspense fallback={<PageLoader />}><JourneyPage /></Suspense>} />
              <Route path="/reference" element={<Suspense fallback={<PageLoader />}><ReferencePage /></Suspense>} />
              <Route path="/reference/:slug" element={<Suspense fallback={<PageLoader />}><ReferenceArticlePage /></Suspense>} />
              <Route path="/checklists" element={<Suspense fallback={<PageLoader />}><ChecklistsPage /></Suspense>} />
              <Route path="/questions" element={<Suspense fallback={<PageLoader />}><QuestionsPage /></Suspense>} />
              <Route path="/calculators" element={<Suspense fallback={<CalcLoader />}><CalculatorsPage /></Suspense>} />
              <Route path="/tools" element={<Suspense fallback={<PageLoader />}><ToolsPage /></Suspense>} />
              <Route path="/professionals" element={<Suspense fallback={<PageLoader />}><ProfessionalsPage /></Suspense>} />
              <Route path="/strategy-call" element={<Suspense fallback={<PageLoader />}><StrategyCallPage /></Suspense>} />
              <Route path="/toolkit" element={<Suspense fallback={<PageLoader />}><ToolkitPage /></Suspense>} />
              <Route path="/saved" element={<Suspense fallback={<PageLoader />}><MySavedPage /></Suspense>} />
            <Route path="/compare" element={<Suspense fallback={<PageLoader />}><ComparePropertiesPage /></Suspense>} />
            <Route path="/tracker" element={<Suspense fallback={<PageLoader />}><OpenHomeTrackerPage /></Suspense>} />
            <Route path="/documents" element={<Suspense fallback={<PageLoader />}><DocumentTrackerPage /></Suspense>} />
            <Route path="/savings" element={<Suspense fallback={<PageLoader />}><SavingsTrackerPage /></Suspense>} />
            <Route path="/post-settlement" element={<Suspense fallback={<PageLoader />}><PostSettlementPage /></Suspense>} />
            <Route path="/inspection" element={<Suspense fallback={<PageLoader />}><InspectionChecklistPage /></Suspense>} />
            <Route path="/suburbs" element={<Suspense fallback={<PageLoader />}><SuburbComparisonPage /></Suspense>} />
            <Route path="/audit" element={<Suspense fallback={<PageLoader />}><AuditPage /></Suspense>} />
              <Route path="/disclosure" element={<Suspense fallback={<PageLoader />}><DisclosurePage /></Suspense>} />
              <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><PrivacyPage /></Suspense>} />
              <Route path="/offline" element={<OfflinePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </PageTransition>
        </ErrorBoundary>
      </Layout>
      <Toaster position="bottom-right" richColors />
    </HashRouter>
  );
}

export default App;

