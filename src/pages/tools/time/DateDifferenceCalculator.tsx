import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateDateDifference, DateDifferenceResult } from '@/lib/engines/dateDifferenceEngine';
import { formatNumber, getResultTextSize } from '@/lib/utils';

export default function DateDifferenceCalculator() {
  const [startDate, setStartDate] = useState('2020-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<DateDifferenceResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime())) newErrors.startDate = 'Please enter a valid start date';
    if (isNaN(end.getTime())) newErrors.endDate = 'Please enter a valid end date';
    if (start > end) newErrors.endDate = 'End date must be after start date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateDateDifference(new Date(startDate), new Date(endDate));
    setResult(res);
  };

  return (
    <ToolLayout toolId="date-difference" category="time">
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Date Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="start-date" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Start Date</label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setErrors(prev => { const n = { ...prev }; delete n.startDate; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.startDate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.startDate && <p className="text-xs text-rose-500">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="end-date" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">End Date</label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setErrors(prev => { const n = { ...prev }; delete n.endDate; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.endDate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.endDate && <p className="text-xs text-rose-500">{errors.endDate}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Difference
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Duration</span>
              <div className={`${getResultTextSize(formatNumber(result.totalDays) + ' Days')} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.totalDays)} Days</div>
              <div className="text-muted-foreground mt-2 flex flex-wrap justify-center gap-2">
                {result.years > 0 && <span className="bg-slate-200 px-2 py-1 rounded text-sm">{result.years} years</span>}
                {result.months > 0 && <span className="bg-slate-200 px-2 py-1 rounded text-sm">{result.months} months</span>}
                {result.days > 0 && <span className="bg-slate-200 px-2 py-1 rounded text-sm">{result.days} days</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Years</span>
                <div className={`${getResultTextSize(String(result.years))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{result.years}</div>
              </div>
              <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Months</span>
                <div className={`${getResultTextSize(String(result.months))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{result.months}</div>
              </div>
              <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Days</span>
                <div className={`${getResultTextSize(String(result.days))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{result.days}</div>
              </div>
              <div className="p-4 sm:p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Weeks</span>
                <div className={`${getResultTextSize(formatNumber(result.weeks))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.weeks)}</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Detailed Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Total Hours</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.totalHours)}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Total Minutes</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.totalMinutes)}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Total Seconds</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(result.totalSeconds)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-3">Quick Reference</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-blue-700">
                <div>
                  <span className="font-semibold">In years:</span> {(result.totalDays / 365.25).toFixed(2)}
                </div>
                <div>
                  <span className="font-semibold">In months:</span> {(result.totalDays / 30.44).toFixed(2)}
                </div>
                <div>
                  <span className="font-semibold">In quarters:</span> {(result.totalDays / 91.25).toFixed(2)}
                </div>
                <div>
                  <span className="font-semibold">In work days:</span> {formatNumber(Math.floor(result.totalDays * 5 / 7))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </ToolLayout>
  );
}
