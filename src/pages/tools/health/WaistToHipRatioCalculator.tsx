import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

interface WaistHipResult {
  ratio: number;
  category: string;
  description: string;
}

export default function WaistToHipRatioCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waistCm, setWaistCm] = useState(85);
  const [hipCm, setHipCm] = useState(100);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<WaistHipResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cmToDisplay = (val: number) => unit === 'metric' ? val : Math.round(val / 2.54 * 10) / 10;
  const cmFromDisplay = (val: number) => unit === 'metric' ? val : val * 2.54;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (waistCm <= 0 || waistCm > 300) newErrors.waist = 'Waist must be between 1 and 300 cm';
    if (hipCm <= 0 || hipCm > 300) newErrors.hip = 'Hip must be between 1 and 300 cm';
    if (waistCm >= hipCm) newErrors.waist = 'Waist should be smaller than hip for a healthy ratio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const ratio = waistCm / hipCm;

    let category: string;
    let description: string;
    let color: string;

    if (gender === 'male') {
      if (ratio < 0.91) {
        category = 'Low Risk';
        description = 'Your waist-to-hip ratio indicates a lower risk for cardiovascular and metabolic diseases.';
        color = 'text-green-600';
      } else if (ratio < 1.0) {
        category = 'Moderate Risk';
        description = 'Your ratio suggests moderate risk. Consider lifestyle modifications.';
        color = 'text-yellow-600';
      } else {
        category = 'High Risk';
        description = 'Your ratio indicates higher risk for health conditions. Consult a healthcare provider.';
        color = 'text-red-600';
      }
    } else {
      if (ratio < 0.81) {
        category = 'Low Risk';
        description = 'Your waist-to-hip ratio indicates a lower risk for cardiovascular and metabolic diseases.';
        color = 'text-green-600';
      } else if (ratio < 0.86) {
        category = 'Moderate Risk';
        description = 'Your ratio suggests moderate risk. Consider lifestyle modifications.';
        color = 'text-yellow-600';
      } else {
        category = 'High Risk';
        description = 'Your ratio indicates higher risk for health conditions. Consult a healthcare provider.';
        color = 'text-red-600';
      }
    }

    setResult({ ratio, category, description });
  };

  const faqs = [
    {
      question: 'What is the waist-to-hip ratio?',
      answer: 'The waist-to-hip ratio (WHR) compares the circumference of your waist to your hips. It\'s used as an indicator of health risk because where you carry fat matters. Fat stored around the abdomen (apple shape) is associated with higher health risks than fat stored around hips and thighs (pear shape).'
    },
    {
      question: 'What are healthy WHR values?',
      answer: 'For men, a ratio below 0.90 indicates low health risk. For women, a ratio below 0.80 indicates low health risk. Values above these thresholds suggest increased risk for cardiovascular disease, type 2 diabetes, and other metabolic conditions.'
    },
    {
      question: 'How do I measure correctly?',
      answer: 'For waist: measure at the narrowest point, usually just above the belly button. For hips: measure at the widest point of the buttocks. Use a flexible measuring tape, keep it parallel to the floor, and measure against skin or thin clothing for accuracy.'
    },
    {
      question: 'Why is WHR better than BMI for some people?',
      answer: 'BMI doesn\'t distinguish between muscle and fat or account for fat distribution. Two people with the same BMI can have very different health risks based on where they carry fat. WHR specifically measures central obesity, which is a better predictor of certain health conditions.'
    },
    {
      question: 'Can WHR predict specific health conditions?',
      answer: 'Research shows WHR is a better predictor than BMI for cardiovascular disease, type 2 diabetes, hypertension, and certain cancers. A higher WHR (indicating abdominal obesity) is particularly associated with increased risk of heart disease and metabolic syndrome.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Waist to Hip Ratio Calculator',
        description: 'Calculate your waist-to-hip ratio to assess health risk based on fat distribution.',
        url: 'https://www.calculatorpilotai.com/tools/health/waist-to-hip-ratio-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Waist to Hip Ratio Calculator', item: 'https://www.calculatorpilotai.com/tools/health/waist-to-hip-ratio-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', desc: 'Calculate your body mass index' },
    { name: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator', desc: 'Estimate your body fat percentage' },
    { name: 'Waist-to-Height Ratio', path: '/tools/health/waist-to-height-ratio-calculator', desc: 'Another measure of body composition' },
  ];

  const unitLabel = unit === 'metric' ? 'cm' : 'in';

  return (
    <ToolLayout toolId="waist-to-hip-ratio" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Waist-to-Hip Ratio</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="whr-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="whr-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="whr-waist" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Waist Circumference ({unitLabel})</label>
              <input
                id="whr-waist"
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
              <label htmlFor="whr-hip" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hip Circumference ({unitLabel})</label>
              <input
                id="whr-hip"
                type="number"
                min="1"
                max="300"
                step="0.1"
                value={cmToDisplay(hipCm)}
                onChange={(e) => {
                  setHipCm(validateNumberInput(cmFromDisplay(Number(e.target.value)), { min: 1, max: 300 }));
                  setErrors(prev => { const n = { ...prev }; delete n.hip; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.hip ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.hip && <p className="text-xs text-rose-500">{errors.hip}</p>}
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
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Your Waist-to-Hip Ratio</span>
              <div className={`${getResultTextSize(formatNumber(result.ratio, { decimals: 2 }))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.ratio, { decimals: 2 })}</div>
            </div>

            <div className="p-6 border border-slate-200 rounded-xl text-center bg-white">
              <span className={`text-2xl font-bold ${result.ratio < (gender === 'male' ? 0.91 : 0.81) ? 'text-green-600' : result.ratio < (gender === 'male' ? 1.0 : 0.86) ? 'text-yellow-600' : 'text-red-600'}`}>{result.category}</span>
              <p className="text-sm mt-2 text-muted-foreground">{result.description}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Healthy Ranges by Gender</h3>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-2">Category</th>
                      <th className="text-right py-2 px-2">Men</th>
                      <th className="text-right py-2 px-2">Women</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-slate-100"><td className="py-2 px-2 text-green-600 font-medium">Low Risk</td><td className="text-right py-2 px-2">Below 0.90</td><td className="text-right py-2 px-2">Below 0.80</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-2 px-2 text-yellow-600 font-medium">Moderate Risk</td><td className="text-right py-2 px-2">0.90 - 0.99</td><td className="text-right py-2 px-2">0.80 - 0.85</td></tr>
                    <tr><td className="py-2 px-2 text-red-600 font-medium">High Risk</td><td className="text-right py-2 px-2">1.00 or above</td><td className="text-right py-2 px-2">0.86 or above</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Waist-to-Hip Ratio</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What is WHR?</h3>
              <p className="text-slate-700 leading-relaxed">
                The waist-to-hip ratio is a simple measurement that indicates where your body stores fat. Health professionals use it to assess health risk because abdominal fat (stored around organs) is more dangerous than fat stored in other areas like hips and thighs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">How to Measure</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Waist:</strong> Measure at the narrowest point, usually just above your belly button</li>
                <li><strong>Hip:</strong> Measure at the widest point of your buttocks</li>
                <li>Keep the tape snug but not tight, and parallel to the floor</li>
                <li>Measure against bare skin or thin clothing</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Apple vs. Pear Shape</h3>
              <p className="text-slate-700 leading-relaxed">
                An "apple" body shape (more fat around the waist) is associated with higher health risks. A "pear" body shape (more fat around hips and thighs) is generally associated with lower health risks. WHR helps quantify this distribution pattern.
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
