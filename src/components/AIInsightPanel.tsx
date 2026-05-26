import React from 'react';
import { AIInsight } from '@/lib/ai';

interface AIInsightPanelProps {
  insight: AIInsight | null;
}

export const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insight }) => {
  if (!insight) return null;

  const colorClass = {
    Low: 'border-emerald-500 bg-emerald-50 text-emerald-900',
    Medium: 'border-amber-500 bg-amber-50 text-amber-900',
    High: 'border-rose-500 bg-rose-50 text-rose-900',
  }[insight.riskLevel];

  return (
    <div className={`mt-8 p-6 border-l-4 ${colorClass} rounded-r-lg animate-in fade-in slide-in-from-left-4 duration-500`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-current/10">
          AI Analysis
        </span>
        <span className="text-sm font-semibold capitalize">
          Risk Level: {insight.riskLevel}
        </span>
      </div>
      <h3 className="text-lg font-bold mb-2">Insight & Advice</h3>
      <p className="mb-4 leading-relaxed font-medium">{insight.advice}</p>
      <div className="pt-4 border-t border-current/10">
        <h4 className="text-sm font-bold uppercase tracking-wide mb-2 opacity-70">Optimization Suggestion</h4>
        <p className="text-sm italic leading-relaxed">{insight.suggestion}</p>
      </div>
    </div>
  );
};
