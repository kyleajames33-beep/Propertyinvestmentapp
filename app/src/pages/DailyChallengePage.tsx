import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, Trophy, Flame, Share2, ArrowRight, Home, Bed, Bath, Car,
  Calendar, MapPin, Info, TrendingUp, RotateCcw, CheckCircle2,
  Lock, Unlock, ChevronRight, X, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import {
  getTodaysProperty,
  scoreGuess,
  getAccuracyLabel,
  formatPrice,
  formatFullPrice,
  type DailyProperty,
} from '@/data/dailyProperties';
import {
  getGamificationState,
  recordChallengeResult,
  getLeaderboard,
  generateChallengeShareText,
  type ChallengeResult,
  type LeaderboardEntry,
} from '@/lib/gamification';

// ─── Components ──────────────────────────────────────────────────────

function PropertyCard({ property }: { property: DailyProperty }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="relative aspect-[16/10] bg-slate-100">
        <img
          src={property.image}
          alt={`${property.address}, ${property.suburb}`}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-slate-800">
            {property.propertyType}
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur text-xs font-medium text-white">
            Sold {new Date(property.soldDate).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{property.address}</h2>
          <p className="text-sm text-slate-500 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {property.suburb}, {property.state} {property.postcode}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1 text-sm text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
            <Bed className="h-4 w-4 text-slate-400" /> {property.bedrooms}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
            <Bath className="h-4 w-4 text-slate-400" /> {property.bathrooms}
          </span>
          <span className="inline-flex items-center gap-1 text-sm text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
            <Car className="h-4 w-4 text-slate-400" /> {property.parking}
          </span>
          {property.landSize && (
            <span className="inline-flex items-center gap-1 text-sm text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg">
              <Home className="h-4 w-4 text-slate-400" /> {property.landSize}
            </span>
          )}
        </div>
        
        <p className="text-sm text-slate-600 leading-relaxed">{property.description}</p>
        
        {property.hint && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3">
            <HelpCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">{property.hint}</p>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
          <span>Sold by {property.agent}, {property.agency}</span>
        </div>
      </div>
    </div>
  );
}

function PriceInput({ value, onChange, min, max, disabled }: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
}) {
  const presets = [500000, 750000, 1000000, 1500000, 2000000, 3000000, 5000000];
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400 font-medium">$</span>
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="Enter your guess..."
          disabled={disabled}
          className="w-full rounded-xl border-2 border-slate-200 bg-white pl-10 pr-4 py-4 text-2xl font-bold text-slate-900 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all disabled:bg-slate-50 disabled:text-slate-400"
        />
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step={10000}
        value={value || min}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full accent-primary h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
      />
      
      <div className="flex flex-wrap gap-2">
        {presets.map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            disabled={disabled}
            className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {formatPrice(p)}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ result, property, onShare, streak }: {
  result: ChallengeResult;
  property: DailyProperty;
  onShare: () => void;
  streak: number;
}) {
  const accuracy = Math.round((1 - Math.abs(result.guess - result.actual) / result.actual) * 100);
  const label = getAccuracyLabel(result.score);
  const diff = result.guess - result.actual;
  
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="bg-slate-900 text-white p-6 text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/10 mb-4">
          <Trophy className="h-10 w-10 text-amber-400" />
        </div>
        <h3 className="text-3xl font-bold mb-1">{result.score}/100</h3>
        <p className="text-slate-300">{label}</p>
        {streak > 1 && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-sm font-medium">
            <Flame className="h-4 w-4" /> {streak} day streak
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Your Guess</p>
            <p className="text-xl font-bold text-slate-900">{formatFullPrice(result.guess)}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
            <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Actual Price</p>
            <p className="text-xl font-bold text-emerald-700">{formatFullPrice(result.actual)}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-slate-500">You were</span>
          <span className={`font-bold ${diff > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
            {diff > 0 ? `${formatFullPrice(diff)} over` : `${formatFullPrice(Math.abs(diff))} under`}
          </span>
        </div>
        
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              result.score >= 80 ? 'bg-emerald-500' : result.score >= 60 ? 'bg-amber-500' : 'bg-red-400'
            }`}
            style={{ width: `${result.score}%` }}
          />
        </div>
        
        <div className="flex gap-3 pt-2">
          <Button onClick={onShare} variant="outline" className="flex-1 gap-2">
            <Share2 className="h-4 w-4" /> Share Result
          </Button>
          <Button onClick={() => window.location.reload()} variant="secondary" className="flex-1 gap-2">
            <RotateCcw className="h-4 w-4" /> Play Again
          </Button>
        </div>
      </div>
    </div>
  );
}

function LeaderboardPreview({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" /> Top Buyers
        </h3>
      </div>
      <div className="space-y-2">
        {entries.map((entry, i) => (
          <div
            key={entry.name}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              entry.isYou ? 'bg-primary/5 border border-primary/20' : 'bg-slate-50'
            }`}
          >
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              i === 0 ? 'bg-amber-100 text-amber-700' :
              i === 1 ? 'bg-slate-200 text-slate-700' :
              i === 2 ? 'bg-orange-100 text-orange-700' :
              'bg-slate-100 text-slate-500'
            }`}>
              {i + 1}
            </span>
            <span className="flex-1 text-sm font-medium text-slate-700">
              {entry.name} {entry.isYou && <span className="text-primary text-xs">(You)</span>}
            </span>
            <span className="text-xs text-slate-400">Lv.{entry.level}</span>
            <span className="text-xs font-bold text-slate-700">{entry.xp} XP</span>
            {entry.streak > 2 && (
              <span className="text-xs flex items-center gap-0.5 text-amber-600">
                <Flame className="h-3 w-3" />{entry.streak}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HowItWorks() {
  const [open, setOpen] = useState(false);
  
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        <Info className="h-3.5 w-3.5" /> How scoring works
      </button>
    );
  }
  
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-slate-700">How scoring works</p>
        <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex justify-between"><span>Within 1%</span><span className="font-bold text-emerald-600">100 pts</span></div>
        <div className="flex justify-between"><span>Within 5%</span><span className="font-bold text-emerald-500">80 pts</span></div>
        <div className="flex justify-between"><span>Within 10%</span><span className="font-bold text-amber-500">60 pts</span></div>
        <div className="flex justify-between"><span>Within 20%</span><span className="font-bold text-amber-400">40 pts</span></div>
        <div className="flex justify-between"><span>Within 50%</span><span className="font-bold text-orange-400">20 pts</span></div>
        <div className="flex justify-between"><span>Over 50% off</span><span className="font-bold text-red-400">0 pts</span></div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export function DailyChallengePage() {
  const navigate = useNavigate();
  const [property] = useState<DailyProperty>(getTodaysProperty());
  const [guess, setGuess] = useState<number>(1000000);
  const [result, setResult] = useState<ChallengeResult | null>(null);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [gamificationState, setGamificationState] = useState(getGamificationState());
  const [showCopied, setShowCopied] = useState(false);
  
  useEffect(() => {
    const state = getGamificationState();
    const today = new Date().toISOString().split('T')[0];
    const todayResult = state.challengeHistory.find(h => h.date === today && h.propertyId === property.id);
    if (todayResult) {
      setResult(todayResult);
      setHasPlayed(true);
    }
    setGamificationState(state);
  }, [property.id]);
  
  const handleSubmit = useCallback(() => {
    if (!guess || guess <= 0) return;
    
    const score = scoreGuess(guess, property.soldPrice);
    const result = recordChallengeResult(property.id, guess, property.soldPrice, score);
    setResult(result.state.challengeHistory[result.state.challengeHistory.length - 1]);
    setGamificationState(result.state);
    setHasPlayed(true);
  }, [guess, property]);
  
  const handleShare = useCallback(() => {
    if (!result) return;
    const text = generateChallengeShareText(result.score, gamificationState.streak);
    navigator.clipboard.writeText(text).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  }, [result, gamificationState.streak]);
  
  const leaderboard = getLeaderboard();
  
  return (
    <div className="pp-container py-8">
      <SEO
        title="Daily Property Challenge — Guess the Sale Price"
        description="Test your property market knowledge. Guess the sale price of a real NSW property every day. Compete with friends and build your streak."
      />
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Target className="h-3.5 w-3.5" />
          New property every day
        </div>
        <h1 className="pp-title text-3xl md:text-4xl mb-3">Daily Property Challenge</h1>
        <p className="pp-subtitle text-base max-w-lg mx-auto">
          Can you guess what this NSW property sold for? Test your market knowledge against buyers across the state.
        </p>
      </div>
      
      {/* Stats Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{gamificationState.streak}</p>
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
              <Flame className="h-3 w-3 text-amber-500" /> Day Streak
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{gamificationState.level}</p>
            <p className="text-xs text-slate-500">Level</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-slate-900">{gamificationState.totalChallengesPlayed}</p>
            <p className="text-xs text-slate-500">Played</p>
          </div>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
        {/* Left: Property + Game */}
        <div className="lg:col-span-3 space-y-6">
          <PropertyCard property={property} />
          
          {!hasPlayed ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-1">What did it sell for?</h3>
              <p className="text-sm text-slate-500 mb-5">Enter your best guess. Closer = more points.</p>
              
              <PriceInput
                value={guess}
                onChange={setGuess}
                min={300000}
                max={8000000}
              />
              
              <div className="mt-5 flex items-center justify-between">
                <HowItWorks />
                <Button
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!guess || guess <= 0}
                  className="gap-2"
                >
                  Submit Guess <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : result ? (
            <ResultCard
              result={result}
              property={property}
              onShare={handleShare}
              streak={gamificationState.streak}
            />
          ) : null}
          
          {showCopied && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center text-sm text-emerald-700 flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Result copied! Share it with your friends.
            </div>
          )}
          
          {/* CTA Cards */}
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/journey')}
              className="text-left bg-slate-50 hover:bg-slate-100 rounded-xl p-4 border border-slate-200 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Learn to value property</p>
                  <p className="text-xs text-slate-500 mt-1">Follow our 8-stage buyer journey</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </button>
            <button
              onClick={() => navigate('/compare')}
              className="text-left bg-slate-50 hover:bg-slate-100 rounded-xl p-4 border border-slate-200 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Compare properties</p>
                  <p className="text-xs text-slate-500 mt-1">Use our side-by-side tool</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </div>
            </button>
          </div>
        </div>
        
        {/* Right: Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <LeaderboardPreview entries={leaderboard} />
          
          {/* Previous Results */}
          {gamificationState.challengeHistory.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-primary" /> Your History
              </h3>
              <div className="space-y-2">
                {[...gamificationState.challengeHistory].reverse().slice(0, 7).map((h, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                    <div>
                      <p className="text-xs text-slate-500">{new Date(h.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric' })}</p>
                      <p className="text-sm font-medium text-slate-700">{formatFullPrice(h.guess)}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${
                        h.score >= 80 ? 'text-emerald-600' : h.score >= 60 ? 'text-amber-600' : 'text-red-500'
                      }`}>
                        {h.score}
                      </span>
                      <p className="text-[10px] text-slate-400">Actual: {formatPrice(h.actual)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Invite Buddy */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white">
            <h3 className="font-bold mb-2">Challenge a Friend</h3>
            <p className="text-sm text-slate-300 mb-4">
              Guess prices together and see who knows the NSW market better.
            </p>
            <Button
              variant="secondary"
              className="w-full gap-2"
              onClick={() => {
                const text = `I'm playing PropertyPath's Daily Challenge. Think you can guess NSW property prices better than me? ${window.location.origin}/#/challenge`;
                navigator.clipboard.writeText(text);
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 2000);
              }}
            >
              <Share2 className="h-4 w-4" /> Copy Invite Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
