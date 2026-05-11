const PREFIX = 'pp_';

function key(k: string) {
  return `${PREFIX}${k}`;
}

export const storage = {
  get<T>(k: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key(k));
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },
  set<T>(k: string, value: T) {
    try {
      localStorage.setItem(key(k), JSON.stringify(value));
    } catch {
      // storage full or private mode
    }
  },
  remove(k: string) {
    localStorage.removeItem(key(k));
  },
};

export type PropertyProfile = {
  budgetMin?: number;
  budgetMax?: number;
  targetSuburb?: string;
  buyerType?: string;
  timeline?: string;
  depositSaved?: number;
};

export type JourneyProgress = {
  lastStageSlug?: string;
  lastStageTitle?: string;
  completedStages?: string[];
  stageProgress?: Record<string, number>; // 0-100
};
