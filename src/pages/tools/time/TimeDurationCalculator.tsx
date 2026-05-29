import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateTimeDuration, convertTimeUnits, TimeDurationResult } from '@/lib/engines/timeDurationEngine';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function TimeDurationCalculator() {
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [operation, setOperation] = useState<'add' | 'subtract'>('add');
  const [result, setResult] = useState<TimeDurationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const base = new Date(baseDate);
    if (isNaN(base.getTime())) newErrors.baseDate = 'Please enter a valid base date';
    if (days < 0) newErrors.days = 'Days cannot be negative';
    if (hours < 0 || hours > 23) newErrors.hours = 'Hours must be between 0 and 23';
    if (minutes < 0 || minutes > 59) newErrors.minutes = 'Minutes must be between 0 and 59';
    if (seconds < 0 || seconds > 59) newErrors.seconds = 'Seconds must be between 0 and 59';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateTimeDuration(
      new Date(baseDate),
      { days, hours, minutes, seconds },
      operation
    );
    setResult(res);
  };

  const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
  const converted = convertTimeUnits(totalSeconds);

  const faqs = [
    {
      question: 'How do I add or subtract time from a date?',
      answer: 'Simply enter your base date and specify how many days, hours, minutes, and seconds to add or subtract. The calculator will instantly show you the resulting date and time, including the day of week, total days from now, and various time unit conversions. This is useful for project deadlines, event planning, or tracking time intervals.'
    },
    {
      question: 'Can I use this for business day calculations?',
      answer: 'This calculator adds calendar days, not business days. For business day calculations that exclude weekends and holidays, use our dedicated Business Days Calculator. However, this Time Duration Calculator is perfect for adding any combination of days, hours, minutes, and seconds to a date.'
    },
    {
      question: 'How accurate is the day of week calculation?',
      answer: 'The calculator uses JavaScript\'s Date object, which accurately handles calendar calculations including leap years and daylight saving time transitions. The day of week is calculated in the local timezone of the user\'s browser, ensuring consistent results.'
    },
    {
      question: 'What is the ISO format shown in results?',
      answer: 'The ISO format (e.g., 2024-01-15T09:30:00.000Z) is an international standard for date and time representation. It shows the exact timestamp in Coordinated Universal Time (UTC). This format is commonly used in computing, databases, and when sharing timestamps across different time zones.'
    },
    {
      question: 'Can I calculate past dates?',
      answer: 'Yes, simply use the "Subtract Time" operation to find dates in the past. Enter your current date and subtract the number of days, hours, etc. to calculate when something occurred. For example, subtract 30 days from today to find the date 30 days ago.'
    },
    {
      question: 'What if I need to calculate time across multiple months?',
      answer: 'The calculator handles time spans across months and years automatically. It accounts for varying month lengths and leap years. The time conversion breakdown shows your duration expressed in years, months, weeks, and days for easy understanding.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Time Duration Calculator',
        description: 'Add or subtract time (days, hours, minutes, seconds) from any date to calculate resulting dates.',
        url: 'https://www.calculatorpilotai.com/tools/time/time-duration-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Time Duration Calculator', item: 'https://www.calculatorpilotai.com/tools/time/time-duration-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Date Difference Calculator', path: '/tools/time/date-difference-calculator', desc: 'Calculate days between two dates' },
    { name: 'Business Days Calculator', path: '/tools/time/business-days-calculator', desc: 'Calculate working days excluding weekends' },
    { name: 'Age Calculator', path: '/tools/time/age-calculator', desc: 'Calculate exact age in years, months, days' },
  ];

  return (
    <ToolLayout toolId="time-duration" category="time">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Add or Subtract Time</h2>

          <div className="mb-6">
            <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 block">Operation</label>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className={`flex items-center gap-2 cursor-pointer px-6 py-3 rounded-lg border transition-colors ${operation === 'add' ? 'bg-green-50 border-green-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input
                  type="radio"
                  checked={operation === 'add'}
                  onChange={() => setOperation('add')}
                  className="w-4 h-4"
                />
                <span className="font-medium">Add Time</span>
              </label>
              <label className={`flex items-center gap-2 cursor-pointer px-6 py-3 rounded-lg border transition-colors ${operation === 'subtract' ? 'bg-red-50 border-red-200' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input
                  type="radio"
                  checked={operation === 'subtract'}
                  onChange={() => setOperation('subtract')}
                  className="w-4 h-4"
                />
                <span className="font-medium">Subtract Time</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="time-base-date" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Base Date</label>
              <input
                id="time-base-date"
                type="date"
                value={baseDate}
                onChange={(e) => {
                  setBaseDate(e.target.value);
                  setErrors(prev => { const n = { ...prev }; delete n.baseDate; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.baseDate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.baseDate && <p className="text-xs text-rose-500">{errors.baseDate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="time-days" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Days</label>
              <input
                id="time-days"
                type="number"
                min="0"
                step="1"
                value={days}
                onChange={(e) => {
                  setDays(validateNumberInput(Number(e.target.value), { min: 0 }));
                  setErrors(prev => { const n = { ...prev }; delete n.days; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.days ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.days && <p className="text-xs text-rose-500">{errors.days}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="time-hours" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hours (0-23)</label>
              <input
                id="time-hours"
                type="number"
                min="0"
                max="23"
                step="1"
                value={hours}
                onChange={(e) => {
                  setHours(validateNumberInput(Number(e.target.value), { min: 0, max: 23 }));
                  setErrors(prev => { const n = { ...prev }; delete n.hours; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.hours ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.hours && <p className="text-xs text-rose-500">{errors.hours}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="time-minutes" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Minutes (0-59)</label>
              <input
                id="time-minutes"
                type="number"
                min="0"
                max="59"
                step="1"
                value={minutes}
                onChange={(e) => {
                  setMinutes(validateNumberInput(Number(e.target.value), { min: 0, max: 59 }));
                  setErrors(prev => { const n = { ...prev }; delete n.minutes; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.minutes ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.minutes && <p className="text-xs text-rose-500">{errors.minutes}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="time-seconds" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Seconds (0-59)</label>
              <input
                id="time-seconds"
                type="number"
                min="0"
                max="59"
                step="1"
                value={seconds}
                onChange={(e) => {
                  setSeconds(validateNumberInput(Number(e.target.value), { min: 0, max: 59 }));
                  setErrors(prev => { const n = { ...prev }; delete n.seconds; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.seconds ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.seconds && <p className="text-xs text-rose-500">{errors.seconds}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Result
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Resulting Date & Time</span>
              <div className={`${getResultTextSize(result.resultDateString)} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{result.resultDateString}</div>
              <div className={`${getResultTextSize(result.resultTimeString)} font-mono text-primary mt-2 tabular-nums leading-tight tracking-tight`}>{result.resultTimeString}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Day of Week</span>
                <div className="text-2xl font-bold">{result.dayOfWeek}</div>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Days from Now</span>
                <div className={`${getResultTextSize(String(result.daysFromNow))} font-mono font-bold tabular-nums leading-tight tracking-tight ${result.daysFromNow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.daysFromNow >= 0 ? '+' : ''}{formatNumber(result.daysFromNow)}
                </div>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">ISO Format</span>
                <div className="text-lg font-mono break-all">{result.resultDate.toISOString()}</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Time Conversion Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Years</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(converted.years)}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Months</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(converted.months)}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Weeks</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(converted.weeks)}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg text-center">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">Days</span>
                  <span className="text-xl font-mono font-bold tabular-nums">{formatNumber(converted.days)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-3">Input Summary</h3>
              <p className="text-blue-700">
                {operation === 'add' ? 'Adding' : 'Subtracting'}: {formatNumber(days)} days, {formatNumber(hours)} hours, {formatNumber(minutes)} minutes, {formatNumber(seconds)} seconds
                {operation === 'add' ? ' to' : ' from'} {new Date(baseDate).toLocaleDateString()}
              </p>
              <p className="text-blue-700 mt-2 text-sm">
                Total: {formatNumber(converted.totalSeconds)} seconds
              </p>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Time Duration Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Time Duration Calculator adds or subtracts time periods from any date. Whether you need to find a deadline 45 days from now, calculate when something happened 3 weeks ago, or plan events months in advance, this tool provides instant, accurate results with multiple time unit breakdowns.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                Enter your starting date and specify the time duration in days, hours, minutes, and seconds. Choose whether to add or subtract this duration. The calculator converts everything to seconds, performs the arithmetic, and converts back to display the resulting date with full time unit breakdowns.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Use Cases</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Project deadline planning</li>
                <li>Subscription or contract renewal dates</li>
                <li>Event scheduling</li>
                <li>Historical date calculations</li>
                <li>Countdown to special occasions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Forgetting timezone differences:</strong> The base date is calculated in your local timezone.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Use for calendar days</strong> — for business days, use the Business Days Calculator.</p>
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

      {/* Related Tools */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Time Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool, index) => (
              <a key={index} href={tool.path} className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <h3 className="font-bold text-lg mb-2">{tool.name}</h3>
                <p className="text-slate-400 text-sm">{tool.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
