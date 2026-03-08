'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/lib/storage';

export function DailyChart({ transactions }: { transactions: Transaction[] }) {
  // Group transactions by date for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailySpending = last7Days.map(date => {
    const dayTotal = transactions
      .filter(t => t.date === date)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      date,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      amount: dayTotal,
    };
  });

  const hasData = dailySpending.some(d => d.amount > 0);

  if (!hasData) {
    return (
      <div className="bg-card rounded-xl p-6 flex items-center justify-center h-80">
        <div className="text-center">
          <div className="text-4xl mb-2">📈</div>
          <p className="text-muted-foreground">No spending data for the past 7 days</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6">Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={dailySpending}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="day"
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value: any) => `₦${value.toLocaleString()}`}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
