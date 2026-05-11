import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy, Flame, Star, Lock, Unlock, TrendingUp, Target, Calendar,
  ArrowRight, ChevronRight, Award, Zap, Crown, Diamond, Share2,
  CheckCircle2, XCircle, HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import {
  getGamificationState,
  getLevelTitle,
  getXpToNextLevel,
  getProgressPercent,
  getUnlockedAchievements,
  getLockedAchievements,
  getLeaderboard,
  ACHIEVEMENTS,
  LEVEL_THRESHOLDS,
  type LeaderboardEntry,
} from '@/lib/gamification';
import { Progress } from '@/components/ui/progress';

// ─── Components ──────────────────────────────────────────────────────

function LevelBadge({ level }: { level: number }) {
  const colors = [
    'bg-slate-100 text-slate-600',
    'bg-emerald-100 text-emerald-700',
    'bg-teal-100 text-teal-700',
    'bg-cyan-100 text-cyan-700',
    'bg-sky-100 text-sky-700',
    'bg-blue-100 text-blue-700',
    'bg-indigo-100 text-indigo-700',
    'bg-violet-100 text-violet-700',
    'bg-purple-100 text-purple-700',
    'bg-fuchsia-100 text-fuchsia-700',
    'bg-pink-100 text-pink-700',
    'bg-rose-100 text-rose-700',
  ];
  const colorClass = colors[level % colors.length];
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
      <Star className="h-3 w-3" /> Level {level}
    </div>
  );
}

function StatCard({ icon, label, value, subtext, color }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${color || 'bg-slate-100'}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  );
}

function AchievementCard({ achievement, unlocked }: {
  achievement: typeof ACHIEVEMENTS[0];
  unlocked: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 transition-all ${
      unlocked
        ? 'bg-white border-slate-200 shadow-sm'
        : 'bg-slate-50 border-slate-200 opacity-60'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
          unlocked ? 'bg-primary/10' : 'bg-slate-200'
        }`}>
          {unlocked ? achievement.icon : <Lock className="h-4 w-4 text-slate-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-semibold text-sm ${unlocked ? 'text-slate-900' : 'text-slate-500'}`}>
              {achievement.name}
            </h4>
            {unlocked && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">
                +{achievement.xpReward} XP
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
}

function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <div className="space-y-2">
      {entries.map((entry, i) => (
        <div
          key={entry.name + i}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
            entry.isYou
              ? 'bg-primary/5 border border-primary/20'
              : 'bg-white border border-slate-100'
          }`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            i === 0 ? 'bg-amber-100 text-amber-700' :
            i === 1 ? 'bg-slate-200 text-slate-700' :
            i === 2 ? 'bg-orange-100 text-orange-700' :
            'bg-slate-100 text-slate-500'
          }`}>
            {i + 1}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">
                {entry.name} {entry.isYou && <span className="text-primary text-xs font-normal">(You)</span>}
              </span>
              {entry.streak >= 7 && (
                <span className="text-[10px] flex items-center gap-0.5 text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                  <Flame className="h-2.5 w-2.5" />{entry.streak}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{getLevelTitle(entry.level)}</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{entry.xp.toLocaleString()} XP</p>
            <p className="text-xs text-slate-400">Lv.{entry.level}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export function GamificationHubPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'leaderboard'>('overview');
  
  const state = getGamificationState();
  const levelTitle = getLevelTitle(state.level);
  const progress = getXpToNextLevel(state.xp);
  const progressPercent = getProgressPercent();
  const unlocked = getUnlockedAchievements();
  const locked = getLockedAchievements();
  const leaderboard = getLeaderboard();
  
  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
    { id: 'achievements' as const, label: 'Achievements', icon: Award },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: Trophy },
  ];
  
  return (
    <div className="pp-container py-8">
      <SEO
        title="Your Progress — PropertyPath"
        description="Track your property buying journey progress, achievements, and compete on the leaderboard."
      />
      
      {/* Hero Profile */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/10 mb-4 ring-4 ring-white/5">
              <Crown className="h-10 w-10 text-amber-400" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{levelTitle}</h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <LevelBadge level={state.level} />
              <span className="text-sm text-slate-400">{state.xp.toLocaleString()} XP</span>
            </div>
            
            <div className="max-w-xs mx-auto">
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Level {state.level}</span>
                <span>Level {state.level + 1}</span>
              </div>
              <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                {progress.needed.toLocaleString()} XP to next level
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={<Flame className="h-5 w-5 text-amber-500" />}
            label="Current Streak"
            value={state.streak}
            subtext={`Best: ${state.longestStreak}`}
            color="bg-amber-50"
          />
          <StatCard
            icon={<Target className="h-5 w-5 text-primary" />}
            label="Challenges"
            value={state.totalChallengesPlayed}
            subtext="Daily properties guessed"
            color="bg-primary/10"
          />
          <StatCard
            icon={<Award className="h-5 w-5 text-purple-500" />}
            label="Achievements"
            value={`${unlocked.length}/${ACHIEVEMENTS.length}`}
            subtext={`${locked.length} locked`}
            color="bg-purple-50"
          />
          <StatCard
            icon={<Star className="h-5 w-5 text-emerald-500" />}
            label="Total XP"
            value={state.xp.toLocaleString()}
            subtext="Earned across all activities"
            color="bg-emerald-50"
          />
        </div>
      </div>
      
      {/* Tabs */}
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/challenge')}
                className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-slate-900">Daily Challenge</h3>
                    </div>
                    <p className="text-sm text-slate-500">Guess today's property price and build your streak</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </button>
              
              <button
                onClick={() => navigate('/journey')}
                className="text-left bg-white rounded-xl border border-slate-200 p-5 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-5 w-5 text-amber-500" />
                      <h3 className="font-bold text-slate-900">Continue Journey</h3>
                    </div>
                    <p className="text-sm text-slate-500">Complete stages to earn big XP rewards</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              </button>
            </div>
            
            {/* Recent Activity */}
            {state.challengeHistory.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Recent Challenges
                </h3>
                <div className="space-y-2">
                  {[...state.challengeHistory].reverse().slice(0, 5).map((h, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${
                          h.score >= 80 ? 'text-emerald-600' : h.score >= 60 ? 'text-amber-600' : 'text-red-500'
                        }`}>
                          {h.score}
                        </span>
                        <span className="text-sm text-slate-600">
                          Guessed {new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(h.guess)}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {new Date(h.date).toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* How to Earn XP */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> How to Earn XP
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { action: 'Daily Challenge', xp: '10-60', desc: 'Guess property prices' },
                  { action: 'Complete Journey Stage', xp: '100', desc: 'Finish a full stage' },
                  { action: 'Complete Section', xp: '25', desc: 'Each checklist section' },
                  { action: '3-Day Streak', xp: '30', desc: 'Bonus for consistency' },
                  { action: '7-Day Streak', xp: '75', desc: 'Weekly dedication' },
                  { action: 'Refer a Friend', xp: '50', desc: 'They join the platform' },
                ].map(item => (
                  <div key={item.action} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.action}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">+{item.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{unlocked.length}</span> of {ACHIEVEMENTS.length} unlocked
              </p>
              <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
                />
              </div>
            </div>
            
            {unlocked.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Unlock className="h-4 w-4 text-emerald-500" /> Unlocked
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {unlocked.map(a => (
                    <AchievementCard key={a.id} achievement={a} unlocked={true} />
                  ))}
                </div>
              </div>
            )}
            
            {locked.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-slate-400" /> Locked
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {locked.map(a => (
                    <AchievementCard key={a.id} achievement={a} unlocked={false} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <Trophy className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800">Compete with other buyers</p>
                <p className="text-xs text-amber-700 mt-1">
                  Earn XP by using tools, completing journey stages, and playing the daily challenge. 
                  Your rank updates in real time.
                </p>
              </div>
            </div>
            
            <LeaderboardTable entries={leaderboard} />
            
            <div className="text-center">
              <Button variant="outline" onClick={() => navigate('/challenge')} className="gap-2">
                <Target className="h-4 w-4" /> Play Daily Challenge
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
