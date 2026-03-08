import { Transaction } from './storage';
import { getCategoryName } from './categories';

export interface Insight {
  title: string;
  message: string;
  type: 'positive' | 'warning' | 'neutral';
}

const tips = {
  food: [
    "Your food spending is high — try cooking twice a week to save up to ₦8,000 this month.",
    "You're spending a lot on food. Consider buying from markets instead of restaurants to cut costs.",
    "Food is your biggest expense. Meal prepping on Sundays could save you ₦5,000+ weekly.",
  ],
  data: [
    "Data is draining your budget. Switch to a weekly plan instead of daily to save more.",
    "You're spending heavily on data. Compare plans — MTN, Airtel and Glo all have student-friendly bundles.",
    "Cut data costs by downloading content on WiFi and using offline mode more often.",
  ],
  transport: [
    "Transport is eating into your budget. Try carpooling with classmates to split costs.",
    "Your transport spend is high. Walking short distances could save you ₦2,000+ weekly.",
    "Consider a weekly transport budget to avoid overspending on rides.",
  ],
  school: [
    "School expenses are up. Check if you can share textbooks or find PDF versions online.",
    "Printing costs add up fast. Print in bulk to get discounts at most campus print shops.",
    "Look for free alternatives to paid school resources — most are available online.",
  ],
  personal: [
    "Personal spending is your top category. Try a monthly limit for personal items to stay on track.",
    "Your personal expenses are high. Consider a no-spend week to rebalance your budget.",
    "Set a personal care budget at the start of each month to avoid overspending.",
  ],
  fun: [
    "Fun spending is up! Try free hangout options — parks, campus events, or game nights.",
    "Entertainment is your top spend. Set a fun budget so you enjoy yourself without guilt.",
    "Balance is key — but cutting fun spending by 30% could free up ₦5,000+ this month.",
  ],
  default: [
    "You're on track! Keep logging daily to get sharper insights as the month goes on.",
    "Great discipline so far. Try to save at least 20% of whatever is left this month.",
    "You're managing well. Set a savings goal to make the most of your remaining budget.",
  ]
};

function getRandomTip(category: string): string {
  const categoryTips = tips[category as keyof typeof tips] || tips.default;
  return categoryTips[Math.floor(Math.random() * categoryTips.length)];
}

export function generateInsight(transactions: Transaction[], monthlyBudget: number): Insight {
  const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
  const remaining = monthlyBudget - totalSpent;
  const percentUsed = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  const categorySpending: Record<string, number> = {};
  transactions.forEach(t => {
    categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
  });

  const topCategory = Object.entries(categorySpending).sort((a, b) => b[1] - a[1])[0];
  const topCategoryKey = topCategory ? topCategory[0] : 'default';
  const topCategoryName = topCategory ? getCategoryName(topCategory[0]) : null;

  if (totalSpent === 0) {
    return {
      title: '🚀 Ready to Track',
      message: `Your ₦${monthlyBudget.toLocaleString()} budget is set. Start logging expenses to get personalized AI-powered insights.`,
      type: 'positive',
    };
  }

  if (percentUsed > 80) {
    return {
      title: '⚠️ Budget Alert',
      message: `You've used ${percentUsed.toFixed(0)}% of your budget. Only ₦${remaining.toLocaleString()} left — ${getRandomTip(topCategoryKey)}`,
      type: 'warning',
    };
  }

  if (percentUsed > 60) {
    return {
      title: '📊 Spending Analysis',
      message: `${topCategoryName ? `${topCategoryName} is your top spend this month. ` : ''}${getRandomTip(topCategoryKey)} ₦${remaining.toLocaleString()} remaining.`,
      type: 'neutral',
    };
  }

  return {
    title: '✨ AI Insight',
    message: `You've spent ₦${totalSpent.toLocaleString()} (${percentUsed.toFixed(0)}% of budget). ${getRandomTip(topCategoryKey)}`,
    type: 'positive',
  };
}