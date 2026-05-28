import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateLoan, LoanResult } from '@/lib/engines';
import { generateLoanInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput, formatDuration } from '@/lib/utils';

type Frequency = 'monthly' | 'biweekly' | 'weekly';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(25000);
  const [interestRate, setInterestRate] = useState(7.5);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState<Frequency>('monthly');
  const [monthlyIncome, setMonthlyIncome] = useState(6000);
  const [result, setResult] = useState<LoanResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (loanAmount <= 0) newErrors.loanAmount = 'Loan amount must be greater than 0';
    if (loanAmount > 100000000) newErrors.loanAmount = 'Loan amount seems unrealistically high';
    if (interestRate < 0) newErrors.interestRate = 'Interest rate cannot be negative';
    if (interestRate > 50) newErrors.interestRate = 'Interest rate seems unrealistically high';
    if (years <= 0) newErrors.years = 'Loan term must be at least 1 year';
    if (years > 100) newErrors.years = 'Loan term seems unrealistically long';
    if (monthlyIncome <= 0) newErrors.monthlyIncome = 'Monthly income must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateLoan(loanAmount, interestRate, years, frequency);
    setResult(res);
    setInsight(generateLoanInsight(res, monthlyIncome));
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  const getFrequencySuffix = () => {
    switch (frequency) {
      case 'monthly': return '/mo';
      case 'biweekly': return '/biwk';
      case 'weekly': return '/wk';
      default: return '';
    }
  };

  return (
    <ToolLayout toolId="loan" category="finance">
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Loan Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="loan-amount" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Amount ($)</label>
              <input
                id="loan-amount"
                type="number"
                min="0"
                step="100"
                value={loanAmount}
                onChange={(e) => { setLoanAmount(validateNumberInput(e.target.value, { min: 0 })); clearError('loanAmount'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.loanAmount ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.loanAmount && <p className="text-xs text-rose-500">{errors.loanAmount}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="interest-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Rate (%)</label>
              <input
                id="interest-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={interestRate}
                onChange={(e) => { setInterestRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('interestRate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.interestRate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.interestRate && <p className="text-xs text-rose-500">{errors.interestRate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="loan-term" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Term (Years)</label>
              <input
                id="loan-term"
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
              <label htmlFor="payment-frequency" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Payment Frequency</label>
              <select
                id="payment-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as Frequency)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="monthly">Monthly</option>
                <option value="biweekly">Biweekly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="monthly-income" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly Income ($)</label>
              <input
                id="monthly-income"
                type="number"
                min="0"
                step="100"
                value={monthlyIncome}
                onChange={(e) => { setMonthlyIncome(validateNumberInput(e.target.value, { min: 0 })); clearError('monthlyIncome'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.monthlyIncome ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.monthlyIncome && <p className="text-xs text-rose-500">{errors.monthlyIncome}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Payment
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Payment</span>
                <div className={`${getResultTextSize(formatCurrency(result.payment))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight`}>
                  {formatCurrency(result.payment)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">{getFrequencySuffix()}</span>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Interest</span>
                <div className={`${getResultTextSize(formatCurrency(result.totalInterest))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.totalInterest)}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Payment</span>
                <div className={`${getResultTextSize(formatCurrency(result.totalPayment))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatCurrency(result.totalPayment)}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Payoff Date</span>
                <div className="text-xl font-mono font-bold">{result.payoffDate}</div>
              </div>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}