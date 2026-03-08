'use client';

export function BudgetProgress({
  spent,
  budget,
  currencySymbol = '₦',
}: {
  spent: number;
  budget: number;
  currencySymbol?: string;
}) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = Math.max(budget - spent, 0);
  const isOverBudget = spent > budget;
  const isNearLimit = percentage > 80;

  let barColor = 'bg-gradient-to-r from-green-500 to-green-600';
  if (isOverBudget) {
    barColor = 'bg-gradient-to-r from-red-500 to-red-600';
  } else if (isNearLimit) {
    barColor = 'bg-gradient-to-r from-orange-500 to-red-500';
  }

  return (
    <div className="bg-card rounded-xl p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm text-muted-foreground mb-1">This Month</h3>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{currencySymbol}{spent.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">of {currencySymbol}{budget.toLocaleString()}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Remaining</div>
          <div className={`text-lg font-semibold ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
            {currencySymbol}{remaining.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="text-xs text-muted-foreground">{percentage.toFixed(0)}% used</div>
        {isOverBudget && (
          <div className="text-xs text-red-400 font-medium">Over budget by {currencySymbol}{(spent - budget).toLocaleString()}</div>
        )}
      </div>
    </div>
  );
}
