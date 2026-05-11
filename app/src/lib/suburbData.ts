export interface SuburbData {
  id: string;
  name: string;
  region: string;
  medianHouse: number;
  medianUnit: number;
  annualGrowth: number;
  rentalYield: number;
  vacancyRate: number;
  daysOnMarket: number;
  clearanceRate: number;
  population: number;
  distanceToCBD: number;
  trainLine: boolean;
  schoolRating: 'high' | 'medium' | 'low';
  lifestyle: string[];
}

export const suburbDatabase: SuburbData[] = [
  { id: 'parramatta', name: 'Parramatta', region: 'Western Sydney', medianHouse: 1250000, medianUnit: 680000, annualGrowth: 4.2, rentalYield: 3.1, vacancyRate: 1.8, daysOnMarket: 32, clearanceRate: 68, population: 257000, distanceToCBD: 23, trainLine: true, schoolRating: 'high', lifestyle: ['Urban', 'Dining', 'Shopping'] },
  { id: 'castle-hill', name: 'Castle Hill', region: 'Hills District', medianHouse: 1850000, medianUnit: 820000, annualGrowth: 5.1, rentalYield: 2.6, vacancyRate: 1.2, daysOnMarket: 28, clearanceRate: 74, population: 40000, distanceToCBD: 30, trainLine: true, schoolRating: 'high', lifestyle: ['Family', 'Parks', 'Schools'] },
  { id: 'newcastle', name: 'Newcastle', region: 'Hunter', medianHouse: 920000, medianUnit: 650000, annualGrowth: 6.8, rentalYield: 4.2, vacancyRate: 1.0, daysOnMarket: 35, clearanceRate: 72, population: 322000, distanceToCBD: 160, trainLine: true, schoolRating: 'medium', lifestyle: ['Beach', 'Surf', 'Lifestyle'] },
  { id: 'wollongong', name: 'Wollongong', region: 'Illawarra', medianHouse: 1050000, medianUnit: 620000, annualGrowth: 7.2, rentalYield: 3.8, vacancyRate: 1.1, daysOnMarket: 30, clearanceRate: 70, population: 302000, distanceToCBD: 85, trainLine: true, schoolRating: 'medium', lifestyle: ['Beach', 'University', 'Industry'] },
  { id: 'penrith', name: 'Penrith', region: 'Western Sydney', medianHouse: 850000, medianUnit: 520000, annualGrowth: 5.5, rentalYield: 3.9, vacancyRate: 1.5, daysOnMarket: 28, clearanceRate: 65, population: 200000, distanceToCBD: 55, trainLine: true, schoolRating: 'medium', lifestyle: ['Family', 'Parks', 'Affordable'] },
  { id: 'hornsby', name: 'Hornsby', region: 'Upper North Shore', medianHouse: 1650000, medianUnit: 780000, annualGrowth: 3.8, rentalYield: 2.4, vacancyRate: 1.3, daysOnMarket: 26, clearanceRate: 76, population: 22000, distanceToCBD: 25, trainLine: true, schoolRating: 'high', lifestyle: ['Bushland', 'Family', 'Schools'] },
  { id: 'manly', name: 'Manly', region: 'Northern Beaches', medianHouse: 3200000, medianUnit: 1200000, annualGrowth: 2.5, rentalYield: 2.1, vacancyRate: 2.1, daysOnMarket: 38, clearanceRate: 62, population: 16000, distanceToCBD: 17, trainLine: false, schoolRating: 'high', lifestyle: ['Beach', 'Surf', 'Premium'] },
  { id: 'blacktown', name: 'Blacktown', region: 'Western Sydney', medianHouse: 780000, medianUnit: 480000, annualGrowth: 6.5, rentalYield: 4.1, vacancyRate: 1.4, daysOnMarket: 24, clearanceRate: 69, population: 47000, distanceToCBD: 38, trainLine: true, schoolRating: 'medium', lifestyle: ['Affordable', 'Diverse', 'Family'] },
  { id: 'gosford', name: 'Gosford', region: 'Central Coast', medianHouse: 820000, medianUnit: 580000, annualGrowth: 6.0, rentalYield: 4.0, vacancyRate: 1.2, daysOnMarket: 31, clearanceRate: 66, population: 18000, distanceToCBD: 80, trainLine: true, schoolRating: 'medium', lifestyle: ['Waterfront', 'Commuter', 'Affordable'] },
  { id: 'liverpool', name: 'Liverpool', region: 'South Western Sydney', medianHouse: 850000, medianUnit: 500000, annualGrowth: 5.8, rentalYield: 3.7, vacancyRate: 1.6, daysOnMarket: 27, clearanceRate: 64, population: 31000, distanceToCBD: 42, trainLine: true, schoolRating: 'medium', lifestyle: ['Diverse', 'Growth', 'Transport'] },
  { id: 'chatswood', name: 'Chatswood', region: 'Lower North Shore', medianHouse: 2800000, medianUnit: 1100000, annualGrowth: 3.2, rentalYield: 2.2, vacancyRate: 2.3, daysOnMarket: 34, clearanceRate: 71, population: 25000, distanceToCBD: 10, trainLine: true, schoolRating: 'high', lifestyle: ['Urban', 'Asian dining', 'Shopping'] },
  { id: 'bondi', name: 'Bondi', region: 'Eastern Suburbs', medianHouse: 3500000, medianUnit: 1400000, annualGrowth: 2.8, rentalYield: 1.9, vacancyRate: 2.5, daysOnMarket: 42, clearanceRate: 58, population: 11000, distanceToCBD: 7, trainLine: false, schoolRating: 'high', lifestyle: ['Beach', 'Cafe', 'Premium'] },
];

export function getSuburbById(id: string): SuburbData | undefined {
  return suburbDatabase.find(s => s.id === id);
}

export function searchSuburbs(query: string): SuburbData[] {
  const q = query.toLowerCase();
  return suburbDatabase.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.region.toLowerCase().includes(q) ||
    s.lifestyle.some(l => l.toLowerCase().includes(q))
  );
}

export function compareSuburbs(ids: string[]): SuburbData[] {
  return ids.map(id => getSuburbById(id)).filter(Boolean) as SuburbData[];
}

export const regionFilters = Array.from(new Set(suburbDatabase.map(s => s.region)));

export function formatPrice(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}m`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
}
