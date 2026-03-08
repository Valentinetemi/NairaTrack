'use client';

import { useEffect, useState } from 'react';
import { AIInsightCard } from '@/components/ai-insight-card';
import { BudgetProgress } from '@/components/budget-progress';
import { SpendingChart } from '@/components/spending-chart';
import { DailyChart } from '@/components/daily-chart';
import { RecentTransactions } from '@/components/recent-transactions';
import {
  getTransactions,
  getCurrentMonthTransactions,
  getLast7DaysTransactions,
  getSpentByCategory,
  getTotalSpent,
  deleteTransaction,
  getBudgetSettings,
} from '@/lib/storage';

export default function Home() {
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [spentByCategory, setSpentByCategory] = useState<Record<string, number>>({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [insight, setInsight] = useState<any>(null);
  const [budgetSettings, setBudgetSettings] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = async () => {
    const allTxs = getTransactions();
    const currentMonth = getCurrentMonthTransactions();
    const budget = getBudgetSettings();

    setAllTransactions(allTxs);
    setCurrentMonthTransactions(currentMonth);
    setBudgetSettings(budget);

    const spent = getTotalSpent(currentMonth);
    setTotalSpent(spent);

    const byCategory = getSpentByCategory(currentMonth);
    setSpentByCategory(byCategory);

    if (budget) {
      const percentUsed = budget.monthlyBudget
        ? (spent / budget.monthlyBudget) * 100
        : 0;
      const remaining = budget.monthlyBudget - spent;
      const topCategoryEntry = Object.entries(byCategory).sort(
        (a, b) => b[1] - a[1]
      )[0];
      const topCategory = topCategoryEntry ? topCategoryEntry[0] : null;

      try {
        const res = await fetch('/api/insight', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalSpent: spent,
            monthlyBudget: budget.monthlyBudget,
            percentUsed: Math.round(percentUsed),
            topCategory,
            remaining,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setInsight({
            title: '✨ AI Insight',
            message: data.message,
            type:
              percentUsed > 80 ? 'warning' : percentUsed > 60 ? 'neutral' : 'positive',
          });
        } else {
          setInsight({
            title: '✨ You\'re Doing Great',
            message: `You've spent ₦${spent.toLocaleString()} (${((spent / budget.monthlyBudget) * 100).toFixed(
              0
            )}% of budget).`,
            type: 'positive',
          });
        }
      } catch {
        setInsight({
          title: '✨ You\'re Doing Great',
          message: `You've spent ₦${spent.toLocaleString()} (${((spent / budget.monthlyBudget) * 100).toFixed(
            0
          )}% of budget).`,
          type: 'positive',
        });
      }
    }
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
    loadData();
  };

  if (!mounted || !budgetSettings || !insight) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">💰</div>
          <p className="text-muted-foreground">Loading NairaTrack...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="pt-2">
        <h1 className="text-3xl font-bold">NairaTrack</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your ₦ spending with intelligence</p>
      </div>

      {/* AI Insight Card */}
      <AIInsightCard insight={insight} />

      {/* Budget Progress */}
      <BudgetProgress
        spent={totalSpent}
        budget={budgetSettings.monthlyBudget}
        currencySymbol={budgetSettings.currencySymbol}
      />

      {/* Charts */}
      <SpendingChart spentByCategory={spentByCategory} />
      <DailyChart transactions={getLast7DaysTransactions()} />

      {/* Recent Transactions */}
      <RecentTransactions
        transactions={currentMonthTransactions}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}
