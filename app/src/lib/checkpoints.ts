import { storage } from './storage';

const KEY = 'checkpoint_progress';

export function getCheckpointProgress(stageId: string): string[] {
  const all = storage.get<Record<string, string[]>>(KEY, {});
  return all[stageId] || [];
}

export function completeCheckpoint(stageId: string, sectionTitle: string): void {
  const all = storage.get<Record<string, string[]>>(KEY, {});
  const completed = new Set(all[stageId] || []);
  completed.add(sectionTitle);
  all[stageId] = Array.from(completed);
  storage.set(KEY, all);
}

export function isCheckpointComplete(stageId: string, sectionTitle: string): boolean {
  return getCheckpointProgress(stageId).includes(sectionTitle);
}

export function getCheckpointPct(stageId: string, totalSections: number): number {
  if (totalSections === 0) return 0;
  return Math.round((getCheckpointProgress(stageId).length / totalSections) * 100);
}

export function resetCheckpointProgress(stageId: string): void {
  const all = storage.get<Record<string, string[]>>(KEY, {});
  delete all[stageId];
  storage.set(KEY, all);
}
