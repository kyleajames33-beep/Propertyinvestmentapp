import { useState, useMemo } from 'react';
import { suburbDatabase, compareSuburbs, searchSuburbs, formatPrice, type SuburbData } from '@/lib/suburbData';
import { SEO } from '@/components/SEO';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MapPin, Search, X, TrendingUp, TrendingDown, Train, School, Building2,
  ArrowRight, Check, Home, Building, Clock, Percent, Users, Star,
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { storage } from '@/lib/storage';

const COMPARE_KEY = 'suburb_comparison';

function getSavedComparison(): string[] {
  return storage.get<string[]>(COMPARE_KEY, []);
}

function saveComparison(ids: string[]) {
  storage.set(COMPARE_KEY, ids);
}

export function SuburbComparisonPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>(getSavedComparison);
  const [search, setSearch] = useState('');

  const compared = useMemo(() => compareSuburbs(selectedIds), [selectedIds]);
  const searchResults = useMemo(() => search ? searchSuburbs(search).filter(s => !selectedIds.includes(s.id)) : [], [search, selectedIds]);

  const toggleSuburb = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter(s => s.id !== id)
      : selectedIds.length >= 4
      ? selectedIds
      : [...selectedIds, id];
    setSelectedIds(next);
    saveComparison(next);
  };

  const radarData = useMemo(() => {
    if (compared.length === 0) return [];
    const maxPrice = Math.max(...suburbDatabase.map(s => s.medianHouse));
    return [
      { metric: 'Affordability', ...Object.fromEntries(compared.map(s => [s.name, 100 - (s.medianHouse / maxPrice) * 100])) },
      { metric: 'Growth', ...Object.fromEntries(compared.map(s => [s.name, Math.min(100, s.annualGrowth * 10)])) },
      { metric: 'Yield', ...Object.fromEntries(compared.map(s => [s.name, s.rentalYield * 20])) },
      { metric: 'Liquidity', ...Object.fromEntries(compared.map(s => [s.name, Math.min(100, 100 - s.daysOnMarket)])) },
      { metric: 'Demand', ...Object.fromEntries(compared.map(s => [s.name, s.clearanceRate])) },
    ];
  }, [compared]);

  const bestIn = (key: keyof SuburbData, highest: boolean = true): SuburbData | null => {
    if (compared.length === 0) return null;
    const sorted = [...compared].sort((a, b) => highest ? (b[key] as number) - (a[key] as number) : (a[key] as number) - (b[key] as number));
    return sorted[0];
  };

  return (
    <div className="pp-container py-12">
      <SEO title="Suburb Comparison — PropertyPath" description="Compare NSW suburbs side by side on price, growth, yield, and lifestyle." />

      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Suburb Comparison</h1>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
              Compare up to 4 NSW suburbs on price, growth, rental yield, auction clearance, and lifestyle. Find the right fit for your strategy.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Data is estimated for demonstration purposes. Verify current figures with CoreLogic or your agent before making decisions.
            </p>
          </div>
        </ScrollReveal>

        {/* Search + selected */}
        <ScrollReveal>
          <div className="mb-8">
            <div className="relative max-w-md mx-auto mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suburbs or regions..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="max-w-md mx-auto space-y-1 mb-4">
                {searchResults.slice(0, 5).map(suburb => (
                  <button
                    key={suburb.id}
                    onClick={() => toggleSuburb(suburb.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-medium">{suburb.name}</p>
                      <p className="text-xs text-muted-foreground">{suburb.region} · {formatPrice(suburb.medianHouse)}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      Add
                    </Button>
                  </button>
                ))}
              </div>
            )}

            {/* Selected chips */}
            {selectedIds.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {compared.map(suburb => (
                  <Badge key={suburb.id} variant="secondary" className="text-xs gap-1 py-1.5 px-2">
                    {suburb.name}
                    <button onClick={() => toggleSuburb(suburb.id)} className="hover:text-rose-500">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {compared.length > 0 && (
          <>
            {/* Radar chart */}
            {compared.length >= 2 && (
              <ScrollReveal>
                <Card className="p-4 mb-8">
                  <h3 className="text-sm font-semibold mb-4 text-center">Suburb Profile Comparison</h3>
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                      {compared.map((suburb, i) => {
                        const colours = ['#2d6a4f', '#40916c', '#74c69d', '#b7e4c7'];
                        return <Radar key={suburb.id} name={suburb.name} dataKey={suburb.name} stroke={colours[i]} fill={colours[i]} fillOpacity={0.15} />;
                      })}
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </ScrollReveal>
            )}

            {/* Best in category */}
            <ScrollReveal>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {(() => {
                  const cheapest = bestIn('medianHouse', false);
                  const highestGrowth = bestIn('annualGrowth');
                  const bestYield = bestIn('rentalYield');
                  const fastestSale = bestIn('daysOnMarket', false);
                  return [
                    { label: 'Most Affordable', suburb: cheapest, icon: <TrendingDown className="h-4 w-4" />, value: cheapest ? formatPrice(cheapest.medianHouse) : '—' },
                    { label: 'Highest Growth', suburb: highestGrowth, icon: <TrendingUp className="h-4 w-4" />, value: highestGrowth ? `${highestGrowth.annualGrowth}%` : '—' },
                    { label: 'Best Yield', suburb: bestYield, icon: <Percent className="h-4 w-4" />, value: bestYield ? `${bestYield.rentalYield}%` : '—' },
                    { label: 'Fastest Sale', suburb: fastestSale, icon: <Clock className="h-4 w-4" />, value: fastestSale ? `${fastestSale.daysOnMarket} days` : '—' },
                  ].map((item, i) => (
                    <Card key={i} className="p-3 text-center">
                      <div className="flex justify-center mb-1 text-primary">{item.icon}</div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-bold text-sm">{item.value}</p>
                      {item.suburb && <p className="text-[10px] text-muted-foreground">{item.suburb.name}</p>}
                    </Card>
                  ));
                })()}
              </div>
            </ScrollReveal>

            {/* Comparison table */}
            <ScrollReveal>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full min-w-[600px] border-collapse" role="table" aria-label="Suburb comparison">
                  <caption className="sr-only">Side-by-side suburb comparison</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="text-left p-3 text-sm font-medium text-muted-foreground">Metric</th>
                      {compared.map(s => (
                        <th scope="col" key={s.id} className="p-3 text-left min-w-[140px]">
                          <p className="font-semibold text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.region}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <CompRow label="Median House" icon={<Home className="h-4 w-4" />} compared={compared} get={s => formatPrice(s.medianHouse)} best={s => s.medianHouse === Math.min(...compared.map(x => x.medianHouse))} />
                    <CompRow label="Median Unit" icon={<Building className="h-4 w-4" />} compared={compared} get={s => formatPrice(s.medianUnit)} best={s => s.medianUnit === Math.min(...compared.map(x => x.medianUnit))} />
                    <CompRow label="Annual Growth" icon={<TrendingUp className="h-4 w-4" />} compared={compared} get={s => `${s.annualGrowth}%`} best={s => s.annualGrowth === Math.max(...compared.map(x => x.annualGrowth))} />
                    <CompRow label="Rental Yield" icon={<Percent className="h-4 w-4" />} compared={compared} get={s => `${s.rentalYield}%`} best={s => s.rentalYield === Math.max(...compared.map(x => x.rentalYield))} />
                    <CompRow label="Vacancy Rate" icon={<Building2 className="h-4 w-4" />} compared={compared} get={s => `${s.vacancyRate}%`} best={s => s.vacancyRate === Math.min(...compared.map(x => x.vacancyRate))} />
                    <CompRow label="Days on Market" icon={<Clock className="h-4 w-4" />} compared={compared} get={s => `${s.daysOnMarket} days`} best={s => s.daysOnMarket === Math.min(...compared.map(x => x.daysOnMarket))} />
                    <CompRow label="Clearance Rate" icon={<TrendingUp className="h-4 w-4" />} compared={compared} get={s => `${s.clearanceRate}%`} best={s => s.clearanceRate === Math.max(...compared.map(x => x.clearanceRate))} />
                    <CompRow label="To CBD" icon={<MapPin className="h-4 w-4" />} compared={compared} get={s => `${s.distanceToCBD} km`} best={s => s.distanceToCBD === Math.min(...compared.map(x => x.distanceToCBD))} />
                    <CompRow label="Train Line" icon={<Train className="h-4 w-4" />} compared={compared} get={s => s.trainLine ? 'Yes' : 'No'} best={s => s.trainLine} />
                    <CompRow label="School Rating" icon={<School className="h-4 w-4" />} compared={compared} get={s => s.schoolRating.charAt(0).toUpperCase() + s.schoolRating.slice(1)} best={s => s.schoolRating === 'high'} />
                    <tr className="border-t">
                      <th scope="row" className="p-3 text-muted-foreground font-medium">Lifestyle</th>
                      {compared.map(s => (
                        <td key={s.id} className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {s.lifestyle.map(l => (
                              <span key={l} className="text-[10px] px-2 py-0.5 rounded-full bg-muted">{l}</span>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </>
        )}

        {compared.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-800 mb-1">No suburbs selected</h3>
            <p className="text-sm text-slate-500 mb-4">Search and select up to 4 suburbs to compare.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suburbDatabase.slice(0, 4).map(s => (
                <Button key={s.id} size="sm" variant="outline" onClick={() => toggleSuburb(s.id)}>
                  {s.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CompRow({
  label,
  icon,
  compared,
  get,
  best,
}: {
  label: string;
  icon: React.ReactNode;
  compared: SuburbData[];
  get: (s: SuburbData) => string;
  best: (s: SuburbData) => boolean;
}) {
  return (
    <tr className="border-t hover:bg-muted/30 transition-colors">
      <th scope="row" className="p-3 text-muted-foreground font-medium flex items-center gap-2">
        {icon}
        {label}
      </th>
      {compared.map(s => {
        const isBest = best(s);
        return (
          <td key={s.id} className="p-3">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isBest ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}`}>
              {get(s)}
              {isBest && <Check className="h-3 w-3" />}
            </span>
          </td>
        );
      })}
    </tr>
  );
}
