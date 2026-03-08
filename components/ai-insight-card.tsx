'use client';

import { Insight } from '@/lib/insights';

export function AIInsightCard({ insight }: { insight: Insight }) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 to-purple-900 p-6 text-white">
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-400 rounded-full opacity-10 -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full opacity-5 -ml-16 -mb-16" />
      
      <div className="relative z-10">
        <div className="text-2xl mb-2">{insight.title}</div>
        <p className="text-sm text-purple-100 leading-relaxed">
          {insight.message}
        </p>
      </div>
    </div>
  );
}
