import React, { useState, useEffect } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateCountdown, CountdownResult } from '@/lib/engines/countdownEngine';

export default function CountdownCalculator() {
  const [targetDate, setTargetDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString().split('T')[0];
  });
  const [result, setResult] = useState<CountdownResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLive, setIsLive] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const target = new Date(targetDate);
    if (isNaN(target.getTime())) newErrors.targetDate = 'Please enter a valid target date';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const now = new Date();
    const target = new Date(targetDate);
    const res = calculateCountdown(now, target);
    setResult(res);
  };

  useEffect(() => {
    if (!isLive || !result) return;
    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      const res = calculateCountdown(now, target);
      setResult(res);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive, result, targetDate]);

  return (
    <ToolLayout toolId="countdown" category="time">
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Countdown to Future Date</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Target Date</label>
              <input
                type="datetime-local"
                value={targetDate}
                onChange={(e) => {
                  setTargetDate(e.target.value);
                  setErrors(prev => { const n = { ...prev }; delete n.targetDate; return n; });
                }}
                className={`w-full p-3 border rounded outline-none focus:ring-2 focus:ring-primary ${errors.targetDate ? 'border-rose-500' : ''}`}
              />
              {errors.targetDate && <p className="text-xs text-rose-500">{errors.targetDate}</p>}
            </div>
            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isLive}
                  onChange={(e) => setIsLive(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium">Live countdown (updates every second)</span>
              </label>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest"
          >
            Start Countdown
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-6 ${result.isPast ? 'bg-slate-100 border-slate-200' : 'bg-blue-50 border-blue-100'} border rounded-lg text-center`}>
              <span className="text-xs font-bold uppercase tracking-widest block mb-2 text-muted-foreground">Time Remaining</span>
              {result.isPast ? (
                <div className="text-2xl font-bold text-slate-600">This date has passed</div>
              ) : (
                <div className="text-4xl font-mono font-bold text-blue-700">
                  {result.years > 0 && `${result.years}y `}
                  {result.months > 0 && `${result.months}m `}
                  {result.days}d
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Years</span>
                <div className="text-3xl font-mono font-bold">{result.years}</div>
              </div>
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Months</span>
                <div className="text-3xl font-mono font-bold">{result.months}</div>
              </div>
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Days</span>
                <div className="text-3xl font-mono font-bold">{result.days}</div>
              </div>
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Hours</span>
                <div className="text-3xl font-mono font-bold">{result.hours.toString().padStart(2, '0')}</div>
              </div>
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Minutes</span>
                <div className="text-3xl font-mono font-bold">{result.minutes.toString().padStart(2, '0')}</div>
              </div>
            </div>

            <div className="p-6 bg-white border rounded-lg text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Seconds (Live)</span>
              <div className="text-5xl font-mono font-bold text-primary">{result.seconds.toString().padStart(2, '0')}</div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Time Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Total Days</span>
                  <span className="text-xl font-mono font-bold">{result.totalDays.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Total Hours</span>
                  <span className="text-xl font-mono font-bold">{result.totalHours.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Total Minutes</span>
                  <span className="text-xl font-mono font-bold">{result.totalMinutes.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
              <h3 className="font-bold text-blue-800 mb-3">Planning Suggestions</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex gap-2"><span className="text-blue-500">1.</span> Set milestones at 75%, 50%, and 25% remaining time</li>
                <li className="flex gap-2"><span className="text-blue-500">2.</span> Break large projects into weekly goals</li>
                <li className="flex gap-2"><span className="text-blue-500">3.</span> Schedule regular check-ins to track progress</li>
                <li className="flex gap-2"><span className="text-blue-500">4.</span> Build buffer time for unexpected delays</li>
              </ul>
            </div>
          </div>
        )}
      </section>
    </ToolLayout>
  );
}
