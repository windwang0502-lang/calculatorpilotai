import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateBodyFat, BodyFatResult } from '@/lib/engines';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState(175);
  const [neckCm, setNeckCm] = useState(38);
  const [waistCm, setWaistCm] = useState(85);
  const [hipCm, setHipCm] = useState(95);
  const [result, setResult] = useState<BodyFatResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const cmToDisplay = (val: number) => unit === 'metric' ? val : Math.round(val / 2.54 * 10) / 10;
  const cmFromDisplay = (val: number) => unit === 'metric' ? val : val * 2.54;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (heightCm <= 0 || heightCm > 300) newErrors.height = 'Height must be between 1 and 300 cm';
    if (neckCm <= 0 || neckCm > 100) newErrors.neck = 'Neck must be between 1 and 100 cm';
    if (waistCm <= 0 || waistCm > 300) newErrors.waist = 'Waist must be between 1 and 300 cm';
    if (gender === 'female' && (hipCm <= 0 || hipCm > 300)) newErrors.hip = 'Hip must be between 1 and 300 cm';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateBodyFat(gender, heightCm, neckCm, waistCm, gender === 'female' ? hipCm : undefined);
    setResult(res);
  };

  const getCategoryInfo = (bf: number, isMale: boolean) => {
    if (isMale) {
      if (bf < 6) return { label: 'Essential Fat', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', desc: 'Minimal fat necessary for bodily functions' };
      if (bf < 14) return { label: 'Athletes', color: 'text-green-600', bg: 'bg-green-50 border-green-200', desc: 'Typical for athletes in endurance sports' };
      if (bf < 18) return { label: 'Fitness', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', desc: 'Good fitness level with visible muscle definition' };
      if (bf < 25) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', desc: 'Typical body fat percentage for adults' };
      return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-50 border-red-200', desc: 'Above healthy range, consult a healthcare provider' };
    } else {
      if (bf < 14) return { label: 'Essential Fat', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', desc: 'Minimal fat necessary for bodily functions' };
      if (bf < 21) return { label: 'Athletes', color: 'text-green-600', bg: 'bg-green-50 border-green-200', desc: 'Typical for female athletes' };
      if (bf < 25) return { label: 'Fitness', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', desc: 'Good fitness level' };
      if (bf < 32) return { label: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', desc: 'Typical body fat percentage for adult women' };
      return { label: 'Obese', color: 'text-red-600', bg: 'bg-red-50 border-red-200', desc: 'Above healthy range, consult a healthcare provider' };
    }
  };

  const unitLabel = unit === 'metric' ? 'cm' : 'in';

  const faqs = [
    {
      question: 'How is body fat percentage measured with this calculator?',
      answer: 'This calculator uses the US Navy circumference method, which estimates body fat from body measurements. For men, it uses neck and waist circumference. For women, it also includes hip circumference. These measurements, combined with height, are used in regression equations developed by the US Navy to estimate body composition.'
    },
    {
      question: 'What is a healthy body fat percentage?',
      answer: 'Healthy body fat ranges vary by age and gender. For men, 18-24% is considered average, with athletes typically at 6-17%. For women, 25-31% is average, with athletes at 14-24%. Essential fat (minimum needed for health) is 2-5% for men and 10-13% for women. Consult healthcare providers for personalized recommendations.'
    },
    {
      question: 'How accurate is the Navy method compared to other methods?',
      answer: 'The Navy circumference method has a standard error of approximately 3-4% body fat, which is reasonable for a non-laboratory method. More accurate methods include DEXA scans, hydrostatic weighing, and bioelectrical impedance analysis. The Navy method is a practical alternative when professional equipment isn\'t available.'
    },
    {
      question: 'Why does the formula use different measurements for men and women?',
      answer: 'Women naturally carry more body fat, especially around hips and thighs, due to hormonal differences and reproductive functions. The hip measurement for women accounts for this fat distribution pattern. The formulas were developed separately for each gender to provide accurate estimates for typical body compositions.'
    },
    {
      question: 'How often should I measure my body fat?',
      answer: 'Body fat percentage changes slowly, so measuring weekly is often unnecessary. Monthly measurements are sufficient for most people. Consistency matters more than frequency—measure at the same time of day, in similar conditions, and using the same technique each time for the most accurate tracking.'
    },
    {
      question: 'Can I use this method if I\'m very muscular?',
      answer: 'The Navy method may underestimate body fat in highly muscular individuals because the formula was developed based on typical body compositions. Muscular people often have larger necks and smaller waists relative to their body fat, skewing the results. For athletes and bodybuilders, methods like DEXA scans or skinfold calipers may be more appropriate.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Body Fat Calculator',
        description: 'Estimate your body fat percentage using the US Navy circumference method with neck, waist, and hip measurements.',
        url: 'https://www.calculatorpilotai.com/tools/health/body-fat-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Body Fat Calculator', item: 'https://www.calculatorpilotai.com/tools/health/body-fat-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', desc: 'Calculate your body mass index' },
    { name: 'BMR Calculator', path: '/tools/health/bmr-calculator', desc: 'Calculate your basal metabolic rate' },
    { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Calculate your daily calorie needs' },
  ];

  return (
    <ToolLayout toolId="body-fat" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Body Fat Percentage</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="bf-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="bf-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="bf-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({unitLabel})</label>
              <input
                id="bf-height"
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
            <div className="space-y-2">
              <label htmlFor="bf-neck" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Neck Circumference ({unitLabel})</label>
              <input
                id="bf-neck"
                type="number"
                min="1"
                max="100"
                step="0.1"
                value={cmToDisplay(neckCm)}
                onChange={(e) => {
                  setNeckCm(validateNumberInput(cmFromDisplay(Number(e.target.value)), { min: 1, max: 100 }));
                  setErrors(prev => { const n = { ...prev }; delete n.neck; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.neck ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.neck && <p className="text-xs text-rose-500">{errors.neck}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="bf-waist" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Waist Circumference ({unitLabel})</label>
              <input
                id="bf-waist"
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
            {gender === 'female' && (
              <div className="space-y-2">
                <label htmlFor="bf-hip" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Hip Circumference ({unitLabel})</label>
                <input
                  id="bf-hip"
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
            )}
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Body Fat
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Your Body Fat Percentage</span>
              <div className={`${getResultTextSize(formatNumber(result.bodyFat, { decimals: 1 }) + '%')} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.bodyFat, { decimals: 1 })}%</div>
            </div>

            {(() => {
              const info = getCategoryInfo(result.bodyFat, gender === 'male');
              return (
                <div className={`p-6 border rounded-xl text-center`}>
                  <div className={`text-2xl font-bold ${info.color}`}>{info.label}</div>
                  <p className="text-sm mt-2 text-muted-foreground">{info.desc}</p>
                </div>
              );
            })()}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Lean Mass</span>
                <div className={`${getResultTextSize(formatNumber(result.leanMass, { decimals: 1 }))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.leanMass, { decimals: 1 })} kg</div>
                <span className="text-sm text-muted-foreground">or {formatNumber(Math.round(result.leanMass * 2.20462))} lb</span>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Fat Mass</span>
                <div className={`${getResultTextSize(formatNumber(result.fatMass, { decimals: 1 }))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.fatMass, { decimals: 1 })} kg</div>
                <span className="text-sm text-muted-foreground">or {formatNumber(Math.round(result.fatMass * 2.20462))} lb</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Understanding Body Fat Categories</h3>
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
                    <tr className="border-b border-slate-100"><td className="py-2 px-2">Essential Fat</td><td className="text-right py-2 px-2">2-5%</td><td className="text-right py-2 px-2">10-13%</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-2 px-2">Athletes</td><td className="text-right py-2 px-2">6-13%</td><td className="text-right py-2 px-2">14-20%</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-2 px-2">Fitness</td><td className="text-right py-2 px-2">14-17%</td><td className="text-right py-2 px-2">21-24%</td></tr>
                    <tr className="border-b border-slate-100"><td className="py-2 px-2">Average</td><td className="text-right py-2 px-2">18-24%</td><td className="text-right py-2 px-2">25-31%</td></tr>
                    <tr><td className="py-2 px-2">Obese</td><td className="text-right py-2 px-2">25%+</td><td className="text-right py-2 px-2">32%+</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Body Fat Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Body Fat Calculator estimates your body fat percentage using the US Navy circumference method. This proven technique uses body measurements (neck, waist, and hip circumference) to estimate your body composition without requiring expensive equipment or specialized training.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator uses regression equations developed by the US Navy to estimate body fat from circumference measurements. For men, it uses neck and waist measurements. For women, it includes hip measurement to account for typical fat distribution patterns. These measurements are compared against population data to estimate your body composition.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How to Measure Accurately</h3>
              <p className="text-slate-700 leading-relaxed mb-3">For accurate measurements, follow these guidelines:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Neck:</strong> Measure just below the Adam\'s voice box (larynx), tilting the head slightly up.</li>
                <li><strong>Waist:</strong> Measure at the navel level, standing relaxed without pulling the tape tight.</li>
                <li><strong>Hip (women):</strong> Measure at the widest point of the buttocks.</li>
                <li>Use a flexible measuring tape and measure in the morning before eating or exercising.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Body Fat %:</strong> Your estimated percentage of body weight that is fat.</li>
                <li><strong>Lean Mass:</strong> Your estimated weight excluding fat (muscle, bone, organs).</li>
                <li><strong>Fat Mass:</strong> Your estimated weight of body fat.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Measuring after exercise:</strong> Sweating and dehydration affect measurements significantly.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Inconsistent tape placement:</strong> Always measure at the same anatomical points.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Measure in the morning</strong> before eating or drinking for the most consistent results.</p>
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
