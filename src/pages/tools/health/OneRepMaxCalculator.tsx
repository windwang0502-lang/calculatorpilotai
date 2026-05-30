import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

interface OneRMResult {
  brzycki: number;
  epley: number;
  lander: number;
  lombardi: number;
  average: number;
  percentages: { percent: number; weight: number }[];
}

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState(100);
  const [reps, setReps] = useState(5);
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [result, setResult] = useState<OneRMResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weightDisplay = unit === 'kg' ? weight : Math.round(weight * 2.20462 * 10) / 10;
  const weightFromDisplay = (val: number) => unit === 'kg' ? val : val / 2.20462;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (weight <= 0 || weight > 1000) newErrors.weight = 'Weight must be between 1 and 1000 kg';
    if (reps < 1 || reps > 15) newErrors.reps = 'Reps should be 1-15 for accurate estimation';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateORM = (w: number, r: number) => {
    const brzycki = w * (36 / (37 - r));
    const epley = w * (1 + r / 30);
    const lander = (100 * w) / (101.3 - 2.67123 * r);
    const lombardi = w * Math.pow(r, 0.1);
    const average = (brzycki + epley + lander + lombardi) / 4;

    const percentages = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50].map(pct => ({
      percent: pct,
      weight: Math.round(average * (pct / 100) * 10) / 10,
    }));

    return { brzycki, epley, lander, lombardi, average, percentages };
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const orm = calculateORM(weight, reps);
    setResult({
      brzycki: Math.round(orm.brzycki * 10) / 10,
      epley: Math.round(orm.epley * 10) / 10,
      lander: Math.round(orm.lander * 10) / 10,
      lombardi: Math.round(orm.lombardi * 10) / 10,
      average: Math.round(orm.average * 10) / 10,
      percentages: orm.percentages,
    });
  };

  const faqs = [
    {
      question: 'What is a One Rep Max?',
      answer: 'One Rep Max (1RM) is the maximum weight you can lift for a single repetition with proper form. It\'s used to measure strength levels, program training, and track progress. Rather than testing your actual max (which risks injury), this calculator estimates it from submaximal lifts.'
    },
    {
      question: 'How accurate is a calculated 1RM?',
      answer: 'Estimates from 3-5 reps are typically within 5-10% of actual 1RM. The Brzycki and Epley formulas are most accurate for rep ranges of 1-10. Accuracy decreases with higher reps, so testing with 3-5 reps provides the best estimate. Individual variation exists based on muscle fiber types.'
    },
    {
      question: 'Why do different formulas give different results?',
      answer: 'Different formulas were developed from different populations and use different mathematical approaches. Brzycki tends to be more accurate for lower rep ranges. Epley is widely used and reliable. The average of multiple formulas often provides the most balanced estimate. Use the average as your reference.'
    },
    {
      question: 'How often should I test my 1RM?',
      answer: 'For strength athletes: every 4-8 weeks during a strength block. For general fitness: every 3-6 months. Testing requires full recovery and should only be done when you\'re fresh. Consider a trained spotter and proper warm-up. More frequent testing increases injury risk without additional benefit.'
    },
    {
      question: 'How do I use 1RM for training?',
      answer: 'Use percentage-based programming: 80-100% for strength (1-6 reps), 70-80% for hypertrophy (6-12 reps), 50-70% for endurance (12+ reps). This calculator\'s percentage table shows target weights for different rep ranges. Adjust based on daily readiness and recovery.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'One Rep Max Calculator',
        description: 'Estimate your one rep max strength using multiple validated formulas.',
        url: 'https://www.calculatorpilotai.com/tools/health/one-rep-max-calculator',
        applicationCategory: 'HealthApplication',
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
          { '@type': 'ListItem', position: 2, name: 'Health', item: 'https://www.calculatorpilotai.com/tools/health' },
          { '@type': 'ListItem', position: 3, name: 'One Rep Max Calculator', item: 'https://www.calculatorpilotai.com/tools/health/one-rep-max-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Target Heart Rate', path: '/tools/health/target-heart-rate-calculator', desc: 'Calculate your exercise heart rate zones' },
    { name: 'Calorie Burn Calculator', path: '/tools/health/calorie-burn-calculator', desc: 'Calculate calories burned during training' },
    { name: 'Macro Calculator', path: '/tools/health/macro-calculator', desc: 'Calculate macros for muscle building' },
  ];

  return (
    <ToolLayout toolId="one-rep-max" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate One Rep Max</h2>
            <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
              <button onClick={() => setUnit('kg')} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === 'kg' ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-800'}`}>KG</button>
              <button onClick={() => setUnit('lb')} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === 'lb' ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-800'}`}>LB</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="orm-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weight Lifted ({unit})</label>
              <input
                id="orm-weight"
                type="number"
                min="1"
                max="1000"
                step="0.5"
                value={weightDisplay}
                onChange={(e) => {
                  setWeight(validateNumberInput(weightFromDisplay(Number(e.target.value)), { min: 1, max: 1000 }));
                  setErrors(prev => { const n = { ...prev }; delete n.weight; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="orm-reps" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Reps Performed</label>
              <input
                id="orm-reps"
                type="number"
                min="1"
                max="15"
                value={reps}
                onChange={(e) => {
                  setReps(validateNumberInput(Number(e.target.value), { min: 1, max: 15 }));
                  setErrors(prev => { const n = { ...prev }; delete n.reps; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.reps ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.reps && <p className="text-xs text-rose-500">{errors.reps}</p>}
              <p className="text-xs text-muted-foreground">Most accurate with 1-10 reps</p>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate One Rep Max
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Estimated One Rep Max</span>
              <div className={`${getResultTextSize(formatNumber(result.average))} font-mono font-bold tabular-nums leading-tight tracking-tight text-blue-600`}>{formatNumber(result.average)}</div>
              <span className="text-sm text-muted-foreground">{unit}</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Formula Comparison</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Brzycki</div>
                  <div className="text-xl font-mono font-bold">{formatNumber(result.brzycki)}</div>
                  <div className="text-xs text-muted-foreground">{unit}</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Epley</div>
                  <div className="text-xl font-mono font-bold">{formatNumber(result.epley)}</div>
                  <div className="text-xs text-muted-foreground">{unit}</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Lander</div>
                  <div className="text-xl font-mono font-bold">{formatNumber(result.lander)}</div>
                  <div className="text-xs text-muted-foreground">{unit}</div>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Lombardi</div>
                  <div className="text-xl font-mono font-bold">{formatNumber(result.lombardi)}</div>
                  <div className="text-xs text-muted-foreground">{unit}</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Training Percentages</h3>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-2">% of 1RM</th>
                      <th className="text-right py-2 px-2">Weight ({unit})</th>
                      <th className="text-right py-2 px-2">Est. Reps</th>
                      <th className="text-right py-2 px-2">Training Goal</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {result.percentages.map((row) => (
                      <tr key={row.percent} className="border-b border-slate-100">
                        <td className="py-2 px-2">{row.percent}%</td>
                        <td className="text-right py-2 px-2 font-mono font-bold">{formatNumber(row.weight)}</td>
                        <td className="text-right py-2 px-2">{Math.max(1, Math.round(30 / (100 - row.percent) * 10) / 10)}</td>
                        <td className="text-right py-2 px-2">{row.percent >= 90 ? 'Strength' : row.percent >= 75 ? 'Power' : row.percent >= 65 ? 'Hypertrophy' : 'Endurance'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding One Rep Max</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">Why Calculate 1RM?</h3>
              <p className="text-slate-700 leading-relaxed">
                Your 1RM is the gold standard for measuring strength. It allows percentage-based programming, which is more effective than arbitrary rep schemes. Instead of guessing "should I do 135 or 155?", you calculate the exact weight for your target reps based on your true strength level.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">The Formulas</h3>
              <div className="space-y-2 font-mono text-sm bg-white p-4 rounded-lg">
                <p className="text-slate-600">Brzycki: Weight × 36 / (37 - reps)</p>
                <p className="text-slate-600">Epley: Weight × (1 + reps / 30)</p>
                <p className="text-slate-600">Lander: (100 × Weight) / (101.3 - 2.67 × reps)</p>
                <p className="text-slate-600">Lombardi: Weight × reps^0.1</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Training Recommendations</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>90-100%:</strong> Maximum strength (1-6 reps, 2-4 min rest)</li>
                <li><strong>75-90%:</strong> Power/hypertrophy (3-12 reps, 1-2 min rest)</li>
                <li><strong>65-75%:</strong> Hypertrophy (6-12 reps, 60-90 sec rest)</li>
                <li><strong>50-65%:</strong> Muscular endurance (12-20 reps, 30-60 sec rest)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

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

      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Related Health Calculators</h2>
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
