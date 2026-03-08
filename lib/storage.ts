export interface Transaction {
  id: string;
  category: string;
  amount: number;
  date: string;
  note: string;
}

export interface BudgetSettings {
  monthlyBudget: number;
  currencySymbol: string;
}

const TRANSACTIONS_KEY = 'nairatrack_transactions';
const BUDGET_KEY = 'nairatrack_budget';

export const DEFAULT_BUDGET: BudgetSettings = {
  monthlyBudget: 50000,
  currencySymbol: '₦',
};

export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTransaction(transaction: Transaction): void {
  if (typeof window === 'undefined') return;
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

export function deleteTransaction(id: string): void {
  if (typeof window === 'undefined') return;
  const transactions = getTransactions();
  const filtered = transactions.filter(t => t.id !== id);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered));
}

export function getBudgetSettings(): BudgetSettings {
  if (typeof window === 'undefined') return DEFAULT_BUDGET;
  try {
    const data = localStorage.getItem(BUDGET_KEY);
    return data ? JSON.parse(data) : DEFAULT_BUDGET;
  } catch {
    return DEFAULT_BUDGET;
  }
}

export function saveBudgetSettings(settings: BudgetSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BUDGET_KEY, JSON.stringify(settings));
}

export function getCurrentMonthTransactions(): Transaction[] {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return getTransactions().filter(t => t.date.startsWith(currentMonth));
}

export function getLast7DaysTransactions(): Transaction[] {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return getTransactions().filter(t => new Date(t.date) >= sevenDaysAgo);
}

export function getTotalSpent(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

export function getSpentByCategory(transactions: Transaction[]): Record<string, number> {
  return transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);
}
