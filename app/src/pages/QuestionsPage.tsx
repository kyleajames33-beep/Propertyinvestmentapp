import { useState, useEffect } from 'react';
import { trackActivity } from '@/lib/badges';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FileQuestion, MessageSquare, Copy, Check } from 'lucide-react';

interface QuestionScript {
  id: string;
  professional: string;
  title: string;
  description: string;
  questions: string[];
  redFlags: string[];
}

const scripts: QuestionScript[] = [
  {
    id: 'mortgage-broker',
    professional: 'Mortgage Broker',
    title: 'Questions for Your Mortgage Broker',
    description: 'A good broker saves you money and stress. These questions help you find one who understands your situation.',
    questions: [
      'How many lenders do you have on your panel, and which ones specialise in my buyer type?',
      'How many first home buyers / investors have you helped in the last 12 months?',
      'What is your fee structure? Do you charge me directly or receive commission from lenders?',
      'How do you handle lender commissions? Do you disclose them to me upfront?',
      'What is your process for pre-approval, and how long does it typically take?',
      'Will you help me understand different loan features (offset, redraw, fixed vs variable)?',
      'What happens if my application is declined? Do you have a plan B lender ready?',
      'How do you communicate during the process? Email, phone, or a client portal?',
      'Do you provide ongoing support after settlement, or is your service finished?',
      'Can you explain the total cost of the loan over its full term, not just the rate?',
    ],
    redFlags: [
      'Pushes you toward a single lender without comparing options',
      'Cannot explain how they are paid or is evasive about commissions',
      'Guarantees approval before reviewing your full financial position',
      'Pressures you to sign quickly without time to compare',
    ]
  },
  {
    id: 'conveyancer',
    professional: 'Conveyancer',
    title: 'Questions for Your Conveyancer',
    description: 'Your conveyancer handles the legal transfer. These questions ensure they are thorough and responsive.',
    questions: [
      'Are you licensed with the Australian Institute of Conveyancers NSW?',
      'How many property transactions did you handle in the last 12 months?',
      'What is your fixed fee, and what does it include? Are there any additional costs?',
      'How do you handle electronic conveyancing (PEXA)?',
      'What is your typical turnaround time for contract review?',
      'How will you communicate with me during the process?',
      'Do you have professional indemnity insurance?',
      'What happens if something goes wrong at settlement?',
      'Will you attend settlement in person, or is it all electronic?',
      'Can you explain the special conditions in my contract in plain English?',
    ],
    redFlags: [
      'Cannot provide a fixed fee or is vague about costs',
      'Does not use PEXA (electronic conveyancing)',
      'Takes more than 24 hours to respond to initial enquiry',
      'Has no professional indemnity insurance',
    ]
  },
  {
    id: 'buyers-agent',
    professional: "Buyer's Agent",
    title: 'Questions for Your Buyer\'s Agent',
    description: 'A buyer\'s agent represents you, not the seller. These questions ensure they are truly independent.',
    questions: [
      'Are you a member of the Real Estate Institute of NSW (REINSW) or REBAA?',
      'How do you charge — fixed fee, percentage of purchase price, or success fee?',
      'Do you accept any commissions or kickbacks from selling agents or developers?',
      'How many properties did you purchase for clients in my target area last year?',
      'Can you provide references from recent clients with similar budgets?',
      'What is your process for finding off-market properties?',
      'How do you handle the negotiation — do I attend, or do you represent me fully?',
      'What happens if you cannot find a suitable property within my criteria?',
      'Do you have a conflict of interest policy I can review?',
      'What is your refund policy if I am not satisfied with your service?',
    ],
    redFlags: [
      'Accepts commissions from selling agents (conflict of interest)',
      'Pushes specific properties without explaining why they suit you',
      'Cannot provide recent client references',
      'Fee structure is unclear or heavily weighted toward success fees',
    ]
  },
  {
    id: 'building-inspector',
    professional: 'Building Inspector',
    title: 'Questions for Your Building Inspector',
    description: 'A thorough inspection can save you tens of thousands. These questions ensure you hire a competent inspector.',
    questions: [
      'Are you licensed in NSW, and what qualifications do you hold?',
      'Do you follow Australian Standard AS 4349.1 for building inspections?',
      'Do you have professional indemnity and public liability insurance?',
      'How long does a typical inspection take? (Beware of 30-minute inspections)',
      'What does your report include? Photos, recommendations, cost estimates?',
      'Can I attend the inspection and ask questions on site?',
      'Do you also do pest inspections, or do I need a separate inspector?',
      'How soon will I receive the report after the inspection?',
      'What happens if you miss something major?',
      'Can you provide a sample report so I know what to expect?',
    ],
    redFlags: [
      'Inspection takes less than 1 hour for a standard house',
      'Does not follow Australian Standards or cannot explain which ones',
      'No professional indemnity insurance',
      'Report is verbal only or a generic checklist with no photos',
    ]
  },
  {
    id: 'property-manager',
    professional: 'Property Manager',
    title: 'Questions for Your Property Manager',
    description: 'A good property manager protects your investment and maximises returns.',
    questions: [
      'What is your management fee, and what does it include?',
      'What is your letting fee, and how is it calculated?',
      'How many properties does each property manager in your office handle?',
      'What is your average vacancy rate compared to the suburb average?',
      'How do you screen tenants? (credit checks, references, employment verification)',
      'How often do you conduct routine inspections?',
      'What is your maintenance approval threshold? (amount they can approve without asking you)',
      'How do you handle rent reviews and lease renewals?',
      'What reporting do you provide, and how often?',
      'What is your process for handling tenant disputes and arrears?',
      'Can I speak to an existing client about their experience?',
    ],
    redFlags: [
      'Each manager handles more than 150 properties (too many)',
      'Management fee seems too low (may indicate poor service)',
      'No clear process for tenant screening',
      'High vacancy rates compared to suburb average',
    ]
  },
  {
    id: 'accountant',
    professional: 'Accountant / Tax Specialist',
    title: 'Questions for Your Accountant',
    description: 'The right accountant structures your investment for tax efficiency and long-term growth.',
    questions: [
      'What percentage of your clients are property investors?',
      'Do you specialise in property tax, or is it a general practice?',
      'Can you advise on trust structures and SMSF property investment?',
      'How do you stay current with ATO rulings and property tax changes?',
      'What is your fee structure — fixed, hourly, or package?',
      'How do you handle tax planning vs just compliance?',
      'Can you review my depreciation schedule and ensure I claim everything?',
      'What record-keeping system do you recommend for investors?',
      'Have you represented clients in ATO audits?',
      'How do you coordinate with my mortgage broker and financial planner?',
    ],
    redFlags: [
      'Has few property investor clients or treats it as a sideline',
      'Cannot explain trust structures or SMSF rules',
      'Only does compliance (tax returns) with no proactive planning',
      'Fees are significantly lower than competitors (may indicate volume over quality)',
    ]
  },
];

export function QuestionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<QuestionScript | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { trackActivity('reference_read'); }, []);

  const openScript = (script: QuestionScript) => {
    setSelectedScript(script);
    setCopied(false);
    setDialogOpen(true);
  };

  const copyQuestions = () => {
    if (!selectedScript) return;
    const text = `${selectedScript.title}\n\n${selectedScript.questions.map((q, _i) => `${_i + 1}. ${q}`).join('\n')}\n\nRed flags to watch for:\n${selectedScript.redFlags.map((f) => `- ${f}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pp-container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <FileQuestion className="h-8 w-8 text-primary mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Question Scripts</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Take these questions to your meetings with professionals. They help you evaluate 
            competence, spot red flags, and hire the right person for your situation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {scripts.map(script => (
            <Card key={script.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openScript(script)}>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-muted-foreground">{script.professional}</span>
                </div>
                <CardTitle className="text-base">{script.title}</CardTitle>
                <CardDescription>{script.description}</CardDescription>
                <Badge variant="secondary" className="mt-2 w-fit">{script.questions.length} questions</Badge>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedScript?.title}</DialogTitle>
              <DialogDescription>{selectedScript?.description}</DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">Questions to ask</h4>
                <Button variant="outline" size="sm" onClick={copyQuestions}>
                  {copied ? <Check className="mr-1 h-3 w-3" /> : <Copy className="mr-1 h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy all'}
                </Button>
              </div>
              <ol className="space-y-3">
                {selectedScript?.questions.map((q, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">{q}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-semibold text-sm text-destructive mb-3">Red flags</h4>
                <ul className="space-y-2">
                  {selectedScript?.redFlags.map((flag, flagIdx) => (
                    <li key={flagIdx} className="flex items-start gap-2 text-sm text-destructive/90">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                      {flag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
