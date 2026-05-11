import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, MessageSquare, Briefcase, Home, TrendingUp, Building2, Calculator, FileCheck } from 'lucide-react';

type ProfessionalType = 'broker' | 'conveyancer' | 'buyers-agent' | 'inspector' | 'accountant' | 'property-manager';
interface Question {
  id: string;
  text: string;
  why: string;
  redFlag: string;
}

const questionDatabase: Record<ProfessionalType, Question[]> = {
  broker: [
    { id: 'b1', text: 'How many lenders do you have on your panel, and which ones specialise in [my situation]?', why: 'A broad panel means more options. You want access to lenders who understand your specific needs.', redFlag: 'Only works with 2-3 lenders or pushes one bank.' },
    { id: 'b2', text: 'How many [first home buyers / investors] have you helped in the last 12 months?', why: 'Experience with your buyer type matters. An investor specialist understands rental income shading.', redFlag: 'Cannot give a number or has none in your category.' },
    { id: 'b3', text: 'What is your fee structure? Do you charge me or receive commission from lenders?', why: 'Most brokers are free to you (paid by lenders). Some charge a fee for complex situations.', redFlag: 'Vague about fees or charges upfront without explaining why.' },
    { id: 'b4', text: 'What happens if my application is declined? Do you have a plan B ready?', why: 'A good broker has backup lenders mapped out before submitting.', redFlag: 'No plan B or blames you without explaining options.' },
    { id: 'b5', text: 'Will you help me understand different loan features — offset, redraw, fixed vs variable?', why: 'Structure advice can save thousands. You want education, not just a rate.', redFlag: 'Pushes one product without comparing features.' },
    { id: 'b6', text: 'How long does your pre-approval typically take, and how long is it valid?', why: 'Timing matters in fast markets. Pre-approval validity affects your search window.', redFlag: 'Cannot give a timeframe or pre-approval lasts under 30 days.' },
  ],
  conveyancer: [
    { id: 'c1', text: 'How many property transactions did you handle in the last 12 months?', why: 'Volume indicates experience. You want someone who does this daily, not occasionally.', redFlag: 'Less than 50 transactions per year.' },
    { id: 'c2', text: 'What is your fixed fee, and what does it include? Any additional costs?', why: 'Transparency matters. Some charge extra for strata reports or complex contracts.', redFlag: 'Cannot provide a fixed fee or is vague about inclusions.' },
    { id: 'c3', text: 'How do you handle electronic conveyancing (PEXA)?', why: 'PEXA is now standard in NSW. Your conveyancer must be proficient.', redFlag: 'Does not use PEXA or is unfamiliar with it.' },
    { id: 'c4', text: 'What is your typical turnaround time for contract review?', why: 'You often need feedback within 24-48 hours, especially during cooling off.', redFlag: 'Takes more than 48 hours for initial review.' },
    { id: 'c5', text: 'How will you communicate with me during the process?', why: 'You want responsiveness. Ask if they use email, phone, or a client portal.', redFlag: 'Only available by phone or takes days to respond to email.' },
    { id: 'c6', text: 'What happens if something goes wrong at settlement?', why: 'Problems happen. You want someone with experience handling delays and disputes.', redFlag: 'No clear process or has never handled a failed settlement.' },
  ],
  'buyers-agent': [
    { id: 'ba1', text: 'How do you charge — fixed fee, percentage, or success fee?', why: 'Fee structure affects incentives. Fixed fees align interests better.', redFlag: 'Fee structure changes mid-process or has hidden costs.' },
    { id: 'ba2', text: 'Do you accept commissions or kickbacks from selling agents?', why: 'This is a conflict of interest. An independent buyer agent only represents you.', redFlag: 'Admits to receiving commissions from selling agents.' },
    { id: 'ba3', text: 'How many properties did you purchase for clients in my target area last year?', why: 'Local expertise matters. Area knowledge means better price assessment.', redFlag: 'No recent purchases in your target suburbs.' },
    { id: 'ba4', text: 'Can you provide references from recent clients with similar budgets?', why: 'Testimonials from real clients are worth more than website reviews.', redFlag: 'Cannot or will not provide client references.' },
    { id: 'ba5', text: 'What is your process for finding off-market properties?', why: 'Off-market deals often mean less competition and better prices.', redFlag: 'No off-market strategy or network.' },
    { id: 'ba6', text: 'What happens if you cannot find a suitable property within my criteria?', why: 'You want a clear exit strategy if the search takes longer than expected.', redFlag: 'No refund policy or exit clause in the agreement.' },
  ],
  inspector: [
    { id: 'in1', text: 'Are you licensed in NSW, and what qualifications do you hold?', why: 'Licensing protects you. Ask for their NSW Fair Trading licence number.', redFlag: 'Cannot provide licence number or is unlicensed.' },
    { id: 'in2', text: 'Do you follow Australian Standard AS 4349.1 and AS 4349.3?', why: 'These standards define the scope of building and pest inspections.', redFlag: 'Does not know what AS 4349 is or does not follow it.' },
    { id: 'in3', text: 'Do you have professional indemnity and public liability insurance?', why: 'Insurance protects you if the inspector misses something major.', redFlag: 'No insurance or is evasive about coverage.' },
    { id: 'in4', text: 'How long does a typical inspection take? Can I attend?', why: 'A thorough inspection takes 1-2 hours. Attending lets you ask questions.', redFlag: 'Inspection takes under 45 minutes or does not allow attendance.' },
    { id: 'in5', text: 'What does your report include? Can I see a sample?', why: 'Photos, severity ratings, and cost estimates are essential.', redFlag: 'Report is a checklist with no photos or cost estimates.' },
    { id: 'in6', text: 'What happens if you miss something major?', why: 'Understand their liability and complaint process.', redFlag: 'No process or denies any possibility of error.' },
  ],
  accountant: [
    { id: 'a1', text: 'What percentage of your clients are property investors?', why: 'A specialist understands depreciation, trust structures, and CGT strategies.', redFlag: 'Less than 30% of clients are investors.' },
    { id: 'a2', text: 'Can you advise on trust structures and SMSF property investment?', why: 'Structure advice is where the real tax savings come from.', redFlag: 'No trust or SMSF experience.' },
    { id: 'a3', text: 'How do you stay current with ATO rulings and property tax changes?', why: 'Tax rules change. You want someone who keeps up.', redFlag: 'No ongoing professional development.' },
    { id: 'a4', text: 'What is your fee structure — fixed, hourly, or package?', why: 'Predictable costs help you budget. Some charge per return, others per hour.', redFlag: 'Fees significantly lower than competitors (may indicate volume over quality).' },
    { id: 'a5', text: 'How do you handle tax planning vs just compliance?', why: 'Compliance is filing returns. Planning is saving tax. You want both.', redFlag: 'Only does compliance with no proactive planning.' },
    { id: 'a6', text: 'Have you represented clients in ATO audits?', why: 'Audit experience means they know how the ATO thinks about property claims.', redFlag: 'No audit experience or seems uncomfortable discussing it.' },
  ],
  'property-manager': [
    { id: 'pm1', text: 'What is your management fee, and what does it include?', why: 'Typical range is 5-8% of rent. Know what is extra (inspections, tribunal, etc).', redFlag: 'Fee seems too low (may cut corners) or has many hidden extras.' },
    { id: 'pm2', text: 'How many properties does each manager handle?', why: 'More than 150 per manager usually means poor service.', redFlag: 'Each manager handles 200+ properties.' },
    { id: 'pm3', text: 'What is your average vacancy rate compared to the suburb average?', why: 'A good PM keeps vacancy below suburb average.', redFlag: 'Vacancy rate higher than suburb average or does not track it.' },
    { id: 'pm4', text: 'How do you screen tenants? What checks do you perform?', why: 'Credit checks, references, and employment verification are essential.', redFlag: 'No formal screening process or only basic checks.' },
    { id: 'pm5', text: 'How often do you conduct routine inspections?', why: 'Quarterly is standard in NSW. More frequent means better property care.', redFlag: 'Only inspects every 6 months or less.' },
    { id: 'pm6', text: 'What is your maintenance approval threshold?', why: 'You want control. A $200-500 threshold is typical for minor repairs.', redFlag: 'Threshold over $500 (means less control) or no threshold at all.' },
  ],
};

const professionalConfig: Record<ProfessionalType, { label: string; icon: React.ReactNode }> = {
  broker: { label: 'Mortgage Broker', icon: <Home className="h-5 w-5" /> },
  conveyancer: { label: 'Conveyancer', icon: <FileCheck className="h-5 w-5" /> },
  'buyers-agent': { label: "Buyer's Agent", icon: <TrendingUp className="h-5 w-5" /> },
  inspector: { label: 'Building Inspector', icon: <Briefcase className="h-5 w-5" /> },
  accountant: { label: 'Accountant', icon: <Calculator className="h-5 w-5" /> },
  'property-manager': { label: 'Property Manager', icon: <Building2 className="h-5 w-5" /> },
};

export function QuestionScriptGenerator() {
  const [professional, setProfessional] = useState<ProfessionalType>('broker');
  const [persona, setPersona] = useState<'fhb' | 'investor' | 'exp'>('fhb');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const questions = questionDatabase[professional];

  const copyQuestion = (q: Question) => {
    const text = `${q.text}\n\nWhy this matters: ${q.why}\nRed flag: ${q.redFlag}`;
    navigator.clipboard.writeText(text);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Professional selector */}
      <div className="pp-callout pp-callout-blue mb-6">
        <span className="pp-callout-tag">How this works</span>
        <div>Select the professional you are meeting. Each question is designed to reveal competence and fit. Copy questions to take with you.</div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {(Object.keys(professionalConfig) as ProfessionalType[]).map(p => (
          <Button key={p} variant={professional === p ? 'default' : 'outline'} onClick={() => setProfessional(p)} className="flex-col h-auto py-3 gap-1 text-xs">
            {professionalConfig[p].icon}
            <span className="text-[10px]">{professionalConfig[p].label}</span>
          </Button>
        ))}
      </div>

      {/* Persona context */}
      <div className="flex gap-2 mb-6">
        {(['fhb', 'investor', 'exp'] as Array<'fhb' | 'investor' | 'exp'>).map(p => (
          <Button key={p} size="sm" variant={persona === p ? 'secondary' : 'ghost'} onClick={() => setPersona(p)}>
            {p === 'fhb' ? 'First Home Buyer' : p === 'investor' ? 'Investor' : 'Experienced'}
          </Button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={q.id} className="pp-card">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800 mb-2">{q.text}</p>
                <div className="bg-slate-50 rounded-lg p-3 mb-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Why this matters</p>
                  <p className="text-sm text-slate-600">{q.why}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 mb-3 border border-red-100">
                  <p className="text-xs text-red-500 uppercase tracking-wide mb-1">Red flag</p>
                  <p className="text-sm text-red-700">{q.redFlag}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => copyQuestion(q)}>
                  {copiedId === q.id ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  {copiedId === q.id ? 'Copied' : 'Copy question'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export all */}
      <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Take all questions with you
        </h4>
        <p className="text-sm text-slate-600 mb-4">Copy the full script for {professionalConfig[professional].label.toLowerCase()} to use in your meeting.</p>
        <Button onClick={() => {
          const fullText = questions.map((q, i) => `${i + 1}. ${q.text}\n   Why: ${q.why}\n   Watch for: ${q.redFlag}`).join('\n\n');
          navigator.clipboard.writeText(fullText);
          setCopiedId('all');
          setTimeout(() => setCopiedId(null), 2000);
        }}>
          {copiedId === 'all' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copiedId === 'all' ? 'Copied all questions' : 'Copy all questions'}
        </Button>
      </div>
    </div>
  );
}
