'use client';

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { getCategoryById, CATEGORIES } from '@/lib/categories';

export function SpendingChart({
  spentByCategory,
}: {
  spentByCategory: Record<string, number>;
}) {
  const data = Object.entries(spentByCategory)
    .filter(([_, amount]) => amount > 0)
    .map(([categoryId, amount]) => {
      const category = getCategoryById(categoryId);
      return {
        name: `${category?.emoji} ${category?.name}`,
        value: amount,
        fill: category?.color || '#9ca3af',
      };
    });

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-xl p-6 flex items-center justify-center h-80">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-muted-foreground">No spending yet. Start logging to see your breakdown!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-6">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => `₦${value.toLocaleString()}`}
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
