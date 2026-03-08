export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food',
    emoji: '🍔',
    color: '#f59e0b',
  },
  {
    id: 'data',
    name: 'Data',
    emoji: '📱',
    color: '#06b6d4',
  },
  {
    id: 'transport',
    name: 'Transport',
    emoji: '🚌',
    color: '#ec4899',
  },
  {
    id: 'school',
    name: 'School',
    emoji: '📚',
    color: '#8b5cf6',
  },
  {
    id: 'personal',
    name: 'Personal',
    emoji: '💄',
    color: '#f472b6',
  },
  {
    id: 'fun',
    name: 'Fun',
    emoji: '🎉',
    color: '#fbbf24',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}

export function getCategoryColor(id: string): string {
  return getCategoryById(id)?.color || '#9ca3af';
}

export function getCategoryEmoji(id: string): string {
  return getCategoryById(id)?.emoji || '📦';
}

export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name || 'Other';
}
