import { useEffect, useState, useCallback } from 'react';
import { Transaction, getTransactions, saveTransaction as persistTransaction, deleteTransaction as removeTransaction, getCurrentMonthTransactions, getLast7DaysTransactions, getSpentByCategory, getTotalSpent } from '@/lib/storage';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<Transaction[]>([]);
  const [last7DaysTransactions, setLast7DaysTransactions] = useState<Transaction[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadTransactions = useCallback(() => {
    const all = getTransactions();
    setTransactions(all);
    setCurrentMonthTransactions(getCurrentMonthTransactions());
    setLast7DaysTransactions(getLast7DaysTransactions());
  }, []);

  useEffect(() => {
    setMounted(true);
    loadTransactions();
  }, [loadTransactions]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...transaction,
    };
    persistTransaction(newTransaction);
    loadTransactions();
    return newTransaction;
  }, [loadTransactions]);

  const deleteTransaction = useCallback((id: string) => {
    removeTransaction(id);
    loadTransactions();
  }, [loadTransactions]);

  const getSpentByCurrentCategory = useCallback(() => {
    return getSpentByCategory(currentMonthTransactions);
  }, [currentMonthTransactions]);

  const getTotalSpentCurrentMonth = useCallback(() => {
    return getTotalSpent(currentMonthTransactions);
  }, [currentMonthTransactions]);

  return {
    transactions,
    currentMonthTransactions,
    last7DaysTransactions,
    mounted,
    addTransaction,
    deleteTransaction,
    getSpentByCurrentCategory,
    getTotalSpentCurrentMonth,
  };
}
