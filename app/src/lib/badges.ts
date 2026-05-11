import { storage } from './storage';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: string;
}

export const BADGES: Badge[] = [
  { id: 'first_step', name: 'First Step', description: 'Visited your first journey stage', icon: 'Footprints', color: 'bg-blue-500' },
  { id: 'explorer', name: 'Explorer', description: 'Visited 4 different journey stages', icon: 'Map', color: 'bg-indigo-500' },
  { id: 'journey_master', name: 'Journey Master', description: 'Visited all 8 journey stages', icon: 'Trophy', color: 'bg-amber-500' },
  { id: 'calculator_pro', name: 'Calculator Pro', description: 'Used 3 different calculators', icon: 'Calculator', color: 'bg-teal-500' },
  { id: 'number_cruncher', name: 'Number Cruncher', description: 'Used 8 different calculators', icon: 'BarChart3', color: 'bg-emerald-500' },
  { id: 'checklist_starter', name: 'Checklist Starter', description: 'Checked off your first checklist item', icon: 'CheckSquare', color: 'bg-violet-500' },
  { id: 'organised', name: 'Organised', description: 'Completed an entire checklist', icon: 'ClipboardCheck', color: 'bg-pink-500' },
  { id: 'profile_set', name: 'Profile Set', description: 'Set up your property profile', icon: 'User', color: 'bg-slate-500' },
  { id: 'sharer', name: 'Sharer', description: 'Shared a calculator result', icon: 'Share2', color: 'bg-cyan-500' },
  { id: 'connector', name: 'Connector', description: 'Requested an introduction to a professional', icon: 'Handshake', color: 'bg-rose-500' },
  { id: 'researcher', name: 'Researcher', description: 'Read 3 reference articles', icon: 'BookOpen', color: 'bg-orange-500' },
  { id: 'property_ready', name: 'Property Ready', description: 'Earned 5 badges', icon: 'Home', color: 'bg-green-600' },
];

export type BadgeId = typeof BADGES[number]['id'];

export function getEarnedBadges(): string[] {
  return storage.get<string[]>('earned_badges', []);
}

export function awardBadge(badgeId: BadgeId): boolean {
  const earned = new Set(getEarnedBadges());
  if (earned.has(badgeId)) return false;
  earned.add(badgeId);
  storage.set('earned_badges', Array.from(earned));

  // Check for meta-badge
  if (earned.size >= 5 && !earned.has('property_ready')) {
    earned.add('property_ready');
    storage.set('earned_badges', Array.from(earned));
  }
  return true;
}

export function trackActivity(type: 'stage_visit' | 'calculator_use' | 'checklist_check' | 'profile_setup' | 'share' | 'referral_request' | 'reference_read') {
  const counts = storage.get<Record<string, number>>('activity_counts', {});
  counts[type] = (counts[type] || 0) + 1;
  storage.set('activity_counts', counts);

  const newBadges: string[] = [];

  if (type === 'stage_visit') {
    // Track stage visit count for badge eligibility
    if (counts.stage_visit >= 1 && awardBadge('first_step')) newBadges.push('first_step');
    if (counts.stage_visit >= 4 && awardBadge('explorer')) newBadges.push('explorer');
    if (counts.stage_visit >= 8 && awardBadge('journey_master')) newBadges.push('journey_master');
  }

  if (type === 'calculator_use') {
    if (counts.calculator_use >= 3 && awardBadge('calculator_pro')) newBadges.push('calculator_pro');
    if (counts.calculator_use >= 8 && awardBadge('number_cruncher')) newBadges.push('number_cruncher');
  }

  if (type === 'checklist_check') {
    if (counts.checklist_check >= 1 && awardBadge('checklist_starter')) newBadges.push('checklist_starter');
  }

  if (type === 'profile_setup' && awardBadge('profile_set')) {
    newBadges.push('profile_set');
  }

  if (type === 'share' && awardBadge('sharer')) {
    newBadges.push('sharer');
  }

  if (type === 'referral_request' && awardBadge('connector')) {
    newBadges.push('connector');
  }

  if (type === 'reference_read') {
    if (counts.reference_read >= 3 && awardBadge('researcher')) newBadges.push('researcher');
  }

  return newBadges;
}

export function trackStageVisit(stageId: string) {
  const stages = new Set(storage.get<string[]>('visited_stages_for_badges', []));
  const wasNew = !stages.has(stageId);
  stages.add(stageId);
  storage.set('visited_stages_for_badges', Array.from(stages));

  const newBadges: string[] = [];
  if (stages.size >= 1 && awardBadge('first_step')) newBadges.push('first_step');
  if (stages.size >= 4 && awardBadge('explorer')) newBadges.push('explorer');
  if (stages.size >= 8 && awardBadge('journey_master')) newBadges.push('journey_master');
  return { wasNew, newBadges, totalStages: stages.size };
}

export function trackCalculatorUse(calculatorName: string) {
  const calcSet = new Set(storage.get<string[]>('used_calculators', []));
  calcSet.add(calculatorName);
  storage.set('used_calculators', Array.from(calcSet));

  const newBadges: string[] = [];
  if (calcSet.size >= 3 && awardBadge('calculator_pro')) newBadges.push('calculator_pro');
  if (calcSet.size >= 8 && awardBadge('number_cruncher')) newBadges.push('number_cruncher');
  return { newBadges, totalCalculators: calcSet.size };
}

export function trackChecklistCompletion(totalItems: number, checkedCount: number) {
  if (checkedCount >= totalItems && totalItems > 0) {
    const completed = new Set(storage.get<string[]>('completed_checklists', []));
    // We don't track which checklist, just that one was completed
    const wasNew = completed.size === 0;
    completed.add('any');
    storage.set('completed_checklists', Array.from(completed));

    const newBadges: string[] = [];
    if (awardBadge('organised')) newBadges.push('organised');
    return { wasNew, newBadges };
  }
  return { wasNew: false, newBadges: [] };
}
