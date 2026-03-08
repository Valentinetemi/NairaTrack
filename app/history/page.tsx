'use client';

import { useEffect, useState } from 'react';
import { RecentTransactions } from '@/components/recent-transactions';
import {
  getTransactions,
  deleteTransaction,
} from '@/lib/storage';

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadData();
  }, []);

  const loadData = () => {
    const allTxs = getTransactions();
    setTransactions(allTxs);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    loadData();
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
    <div className="px-4 py-6">
      <div className="mb-8 pt-2">
        <h1 className="text-3xl font-bold">Transaction History</h1>
        <p className="text-muted-foreground text-sm mt-1">All your expenses at a glance</p>
      </div>

      <RecentTransactions
        transactions={transactions}
        onDelete={handleDelete}
      />

      {transactions.length > 0 && (
        <div className="mt-8 p-6 bg-card rounded-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Spent</div>
              <div className="text-2xl font-bold">
                ₦{transactions.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Transactions</div>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
