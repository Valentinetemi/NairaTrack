'use client';

import { useEffect, useState } from 'react';
import { getBudgetSettings, saveBudgetSettings, getTransactions } from '@/lib/storage';
import { CATEGORIES } from '@/lib/categories';

export default function ProfilePage() {
  const [monthlyBudget, setMonthlyBudget] = useState('50000');
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const settings = getBudgetSettings();
    setMonthlyBudget(settings.monthlyBudget.toString());
    setTransactions(getTransactions());
  }, []);

  const handleSaveBudget = () => {
    const budget = parseFloat(monthlyBudget);
    if (budget > 0) {
      saveBudgetSettings({
        monthlyBudget: budget,
        currencySymbol: '₦',
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure? This will delete all transactions and cannot be undone.')) {
      localStorage.removeItem('nairatrack_transactions');
      setTransactions([]);
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="pt-2">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your preferences</p>
      </div>

      {/* Budget Settings */}
      <div className="bg-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Budget</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Budget Amount (₦)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-foreground font-semibold">₦</span>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full bg-muted border border-border rounded-lg pl-8 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button
            onClick={handleSaveBudget}
            className="w-full bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-purple-600/30 transition-all"
          >
            {saved ? '✓ Saved' : 'Save Budget'}
          </button>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="bg-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Spending Categories</h3>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              style={{ borderColor: category.color + '40' }}
            >
              <div className="text-2xl mb-2">{category.emoji}</div>
              <div className="font-medium text-sm">{category.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Statistics</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Total Transactions</span>
            <span className="font-semibold">{transactions.length}</span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b border-border">
            <span className="text-muted-foreground">Total Spent (All Time)</span>
            <span className="font-semibold">
              ₦{transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Average Per Transaction</span>
            <span className="font-semibold">
              ₦
              {transactions.length > 0
                ? Math.round(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length).toLocaleString()
                : '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-xl p-6 border border-red-500/20">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h3>
        <button
          onClick={handleClearAll}
          className="w-full bg-red-500/20 text-red-400 border border-red-500/30 font-semibold py-2 rounded-lg hover:bg-red-500/30 transition-all"
        >
          Clear All Data
        </button>
      </div>

      {/* About */}
      <div className="bg-card rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">💜</div>
        <h3 className="font-semibold mb-2">NairaTrack</h3>
        <p className="text-sm text-muted-foreground mb-4">
          A personal finance tracker built for Nigerian students
        </p>
        <p className="text-xs text-muted-foreground">
          Version 1.0 • Made with ❤️ for smart spending
        </p>
      </div>
    </div>
  );
}
