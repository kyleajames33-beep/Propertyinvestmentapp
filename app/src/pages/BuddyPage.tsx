import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserPlus, UserMinus, Mail, Copy, CheckCircle2, X,
  Heart, MessageCircle, Share2, ArrowRight, Sparkles, Shield,
  Target, TrendingUp, Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import {
  getGamificationState,
  addBuddy,
  removeBuddy,
  getBuddies,
  getLevelTitle,
} from '@/lib/gamification';

// ─── Demo Buddy Data ─────────────────────────────────────────────────

interface BuddyProfile {
  name: string;
  level: number;
  xp: number;
  streak: number;
  stage: string;
  lastActive: string;
  avatar: string;
}

const DEMO_BUDDIES: Record<string, BuddyProfile> = {
  'Sarah': {
    name: 'Sarah',
    level: 7,
    xp: 2800,
    streak: 12,
    stage: 'Stage 3: Finance & Pre-Approval',
    lastActive: '2 hours ago',
    avatar: 'S',
  },
  'Mike': {
    name: 'Mike',
    level: 4,
    xp: 1200,
    streak: 3,
    stage: 'Stage 1: Research & Budget',
    lastActive: 'Yesterday',
    avatar: 'M',
  },
};

// ─── Components ──────────────────────────────────────────────────────

function BuddyCard({ name, onRemove }: { name: string; onRemove: () => void }) {
  const profile = DEMO_BUDDIES[name] || {
    name,
    level: 1,
    xp: 0,
    streak: 0,
    stage: 'Just getting started',
    lastActive: 'Recently',
    avatar: name[0]?.toUpperCase() || '?',
  };
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
            {profile.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{profile.name}</h3>
            <p className="text-xs text-slate-500">{getLevelTitle(profile.level)}</p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Remove buddy"
        >
          <UserMinus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Current stage</span>
          <span className="font-medium text-slate-700 text-xs">{profile.stage}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Level</span>
          <span className="font-medium text-slate-700">{profile.level}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Streak</span>
          <span className="font-medium text-amber-600 flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" /> {profile.streak} days
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Last active</span>
          <span className="text-slate-400 text-xs">{profile.lastActive}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          <MessageCircle className="h-3.5 w-3.5" /> Nudge
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
          <Target className="h-3.5 w-3.5" /> Challenge
        </button>
      </div>
    </div>
  );
}

function InviteSection() {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  
  const inviteLink = `${window.location.origin}/#/buddy?ref=invite`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`Join me on PropertyPath — we're buying property smarter together. ${inviteLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setEmail('');
    }, 3000);
  };
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-primary" /> Invite a Buying Buddy
      </h3>
      <p className="text-sm text-slate-500 mb-5">
        Team up with your partner, friend, or family member. Track each other's progress, share insights, and stay accountable.
      </p>
      
      {/* Link copy */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2.5 text-sm text-slate-600 border border-slate-200 truncate">
          {inviteLink}
        </div>
        <Button variant="outline" onClick={handleCopy} className="gap-2 flex-shrink-0">
          {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      
      {/* Email invite */}
      <form onSubmit={handleEmailInvite} className="flex gap-2">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter their email..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <Button type="submit" disabled={sent} className="gap-2 flex-shrink-0">
          {sent ? <CheckCircle2 className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
          {sent ? 'Sent!' : 'Send'}
        </Button>
      </form>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export function BuddyPage() {
  const navigate = useNavigate();
  const [buddies, setBuddies] = useState(getBuddies());
  const [newBuddyName, setNewBuddyName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  const handleAddBuddy = () => {
    if (!newBuddyName.trim()) return;
    addBuddy(newBuddyName.trim());
    setBuddies(getBuddies());
    setNewBuddyName('');
    setShowAddForm(false);
  };
  
  const handleRemoveBuddy = (name: string) => {
    removeBuddy(name);
    setBuddies(getBuddies());
  };
  
  return (
    <div className="pp-container py-8">
      <SEO
        title="Buying Buddy — PropertyPath"
        description="Team up with your partner or friend to buy property together. Track progress, share insights, and stay accountable."
      />
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Users className="h-3.5 w-3.5" />
          Better together
        </div>
        <h1 className="pp-title text-3xl md:text-4xl mb-3">Buying Buddy</h1>
        <p className="pp-subtitle text-base max-w-lg mx-auto">
          Property buying is hard alone. Team up with your partner, a friend, or family member to stay accountable and share the journey.
        </p>
      </div>
      
      <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Your Buddies */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-400" /> Your Buddies
              </h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAddForm(!showAddForm)}
                className="gap-1"
              >
                <UserPlus className="h-3.5 w-3.5" /> Add Buddy
              </Button>
            </div>
            
            {showAddForm && (
              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 shadow-sm">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBuddyName}
                    onChange={(e) => setNewBuddyName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddBuddy()}
                    placeholder="Buddy's name..."
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleAddBuddy}>Add</Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {buddies.length === 0 ? (
              <div className="bg-slate-50 rounded-xl border border-dashed border-slate-300 p-8 text-center">
                <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-600 mb-1">No buddies yet</p>
                <p className="text-xs text-slate-400 mb-4">Add your partner, friend, or family member</p>
                <Button size="sm" onClick={() => setShowAddForm(true)}>
                  <UserPlus className="h-3.5 w-3.5 mr-1" /> Add First Buddy
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {buddies.map(buddy => (
                  <BuddyCard
                    key={buddy}
                    name={buddy}
                    onRemove={() => handleRemoveBuddy(buddy)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Shared Progress */}
          {buddies.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Shared Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600">Journey Progress</span>
                    <span className="font-medium text-slate-800">Stage 2 of 8</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600">Documents Collected</span>
                    <span className="font-medium text-slate-800">4 of 12</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '33%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-600">Properties Inspected</span>
                    <span className="font-medium text-slate-800">6</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <InviteSection />
          
          {/* Why Buddy Up */}
          <div className="bg-slate-900 rounded-xl p-5 text-white">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" /> Why Buddy Up?
            </h3>
            <ul className="space-y-3">
              {[
                { icon: Target, text: 'Stay accountable — check in on each other\'s progress' },
                { icon: MessageCircle, text: 'Share insights from inspections and open homes' },
                { icon: Shield, text: 'Double-check contracts and decisions together' },
                { icon: TrendingUp, text: 'Compete on the daily challenge leaderboard' },
                { icon: Heart, text: 'Celebrate milestones together' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                  <item.icon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/challenge')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <span className="text-sm font-medium text-slate-700">Daily Challenge</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/journey')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <span className="text-sm font-medium text-slate-700">Continue Journey</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/progress')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <span className="text-sm font-medium text-slate-700">Your Progress</span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
