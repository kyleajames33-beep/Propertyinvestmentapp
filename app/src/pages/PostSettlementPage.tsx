import { useState, useEffect } from 'react';
import {
  getMovingTasks,
  toggleMovingTask,
  resetMovingTasks,
  getMovingTaskStats,
  movingCategoryLabels,
  movingCategoryColours,
  type MovingTask,
} from '@/lib/movingTasks';
import { SEO } from '@/components/SEO';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Home, CheckCircle2, RotateCcw, Truck, Zap, MapPin, Wallet, Users,
  Clock, Calendar, Phone, Key, Droplets, Wifi, Shield, Mail, Award,
} from 'lucide-react';
import { toast } from 'sonner';

const categoryIcons: Record<string, React.ReactNode> = {
  utilities: <Zap className="h-4 w-4" />,
  address: <MapPin className="h-4 w-4" />,
  home: <Home className="h-4 w-4" />,
  finance: <Wallet className="h-4 w-4" />,
  family: <Users className="h-4 w-4" />,
};

export function PostSettlementPage() {
  const [tasks, setTasks] = useState<MovingTask[]>(getMovingTasks);
  const [settlementDate, setSettlementDate] = useState<string>(() => {
    return localStorage.getItem('pp_settlement_date') || '';
  });
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    if (settlementDate) {
      const target = new Date(settlementDate);
      const now = new Date();
      const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDaysUntil(diff);
    } else {
      setDaysUntil(null);
    }
  }, [settlementDate]);

  const refresh = () => setTasks(getMovingTasks());
  const stats = getMovingTaskStats(tasks);

  const handleToggle = (id: string) => {
    toggleMovingTask(id);
    refresh();
  };

  const handleDateChange = (date: string) => {
    setSettlementDate(date);
    localStorage.setItem('pp_settlement_date', date);
  };

  const handleReset = () => {
    if (confirm('Reset all moving tasks?')) {
      resetMovingTasks();
      refresh();
      toast.success('Tasks reset');
    }
  };

  const categories = Array.from(new Set(tasks.map(t => t.category)));
  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.category === filter);
  const incomplete = filtered.filter(t => !t.completed);
  const complete = filtered.filter(t => t.completed);

  return (
    <div className="pp-container py-12">
      <SEO title="Post-Settlement Toolkit — PropertyPath" description="Settlement countdown, moving checklist, and everything you need after buying." />

      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <Truck className="h-8 w-8 text-primary mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Post-Settlement Toolkit</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Count down to settlement day, tick off your moving tasks, and settle into your new home without a hitch.
            </p>
          </div>
        </ScrollReveal>

        {/* Settlement date + countdown */}
        <ScrollReveal>
          <Card className="p-6 mb-8 border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="settlementDate" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Settlement Date
                </Label>
                <Input
                  id="settlementDate"
                  type="date"
                  value={settlementDate}
                  onChange={e => handleDateChange(e.target.value)}
                  className="mt-1.5 max-w-xs"
                />
              </div>
              {daysUntil !== null && (
                <div className={`text-center px-6 py-3 rounded-xl ${
                  daysUntil < 0 ? 'bg-emerald-50 border border-emerald-200' :
                  daysUntil <= 7 ? 'bg-amber-50 border border-amber-200' :
                  'bg-muted/50'
                }`}>
                  <p className={`text-3xl font-bold ${
                    daysUntil < 0 ? 'text-emerald-700' :
                    daysUntil <= 7 ? 'text-amber-700' :
                    'text-foreground'
                  }`}>
                    {daysUntil < 0 ? 'Settled!' : daysUntil}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {daysUntil < 0 ? `${Math.abs(daysUntil)} days ago` : daysUntil === 1 ? 'day to go' : 'days to go'}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </ScrollReveal>

        {/* Progress */}
        <ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Card className="p-4 text-center">
              <CheckCircle2 className="h-4 w-4 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold">{stats.pct}%</p>
              <p className="text-xs text-muted-foreground">Complete</p>
              <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${stats.pct}%` }} />
              </div>
            </Card>
            <Card className="p-4 text-center">
              <Award className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Done</p>
            </Card>
            <Card className="p-4 text-center">
              <Clock className="h-4 w-4 text-amber-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{stats.total - stats.completed}</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </Card>
            <Card className="p-4 text-center">
              <Home className="h-4 w-4 text-blue-500 mx-auto mb-1" />
              <p className="text-2xl font-bold">{categories.length}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </Card>
          </div>
        </ScrollReveal>

        {/* Category filters */}
        <ScrollReveal>
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className="text-xs flex-shrink-0"
            >
              All ({tasks.length})
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                size="sm"
                variant={filter === cat ? 'default' : 'outline'}
                onClick={() => setFilter(cat)}
                className="text-xs flex-shrink-0 gap-1"
              >
                {categoryIcons[cat]}
                {movingCategoryLabels[cat]}
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={handleReset} className="text-xs text-muted-foreground ml-auto flex-shrink-0 gap-1">
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>
        </ScrollReveal>

        {/* Task list */}
        <div className="space-y-3">
          {incomplete.length === 0 && complete.length > 0 && (
            <div className="text-center py-8">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-semibold text-emerald-700">All tasks complete!</p>
              <p className="text-sm text-muted-foreground">You are ready to settle in.</p>
            </div>
          )}

          {incomplete.map((task, i) => (
            <ScrollReveal key={task.id} delay={i * 40}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggle(task.id)}
                    className="mt-1"
                    aria-label={`Mark ${task.task} as complete`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-sm">{task.task}</h3>
                      <Badge variant="outline" className={`text-[10px] ${movingCategoryColours[task.category]}`}>
                        {movingCategoryLabels[task.category]}
                      </Badge>
                      {task.dueDays !== undefined && (
                        <Badge variant="secondary" className="text-[10px]">
                          {task.dueDays < 0 ? `${Math.abs(task.dueDays)} days before` : task.dueDays === 0 ? 'Settlement day' : `${task.dueDays} days after`}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          ))}

          {complete.length > 0 && incomplete.length > 0 && (
            <div className="pt-4 border-t">
              <p className="text-xs font-medium text-muted-foreground mb-3">Completed ({complete.length})</p>
            </div>
          )}

          {complete.map((task, i) => (
            <ScrollReveal key={task.id} delay={i * 30}>
              <Card className="p-4 bg-muted/30 opacity-70">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggle(task.id)}
                    className="mt-1"
                    aria-label={`Mark ${task.task} as incomplete`}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-through text-muted-foreground">{task.task}</h3>
                    <p className="text-xs text-muted-foreground">{task.description}</p>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        {/* Quick links */}
        <ScrollReveal>
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: <Mail className="h-4 w-4" />, label: 'Redirect Mail', href: 'https://auspost.com.au/mail-redirection' },
                { icon: <Zap className="h-4 w-4" />, label: 'Compare Energy', href: 'https://energymadeeasy.gov.au' },
                { icon: <Wifi className="h-4 w-4" />, label: 'Check NBN', href: 'https://nbn.com.au' },
                { icon: <Shield className="h-4 w-4" />, label: 'Home Insurance', href: '/reference/home-insurance-guide' },
                { icon: <Key className="h-4 w-4" />, label: 'Find Locksmith', href: '/professionals' },
                { icon: <Droplets className="h-4 w-4" />, label: 'Water Provider', href: 'https://www.sydneywater.com.au' },
                { icon: <Phone className="h-4 w-4" />, label: 'Service NSW', href: 'https://www.service.nsw.gov.au' },
                { icon: <Truck className="h-4 w-4" />, label: 'Find Removalist', href: '/professionals' },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-sm"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
