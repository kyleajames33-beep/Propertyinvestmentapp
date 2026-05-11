import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="pp-container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              PropertyPath is committed to protecting your privacy. This policy explains how we collect, 
              use, store, and disclose your personal information. We comply with the Australian Privacy 
              Principles under the Privacy Act 1988 (Cth).
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">What we collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We may collect the following information:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>Name, email address, and phone number (when you request a referral)</li>
              <li>Property interests and buyer type (to match you with appropriate professionals)</li>
              <li>Location/suburb preferences</li>
              <li>Website usage data via analytics (anonymous)</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">How we use your information</h2>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>To introduce you to professional service providers you request</li>
              <li>To send you relevant property guidance content (if you opt in)</li>
              <li>To improve our website and content</li>
              <li>To comply with legal obligations</li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">Sharing your information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We share your information only in these circumstances:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>With professional service providers when you explicitly request an introduction</li>
              <li>With service providers who help us operate our website (e.g., hosting, analytics)</li>
              <li>When required by law</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We do not sell your personal information to third parties.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">Overseas disclosure</h2>
            <p className="text-muted-foreground leading-relaxed">
              Some of our service providers (including form processing and analytics services) 
              may store data outside Australia. We take reasonable steps to ensure these providers 
              do not breach the Australian Privacy Principles.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We take reasonable steps to protect your personal information from unauthorised access, 
              modification, or disclosure. However, no internet transmission is completely secure.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-3">Your rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Make a complaint about our privacy practices</li>
            </ul>
          </Card>

          <div className="text-sm text-muted-foreground pt-4">
            <p>
              This privacy policy was last updated on 19 April 2026. 
              This is a policy outline and should be reviewed by a qualified legal practitioner 
              before publication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
