import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateAgeAtDate, AgeAtDateResult } from '@/lib/engines/ageAtDateEngine';

export default function AgeAtDateCalculator() {
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<AgeAtDateResult | null>(null);
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
    const res = calculateAgeAtDate(new Date(birthDate), new Date(targetDate));
    setResult(res);
  };

  const getLifeStage = (years: number): string => {
    if (years < 0) return 'Not yet born';
    if (years < 2) return 'Infant / Toddler';
    if (years < 5) return 'Early Childhood';
    if (years < 12) return 'Middle Childhood';
    if (years < 18) return 'Adolescence';
    if (years < 25) return 'Young Adulthood';
    if (years < 40) return 'Early Adulthood';
    if (years < 60) return 'Middle Adulthood';
    if (years < 80) return 'Late Adulthood';
    return 'Senior';
  };

  const getMilestoneInfo = (years: number): string[] => {
    if (years >= 18) return ['Legal adulthood reached', 'Can vote and sign contracts'];
    if (years >= 21) return ['Full legal adulthood', 'Full alcohol consumption age'];
    if (years >= 65) return ['Traditional retirement age', 'Medicare eligibility in US'];
    return [];
  };

  const faqs = [
    { question: 'What is age-at-date used for?', answer: 'It helps determine exact age on a specific date for legal, eligibility, or planning purposes.' },
    { question: 'Can I use future dates?', answer: 'Yes. You can calculate projected age for any future reference date.' },
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'SoftwareApplication', name: 'Age At Date Calculator', description: 'Calculate exact age on any reference date.', url: 'https://www.calculatorpilotai.com/tools/time/age-at-date-calculator', applicationCategory: 'UtilityApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
      { '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
    ],
  };

  const relatedTools = [
    { name: 'Age Calculator', path: '/tools/time/age-calculator', desc: 'Current age and total elapsed time' },
    { name: 'Date Difference Calculator', path: '/tools/time/date-difference-calculator', desc: 'Difference between two dates' },
    { name: 'Countdown Calculator', path: '/tools/time/countdown-calculator', desc: 'Future date countdown' },
  ];

  return (
    <ToolLayout toolId="age-at-date" category="time">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Age at Any Date</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Birth Date</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  setErrors(prev => { const n = { ...prev }; delete n.birthDate; return n; });
                }}
                className={`w-full p-3 border rounded outline-none focus:ring-2 focus:ring-primary ${errors.birthDate ? 'border-rose-500' : ''}`}
              />
              {errors.birthDate && <p className="text-xs text-rose-500">{errors.birthDate}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Reference Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => {
                  setTargetDate(e.target.value);
                  setErrors(prev => { const n = { ...prev }; delete n.targetDate; return n; });
                }}
                className={`w-full p-3 border rounded outline-none focus:ring-2 focus:ring-primary ${errors.targetDate ? 'border-rose-500' : ''}`}
              />
              {errors.targetDate && <p className="text-xs text-rose-500">{errors.targetDate}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest"
          >
            Calculate Age
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border rounded-lg text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Age on {new Date(targetDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <div className="text-5xl font-mono font-bold">
                {result.years} <span className="text-xl font-normal text-muted-foreground">years</span>
                <span className="text-2xl">, </span>
                {result.months} <span className="text-lg font-normal text-muted-foreground">months</span>
                <span className="text-2xl">, </span>
                {result.days} <span className="text-lg font-normal text-muted-foreground">days</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Life Stage</span>
                <div className="text-xl font-bold text-primary">{getLifeStage(result.years)}</div>
              </div>
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Zodiac Sign</span>
                <div className="text-xl font-bold">{result.zodiacSign}</div>
              </div>
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Days</span>
                <div className="text-2xl font-mono font-bold">{result.totalDays.toLocaleString()}</div>
              </div>
              <div className="p-6 bg-white border rounded-lg text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Months</span>
                <div className="text-2xl font-mono font-bold">{result.totalMonths.toLocaleString()}</div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Time Lived Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">In Weeks</span>
                  <span className="text-xl font-mono font-bold">{result.ageInWeeks.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">In Hours</span>
                  <span className="text-xl font-mono font-bold">{result.ageInHours.toLocaleString()}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-1">In Minutes</span>
                  <span className="text-xl font-mono font-bold">{result.ageInMinutes.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-100 rounded-lg p-6">
              <h3 className="font-bold text-green-800 mb-3">Next Birthday</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-1">Date</span>
                  <span className="text-lg font-mono">
                    {result.nextBirthday.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-green-600 uppercase tracking-widest block mb-1">Days Until</span>
                  <span className="text-lg font-mono font-bold">{result.nextBirthday.daysUntil}</span>
                </div>
              </div>
            </div>

            {getMilestoneInfo(result.years).length > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
                <h3 className="font-bold text-blue-800 mb-3">Milestones Reached</h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  {getMilestoneInfo(result.years).map((milestone, i) => (
                    <li key={i} className="flex gap-2"><span className="text-blue-500">✓</span> {milestone}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-bold text-lg mb-4">Fun Facts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-slate-50 rounded">
                  <span className="font-semibold">Birth year:</span> {new Date(birthDate).getFullYear()}
                </div>
                <div className="p-4 bg-slate-50 rounded">
                  <span className="font-semibold">Age at year start:</span> {result.years - (new Date(targetDate).getMonth() < new Date(birthDate).getMonth() ? 1 : 0)} years old
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <section className="py-12 bg-slate-50"><div className="max-w-3xl mx-auto space-y-6"><h2 className="text-3xl font-bold text-center">How to Use the Age At Date Calculator</h2><p className="text-slate-700">Enter birth date and a reference date to calculate exact age and milestone context.</p><div className="bg-white border border-slate-200 rounded-lg p-4"><h3 className="font-bold mb-2">Results Interpretation</h3><p className="text-slate-700">Use exact years/months/days for eligibility and compliance checks.</p></div></div></section>
      <section className="py-12"><div className="max-w-3xl mx-auto"><h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2><div className="space-y-4">{faqs.map((faq, i) => <div key={i} className="bg-white border border-slate-200 rounded-lg p-6"><h3 className="font-bold text-lg mb-2">{faq.question}</h3><p className="text-slate-700">{faq.answer}</p></div>)}</div></div></section>
      <section className="py-12 bg-slate-900 text-white"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-bold mb-8 text-center">Related Time Tools</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{relatedTools.map((tool, i) => <a key={i} href={tool.path} className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"><h3 className="font-bold text-lg mb-2">{tool.name}</h3><p className="text-slate-400 text-sm">{tool.desc}</p></a>)}</div></div></section>
    </ToolLayout>
  );
}
