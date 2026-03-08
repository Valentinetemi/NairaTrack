'use client';

import { useRouter } from 'next/navigation';
import { QuickLogForm } from '@/components/quick-log-form';
import { saveTransaction } from '@/lib/storage';
import { Transaction } from '@/lib/storage';

export default function LogPage() {
  const router = useRouter();

  const handleSubmit = (transactionData: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      ...transactionData,
    };

    saveTransaction(transaction);

    // Show success feedback
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-8 pt-2">
        <h1 className="text-3xl font-bold">Log Expense</h1>
        <p className="text-muted-foreground text-sm mt-1">Track where your money is going</p>
      </div>

      <QuickLogForm onSubmit={handleSubmit} />

      <div className="mt-8 p-6 bg-card rounded-xl text-center">
        <div className="text-4xl mb-4">💡</div>
        <h3 className="font-semibold mb-2">Pro Tip</h3>
        <p className="text-muted-foreground text-sm">
          Add notes to your expenses to remember what you spent on. This helps track patterns!
        </p>
      </div>
    </div>
  );
}
