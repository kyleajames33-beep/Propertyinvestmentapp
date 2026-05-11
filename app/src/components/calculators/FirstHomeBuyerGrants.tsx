import { useState, useMemo, useEffect } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { CalcLayout, fmtDollarFull } from './CalculatorShell';
import { CalculatorCta } from './CalculatorCta';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';
import { Badge } from '@/components/ui/badge';

interface GrantResult {
  name: string;
  eligible: boolean;
  amount: number;
  description: string;
  conditions: string[];
  link?: string;
}

export function FirstHomeBuyerGrants() {
  useEffect(() => { trackCalculatorUse('First Home Buyer Grants'); }, []);
  const [propertyPrice, setPropertyPrice] = useState(750000);
  const isFirstHome = true;
  const [isAustralianCitizen, setIsAustralianCitizen] = useState(true);
  const [isOver18, setIsOver18] = useState(true);
  const [willLiveInIt, setWillLiveInIt] = useState(true);
  const [liveInDuration, setLiveInDuration] = useState(true); // 6+ months
  const [isNewBuild, setIsNewBuild] = useState(false);
  const [isRegional, setIsRegional] = useState(false);
  const [previousOwnership, setPreviousOwnership] = useState(false); // true = owned before
  const [spouseOwned, setSpouseOwned] = useState(false);

  const results = useMemo<GrantResult[]>(() => {
    const grants: GrantResult[] = [];

    // 1. First Home Buyer Assistance (stamp duty exemption/concession)
    let fhbaAmount = 0;
    let fhbaEligible = false;
    if (isFirstHome && isAustralianCitizen && isOver18 && willLiveInIt && liveInDuration && !previousOwnership && !spouseOwned) {
      if (propertyPrice <= 800000) {
        fhbaAmount = Math.round(propertyPrice * 0.046);
        fhbaEligible = true;
      }
    }
    grants.push({
      name: 'First Home Buyer Stamp Duty Exemption / Concession',
      eligible: fhbaEligible,
      amount: fhbaAmount,
      description: fhbaEligible
        ? propertyPrice <= 650000
            ? 'Full stamp duty exemption â€” you pay $0 stamp duty!'
            : 'Partial concession â€” reduced stamp duty based on sliding scale.'
        : 'Not eligible. Must be first home, under $800K, live in it 6+ months.',
      conditions: ['First home buyer', 'Australian citizen/permanent resident', 'Over 18', 'Live in property 6+ months', 'Property â‰¤ $800,000'],
    });

    // 2. First Home Owner Grant (New Homes) â€” $10,000
    let fhoEligible = false;
    let fhoAmount = 0;
    if (isFirstHome && isAustralianCitizen && isOver18 && willLiveInIt && liveInDuration && !previousOwnership && !spouseOwned && isNewBuild) {
      if (propertyPrice <= 750000) {
        fhoEligible = true;
        fhoAmount = 10000;
      }
    }
    grants.push({
      name: 'First Home Owner Grant (New Homes)',
      eligible: fhoEligible,
      amount: fhoAmount,
      description: fhoEligible
        ? '$10,000 grant for new homes up to $750,000. Applies to newly built or off-the-plan.'
        : 'Not eligible. Must be new build or off-the-plan, under $750K.',
      conditions: ['First home buyer', 'New home (not established)', 'Property â‰¤ $750,000', 'Australian citizen/permanent resident'],
    });

    // 3. First Home Buyer Choice (annual property tax)
    let choiceEligible = false;
    if (isFirstHome && isAustralianCitizen && isOver18 && !previousOwnership && !spouseOwned) {
      if (propertyPrice <= 1500000) {
        choiceEligible = true;
      }
    }
    grants.push({
      name: 'First Home Buyer Choice (Annual Property Tax)',
      eligible: choiceEligible,
      amount: 0,
      description: choiceEligible
        ? 'Instead of stamp duty, pay a smaller annual property tax (~$1,500â€“$2,500/yr). Better if you do not plan to stay long-term.'
        : 'Not eligible. Available for properties up to $1.5M.',
      conditions: ['First home buyer', 'Property â‰¤ $1,500,000', 'Must choose instead of stamp duty concession'],
    });

    // 4. First Home Guarantee (formerly FHLDS)
    let guaranteeEligible = false;
    let guaranteeAmount = 0;
    if (isFirstHome && isAustralianCitizen && isOver18 && willLiveInIt && liveInDuration && !previousOwnership && !spouseOwned) {
      if (propertyPrice <= 900000) {
        guaranteeEligible = true;
        guaranteeAmount = Math.round(propertyPrice * 0.15); // LMI avoided with 5% deposit
      }
    }
    grants.push({
      name: 'First Home Guarantee (5% deposit, no LMI)',
      eligible: guaranteeEligible,
      amount: guaranteeAmount,
      description: guaranteeEligible
        ? `Buy with just 5% deposit and no LMI! The government guarantees up to 15% of the property value for the lender. You avoid ~$${Math.round(propertyPrice * 0.015).toLocaleString()} in LMI.`
        : 'Not eligible. Price cap is $900,000 in NSW.',
      conditions: ['First home buyer', 'Australian citizen/permanent resident', 'Price cap $900,000 (NSW metro)', '5% genuine savings deposit', 'Must live in property'],
    });

    // 5. Regional First Home Buyer Guarantee
    let regionalEligible = false;
    let regionalAmount = 0;
    if (isFirstHome && isAustralianCitizen && isOver18 && willLiveInIt && liveInDuration && !previousOwnership && !spouseOwned && isRegional) {
      if (propertyPrice <= 750000) {
        regionalEligible = true;
        regionalAmount = Math.round(propertyPrice * 0.15);
      }
    }
    grants.push({
      name: 'Regional First Home Buyer Guarantee',
      eligible: regionalEligible,
      amount: regionalAmount,
      description: regionalEligible
        ? 'Same as First Home Guarantee but for regional areas. 5% deposit, no LMI, price cap $750,000.'
        : 'Not eligible. Must be in a regional area.',
      conditions: ['Regional area', 'First home buyer', 'Price cap $750,000', '5% deposit required'],
    });

    // 6. Family Home Guarantee (single parents)
    // We don't have single parent data, but let's add it as info
    grants.push({
      name: 'Family Home Guarantee (Single Parents)',
      eligible: false,
      amount: 0,
      description: 'Single parents can buy with just 2% deposit and no LMI. Price cap $900,000 in NSW.',
      conditions: ['Single legal guardian of at least one dependent', 'Previous home ownership OK if no current property', 'Price cap $900,000', '2% deposit required'],
    });

    return grants;
  }, [propertyPrice, isFirstHome, isAustralianCitizen, isOver18, willLiveInIt, liveInDuration, isNewBuild, isRegional, previousOwnership, spouseOwned]);

  const totalEligible = results.filter(r => r.eligible).reduce((s, r) => s + r.amount, 0);

  return (
    <CalcLayout title="First Home Buyer Grants & Schemes" subtitle="Check what NSW grants, exemptions, and schemes you qualify for">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Left: Inputs */}
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Your situation</div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
            {/* Property price */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-2">Property price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Toggle inputs */}
            {[
              { label: 'Never owned property before', value: !previousOwnership, onChange: () => setPreviousOwnership(!previousOwnership), icon: 'âœ…' },
              { label: 'Spouse/partner never owned property', value: !spouseOwned, onChange: () => setSpouseOwned(!spouseOwned), icon: 'âœ…' },
              { label: 'Australian citizen or PR', value: isAustralianCitizen, onChange: () => setIsAustralianCitizen(!isAustralianCitizen), icon: 'ðŸ‡¦ðŸ‡º' },
              { label: 'Over 18 years old', value: isOver18, onChange: () => setIsOver18(!isOver18), icon: 'âœ…' },
              { label: 'Will live in the property', value: willLiveInIt, onChange: () => setWillLiveInIt(!willLiveInIt), icon: 'ðŸ ' },
              { label: 'Plan to live there 6+ months', value: liveInDuration, onChange: () => setLiveInDuration(!liveInDuration), icon: 'â±ï¸' },
              { label: 'New build or off-the-plan', value: isNewBuild, onChange: () => setIsNewBuild(!isNewBuild), icon: 'ðŸ—ï¸' },
              { label: 'Regional NSW (not Sydney metro)', value: isRegional, onChange: () => setIsRegional(!isRegional), icon: 'ðŸŒ¾' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.onChange}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                  item.value
                    ? 'bg-teal-50 border-teal-200 text-slate-800'
                    : 'bg-white border-slate-200 text-slate-500'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                  item.value ? 'bg-teal-600 border-teal-600' : 'border-slate-300'
                }`}>
                  {item.value && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">What you could receive</div>

          {/* Total */}
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-xl p-5 text-center">
            <div className="text-sm text-teal-700 font-medium mb-1">Total potential benefit</div>
            <div className="text-3xl font-bold font-serif text-teal-800">{fmtDollarFull(totalEligible)}</div>
            <div className="text-xs text-teal-600 mt-1">
              {totalEligible > 0 ? `${results.filter(r => r.eligible).length} of ${results.length} schemes eligible` : 'Adjust your situation to see what you qualify for'}
            </div>
          </div>

          {/* Grant cards */}
          <div className="space-y-3">
            {results.map((grant) => (
              <div
                key={grant.name}
                className={`rounded-xl border p-5 transition-all ${
                  grant.eligible
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {grant.eligible ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-slate-400 flex-shrink-0" />
                    )}
                    <h4 className={`font-semibold text-sm ${grant.eligible ? 'text-emerald-800' : 'text-slate-600'}`}>
                      {grant.name}
                    </h4>
                  </div>
                  {grant.amount > 0 && (
                    <Badge variant={grant.eligible ? 'default' : 'secondary'} className="flex-shrink-0">
                      {fmtDollarFull(grant.amount)}
                    </Badge>
                  )}
                </div>

                <p className={`text-sm mb-3 ${grant.eligible ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {grant.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {grant.conditions.map((cond) => (
                    <span
                      key={cond}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        grant.eligible
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 leading-relaxed">
                Eligibility rules change. These are NSW rules as of 2024. Always check{' '}
                <a href="https://www.nsw.gov.au/housing-and-construction/first-home-buyer" target="_blank" rel="noopener" className="text-teal-600 underline">NSW Government First Home Buyer</a>{' '}
                and <a href="https://www.housingaustralia.gov.au/" target="_blank" rel="noopener" className="text-teal-600 underline">Housing Australia</a> for the latest.
              </p>
            </div>
          </div>
        </div>
      </div>
      <CalculatorDisclaimer />
      <CalculatorCta
        calculatorName="First Home Buyer Grants"
        headline="Need help claiming your grants and exemptions?"
        subline="A conveyancer handles the paperwork and ensures you don't miss any entitlements."
        ctaText="Connect with a conveyancer"
        professionalType="conveyancer"
      />
    </CalcLayout>
  );
}

