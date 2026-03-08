'use client';

import { Transaction } from '@/lib/storage';
import { getCategoryById } from '@/lib/categories';
import { X } from 'lucide-react';

export function RecentTransactions({
  transactions,
  onDelete,
}: {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}) {
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recent = sorted.slice(0, 10);

  if (recent.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 text-center">
        <div className="text-4xl mb-2">📝</div>
        <p className="text-muted-foreground">No transactions yet. Log your first expense!</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-border">
        {recent.map((transaction) => {
          const category = getCategoryById(transaction.category);
          const date = new Date(transaction.date);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={transaction.id}
              className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="text-2xl">{category?.emoji}</div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{category?.name}</div>
                  {transaction.note && (
                    <div className="text-xs text-muted-foreground truncate">{transaction.note}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-semibold text-sm">₦{transaction.amount.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{formattedDate}</div>
                </div>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded-lg text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
