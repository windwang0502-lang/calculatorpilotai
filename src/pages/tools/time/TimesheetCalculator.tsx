import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateTimesheet, type TimesheetResult } from '@/lib/engines';
import { formatCurrency, validateNumberInput } from '@/lib/utils';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function TimesheetCalculator() {
  const [hoursPerDay, setHoursPerDay] = useState<string[]>(['8', '8', '8', '8', '8', '0', '0']);
  const [hourlyRate, setHourlyRate] = useState(25);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState(1.5);
  const [standardWorkWeek, setStandardWorkWeek] = useState(40);
  const [result, setResult] = useState<TimesheetResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleHoursChange = (index: number, value: string) => {
    const newHours = [...hoursPerDay];
    newHours[index] = value;
    setHoursPerDay(newHours);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (hourlyRate <= 0) newErrors.hourlyRate = 'Hourly rate must be greater than 0';
    if (hourlyRate > 1000) newErrors.hourlyRate = 'Hourly rate seems unrealistically high';
    if (overtimeMultiplier < 1) newErrors.overtimeMultiplier = 'Overtime multiplier must be at least 1';
    if (standardWorkWeek <= 0) newErrors.standardWorkWeek = 'Standard work week must be at least 1 hour';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const hours = hoursPerDay.map(h => parseFloat(h) || 0);
    const res = calculateTimesheet(hours, hourlyRate, 0, overtimeMultiplier, standardWorkWeek);
    setResult(res);
  };

  const totalHours = hoursPerDay.reduce((sum, h) => sum + (parseFloat(h) || 0), 0);
  const isWeekendDay = (index: number) => index >= 5;

  const faqs = [
    {
      question: 'How is overtime calculated?',
      answer: 'Overtime is calculated based on hours worked beyond your standard work week threshold (default 40 hours). For example, if you work 50 hours in a week, 40 hours are paid at your regular rate, and 10 hours are paid at the overtime rate (typically 1.5x your regular hourly rate).'
    },
    {
      question: 'What is time-and-a-half?',
      answer: 'Time-and-a-half is the standard overtime rate, meaning you earn 1.5 times your regular hourly wage for overtime hours. For a $25/hour employee, overtime would be paid at $37.50/hour. Some employers offer double-time (2x) for certain situations like holidays or hours beyond a certain threshold.'
    },
    {
      question: 'Are my timesheet calculations saved?',
      answer: 'No, this calculator provides estimates only and does not save any data. For official record-keeping, use your employer\'s designated time-tracking system or export your calculations regularly. Always keep personal records of hours worked.'
    },
    {
      question: 'What about unpaid breaks?',
      answer: 'This calculator assumes all entered hours are billable working hours. If you take unpaid breaks, subtract them from your total hours. For example, if you work 9 hours but take 30 minutes unpaid, enter 8.5 hours or 8 hours 30 minutes.'
    },
    {
      question: 'Can I use this for salaried employees?',
      answer: 'This calculator is designed for hourly employees. For salaried employees, you can estimate equivalent hourly value by dividing annual salary by work hours. However, salaried employees typically don\'t receive overtime regardless of hours worked.'
    },
    {
      question: 'What if I work different overtime rules?',
      answer: 'Some roles have different overtime thresholds (like 8 hours per day) or multipliers (double-time for weekends). Adjust the standard work week and overtime multiplier fields to match your specific employment agreement or collective bargaining rules.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Timesheet Calculator',
        description: 'Calculate your weekly work hours, overtime pay, and total earnings. Perfect for hourly employees tracking their time.',
        url: 'https://www.calculatorpilotai.com/tools/time/timesheet-calculator',
        applicationCategory: 'BusinessApplication',
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
      }
    ]
  };

  const relatedTools = [
    { name: 'Work Hours Calculator', path: '/tools/time/work-hours-calculator', desc: 'Calculate work hours between dates' },
    { name: 'Date Difference Calculator', path: '/tools/time/date-difference-calculator', desc: 'Calculate days between dates' },
    { name: 'Salary Calculator', path: '/tools/finance/salary-to-hourly-calculator', desc: 'Convert salary to hourly rate' },
  ];

  return (
    <ToolLayout toolId="timesheet" category="time">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Timesheet Calculator</h2>

          <div className="mb-6">
            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground block mb-3">Hours Per Day</label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {hoursPerDay.map((hours, index) => (
                <div key={index} className={`space-y-1 ${isWeekendDay(index) ? 'opacity-75' : ''}`}>
                  <label className="text-xs font-medium text-slate-500 block">{DAYS[index].slice(0, 3)}</label>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    value={hours}
                    onChange={(e) => handleHoursChange(index, e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-center"
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between items-center text-sm">
              <span className="text-slate-500">Total Hours:</span>
              <span className={`font-mono font-bold ${totalHours > standardWorkWeek ? 'text-amber-600' : 'text-emerald-600'}`}>
                {totalHours.toFixed(1)} hrs
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="hourly-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hourly Rate ($)</label>
              <input
                id="hourly-rate"
                type="number"
                min="0"
                step="0.25"
                value={hourlyRate}
                onChange={(e) => { setHourlyRate(validateNumberInput(e.target.value, { min: 0 })); setErrors(prev => { const n = { ...prev }; delete n.hourlyRate; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.hourlyRate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.hourlyRate && <p className="text-xs text-rose-500">{errors.hourlyRate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="overtime-mult" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">OT Multiplier</label>
              <select
                id="overtime-mult"
                value={overtimeMultiplier}
                onChange={(e) => setOvertimeMultiplier(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value={1.5}>1.5x (Time &amp; Half)</option>
                <option value={2}>2x (Double Time)</option>
                <option value={1}>1x (No OT)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="std-week" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Std. Work Week (hrs)</label>
              <input
                id="std-week"
                type="number"
                min="1"
                max="60"
                step="1"
                value={standardWorkWeek}
                onChange={(e) => { setStandardWorkWeek(validateNumberInput(e.target.value, { min: 1, max: 60 })); setErrors(prev => { const n = { ...prev }; delete n.standardWorkWeek; return n; }); }}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg"
              />
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Pay
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 border border-primary/20 rounded-xl">
              <div className="text-center">
                <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground block mb-2">Total Weekly Pay</span>
                <div className="font-mono font-bold text-5xl text-primary tabular-nums leading-tight tracking-tight">
                  {formatCurrency(result.totalPay)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Regular Hours</span>
                <span className="font-mono font-bold text-2xl">{result.regularHours.toFixed(1)}</span>
              </div>
              <div className={`p-6 border rounded-xl text-center ${result.overtimeHours > 0 ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">OT Hours</span>
                <span className={`font-mono font-bold text-2xl ${result.overtimeHours > 0 ? 'text-amber-600' : ''}`}>{result.overtimeHours.toFixed(1)}</span>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Regular Pay</span>
                <span className="font-mono font-bold text-2xl">{formatCurrency(result.regularPay)}</span>
              </div>
              <div className={`p-6 border rounded-xl text-center ${result.overtimePay > 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">OT Pay</span>
                <span className={`font-mono font-bold text-2xl ${result.overtimePay > 0 ? 'text-emerald-600' : ''}`}>{formatCurrency(result.overtimePay)}</span>
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Daily Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-2 font-semibold">Day</th>
                      <th className="text-right py-3 px-2 font-semibold">Hours</th>
                      <th className="text-right py-3 px-2 font-semibold">Regular</th>
                      <th className="text-right py-3 px-2 font-semibold">Overtime</th>
                      <th className="text-right py-3 px-2 font-semibold">Pay</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.dailyBreakdown.map((day, index) => {
                      const hours = parseFloat(hoursPerDay[index]) || 0;
                      let regularHours = 0;
                      let overtimeHours = 0;
                      let prevTotalHours = 0;

                      for (let i = 0; i < index; i++) {
                        prevTotalHours += parseFloat(hoursPerDay[i]) || 0;
                      }

                      if (prevTotalHours < standardWorkWeek) {
                        regularHours = Math.min(hours, standardWorkWeek - prevTotalHours);
                        overtimeHours = Math.max(0, hours - regularHours);
                      } else {
                        regularHours = 0;
                        overtimeHours = hours;
                      }

                      const regularPay = regularHours * hourlyRate;
                      const overtimePay = overtimeHours * hourlyRate * overtimeMultiplier;

                      return (
                        <tr key={index} className={`border-b border-slate-100 last:border-0 ${isWeekendDay(index) ? 'bg-slate-50/50' : ''}`}>
                          <td className="py-3 px-2 font-medium">{day.day}</td>
                          <td className="py-3 px-2 text-right font-mono tabular-nums">{day.hours.toFixed(1)}</td>
                          <td className="py-3 px-2 text-right font-mono tabular-nums text-emerald-600">
                            {regularHours.toFixed(1)} hrs
                          </td>
                          <td className={`py-3 px-2 text-right font-mono tabular-nums ${overtimeHours > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
                            {overtimeHours.toFixed(1)} hrs
                          </td>
                          <td className="py-3 px-2 text-right font-mono font-semibold tabular-nums">
                            {formatCurrency(regularPay + overtimePay)}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-100 font-bold">
                      <td className="py-3 px-2">Total</td>
                      <td className="py-3 px-2 text-right font-mono tabular-nums">{result.totalHours.toFixed(1)}</td>
                      <td className="py-3 px-2 text-right font-mono tabular-nums">{result.regularHours.toFixed(1)} hrs</td>
                      <td className="py-3 px-2 text-right font-mono tabular-nums">{result.overtimeHours.toFixed(1)} hrs</td>
                      <td className="py-3 px-2 text-right font-mono tabular-nums">{formatCurrency(result.totalPay)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h3 className="text-lg font-bold mb-4">Hourly Equivalent</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Effective Hourly Rate</span>
                  <span className="font-mono font-bold text-2xl">{formatCurrency(result.totalPay / result.totalHours)}</span>
                  <span className="text-sm text-slate-500">/hour</span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg text-center">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">Effective OT Rate</span>
                  <span className="font-mono font-bold text-2xl text-emerald-600">{formatCurrency(hourlyRate * overtimeMultiplier)}</span>
                  <span className="text-sm text-emerald-500">/hour</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Overtime Pay</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">FLSA Overtime Requirements</h3>
              <p className="text-slate-700 leading-relaxed">
                Under the Fair Labor Standards Act (FLSA), non-exempt employees must be paid overtime at a rate of at least 1.5 times their regular rate for any hours worked over 40 in a workweek. Some states have additional requirements, such as daily overtime thresholds.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Types of Overtime</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Time-and-a-half (1.5x):</strong> Standard overtime rate, most common</li>
                <li><strong>Double-time (2x):</strong> Often paid for hours beyond 12 per day or on holidays</li>
                <li><strong>Daily overtime:</strong> Some states require OT for 8+ hours in a single day</li>
                <li><strong>Weekend/holiday premiums:</strong> Additional pay for working non-standard hours</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Tracking Best Practices</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Record all hours worked, including early arrivals and late stays</li>
                <li>Note meal breaks separately from work time</li>
                <li>Keep personal records in addition to employer records</li>
                <li>Review pay stubs against your calculations regularly</li>
                <li>Report any discrepancies to HR or payroll immediately</li>
              </ul>
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

      {/* Related Tools */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Time & Finance Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool, index) => (
              <Link key={index} to={tool.path} className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-slate-400 text-sm">{tool.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
