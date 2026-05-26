import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateMortgage, MortgageResult, AmortizationRow } from '@/lib/engines';
import { generateMortgageInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState(300000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [years, setYears] = useState(30);
  const [monthlyIncome, setMonthlyIncome] = useState(8000);
  const [result, setResult] = useState<MortgageResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAllRows, setShowAllRows] = useState(false);

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
    const res = calculateMortgage(loanAmount, interestRate, years);
    setResult(res);
    setInsight(generateMortgageInsight(res, monthlyIncome));
  };

  return (
    <ToolLayout toolId="mortgage" category="finance">
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Mortgage Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Amount ($)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => { setLoanAmount(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.loanAmount; return n; }); }}
                className={`w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none transition-all ${errors.loanAmount ? 'border-rose-500' : ''}`}
              />
              {errors.loanAmount && <p className="text-xs text-rose-500">{errors.loanAmount}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => { setInterestRate(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.interestRate; return n; }); }}
                className={`w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none transition-all ${errors.interestRate ? 'border-rose-500' : ''}`}
              />
              {errors.interestRate && <p className="text-xs text-rose-500">{errors.interestRate}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loan Term (Years)</label>
              <input
                type="number"
                value={years}
                onChange={(e) => { setYears(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.years; return n; }); }}
                className={`w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none transition-all ${errors.years ? 'border-rose-500' : ''}`}
              />
              {errors.years && <p className="text-xs text-rose-500">{errors.years}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly Income ($)</label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => { setMonthlyIncome(Number(e.target.value)); setErrors(prev => { const n = { ...prev }; delete n.monthlyIncome; return n; }); }}
                className={`w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none transition-all ${errors.monthlyIncome ? 'border-rose-500' : ''}`}
              />
              {errors.monthlyIncome && <p className="text-xs text-rose-500">{errors.monthlyIncome}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest"
          >
            Calculate Payment
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-slate-50 border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Monthly Payment</span>
                <div className="text-3xl font-mono font-bold text-primary">${result.monthlyPayment.toFixed(2)}</div>
              </div>
              <div className="p-6 bg-slate-50 border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Interest</span>
                <div className="text-3xl font-mono font-bold">${result.totalInterest.toFixed(2)}</div>
              </div>
              <div className="p-6 bg-slate-50 border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Payment</span>
                <div className="text-3xl font-mono font-bold">${result.totalPayment.toFixed(2)}</div>
              </div>
            </div>

            <AmortizationChart data={result.amortization} />
            <AmortizationTable data={result.amortization} showAll={showAllRows} onToggle={() => setShowAllRows(v => !v)} />

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}

function AmortizationChart({ data }: { data: AmortizationRow[] }) {
  const chartData = useMemo(() => {
    const yearly: { year: number; principal: number; interest: number }[] = [];
    for (let year = 1; year <= data.length / 12; year++) {
      const start = (year - 1) * 12;
      const end = Math.min(year * 12, data.length);
      let principal = 0;
      let interest = 0;
      for (let i = start; i < end; i++) {
        principal += data[i].principal;
        interest += data[i].interest;
      }
      yearly.push({ year, principal: Math.round(principal), interest: Math.round(interest) });
    }
    return yearly;
  }, [data]);

  return (
    <div className="bg-white p-6 border rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-4">Annual Principal vs Interest</h3>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            <Legend wrapperStyle={{ paddingTop: 8 }} />
            <Area type="monotone" dataKey="principal" name="Principal" stroke="#10b981" fillOpacity={1} fill="url(#colorPrincipal)" />
            <Area type="monotone" dataKey="interest" name="Interest" stroke="#f43f5e" fillOpacity={1} fill="url(#colorInterest)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AmortizationTable({ data, showAll, onToggle }: { data: AmortizationRow[]; showAll: boolean; onToggle: () => void }) {
  const displayData = showAll ? data : data.slice(0, 12);
  return (
    <div className="bg-white p-6 border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Amortization Schedule</h3>
        <button onClick={onToggle} className="text-sm font-bold text-primary hover:underline">
          {showAll ? 'Show First 12 Months' : `Show All ${data.length} Months`}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground uppercase tracking-widest text-xs">
              <th className="text-left py-3 px-2">Month</th>
              <th className="text-right py-3 px-2">Payment</th>
              <th className="text-right py-3 px-2">Principal</th>
              <th className="text-right py-3 px-2">Interest</th>
              <th className="text-right py-3 px-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((row) => (
              <tr key={row.month} className="border-b last:border-0 hover:bg-slate-50">
                <td className="py-2 px-2">{row.month}</td>
                <td className="text-right py-2 px-2 font-mono">${row.payment.toFixed(2)}</td>
                <td className="text-right py-2 px-2 font-mono text-emerald-600">${row.principal.toFixed(2)}</td>
                <td className="text-right py-2 px-2 font-mono text-rose-500">${row.interest.toFixed(2)}</td>
                <td className="text-right py-2 px-2 font-mono">${row.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
