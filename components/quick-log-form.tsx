'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/lib/categories';
import { Transaction } from '@/lib/storage';

export function QuickLogForm({
  onSubmit,
}: {
  onSubmit: (transaction: Omit<Transaction, 'id'>) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory || !amount) {
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return;
    }

    onSubmit({
      category: selectedCategory,
      amount: numAmount,
      date: new Date().toISOString().split('T')[0],
      note,
    });

    setSelectedCategory('');
    setAmount('');
    setNote('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6">Quick Log</h3>

      {/* Category buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all ${
              selectedCategory === category.id
                ? 'ring-2 ring-offset-1 ring-offset-background ring-primary scale-105'
                : 'bg-muted hover:bg-muted/80'
            }`}
            style={{
              backgroundColor:
                selectedCategory === category.id ? category.color : undefined,
              opacity: selectedCategory === category.id ? 1 : 0.6,
            }}
          >
            <div className="text-3xl mb-1">{category.emoji}</div>
            <div className="text-xs font-medium text-white text-center leading-tight">
              {category.name}
            </div>
          </button>
        ))}
      </div>

      {/* Amount input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Amount (₦)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-foreground font-semibold">₦</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-muted border border-border rounded-lg pl-8 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Note input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Note (optional)
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g., Lunch with friends"
          className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!selectedCategory || !amount}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Log Expense
      </button>
    </form>
  );
}
