import { storage } from './storage';

// ─── Types ───────────────────────────────────────────────────────────

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  achievements: string[];
  challengeHistory: ChallengeResult[];
  totalChallengesPlayed: number;
  buddies: string[];
}

export interface ChallengeResult {
  date: string;
  propertyId: string;
  guess: number;
  actual: number;
  score: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  condition: (state: GamificationState) => boolean;
}

// ─── XP & Level System ───────────────────────────────────────────────

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800,
  4700, 5700, 6800, 8000, 9300, 10700, 12200, 13800, 15500, 17300,
];

export function getXpForLevel(level: number): number {
  return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
}

export function getLevelFromXp(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i;
  }
  return 0;
}

export function getLevelTitle(level: number): string {
  const titles = [
    'First Home Dreamer',
    'Open Home Rookie',
    'Deposit Saver',
    'Contract Reader',
    'Negotiation Novice',
    'Property Scout',
    'Market Analyst',
    'Deal Spotter',
    'Auction Veteran',
    'Savvy Buyer',
    'Portfolio Planner',
    'Investment Strategist',
    'Property Whisperer',
    'Market Master',
    'Wealth Builder',
    'Property Mogul',
    'Real Estate Tycoon',
    'Market Legend',
    'Property Oracle',
    'The Warren Buffett of Bricks',
  ];
  return titles[Math.min(level, titles.length - 1)];
}

export function getXpToNextLevel(xp: number): { current: number; next: number; needed: number } {
  const level = getLevelFromXp(xp);
  const current = LEVEL_THRESHOLDS[level];
  const next = LEVEL_THRESHOLDS[level + 1] ?? current + 1000;
  return { current, next, needed: next - xp };
}

// ─── XP Sources ──────────────────────────────────────────────────────

export const XP_SOURCES = {
  DAILY_CHALLENGE_PLAY: 10,
  DAILY_CHALLENGE_BULLSEYE: 50,
  DAILY_CHALLENGE_EXCELLENT: 30,
  DAILY_CHALLENGE_GOOD: 20,
  JOURNEY_SECTION_COMPLETE: 25,
  JOURNEY_STAGE_COMPLETE: 100,
  TOOL_FIRST_USE: 15,
  TOOL_REPEAT_USE: 5,
  CHECKLIST_COMPLETE: 40,
  PROPERTY_SAVED: 5,
  PROPERTY_COMPARED: 5,
  DOCUMENT_UPLOADED: 5,
  INSPECTION_CHECKED: 3,
  STREAK_3: 30,
  STREAK_7: 75,
  STREAK_14: 150,
  STREAK_30: 300,
  REFER_FRIEND: 50,
  REFERRED_FRIEND_JOINS: 100,
  PROFILE_COMPLETED: 25,
  DAILY_LOGIN: 5,
} as const;

// ─── Achievements ────────────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_guess',
    name: 'First Guess',
    description: 'Play your first Daily Property Challenge',
    icon: '🎯',
    xpReward: 25,
    condition: (s) => s.totalChallengesPlayed >= 1,
  },
  {
    id: 'bullseye',
    name: 'Bullseye',
    description: 'Guess a property price within 1%',
    icon: '🎯',
    xpReward: 50,
    condition: (s) => s.challengeHistory.some(h => h.score === 100),
  },
  {
    id: 'hot_streak_3',
    name: 'On Fire',
    description: 'Score 60+ on 3 challenges in a row',
    icon: '🔥',
    xpReward: 40,
    condition: (s) => {
      const recent = s.challengeHistory.slice(-3);
      return recent.length >= 3 && recent.every(h => h.score >= 60);
    },
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Play 7 days in a row',
    icon: '📅',
    xpReward: 75,
    condition: (s) => s.streak >= 7,
  },
  {
    id: 'month_master',
    name: 'Month Master',
    description: 'Play 30 days in a row',
    icon: '👑',
    xpReward: 200,
    condition: (s) => s.streak >= 30,
  },
  {
    id: 'journey_starter',
    name: 'Journey Starter',
    description: 'Complete your first journey stage',
    icon: '🚀',
    xpReward: 50,
    condition: (s) => s.xp >= 100,
  },
  {
    id: 'tool_collector',
    name: 'Tool Collector',
    description: 'Use 5 different tools',
    icon: '🧰',
    xpReward: 40,
    condition: (s) => s.xp >= 200,
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Refer your first friend',
    icon: '🦋',
    xpReward: 50,
    condition: (s) => s.achievements.includes('social_butterfly'),
  },
  {
    id: 'checklist_champion',
    name: 'Checklist Champion',
    description: 'Complete the inspection checklist',
    icon: '✅',
    xpReward: 50,
    condition: (s) => s.achievements.includes('checklist_champion'),
  },
  {
    id: 'level_5',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: '⭐',
    xpReward: 100,
    condition: (s) => s.level >= 5,
  },
  {
    id: 'level_10',
    name: 'Property Pro',
    description: 'Reach Level 10',
    icon: '🏆',
    xpReward: 200,
    condition: (s) => s.level >= 10,
  },
  {
    id: 'level_15',
    name: 'Expert Buyer',
    description: 'Reach Level 15',
    icon: '💎',
    xpReward: 500,
    condition: (s) => s.level >= 15,
  },
];

// ─── State Management ────────────────────────────────────────────────

const GAMIFICATION_KEY = 'pp_gamification';

export function getGamificationState(): GamificationState {
  const defaultState: GamificationState = {
    xp: 0,
    level: 0,
    streak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    achievements: [],
    challengeHistory: [],
    totalChallengesPlayed: 0,
    buddies: [],
  };
  return storage.get<GamificationState>(GAMIFICATION_KEY, defaultState);
}

export function saveGamificationState(state: GamificationState): void {
  storage.set(GAMIFICATION_KEY, state);
}

// ─── Core Actions ────────────────────────────────────────────────────

export function addXp(amount: number): GamificationState {
  const state = getGamificationState();
  state.xp += amount;
  const newLevel = getLevelFromXp(state.xp);
  if (newLevel > state.level) {
    state.level = newLevel;
  }
  saveGamificationState(state);
  return state;
}

export function recordDailyActivity(): GamificationState {
  const state = getGamificationState();
  const today = new Date().toISOString().split('T')[0];
  
  if (state.lastActiveDate === today) {
    return state; // Already counted today
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  if (state.lastActiveDate === yesterdayStr) {
    state.streak += 1;
  } else {
    state.streak = 1;
  }
  
  state.lastActiveDate = today;
  
  if (state.streak > state.longestStreak) {
    state.longestStreak = state.streak;
  }
  
  // Bonus XP for streak milestones
  let streakBonus = 0;
  if (state.streak === 3) streakBonus = XP_SOURCES.STREAK_3;
  else if (state.streak === 7) streakBonus = XP_SOURCES.STREAK_7;
  else if (state.streak === 14) streakBonus = XP_SOURCES.STREAK_14;
  else if (state.streak === 30) streakBonus = XP_SOURCES.STREAK_30;
  
  state.xp += XP_SOURCES.DAILY_LOGIN + streakBonus;
  state.level = getLevelFromXp(state.xp);
  
  saveGamificationState(state);
  return state;
}

export function recordChallengeResult(
  propertyId: string,
  guess: number,
  actual: number,
  score: number
): { state: GamificationState; newAchievements: Achievement[] } {
  const state = getGamificationState();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if already played today
  const alreadyPlayedToday = state.challengeHistory.some(h => h.date === today);
  if (alreadyPlayedToday) {
    // Just return current state, don't double-count
    const newAchievements = checkAchievements(state);
    return { state, newAchievements };
  }
  
  // Record activity for streak
  recordDailyActivity();
  
  // Add result
  state.challengeHistory.push({ date: today, propertyId, guess, actual, score });
  state.totalChallengesPlayed += 1;
  
  // Award XP
  let xpGain = XP_SOURCES.DAILY_CHALLENGE_PLAY;
  if (score === 100) xpGain += XP_SOURCES.DAILY_CHALLENGE_BULLSEYE;
  else if (score >= 80) xpGain += XP_SOURCES.DAILY_CHALLENGE_EXCELLENT;
  else if (score >= 60) xpGain += XP_SOURCES.DAILY_CHALLENGE_GOOD;
  
  state.xp += xpGain;
  state.level = getLevelFromXp(state.xp);
  
  saveGamificationState(state);
  
  const newAchievements = checkAchievements(state);
  return { state, newAchievements };
}

export function recordJourneySectionComplete(): GamificationState {
  return addXp(XP_SOURCES.JOURNEY_SECTION_COMPLETE);
}

export function recordJourneyStageComplete(): GamificationState {
  return addXp(XP_SOURCES.JOURNEY_STAGE_COMPLETE);
}

export function recordToolUse(toolId: string, isFirstUse: boolean): GamificationState {
  const xp = isFirstUse ? XP_SOURCES.TOOL_FIRST_USE : XP_SOURCES.TOOL_REPEAT_USE;
  return addXp(xp);
}

export function recordPropertySaved(): GamificationState {
  return addXp(XP_SOURCES.PROPERTY_SAVED);
}

export function recordReferral(): GamificationState {
  return addXp(XP_SOURCES.REFER_FRIEND);
}

// ─── Achievement Checking ────────────────────────────────────────────

export function checkAchievements(state: GamificationState): Achievement[] {
  const newAchievements: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!state.achievements.includes(achievement.id) && achievement.condition(state)) {
      newAchievements.push(achievement);
      state.achievements.push(achievement.id);
      state.xp += achievement.xpReward;
    }
  }
  
  if (newAchievements.length > 0) {
    state.level = getLevelFromXp(state.xp);
    saveGamificationState(state);
  }
  
  return newAchievements;
}

export function getUnlockedAchievements(): Achievement[] {
  const state = getGamificationState();
  return ACHIEVEMENTS.filter(a => state.achievements.includes(a.id));
}

export function getLockedAchievements(): Achievement[] {
  const state = getGamificationState();
  return ACHIEVEMENTS.filter(a => !state.achievements.includes(a.id));
}

export function getProgressPercent(): number {
  const state = getGamificationState();
  const { current, next } = getXpToNextLevel(state.xp);
  if (next === current) return 100;
  return Math.min(100, Math.round(((state.xp - current) / (next - current)) * 100));
}

// ─── Leaderboard (local) ─────────────────────────────────────────────

export interface LeaderboardEntry {
  name: string;
  level: number;
  xp: number;
  streak: number;
  isYou?: boolean;
}

const DEMO_LEADERBOARD: LeaderboardEntry[] = [
  { name: 'Sarah M.', level: 12, xp: 5800, streak: 23 },
  { name: 'James K.', level: 10, xp: 4200, streak: 15 },
  { name: 'Priya R.', level: 9, xp: 3800, streak: 12 },
  { name: 'Tom W.', level: 8, xp: 3100, streak: 9 },
  { name: 'Emma L.', level: 7, xp: 2600, streak: 7 },
  { name: 'David C.', level: 6, xp: 2100, streak: 5 },
  { name: 'Lisa T.', level: 5, xp: 1800, streak: 4 },
  { name: 'Mike B.', level: 4, xp: 1400, streak: 3 },
  { name: 'Anna S.', level: 3, xp: 900, streak: 2 },
  { name: 'Chris P.', level: 2, xp: 500, streak: 1 },
];

export function getLeaderboard(): LeaderboardEntry[] {
  const state = getGamificationState();
  const you: LeaderboardEntry = {
    name: 'You',
    level: state.level,
    xp: state.xp,
    streak: state.streak,
    isYou: true,
  };
  
  const all = [...DEMO_LEADERBOARD, you];
  all.sort((a, b) => b.xp - a.xp);
  
  // Return top 10, making sure "You" is included
  const yourIndex = all.findIndex(e => e.isYou);
  if (yourIndex < 10) {
    return all.slice(0, 10);
  }
  
  // If you're outside top 10, show top 9 + you
  return [...all.slice(0, 9), you];
}

// ─── Buddy System ────────────────────────────────────────────────────

export function addBuddy(name: string): GamificationState {
  const state = getGamificationState();
  if (!state.buddies.includes(name)) {
    state.buddies.push(name);
    saveGamificationState(state);
  }
  return state;
}

export function removeBuddy(name: string): GamificationState {
  const state = getGamificationState();
  state.buddies = state.buddies.filter(b => b !== name);
  saveGamificationState(state);
  return state;
}

export function getBuddies(): string[] {
  return getGamificationState().buddies;
}

// ─── Share Text Generator ────────────────────────────────────────────

export function generateChallengeShareText(score: number, streak: number): string {
  const emoji = score >= 80 ? '🔥' : score >= 60 ? '👍' : score >= 40 ? '🤔' : '😬';
  const today = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  
  let text = `PropertyPath Daily Challenge ${today}\n`;
  text += `${emoji} Score: ${score}/100\n`;
  if (streak > 1) {
    text += `🔥 Streak: ${streak} days\n`;
  }
  text += `\nCan you guess the sale price?\n`;
  text += `${window.location.origin}/#/challenge`;
  
  return text;
}

// ─── Hook helper for React ───────────────────────────────────────────

import { useState, useCallback } from 'react';

export function useGamification() {
  const [state, setState] = useState(getGamificationState());
  
  const refresh = useCallback(() => {
    setState(getGamificationState());
  }, []);
  
  const addXpAndRefresh = useCallback((amount: number) => {
    const newState = addXp(amount);
    setState(newState);
    return newState;
  }, []);
  
  const recordChallenge = useCallback((propertyId: string, guess: number, actual: number, score: number) => {
    const result = recordChallengeResult(propertyId, guess, actual, score);
    setState(result.state);
    return result;
  }, []);
  
  return {
    state,
    refresh,
    addXp: addXpAndRefresh,
    recordChallenge,
    levelTitle: getLevelTitle(state.level),
    progress: getXpToNextLevel(state.xp),
    progressPercent: getProgressPercent(),
    unlockedAchievements: getUnlockedAchievements(),
    lockedAchievements: getLockedAchievements(),
    leaderboard: getLeaderboard(),
  };
}
