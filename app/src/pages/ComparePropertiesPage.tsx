import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getComparedProperties,
  addComparedProperty,
  removeComparedProperty,
  updateComparedProperty,
  getPropertyComparisonStats,
  formatCurrency,
  type ComparedProperty,
} from '@/lib/compareProperties';
import { SEO } from '@/components/SEO';
import { ScrollReveal } from '@/components/ScrollReveal';
import { EmptyState } from '@/components/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Scale, Plus, Trash2, TrendingDown, TrendingUp, Clock, Home, Car, Droplets,
  Bed, Bath, ParkingSquare, Ruler, Star, ArrowRight, Check, X,
} from 'lucide-react';
import { toast } from 'sonner';

export function ComparePropertiesPage() {
  const [properties, setProperties] = useState<ComparedProperty[]>(getComparedProperties());
  const [dialogOpen, setDialogOpen] = useState(false);

  const refresh = () => setProperties(getComparedProperties());

  const handleAdd = (data: Omit<ComparedProperty, 'id' | 'dateAdded'>) => {
    if (properties.length >= 4) {
      toast.error('You can compare up to 4 properties at a time');
      return;
    }
    addComparedProperty(data);
    refresh();
    setDialogOpen(false);
    toast.success('Property added to comparison');
  };

  const handleRemove = (id: string) => {
    removeComparedProperty(id);
    refresh();
    toast.success('Property removed');
  };

  const handleScore = (id: string, score: number) => {
    updateComparedProperty(id, { score });
    refresh();
  };

  const stats = getPropertyComparisonStats(properties);

  return (
    <div className="pp-container py-12">
      <SEO title="Compare Properties — PropertyPath" description="Side-by-side comparison of properties you are considering." />

      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <Scale className="h-8 w-8 text-primary mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Compare Properties</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Save properties you are considering and compare them side by side. 
              The best value in each category is highlighted automatically.
            </p>
          </div>
        </ScrollReveal>

        {properties.length === 0 ? (
          <EmptyState
            icon={<Scale className="h-8 w-8 text-slate-400" />}
            title="No properties to compare"
            description="Add your first property to start comparing. You can save up to 4 properties side by side."
            action={{ label: 'Add first property', to: '#' }}
          />
        ) : (
          <>
            {/* Stats bar */}
            {stats && (
              <ScrollReveal>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                  {stats.cheapest !== null && (
                    <Card className="p-3 text-center border-emerald-200 bg-emerald-50/50">
                      <TrendingDown className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Lowest Price</p>
                      <p className="font-bold text-emerald-700">{formatCurrency(stats.cheapest)}</p>
                    </Card>
                  )}
                  {stats.avgPrice !== null && (
                    <Card className="p-3 text-center">
                      <TrendingUp className="h-4 w-4 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Average Price</p>
                      <p className="font-bold">{formatCurrency(stats.avgPrice)}</p>
                    </Card>
                  )}
                  {stats.lowestStampDuty !== null && (
                    <Card className="p-3 text-center">
                      <Home className="h-4 w-4 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Lowest Stamp Duty</p>
                      <p className="font-bold">{formatCurrency(stats.lowestStampDuty)}</p>
                    </Card>
                  )}
                  {stats.shortestCommute !== null && (
                    <Card className="p-3 text-center border-blue-200 bg-blue-50/50">
                      <Clock className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Shortest Commute</p>
                      <p className="font-bold text-blue-700">{stats.shortestCommute} min</p>
                    </Card>
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* Comparison table */}
            <ScrollReveal>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full min-w-[600px] border-collapse" role="table" aria-label="Property comparison">
                  <caption className="sr-only">Side-by-side comparison of saved properties</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="text-left p-3 text-sm font-medium text-muted-foreground w-40">Property</th>
                      {properties.map(p => (
                        <th scope="col" key={p.id} className="p-3 text-left min-w-[180px]">
                          <div className="space-y-1">
                            <p className="font-semibold text-sm">{p.address}</p>
                            {p.score !== undefined && (
                              <div className="flex items-center gap-1" role="group" aria-label={`Rating for ${p.address}`}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <button
                                    key={i}
                                    type="button"
                                    aria-label={`Rate ${i + 1} out of 5 stars`}
                                    className="p-0.5"
                                    onClick={() => handleScore(p.id, i + 1)}
                                  >
                                    <Star
                                      className={`h-3 w-3 ${
                                        i < p.score! ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-auto p-0 text-xs text-rose-500 hover:text-rose-600"
                              onClick={() => handleRemove(p.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <ComparisonRow
                      label="Price"
                      icon={<TrendingUp className="h-4 w-4" />}
                      properties={properties}
                      render={p => formatCurrency(p.price)}
                      best={p => p.price === stats?.cheapest}
                      worst={p => p.price === stats?.mostExpensive}
                    />
                    <ComparisonRow
                      label="Stamp Duty"
                      icon={<Home className="h-4 w-4" />}
                      properties={properties}
                      render={p => formatCurrency(p.stampDuty)}
                      best={p => p.stampDuty === stats?.lowestStampDuty}
                    />
                    <ComparisonRow
                      label="Strata / Quarter"
                      icon={<Droplets className="h-4 w-4" />}
                      properties={properties}
                      render={p => p.strataFees ? formatCurrency(p.strataFees) : '—'}
                      best={p => p.strataFees === stats?.lowestStrata}
                    />
                    <ComparisonRow
                      label="Council Rates"
                      icon={<Home className="h-4 w-4" />}
                      properties={properties}
                      render={p => p.councilRates ? formatCurrency(p.councilRates) : '—'}
                      best={() => false}
                    />
                    <ComparisonRow
                      label="Water Rates"
                      icon={<Droplets className="h-4 w-4" />}
                      properties={properties}
                      render={p => p.waterRates ? formatCurrency(p.waterRates) : '—'}
                      best={() => false}
                    />
                    <ComparisonRow
                      label="Bedrooms"
                      icon={<Bed className="h-4 w-4" />}
                      properties={properties}
                      render={p => p.bedrooms?.toString() || '—'}
                      best={p => p.bedrooms === Math.max(...properties.map(x => x.bedrooms || 0))}
                    />
                    <ComparisonRow
                      label="Bathrooms"
                      icon={<Bath className="h-4 w-4" />}
                      properties={properties}
                      render={p => p.bathrooms?.toString() || '—'}
                      best={p => p.bathrooms === Math.max(...properties.map(x => x.bathrooms || 0))}
                    />
                    <ComparisonRow
                      label="Parking"
                      icon={<ParkingSquare className="h-4 w-4" />}
                      properties={properties}
                      render={p => p.parking?.toString() || '—'}
                      best={p => p.parking === Math.max(...properties.map(x => x.parking || 0))}
                    />
                    <ComparisonRow
                      label="Land Size"
                      icon={<Ruler className="h-4 w-4" />}
                      properties={properties}
                      render={p => p.landSize ? `${p.landSize}m²` : '—'}
                      best={p => p.landSize === Math.max(...properties.map(x => x.landSize || 0))}
                    />
                    <ComparisonRow
                      label="Commute"
                      icon={<Car className="h-4 w-4" />}
                      properties={properties}
                      render={p => p.commuteTime ? `${p.commuteTime} min` : '—'}
                      best={p => p.commuteTime === stats?.shortestCommute}
                    />
                    <ComparisonRow
                      label="Total Cost (1yr)"
                      icon={<TrendingUp className="h-4 w-4" />}
                      properties={properties}
                      render={p => {
                        const total = p.price + p.stampDuty + ((p.strataFees || 0) * 4) + ((p.councilRates || 0) + (p.waterRates || 0));
                        return formatCurrency(total);
                      }}
                      best={p => {
                        const totals = properties.map(x => x.price + x.stampDuty + ((x.strataFees || 0) * 4) + ((x.councilRates || 0) + (x.waterRates || 0)));
                        return p.price + p.stampDuty + ((p.strataFees || 0) * 4) + ((p.councilRates || 0) + (p.waterRates || 0)) === Math.min(...totals);
                      }}
                    />
                    <tr className="border-t">
                      <th scope="row" className="p-3 text-muted-foreground font-medium">Pros</th>
                      {properties.map(p => (
                        <td key={p.id} className="p-3 align-top">
                          <ul className="space-y-1">
                            {p.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-1 text-xs">
                                <Check className="h-3 w-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <th scope="row" className="p-3 text-muted-foreground font-medium">Cons</th>
                      {properties.map(p => (
                        <td key={p.id} className="p-3 align-top">
                          <ul className="space-y-1">
                            {p.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-1 text-xs">
                                <X className="h-3 w-3 text-rose-500 mt-0.5 flex-shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t">
                      <th scope="row" className="p-3 text-muted-foreground font-medium">Notes</th>
                      {properties.map(p => (
                        <td key={p.id} className="p-3 align-top">
                          <p className="text-xs text-muted-foreground whitespace-pre-wrap">{p.inspectionNotes || '—'}</p>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </>
        )}

        {/* Add property button */}
        <div className="flex justify-center mt-8">
          <AddPropertyDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onAdd={handleAdd}
            disabled={properties.length >= 4}
          />
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  icon,
  properties,
  render,
  best,
  worst,
}: {
  label: string;
  icon: React.ReactNode;
  properties: ComparedProperty[];
  render: (p: ComparedProperty) => string;
  best: (p: ComparedProperty) => boolean;
  worst?: (p: ComparedProperty) => boolean;
}) {
  return (
    <tr className="border-t hover:bg-muted/30 transition-colors">
      <th scope="row" className="p-3 text-muted-foreground font-medium flex items-center gap-2">
        {icon}
        {label}
      </th>
      {properties.map(p => {
        const isBest = best(p);
        const isWorst = worst?.(p);
        return (
          <td key={p.id} className="p-3">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                isBest
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : isWorst
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : ''
              }`}
            >
              {render(p)}
              {isBest && <Check className="h-3 w-3" />}
            </span>
          </td>
        );
      })}
    </tr>
  );
}

function AddPropertyDialog({
  open,
  onOpenChange,
  onAdd,
  disabled,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAdd: (data: Omit<ComparedProperty, 'id' | 'dateAdded'>) => void;
  disabled: boolean;
}) {
  const [form, setForm] = useState({
    address: '',
    price: '',
    stampDuty: '',
    strataFees: '',
    councilRates: '',
    waterRates: '',
    bedrooms: '',
    bathrooms: '',
    parking: '',
    landSize: '',
    commuteTime: '',
    inspectionNotes: '',
    pros: '',
    cons: '',
    score: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      address: form.address,
      price: Number(form.price) || 0,
      stampDuty: Number(form.stampDuty) || 0,
      strataFees: Number(form.strataFees) || undefined,
      councilRates: Number(form.councilRates) || undefined,
      waterRates: Number(form.waterRates) || undefined,
      bedrooms: Number(form.bedrooms) || undefined,
      bathrooms: Number(form.bathrooms) || undefined,
      parking: Number(form.parking) || undefined,
      landSize: Number(form.landSize) || undefined,
      commuteTime: Number(form.commuteTime) || undefined,
      inspectionNotes: form.inspectionNotes || undefined,
      pros: form.pros.split('\n').filter(Boolean),
      cons: form.cons.split('\n').filter(Boolean),
      score: Number(form.score) || undefined,
    });
    setForm({
      address: '', price: '', stampDuty: '', strataFees: '', councilRates: '',
      waterRates: '', bedrooms: '', bathrooms: '', parking: '', landSize: '',
      commuteTime: '', inspectionNotes: '', pros: '', cons: '', score: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Property
          {disabled && <span className="text-xs opacity-70">(max 4)</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add property to compare</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="address">Address *</Label>
            <Input id="address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input id="price" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
            </div>
            <div>
              <Label htmlFor="stampDuty">Stamp Duty *</Label>
              <Input id="stampDuty" type="number" value={form.stampDuty} onChange={e => setForm(f => ({ ...f, stampDuty: e.target.value }))} required />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="strataFees">Strata/qtr</Label>
              <Input id="strataFees" type="number" value={form.strataFees} onChange={e => setForm(f => ({ ...f, strataFees: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="councilRates">Council/yr</Label>
              <Input id="councilRates" type="number" value={form.councilRates} onChange={e => setForm(f => ({ ...f, councilRates: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="waterRates">Water/yr</Label>
              <Input id="waterRates" type="number" value={form.waterRates} onChange={e => setForm(f => ({ ...f, waterRates: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div>
              <Label htmlFor="bedrooms">Beds</Label>
              <Input id="bedrooms" type="number" value={form.bedrooms} onChange={e => setForm(f => ({ ...f, bedrooms: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="bathrooms">Baths</Label>
              <Input id="bathrooms" type="number" value={form.bathrooms} onChange={e => setForm(f => ({ ...f, bathrooms: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="parking">Parking</Label>
              <Input id="parking" type="number" value={form.parking} onChange={e => setForm(f => ({ ...f, parking: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="landSize">Land m²</Label>
              <Input id="landSize" type="number" value={form.landSize} onChange={e => setForm(f => ({ ...f, landSize: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label htmlFor="commuteTime">Commute (minutes)</Label>
            <Input id="commuteTime" type="number" value={form.commuteTime} onChange={e => setForm(f => ({ ...f, commuteTime: e.target.value }))} />
          </div>
          <div>
            <Label htmlFor="inspectionNotes">Inspection Notes</Label>
            <Textarea id="inspectionNotes" value={form.inspectionNotes} onChange={e => setForm(f => ({ ...f, inspectionNotes: e.target.value }))} rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="pros">Pros (one per line)</Label>
              <Textarea id="pros" value={form.pros} onChange={e => setForm(f => ({ ...f, pros: e.target.value }))} rows={3} />
            </div>
            <div>
              <Label htmlFor="cons">Cons (one per line)</Label>
              <Textarea id="cons" value={form.cons} onChange={e => setForm(f => ({ ...f, cons: e.target.value }))} rows={3} />
            </div>
          </div>
          <Button type="submit" className="w-full">Add to Comparison</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
