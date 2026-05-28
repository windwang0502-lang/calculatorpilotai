import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateAge, AgeResult } from '@/lib/engines';
import { generateAgeInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatNumber, getResultTextSize } from '@/lib/utils';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<AgeResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (isNaN(birth.getTime())) newErrors.birthDate = 'Please enter a valid birth date';
    if (isNaN(target.getTime())) newErrors.targetDate = 'Please enter a valid target date';
    if (birth > target) newErrors.targetDate = 'Target date must be after birth date';
    if (target.getFullYear() - birth.getFullYear() > 200) newErrors.targetDate = 'Date range seems unrealistic';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateAge(new Date(birthDate), new Date(targetDate));
    setResult(res);
    setInsight(generateAgeInsight(res.years));
  };

  return (
    <ToolLayout toolId="age" category="time">
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Age & Date Difference Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="birth-date" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Birth Date</label>
              <input
                id="birth-date"
                type="date"
                value={birthDate}
                onChange={(e) => { setBirthDate(e.target.value); setErrors(prev => { const n = { ...prev }; delete n.birthDate; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.birthDate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.birthDate && <p className="text-xs text-rose-500">{errors.birthDate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="target-date" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Target Date</label>
              <input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => { setTargetDate(e.target.value); setErrors(prev => { const n = { ...prev }; delete n.targetDate; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.targetDate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.targetDate && <p className="text-xs text-rose-500">{errors.targetDate}</p>}
            </div>
          </div>
          <button onClick={handleCalculate} className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
            Calculate Age
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Age</span>
                <div className={`${getResultTextSize(String(result.years))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.years)} Years</div>
                <div className="text-sm text-muted-foreground mt-1">{result.months} Months, {result.days} Days</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center sm:col-span-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Time Elapsed</span>
                <div className={`${getResultTextSize(formatNumber(result.totalDays))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.totalDays)} Days</div>
                <div className="text-sm text-muted-foreground mt-1">~{formatNumber(result.totalDays / 7, { decimals: 1 })} Weeks / ~{formatNumber(result.totalDays / 30.44, { decimals: 1 })} Months</div>
              </div>
            </div>
            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}
