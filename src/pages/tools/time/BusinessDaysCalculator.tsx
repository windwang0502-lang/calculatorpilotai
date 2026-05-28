import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateBusinessDays, BusinessDaysResult } from '@/lib/engines/businessDaysEngine';

export default function BusinessDaysCalculator() {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-12-31');
  const [excludeHolidays, setExcludeHolidays] = useState(false);
  const [result, setResult] = useState<BusinessDaysResult | null>(null);
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
    const res = calculateBusinessDays(new Date(startDate), new Date(endDate), excludeHolidays);
    setResult(res);
  };

  return (
    <ToolLayout toolId="business-days" category="time">
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Business Days</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setErrors(prev => { const n = { ...prev }; delete n.startDate; return n; });
                }}
                className={`w-full p-3 border rounded outline-none focus:ring-2 focus:ring-primary ${errors.startDate ? 'border-rose-500' : ''}`}
              />
              {errors.startDate && <p className="text-xs text-rose-500">{errors.startDate}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setErrors(prev => { const n = { ...prev }; delete n.endDate; return n; });
                }}
                className={`w-full p-3 border rounded outline-none focus:ring-2 focus:ring-primary ${errors.endDate ? 'border-rose-500' : ''}`}
              />
              {errors.endDate && <p className="text-xs text-rose-500">{errors.endDate}</p>}
            </div>
          </div>
          <div className="mt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeHolidays}
                onChange={(e) => setExcludeHolidays(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium">Exclude US Federal Holidays</span>
            </label>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest"
          >
            Calculate Business Days
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-green-50 border border-green-100 rounded-lg text-center">
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-2">Working Days</span>
              <div className="text-5xl font-mono font-bold text-green-700">{result.businessDays}</div>
              <span className="text-green-600">days</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Days</span>
                <div className="text-3xl font-mono font-bold">{result.totalDays}</div>
              </div>
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Weekend Days</span>
                <div className="text-3xl font-mono font-bold">{result.weekends}</div>
              </div>
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Holidays</span>
                <div className="text-3xl font-mono font-bold">{result.holidays}</div>
              </div>
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Working Weeks</span>
                <div className="text-3xl font-mono font-bold">{result.workingWeeks}</div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Project Planning Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Equivalent Months</span>
                  <span className="text-xl font-mono font-bold">{(result.businessDays / 21.75).toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground ml-2">(at 21.75 days/month)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">8-Hour Workload</span>
                  <span className="text-xl font-mono font-bold">{(result.businessDays * 8).toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground ml-2">hours total</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
              <h3 className="font-bold text-blue-800 mb-3">Business Days Per Month (Average)</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-center">
                {['Jan: 21', 'Feb: 20', 'Mar: 21', 'Apr: 22', 'May: 23', 'Jun: 20'].map((m) => (
                  <div key={m} className="p-2 bg-white rounded text-sm text-blue-700">{m}</div>
                ))}
                {['Jul: 22', 'Aug: 22', 'Sep: 21', 'Oct: 23', 'Nov: 21', 'Dec: 21'].map((m) => (
                  <div key={m} className="p-2 bg-white rounded text-sm text-blue-700">{m}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </ToolLayout>
  );
}
