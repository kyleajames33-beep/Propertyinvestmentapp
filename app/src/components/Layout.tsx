import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight, Menu, X, Map, BookOpen, FileQuestion, ClipboardList, Calculator, GitBranch, Phone, Heart, Scale, CalendarDays, FileCheck, PiggyBank, Truck, ClipboardCheck, MapPin } from 'lucide-react';
import { useState } from 'react';
import { stageSlugs, stageOrder, stageTitles } from '@/content/metadata';
import { ExitIntentPopup } from './ExitIntentPopup';
import { CommandSearch } from './CommandSearch';
import { MyProfileBadge } from './MyProfileBadge';
import { ReferralProgram } from './ReferralProgram';
import { ThemeToggle } from './ThemeToggle';
import { ScrollToTop } from './ScrollToTop';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { InstallPrompt } from './InstallPrompt';
import { MobileBottomNav } from './MobileBottomNav';
import { JourneyProgressBar } from './JourneyProgressBar';

const navStages = stageOrder.map((id, idx) => ({
  id,
  number: idx + 1,
  title: stageTitles[id] || id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
  slug: stageSlugs[id],
}));

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [referralOpen, setReferralOpen] = useState(false);

  const isJourneyPage = location.pathname.startsWith('/journey/');
  const currentStageSlug = isJourneyPage ? location.pathname.split('/journey/')[1]?.split('/')[0] : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="pp-container">
          <div className="flex h-14 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <Map className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg tracking-tight group-hover:text-primary transition-colors">
                PropertyPath
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" icon={<Home className="h-4 w-4" />} label="Home" active={location.pathname === '/'} />
              <NavLink to="/journey" icon={<Map className="h-4 w-4" />} label="Journey" active={location.pathname === '/journey' || isJourneyPage} />
              <NavLink to="/reference" icon={<BookOpen className="h-4 w-4" />} label="Reference" active={location.pathname.startsWith('/reference')} />
              <NavLink to="/calculators" icon={<Calculator className="h-4 w-4" />} label="Calculators" active={location.pathname === '/calculators'} />
              <NavLink to="/tools" icon={<GitBranch className="h-4 w-4" />} label="Tools" active={location.pathname === '/tools'} />
              <NavLink to="/professionals" icon={<Phone className="h-4 w-4" />} label="Professionals" active={location.pathname === '/professionals' || location.pathname === '/strategy-call'} />
              <NavLink to="/checklists" icon={<ClipboardList className="h-4 w-4" />} label="Checklists" active={location.pathname === '/checklists'} />
              <NavLink to="/questions" icon={<FileQuestion className="h-4 w-4" />} label="Questions" active={location.pathname === '/questions'} />
              <NavLink to="/saved" icon={<Heart className="h-4 w-4" />} label="Saved" active={location.pathname === '/saved'} />
              <NavLink to="/compare" icon={<Scale className="h-4 w-4" />} label="Compare" active={location.pathname === '/compare'} />
              <NavLink to="/tracker" icon={<CalendarDays className="h-4 w-4" />} label="Tracker" active={location.pathname === '/tracker'} />
            </nav>

            {/* Search + Profile + Theme */}
            <div className="hidden md:flex items-center gap-2">
              <CommandSearch />
              <ThemeToggle />
              <MyProfileBadge />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-muted"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="pp-container py-2 space-y-1">
              <MobileNavLink to="/" label="Home" active={location.pathname === '/'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/journey" label="Journey" active={location.pathname === '/journey' || isJourneyPage} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/reference" label="Reference" active={location.pathname.startsWith('/reference')} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/calculators" label="Calculators" active={location.pathname === '/calculators'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/tools" label="Tools" active={location.pathname === '/tools'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/professionals" label="Professionals" active={location.pathname === '/professionals' || location.pathname === '/strategy-call'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/checklists" label="Checklists" active={location.pathname === '/checklists'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/questions" label="Questions" active={location.pathname === '/questions'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/saved" label="Saved" active={location.pathname === '/saved'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/compare" label="Compare" active={location.pathname === '/compare'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/tracker" label="Tracker" active={location.pathname === '/tracker'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/documents" label="Documents" active={location.pathname === '/documents'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/savings" label="Savings" active={location.pathname === '/savings'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/post-settlement" label="Moving" active={location.pathname === '/post-settlement'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/inspection" label="Inspect" active={location.pathname === '/inspection'} onClick={() => setMobileMenuOpen(false)} />
              <MobileNavLink to="/suburbs" label="Suburbs" active={location.pathname === '/suburbs'} onClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* Journey Progress Bar */}
      <JourneyProgressBar />

      {/* Breadcrumbs */}
      {isJourneyPage && currentStageSlug && (
        <div className="border-b bg-muted/30">
          <div className="pp-container py-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to="/journey" className="hover:text-foreground transition-colors">Journey</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">
                {navStages.find(s => s.slug === currentStageSlug)?.title || 'Stage'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content" className="flex-1 md:pb-0 pb-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="pp-container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Map className="h-4 w-4 text-primary" />
                <span className="font-semibold">PropertyPath</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your complete guide to buying property in NSW. Educational content, not financial advice.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Journey Stages</h4>
              <ul className="space-y-1.5">
                {navStages.slice(0, 4).map(stage => (
                  <li key={stage.id}>
                    <Link to={`/journey/${stage.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {stage.number}. {stage.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-1.5">
                <li><Link to="/reference" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reference Library</Link></li>
                <li><Link to="/professionals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Find Professionals</Link></li>
                <li><Link to="/checklists" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Checklists</Link></li>
                <li><Link to="/questions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Question Scripts</Link></li>
                <li><Link to="/compare" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compare Properties</Link></li>
                <li><Link to="/tracker" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Open Home Tracker</Link></li>
                <li><Link to="/documents" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Document Tracker</Link></li>
                <li><Link to="/savings" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Savings Tracker</Link></li>
                <li><Link to="/post-settlement" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Post-Settlement</Link></li>
                <li><Link to="/inspection" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Inspection Checklist</Link></li>
                <li><Link to="/suburbs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Suburb Comparison</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Important</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This website provides general information only and does not constitute financial, legal, or tax advice. 
                You should seek independent professional advice before making property decisions. 
                PropertyPath may receive referral fees from professionals we introduce you to.
                <Link to="/disclosure" className="underline ml-1">Read our disclosure.</Link>
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
            <p className="mb-2">
              PropertyPath Australia. All content is for educational purposes only.
              <Link to="/privacy" className="underline ml-1">Privacy Policy</Link>
              <span className="mx-2">|</span>
              <Link to="/disclosure" className="underline">Referral Disclosure</Link>
              <span className="mx-2">|</span>
              <button onClick={() => setReferralOpen(true)} className="underline hover:text-foreground transition-colors">Share with a friend</button>
            </p>
            <ReferralProgram open={referralOpen} onClose={() => setReferralOpen(false)} />
          </div>
        </div>
      </footer>
      <ScrollToTop />
      <KeyboardShortcuts />
      <InstallPrompt />
      <ExitIntentPopup />
      <MobileBottomNav />
    </div>
  );
}

function NavLink({ to, icon, label, active, className }: { to: string; icon: React.ReactNode; label: string; active: boolean; className?: string }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      } ${className || ''}`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({ to, label, active, onClick }: { to: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'
      }`}
    >
      {label}
    </Link>
  );
}


