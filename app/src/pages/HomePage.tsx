import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import { getRecentCalculators, type RecentCalc } from '@/lib/recent-calculators';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Home, TrendingUp, Building2, ArrowRight, BookOpen, Minimize2,
  ClipboardList, FileQuestion, CheckCircle, Users, Shield, Clock,
  Star, Phone, Search, Calendar, Map, Share2, Scale, CalendarDays, FileCheck, PiggyBank, Truck, ClipboardCheck, MapPin
} from 'lucide-react';
import { EmailCapture } from '@/components/EmailCapture';
import { personaLabels, personaColors, personaDescriptions, stageSlugs, stageOrder, stageTitles, stageDescriptions } from '@/content/metadata';
import type { Persona } from '@/types/content';
import { ProfileSetupModal } from '@/components/MyProfileBadge';
import { BadgePanel } from '@/components/BadgePanel';
import { ReferralProgram } from '@/components/ReferralProgram';
import { PropertyReadinessScore } from '@/components/PropertyReadinessScore';
import { SmartNextSteps } from '@/components/SmartNextSteps';
import { SEO } from '@/components/SEO';
import { ScrollReveal } from '@/components/ScrollReveal';

const personaIcons: Record<Persona, React.ReactNode> = {
  'fhb-oo': <Home className="h-6 w-6" />,
  'inv-new': <TrendingUp className="h-6 w-6" />,
  'inv-exp': <Building2 className="h-6 w-6" />,
  'downsizer': <Minimize2 className="h-6 w-6" />,
};

export function HomePage() {
  const [progress, setProgress] = useState<{ lastStageSlug?: string; lastStageTitle?: string; completedCount: number } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);
  const [recentCalcs, setRecentCalcs] = useState<RecentCalc[]>([]);

  useEffect(() => {
    setRecentCalcs(getRecentCalculators());
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pp_journey_progress');
      if (raw) {
        const data = JSON.parse(raw);
        setProgress({
          lastStageSlug: data.lastStageSlug,
          lastStageTitle: data.lastStageTitle,
          completedCount: (data.completedStages || []).length,
        });
      }
    } catch {}
  }, []);

  return (
    <div>
      <SEO title="PropertyPath — NSW Property Buying Guide" description="Your complete free guide to buying property in NSW. From strategy to settlement, with calculators, checklists, and professional referrals." />
      <ProfileSetupModal open={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* Continue Journey Banner */}
      {progress && progress.lastStageSlug && (
        <section className="bg-primary/5 border-b border-primary/10">
          <div className="pp-container py-4">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <Map className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  Continue where you left off
                </p>
                <p className="text-xs text-muted-foreground">
                  You were reading: {progress.lastStageTitle} · {progress.completedCount} of 8 stages explored
                </p>
                <Progress value={(progress.completedCount / 8) * 100} className="h-1.5 mt-1.5 max-w-xs" />
              </div>
              <Button size="sm" asChild>
                <Link to={`/journey/${progress.lastStageSlug}`}>
                  Resume <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1a2e35] via-[#2d4a3e] to-[#3d5a4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="pp-container pp-section relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Social proof badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
              <div className="flex -space-x-1">
                <span className="w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-900">S</span>
                <span className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold text-amber-900">J</span>
                <span className="w-5 h-5 rounded-full bg-sky-400 flex items-center justify-center text-[10px] font-bold text-sky-900">A</span>
              </div>
              <span className="text-xs text-white/90">Trusted by 240+ NSW buyers</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Save thousands on your first NSW home
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Most first home buyers miss grants, pay too much stamp duty, and choose the wrong professionals. 
              Our 8-step journey makes sure you do not.
            </p>

            {/* Key outcomes */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-300">
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> First Home Buyer Grant</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> Stamp duty exemptions</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> Vetted professionals</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button size="lg" asChild className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                <Link to="/journey">
                  Start your free journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                <Link to="/calculators">
                  <Calculator className="mr-2 h-4 w-4" />
                  Run the numbers
                </Link>
              </Button>
            </div>

            {/* Trust bar */}
            <div className="pt-4 flex flex-wrap justify-center items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400 fill-amber-400" /> 4.9/5 from buyers</span>
              <span>·</span>
              <span>8 journey stages</span>
              <span>·</span>
              <span>23 calculators</span>
              <span>·</span>
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Property Readiness Score */}
      <section className="pp-section bg-muted/30">
        <div className="pp-container">
          <div className="max-w-2xl mx-auto">
            <PropertyReadinessScore />
          </div>
        </div>
      </section>

      {/* Smart Next Steps */}
      <section className="pp-section bg-white">
        <div className="pp-container">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight">Your next steps</h2>
              <p className="text-muted-foreground text-sm mt-1">Personalised recommendations based on your progress.</p>
            </div>
            <SmartNextSteps />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="pp-section bg-white">
        <div className="pp-container">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-serif">How PropertyPath works</h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                We do not replace professionals — we make you smart enough to direct them.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', icon: <Search className="h-5 w-5" />, title: 'Learn', desc: 'Follow our 8-stage journey with calculators, checklists, and reference guides tailored to your situation.' },
              { step: '2', icon: <Star className="h-5 w-5" />, title: 'Prepare', desc: 'Use our question scripts and comparison tools to interview and evaluate professionals with confidence.' },
              { step: '3', icon: <Phone className="h-5 w-5" />, title: 'Connect', desc: 'When you are ready, we introduce you to vetted mortgage brokers, conveyancers, inspectors, and more.' },
            ].map((s, i) => (
              <ScrollReveal key={s.step} delay={i * 100} className="relative text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center mx-auto font-bold text-sm">
                  {s.step}
                </div>
                <h3 className="font-bold text-base flex items-center justify-center gap-2">
                  {s.icon} {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Persona Selection */}
      <section className="pp-section bg-muted/30">
        <div className="pp-container">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Which journey is yours?</h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                Select your buyer type to get content tailored to your situation.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {(['fhb-oo', 'inv-new', 'inv-exp', 'downsizer'] as Persona[]).map((p, i) => (
              <ScrollReveal key={p} delay={i * 80}>
                <Link
                  to={`/journey?persona=${p}`}
                  className="group block"
                >
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-primary/20">
                    <CardHeader className="space-y-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${personaColors[p].split(' ')[0]} ${personaColors[p].split(' ')[1]}`}>
                        {personaIcons[p]}
                      </div>
                      <div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {personaLabels[p]}
                        </CardTitle>
                        <CardDescription className="mt-1.5">
                          {personaDescriptions[p]}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Overview */}
      <section className="pp-section">
        <div className="pp-container">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">The 8-stage journey</h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                From deciding to buy, through to picking up the keys. Every stage covered.
              </p>
            </div>
          </ScrollReveal>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {stageOrder.map((stageId: string, idx: number) => {
                const slug = stageSlugs[stageId];
                const title = stageTitles[stageId] || stageId.split('-').slice(1).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                const description = stageDescriptions[stageId] || '';
                return (
                <Link
                  key={stageId}
                  to={`/journey/${slug}`}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {description}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </Link>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="pp-section bg-muted/30">
        <div className="pp-container">
          <ScrollReveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Tools and resources</h2>
              <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                Everything you need to buy with confidence.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-md transition-shadow hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <BookOpen className="h-5 w-5 text-primary mb-2" />
                <CardTitle className="text-lg">Reference Library</CardTitle>
                <CardDescription>
                  Deep dives into stamp duty, land tax, strata, building inspections, and more.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link to="/reference">Browse references <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <ClipboardList className="h-5 w-5 text-primary mb-2" />
                <CardTitle className="text-lg">Checklists</CardTitle>
                <CardDescription>
                  Printable checklists for every stage. Take them to inspections and meetings.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link to="/checklists">View checklists <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <FileQuestion className="h-5 w-5 text-primary mb-2" />
                <CardTitle className="text-lg">Question Scripts</CardTitle>
                <CardDescription>
                  Questions to ask every professional. Interview brokers, conveyancers, and inspectors with confidence.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link to="/questions">View scripts <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-primary/20 bg-primary/[0.02] hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <Phone className="h-5 w-5 text-primary mb-2" />
                <CardTitle className="text-lg">Find Professionals</CardTitle>
                <CardDescription>
                  Connect with vetted mortgage brokers, conveyancers, inspectors and more. Free introductions.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link to="/professionals">Browse directory <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-emerald-200 bg-emerald-50/50 hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <Calendar className="h-5 w-5 text-emerald-600 mb-2" />
                <CardTitle className="text-lg">Free Strategy Call</CardTitle>
                <CardDescription>
                  Not sure where to start? Book a free 15-minute call with a property strategist. No obligation.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2 text-emerald-600">
                  <Link to="/strategy-call">Book a call <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-primary/20 bg-primary/[0.02] hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <Scale className="h-5 w-5 text-primary mb-2" />
                <CardTitle className="text-lg">Compare Properties</CardTitle>
                <CardDescription>
                  Side-by-side comparison of properties you are considering. Price, stamp duty, strata, commute, and more.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link to="/compare">Start comparing <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-amber-200 bg-amber-50/50 hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <CalendarDays className="h-5 w-5 text-amber-600 mb-2" />
                <CardTitle className="text-lg">Open Home Tracker</CardTitle>
                <CardDescription>
                  Schedule inspections, rate properties after visits, and send favourites to your comparison table.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2 text-amber-600">
                  <Link to="/tracker">Track inspections <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-violet-200 bg-violet-50/50 hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <FileCheck className="h-5 w-5 text-violet-600 mb-2" />
                <CardTitle className="text-lg">Document Tracker</CardTitle>
                <CardDescription>
                  Every document you need from pre-approval to settlement. Track progress, set due dates, stay organised.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2 text-violet-600">
                  <Link to="/documents">Track documents <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-emerald-200 bg-emerald-50/50 hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <PiggyBank className="h-5 w-5 text-emerald-600 mb-2" />
                <CardTitle className="text-lg">Savings Tracker</CardTitle>
                <CardDescription>
                  Log every dollar toward your deposit. Visualise progress with charts, streaks, and projected completion dates.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2 text-emerald-600">
                  <Link to="/savings">Start saving <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-rose-200 bg-rose-50/50 hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <Truck className="h-5 w-5 text-rose-600 mb-2" />
                <CardTitle className="text-lg">Post-Settlement Toolkit</CardTitle>
                <CardDescription>
                  Settlement countdown, moving checklist, utilities, change of address — everything for your first weeks in the new home.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2 text-rose-600">
                  <Link to="/post-settlement">Get organised <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-sky-200 bg-sky-50/50 hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <ClipboardCheck className="h-5 w-5 text-sky-600 mb-2" />
                <CardTitle className="text-lg">Inspection Checklist</CardTitle>
                <CardDescription>
                  Room-by-room checklist for open homes. 40+ checks across 8 categories. Flag concerns for your building inspector.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2 text-sky-600">
                  <Link to="/inspection">Start inspecting <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-indigo-200 bg-indigo-50/50 hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <MapPin className="h-5 w-5 text-indigo-600 mb-2" />
                <CardTitle className="text-lg">Suburb Comparison</CardTitle>
                <CardDescription>
                  Compare suburbs side by side on price, growth, yield, and lifestyle. 12 major NSW markets with radar charts.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2 text-indigo-600">
                  <Link to="/suburbs">Compare suburbs <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-md transition-shadow border-primary/20 bg-primary/[0.02] hover:-translate-y-0.5 transition-transform">
              <CardHeader>
                <Calculator className="h-5 w-5 text-primary mb-2" />
                <CardTitle className="text-lg">Calculators</CardTitle>
                <CardDescription>
                  23 free property calculators — stamp duty, borrowing power, mortgage repayments, and more.
                </CardDescription>
                <Button variant="link" asChild className="p-0 h-auto mt-2">
                  <Link to="/calculators">Open calculators <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
                {recentCalcs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Recently used</p>
                    <div className="flex flex-wrap gap-1.5">
                      {recentCalcs.slice(0, 3).map((calc) => (
                        <Link
                          key={calc.id}
                          to={`/calculators?c=${calc.id}`}
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          {calc.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="pp-section bg-white">
        <div className="pp-container max-w-2xl">
          <BadgePanel />
        </div>
      </section>

      {/* Testimonials */}
      <section className="pp-section bg-white">
        <div className="pp-container">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-serif">What buyers say</h2>
                <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                  Real feedback from NSW property buyers who used PropertyPath.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: "I went from confused to confident in 3 weeks. The checklists alone saved me from missing key inspection items.", name: "Sarah M.", role: "First home buyer, Parramatta", rating: 5 },
                { quote: "The stamp duty calculator showed me I qualified for exemptions I didn't know existed. Saved me $15,000.", name: "James K.", role: "First home buyer, Newcastle", rating: 5 },
                { quote: "Finally, a resource that explains property buying without jargon. I sent the question scripts to my broker.", name: "Aisha T.", role: "Investor, Western Sydney", rating: 5 },
              ].map((t, i) => (
                <ScrollReveal key={i} delay={i * 120} className="pp-card text-left hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-4">&quot;{t.quote}&quot;</p>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Share / Refer */}
      <section className="pp-section bg-primary/5">
        <div className="pp-container">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Know someone buying property?</h2>
            <p className="text-muted-foreground">
              Share PropertyPath with friends and family who are navigating the NSW property market.
            </p>
            <Button onClick={() => setReferralOpen(true)} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share PropertyPath
            </Button>
            <ReferralProgram open={referralOpen} onClose={() => setReferralOpen(false)} />
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="pp-section">
        <div className="pp-container">
          <EmailCapture variant="default" />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="pp-section">
        <div className="pp-container">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <CheckCircle className="h-6 w-6 text-primary mx-auto" />
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-muted-foreground">Journey stages</div>
              </div>
              <div className="space-y-2">
                <Users className="h-6 w-6 text-primary mx-auto" />
                <div className="text-2xl font-bold">4</div>
                <div className="text-sm text-muted-foreground">Buyer types</div>
              </div>
              <div className="space-y-2">
                <Shield className="h-6 w-6 text-primary mx-auto" />
                <div className="text-2xl font-bold">23</div>
                <div className="text-sm text-muted-foreground">Free calculators</div>
              </div>
              <div className="space-y-2">
                <Clock className="h-6 w-6 text-primary mx-auto" />
                <div className="text-2xl font-bold">NSW</div>
                <div className="text-sm text-muted-foreground">State focused</div>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}


