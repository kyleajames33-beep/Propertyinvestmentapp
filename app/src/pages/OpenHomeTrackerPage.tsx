import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getOpenHomeVisits,
  addOpenHomeVisit,
  removeOpenHomeVisit,
  updateOpenHomeVisit,
  getUpcomingVisits,
  getPastVisits,
  type OpenHomeVisit,
} from '@/lib/openHomeVisits';
import { addComparedProperty } from '@/lib/compareProperties';
import { SEO } from '@/components/SEO';
import { ScrollReveal } from '@/components/ScrollReveal';
import { EmptyState } from '@/components/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  CalendarDays, Plus, Trash2, Star, MapPin, Clock, Phone, User, Check, ArrowRight, Scale,
  Calendar, Home,
} from 'lucide-react';
import { toast } from 'sonner';

export function OpenHomeTrackerPage() {
  const [visits, setVisits] = useState<OpenHomeVisit[]>(getOpenHomeVisits());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [ratingVisit, setRatingVisit] = useState<OpenHomeVisit | null>(null);

  const refresh = () => setVisits(getOpenHomeVisits());
  const upcoming = getUpcomingVisits();
  const past = getPastVisits();

  const handleAdd = (data: Omit<OpenHomeVisit, 'id' | 'dateAdded'>) => {
    addOpenHomeVisit(data);
    refresh();
    setDialogOpen(false);
    toast.success('Open home added to tracker');
  };

  const handleRemove = (id: string) => {
    removeOpenHomeVisit(id);
    refresh();
    toast.success('Removed');
  };

  const handleMarkAttended = (id: string) => {
    updateOpenHomeVisit(id, { status: 'attended' });
    refresh();
    const visit = visits.find(v => v.id === id);
    if (visit) {
      setRatingVisit(visit);
      setRateDialogOpen(true);
    }
  };

  const handleRate = (rating: number, notes: string, pros: string, cons: string) => {
    if (!ratingVisit) return;
    updateOpenHomeVisit(ratingVisit.id, {
      rating,
      notes: ratingVisit.notes ? `${ratingVisit.notes}\n\n${notes}` : notes,
      pros: pros.split('\n').filter(Boolean),
      cons: cons.split('\n').filter(Boolean),
    });
    refresh();
    setRateDialogOpen(false);
    setRatingVisit(null);
    toast.success('Rating saved');
  };

  const handleAddToCompare = (visit: OpenHomeVisit) => {
    addComparedProperty({
      address: visit.propertyAddress,
      price: visit.price || 0,
      stampDuty: 0,
      inspectionNotes: visit.notes,
      pros: visit.pros || [],
      cons: visit.cons || [],
    });
    toast.success('Added to property comparison');
  };

  return (
    <div className="pp-container py-12">
      <SEO title="Open Home Tracker — PropertyPath" description="Schedule and track your property inspections and open homes." />

      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <CalendarDays className="h-8 w-8 text-primary mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Open Home Tracker</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Never miss an inspection. Rate properties after you visit and send the best ones to your comparison table.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {upcoming.length} upcoming, {past.length} visited, {past.filter(v => v.rating && v.rating >= 4).length} highly rated
        </div>
        {visits.length > 0 && (
          <ScrollReveal>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <Card className="p-3 text-center">
                <Calendar className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold">{upcoming.length}</p>
                <p className="text-xs text-muted-foreground">Upcoming</p>
              </Card>
              <Card className="p-3 text-center">
                <Home className="h-4 w-4 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold">{past.length}</p>
                <p className="text-xs text-muted-foreground">Visited</p>
              </Card>
              <Card className="p-3 text-center">
                <Star className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                <p className="text-2xl font-bold">{past.filter(v => v.rating && v.rating >= 4).length}</p>
                <p className="text-xs text-muted-foreground">Highly rated</p>
              </Card>
            </div>
          </ScrollReveal>
        )}

        {/* Upcoming visits */}
        {upcoming.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Inspections
            </h2>
            <div className="space-y-3">
              {upcoming.map((visit, i) => (
                <ScrollReveal key={visit.id} delay={i * 60}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm">{visit.propertyAddress}</h3>
                          <Badge variant="secondary" className="text-[10px]">Upcoming</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(visit.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {visit.time}
                          </span>
                          {visit.agentName && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {visit.agentName}
                            </span>
                          )}
                          {visit.price && (
                            <span className="font-medium text-foreground">
                              ${visit.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {visit.notes && (
                          <p className="text-xs text-muted-foreground mt-2">{visit.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleMarkAttended(visit.id)}>
                          <Check className="h-3 w-3" />
                          Attended
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-500 hover:text-rose-600" onClick={() => handleRemove(visit.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Past visits */}
        {past.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Home className="h-5 w-5 text-primary" />
              Visited Properties
            </h2>
            <div className="space-y-3">
              {past.map((visit, i) => (
                <ScrollReveal key={visit.id} delay={i * 60}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-sm">{visit.propertyAddress}</h3>
                          {visit.rating ? (
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <Star key={j} className={`h-3 w-3 ${j < visit.rating! ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                              ))}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-[10px]">Not rated</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(visit.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {visit.price && (
                            <span className="font-medium text-foreground">
                              ${visit.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                        {visit.pros && visit.pros.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {visit.pros.map((pro, j) => (
                              <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {pro}
                              </span>
                            ))}
                          </div>
                        )}
                        {visit.cons && visit.cons.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {visit.cons.map((con, j) => (
                              <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                {con}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleAddToCompare(visit)}>
                          <Scale className="h-3 w-3" />
                          Compare
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-rose-500 hover:text-rose-600" onClick={() => handleRemove(visit.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {visits.length === 0 && (
          <EmptyState
            icon={<CalendarDays className="h-8 w-8 text-slate-400" />}
            title="No open homes tracked"
            description="Add your first inspection to keep track of dates, agents, and your ratings after you visit."
            action={{ label: 'Add first inspection', to: '#' }}
          />
        )}

        {/* Add button */}
        <div className="flex justify-center">
          <AddVisitDialog open={dialogOpen} onOpenChange={setDialogOpen} onAdd={handleAdd} />
        </div>
      </div>

      {/* Rate dialog */}
      <Dialog open={rateDialogOpen} onOpenChange={setRateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate this property</DialogTitle>
          </DialogHeader>
          <RateForm
            address={ratingVisit?.propertyAddress || ''}
            onSubmit={handleRate}
            onCancel={() => { setRateDialogOpen(false); setRatingVisit(null); }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddVisitDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (data: Omit<OpenHomeVisit, 'id' | 'dateAdded'>) => void;
}) {
  const [form, setForm] = useState({
    propertyAddress: '',
    date: '',
    time: '',
    agentName: '',
    agentPhone: '',
    price: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      propertyAddress: form.propertyAddress,
      date: form.date,
      time: form.time,
      agentName: form.agentName || undefined,
      agentPhone: form.agentPhone || undefined,
      price: Number(form.price) || undefined,
      notes: form.notes || undefined,
      status: 'upcoming',
    });
    setForm({ propertyAddress: '', date: '', time: '', agentName: '', agentPhone: '', price: '', notes: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Inspection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add open home inspection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="address">Property Address *</Label>
            <Input id="address" value={form.propertyAddress} onChange={e => setForm(f => ({ ...f, propertyAddress: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input id="time" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="agent">Agent Name</Label>
              <Input id="agent" value={form.agentName} onChange={e => setForm(f => ({ ...f, agentName: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="agentPhone">Agent Phone</Label>
              <Input id="agentPhone" type="tel" value={form.agentPhone} onChange={e => setForm(f => ({ ...f, agentPhone: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label htmlFor="price">Asking Price</Label>
            <Input id="price" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} />
          </div>
          <Button type="submit" className="w-full">Add to Tracker</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RateForm({
  address,
  onSubmit,
  onCancel,
}: {
  address: string;
  onSubmit: (rating: number, notes: string, pros: string, cons: string) => void;
  onCancel: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');

  return (
    <div className="space-y-4 mt-2">
      <p className="text-sm text-muted-foreground">{address}</p>
      <div>
        <Label>Your Rating</Label>
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} type="button" onClick={() => setRating(i + 1)} className="p-1">
              <Star className={`h-6 w-6 transition-colors ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 hover:text-amber-200'}`} />
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="rateNotes">Visit Notes</Label>
        <Textarea id="rateNotes" value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="What did you like or dislike?" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="ratePros">Pros (one per line)</Label>
          <Textarea id="ratePros" value={pros} onChange={e => setPros(e.target.value)} rows={3} />
        </div>
        <div>
          <Label htmlFor="rateCons">Cons (one per line)</Label>
          <Textarea id="rateCons" value={cons} onChange={e => setCons(e.target.value)} rows={3} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Skip</Button>
        <Button className="flex-1" onClick={() => onSubmit(rating, notes, pros, cons)}>Save Rating</Button>
      </div>
    </div>
  );
}
