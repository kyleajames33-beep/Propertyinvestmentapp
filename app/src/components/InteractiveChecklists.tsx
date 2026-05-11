import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Download, RotateCcw, Home, TrendingUp, Building2, Minimize2, Share2 } from 'lucide-react';
import type { Persona } from '@/types/content';
import { personaLabels, personaColors } from '@/content/metadata';
import { storage } from '@/lib/storage';
import { trackChecklistCompletion, trackActivity } from '@/lib/badges';
import confetti from 'canvas-confetti';

interface ChecklistItem {
  id: string;
  text: string;
}

interface Checklist {
  id: string;
  stage: string;
  stageNum: number;
  persona: Persona;
  title: string;
  items: ChecklistItem[];
}

const allChecklists: Checklist[] = [
  {
    id: '01-strategy-fhb', stage: 'Strategy', stageNum: 1, persona: 'fhb-oo',
    title: 'Strategy — First Home Buyer',
    items: [
      { id: 's1', text: 'Calculate total deposit (savings + gifts + FHSSS)' },
      { id: 's2', text: 'Check credit score via Equifax, Experian, or Illion' },
      { id: 's3', text: 'Estimate borrowing capacity using online calculators' },
      { id: 's4', text: 'Research NSW first home buyer schemes' },
      { id: 's5', text: 'Decide house vs apartment, established vs new' },
      { id: 's6', text: 'Identify 3-5 target suburbs' },
      { id: 's7', text: 'Set realistic 6-12 month timeline' },
      { id: 's8', text: 'Document must-haves vs nice-to-haves' },
      { id: 's9', text: 'Attend 5+ open homes for calibration' },
      { id: 's10', text: 'Get pre-approval before serious inspections' },
    ]
  },
  {
    id: '01-strategy-inv', stage: 'Strategy', stageNum: 1, persona: 'inv-new',
    title: 'Strategy — First-Time Investor',
    items: [
      { id: 'i1', text: 'Choose strategy: cashflow vs capital growth vs hybrid' },
      { id: 'i2', text: 'Calculate investment borrowing capacity' },
      { id: 'i3', text: 'Research tax: negative gearing, deductions, CGT' },
      { id: 'i4', text: 'Decide ownership structure' },
      { id: 'i5', text: 'Set target yield and cashflow requirements' },
      { id: 'i6', text: 'Identify 2-3 target markets' },
      { id: 'i7', text: 'Confirm pre-approval for investment lending' },
      { id: 'i8', text: 'Engage property-savvy accountant' },
    ]
  },
  {
    id: '02-finance-fhb', stage: 'Finance', stageNum: 2, persona: 'fhb-oo',
    title: 'Finance — First Home Buyer',
    items: [
      { id: 'f1', text: 'Gather 3 months bank statements' },
      { id: 'f2', text: 'Collect 2 recent payslips or tax returns' },
      { id: 'f3', text: 'Get pre-approval from lender or broker' },
      { id: 'f4', text: 'Calculate total purchase costs including stamp duty' },
      { id: 'f5', text: 'Confirm FHOG eligibility if buying new' },
      { id: 'f6', text: 'Reduce credit card limits' },
      { id: 'f7', text: 'Understand LMI costs if under 20% deposit' },
      { id: 'f8', text: 'Confirm genuine savings requirements' },
    ]
  },
  {
    id: '05-inspection-fhb', stage: 'Inspection', stageNum: 5, persona: 'fhb-oo',
    title: 'Inspection — First Home Buyer',
    items: [
      { id: 'in1', text: 'Order building and pest inspection' },
      { id: 'in2', text: 'Review strata report if apartment' },
      { id: 'in3', text: 'Check flood zone mapping' },
      { id: 'in4', text: 'Verify bushfire prone land status' },
      { id: 'in5', text: 'Confirm no outstanding council orders' },
      { id: 'in6', text: 'Check for easements and covenants' },
      { id: 'in7', text: 'Inspect at different times of day' },
      { id: 'in8', text: 'Test taps, toilets, electrical' },
      { id: 'in9', text: 'Check for water damage and damp' },
      { id: 'in10', text: 'Review comparable sales' },
    ]
  },
  {
    id: '07-contract-fhb', stage: 'Contract', stageNum: 7, persona: 'fhb-oo',
    title: 'Contract — First Home Buyer',
    items: [
      { id: 'c1', text: 'Engage conveyancer immediately' },
      { id: 'c2', text: 'Read contract in full before signing' },
      { id: 'c3', text: 'Check cooling off period included' },
      { id: 'c4', text: 'Verify property boundaries' },
      { id: 'c5', text: 'Confirm inclusions and exclusions' },
      { id: 'c6', text: 'Check special conditions favour vendor' },
      { id: 'c7', text: 'Verify deposit amount and timing' },
      { id: 'c8', text: 'Confirm settlement date works' },
      { id: 'c9', text: 'Review strata by-laws if applicable' },
      { id: 'c10', text: 'Do not exchange until finance unconditionally approved' },
    ]
  },
];

const personaIcons: Record<Persona, React.ReactNode> = {
  'fhb-oo': <Home className="h-4 w-4" />,
  'inv-new': <TrendingUp className="h-4 w-4" />,
  'inv-exp': <Building2 className="h-4 w-4" />,
  'downsizer': <Minimize2 className="h-4 w-4" />,
};

const CHECKLIST_STORAGE_KEY = 'checklist_checked';

export function InteractiveChecklists() {
  const [selectedPersona, setSelectedPersona] = useState<Persona>('fhb-oo');
  const [selectedChecklist, setSelectedChecklist] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    return storage.get<Record<string, boolean>>(CHECKLIST_STORAGE_KEY, {});
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const filtered = allChecklists.filter(c => c.persona === selectedPersona);

  // Persist checklist state
  useEffect(() => {
    storage.set(CHECKLIST_STORAGE_KEY, checked);
  }, [checked]);

  const toggleItem = useCallback((id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      trackActivity('checklist_check');
      return next;
    });
  }, []);

  const getProgress = (checklist: Checklist) => {
    const checkedCount = checklist.items.filter(i => checked[i.id]).length;
    return { checked: checkedCount, total: checklist.items.length, pct: Math.round((checkedCount / checklist.items.length) * 100) };
  };

  const resetAll = () => {
    if (selectedChecklist) {
      const cl = allChecklists.find(c => c.id === selectedChecklist);
      if (cl) {
        const next = { ...checked };
        cl.items.forEach(i => delete next[i.id]);
        setChecked(next);
      }
    } else {
      setChecked({});
    }
  };

  const exportCSV = () => {
    const active = selectedChecklist ? allChecklists.find(c => c.id === selectedChecklist) : null;
    if (!active) return;
    const rows = active.items.map(i => `${checked[i.id] ? '[x]' : '[ ]'},${i.text}`);
    const csv = `${active.title}\n\n${rows.join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${active.id}-checklist.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareChecklist = async () => {
    const active = selectedChecklist ? allChecklists.find(c => c.id === selectedChecklist) : null;
    if (!active) return;
    const prog = getProgress(active);
    const text = `${active.title}\nProgress: ${prog.checked}/${prog.total} (${prog.pct}%)\n\nPropertyPath — NSW Property Guidance`;
    if (navigator.share) {
      try {
        await navigator.share({ title: active.title, text });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(text);
  };

  const activeChecklist = selectedChecklist ? allChecklists.find(c => c.id === selectedChecklist) : null;

  // Confetti effect when checklist completes
  useEffect(() => {
    if (activeChecklist) {
      const prog = getProgress(activeChecklist);
      if (prog.pct === 100 && !showConfetti) {
        setShowConfetti(true);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#f59e0b'],
        });
        trackChecklistCompletion(prog.total, prog.checked);
      }
    }
  }, [checked, activeChecklist, showConfetti]);

  // Reset confetti flag when changing checklists
  useEffect(() => {
    setShowConfetti(false);
  }, [selectedChecklist]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Persona filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['fhb-oo', 'inv-new', 'inv-exp'] as Persona[]).map(p => (
          <Button key={p} variant={selectedPersona === p ? 'default' : 'outline'} onClick={() => { setSelectedPersona(p); setSelectedChecklist(null); }} className="gap-2">
            {personaIcons[p]}{personaLabels[p]}
          </Button>
        ))}
      </div>

      {/* Checklist selector or detail view */}
      {!activeChecklist ? (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(cl => {
            const prog = getProgress(cl);
            return (
              <button key={cl.id} onClick={() => setSelectedChecklist(cl.id)} className="pp-card text-left hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={personaColors[cl.persona]}>{cl.stage}</Badge>
                  <span className="text-xs text-slate-500">{prog.checked}/{prog.total}</span>
                </div>
                <h4 className="font-semibold text-slate-800 mb-2">{cl.title}</h4>
                <Progress value={prog.pct} className="h-2" />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-slate-500">{prog.pct}% complete</span>
                  {prog.pct === 100 && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={() => setSelectedChecklist(null)}>← Back to lists</Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={shareChecklist}><Share2 className="h-3 w-3 mr-1" />Share</Button>
              <Button variant="outline" size="sm" onClick={exportCSV}><Download className="h-3 w-3 mr-1" />Export</Button>
              <Button variant="outline" size="sm" onClick={resetAll}><RotateCcw className="h-3 w-3 mr-1" />Reset</Button>
            </div>
          </div>

          <div className="pp-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-serif">{activeChecklist.title}</h3>
              <Badge className={personaColors[activeChecklist.persona]}>Stage {activeChecklist.stageNum}</Badge>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">{getProgress(activeChecklist).checked} of {getProgress(activeChecklist).total} completed</span>
                <span className="font-medium text-primary">{getProgress(activeChecklist).pct}%</span>
              </div>
              <Progress value={getProgress(activeChecklist).pct} className="h-3" />
            </div>

            <div className="space-y-2">
              {activeChecklist.items.map(item => {
                const isChecked = checked[item.id];
                return (
                  <button key={item.id} onClick={() => toggleItem(item.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                      isChecked ? 'bg-green-50 border border-green-200' : 'bg-white border border-slate-200 hover:bg-slate-50'
                    }`}>
                    {isChecked ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /> : <Circle className="h-5 w-5 text-slate-300 flex-shrink-0 mt-0.5" />}
                    <span className={`text-sm leading-relaxed ${isChecked ? 'text-green-800 line-through opacity-70' : 'text-slate-700'}`}>{item.text}</span>
                  </button>
                );
              })}
            </div>

            {getProgress(activeChecklist).pct === 100 && (
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200 text-center animate-in fade-in zoom-in-95 duration-300">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-800">Checklist complete!</p>
                <p className="text-sm text-green-600">You are ready for the next stage.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>{children}</span>;
}
