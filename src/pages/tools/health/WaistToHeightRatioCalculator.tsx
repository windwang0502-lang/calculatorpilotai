import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

interface WaistHeightResult {
  ratio: number;
  category: string;
  description: string;
}

export default function WaistToHeightRatioCalculator() {
  const [waistCm, setWaistCm] = useState(85);
  const [heightCm, setHeightCm] = useState(175);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<WaistHeightResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cmToDisplay = (val: number) => unit === 'metric' ? val : Math.round(val / 2.54 * 10) / 10;
  const cmFromDisplay = (val: number) => unit === 'metric' ? val : val * 2.54;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (waistCm <= 0 || waistCm > 300) newErrors.waist = 'Waist must be between 1 and 300 cm';
    if (heightCm <= 0 || heightCm > 300) newErrors.height = 'Height must be between 1 and 300 cm';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const ratio = waistCm / heightCm;

    let category: string;
    let description: string;

    if (ratio < 0.4) {
      category = 'Underweight';
      description = 'Your waist is very small relative to height. Consider consulting a healthcare provider.';
    } else if (ratio < 0.5) {
      category = 'Healthy';
      description = 'Your waist-to-height ratio is in the healthy range. Maintain your current lifestyle.';
    } else if (ratio < 0.6) {
      category = 'Overweight';
      description = 'Your ratio indicates overweight status. Consider dietary and exercise improvements.';
    } else {
      category = 'Obese';
      description = 'Your ratio indicates obesity. We recommend consulting a healthcare provider.';
    }

    setResult({ ratio, category, description });
  };

  const faqs = [
    {
      question: 'What is the waist-to-height ratio?',
      answer: 'The waist-to-height ratio (WHtR) compares your waist circumference to your height. It\'s a simple measure of body composition that indicates whether you carry excess abdominal fat. Unlike BMI, it accounts for height differences and is considered more accurate for assessing health risk.'
    },
    {
      question: 'What is a healthy waist-to-height ratio?',
      answer: 'A WHtR between 0.4 and 0.5 is generally considered healthy for adults. A ratio below 0.4 may indicate underweight status, while values above 0.5 suggest increased health risk. Some sources use 0.5 as a single cutoff point for all adults.'
    },
    {
      question: 'Why is WHtR considered better than BMI?',
      answer: 'WHtR is considered superior to BMI because: it works across different body types and ethnicities, it directly measures central obesity (abdominal fat), it accounts for height differences, and studies show it\'s a better predictor of cardiovascular risk and mortality.'
    },
    {
      question: 'How do I measure my waist correctly?',
      answer: 'Measure your waist at the narrowest point, usually halfway between your lowest rib and the top of your hip bone (often just above the belly button). Stand relaxed, breathe out naturally, and measure against bare skin with a flexible tape measure.'
    },
    {
      question: 'Can WHtR be used for children?',
      answer: 'Yes, WHtR can be used for children and adolescents, but the interpretation differs. For children, the healthy range varies by age and gender. Healthcare providers use age-specific percentiles rather than fixed cutoffs when assessing children.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Waist to Height Ratio Calculator',
        description: 'Calculate your waist-to-height ratio to assess health risk from abdominal fat.',
        url: 'https://www.calculatorpilotai.com/tools/health/waist-to-height-ratio-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Waist to Height Ratio Calculator', item: 'https://www.calculatorpilotai.com/tools/health/waist-to-height-ratio-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', desc: 'Calculate your body mass index' },
    { name: 'Waist-to-Hip Ratio', path: '/tools/health/waist-to-hip-ratio-calculator', desc: 'Measure body fat distribution' },
    { name: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator', desc: 'Estimate your body fat percentage' },
  ];

  const unitLabel = unit === 'metric' ? 'cm' : 'in';

  return (
    <ToolLayout toolId="waist-to-height-ratio" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Waist-to-Height Ratio</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="whtr-waist" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Waist Circumference ({unitLabel})</label>
              <input
                id="whtr-waist"
                type="number"
                min="1"
                max="300"
                step="0.1"
                value={cmToDisplay(waistCm)}
                onChange={(e) => {
                  setWaistCm(validateNumberInput(cmFromDisplay(Number(e.target.value)), { min: 1, max: 300 }));
                  setErrors(prev => { const n = { ...prev }; delete n.waist; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.waist ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.waist && <p className="text-xs text-rose-500">{errors.waist}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="whtr-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({unitLabel})</label>
              <input
                id="whtr-height"
                type="number"
                min="1"
                max="300"
                step="0.1"
                value={cmToDisplay(heightCm)}
                onChange={(e) => {
                  setHeightCm(validateNumberInput(cmFromDisplay(Number(e.target.value)), { min: 1, max: 300 }));
                  setErrors(prev => { const n = { ...prev }; delete n.height; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.height ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.height && <p className="text-xs text-rose-500">{errors.height}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Ratio
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Your Waist-to-Height Ratio</span>
              <div className={`${getResultTextSize(formatNumber(result.ratio, { decimals: 2 }))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.ratio, { decimals: 2 })}</div>
            </div>

            <div className={`p-6 border rounded-xl text-center ${result.ratio < 0.4 ? 'border-blue-200 bg-blue-50' : result.ratio < 0.5 ? 'border-green-200 bg-green-50' : result.ratio < 0.6 ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
              <span className={`text-2xl font-bold ${result.ratio < 0.4 ? 'text-blue-600' : result.ratio < 0.5 ? 'text-green-600' : result.ratio < 0.6 ? 'text-yellow-600' : 'text-red-600'}`}>{result.category}</span>
              <p className="text-sm mt-2 text-muted-foreground">{result.description}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Understanding Your Ratio</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-20 h-4 bg-blue-100 rounded" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Below 0.4:</span> <span className="text-sm text-muted-foreground">Underweight</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-4 bg-green-100 rounded" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">0.4 - 0.5:</span> <span className="text-sm text-muted-foreground">Healthy</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-4 bg-yellow-100 rounded" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">0.5 - 0.6:</span> <span className="text-sm text-muted-foreground">Overweight</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-4 bg-red-100 rounded" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">Above 0.6:</span> <span className="text-sm text-muted-foreground">Obese</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Waist-to-Height Ratio</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What is WHtR?</h3>
              <p className="text-slate-700 leading-relaxed">
                The waist-to-height ratio (WHtR) is a simple metric that assesses body composition by comparing waist circumference to height. It was developed because waist measurement alone doesn't account for how tall someone is. A taller person can have a larger waist without the same health risks as a shorter person with the same waist size.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Why 0.5 is the Magic Number</h3>
              <p className="text-slate-700 leading-relaxed">
                Research suggests that a WHtR of 0.5 is a good single cutoff for adults regardless of gender or ethnicity. Your waist should be less than half your height. For example, if you're 180cm tall, your waist should be less than 90cm.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">How to Measure</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Waist:</strong> Measure at the narrowest point between ribs and hips</li>
                <li><strong>Height:</strong> Measure without shoes, standing straight against a wall</li>
                <li>Keep the tape measure snug but not tight</li>
                <li>Measure against bare skin or thin clothing</li>
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

function UnitToggle({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) {
  return (
    <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${value === opt.value ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-800'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
