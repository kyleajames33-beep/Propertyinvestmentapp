import { Card } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuditPage() {
  return (
    <div className="pp-container py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">PropertyPath Audit Report</h1>
        <p className="text-muted-foreground mb-8">Honest assessment of what works, what does not, and what to fix.</p>

        <div className="space-y-6">
          <AuditSection title="Will users want to use this?" score={7}>
            <AuditItem status="good" text="Feature breadth is excellent — covers entire property lifecycle" />
            <AuditItem status="good" text="Checkpoint journey prevents wall-of-text overwhelm" />
            <AuditItem status="good" text="Calculators are practical and NSW-specific" />
            <AuditItem status="bad" text="No clear 'aha moment' on first visit — value prop is vague" />
            <AuditItem status="bad" text="Hero headline 'Buy property with confidence' is generic and forgettable" />
            <AuditItem status="bad" text="No social proof above the fold — testimonials are buried" />
            <AuditItem status="bad" text="Smart Next Steps exists but is below the fold on mobile" />
            <AuditItem status="fix" text="Fix: Lead with a concrete outcome — 'Save $15,000 on your first home'" />
            <AuditItem status="fix" text="Fix: Move testimonial + star rating into hero section" />
          </AuditSection>

          <AuditSection title="Will they tell their friends?" score={5}>
            <AuditItem status="good" text="Share cards exist for calculator results" />
            <AuditItem status="good" text="Referral modal with gamification (share 3 = unlock toolkit)" />
            <AuditItem status="bad" text="Referral incentive is weak — 'Premium Toolkit' is not compelling enough" />
            <AuditItem status="bad" text="No viral loop in calculators — results are not inherently shareable" />
            <AuditItem status="bad" text="No 'I just completed Stage 3' social proof integration" />
            <AuditItem status="bad" text="Share link uses base64 of email — looks spammy and untrustworthy" />
            <AuditItem status="fix" text="Fix: Replace toolkit incentive with real value — 'Get a free 15-min strategy call'" />
            <AuditItem status="fix" text="Fix: Make calculator results visual and Instagram-worthy" />
            <AuditItem status="fix" text="Fix: Clean share URLs — /share/james not /?ref=am9obg" />
          </AuditSection>

          <AuditSection title="Will it generate income?" score={4}>
            <AuditItem status="good" text="Professionals directory exists with lead forms" />
            <AuditItem status="good" text="Disclosure page covers ASIC referral exemption" />
            <AuditItem status="good" text="Exit intent popup captures emails before leaving" />
            <AuditItem status="bad" text="CRITICAL: BASIN_ENDPOINT falls back to httpbin.org — NO REAL LEAD CAPTURE" />
            <AuditItem status="bad" text="Professionals are generic placeholders — no real brokers to refer to" />
            <AuditItem status="bad" text="No pricing page or Pro tier that actually charges money" />
            <AuditItem status="bad" text="Strategy call page has no calendar booking — just another form" />
            <AuditItem status="bad" text="No email nurture sequence — leads go into a black hole" />
            <AuditItem status="fix" text="Fix: Connect forms to a real backend (Supabase, Basin, or Zapier)" />
            <AuditItem status="fix" text="Fix: Add Calendly/Cal.com embed to Strategy Call page" />
            <AuditItem status="fix" text="Fix: Build real professional profiles with photos, reviews, specialisations" />
          </AuditSection>

          <AuditSection title="Content accuracy" score={8}>
            <AuditItem status="good" text="FHBAS threshold corrected to $800k" />
            <AuditItem status="good" text="Last reviewed dates on reference articles" />
            <AuditItem status="good" text="Source citations included" />
            <AuditItem status="bad" text="Suburb data is realistic mock data — should be labelled as estimates" />
            <AuditItem status="bad" text="No auto-refresh mechanism for rates, thresholds, or market data" />
            <AuditItem status="fix" text="Fix: Add 'Data estimated as of [date]' disclaimer to suburb tool" />
            <AuditItem status="fix" text="Fix: Add 'Rates current as of [date]' to all calculator disclaimers" />
          </AuditSection>

          <AuditSection title="Compliance" score={7}>
            <AuditItem status="good" text="Educational disclaimer on every journey page" />
            <AuditItem status="good" text="Referral disclosure page exists" />
            <AuditItem status="good" text="Privacy page exists" />
            <AuditItem status="bad" text="Privacy policy is generic — needs specific data collection list" />
            <AuditItem status="bad" text="No cookie consent banner for GA4" />
            <AuditItem status="bad" text="No accessibility statement" />
            <AuditItem status="fix" text="Fix: Update privacy policy with exact localStorage keys we use" />
            <AuditItem status="fix" text="Fix: Add minimal cookie consent for GA4" />
          </AuditSection>

          <AuditSection title="Mobile experience" score={6}>
            <AuditItem status="good" text="Mobile bottom nav exists" />
            <AuditItem status="good" text="Responsive grid layouts throughout" />
            <AuditItem status="bad" text="Journey checkpoint numbers create visual clutter on small screens" />
            <AuditItem status="bad" text="Comparison table overflows horizontally without clear scroll hint" />
            <AuditItem status="bad" text="Calculator inputs are small on mobile — hard to use with thumbs" />
            <AuditItem status="fix" text="Fix: Simplify checkpoint indicators on mobile" />
            <AuditItem status="fix" text="Fix: Add scroll shadow/fade to comparison tables" />
          </AuditSection>

          <div className="mt-10 p-6 rounded-xl bg-primary/5 border border-primary/20">
            <h2 className="font-bold text-lg mb-3">Bottom line</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              This is a <strong>solid 7/10 product</strong> that could be a <strong>9/10 with focused fixes</strong>. 
              The biggest blocker to income is that leads are not going anywhere real. The biggest blocker 
              to viral growth is weak incentives and forgettable share mechanics. Fix those two things and 
              this becomes a real business.
            </p>
            <div className="flex flex-wrap gap-2">
              <BadgeColored colour="emerald" text="Strength: Feature breadth" />
              <BadgeColored colour="emerald" text="Strength: NSW focus" />
              <BadgeColored colour="emerald" text="Strength: Clean UI" />
              <BadgeColored colour="rose" text="Blocker: No real lead capture" />
              <BadgeColored colour="rose" text="Blocker: No real professionals" />
              <BadgeColored colour="amber" text="Gap: Weak viral loop" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditSection({ title, score, children }: { title: string; score: number; children: React.ReactNode }) {
  const colour = score >= 7 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : score >= 5 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200';
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">{title}</h2>
        <span className={`text-sm font-bold px-3 py-1 rounded-full border ${colour}`}>{score}/10</span>
      </div>
      <div className="space-y-2">{children}</div>
    </Card>
  );
}

function AuditItem({ status, text }: { status: 'good' | 'bad' | 'fix'; text: string }) {
  const config = {
    good: { icon: <CheckCircle className="h-4 w-4 text-emerald-500" />, className: '' },
    bad: { icon: <XCircle className="h-4 w-4 text-rose-500" />, className: 'text-muted-foreground' },
    fix: { icon: <ArrowRight className="h-4 w-4 text-amber-500" />, className: 'text-amber-700 bg-amber-50 rounded px-2 py-0.5' },
  };
  return (
    <div className={`flex items-start gap-2 text-sm ${config[status].className}`}>
      <span className="mt-0.5 flex-shrink-0">{config[status].icon}</span>
      <span>{text}</span>
    </div>
  );
}

function BadgeColored({ colour, text }: { colour: string; text: string }) {
  const map: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${map[colour]}`}>{text}</span>
  );
}
