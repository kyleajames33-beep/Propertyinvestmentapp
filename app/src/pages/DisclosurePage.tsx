import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export function DisclosurePage() {
  return (
    <div className="pp-container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Referral Disclosure</h1>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">How we work with professionals</h2>
            <p className="text-muted-foreground leading-relaxed">
              PropertyPath connects property buyers with professional service providers including 
              mortgage brokers, conveyancers, buyer's agents, building inspectors, property managers, 
              and accountants. When we introduce you to a professional, we may receive a referral fee.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">Referral fees</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We receive referral fees from professionals in our network. These fees:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>Do not increase the cost you pay for professional services</li>
              <li>Do not influence the content, recommendations, or rankings on this website</li>
              <li>Are disclosed at the point of referral on each relevant page</li>
              <li>Vary by professional type and are governed by written agreements</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">Our independence</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on PropertyPath is educational and independent. We do not accept payment 
              for favourable content, rankings, or reviews. Professionals in our network are vetted 
              for qualifications, licensing, and client satisfaction. However, we do not guarantee 
              the quality of service provided by any professional.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">Your choice</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are under no obligation to use any professional we introduce. You can engage any 
              professional of your choosing. Our referral service is provided as a convenience to 
              help you find qualified professionals who understand your buyer type.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">ASIC and regulatory compliance</h2>
            <p className="text-muted-foreground leading-relaxed">
              PropertyPath operates under the referral exemption in the National Consumer Credit 
              Protection Act 2009. We do not provide credit assistance, financial product advice, 
              or legal advice. All content is educational only. We recommend you seek independent 
              professional advice before making property decisions.
            </p>
          </Card>

          <div className="text-sm text-muted-foreground pt-4">
            <p>
              This disclosure was last updated on 19 April 2026. If you have any questions about 
              our referral arrangements, please contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
