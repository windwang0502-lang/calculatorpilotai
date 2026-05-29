import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  ReferenceLine
} from 'recharts';
import { Clock, Calendar, TrendingUp, DollarSign, Target } from 'lucide-react';

interface WorkHoursResult {
  totalHoursPerDay: number;
  overtimeHoursPerDay: number;
  weeklyHours: number;
  monthlyHours: number;
  annualHours: number;
  regularWeeklyHours: number;
  overtimeWeeklyHours: number;
}

function calculateWorkHours(
  startTime: string,
  endTime: string,
  breakMinutes: number,
  daysPerWeek: number
): WorkHoursResult {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  let startTotalMinutes = startHours * 60 + startMinutes;
  let endTotalMinutes = endHours * 60 + endMinutes;

  // Handle overnight shifts (end time is next day)
  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }

  const totalMinutesWorked = endTotalMinutes - startTotalMinutes - breakMinutes;
  const totalHoursPerDay = totalMinutesWorked / 60;

  const overtimeHoursPerDay = Math.max(0, totalHoursPerDay - 8);
  const regularHoursPerDay = Math.min(totalHoursPerDay, 8);

  const weeklyHours = totalHoursPerDay * daysPerWeek;
  const regularWeeklyHours = regularHoursPerDay * daysPerWeek;
  const overtimeWeeklyHours = overtimeHoursPerDay * daysPerWeek;
  const monthlyHours = weeklyHours * 4.33;
  const annualHours = monthlyHours * 12;

  return {
    totalHoursPerDay: Math.round(totalHoursPerDay * 100) / 100,
    overtimeHoursPerDay: Math.round(overtimeHoursPerDay * 100) / 100,
    weeklyHours: Math.round(weeklyHours * 100) / 100,
    monthlyHours: Math.round(monthlyHours * 100) / 100,
    annualHours: Math.round(annualHours * 100) / 100,
    regularWeeklyHours: Math.round(regularWeeklyHours * 100) / 100,
    overtimeWeeklyHours: Math.round(overtimeWeeklyHours * 100) / 100,
  };
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WorkHoursCalculator() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [breakMinutes, setBreakMinutes] = useState(30);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [result, setResult] = useState<WorkHoursResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!startTime) newErrors.startTime = 'Please enter a start time';
    if (!endTime) newErrors.endTime = 'Please enter an end time';
    if (breakMinutes < 0) newErrors.breakMinutes = 'Break time cannot be negative';
    if (breakMinutes > 480) newErrors.breakMinutes = 'Break time seems unrealistically high';
    if (daysPerWeek < 1) newErrors.daysPerWeek = 'At least 1 work day is required';
    if (daysPerWeek > 7) newErrors.daysPerWeek = 'Maximum 7 work days per week';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateWorkHours(startTime, endTime, breakMinutes, daysPerWeek);
    setResult(res);
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  // Generate chart data for weekly projection
  const chartData = useMemo(() => {
    if (!result) return [];
    return DAYS_OF_WEEK.map((day, index) => ({
      day: day.substring(0, 3),
      fullDay: day,
      hours: index < daysPerWeek ? result.totalHoursPerDay : 0,
      regular: index < daysPerWeek ? Math.min(result.totalHoursPerDay, 8) : 0,
      overtime: index < daysPerWeek ? Math.max(0, result.totalHoursPerDay - 8) : 0,
    }));
  }, [result, daysPerWeek]);

  const getBarColor = (hours: number) => {
    if (hours > 10) return '#ef4444'; // red for very long days
    if (hours > 8) return '#f59e0b'; // amber for overtime
    return '#10b981'; // green for regular
  };

  const faqs = [
    {
      question: 'How are work hours calculated?',
      answer: 'Work hours are calculated by subtracting start time from end time, then subtracting break time. For example, working 9:00 AM to 5:30 PM with 30 minutes of breaks equals 8 hours of work (17:30 - 9:00 = 8.5 hours, minus 0.5 hours break = 8 hours). The calculator handles overnight shifts and provides weekly, monthly, and annual projections.'
    },
    {
      question: 'What counts as overtime?',
      answer: 'In most jurisdictions, overtime begins after 8 hours of work per day, though this varies by country and employment type. In the US, the federal standard is 1.5x pay after 40 hours per week, but state laws may differ. Some countries and unions have daily overtime thresholds. Check your local labor laws for specific requirements.'
    },
    {
      question: 'How do I track part-time hours?',
      answer: 'Simply adjust the "Work Days per Week" setting to match your schedule. The calculator will scale all projections accordingly. For example, working 3 days per week at 6 hours each equals 18 hours weekly, which projects to about 78 hours monthly and 936 hours annually.'
    },
    {
      question: 'What is the standard full-time work week?',
      answer: 'In the United States, 40 hours per week (typically 8 hours per day, 5 days per week) is considered standard full-time employment. However, many countries have shorter standard work weeks. Some companies now offer 4-day work weeks as an alternative to traditional 5-day schedules.'
    },
    {
      question: 'How does overtime pay work?',
      answer: 'In the US, non-exempt employees must receive overtime pay at 1.5 times their regular hourly rate for hours worked over 40 per week. Some states require daily overtime (over 8 hours per day). Exempt employees (salaried professionals meeting certain criteria) are not entitled to overtime pay regardless of hours worked.'
    },
    {
      question: 'Should I track my work hours?',
      answer: 'Tracking work hours helps ensure fair compensation, identify workload issues, and manage work-life balance. Even salaried employees may benefit from tracking hours to discuss workload with managers or document overtime for future reference. Many employers have time tracking systems; if yours doesn\'t, consider keeping your own records.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Work Hours Calculator',
        description: 'Calculate your work hours including overtime, weekly totals, and annual projections based on your schedule.',
        url: 'https://www.calculatorpilotai.com/tools/time/work-hours-calculator',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer }
        }))
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.calculatorpilotai.com' },
          { '@type': 'ListItem', position: 2, name: 'Time', item: 'https://www.calculatorpilotai.com/tools/time' },
          { '@type': 'ListItem', position: 3, name: 'Work Hours Calculator', item: 'https://www.calculatorpilotai.com/tools/time/work-hours-calculator' }
        ]
      }
    ]
  };

  return (
    <ToolLayout toolId="work-hours" category="time">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        {/* Calculator Input Section */}
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Your Work Hours</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Start Time */}
            <div className="space-y-2">
              <label htmlFor="wh-start-time" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Clock className="w-4 h-4 inline-block mr-1 mb-0.5" />
                Start Time
              </label>
              <input
                id="wh-start-time"
                type="time"
                value={startTime}
                onChange={(e) => { setStartTime(e.target.value); clearError('startTime'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.startTime ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.startTime && <p className="text-xs text-rose-500">{errors.startTime}</p>}
              <p className="text-xs text-muted-foreground">When your workday begins</p>
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <label htmlFor="wh-end-time" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Clock className="w-4 h-4 inline-block mr-1 mb-0.5" />
                End Time
              </label>
              <input
                id="wh-end-time"
                type="time"
                value={endTime}
                onChange={(e) => { setEndTime(e.target.value); clearError('endTime'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.endTime ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.endTime && <p className="text-xs text-rose-500">{errors.endTime}</p>}
              <p className="text-xs text-muted-foreground">When your workday ends</p>
            </div>

            {/* Break Time */}
            <div className="space-y-2">
              <label htmlFor="wh-break" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Target className="w-4 h-4 inline-block mr-1 mb-0.5" />
                Break Time (minutes)
              </label>
              <input
                id="wh-break"
                type="number"
                min="0"
                max="480"
                step="5"
                value={breakMinutes}
                onChange={(e) => { setBreakMinutes(Number(e.target.value)); clearError('breakMinutes'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.breakMinutes ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.breakMinutes && <p className="text-xs text-rose-500">{errors.breakMinutes}</p>}
              <p className="text-xs text-muted-foreground">Total daily break (lunch, short breaks)</p>
            </div>

            {/* Work Days per Week */}
            <div className="space-y-2">
              <label htmlFor="wh-days" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar className="w-4 h-4 inline-block mr-1 mb-0.5" />
                Work Days per Week
              </label>
              <select
                id="wh-days"
                value={daysPerWeek}
                onChange={(e) => { setDaysPerWeek(Number(e.target.value)); clearError('daysPerWeek'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg ${errors.daysPerWeek ? 'border-rose-500' : 'border-slate-200'}`}
              >
                <option value={1}>1 day</option>
                <option value={2}>2 days</option>
                <option value={3}>3 days</option>
                <option value={4}>4 days</option>
                <option value={5}>5 days</option>
                <option value={6}>6 days</option>
                <option value={7}>7 days</option>
              </select>
              {errors.daysPerWeek && <p className="text-xs text-rose-500">{errors.daysPerWeek}</p>}
              <p className="text-xs text-muted-foreground">Number of work days per week</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wider">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setStartTime('09:00'); setEndTime('17:30'); setBreakMinutes(30); setDaysPerWeek(5); }}
                className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Standard (9-5:30)
              </button>
              <button
                onClick={() => { setStartTime('08:00'); setEndTime('16:30'); setBreakMinutes(30); setDaysPerWeek(5); }}
                className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Early Shift (8-4:30)
              </button>
              <button
                onClick={() => { setStartTime('10:00'); setEndTime('18:30'); setBreakMinutes(30); setDaysPerWeek(5); }}
                className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Late Start (10-6:30)
              </button>
              <button
                onClick={() => { setStartTime('09:00'); setEndTime('17:00'); setBreakMinutes(60); setDaysPerWeek(5); }}
                className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Long Lunch (9-5)
              </button>
              <button
                onClick={() => { setStartTime('06:00'); setEndTime('14:00'); setBreakMinutes(30); setDaysPerWeek(4); }}
                className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                4x10 (6am-2pm)
              </button>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-6 w-full sm:w-auto sm:px-12 bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-wider focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Work Hours
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 md:p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl text-center">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Hours per Day</span>
                <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-emerald-700 tabular-nums leading-tight">
                  {result.totalHoursPerDay.toFixed(2)}
                </div>
              </div>
              <div className="p-4 md:p-5 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Overtime / Day</span>
                <div className={`text-lg md:text-xl lg:text-2xl font-mono font-bold tabular-nums leading-tight ${result.overtimeHoursPerDay > 0 ? 'text-amber-700' : 'text-slate-500'}`}>
                  {result.overtimeHoursPerDay.toFixed(2)}
                </div>
              </div>
              <div className="p-4 md:p-5 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">Weekly Hours</span>
                <div className={`text-lg md:text-xl lg:text-2xl font-mono font-bold tabular-nums leading-tight ${result.weeklyHours > 40 ? 'text-blue-700' : 'text-slate-700'}`}>
                  {result.weeklyHours.toFixed(2)}
                </div>
              </div>
              <div className="p-4 md:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Monthly Hours</span>
                <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-slate-700 tabular-nums leading-tight">
                  {result.monthlyHours.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Extended Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Annual Hours</span>
                    <div className="text-2xl font-mono font-bold text-slate-800">{result.annualHours.toFixed(0)}</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-3 pt-3 border-t border-slate-100">
                  <span className="text-muted-foreground">Regular Hours</span>
                  <span className="font-mono font-semibold text-emerald-600">{(result.regularWeeklyHours * 52).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Overtime Hours</span>
                  <span className={`font-mono font-semibold ${result.overtimeWeeklyHours > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {(result.overtimeWeeklyHours * 52).toFixed(0)}
                  </span>
                </div>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Weekly Breakdown</span>
                    <div className="text-2xl font-mono font-bold text-slate-800">{result.weeklyHours.toFixed(1)}h</div>
                  </div>
                </div>
                <div className="flex justify-between text-sm mt-3 pt-3 border-t border-slate-100">
                  <span className="text-muted-foreground">Regular (40h target)</span>
                  <span className="font-mono font-semibold text-emerald-600">{result.regularWeeklyHours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Overtime</span>
                  <span className={`font-mono font-semibold ${result.overtimeWeeklyHours > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                    {result.overtimeWeeklyHours.toFixed(1)}h
                  </span>
                </div>
              </div>
            </div>

            {/* Weekly Hours Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Weekly Work Hours Projection
              </h3>
              <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11 }}
                      label={{ value: 'Day of Week', position: 'insideBottom', offset: -2 }}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: number) => `${v}h`}
                      width={40}
                      domain={[0, 12]}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [`${value.toFixed(1)}h`, name === 'hours' ? 'Total Hours' : name === 'regular' ? 'Regular' : 'Overtime']}
                      labelFormatter={(label) => chartData.find(d => d.day === label)?.fullDay || label}
                      contentStyle={{ fontSize: 12 }}
                    />
                    <ReferenceLine y={8} stroke="#94a3b8" strokeDasharray="5 5" label={{ value: '8h target', position: 'right', fontSize: 10 }} />
                    <ReferenceLine y={40 / daysPerWeek} stroke="#64748b" strokeDasharray="3 3" label={{ value: 'Weekly avg', position: 'right', fontSize: 10 }} />
                    <Bar dataKey="hours" name="Total Hours" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry.hours)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                  <span className="text-muted-foreground">Regular (8h or less)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-amber-500"></div>
                  <span className="text-muted-foreground">Overtime (8-10h)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                  <span className="text-muted-foreground">Excessive (&gt;10h)</span>
                </div>
              </div>
            </div>

            {/* Overtime Warning */}
            {result.overtimeHoursPerDay > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-bold">!</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Overtime Hours Detected</h4>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      Your schedule includes <strong>{result.overtimeHoursPerDay.toFixed(2)} hours of overtime per day</strong>.
                      This adds up to <strong>{result.overtimeWeeklyHours.toFixed(1)} hours weekly</strong>, which may impact work-life balance and productivity.
                      {result.overtimeWeeklyHours > 10 && ' Consider discussing workload management with your supervisor.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Efficiency Summary */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4">Schedule Summary</h3>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8">
                <div className="text-center min-w-[80px]">
                  <div className="text-2xl md:text-3xl font-mono font-bold text-slate-700">{startTime}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">Start</div>
                </div>
                <div className="text-slate-300 hidden sm:block">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="text-center min-w-[80px]">
                  <div className="text-2xl md:text-3xl font-mono font-bold text-slate-700">{endTime}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">End</div>
                </div>
                <div className="text-slate-300 hidden sm:block">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <div className="text-center min-w-[80px]">
                  <div className="text-2xl md:text-3xl font-mono font-bold text-amber-600">-{breakMinutes}m</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">Breaks</div>
                </div>
                <div className="text-slate-300 hidden sm:block">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="text-center min-w-[80px]">
                  <div className="text-2xl md:text-3xl font-mono font-bold text-emerald-600">{result.totalHoursPerDay.toFixed(1)}h</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">Net Hours</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 text-center text-sm text-muted-foreground">
                {daysPerWeek} work days = <span className="font-mono font-bold text-primary">{result.weeklyHours.toFixed(1)} hours/week</span> = <span className="font-mono font-bold">{result.annualHours.toFixed(0)} hours/year</span>
              </div>
            </div>

            {/* Related Tools */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-bold mb-4">Explore More Time Calculators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Link
                  to="/tools/time/age-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Age Calculator</span>
                </Link>
                <Link
                  to="/tools/time/date-difference-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Date Difference</span>
                </Link>
                <Link
                  to="/tools/time/business-days-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Business Days</span>
                </Link>
                <Link
                  to="/tools/time/countdown-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Countdown</span>
                </Link>
                <Link
                  to="/tools/time/time-duration-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Time Duration</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Work Hours Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Work Hours Calculator helps you track and project your work schedule. It calculates daily hours, overtime, and provides weekly, monthly, and annual hour projections. Use it to verify timesheets, plan schedules, or understand your work-life balance.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                Enter your start time, end time, total break duration, and number of work days per week. The calculator subtracts breaks from gross hours to find net work hours. It then calculates overtime (hours over 8 per day), weekly totals, and projects these to monthly and annual figures.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Hours per Day:</strong> Net work hours after breaks.</li>
                <li><strong>Overtime:</strong> Hours exceeding 8 per day.</li>
                <li><strong>Weekly/Monthly/Annual:</strong> Projected totals.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Forgetting to include all breaks:</strong> Include lunch, short breaks, and any other non-work time.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Track consistently</strong> to identify patterns in your work-life balance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
                <p className="text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}