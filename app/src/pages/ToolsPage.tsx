import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { GitBranch, BarChart3, ClipboardCheck, MessageSquare } from 'lucide-react';
import { DecisionTrees } from '@/components/diagrams';
import { ProcessVisualisations } from '@/components/diagrams';
import { DataVisualisations } from '@/components/diagrams';
import { InteractiveChecklists } from '@/components/InteractiveChecklists';
import { QuestionScriptGenerator } from '@/components/QuestionScriptGenerator';

type ToolTab = 'decisions' | 'process' | 'data' | 'checklists' | 'questions';

const tabs: Array<{ id: ToolTab; label: string; icon: React.ReactNode; badge: string }> = [
  { id: 'decisions', label: 'Decision Trees', icon: <GitBranch className="h-4 w-4" />, badge: 'Interactive' },
  { id: 'process', label: 'Process Visuals', icon: <BarChart3 className="h-4 w-4" />, badge: 'Guides' },
  { id: 'data', label: 'Data Visuals', icon: <BarChart3 className="h-4 w-4" />, badge: 'Charts' },
  { id: 'checklists', label: 'Checklists', icon: <ClipboardCheck className="h-4 w-4" />, badge: 'Trackers' },
  { id: 'questions', label: 'Question Scripts', icon: <MessageSquare className="h-4 w-4" />, badge: 'Generator' },
];

export function ToolsPage() {
  const [active, setActive] = useState<ToolTab>('decisions');

  return (
    <div className="pp-container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <GitBranch className="h-8 w-8 text-primary mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-serif">Interactive Tools</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Decision trees, process guides, data visualisations, checklists, and question generators.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                active === tab.id ? 'border-primary bg-primary/5 text-primary' : 'border-transparent hover:border-border bg-card hover:shadow-md'
              }`}>
              {tab.icon}
              {tab.label}
              <Badge variant="secondary" className="text-[9px] px-1">{tab.badge}</Badge>
            </button>
          ))}
        </div>

        {active === 'decisions' && <DecisionTrees />}
        {active === 'process' && <ProcessVisualisations />}
        {active === 'data' && <DataVisualisations />}
        {active === 'checklists' && <InteractiveChecklists />}
        {active === 'questions' && <QuestionScriptGenerator />}
      </div>
    </div>
  );
}
