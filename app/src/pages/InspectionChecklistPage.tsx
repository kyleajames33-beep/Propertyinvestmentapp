import { useState } from 'react';
import {
  getInspectionChecks,
  updateInspectionCheck,
  resetInspectionChecks,
  getInspectionStats,
  inspectionCategoryLabels,
  type InspectionCheck,
} from '@/lib/inspectionChecks';
import { SEO } from '@/components/SEO';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  ClipboardCheck, RotateCcw, CheckCircle2, XCircle, AlertTriangle,
  HelpCircle, Home, TreePine, CookingPot, Bath, Bed, Sofa, Sun, Zap,
} from 'lucide-react';
import { toast } from 'sonner';

const categoryIcons: Record<string, React.ReactNode> = {
  exterior: <Home className="h-4 w-4" />,
  interior: <Home className="h-4 w-4" />,
  kitchen: <CookingPot className="h-4 w-4" />,
  bathroom: <Bath className="h-4 w-4" />,
  bedroom: <Bed className="h-4 w-4" />,
  living: <Sofa className="h-4 w-4" />,
  outdoor: <TreePine className="h-4 w-4" />,
  services: <Zap className="h-4 w-4" />,
};

const statusConfig = {
  'not-checked': { label: 'Not Checked', icon: <HelpCircle className="h-4 w-4" />, colour: 'bg-slate-100 text-slate-500 border-slate-200' },
  'pass': { label: 'Pass', icon: <CheckCircle2 className="h-4 w-4" />, colour: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'fail': { label: 'Fail', icon: <XCircle className="h-4 w-4" />, colour: 'bg-rose-50 text-rose-700 border-rose-200' },
  'concern': { label: 'Concern', icon: <AlertTriangle className="h-4 w-4" />, colour: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export function InspectionChecklistPage() {
  const [checks, setChecks] = useState<InspectionCheck[]>(getInspectionChecks);
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const refresh = () => setChecks(getInspectionChecks());
  const stats = getInspectionStats(checks);

  const categories = Array.from(new Set(checks.map(c => c.category)));
  const filtered = filter === 'all' ? checks : filter === 'critical' ? checks.filter(c => c.critical) : checks.filter(c => c.category === filter);

  const handleStatus = (id: string, status: InspectionCheck['status']) => {
    updateInspectionCheck(id, { status });
    refresh();
  };

  const handleNotes = (id: string, notes: string) => {
    updateInspectionCheck(id, { notes });
    refresh();
  };

  const handleReset = () => {
    if (confirm('Reset all inspection checks?')) {
      resetInspectionChecks();
      refresh();
      toast.success('Checklist reset');
    }
  };

  return (
    <div className="pp-container py-12">
      <SEO title="Property Inspection Checklist — PropertyPath" description="Room-by-room checklist for evaluating properties during open homes and inspections." />

      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <ClipboardCheck className="h-8 w-8 text-primary mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Inspection Checklist</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              A room-by-room checklist for open homes. Check items as you inspect and flag concerns for your building inspector.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <Card className="p-3 text-center">
              <p className="text-2xl font-bold">{stats.pct}%</p>
              <p className="text-xs text-muted-foreground">Checked</p>
              <div className="w-full h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${stats.pct}%` }} />
              </div>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{stats.passed}</p>
              <p className="text-xs text-muted-foreground">Pass</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-2xl font-bold text-rose-600">{stats.failed}</p>
              <p className="text-xs text-muted-foreground">Fail</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{stats.concerns}</p>
              <p className="text-xs text-muted-foreground">Concerns</p>
            </Card>
            <Card className={`p-3 text-center ${stats.criticalFails > 0 ? 'border-rose-200 bg-rose-50/50' : ''}`}>
              <p className={`text-2xl font-bold ${stats.criticalFails > 0 ? 'text-rose-600' : ''}`}>{stats.criticalFails}</p>
              <p className="text-xs text-muted-foreground">Critical Fails</p>
            </Card>
          </div>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className="text-xs flex-shrink-0">
              All ({checks.length})
            </Button>
            <Button size="sm" variant={filter === 'critical' ? 'default' : 'outline'} onClick={() => setFilter('critical')} className="text-xs flex-shrink-0">
              Critical Only
            </Button>
            {categories.map(cat => (
              <Button key={cat} size="sm" variant={filter === cat ? 'default' : 'outline'} onClick={() => setFilter(cat)} className="text-xs flex-shrink-0 gap-1">
                {categoryIcons[cat]}
                {inspectionCategoryLabels[cat]}
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={handleReset} className="text-xs text-muted-foreground ml-auto flex-shrink-0 gap-1">
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>
        </ScrollReveal>

        {/* Checklist */}
        <div className="space-y-2">
          {filtered.map((check, i) => {
            const isExpanded = expandedId === check.id;
            const config = statusConfig[check.status];
            return (
              <ScrollReveal key={check.id} delay={i * 30}>
                <Card className={`overflow-hidden transition-all ${check.critical && check.status === 'fail' ? 'border-rose-200' : ''}`}>
                  <div className="p-3 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium text-sm">{check.item}</h3>
                        {check.critical && (
                          <Badge variant="secondary" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">Critical</Badge>
                        )}
                        <Badge variant="outline" className={`text-[10px] ${config.colour}`}>
                          <span className="flex items-center gap-1">{config.icon} {config.label}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{check.description}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-xs flex-shrink-0" onClick={() => setExpandedId(isExpanded ? null : check.id)}>
                      {isExpanded ? 'Close' : 'Check'}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="px-3 pb-3 border-t bg-muted/20">
                      <div className="flex gap-2 mt-3">
                        {(Object.keys(statusConfig) as InspectionCheck['status'][]).map(status => (
                          <Button
                            key={status}
                            size="sm"
                            variant={check.status === status ? 'default' : 'outline'}
                            onClick={() => handleStatus(check.id, status)}
                            className="text-xs h-8 gap-1 capitalize"
                          >
                            {statusConfig[status].icon}
                            {statusConfig[status].label}
                          </Button>
                        ))}
                      </div>
                      <Textarea
                        value={check.notes || ''}
                        onChange={e => handleNotes(check.id, e.target.value)}
                        placeholder="Add notes (e.g. 'Crack in north wall, 30cm long')"
                        className="mt-2 text-xs min-h-[60px]"
                      />
                    </div>
                  )}
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No checks match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
