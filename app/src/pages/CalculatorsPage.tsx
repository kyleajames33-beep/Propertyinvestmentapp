import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Calculator, Sparkles } from 'lucide-react';
import {
  BorrowingPowerCalculator, StampDutyCalculator, MortgageRepaymentCalculator,
  LifeSimulator, RentVsBuyCalculator, InvestmentCashflowCalculator, OffsetVsRedrawCalculator,
  RefinanceCalculator, EquityReleaseCalculator, DepositGoalCalculator, LandTaxCalculator,
  PropertyComparisonCalculator, DepreciationCalculator, CGTCalculator,
  InterestRateStressTest, FirstHomeBuyerGrants, MovingCostCalculator,
  SuburbAffordabilityHeatmap, RenovationROICalculator, RentvestingCalculator,
  PropertyTimeMachine, CoBuyCalculator, StrataComparisonCalculator,
} from '@/components/calculators';
import { SmartSavings } from '@/components/SmartSavings';
import { SEO } from '@/components/SEO';
import { ProUpgradeModal } from '@/components/ProUpgradeModal';
import { calcMenu, getCalcIcon, type CalcId } from '@/content/calculatorMenu';
import { useSearchParams } from 'react-router-dom';
import { trackCalcOpen, getRecentCalculators, type RecentCalc } from '@/lib/recent-calculators';

export function CalculatorsPage() {
  const [proOpen, setProOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCalc = searchParams.get('c') as CalcId | null;
  const [active, setActive] = useState<CalcId>(initialCalc && calcMenu.some(c => c.id === initialCalc) ? initialCalc : 'simulator');
  const [recent, setRecent] = useState<RecentCalc[]>([]);

  useEffect(() => {
    setRecent(getRecentCalculators());
  }, []);

  useEffect(() => {
    const c = searchParams.get('c') as CalcId | null;
    if (c && calcMenu.some(calc => calc.id === c)) {
      setActive(c);
    }
  }, [searchParams]);

  const handleSelect = (calcId: CalcId) => {
    setActive(calcId);
    const calc = calcMenu.find(c => c.id === calcId);
    if (calc) {
      trackCalcOpen(calcId, calc.title);
      setRecent(getRecentCalculators());
    }
    setSearchParams({ c: calcId });
  };

  return (
    <div className="pp-container py-12">
      <ProUpgradeModal open={proOpen} onClose={() => setProOpen(false)} />
      <SEO title="Property Calculators â€” PropertyPath" description="Free NSW property calculators: stamp duty, borrowing power, mortgage repayments, rent vs buy, and more." />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-medium mb-3 cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => setProOpen(true)}>
            <Sparkles className="h-3.5 w-3.5" />
            Save unlimited scenarios with PropertyPath Pro
          </div>
          <Calculator className="h-8 w-8 text-primary mx-auto mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-serif">23 Calculators</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Every number you need â€” from deposit goal to capital gains tax. No sign-up, no ads.
          </p>
        </div>

        {/* Recently used */}
        {recent.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Recently used</p>
            <div className="flex flex-wrap gap-2">
              {recent.map((calc) => (
                <button
                  key={calc.id}
                  onClick={() => handleSelect(calc.id as CalcId)}
                  className={`inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    active === calc.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80 border border-border'
                  }`}
                >
                  {calc.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Calculator grid selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 mb-10">
          {calcMenu.map(calc => (
            <button key={calc.id} onClick={() => handleSelect(calc.id)}
              className={`text-left p-3 rounded-xl border-2 transition-all ${active === calc.id ? 'border-primary shadow-lg bg-primary/5' : 'border-transparent hover:border-border bg-card hover:shadow-md'}`}>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${calc.color} flex items-center justify-center text-white mb-2`}>{getCalcIcon(calc.iconName, 'h-5 w-5')}</div>
              <h3 className={`font-semibold text-[11px] leading-tight ${active === calc.id ? 'text-primary' : ''}`}>{calc.title}</h3>
              <Badge variant="secondary" className="text-[9px] px-1 py-0 mt-1">{calc.badge}</Badge>
            </button>
          ))}
        </div>

        {/* Active calculator */}
        {active === 'borrowing' && <BorrowingPowerCalculator />}
        {active === 'stamp' && <StampDutyCalculator />}
        {active === 'mortgage' && <MortgageRepaymentCalculator />}
        {active === 'simulator' && <LifeSimulator />}
        {active === 'rentvbuy' && <RentVsBuyCalculator />}
        {active === 'cashflow' && <InvestmentCashflowCalculator />}
        {active === 'offset' && <OffsetVsRedrawCalculator />}
        {active === 'refinance' && <RefinanceCalculator />}
        {active === 'equity' && <EquityReleaseCalculator />}
        {active === 'deposit' && <DepositGoalCalculator />}
        {active === 'landtax' && <LandTaxCalculator />}
        {active === 'compare' && <PropertyComparisonCalculator />}
        {active === 'depreciation' && <DepreciationCalculator />}
        {active === 'cgt' && <CGTCalculator />}
        {active === 'stress' && <InterestRateStressTest />}
        {active === 'grants' && <FirstHomeBuyerGrants />}
        {active === 'moving' && <MovingCostCalculator />}
        {active === 'suburbs' && <SuburbAffordabilityHeatmap />}
        {active === 'reno' && <RenovationROICalculator />}
        {active === 'rentvest' && <RentvestingCalculator />}
        {active === 'timemachine' && <PropertyTimeMachine />}
        {active === 'cobuy' && <CoBuyCalculator />}
        {active === 'strata' && <StrataComparisonCalculator />}

        {/* Smart Savings */}
        <div className="mt-16 pt-10 border-t">
          <SmartSavings />
        </div>
      </div>
    </div>
  );
}

