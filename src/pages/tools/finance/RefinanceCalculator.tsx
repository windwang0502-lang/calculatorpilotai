import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateRefinance, RefinanceResult } from '@/lib/engines';
import { generateRefinanceInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function RefinanceCalculator() {
  const [currentBalance, setCurrentBalance] = useState(300000);
  const [currentRate, setCurrentRate] = useState(7);
  const [remainingYears, setRemainingYears] = useState(25);
  const [newRate, setNewRate] = useState(5.5);
  const [newTermYears, setNewTermYears] = useState(30);
  const [closingCosts, setClosingCosts] = useState(6000);
  const [result, setResult] = useState<RefinanceResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (currentBalance <= 0) newErrors.currentBalance = 'Current balance must be greater than 0';
    if (currentBalance > 100000000) newErrors.currentBalance = 'Balance seems unrealistically high';
    if (currentRate < 0) newErrors.currentRate = 'Current rate cannot be negative';
    if (currentRate > 50) newErrors.currentRate = 'Current rate seems unrealistically high';
    if (remainingYears <= 0) newErrors.remainingYears = 'Remaining years must be at least 1';
    if (remainingYears > 100) newErrors.remainingYears = 'Term seems unrealistically long';
    if (newRate < 0) newErrors.newRate = 'New rate cannot be negative';
    if (newRate > 50) newErrors.newRate = 'New rate seems unrealistically high';
    if (newTermYears <= 0) newErrors.newTermYears = 'New term must be at least 1 year';
    if (newTermYears > 100) newErrors.newTermYears = 'New term seems unrealistically long';
    if (closingCosts < 0) newErrors.closingCosts = 'Closing costs cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateRefinance(currentBalance, currentRate, remainingYears, newRate, newTermYears, closingCosts);
    setResult(res);
    setInsight(generateRefinanceInsight(res));
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  return (
    <ToolLayout toolId="refinance" category="finance">
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Refinance Calculator</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4 text-slate-700">Current Loan</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="current-balance" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Loan Balance ($)</label>
                  <input
                    id="current-balance"
                    type="number"
                    min="0"
                    step="1000"
                    value={currentBalance}
                    onChange={(e) => { setCurrentBalance(validateNumberInput(e.target.value, { min: 0 })); clearError('currentBalance'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.currentBalance ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.currentBalance && <p className="text-xs text-rose-500">{errors.currentBalance}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="current-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Interest Rate (%)</label>
                  <input
                    id="current-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={currentRate}
                    onChange={(e) => { setCurrentRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('currentRate'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.currentRate ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.currentRate && <p className="text-xs text-rose-500">{errors.currentRate}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="remaining-years" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Remaining Term (Years)</label>
                  <input
                    id="remaining-years"
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={remainingYears}
                    onChange={(e) => { setRemainingYears(validateNumberInput(e.target.value, { min: 1, max: 100 })); clearError('remainingYears'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.remainingYears ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.remainingYears && <p className="text-xs text-rose-500">{errors.remainingYears}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-slate-700">New Loan Terms</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="new-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">New Interest Rate (%)</label>
                  <input
                    id="new-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={newRate}
                    onChange={(e) => { setNewRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('newRate'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.newRate ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.newRate && <p className="text-xs text-rose-500">{errors.newRate}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="new-term" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">New Loan Term (Years)</label>
                  <input
                    id="new-term"
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={newTermYears}
                    onChange={(e) => { setNewTermYears(validateNumberInput(e.target.value, { min: 1, max: 100 })); clearError('newTermYears'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.newTermYears ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.newTermYears && <p className="text-xs text-rose-500">{errors.newTermYears}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="closing-costs" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Closing Costs ($)</label>
                  <input
                    id="closing-costs"
                    type="number"
                    min="0"
                    step="100"
                    value={closingCosts}
                    onChange={(e) => { setClosingCosts(validateNumberInput(e.target.value, { min: 0 })); clearError('closingCosts'); }}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.closingCosts ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  {errors.closingCosts && <p className="text-xs text-rose-500">{errors.closingCosts}</p>}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Refinance Savings
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Current Payment</span>
                <div className={`${getResultTextSize(formatCurrency(result.currentPayment))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.currentPayment)}</div>
              </div>
              <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">New Payment</span>
                <div className={`${getResultTextSize(formatCurrency(result.newPayment))} font-mono font-bold text-emerald-600 tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.newPayment)}</div>
              </div>
              <div className="p-4 sm:p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Monthly Savings</span>
                <div className={`${getResultTextSize(formatCurrency(result.monthlySavings))} font-mono font-bold text-emerald-600 tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.monthlySavings)}</div>
              </div>
              <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Break-Even</span>
                <div className="text-xl sm:text-2xl font-mono font-bold">{result.breakEvenMonths} mo</div>
              </div>
              <div className="p-4 sm:p-6 bg-primary/5 border border-primary/20 rounded-xl text-center col-span-2 lg:col-span-1">
                <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Lifetime Savings</span>
                <div className={`${getResultTextSize(formatCurrency(result.lifetimeSavings))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.lifetimeSavings)}</div>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2 text-emerald-800">Refinance Analysis</h3>
              <p className="text-emerald-700 leading-relaxed">
                {result.monthlySavings > 0
                  ? `By refinancing, you could save ${formatCurrency(result.monthlySavings)} per month. At this rate, your closing costs of ${formatCurrency(closingCosts)} will be recovered in ${result.breakEvenMonths} months. Over the life of the loan, you could save ${formatCurrency(result.lifetimeSavings)}.`
                  : `Refinancing with these terms may not provide immediate savings. Consider waiting for better rates or different loan terms.`}
              </p>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}