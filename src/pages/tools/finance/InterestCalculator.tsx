import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateInterest, InterestResult } from '@/lib/engines';
import { generateInterestInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';

type InterestType = 'simple' | 'compound';
type CompoundFrequency = 'annually' | 'semiannually' | 'quarterly' | 'monthly' | 'daily';

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(5);
  const [type, setType] = useState<InterestType>('compound');
  const [compoundFrequency, setCompoundFrequency] = useState<CompoundFrequency>('monthly');
  const [result, setResult] = useState<InterestResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (principal <= 0) newErrors.principal = 'Principal must be greater than 0';
    if (principal > 100000000) newErrors.principal = 'Principal seems unrealistically high';
    if (rate < 0) newErrors.rate = 'Interest rate cannot be negative';
    if (rate > 100) newErrors.rate = 'Interest rate seems unrealistically high';
    if (years <= 0) newErrors.years = 'Time period must be at least 1 year';
    if (years > 100) newErrors.years = 'Time period seems unrealistically long';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateInterest(principal, rate, years, type, compoundFrequency);
    setResult(res);
    setInsight(generateInterestInsight(res, type));
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  return (
    <ToolLayout toolId="interest" category="finance">
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Interest Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="interest-principal" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Principal ($)</label>
              <input
                id="interest-principal"
                type="number"
                min="0"
                step="100"
                value={principal}
                onChange={(e) => { setPrincipal(validateNumberInput(e.target.value, { min: 0 })); clearError('principal'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.principal ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.principal && <p className="text-xs text-rose-500">{errors.principal}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="interest-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Rate (%)</label>
              <input
                id="interest-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={rate}
                onChange={(e) => { setRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('rate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.rate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.rate && <p className="text-xs text-rose-500">{errors.rate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="interest-years" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Time Period (Years)</label>
              <input
                id="interest-years"
                type="number"
                min="1"
                max="100"
                step="1"
                value={years}
                onChange={(e) => { setYears(validateNumberInput(e.target.value, { min: 1, max: 100 })); clearError('years'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.years ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.years && <p className="text-xs text-rose-500">{errors.years}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="interest-type" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Type</label>
              <select
                id="interest-type"
                value={type}
                onChange={(e) => setType(e.target.value as InterestType)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="compound">Compound Interest</option>
                <option value="simple">Simple Interest</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="compound-frequency" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Compound Frequency</label>
              <select
                id="compound-frequency"
                value={compoundFrequency}
                onChange={(e) => setCompoundFrequency(e.target.value as CompoundFrequency)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg disabled:opacity-50"
                disabled={type === 'simple'}
              >
                <option value="annually">Annually</option>
                <option value="semiannually">Semiannually</option>
                <option value="quarterly">Quarterly</option>
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
              </select>
              {type === 'simple' && <p className="text-xs text-muted-foreground mt-1">Not applicable for simple interest</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Interest
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Interest Earned</span>
                <div className={`${getResultTextSize(formatCurrency(result.interestEarned))} font-mono font-bold text-emerald-600 tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.interestEarned)}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Final Balance</span>
                <div className={`${getResultTextSize(formatCurrency(result.finalBalance))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.finalBalance)}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Effective Growth</span>
                <div className={`${getResultTextSize(formatPercent(result.effectiveGrowth))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatPercent(result.effectiveGrowth)}</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Growth Summary</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-mono font-bold text-slate-400">{formatCurrency(principal)}</div>
                  <div className="text-sm text-muted-foreground mt-1">Principal</div>
                </div>
                <div className="text-2xl sm:text-3xl text-slate-300 hidden sm:block">→</div>
                <div className="sm:hidden text-xl text-slate-300">↓</div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-600">+{formatCurrency(result.interestEarned)}</div>
                  <div className="text-sm text-emerald-600 mt-1">Interest</div>
                </div>
                <div className="text-2xl sm:text-3xl text-slate-300 hidden sm:block">→</div>
                <div className="sm:hidden text-xl text-slate-300">↓</div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-mono font-bold text-primary">{formatCurrency(result.finalBalance)}</div>
                  <div className="text-sm text-primary mt-1">Final Balance</div>
                </div>
              </div>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}