import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { MessageSquare, Building2, Home, TrendingUp, Calculator, ArrowRight } from 'lucide-react';
import type { Persona } from '@/types/content';
import { trackEvent } from '@/lib/analytics';
import { submitToForm, BASIN_ENDPOINT } from '@/lib/forms';
import { trackActivity } from '@/lib/badges';

interface ReferralCTAProps {
  stageId: string;
  persona: Persona;
}

const ctaDatabase: Record<string, Record<string, Array<{
  professional: string;
  trigger: string;
  soft: string;
  medium: string;
  direct: string;
  fields: string[];
}>>> = {
  '01-strategy': {
    'fhb-oo': [
      {
        professional: 'mortgage-broker',
        trigger: 'You now have a rough idea of your deposit position and scheme eligibility.',
        soft: 'Want to confirm your numbers? A broker can explain borrowing capacity at no cost.',
        medium: 'Want to understand buying power? We can connect you with a broker who works with first home buyer grants.',
        direct: "Learn about pre-approval: talk to a mortgage broker who works with NSW first home buyers.",
        fields: ['name', 'email', 'phone', 'deposit_amount', 'preferred_location']
      }
    ],
    'inv-new': [
      {
        professional: 'mortgage-broker',
        trigger: 'You understand investment borrowing basics.',
        soft: 'Curious about investment loan options? A broker can outline what is available.',
        medium: 'Interested in investment loans? We can introduce a broker who works with property investors.',
        direct: 'Explore investment pre-approval options with a broker who works with property investors.',
        fields: ['name', 'email', 'phone', 'investment_budget', 'strategy_type']
      },
      {
        professional: 'accountant',
        trigger: 'You are thinking about tax structures and negative gearing.',
        soft: 'Unsure about the tax side? An accountant can explain the basics in a free initial call.',
        medium: 'Before you buy, understand the tax implications. We can introduce you to a property-focused accountant.',
        direct: 'Learn about investment structures from day one. Talk to an accountant who works with property investors.',
        fields: ['name', 'email', 'phone', 'current_income', 'structure_questions']
      }
    ],
    'inv-exp': [
      {
        professional: 'mortgage-broker',
        trigger: 'You are planning portfolio-level financing and equity release.',
        soft: 'Exploring portfolio finance options? A specialist broker can outline leverage options.',
        medium: 'Reviewing your portfolio finance? We can connect you with a broker who works with complex investor structures.',
        direct: 'Explore your portfolio borrowing capacity with a broker who works with multi-property investors.',
        fields: ['name', 'email', 'phone', 'portfolio_size', 'equity_position']
      },
      {
        professional: 'accountant',
        trigger: 'You need to optimise structures for land tax and portfolio growth.',
        soft: 'Reviewing your tax strategy? An accountant can review your current structure.',
        medium: 'Thinking about land tax? We can introduce an accountant who advises on property portfolio structures.',
        direct: 'Learn about portfolio tax structures. Connect with an accountant who works with scaling investors.',
        fields: ['name', 'email', 'phone', 'portfolio_value', 'land_tax_concerns']
      }
    ]
  },
  '02-finance-prep': {
    'fhb-oo': [{
      professional: 'mortgage-broker',
      trigger: 'You now understand how lenders assess you.',
      soft: 'Want an overview of how lenders assess applications?',
      medium: 'Interested in pre-approval? We can connect you with a broker who works with first home buyers.',
      direct: 'Explore pre-approval options with a specialist broker.',
      fields: ['name', 'email', 'phone', 'employment_type', 'annual_income']
    }],
    'inv-new': [{
      professional: 'mortgage-broker',
      trigger: 'You understand investment loan requirements.',
      soft: 'Want to compare investment loan products?',
      medium: 'Interested in investment pre-approval? We can introduce a broker who understands rental income assessment.',
      direct: 'Learn about investment pre-approval. A specialist broker can explain lender approaches to rental income.',
      fields: ['name', 'email', 'phone', 'employment_type', 'annual_income', 'rental_income']
    }, {
      professional: 'accountant',
      trigger: 'You are structuring your investment loan and offset.',
      soft: 'Need clarity on loan structuring for tax?',
      medium: 'Review your loan structure before you apply. Talk to a property accountant.',
      direct: 'Learn about investment loan structures and tax implications. Connect with a specialist accountant.',
      fields: ['name', 'email', 'phone', 'loan_structure_questions']
    }],
    'inv-exp': [{
      professional: 'mortgage-broker',
      trigger: 'You understand portfolio lending and cross-collateralisation risks.',
      soft: 'Reviewing your portfolio finance structure?',
      medium: 'Considering equity release or refinance? We can connect you with a complex lending specialist.',
      direct: 'Explore portfolio equity release and restructuring. A specialist broker can explain multi-lender strategies.',
      fields: ['name', 'email', 'phone', 'portfolio_details', 'equity_goals']
    }, {
      professional: 'accountant',
      trigger: 'You are managing debt recycling and portfolio structures.',
      soft: 'Reviewing your portfolio tax strategy?',
      medium: 'Review your debt recycling and deductions. Talk to a portfolio-focused accountant.',
      direct: 'Learn about available deductions across your portfolio. Connect with an accountant who works with scaling investors.',
      fields: ['name', 'email', 'phone', 'portfolio_size', 'tax_goals']
    }]
  },
  '03-market-research': {
    'inv-new': [{
      professional: 'buyers-agent',
      trigger: 'You have identified your target market criteria.',
      soft: 'Want a local expert to validate your research?',
      medium: 'Looking for investment-grade property? We can introduce a buyer\'s agent in your target area.',
      direct: 'Explore investment-grade properties in your target area. A local buyer\'s agent can share market insights.',
      fields: ['name', 'email', 'phone', 'target_suburbs', 'investment_criteria']
    }],
    'inv-exp': [{
      professional: 'buyers-agent',
      trigger: 'You are evaluating micro-markets and development opportunities.',
      soft: 'Need boots-on-the-ground intelligence?',
      medium: 'Considering an acquisition? We can connect you with a buyer\'s agent who works with investor acquisitions.',
      direct: 'Learn about off-market opportunities. Connect with a buyer\'s agent who works with investors.',
      fields: ['name', 'email', 'phone', 'target_markets', 'acquisition_criteria']
    }]
  },
  '05-inspection-dd': {
    'fhb-oo': [{
      professional: 'building-inspector',
      trigger: 'You have a shortlisted property that needs inspection.',
      soft: 'Need a reliable inspector? We can recommend one.',
      medium: 'Considering a building and pest inspection? We can connect you with a licensed inspector.',
      direct: 'Arrange a building and pest inspection. A thorough inspector can identify issues you may not notice.',
      fields: ['name', 'email', 'phone', 'property_address', 'inspection_urgency']
    }],
    'inv-new': [{
      professional: 'building-inspector',
      trigger: 'You need to quantify repair costs for your investment.',
      soft: 'Want to know the true condition of the property?',
      medium: 'Want to understand the property condition? We can connect you with an inspector who works with rental properties.',
      direct: 'Get a detailed inspection report. An investor-focused inspector can estimate repair costs.',
      fields: ['name', 'email', 'phone', 'property_address', 'property_type']
    }, {
      professional: 'property-manager',
      trigger: 'You are assessing rental appeal and tenant demand.',
      soft: 'Curious about rental potential?',
      medium: 'Want to understand rental potential? We can introduce a property manager who knows the local rental market.',
      direct: 'Consider a rental appraisal. A local property manager can share rental market insights.',
      fields: ['name', 'email', 'phone', 'property_address', 'property_type']
    }],
    'inv-exp': [{
      professional: 'building-inspector',
      trigger: 'You need advanced due diligence for value-add opportunities.',
      soft: 'Need a specialist inspection for development potential?',
      medium: 'Assessing renovation or development potential? We can connect you with an inspector who evaluates value-add opportunities.',
      direct: 'Explore value-add potential. A specialist inspector can assess development potential and structural capacity.',
      fields: ['name', 'email', 'phone', 'property_address', 'development_interest']
    }]
  },
  '06-offer-negotiation': {
    'fhb-oo': [{
      professional: 'buyers-agent',
      trigger: 'You are heading to auction or making an offer.',
      soft: 'Unsure about bidding strategy? A buyer\'s agent can explain the process.',
      medium: 'Have an auction coming up? We can connect you with a buyer\'s agent who can bid on your behalf.',
      direct: 'Get auction bidding support. A professional bidder can help you navigate the auction process.',
      fields: ['name', 'email', 'phone', 'auction_date', 'property_address']
    }]
  },
  '07-contract-review': {
    'fhb-oo': [{
      professional: 'conveyancer',
      trigger: 'Your offer has been accepted — now the legal work begins.',
      soft: 'Need a conveyancer to review your contract? We can help.',
      medium: 'Considering professional contract review? We can introduce a conveyancer who works with first home buyers.',
      direct: 'Explore contract review options. A conveyancer can explain clauses and potential costs.',
      fields: ['name', 'email', 'phone', 'property_address', 'contract_received']
    }],
    'inv-new': [{
      professional: 'conveyancer',
      trigger: 'You need contract review with investment-specific considerations.',
      soft: 'Need a conveyancer who understands investment purchases?',
      medium: 'Investment contracts have extra complexities. We can connect you with a conveyancer who works with investors.',
      direct: 'Review your investment purchase thoroughly. A specialist conveyancer can explain tenancy, trust, and tax clauses.',
      fields: ['name', 'email', 'phone', 'property_address', 'purchase_structure']
    }, {
      professional: 'accountant',
      trigger: 'You need to confirm tax and structure before exchange.',
      soft: 'Final structure check before you commit?',
      medium: 'Exchange approaching? Consider reviewing your tax position with an accountant who knows property.',
      direct: 'Review your structure before exchange. An accountant can explain potential tax implications.',
      fields: ['name', 'email', 'phone', 'settlement_date', 'structure_questions']
    }],
    'inv-exp': [{
      professional: 'conveyancer',
      trigger: 'You are managing complex contract structures.',
      soft: 'Need a conveyancer for complex portfolio acquisitions?',
      medium: 'Portfolio purchases involve complex handling. We can introduce a conveyancer experienced in complex structures.',
      direct: 'Learn about portfolio acquisition processes. A specialist conveyancer can explain simultaneous settlements and trust structures.',
      fields: ['name', 'email', 'phone', 'property_address', 'complexity_type']
    }, {
      professional: 'accountant',
      trigger: 'You are coordinating tax and settlement timing across portfolio.',
      soft: 'Need to align settlement timing with tax strategy?',
      medium: 'Settlement timing can affect your tax year. We can connect you with an accountant who can explain the implications.',
      direct: 'Learn about settlement timing and tax implications. A portfolio accountant can explain coordination options.',
      fields: ['name', 'email', 'phone', 'portfolio_transactions', 'tax_year_planning']
    }]
  },
  '08-settlement': {
    'inv-new': [{
      professional: 'property-manager',
      trigger: 'You need to get your investment tenanted quickly.',
      soft: 'Need help finding a property manager?',
      medium: 'Settlement done? We can introduce a property manager who can help find tenants.',
      direct: 'Find a property manager to help with tenancy. A property manager can assist with minimising vacancy.',
      fields: ['name', 'email', 'phone', 'property_address', 'rental_appraisal_needed']
    }, {
      professional: 'accountant',
      trigger: 'You need to set up depreciation and expense tracking.',
      soft: 'Need a depreciation schedule?',
      medium: 'Want to understand tax deductions from day one? We can introduce a property tax specialist.',
      direct: 'Learn about available deductions from settlement. A quantity surveyor and accountant can explain your tax position.',
      fields: ['name', 'email', 'phone', 'property_details', 'depreciation_needed']
    }],
    'inv-exp': [{
      professional: 'property-manager',
      trigger: 'You are onboarding a new property into your portfolio.',
      soft: 'Adding to your portfolio? A good property manager is essential.',
      medium: 'New acquisition settled? We can introduce a manager who handles portfolio-scale operations.',
      direct: 'Integrate your new property into your portfolio. A portfolio-focused manager can provide portfolio-level reporting.',
      fields: ['name', 'email', 'phone', 'property_address', 'portfolio_integration']
    }, {
      professional: 'accountant',
      trigger: 'You need to update portfolio accounting and plan the next acquisition.',
      soft: 'Reviewing your portfolio position post-settlement?',
      medium: 'Settled? Consider reviewing your position. We can connect you with an accountant who can discuss next steps.',
      direct: 'Review your portfolio strategy post-settlement. An accountant can help track performance and plan future acquisitions.',
      fields: ['name', 'email', 'phone', 'portfolio_update', 'next_acquisition_plan']
    }, {
      professional: 'mortgage-broker',
      trigger: 'You may wish to review refinance opportunities after settlement.',
      soft: 'Wondering about releasing equity for a future purchase?',
      medium: 'Settled? We can introduce a broker who can discuss portfolio growth options.',
      direct: 'Explore equity release options. A portfolio broker can explain finance structures for scaling.',
      fields: ['name', 'email', 'phone', 'equity_position', 'next_purchase_timeline']
    }]
  }
};

const professionalIcons: Record<string, React.ReactNode> = {
  'mortgage-broker': <Home className="h-5 w-5" />,
  'conveyancer': <Building2 className="h-5 w-5" />,
  'buyers-agent': <TrendingUp className="h-5 w-5" />,
  'building-inspector': <Calculator className="h-5 w-5" />,
  'property-manager': <Building2 className="h-5 w-5" />,
  'accountant': <Calculator className="h-5 w-5" />,
};

const professionalLabels: Record<string, string> = {
  'mortgage-broker': 'Mortgage Broker',
  'conveyancer': 'Conveyancer',
  'buyers-agent': "Buyer's Agent",
  'building-inspector': 'Building Inspector',
  'property-manager': 'Property Manager',
  'accountant': 'Accountant',
};

export function ReferralCTA({ stageId, persona }: ReferralCTAProps) {
  const ctas = ctaDatabase[stageId]?.[persona] || [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCta, setSelectedCta] = useState<(typeof ctas)[0] | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (ctas.length === 0) return null;

  const openDialog = (cta: (typeof ctas)[0]) => {
    setSelectedCta(cta);
    setSubmitted(false);
    setDialogOpen(true);
    trackEvent('referral_cta_open', { professional: cta.professional, stageId });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const success = await submitToForm(BASIN_ENDPOINT, {
      ...data,
      professional_type: selectedCta?.professional,
      stageId,
      persona,
      form_name: 'referral_request',
    });
    if (success || import.meta.env.DEV) {
      setSubmitted(true);
      trackEvent('referral_request_sent', { professional: selectedCta?.professional, stageId });
      trackActivity('referral_request');
    }
  };

  return (
    <div className="mt-12 space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <ArrowRight className="h-5 w-5 text-primary" />
        Want to explore professional support?
      </h3>
      <p className="text-sm text-muted-foreground">
        Based on what you have just read, these professionals can help you move forward.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {ctas.map((cta, idx) => (
          <Card key={idx} className="cursor-pointer hover:shadow-md transition-shadow border-primary/10">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary mb-2">
                {professionalIcons[cta.professional]}
                <span className="text-xs font-medium uppercase tracking-wide">{professionalLabels[cta.professional]}</span>
              </div>
              <CardTitle className="text-base">{cta.medium}</CardTitle>
              <CardDescription className="text-sm mt-1">{cta.trigger}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => openDialog(cta)}>
                Connect with {professionalLabels[cta.professional]}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect with {selectedCta ? professionalLabels[selectedCta.professional] : ''}</DialogTitle>
            <DialogDescription>
              {selectedCta?.trigger}
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-lg">Request sent!</h4>
              <p className="text-sm text-muted-foreground">
                A {selectedCta ? professionalLabels[selectedCta.professional].toLowerCase() : ''} will contact you within 24 hours.
              </p>
              <p className="text-xs text-muted-foreground">
                PropertyPath may receive a referral fee. This does not affect the service you receive or its cost.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" name="phone" placeholder="04XX XXX XXX" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property">Property address or suburb</Label>
                <Input id="property" name="property" placeholder="123 Example St, Suburb NSW 2000" />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox id="consent" required />
                <Label htmlFor="consent" className="text-xs font-normal leading-relaxed">
                  I agree to PropertyPath sharing my details with this professional and receiving follow-up communication.
                  I understand PropertyPath may receive a referral fee.
                </Label>
              </div>
              <Button type="submit" className="w-full">
                Request introduction
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Your information is handled in accordance with our <a href="/privacy" className="underline">Privacy Policy</a>.
                You can unsubscribe at any time.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
