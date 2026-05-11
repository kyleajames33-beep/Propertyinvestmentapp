import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Home, Building2, TrendingUp, ClipboardCheck, Calculator, Shield,
  Users, ArrowRight, MapPin, Clock, Phone, CheckCircle, MessageSquare,
  Award, ThumbsUp, Search, Calendar, Star
} from 'lucide-react';
import { SEO } from '@/components/SEO';
import { submitToForm, BASIN_ENDPOINT } from '@/lib/forms';

/* â”€â”€ Professional types data â”€â”€ */
interface ProfessionalType {
  id: string;
  label: string;
  tagline: string;
  description: string;
  whenYouNeed: string[];
  avgCost: string;
  timeline: string;
  icon: React.ReactNode;
  color: string;
  stages: string[];
}

const professionalTypes: ProfessionalType[] = [
  {
    id: 'mortgage-broker',
    label: 'Mortgage Broker',
    tagline: 'Compare loans from 40+ lenders',
    description: 'A mortgage broker compares loans across multiple lenders to help you compare rates and structures. They handle the paperwork, negotiate on your behalf, and are paid by the lender â€” not you.',
    whenYouNeed: ['Before you start looking at properties', 'When you want pre-approval', 'When refinancing an existing loan', 'When releasing equity'],
    avgCost: 'Free (paid by lender)',
    timeline: '1-2 weeks for pre-approval',
    icon: <Home className="h-6 w-6" />,
    color: 'bg-blue-600',
    stages: ['Finance Prep', 'Offer Negotiation', 'Settlement'],
  },
  {
    id: 'conveyancer',
    label: 'Conveyancer / Solicitor',
    tagline: 'Handle the legal transfer of property',
    description: 'Your conveyancer manages the legal side of buying property â€” reviewing contracts, conducting searches, handling settlement, and ensuring the title transfers correctly to your name.',
    whenYouNeed: ['Before signing a contract', 'During the cooling-off period', 'Before settlement day'],
    avgCost: '$800 â€“ $2,500',
    timeline: '4-8 weeks (contract to settlement)',
    icon: <Shield className="h-6 w-6" />,
    color: 'bg-emerald-600',
    stages: ['Contract Review', 'Settlement'],
  },
  {
    id: 'buyers-agent',
    label: "Buyer's Agent",
    tagline: 'Represents you, not the seller',
    description: "A buyer's agent works exclusively for you. They find properties that match your criteria, negotiate on your behalf, and can bid at auction on your behalf. They may know off-market opportunities you will not see online.",
    whenYouNeed: ['When you are time-poor or buying interstate', 'When you want access to off-market deals', 'When you need help at auction', 'For investment-grade property selection'],
    avgCost: '$5,000 â€“ $15,000 or 1-2% of purchase price',
    timeline: 'Engage early in your search',
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'bg-violet-600',
    stages: ['Market Research', 'Shortlisting', 'Offer Negotiation'],
  },
  {
    id: 'building-inspector',
    label: 'Building & Pest Inspector',
    tagline: 'Uncover hidden defects before you buy',
    description: 'A thorough building and pest inspection can reveal structural issues, moisture problems, termite damage, and safety hazards. The report gives you negotiating power or the confidence to walk away.',
    whenYouNeed: ['Before exchanging contracts', 'During the cooling-off period', 'For any property older than 10 years'],
    avgCost: '$400 â€“ $800',
    timeline: '2-3 business days for the report',
    icon: <ClipboardCheck className="h-6 w-6" />,
    color: 'bg-amber-600',
    stages: ['Inspection & Due Diligence'],
  },
  {
    id: 'property-manager',
    label: 'Property Manager',
    tagline: 'Manage rentals and tenant relationships',
    description: 'A property manager handles tenant screening, rent collection, maintenance coordination, inspections, and compliance. A good one manages tenants and property maintenance.',
    whenYouNeed: ['Before settlement if buying an investment', 'When your current tenant leaves', 'When switching from self-management'],
    avgCost: '5-10% of weekly rent + letting fees',
    timeline: 'Engage 2-4 weeks before settlement',
    icon: <Building2 className="h-6 w-6" />,
    color: 'bg-teal-600',
    stages: ['Settlement'],
  },
  {
    id: 'accountant',
    label: 'Property Accountant',
    tagline: 'Structure your purchase for tax efficiency',
    description: 'A property-focused accountant helps you understand ownership structures, deductions, depreciation schedules, and capital gains. An accountant may help identify deductions available to you.',
    whenYouNeed: ['Before you buy (to choose the right structure)', 'At tax time', 'When selling or refinancing'],
    avgCost: '$300 â€“ $800 per tax return',
    timeline: 'Book a pre-purchase consultation',
    icon: <Calculator className="h-6 w-6" />,
    color: 'bg-orange-600',
    stages: ['Strategy', 'Finance Prep', 'Settlement'],
  },
  {
    id: 'quantity-surveyor',
    label: 'Quantity Surveyor',
    tagline: 'Prepare depreciation schedules',
    description: 'A quantity surveyor prepares depreciation schedules that explain tax deductions for the building structure and fixtures. The effect on your tax position depends on your circumstances â€” consult a tax professional.',
    whenYouNeed: ['After settlement for investment properties', 'After renovations', 'When claiming depreciation for the first time'],
    avgCost: '$400 â€“ $800',
    timeline: 'Schedule after settlement',
    icon: <Calculator className="h-6 w-6" />,
    color: 'bg-cyan-600',
    stages: ['Settlement'],
  },
  {
    id: 'financial-advisor',
    label: 'Financial Advisor',
    tagline: 'Plan your property purchase within your broader wealth strategy',
    description: 'A financial advisor helps you understand how property fits into your overall financial plan â€” superannuation, retirement, insurance, and estate planning. Essential for downsizers and high-net-worth buyers.',
    whenYouNeed: ['Before making major property decisions', 'When property affects retirement planning', 'When coordinating with SMSF or trusts'],
    avgCost: '$2,000 â€“ $5,000 for a plan',
    timeline: 'Engage 1-2 months before buying',
    icon: <Award className="h-6 w-6" />,
    color: 'bg-rose-600',
    stages: ['Strategy', 'Finance Prep'],
  },
];

/* â”€â”€ Component â”€â”€ */
export function ProfessionalsPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPro, setSelectedPro] = useState<ProfessionalType | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filters = [
    { id: 'all', label: 'All Professionals' },
    { id: 'Finance Prep', label: 'Finance Stage' },
    { id: 'Inspection & Due Diligence', label: 'Inspection Stage' },
    { id: 'Contract Review', label: 'Contract Stage' },
    { id: 'Settlement', label: 'Settlement Stage' },
  ];

  const filtered = professionalTypes.filter(p => {
    const matchesSearch = p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || p.stages.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  const openDialog = (pro: ProfessionalType) => {
    setSelectedPro(pro);
    setSubmitted(false);
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const success = await submitToForm(BASIN_ENDPOINT, {
      ...data,
      professional_type: selectedPro?.id,
      form_name: 'professional_connect',
    });
    if (success || import.meta.env.DEV) {
      setSubmitted(true);
    }
  };

  return (
    <div>
      <SEO title="Find Property Professionals â€” PropertyPath" description="Connect with vetted mortgage brokers, conveyancers, building inspectors, and buyer's agents in NSW." />
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="pp-container pp-section">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20">
              <Users className="h-3 w-3 mr-1" />
              Trusted Network
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-serif">
              Find the Right Professional
            </h1>
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Every property purchase needs a team. We connect you with vetted mortgage brokers, conveyancers, inspectors, and more â€” all experienced with NSW property.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-sm text-slate-400">
              <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-emerald-400" /> Vetted professionals</span>
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-blue-400" /> NSW specialists</span>
              <span className="flex items-center gap-1"><Phone className="h-4 w-4 text-violet-400" /> Free introductions</span>
            </div>
            {/* Free Strategy Call CTA */}
            <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/10 border border-white/20">
              <Calendar className="h-5 w-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-white">Not sure who you need?</p>
                <p className="text-xs text-slate-400">Book a free 15-min strategy call</p>
              </div>
              <Button size="sm" variant="secondary" className="gap-1" asChild>
                <Link to="/strategy-call">Book now <ArrowRight className="h-3 w-3" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="py-8 border-b border-slate-100 bg-white sticky top-[57px] z-30">
        <div className="pp-container">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search professionals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Cards */}
      <section className="pp-section">
        <div className="pp-container">
          <div className="max-w-4xl mx-auto grid gap-6">
            {filtered.map(pro => (
              <div
                key={pro.id}
                className="group border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all bg-white"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-5">
                  {/* Icon */}
                  <div className={`${pro.color} w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
                    {pro.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold font-serif">{pro.label}</h2>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">NSW specialist</span>
                    </div>

                    <p className="text-sm text-slate-500 font-medium">{pro.tagline}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{pro.description}</p>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><span className="font-semibold text-slate-700">Cost:</span> {pro.avgCost}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {pro.timeline}</span>
                    </div>

                    {/* When you need */}
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">When you need them</p>
                      <div className="flex flex-wrap gap-1.5">
                        {pro.whenYouNeed.map((w, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] font-normal">{w}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stage tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {pro.stages.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary font-medium">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex flex-col gap-2 flex-shrink-0 md:pt-2">
                    <Button onClick={() => openDialog(pro)} className="gap-1">
                      <Phone className="h-3.5 w-3.5" />
                      Connect
                    </Button>
                    <Button variant="ghost" size="sm" asChild className="text-xs">
                      <Link to={`/questions`}>
                        Questions to ask
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">No professionals match your search</p>
                <p className="text-sm">Try a different search term or filter</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pp-section bg-white">
        <div className="pp-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight font-serif">What buyers say about our network</h2>
              <p className="text-muted-foreground mt-2">Real introductions, real results.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { quote: "My broker found me a rate 0.4% lower than my bank. The introduction was seamless.", name: "Michael R.", role: "First home buyer, Liverpool", rating: 5 },
                { quote: "The conveyancer PropertyPath introduced caught a boundary issue that saved me from a bad purchase.", name: "Priya S.", role: "Investor, Hornsby", rating: 5 },
                { quote: "I had three quotes within 48 hours. The inspector I chose was thorough and professional.", name: "David T.", role: "First home buyer, Wollongong", rating: 5 },
              ].map((t, i) => (
                <div key={i} className="pp-card text-left hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">&quot;{t.quote}&quot;</p>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="pp-section bg-slate-50">
        {/* Social Proof Bar */}
        <div className="pp-container mb-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl border bg-white p-4">
                <div className="text-2xl font-bold text-primary">240+</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Buyers connected</div>
              </div>
              <div className="rounded-xl border bg-white p-4">
                <div className="text-2xl font-bold text-primary">&lt; 24h</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Average response</div>
              </div>
              <div className="rounded-xl border bg-white p-4">
                <div className="text-2xl font-bold text-primary">4.8/5</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide">Average rating</div>
              </div>
            </div>
          </div>
        </div>
        <div className="pp-container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-serif">How it works</h2>
            <p className="text-muted-foreground mt-2">Three simple steps to get connected</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            {[
              { num: '1', title: 'Tell us what you need', desc: 'Browse professionals or let us suggest options based on your journey stage.', icon: <Search className="h-6 w-6" /> },
              { num: '2', title: 'Get matched', desc: 'We introduce you to 2-3 verified professionals who work with your situation.', icon: <Users className="h-6 w-6" /> },
              { num: '3', title: 'Compare & choose', desc: 'Interview them using our question scripts. Pick the one that feels right. No obligation.', icon: <ThumbsUp className="h-6 w-6" /> },
            ].map(step => (
              <div key={step.num} className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  {step.icon}
                </div>
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 border-t border-slate-100">
        <div className="pp-container">
          <div className="max-w-3xl mx-auto text-center text-xs text-slate-400">
            <p>
              PropertyPath receives referral fees from professionals we introduce you to. This does not affect the cost of their services to you.
              We only work with professionals who meet our quality standards. <Link to="/disclosure" className="underline hover:text-slate-600">Read our disclosure</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPro && <span className={`${selectedPro.color} w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs`}>{selectedPro.icon}</span>}
              Connect with {selectedPro?.label}
            </DialogTitle>
            <DialogDescription>{selectedPro?.description.slice(0, 120)}...</DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-lg">Request sent!</h4>
              <p className="text-sm text-muted-foreground">
                We will introduce you to 2-3 verified {selectedPro?.label.toLowerCase()}s within 24 hours.
              </p>
              <p className="text-xs text-muted-foreground">
                PropertyPath may receive a referral fee. This does not affect the service you receive.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2"><Label htmlFor="name">Full name</Label><Input id="name" name="name" placeholder="Your name" required /></div>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" placeholder="you@example.com" required /></div>
              <div className="space-y-2"><Label htmlFor="phone">Phone (optional)</Label><Input id="phone" name="phone" placeholder="04XX XXX XXX" /></div>
              <div className="space-y-2"><Label htmlFor="suburb">Property suburb or area</Label><Input id="suburb" name="suburb" placeholder="e.g. Parramatta" /></div>
              <div className="space-y-2">
                <Label htmlFor="notes">What do you need help with? (optional)</Label>
                <textarea id="notes" name="notes" className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Briefly describe your situation..." />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="consent" name="consent" required />
                <Label htmlFor="consent" className="text-xs font-normal leading-relaxed">
                  I agree to PropertyPath sharing my details with verified professionals and receiving follow-up communication. I understand PropertyPath may receive a referral fee.
                </Label>
              </div>
              <Button type="submit" className="w-full gap-1">
                <MessageSquare className="h-4 w-4" />
                Request introduction
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Your information is handled per our <Link to="/privacy" className="underline">Privacy Policy</Link>.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}





