import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateAge, AgeResult } from '@/lib/engines';
import { generateAgeInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';
import { formatNumber, getResultTextSize } from '@/lib/utils';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<AgeResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (isNaN(birth.getTime())) newErrors.birthDate = 'Please enter a valid birth date';
    if (isNaN(target.getTime())) newErrors.targetDate = 'Please enter a valid target date';
    if (birth > target) newErrors.targetDate = 'Target date must be after birth date';
    if (target.getFullYear() - birth.getFullYear() > 200) newErrors.targetDate = 'Date range seems unrealistic';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateAge(new Date(birthDate), new Date(targetDate));
    setResult(res);
    setInsight(generateAgeInsight(res.years));
  };

  const faqs = [
    { question: 'How is age calculated?', answer: 'Age is calculated by comparing birth date and target date across years, months, and days, accounting for month lengths and leap years.' },
    { question: 'Can I calculate age at a past or future date?', answer: 'Yes. Set any target date to see exact age on that day.' },
    { question: 'Is this accurate for leap years?', answer: 'Yes. Calendar differences include leap days where applicable.' },
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Age Calculator',
        description: 'Calculate exact age between birth date and target date in years, months, and days.',
        url: 'https://www.calculatorpilotai.com/tools/time/age-calculator',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
      },
    ],
  };

  const relatedTools = [
    { name: 'Age At Date Calculator', path: '/tools/time/age-at-date-calculator', desc: 'Age on any reference date' },
    { name: 'Date Difference Calculator', path: '/tools/time/date-difference-calculator', desc: 'Difference between two dates' },
    { name: 'Countdown Calculator', path: '/tools/time/countdown-calculator', desc: 'Time remaining to a target date' },
  ];

  return (
    <ToolLayout toolId="age" category="time">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Age & Date Difference Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="birth-date" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Birth Date</label>
              <input
                id="birth-date"
                type="date"
                value={birthDate}
                onChange={(e) => { setBirthDate(e.target.value); setErrors(prev => { const n = { ...prev }; delete n.birthDate; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.birthDate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.birthDate && <p className="text-xs text-rose-500">{errors.birthDate}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="target-date" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Target Date</label>
              <input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => { setTargetDate(e.target.value); setErrors(prev => { const n = { ...prev }; delete n.targetDate; return n; }); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.targetDate ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.targetDate && <p className="text-xs text-rose-500">{errors.targetDate}</p>}
            </div>
          </div>
          <button onClick={handleCalculate} className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2">
            Calculate Age
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Age</span>
                <div className={`${getResultTextSize(String(result.years))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.years)} Years</div>
                <div className="text-sm text-muted-foreground mt-1">{result.months} Months, {result.days} Days</div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center sm:col-span-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Time Elapsed</span>
                <div className={`${getResultTextSize(formatNumber(result.totalDays))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.totalDays)} Days</div>
                <div className="text-sm text-muted-foreground mt-1">~{formatNumber(result.totalDays / 7, { decimals: 1 })} Weeks / ~{formatNumber(result.totalDays / 30.44, { decimals: 1 })} Months</div>
              </div>
            </div>
            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-center">How to Use the Age Calculator</h2>
          <p className="text-slate-700">Enter birth date and target date, then calculate. The tool returns exact years, months, days, and total elapsed days.</p>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">Formula Explanation</h3>
            <p className="text-slate-700">Calendar age is computed by date component subtraction with borrow/carry adjustments across month/day boundaries.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">Results Interpretation</h3>
            <p className="text-slate-700">Use years-months-days for legal/personal contexts and total days for analytics/tracking.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <h3 className="font-bold mb-2">Common Mistakes</h3>
            <p className="text-slate-700">Avoid swapping dates; target date must be after birth date.</p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">{faqs.map((faq, i) => <div key={i} className="bg-white border border-slate-200 rounded-lg p-6"><h3 className="font-bold text-lg mb-2">{faq.question}</h3><p className="text-slate-700">{faq.answer}</p></div>)}</div>
        </div>
      </section>

      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Time Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{relatedTools.map((tool, i) => <a key={i} href={tool.path} className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><h3 className="font-bold text-lg mb-2">{tool.name}</h3><p className="text-slate-400 text-sm">{tool.desc}</p></a>)}</div>
        </div>
      </section>
    </ToolLayout>
  );
}
