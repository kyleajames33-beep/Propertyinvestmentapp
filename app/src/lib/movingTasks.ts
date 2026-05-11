import { storage } from './storage';

export interface MovingTask {
  id: string;
  category: 'utilities' | 'address' | 'home' | 'finance' | 'family';
  task: string;
  description: string;
  completed: boolean;
  dueDays?: number; // days before/after settlement
}

const STORAGE_KEY = 'moving_tasks';

export const defaultMovingTasks: Omit<MovingTask, 'id'>[] = [
  { category: 'utilities', task: 'Connect electricity', description: 'Contact your chosen provider to connect power before settlement', completed: false, dueDays: -3 },
  { category: 'utilities', task: 'Connect gas', description: 'If applicable, arrange gas connection', completed: false, dueDays: -3 },
  { category: 'utilities', task: 'Connect water', description: 'Water is usually automatic but notify the council', completed: false, dueDays: 0 },
  { category: 'utilities', task: 'Arrange internet', description: 'Book NBN or broadband connection — can take 2-4 weeks', completed: false, dueDays: -7 },
  { category: 'utilities', task: 'Connect home insurance', description: 'Building insurance must start from settlement date', completed: false, dueDays: 0 },
  { category: 'address', task: 'Update driver\'s licence address', description: 'NSW Service Centre within 14 days', completed: false, dueDays: 7 },
  { category: 'address', task: 'Update electoral roll', description: 'Australian Electoral Commission online', completed: false, dueDays: 7 },
  { category: 'address', task: 'Redirect mail', description: 'Australia Post mail redirection service', completed: false, dueDays: 0 },
  { category: 'address', task: 'Notify bank of new address', description: 'All banks and credit card providers', completed: false, dueDays: 7 },
  { category: 'address', task: 'Update employer', description: 'Payroll and superannuation address', completed: false, dueDays: 7 },
  { category: 'address', task: 'Notify insurance providers', description: 'Car, health, life insurance', completed: false, dueDays: 7 },
  { category: 'home', task: 'Book locksmith', description: 'Change locks on settlement day', completed: false, dueDays: 0 },
  { category: 'home', task: 'Book cleaner', description: 'Pre-move clean or carpet steam clean', completed: false, dueDays: -2 },
  { category: 'home', task: 'Measure for furniture', description: 'Check sofa, bed, and large items fit through doors', completed: false, dueDays: -7 },
  { category: 'home', task: 'Arrange removals', description: 'Book removalist or hire truck', completed: false, dueDays: -14 },
  { category: 'home', task: 'Pack essentials box', description: 'Toiletries, chargers, kettle, snacks for first night', completed: false, dueDays: -1 },
  { category: 'finance', task: 'Set up council rates payments', description: 'Direct debit or quarterly payments', completed: false, dueDays: 14 },
  { category: 'finance', task: 'Set up strata levies', description: 'If applicable, arrange payment method', completed: false, dueDays: 14 },
  { category: 'finance', task: 'Update budget', description: 'Account for new mortgage, rates, and insurance', completed: false, dueDays: 7 },
  { category: 'family', task: 'Register with new GP', description: 'Find a local doctor and transfer records', completed: false, dueDays: 14 },
  { category: 'family', task: 'Enrol kids in local school', description: 'If applicable, arrange enrolment', completed: false, dueDays: 14 },
  { category: 'family', task: 'Find local vet', description: 'If you have pets, register with a local vet', completed: false, dueDays: 14 },
  { category: 'family', task: 'Update pet microchip', description: 'Change address on microchip registry', completed: false, dueDays: 7 },
];

export function getMovingTasks(): MovingTask[] {
  const saved = storage.get<MovingTask[]>(STORAGE_KEY);
  if (saved && saved.length > 0) return saved;
  const initial = defaultMovingTasks.map(t => ({
    ...t,
    id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
  }));
  storage.set(STORAGE_KEY, initial);
  return initial;
}

export function toggleMovingTask(id: string): void {
  const tasks = getMovingTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx !== -1) {
    tasks[idx].completed = !tasks[idx].completed;
    storage.set(STORAGE_KEY, tasks);
  }
}

export function resetMovingTasks(): void {
  storage.remove(STORAGE_KEY);
}

export function getMovingTaskStats(tasks: MovingTask[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  return {
    total,
    completed,
    pct: total ? Math.round((completed / total) * 100) : 0,
  };
}

export const movingCategoryLabels: Record<string, string> = {
  utilities: 'Utilities',
  address: 'Change of Address',
  home: 'Home Setup',
  finance: 'Finance',
  family: 'Family',
};

export const movingCategoryColours: Record<string, string> = {
  utilities: 'bg-blue-50 text-blue-700 border-blue-200',
  address: 'bg-violet-50 text-violet-700 border-violet-200',
  home: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  finance: 'bg-amber-50 text-amber-700 border-amber-200',
  family: 'bg-rose-50 text-rose-700 border-rose-200',
};
