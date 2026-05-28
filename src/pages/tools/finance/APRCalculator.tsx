import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateAPR, APRResult } from '@/lib/engines';
import { generateAPRInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function APRCalculator() {
  const [loanAmount, setLoanAmount] = useState(200000);
  const [nominalRate, setNominalRate] = useState(6.5);
  const [years, setYears] = useState(30);
  const [fees, setFees] = useState(5000);
  const [result, setResult] = useState<APRResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (loanAmount <= 0) newErrors.loanAmount = 'Loan amount must be greater than 0';
    if (loanAmount > 100000000) newErrors.loanAmount = 'Loan amount seems unrealistically high';
    if (nominalRate < 0) newErrors.nominalRate = 'Interest rate cannot be negative';
    if (nominalRate > 50) newErrors.nominalRate = 'Interest rate seems unrealistically high';
    if (years <= 0) newErrors.years = 'Loan term must be at least 1 year';
    if (years > 100) newErrors.years = 'Loan term seems unrealistically long';
    if (fees < 0) newErrors.fees = 'Fees cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateAPR(loanAmount, nominalRate, years, fees);
    setResult(res);
    setInsight(generateAPRInsight(res.apr, nominalRate));
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  return (
    <ToolLayout toolId="apr" category="finance">
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">APR Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="apr-loan-amount" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Amount ($)</label>
              <input
                id="apr-loan-amount"
                type="number"
                min="0"
                step="100"
                value={loanAmount}
                onChange={(e) => { setLoanAmount(validateNumberInput(e.target.value, { min: 0 })); clearError('loanAmount'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.loanAmount ? 'border-rose-500' : 'border-slate-200'}`}
                aria-describedby={errors.loanAmount ? 'apr-loan-amount-error' : undefined}
              />
              {errors.loanAmount && <p id="apr-loan-amount-error" className="text-xs text-rose-500" role="alert">{errors.loanAmount}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="apr-nominal-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Nominal Interest Rate (%)</label>
              <input
                id="apr-nominal-rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={nominalRate}
                onChange={(e) => { setNominalRate(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('nominalRate'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.nominalRate ? 'border-rose-500' : 'border-slate-200'}`}
                aria-describedby={errors.nominalRate ? 'apr-nominal-rate-error' : undefined}
              />
              {errors.nominalRate && <p id="apr-nominal-rate-error" className="text-xs text-rose-500" role="alert">{errors.nominalRate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="apr-years" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Term (Years)</label>
              <input
                id="apr-years"
                type="number"
                min="1"
                max="100"
                step="1"
                value={years}
                onChange={(e) => { setYears(validateNumberInput(e.target.value, { min: 1, max: 100 })); clearError('years'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.years ? 'border-rose-500' : 'border-slate-200'}`}
                aria-describedby={errors.years ? 'apr-years-error' : undefined}
              />
              {errors.years && <p id="apr-years-error" className="text-xs text-rose-500" role="alert">{errors.years}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="apr-fees" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fees / Closing Costs ($)</label>
              <input
                id="apr-fees"
                type="number"
                min="0"
                step="100"
                value={fees}
                onChange={(e) => { setFees(validateNumberInput(e.target.value, { min: 0 })); clearError('fees'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.fees ? 'border-rose-500' : 'border-slate-200'}`}
                aria-describedby={errors.fees ? 'apr-fees-error' : undefined}
              />
              {errors.fees && <p id="apr-fees-error" className="text-xs text-rose-500" role="alert">{errors.fees}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate APR
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">APR</span>
                <div className={`${getResultTextSize(formatPercent(result.apr))} font-mono font-bold text-primary tabular-nums leading-tight tracking-tight break-all`}>{formatPercent(result.apr)}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Monthly Payment</span>
                <div className={`${getResultTextSize(formatCurrency(result.monthlyPayment))} font-mono font-bold tabular-nums leading-tight tracking-tight break-all`}>{formatCurrency(result.monthlyPayment)}</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Cost</span>
                <div className={`${getResultTextSize(formatCurrency(result.totalCost))} font-mono font-bold tabular-nums leading-tight tracking-tight break-all`}>{formatCurrency(result.totalCost)}</div>
              </div>
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">Rate Difference</span>
                <div className={`${getResultTextSize(formatPercent(result.rateDifference, { showSign: true }))} font-mono font-bold text-amber-600 tabular-nums leading-tight tracking-tight break-all`}>{formatPercent(result.rateDifference, { showSign: true })}</div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2 text-amber-800">Why APR Matters</h3>
              <p className="text-amber-700 leading-relaxed">
                The APR of {formatPercent(result.apr)} is {result.rateDifference > 0 ? `${formatPercent(result.rateDifference)} higher` : 'equal'} to the nominal rate of {formatPercent(nominalRate)}.
                This difference represents the cost of fees spread across the {years}-year loan term.
                When comparing loans, always use APR to get a true cost comparison.
              </p>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}