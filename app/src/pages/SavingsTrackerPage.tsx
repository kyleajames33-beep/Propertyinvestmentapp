import { useState, useMemo } from 'react';
import {
  getSavingsEntries,
  addSavingsEntry,
  removeSavingsEntry,
  getSavingsGoal,
  setSavingsGoal,
  getTotalSaved,
  getMonthlyTotals,
  getAverageMonthlySavings,
  getProjectedDate,
  getSavingsStreak,
  sourceLabels,
  sourceColours,
  type SavingsEntry,
  type SavingsGoal,
} from '@/lib/savingsTracker';
import { formatCurrency } from '@/lib/compareProperties';
import { SEO } from '@/components/SEO';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  PiggyBank, Plus, Trash2, TrendingUp, Flame, Target, Calendar, DollarSign,
  TrendingDown, ArrowRight, Wallet, Award,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';

export function SavingsTrackerPage() {
  const [entries, setEntries] = useState<SavingsEntry[]>(getSavingsEntries);
  const [goal, setGoal] = useState<SavingsGoal | null>(getSavingsGoal);
  const [goalDialogOpen, setGoalDialogOpen] = useState(!getSavingsGoal());
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);

  const refresh = () => {
    setEntries(getSavingsEntries());
    setGoal(getSavingsGoal());
  };

  const totalSaved = useMemo(() => getTotalSaved(), [entries]);
  const monthlyTotals = useMemo(() => getMonthlyTotals(), [entries]);
  const avgMonthly = useMemo(() => getAverageMonthlySavings(), [entries]);
  const streak = useMemo(() => getSavingsStreak(), [entries]);
  const projectedDate = goal ? getProjectedDate(goal.targetAmount) : null;
  const pctComplete = goal && goal.targetAmount > 0 ? Math.min(100, Math.round((totalSaved / goal.targetAmount) * 100)) : 0;

  const chartData = useMemo(() => {
    let runningTotal = 0;
    return monthlyTotals.map(m => {
      runningTotal += m.amount;
      return {
        month: new Date(m.month + '-01').toLocaleDateString('en-AU', { month: 'short', year: '2-digit' }),
        saved: runningTotal,
        monthly: m.amount,
      };
    });
  }, [monthlyTotals]);

  const sourceData = useMemo(() => {
    const bySource = new Map<string, number>();
    for (const entry of entries) {
      bySource.set(entry.source, (bySource.get(entry.source) || 0) + entry.amount);
    }
    return Array.from(bySource.entries()).map(([source, amount]) => ({
      name: sourceLabels[source] || source,
      value: amount,
      colour: sourceColours[source] || '#ccc',
    }));
  }, [entries]);

  const handleAddGoal = (data: SavingsGoal) => {
    setSavingsGoal(data);
    refresh();
    setGoalDialogOpen(false);
    toast.success('Savings goal set');
  };

  const handleAddEntry = (data: Omit<SavingsEntry, 'id'>) => {
    addSavingsEntry(data);
    refresh();
    setEntryDialogOpen(false);
    toast.success('Entry added');
  };

  const handleRemove = (id: string) => {
    removeSavingsEntry(id);
    refresh();
    toast.success('Entry removed');
  };

  return (
    <div className="pp-container py-12">
      <SEO title="Savings Tracker — PropertyPath" description="Track your deposit savings, visualise progress, and project when you will reach your goal." />

      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <PiggyBank className="h-8 w-8 text-primary mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Savings Tracker</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Log every dollar you save toward your deposit. Watch your progress grow and stay motivated with streaks and projections.
            </p>
          </div>
        </ScrollReveal>

        {/* Goal card */}
        {goal && (
          <ScrollReveal>
            <Card className="p-5 mb-8 border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Deposit Goal</h2>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{formatCurrency(totalSaved)}</span>
                    <span className="text-muted-foreground">of {formatCurrency(goal.targetAmount)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${pctComplete}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{pctComplete}% complete</p>
                </div>
                <div className="flex gap-3">
                  {projectedDate && (
                    <div className="text-center px-4 py-2 bg-muted/50 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Projected</p>
                      <p className="text-sm font-semibold">{new Date(projectedDate).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}</p>
                    </div>
                  )}
                  {streak > 0 && (
                    <div className="text-center px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
                      <Flame className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Streak</p>
                      <p className="text-sm font-semibold text-orange-700">{streak} month{streak !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                  <Button variant="outline" size="sm" onClick={() => setGoalDialogOpen(true)}>
                    Edit Goal
                  </Button>
                </div>
              </div>
            </Card>
          </ScrollReveal>
        )}

        {/* Stats */}
        {entries.length > 0 && (
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <Card className="p-4 text-center">
                <Wallet className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold">{formatCurrency(totalSaved)}</p>
                <p className="text-xs text-muted-foreground">Total Saved</p>
              </Card>
              <Card className="p-4 text-center">
                <TrendingUp className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">{formatCurrency(avgMonthly)}</p>
                <p className="text-xs text-muted-foreground">Avg / Month</p>
              </Card>
              <Card className="p-4 text-center">
                <Award className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">{entries.length}</p>
                <p className="text-xs text-muted-foreground">Entries</p>
              </Card>
              <Card className="p-4 text-center">
                <Calendar className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">{monthlyTotals.length}</p>
                <p className="text-xs text-muted-foreground">Months Active</p>
              </Card>
            </div>
          </ScrollReveal>
        )}

        {/* Charts */}
        {chartData.length > 1 && (
          <ScrollReveal>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <Card className="p-4 md:col-span-2">
                <h3 className="text-sm font-semibold mb-4">Savings Over Time</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Line type="monotone" dataKey="saved" stroke="#2d6a4f" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-4">By Source</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.colour} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-2">
                  {sourceData.map(s => (
                    <div key={s.name} className="flex items-center gap-1 text-[10px]">
                      <span className="w-2 h-2 rounded-full" style={{ background: s.colour }} />
                      {s.name}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </ScrollReveal>
        )}

        {/* Monthly bar chart */}
        {monthlyTotals.length > 0 && (
          <ScrollReveal>
            <Card className="p-4 mb-8">
              <h3 className="text-sm font-semibold mb-4">Monthly Contributions</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyTotals.map(m => ({
                  month: new Date(m.month + '-01').toLocaleDateString('en-AU', { month: 'short' }),
                  amount: m.amount,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="amount" fill="#2d6a4f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </ScrollReveal>
        )}

        {/* Recent entries */}
        {entries.length > 0 && (
          <ScrollReveal>
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Recent Entries</h2>
              <div className="space-y-2">
                {[...entries].reverse().slice(0, 10).map((entry) => (
                  <Card key={entry.id} className="p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{formatCurrency(entry.amount)}</p>
                        <Badge variant="secondary" className="text-[10px]">{sourceLabels[entry.source]}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {entry.note && ` · ${entry.note}`}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500" onClick={() => handleRemove(entry.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {entries.length === 0 && !goal && (
          <div className="text-center py-12">
            <PiggyBank className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">Start tracking your savings</h3>
            <p className="text-sm text-slate-500 mb-4">Set a deposit goal and log your first contribution.</p>
            <Button onClick={() => setGoalDialogOpen(true)}>Set Goal</Button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-center gap-3">
          <GoalDialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen} onSave={handleAddGoal} existing={goal} />
          {goal && (
            <EntryDialog open={entryDialogOpen} onOpenChange={setEntryDialogOpen} onAdd={handleAddEntry} />
          )}
        </div>
      </div>
    </div>
  );
}

function GoalDialog({
  open,
  onOpenChange,
  onSave,
  existing,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (data: SavingsGoal) => void;
  existing: SavingsGoal | null;
}) {
  const [form, setForm] = useState({
    targetAmount: existing?.targetAmount?.toString() || '100000',
    targetDate: existing?.targetDate || '',
    propertyPriceEstimate: existing?.propertyPriceEstimate?.toString() || '',
    monthlyCommitment: existing?.monthlyCommitment?.toString() || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      targetAmount: Number(form.targetAmount) || 0,
      targetDate: form.targetDate || undefined,
      propertyPriceEstimate: Number(form.propertyPriceEstimate) || undefined,
      monthlyCommitment: Number(form.monthlyCommitment) || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Target className="h-4 w-4" />
          {existing ? 'Edit Goal' : 'Set Goal'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{existing ? 'Update Savings Goal' : 'Set Your Deposit Goal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="targetAmount">Target Deposit Amount *</Label>
            <Input id="targetAmount" type="number" value={form.targetAmount} onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value }))} required />
          </div>
          <div>
            <Label htmlFor="targetDate">Target Date (optional)</Label>
            <Input id="targetDate" type="date" value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="propertyPrice">Property Price Estimate</Label>
              <Input id="propertyPrice" type="number" value={form.propertyPriceEstimate} onChange={e => setForm(f => ({ ...f, propertyPriceEstimate: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="monthly">Monthly Commitment</Label>
              <Input id="monthly" type="number" value={form.monthlyCommitment} onChange={e => setForm(f => ({ ...f, monthlyCommitment: e.target.value }))} />
            </div>
          </div>
          <Button type="submit" className="w-full">Save Goal</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EntryDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (data: Omit<SavingsEntry, 'id'>) => void;
}) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    source: 'salary' as SavingsEntry['source'],
    note: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      date: form.date,
      amount: Number(form.amount) || 0,
      source: form.source,
      note: form.note || undefined,
    });
    setForm({ date: new Date().toISOString().split('T')[0], amount: '', source: 'salary', note: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log Savings Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="entryDate">Date *</Label>
              <Input id="entryDate" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="entryAmount">Amount *</Label>
              <Input id="entryAmount" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
            </div>
          </div>
          <div>
            <Label htmlFor="entrySource">Source</Label>
            <select
              id="entrySource"
              value={form.source}
              onChange={e => setForm(f => ({ ...f, source: e.target.value as SavingsEntry['source'] }))}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {Object.entries(sourceLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="entryNote">Note (optional)</Label>
            <Input id="entryNote" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="e.g. Tax refund" />
          </div>
          <Button type="submit" className="w-full">Add Entry</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
