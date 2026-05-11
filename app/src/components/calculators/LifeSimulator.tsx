import { useState, useCallback, useEffect, useRef } from 'react';
import { trackCalculatorUse } from '@/lib/badges';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Zap, TrendingUp, Home, DollarSign, Clock, AlertTriangle, ChevronRight, Wallet, Calendar, Baby, Dog, Car, Users, TrendingDown, Briefcase, PiggyBank } from 'lucide-react';
import { CalculatorDisclaimer } from './CalculatorDisclaimer';

/* ───────────────────────────────────────────
   Types
   ─────────────────────────────────────────── */
interface WeekData {
  week: number;
  year: number;
  balance: number;
  salary: number;
  partnerIncome: number;
  mortgage: number;
  expenses: number;
  childExpenses: number;
  petExpenses: number;
  carExpenses: number;
  investmentIncome: number;
  lifeEvent: string | null;
  lifeEventCost: number;
  loanRemaining: number;
  weeklySurplus: number;
  cumulativeInterest: number;
}

interface SimInputs {
  annualSalary: number;
  partnerSalary: number;
  weeklyExpenses: number;
  propertyPrice: number;
  deposit: number;
  interestRate: number;
  loanTerm: number;
  simYears: number;
  numChildren: number;
  hasPet: boolean;
  hasCar: boolean;
  hasInvestmentProperty: boolean;
  invPropertyPrice: number;
  invWeeklyRent: number;
  salaryGrowth: number;
  lifeStage: 'young' | 'family' | 'pre-retirement';
}

/* ── Speed presets: paused, 1x, 2x, 4x, 10x ── */
const SPEED_MS = [0, 600, 300, 150, 60];
const SPEED_LABELS = ['Paused', '1x', '2x', '4x', '10x'];

/* ── Child-related expenses by age bracket ── */
function childWeeklyCost(numChildren: number, year: number): number {
  if (numChildren === 0) return 0;
  // Costs increase as children age: baby (0-2), toddler (3-5), school (6-12), teen (13+)
  const baseCosts = [120, 150, 100, 180]; // baby, toddler, school, teen per child/week
  const childAge = (year: number) => {
    if (year <= 2) return 0;
    if (year <= 4) return 1;
    if (year <= 10) return 2;
    return 3;
  };
  return numChildren * baseCosts[childAge(year)];
}

/* ── Lifestage expense modifiers ── */
function lifeStageExpenses(base: number, stage: string): number {
  switch (stage) {
    case 'young': return base * 0.85; // fewer obligations
    case 'family': return base * 1.2;  // more household costs
    case 'pre-retirement': return base * 1.0; // stable
    default: return base;
  }
}

/* ───────────────────────────────────────────
   Seeded RNG (LCG)
   ─────────────────────────────────────────── */
function createRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/* ── Event pool ── */
const BASE_EVENTS = [
  { desc: 'Car needs new tyres', cost: 800, prob: 0.012, type: 'life', needsCar: true },
  { desc: 'Dentist visit', cost: 350, prob: 0.018, type: 'life' },
  { desc: "Friend's wedding gift", cost: 200, prob: 0.015, type: 'life' },
  { desc: 'Fridge breaks down', cost: 1200, prob: 0.008, type: 'life' },
  { desc: 'Unexpected tax bill', cost: 600, prob: 0.007, type: 'life' },
  { desc: 'Medical bill', cost: 450, prob: 0.014, type: 'life' },
  { desc: 'Phone screen cracks', cost: 300, prob: 0.016, type: 'life' },
  { desc: 'Plumbing emergency', cost: 550, prob: 0.010, type: 'life' },
  { desc: 'Plumbing emergency', cost: 550, prob: 0.010, type: 'life' },
  { desc: 'Laptop dies', cost: 1500, prob: 0.005, type: 'life' },
  { desc: 'Car service', cost: 650, prob: 0.020, type: 'life', needsCar: true },
  { desc: 'Work bonus!', cost: -2000, prob: 0.008, type: 'life' },
  { desc: 'Tax refund!', cost: -1200, prob: 0.012, type: 'life' },
  { desc: 'Sold items online', cost: -350, prob: 0.015, type: 'life' },
  { desc: 'Birthday gift money', cost: -250, prob: 0.020, type: 'life' },
  { desc: 'Annual raise!', cost: -5000, prob: 0.004, type: 'life' },
  { desc: 'Holiday spent', cost: 2500, prob: 0.006, type: 'life' },
  { desc: 'Car registration', cost: 800, prob: 0.02, type: 'life', needsCar: true },
  { desc: 'Car insurance due', cost: 600, prob: 0.02, type: 'life', needsCar: true },
];

const PET_EVENTS = [
  { desc: 'Pet vet visit', cost: 400, prob: 0.025, type: 'pet' },
  { desc: 'Pet emergency', cost: 1200, prob: 0.006, type: 'pet' },
  { desc: 'Pet meds', cost: 150, prob: 0.015, type: 'pet' },
];

const CHILD_EVENTS = [
  { desc: 'Child school excursion', cost: 180, prob: 0.015, type: 'child' },
  { desc: 'Child dental', cost: 300, prob: 0.012, type: 'child' },
  { desc: 'Child sports fees', cost: 350, prob: 0.010, type: 'child' },
  { desc: 'New school uniforms', cost: 250, prob: 0.008, type: 'child' },
  { desc: 'Child birthday party', cost: 200, prob: 0.012, type: 'child' },
];

const INV_PROPERTY_EVENTS = [
  { desc: 'Tenant late rent', cost: 0, prob: 0.015, type: 'inv' },
  { desc: 'Property maintenance', cost: 800, prob: 0.010, type: 'inv' },
  { desc: 'Plumber at rental', cost: 450, prob: 0.008, type: 'inv' },
];

/* ───────────────────────────────────────────
   Component
   ─────────────────────────────────────────── */
export function LifeSimulator() {
  useEffect(() => { trackCalculatorUse('Life Simulator'); }, []);
  const [inputs, setInputs] = useState<SimInputs>({
    annualSalary: 95000,
    partnerSalary: 0,
    weeklyExpenses: 800,
    propertyPrice: 850000,
    deposit: 120000,
    interestRate: 6.24,
    loanTerm: 30,
    simYears: 10,
    numChildren: 0,
    hasPet: false,
    hasCar: true,
    hasInvestmentProperty: false,
    invPropertyPrice: 600000,
    invWeeklyRent: 550,
    salaryGrowth: 3,
    lifeStage: 'young',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [allWeeks, setAllWeeks] = useState<WeekData[] | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [eventsHistory, setEventsHistory] = useState<Array<{ week: number; year: number; text: string; type: string; amount: number }>>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const eventFeedRef = useRef<HTMLDivElement>(null);

  const totalWeeks = inputs.simYears * 52;

  /* ── Generate full simulation ── */
  const generateSimulation = useCallback(() => {
    const loanAmount = inputs.propertyPrice - inputs.deposit;
    const weeklyRate = inputs.interestRate / 100 / 52;
    const totalLoanWeeks = inputs.loanTerm * 52;
    const weeklyRepayment =
      loanAmount * ((weeklyRate * Math.pow(1 + weeklyRate, totalLoanWeeks)) / (Math.pow(1 + weeklyRate, totalLoanWeeks) - 1));

    const seed = Math.floor(Math.random() * 100000);
    const random = createRng(seed);
    const weeks: WeekData[] = [];

    let balance = Math.max(5000, inputs.deposit * 0.08);
    let currentLoan = loanAmount;
    let cumulativeInterest = 0;
    let currentSalary = inputs.annualSalary;
    let currentPartnerSalary = inputs.partnerSalary;
    let invWeeklyNet = 0;

    // Investment property mortgage calc
    if (inputs.hasInvestmentProperty) {
      const invLoan = inputs.invPropertyPrice * 0.8;
      const invMonthlyRate = inputs.interestRate / 100 / 12;
      const invTerm = 30 * 12;
      const invMonthlyRepayment = invLoan * ((invMonthlyRate * Math.pow(1 + invMonthlyRate, invTerm)) / (Math.pow(1 + invMonthlyRate, invTerm) - 1));
      invWeeklyNet = inputs.invWeeklyRent - (invMonthlyRepayment / 4.33) - (inputs.invPropertyPrice * 0.005 / 52); // minus 0.5% annual maintenance
    }

    for (let w = 1; w <= totalWeeks; w++) {
      if (currentLoan <= 0) break;

      const year = Math.ceil(w / 52);
      const interestThisWeek = currentLoan * weeklyRate;
      const principalThisWeek = Math.min(weeklyRepayment - interestThisWeek, currentLoan);
      currentLoan = Math.max(0, currentLoan - principalThisWeek);
      cumulativeInterest += interestThisWeek;

      // Salary (fortnightly)
      const salary = w % 2 === 0 ? (currentSalary / 26) : 0;
      const partnerIncome = inputs.partnerSalary > 0 && w % 2 === 0 ? (currentPartnerSalary / 26) : 0;

      // Child expenses
      const childExpenses = childWeeklyCost(inputs.numChildren, year);

      // Pet expenses
      let petExpenses = 0;
      if (inputs.hasPet) {
        petExpenses = 35; // base food + insurance per week
      }

      // Car expenses
      let carExpenses = 0;
      if (inputs.hasCar) {
        carExpenses = 60; // fuel + insurance + rego averaged
      }

      // Life events
      let lifeEvent: string | null = null;
      let lifeEventCost = 0;

      // Base events
      for (const event of BASE_EVENTS) {
        if (event.needsCar && !inputs.hasCar) continue;
        if (random() < event.prob) {
          lifeEvent = event.desc;
          lifeEventCost = event.cost;
          if (event.desc === 'Annual raise!') {
            currentSalary += currentSalary * (inputs.salaryGrowth / 100);
            if (inputs.partnerSalary > 0) currentPartnerSalary += currentPartnerSalary * (inputs.salaryGrowth / 100);
          }
          break;
        }
      }

      // Pet events
      if (!lifeEvent && inputs.hasPet) {
        for (const event of PET_EVENTS) {
          if (random() < event.prob) {
            lifeEvent = event.desc;
            lifeEventCost = event.cost;
            break;
          }
        }
      }

      // Child events
      if (!lifeEvent && inputs.numChildren > 0) {
        for (const event of CHILD_EVENTS) {
          if (random() < event.prob * inputs.numChildren) {
            lifeEvent = event.desc;
            lifeEventCost = event.cost;
            break;
          }
        }
      }

      // Investment property events
      let investmentIncome = 0;
      if (inputs.hasInvestmentProperty) {
        investmentIncome = w % 2 === 0 ? invWeeklyNet * 2 : 0;
        if (!lifeEvent) {
          for (const event of INV_PROPERTY_EVENTS) {
            if (random() < event.prob) {
              lifeEvent = event.desc;
              lifeEventCost = event.cost;
              break;
            }
          }
        }
      }

      // Mortgage (fortnightly)
      const mortgage = w % 2 === 0 ? weeklyRepayment * 2 : 0;
      const expenses = lifeStageExpenses(inputs.weeklyExpenses, inputs.lifeStage);

      balance = balance + salary + partnerIncome + investmentIncome - mortgage - expenses - childExpenses - petExpenses - carExpenses - lifeEventCost;
      if (balance < -5000) balance = -5000;

      const weeklySurplus = salary + partnerIncome + investmentIncome - mortgage - expenses - childExpenses - petExpenses - carExpenses - lifeEventCost;

      weeks.push({
        week: w, year, balance: Math.round(balance),
        salary: Math.round(salary), partnerIncome: Math.round(partnerIncome),
        mortgage: Math.round(mortgage), expenses: Math.round(expenses),
        childExpenses: Math.round(childExpenses), petExpenses: Math.round(petExpenses),
        carExpenses: Math.round(carExpenses), investmentIncome: Math.round(investmentIncome),
        lifeEvent, lifeEventCost,
        loanRemaining: Math.round(currentLoan),
        weeklySurplus: Math.round(weeklySurplus),
        cumulativeInterest: Math.round(cumulativeInterest),
      });

      if (currentLoan <= 0) break;
    }

    return weeks;
  }, [inputs, totalWeeks]);

  const startSimulation = useCallback(() => {
    const weeks = generateSimulation();
    setAllWeeks(weeks);
    setCurrentWeek(0);
    setEventsHistory([]);
    setIsComplete(false);
    setSpeedIdx(1);
    setIsPlaying(true);
  }, [generateSimulation]);

  const reset = useCallback(() => {
    setIsPlaying(false); setAllWeeks(null); setCurrentWeek(0);
    setEventsHistory([]); setIsComplete(false); setSpeedIdx(1);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  /* ── Animation loop ── */
  useEffect(() => {
    if (!isPlaying || !allWeeks || speedIdx === 0) return;
    if (currentWeek >= allWeeks.length - 1) { setIsPlaying(false); setIsComplete(true); return; }

    timerRef.current = setTimeout(() => {
      setCurrentWeek((prev) => {
        const next = prev + 1;
        const wd = allWeeks[next];
        const newEvents: typeof eventsHistory = [];

        if (wd.salary > 0) newEvents.push({ week: wd.week, year: wd.year, text: 'Salary paid', type: 'income', amount: wd.salary });
        if (wd.partnerIncome > 0) newEvents.push({ week: wd.week, year: wd.year, text: 'Partner income', type: 'income', amount: wd.partnerIncome });
        if (wd.mortgage > 0) newEvents.push({ week: wd.week, year: wd.year, text: 'Mortgage repayment', type: 'mortgage', amount: -wd.mortgage });
        if (wd.childExpenses > 0) newEvents.push({ week: wd.week, year: wd.year, text: `Children (${inputs.numChildren})`, type: 'child', amount: -wd.childExpenses });
        if (wd.petExpenses > 0) newEvents.push({ week: wd.week, year: wd.year, text: 'Pet expenses', type: 'pet', amount: -wd.petExpenses });
        if (wd.carExpenses > 0) newEvents.push({ week: wd.week, year: wd.year, text: 'Car costs', type: 'car', amount: -wd.carExpenses });
        if (wd.investmentIncome > 0) newEvents.push({ week: wd.week, year: wd.year, text: 'Rental income', type: 'inv', amount: wd.investmentIncome });
        if (wd.lifeEvent) newEvents.push({
          week: wd.week, year: wd.year, text: wd.lifeEvent,
          type: wd.lifeEventCost > 0 ? 'life' : 'windfall',
          amount: wd.lifeEventCost > 0 ? -wd.lifeEventCost : Math.abs(wd.lifeEventCost),
        });

        if (newEvents.length > 0) setEventsHistory((h) => [...h, ...newEvents].slice(-200));
        return next;
      });
    }, SPEED_MS[speedIdx]);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, currentWeek, allWeeks, speedIdx, inputs.numChildren]);

  /* ── Auto-scroll event feed ── */
  useEffect(() => { if (eventFeedRef.current) eventFeedRef.current.scrollTop = eventFeedRef.current.scrollHeight; }, [eventsHistory.length]);

  const currentData = allWeeks?.[currentWeek];
  const progressPct = allWeeks ? (currentWeek / (allWeeks.length - 1)) * 100 : 0;

  const getBarColor = (balance: number) => {
    if (balance < 0) return '#ef4444';
    if (balance < 1000) return '#f59e0b';
    if (balance < 5000) return '#3b82f6';
    return '#22c55e';
  };

  const timelineChunks = allWeeks
    ? Array.from({ length: Math.ceil(allWeeks.length / 4) }, (_, i) => allWeeks[Math.min(i * 4, allWeeks.length - 1)])
    : [];

  const updateInput = <K extends keyof SimInputs>(key: K, value: SimInputs[K]) => setInputs(prev => ({ ...prev, [key]: value }));

  return (
    <div className="pp-calc-card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-serif">10-Year Life Simulator</h3>
          <p className="text-sm text-slate-500">Personalised — add your family, lifestyle, and investments</p>
        </div>
      </div>

      {/* ── Basic Inputs ── */}
      {!allWeeks && (
        <>
          <div className="pp-calc-grid mt-6">
            <div className="pp-input-group">
              <label className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Annual salary (gross)</label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input type="number" className="pl-8" value={inputs.annualSalary} onChange={e => updateInput('annualSalary', Number(e.target.value))} />
              </div>
            </div>
            <div className="pp-input-group">
              <label className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Partner salary (0 if single)</label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input type="number" className="pl-8" value={inputs.partnerSalary} onChange={e => updateInput('partnerSalary', Number(e.target.value))} />
              </div>
            </div>
            <div className="pp-input-group">
              <label>Weekly living expenses</label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input type="number" className="pl-8" value={inputs.weeklyExpenses} onChange={e => updateInput('weeklyExpenses', Number(e.target.value))} />
              </div>
            </div>
            <div className="pp-input-group">
              <label>Property price</label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input type="number" className="pl-8" value={inputs.propertyPrice} onChange={e => updateInput('propertyPrice', Number(e.target.value))} />
              </div>
            </div>
            <div className="pp-input-group">
              <label>Deposit saved</label>
              <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input type="number" className="pl-8" value={inputs.deposit} onChange={e => updateInput('deposit', Number(e.target.value))} />
              </div>
            </div>
            <div className="pp-input-group">
              <label>Interest rate</label>
              <div className="relative">
                <input type="number" step="0.01" value={inputs.interestRate} onChange={e => updateInput('interestRate', Number(e.target.value))} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
              </div>
            </div>
          </div>

          {/* ── Advanced Toggle ── */}
          <button onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 flex items-center gap-1">
            {showAdvanced ? '▼' : '▶'} Personalise your simulation
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
              <div className="pp-calc-grid">
                {/* Personal */}
                <div className="pp-input-group">
                  <label className="flex items-center gap-1.5"><Baby className="h-3.5 w-3.5" /> Number of children</label>
                  <select value={inputs.numChildren} onChange={e => updateInput('numChildren', Number(e.target.value))}>
                    <option value={0}>None</option>
                    <option value={1}>1 child</option>
                    <option value={2}>2 children</option>
                    <option value={3}>3 children</option>
                    <option value={4}>4 children</option>
                  </select>
                </div>
                <div className="pp-input-group">
                  <label className="flex items-center gap-1.5"><Dog className="h-3.5 w-3.5" /> Pet</label>
                  <select value={inputs.hasPet ? 'yes' : 'no'} onChange={e => updateInput('hasPet', e.target.value === 'yes')}>
                    <option value="no">No pet</option>
                    <option value="yes">Have a pet</option>
                  </select>
                </div>
                <div className="pp-input-group">
                  <label className="flex items-center gap-1.5"><Car className="h-3.5 w-3.5" /> Car</label>
                  <select value={inputs.hasCar ? 'yes' : 'no'} onChange={e => updateInput('hasCar', e.target.value === 'yes')}>
                    <option value="yes">Own a car</option>
                    <option value="no">No car</option>
                  </select>
                </div>
                <div className="pp-input-group">
                  <label>Life stage</label>
                  <select value={inputs.lifeStage} onChange={e => updateInput('lifeStage', e.target.value as SimInputs['lifeStage'])}>
                    <option value="young">Young professional</option>
                    <option value="family">Family life</option>
                    <option value="pre-retirement">Pre-retirement</option>
                  </select>
                </div>
                <div className="pp-input-group">
                  <label className="flex items-center gap-1.5"><TrendingDown className="h-3.5 w-3.5" /> Annual salary growth</label>
                  <div className="relative">
                    <input type="number" step="0.5" value={inputs.salaryGrowth} onChange={e => updateInput('salaryGrowth', Number(e.target.value))} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                  </div>
                </div>
                <div className="pp-input-group">
                  <label>Loan term</label>
                  <select value={inputs.loanTerm} onChange={e => updateInput('loanTerm', Number(e.target.value))}>
                    <option value={20}>20 years</option>
                    <option value={25}>25 years</option>
                    <option value={30}>30 years</option>
                  </select>
                </div>
              </div>

              {/* Investment Property */}
              <div className="pp-calc-grid">
                <div className="pp-input-group">
                  <label className="flex items-center gap-1.5"><Home className="h-3.5 w-3.5" /> Investment property</label>
                  <select value={inputs.hasInvestmentProperty ? 'yes' : 'no'} onChange={e => updateInput('hasInvestmentProperty', e.target.value === 'yes')}>
                    <option value="no">No investment property</option>
                    <option value="yes">Own investment property</option>
                  </select>
                </div>
                {inputs.hasInvestmentProperty && (
                  <>
                    <div className="pp-input-group">
                      <label>Investment property price</label>
                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input type="number" className="pl-8" value={inputs.invPropertyPrice} onChange={e => updateInput('invPropertyPrice', Number(e.target.value))} />
                      </div>
                    </div>
                    <div className="pp-input-group">
                      <label className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> Weekly rent received</label>
                      <div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input type="number" className="pl-8" value={inputs.invWeeklyRent} onChange={e => updateInput('invWeeklyRent', Number(e.target.value))} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <Button onClick={startSimulation} className="gap-2 mt-6">
            <Play className="h-4 w-4" />
            Start 10-Year Simulation
          </Button>
        </>
      )}

      {/* ── Active Simulation UI ── */}
      {allWeeks && currentData && (
        <div className="mt-6 space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-slate-600">Year {currentData.year} — Week {currentData.week % 52 === 0 ? 52 : currentData.week % 52} of 52</span>
              <span className="text-slate-400">{currentWeek + 1} / {allWeeks.length} weeks</span>
            </div>
            <div className="pp-progress-bar"><div className="pp-progress-fill" style={{ width: `${progressPct}%` }} /></div>
          </div>

          {/* Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <DashboardCard icon={<Wallet className="h-4 w-4" />} label="Bank Balance" value={`$${currentData.balance.toLocaleString()}`}
              color={currentData.balance < 0 ? 'text-red-600' : currentData.balance < 2000 ? 'text-amber-600' : 'text-emerald-600'}
              sub={currentData.balance < 0 ? 'Overdrawn' : currentData.balance < 2000 ? 'Low buffer' : 'Healthy'} />
            <DashboardCard icon={<Home className="h-4 w-4" />} label="Loan Remaining" value={`$${currentData.loanRemaining.toLocaleString()}`}
              color="text-slate-700" sub={`${Math.ceil((allWeeks.length - currentWeek) / 52)} years left`} />
            <DashboardCard icon={<DollarSign className="h-4 w-4" />} label="Weekly Surplus" value={`$${currentData.weeklySurplus.toLocaleString()}`}
              color={currentData.weeklySurplus < 0 ? 'text-red-600' : 'text-emerald-600'} sub="After all expenses" />
            <DashboardCard icon={<Calendar className="h-4 w-4" />} label="Interest Paid" value={`$${currentData.cumulativeInterest.toLocaleString()}`}
              color="text-slate-700" sub="Cumulative" />
          </div>

          {/* Breakdown row */}
          {(inputs.numChildren > 0 || inputs.hasPet || inputs.hasCar || inputs.hasInvestmentProperty) && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {inputs.numChildren > 0 && (
                <MiniStat icon={<Baby className="h-3 w-3" />} label="Children" value={`-$${currentData.childExpenses}/wk`} color="text-purple-600" />
              )}
              {inputs.hasPet && (
                <MiniStat icon={<Dog className="h-3 w-3" />} label="Pet" value={`-$${currentData.petExpenses}/wk`} color="text-amber-600" />
              )}
              {inputs.hasCar && (
                <MiniStat icon={<Car className="h-3 w-3" />} label="Car" value={`-$${currentData.carExpenses}/wk`} color="text-blue-600" />
              )}
              {inputs.hasInvestmentProperty && (
                <MiniStat icon={<PiggyBank className="h-3 w-3" />} label="Rent" value={`+$${currentData.investmentIncome}/wk`} color="text-emerald-600" />
              )}
            </div>
          )}

          {/* Timeline + Event Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                Balance Timeline
              </h4>
              <div className="flex gap-[1px] h-24 items-end bg-slate-100 rounded-lg p-2 overflow-hidden">
                {timelineChunks.map((chunk, i) => {
                  const isCurrent = i === Math.floor(currentWeek / 4);
                  const maxBal = Math.max(...allWeeks.map(w => Math.abs(w.balance)), 1);
                  const h = Math.min(100, Math.max(4, 50 + (chunk.balance / maxBal) * 50));
                  return (
                    <div key={i} className="flex-1 min-w-[2px] rounded-sm transition-all duration-150"
                      style={{ height: `${h}%`, backgroundColor: isCurrent ? '#1e40af' : getBarColor(chunk.balance), opacity: isCurrent ? 1 : 0.7, transform: isCurrent ? 'scaleX(1.5)' : 'scaleX(1)' }}
                      title={`W${chunk.week}: $${chunk.balance.toLocaleString()}`} />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Year 1</span>
                {inputs.simYears >= 3 && <span>Year {Math.round(inputs.simYears / 2)}</span>}
                <span>Year {inputs.simYears}</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-green-500 inline-block" /> Comfortable</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> Moderate</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" /> Tight</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500 inline-block" /> Overdrawn</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-800 inline-block" /> Current</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Zap className="h-4 w-4 text-slate-400" />
                Event Feed
              </h4>
              <div ref={eventFeedRef} className="pp-event-log" style={{ maxHeight: '180px' }}>
                {eventsHistory.length === 0
                  ? <div className="text-slate-400 text-center py-8">Waiting for events...</div>
                  : eventsHistory.map((evt, i) => (
                    <div key={`${evt.week}-${i}`} className={`flex items-center gap-2 py-1 border-b border-slate-100 last:border-0 ${
                      evt.type === 'income' || evt.type === 'windfall' || evt.type === 'inv' ? 'text-emerald-600' :
                      evt.type === 'mortgage' ? 'text-orange-600' :
                      evt.type === 'child' ? 'text-purple-600' :
                      evt.type === 'pet' ? 'text-amber-600' :
                      evt.type === 'car' ? 'text-blue-600' :
                      'text-red-600'
                    }`}>
                      <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-50" />
                      <span className="text-slate-400 text-[10px] w-12 flex-shrink-0">W{evt.week}</span>
                      <span className="flex-1 truncate">{evt.text}</span>
                      <span className="font-mono text-[11px] flex-shrink-0">{evt.amount >= 0 ? '+' : ''}${Math.abs(evt.amount).toLocaleString()}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
            <Button size="sm" onClick={() => setIsPlaying(!isPlaying)} className="gap-2">
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : isComplete ? 'Replay' : 'Play'}
            </Button>
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {SPEED_LABELS.map((label, i) => (
                <button key={label} onClick={() => setSpeedIdx(i)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${speedIdx === i ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {label}
                </button>
              ))}
            </div>
            <Button size="sm" variant="outline" onClick={reset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              New Simulation
            </Button>
            {isComplete && (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5 ml-auto">
                <Clock className="h-4 w-4" />
                Simulation complete!
              </span>
            )}
          </div>

          {/* Completion Summary */}
          {isComplete && allWeeks && (
            <div className="pp-callout pp-callout-blue">
              <span className="pp-callout-tag">Summary</span>
              <div className="space-y-1 text-sm">
                <p>
                  After <strong>{allWeeks.length} weeks</strong> ({Math.round(allWeeks.length / 52 * 10) / 10} years), your bank balance is{' '}
                  <strong className={allWeeks[allWeeks.length - 1].balance >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                    ${allWeeks[allWeeks.length - 1].balance.toLocaleString()}
                  </strong>{' '}
                  with <strong>${allWeeks[allWeeks.length - 1].loanRemaining.toLocaleString()}</strong> remaining on the loan.
                </p>
                <p>
                  Total interest: <strong>${allWeeks[allWeeks.length - 1].cumulativeInterest.toLocaleString()}</strong> |
                  Life events: <strong>{allWeeks.filter(w => w.lifeEvent).length}</strong> |
                  Negative weeks: <strong>{allWeeks.filter(w => w.balance < 0).length}</strong>
                  {inputs.numChildren > 0 && <> | Child costs: <strong>${allWeeks.reduce((s, w) => s + w.childExpenses, 0).toLocaleString()}</strong></>}
                  {inputs.hasPet && <> | Pet costs: <strong>${allWeeks.reduce((s, w) => s + w.petExpenses, 0).toLocaleString()}</strong></>}
                  {inputs.hasCar && <> | Car costs: <strong>${allWeeks.reduce((s, w) => s + w.carExpenses, 0).toLocaleString()}</strong></>}
                </p>
                {allWeeks.filter(w => w.balance < 0).length > 10 && (
                  <p className="text-amber-700 mt-2 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    You went overdrawn multiple times. Consider reducing expenses, increasing income, or lowering your property budget.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Assumptions */}
      {allWeeks && (
        <div className="pp-callout pp-callout-blue mt-6">
          <span className="pp-callout-tag">Note</span>
          <div className="text-sm">
            Fortnightly salary and mortgage repayments assumed.
            {inputs.numChildren > 0 && ` Child costs increase as they age (baby → school → teen).`}
            {inputs.hasPet && ` Pet includes food, insurance, and vet visits.`}
            {inputs.hasCar && ` Car includes fuel, insurance, rego, and maintenance averaged weekly.`}
            {inputs.hasInvestmentProperty && ` Investment property assumes 80% LVR loan and 0.5% annual maintenance.`}
            {inputs.partnerSalary > 0 && ` Partner income is included in household calculations.`}
            {' '}Random life events use typical Australian household frequencies. Results are directional only.
          </div>
        </div>
      )}
      <CalculatorDisclaimer />
    </div>
  );
}

/* ── Dashboard Card ── */
function DashboardCard({ icon, label, value, color, sub }: { icon: React.ReactNode; label: string; value: string; color: string; sub: string }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-slate-400 mb-2">{icon}<span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span></div>
      <div className={`text-xl font-bold font-serif ${color}`}>{value}</div>
      <div className="text-[11px] text-slate-400 mt-1">{sub}</div>
    </div>
  );
}

/* ── Mini Stat ── */
function MiniStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3 text-center">
      <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">{icon}<span className="text-[10px] font-semibold uppercase">{label}</span></div>
      <div className={`text-sm font-bold font-serif ${color}`}>{value}</div>
    </div>
  );
}
