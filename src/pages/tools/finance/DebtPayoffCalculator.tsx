import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateDebtPayoff, DebtPayoffResult } from '@/lib/engines';
import { generateDebtPayoffInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function DebtPayoffCalculator() {
  const [balance, setBalance] = useState(15000);
  const [rate, setRate] = useState(19.99);
  const [monthlyPayment, setMonthlyPayment] = useState(300);
  const [extraPayment, setExtraPayment] = useState(150);
  const [useExtraPayment, setUseExtraPayment] = useState(true);
  const [result, setResult] = useState<DebtPayoffResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (balance <= 0) newErrors.balance = 'Debt balance must be greater than 0';
    if (balance > 100000000) newErrors.balance = 'Balance seems unrealistically high';
    if (rate < 0) newErrors.rate = 'Interest rate cannot be negative';
    if (rate > 100) newErrors.rate = 'Interest rate seems unrealistically high';
    if (monthlyPayment <= 0) newErrors.monthlyPayment = 'Monthly payment must be greater than 0';
    if (extraPayment < 0) newErrors.extraPayment = 'Extra payment cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateDebtPayoff(balance, rate, monthlyPayment, extraPayment, useExtraPayment);
    setResult(res);
    setInsight(generateDebtPayoffInsight(res));
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  return (
    <ToolLayout toolId="debt-payoff" category="finance">
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Debt Payoff Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="debt-balance" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Debt Balance ($)</label>
              <input
                id="debt-balance"
                type="number"
                min="0"
                step="100"
                value={balance}
                onChange={(e) => { setBalance(validateNumberInput(e.target.value, { min: 0 })); clearError('balance'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.balance ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.balance && <p className="text-xs text-rose-500">{errors.balance}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="debt-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Rate (%)</label>
              <input
                id="debt-rate"
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
              <label htmlFor="monthly-payment" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly Payment ($)</label>
              <input
                id="monthly-payment"
                type="number"
                min="0"
                step="10"
                value={monthlyPayment}
                onChange={(e) => { setMonthlyPayment(validateNumberInput(e.target.value, { min: 0 })); clearError('monthlyPayment'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.monthlyPayment ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.monthlyPayment && <p className="text-xs text-rose-500">{errors.monthlyPayment}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="extra-payment" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Extra Monthly Payment ($)</label>
              <input
                id="extra-payment"
                type="number"
                min="0"
                step="10"
                value={extraPayment}
                onChange={(e) => { setExtraPayment(validateNumberInput(e.target.value, { min: 0 })); clearError('extraPayment'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.extraPayment ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.extraPayment && <p className="text-xs text-rose-500">{errors.extraPayment}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="useExtraPayment"
                  checked={useExtraPayment}
                  onChange={(e) => setUseExtraPayment(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="useExtraPayment" className="text-sm font-semibold text-muted-foreground">
                  Include extra payment in calculation
                </label>
              </div>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Payoff
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {result.monthsToPayOff === Infinity ? (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2 text-rose-800">Payment Too Low</h3>
                <p className="text-rose-700 leading-relaxed">
                  Your monthly payment of {formatCurrency(monthlyPayment)} does not cover the monthly interest of {formatCurrency(balance * rate / 100 / 12)}.
                  Your debt will never decrease with this payment amount. Please increase your payment.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Months to Pay Off</span>
                    <div className={`${getResultTextSize(String(result.monthsToPayOff))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>{result.monthsToPayOff}</div>
                  </div>
                  <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Interest</span>
                    <div className={`${getResultTextSize(formatCurrency(result.totalInterest))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.totalInterest)}</div>
                  </div>
                  <div className="p-4 sm:p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Paid</span>
                    <div className={`${getResultTextSize(formatCurrency(result.totalPaid))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.totalPaid)}</div>
                  </div>
                  <div className="p-4 sm:p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Time Saved</span>
                    <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-600">{result.timeSaved} mo</div>
                  </div>
                  <div className="p-4 sm:p-6 bg-primary/5 border border-primary/20 rounded-xl text-center col-span-2 lg:col-span-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">Interest Saved</span>
                    <div className={`${getResultTextSize(formatCurrency(result.interestSaved))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.interestSaved)}</div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-2 text-emerald-800">Payoff Summary</h3>
                  <p className="text-emerald-700 leading-relaxed">
                    {useExtraPayment && result.timeSaved > 0
                      ? `By paying ${formatCurrency(monthlyPayment + extraPayment)} monthly instead of just ${formatCurrency(monthlyPayment)}, you will be debt-free in ${result.monthsToPayOff} months. You will save ${formatCurrency(result.interestSaved)} in interest and become debt-free ${result.timeSaved} months earlier.`
                      : `With your current payment of ${formatCurrency(monthlyPayment)} monthly, you will be debt-free in ${result.monthsToPayOff} months. Total interest paid: ${formatCurrency(result.totalInterest)}.`}
                  </p>
                </div>

                <AIInsightPanel insight={insight} />
              </>
            )}
          </div>
        )}
      </section>
    </ToolLayout>
  );
}