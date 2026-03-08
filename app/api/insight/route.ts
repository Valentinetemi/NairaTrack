import { NextRequest, NextResponse } from 'next/server';

const tips: Record<string, string[]> = {
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
    "Balance is key — cutting fun spending by 30% could free up ₦5,000+ this month.",
  ],
  default: [
    "You're on track! Keep logging daily to get sharper insights as the month goes on.",
    "Try to save at least 20% of whatever is left this month.",
    "You're managing well. Set a savings goal to make the most of your remaining budget.",
  ]
};

export async function POST(req: NextRequest) {
  const { totalSpent, monthlyBudget, percentUsed, topCategory, remaining } = await req.json();

  const categoryKey = topCategory?.toLowerCase() || 'default';
  const categoryTips = tips[categoryKey] || tips.default;
  const randomTip = categoryTips[Math.floor(Math.random() * categoryTips.length)];

  let message = '';

  if (totalSpent === 0) {
    message = `Your ₦${Number(monthlyBudget).toLocaleString()} budget is set. Start logging expenses to get personalized insights.`;
  } else if (percentUsed > 80) {
    message = `You've used ${percentUsed}% of your budget. Only ₦${Number(remaining).toLocaleString()} left — ${randomTip}`;
  } else if (percentUsed > 60) {
    message = `${topCategory ? `${topCategory} is your top spend. ` : ''}${randomTip} ₦${Number(remaining).toLocaleString()} remaining.`;
  } else {
    message = `You've spent ₦${Number(totalSpent).toLocaleString()} (${percentUsed}% of budget). ${randomTip}`;
  }

  return NextResponse.json({ message });
}