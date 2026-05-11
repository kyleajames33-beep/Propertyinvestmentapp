import { useState, useMemo } from 'react';
import {
  getTrackedDocuments,
  updateDocumentStatus,
  updateDocumentNotes,
  updateDocumentDueDate,
  getDocumentStats,
  categoryLabels,
  categoryColours,
  resetDocumentTracker,
  type TrackedDocument,
} from '@/lib/documentTracker';
import { SEO } from '@/components/SEO';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FileCheck, RotateCcw, AlertTriangle, CheckCircle2, Clock, Circle,
  XCircle, ChevronDown, ChevronUp, Calendar, StickyNote, Filter,
} from 'lucide-react';
import { toast } from 'sonner';

export function DocumentTrackerPage() {
  const [docs, setDocs] = useState<TrackedDocument[]>(getTrackedDocuments);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const refresh = () => setDocs(getTrackedDocuments());
  const stats = getDocumentStats(docs);

  const categories = useMemo(() => {
    const cats = new Set(docs.map(d => d.category));
    return Array.from(cats);
  }, [docs]);

  const filtered = useMemo(() => {
    if (filterCategory === 'all') return docs;
    return docs.filter(d => d.category === filterCategory);
  }, [docs, filterCategory]);

  const handleStatus = (id: string, status: TrackedDocument['status']) => {
    updateDocumentStatus(id, status);
    refresh();
    if (status === 'completed') {
      toast.success('Document marked complete');
    }
  };

  const handleReset = () => {
    if (confirm('Reset all document progress? This cannot be undone.')) {
      resetDocumentTracker();
      refresh();
      toast.success('Document tracker reset');
    }
  };

  return (
    <div className="pp-container py-12">
      <SEO title="Document Tracker — PropertyPath" description="Track every document you need to buy property. From ID to settlement, all in one place." />

      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <FileCheck className="h-8 w-8 text-primary mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Document Tracker</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Every document you need to buy property, organised by category. 
              Track progress, set due dates, and never miss a requirement.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {stats.completed} of {stats.total} documents complete
        </div>
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{stats.pct}%</div>
              <p className="text-xs text-muted-foreground mt-1">Overall Progress</p>
              <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${stats.pct}%` }} />
              </div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-emerald-600">{stats.requiredPct}%</div>
              <p className="text-xs text-muted-foreground mt-1">Required Done</p>
              <p className="text-[10px] text-muted-foreground">{stats.requiredCompleted} of {stats.requiredTotal}</p>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-600">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground mt-1">In Progress</p>
            </Card>
            <Card className={`p-4 text-center ${stats.overdue > 0 ? 'border-rose-200 bg-rose-50/50' : ''}`}>
              <div className={`text-3xl font-bold ${stats.overdue > 0 ? 'text-rose-600' : 'text-muted-foreground'}`}>{stats.overdue}</div>
              <p className="text-xs text-muted-foreground mt-1">Overdue</p>
            </Card>
          </div>
        </ScrollReveal>

        {/* Filter */}
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Button
              size="sm"
              variant={filterCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setFilterCategory('all')}
              className="text-xs flex-shrink-0"
            >
              All ({docs.length})
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={filterCategory === cat ? 'default' : 'outline'}
                onClick={() => setFilterCategory(cat)}
                className="text-xs flex-shrink-0"
              >
                {categoryLabels[cat]} ({docs.filter(d => d.category === cat).length})
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={handleReset} className="text-xs text-muted-foreground ml-auto flex-shrink-0 gap-1">
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>
        </ScrollReveal>

        {/* Document list */}
        <div className="space-y-3">
          {filtered.map((doc, i) => {
            const isExpanded = expandedId === doc.id;
            const isOverdue = doc.dueDate && doc.status !== 'completed' && doc.status !== 'not-applicable' && new Date(doc.dueDate) < new Date();
            
            return (
              <ScrollReveal key={doc.id} delay={i * 40}>
                <Card className={`overflow-hidden transition-colors ${isOverdue ? 'border-rose-200' : ''}`}>
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {/* Status indicator */}
                      <button
                        onClick={() => {
                          const next: TrackedDocument['status'] =
                            doc.status === 'not-started' ? 'in-progress' :
                            doc.status === 'in-progress' ? 'completed' :
                            doc.status === 'completed' ? 'not-applicable' : 'not-started';
                          handleStatus(doc.id, next);
                        }}
                        className="mt-0.5 flex-shrink-0"
                        title="Click to cycle status"
                        aria-label={`${doc.name}: ${doc.status.replace('-', ' ')}, click to change`}
                      >
                        {doc.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : doc.status === 'in-progress' ? (
                          <Clock className="h-5 w-5 text-amber-500" />
                        ) : doc.status === 'not-applicable' ? (
                          <XCircle className="h-5 w-5 text-slate-300" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-300 hover:text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-medium text-sm ${doc.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {doc.name}
                          </h3>
                          {doc.required && (
                            <Badge variant="secondary" className="text-[10px] bg-rose-50 text-rose-700 border-rose-200">Required</Badge>
                          )}
                          {doc.lenderSpecific && (
                            <Badge variant="secondary" className="text-[10px]">Lender</Badge>
                          )}
                          <Badge variant="outline" className={`text-[10px] ${categoryColours[doc.category]}`}>
                            {categoryLabels[doc.category]}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>

                        {isOverdue && (
                          <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
                            <AlertTriangle className="h-3 w-3" />
                            Overdue — was due {new Date(doc.dueDate!).toLocaleDateString('en-AU')}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : doc.id)}
                        className="text-muted-foreground hover:text-foreground flex-shrink-0"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t bg-muted/20">
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
                            <Calendar className="h-3 w-3" />
                            Due Date
                          </label>
                          <Input
                            type="date"
                            value={doc.dueDate || ''}
                            onChange={e => {
                              updateDocumentDueDate(doc.id, e.target.value);
                              refresh();
                            }}
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1 mb-1">
                            <StickyNote className="h-3 w-3" />
                            Notes
                          </label>
                          <Textarea
                            value={doc.notes || ''}
                            onChange={e => {
                              updateDocumentNotes(doc.id, e.target.value);
                              refresh();
                            }}
                            rows={2}
                            className="text-xs min-h-0"
                            placeholder="Reference number, broker name, etc."
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {(['not-started', 'in-progress', 'completed', 'not-applicable'] as const).map(status => (
                          <Button
                            key={status}
                            size="sm"
                            variant={doc.status === status ? 'default' : 'outline'}
                            onClick={() => handleStatus(doc.id, status)}
                            className="text-xs h-7 capitalize"
                            aria-pressed={doc.status === status}
                            aria-label={`Mark ${doc.name} as ${status.replace('-', ' ')}`}
                          >
                            {status.replace('-', ' ')}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </ScrollReveal>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No documents in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
