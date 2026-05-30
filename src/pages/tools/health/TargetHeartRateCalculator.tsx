import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

interface HeartRateResult {
  maxHR: number;
  fatBurn: { low: number; high: number };
  cardio: { low: number; high: number };
  peak: { low: number; high: number };
}

export default function TargetHeartRateCalculator() {
  const [age, setAge] = useState(30);
  const [restingHR, setRestingHR] = useState(70);
  const [unit, setUnit] = useState<'bpm' | 'percentage'>('bpm');
  const [result, setResult] = useState<HeartRateResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (age < 18 || age > 100) newErrors.age = 'Age must be between 18 and 100';
    if (restingHR < 30 || restingHR > 120) newErrors.rhr = 'Resting HR must be between 30 and 120 bpm';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateMaxHR = (age: number) => 220 - age;

  const handleCalculate = () => {
    if (!validate()) return;
    const maxHR = calculateMaxHR(age);

    setResult({
      maxHR,
      fatBurn: {
        low: Math.round(maxHR * 0.5),
        high: Math.round(maxHR * 0.6),
      },
      cardio: {
        low: Math.round(maxHR * 0.6),
        high: Math.round(maxHR * 0.7),
      },
      peak: {
        low: Math.round(maxHR * 0.7),
        high: Math.round(maxHR * 0.85),
      },
    });
  };

  const faqs = [
    {
      question: 'What is target heart rate?',
      answer: 'Target heart rate is the heart rate range at which you should exercise to get maximum benefit. Different zones burn different fuel sources—lower intensities primarily use fat, while higher intensities use more carbohydrates. Both contribute to fitness when used appropriately.'
    },
    {
      question: 'How is maximum heart rate calculated?',
      answer: 'This calculator uses the standard formula: Max HR = 220 - age. This is an estimation based on population averages. The Tanaka formula (208 - 0.7 × age) may be more accurate for adults over 40. For a precise measurement, a medical stress test is required.'
    },
    {
      question: 'What is the fat burn zone?',
      answer: 'The fat burn zone (50-60% max HR) is where a higher percentage of calories come from fat. However, total calorie burn is lower. This zone is suitable for longer, easier workouts and is comfortable for beginners. The actual "best" zone depends on your goals and current fitness level.'
    },
    {
      question: 'Is exercising at max heart rate dangerous?',
      answer: 'For healthy individuals, brief periods at max heart rate during interval training is safe. However, sudden spike to maximum without proper warm-up or with pre-existing heart conditions can be risky. Always consult a doctor before starting intense exercise if you have any health concerns.'
    },
    {
      question: 'How should I use these zones?',
      answer: 'For general fitness, aim for 150 minutes per week in the moderate (cardio) zone. For performance, incorporate intervals in the peak zone. For beginners, start in the fat burn zone and gradually increase intensity. Listen to your body—RPE (Rate of Perceived Exertion) is just as important as heart rate.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Target Heart Rate Calculator',
        description: 'Calculate your exercise heart rate zones for optimal fat burn and cardio benefits.',
        url: 'https://www.calculatorpilotai.com/tools/health/target-heart-rate-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Target Heart Rate Calculator', item: 'https://www.calculatorpilotai.com/tools/health/target-heart-rate-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Calorie Burn Calculator', path: '/tools/health/calorie-burn-calculator', desc: 'Calculate calories burned during exercise' },
    { name: 'VO2 Max Calculator', path: '/tools/health/vo2-max-calculator', desc: 'Estimate your cardiovascular fitness' },
    { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', desc: 'Calculate your body mass index' },
  ];

  const zones = [
    { name: 'Fat Burn', color: 'bg-green-500', percent: '50-60%', desc: 'Easy pace, sustainable long duration', benefit: 'Endurance base, fat utilization' },
    { name: 'Cardio', color: 'bg-yellow-500', percent: '60-70%', desc: 'Moderate intensity, breathable', benefit: 'Cardiovascular health, calorie burn' },
    { name: 'Peak', color: 'bg-red-500', percent: '70-85%', desc: 'Hard effort, difficult to maintain', benefit: 'Performance, speed work' },
  ];

  return (
    <ToolLayout toolId="target-heart-rate" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Target Heart Rate</h2>
            <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
              <button onClick={() => setUnit('bpm')} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === 'bpm' ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-800'}`}>BPM</button>
              <button onClick={() => setUnit('percentage')} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === 'percentage' ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-800'}`}>%</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="thr-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="thr-age"
                type="number"
                min="18"
                max="100"
                value={age}
                onChange={(e) => {
                  setAge(validateNumberInput(Number(e.target.value), { min: 18, max: 100 }));
                  setErrors(prev => { const n = { ...prev }; delete n.age; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.age ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.age && <p className="text-xs text-rose-500">{errors.age}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="thr-rhr" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resting Heart Rate (optional)</label>
              <input
                id="thr-rhr"
                type="number"
                min="30"
                max="120"
                value={restingHR}
                onChange={(e) => {
                  setRestingHR(validateNumberInput(Number(e.target.value), { min: 30, max: 120 }));
                  setErrors(prev => { const n = { ...prev }; delete n.rhr; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.rhr ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.rhr && <p className="text-xs text-rose-500">{errors.rhr}</p>}
              <p className="text-xs text-muted-foreground">Measured first thing in the morning</p>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Heart Rate Zones
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Your Maximum Heart Rate</span>
              <div className={`${getResultTextSize(formatNumber(result.maxHR))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.maxHR)}</div>
              <span className="text-sm text-muted-foreground">beats per minute</span>
            </div>

            <div className="space-y-4">
              {zones.map((zone, i) => {
                const zoneResult = i === 0 ? result.fatBurn : i === 1 ? result.cardio : result.peak;
                return (
                  <div key={i} className="bg-white border border-slate-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${zone.color}`} />
                        <h3 className="font-bold text-lg">{zone.name}</h3>
                      </div>
                      <span className="text-sm text-muted-foreground">{zone.percent} of max</span>
                    </div>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-mono font-bold">
                        {unit === 'bpm'
                          ? `${zoneResult.low} - ${zoneResult.high} bpm`
                          : `${Math.round(zoneResult.low / result.maxHR * 100)}% - ${Math.round(zoneResult.high / result.maxHR * 100)}%`
                        }
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Intensity:</span>
                        <span>{zone.desc}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Benefit:</span>
                        <span>{zone.benefit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Heart Rate Zones</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">The Heart Rate Zone System</h3>
              <p className="text-slate-700 leading-relaxed">
                Exercise intensity is measured as a percentage of your maximum heart rate. Each zone provides different benefits. Lower zones are sustainable for longer periods; higher zones provide greater cardiovascular stress and calorie burn but cannot be maintained as long.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Zone Training Benefits</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Zone 1 (Fat Burn):</strong> Builds endurance base, improves fat metabolism</li>
                <li><strong>Zone 2 (Cardio):</strong> Improves cardiovascular efficiency, sustainable for hours</li>
                <li><strong>Zone 3 (Peak):</strong> Increases speed and power, improves VO2 max</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">The Talk Test</h3>
              <p className="text-slate-700 leading-relaxed">
                A simple way to gauge intensity without a heart rate monitor: In the fat burn zone, you can sing. In the cardio zone, you can talk but not sing. In the peak zone, you can only speak a few words. Use this to verify your heart rate zones feel right.
              </p>
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
