import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

interface IdealBodyFatResult {
  minIdeal: number;
  maxIdeal: number;
  age: number;
}

export default function IdealBodyFatCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(30);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weightKg, setWeightKg] = useState(75);
  const [result, setResult] = useState<IdealBodyFatResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weightDisplay = unit === 'metric' ? weightKg : Math.round(weightKg * 2.20462 * 10) / 10;
  const weightFromDisplay = (val: number) => unit === 'metric' ? val : val / 2.20462;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (age < 18 || age > 100) newErrors.age = 'Age must be between 18 and 100';
    if (weightKg <= 0 || weightKg > 500) newErrors.weight = 'Weight must be between 1 and 500 kg';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getIdealBodyFatRange = (age: number, gender: 'male' | 'female') => {
    if (gender === 'male') {
      if (age <= 20) return { min: 5, max: 13 };
      if (age <= 25) return { min: 8, max: 16 };
      if (age <= 30) return { min: 10, max: 18 };
      if (age <= 35) return { min: 12, max: 20 };
      if (age <= 40) return { min: 14, max: 21 };
      if (age <= 45) return { min: 16, max: 23 };
      if (age <= 50) return { min: 18, max: 24 };
      if (age <= 55) return { min: 19, max: 25 };
      return { min: 20, max: 26 };
    } else {
      if (age <= 20) return { min: 10, max: 18 };
      if (age <= 25) return { min: 12, max: 20 };
      if (age <= 30) return { min: 14, max: 22 };
      if (age <= 35) return { min: 16, max: 24 };
      if (age <= 40) return { min: 18, max: 26 };
      if (age <= 45) return { min: 20, max: 28 };
      if (age <= 50) return { min: 22, max: 30 };
      if (age <= 55) return { min: 23, max: 31 };
      return { min: 24, max: 32 };
    }
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const range = getIdealBodyFatRange(age, gender);
    setResult({ minIdeal: range.min, maxIdeal: range.max, age });
  };

  const faqs = [
    {
      question: 'What is ideal body fat percentage?',
      answer: 'Ideal body fat percentage is the range of body fat considered healthy for optimal health and longevity. This range varies by age and gender. Below this range, you may experience hormonal disruptions and health issues. Above this range, health risks increase significantly.'
    },
    {
      question: 'How is ideal body fat range determined?',
      answer: 'Ideal body fat ranges are based on epidemiological studies linking body fat percentages to health outcomes like cardiovascular disease, diabetes, and mortality. The ranges represent where most healthy individuals fall, accounting for age-related changes in metabolism and body composition.'
    },
    {
      question: 'Does ideal body fat change with age?',
      answer: 'Yes, ideal body fat percentage increases slightly with age because metabolic rate decreases and body composition naturally shifts toward more fat and less muscle. This is why a 50-year-old\'s ideal range is higher than a 20-year-old\'s, even when both are equally healthy.'
    },
    {
      question: 'What body fat percentage should athletes aim for?',
      answer: 'Athletes typically have lower body fat percentages due to training adaptations. Male athletes often range from 6-13%, while female athletes range from 12-20%. However, going below essential fat levels (2-5% for men, 10-13% for women) can impair health and performance.'
    },
    {
      question: 'Is it possible to have too low body fat?',
      answer: 'Yes. Very low body fat (below essential levels) can cause hormonal disruptions, including decreased testosterone and estrogen, weakened immune system, loss of menstrual cycle in women, and decreased bone density. Essential fat is necessary for normal bodily functions.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Ideal Body Fat Calculator',
        description: 'Determine your healthy body fat percentage range based on age and gender.',
        url: 'https://www.calculatorpilotai.com/tools/health/ideal-body-fat-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Ideal Body Fat Calculator', item: 'https://www.calculatorpilotai.com/tools/health/ideal-body-fat-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator', desc: 'Measure your current body fat' },
    { name: 'Lean Body Mass', path: '/tools/health/lean-body-mass-calculator', desc: 'Calculate your lean mass' },
    { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', desc: 'Calculate your body mass index' },
  ];

  const ageGroups = [
    { range: '18-20', male: '5-13%', female: '10-18%' },
    { range: '21-25', male: '8-16%', female: '12-20%' },
    { range: '26-30', male: '10-18%', female: '14-22%' },
    { range: '31-35', male: '12-20%', female: '16-24%' },
    { range: '36-40', male: '14-21%', female: '18-26%' },
    { range: '41-45', male: '16-23%', female: '20-28%' },
    { range: '46-50', male: '18-24%', female: '22-30%' },
    { range: '51-55', male: '19-25%', female: '23-31%' },
    { range: '56+', male: '20-26%', female: '24-32%' },
  ];

  return (
    <ToolLayout toolId="ideal-body-fat" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Find Your Ideal Body Fat</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="ibf-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="ibf-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="ibf-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="ibf-age"
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
              <label htmlFor="ibf-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
              <input
                id="ibf-weight"
                type="number"
                min="1"
                max="500"
                step="0.1"
                value={weightDisplay}
                onChange={(e) => {
                  setWeightKg(validateNumberInput(weightFromDisplay(Number(e.target.value)), { min: 1, max: 500 }));
                  setErrors(prev => { const n = { ...prev }; delete n.weight; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.weight ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.weight && <p className="text-xs text-rose-500">{errors.weight}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Ideal Body Fat
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Your Ideal Body Fat Range</span>
              <div className={`${getResultTextSize(formatNumber(result.minIdeal) + '-' + formatNumber(result.maxIdeal) + '%')} font-mono font-bold tabular-nums leading-tight tracking-tight`}>
                {formatNumber(result.minIdeal)}% - {formatNumber(result.maxIdeal)}%
              </div>
              <span className="text-sm text-muted-foreground">for age {result.age}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">At {formatNumber(result.minIdeal)}% Body Fat</span>
                <div className="text-lg font-mono font-bold">{formatNumber(weightKg * (1 - result.minIdeal / 100), { decimals: 1 })} {unit === 'metric' ? 'kg' : 'lb'}</div>
                <span className="text-sm text-muted-foreground">lean mass target</span>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">At {formatNumber(result.maxIdeal)}% Body Fat</span>
                <div className="text-lg font-mono font-bold">{formatNumber(weightKg * (1 - result.maxIdeal / 100), { decimals: 1 })} {unit === 'metric' ? 'kg' : 'lb'}</div>
                <span className="text-sm text-muted-foreground">lean mass target</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Healthy Body Fat by Age</h3>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 px-2">Age Range</th>
                      <th className="text-right py-2 px-2">Men</th>
                      <th className="text-right py-2 px-2">Women</th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {ageGroups.map((row, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="py-2 px-2">{row.range}</td>
                        <td className="text-right py-2 px-2">{row.male}</td>
                        <td className="text-right py-2 px-2">{row.female}</td>
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
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Ideal Body Fat</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What is Ideal Body Fat?</h3>
              <p className="text-slate-700 leading-relaxed">
                Ideal body fat percentage represents the range of body fat associated with the lowest health risks and optimal bodily function. This range isn't about appearance—it's about the percentage where your body systems work best, hormones are balanced, and disease risk is minimized.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Why It Changes With Age</h3>
              <p className="text-slate-700 leading-relaxed">
                As we age, our metabolism naturally slows, muscle mass tends to decrease (sarcopenia), and body composition shifts. The ideal body fat range adjusts upward to account for these normal aging processes while still representing a healthy, functional body composition.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Essential vs. Storage Fat</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Essential fat:</strong> Necessary for organ function, brain health, and hormone production (2-5% men, 10-13% women)</li>
                <li><strong>Storage fat:</strong> Energy reserve, insulation, and organ protection</li>
                <li>The ideal range includes essential fat plus a healthy amount of storage fat</li>
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
