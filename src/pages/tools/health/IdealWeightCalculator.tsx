import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { calculateIdealWeight, IdealWeightResult } from '@/lib/engines';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

export default function IdealWeightCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState(175);
  const [age, setAge] = useState(30);
  const [result, setResult] = useState<IdealWeightResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const cmToDisplay = (val: number) => unit === 'metric' ? val : Math.round(val / 2.54 * 10) / 10;
  const cmFromDisplay = (val: number) => unit === 'metric' ? val : val * 2.54;
  const kgToDisplay = (val: number) => unit === 'metric' ? Math.round(val * 10) / 10 : Math.round(val * 2.20462 * 10) / 10;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (heightCm <= 0 || heightCm > 300) newErrors.height = 'Height must be between 1 and 300 cm';
    if (age <= 0 || age > 120) newErrors.age = 'Age must be between 1 and 120';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateIdealWeight(gender, heightCm, age);
    setResult(res);
  };

  const getFormulaDescription = (formula: string) => {
    switch (formula) {
      case 'Devine':
        return 'Developed in 1974 for medical use to calculate drug dosages';
      case 'Robinson':
        return 'Updated formula from 1983, commonly used in clinical settings';
      case 'Miller':
        return 'Formula from 1983, often used for general health assessments';
      default:
        return '';
    }
  };

  const unitLabel = unit === 'metric' ? 'kg' : 'lb';
  const heightLabel = unit === 'metric' ? 'cm' : 'in';

  const faqs = [
    {
      question: 'What is ideal body weight and how is it calculated?',
      answer: 'Ideal body weight (IBW) is an estimate of healthy weight based primarily on height. Various formulas exist, including Devine, Robinson, and Miller formulas. These were originally developed for medical purposes to calculate drug dosages but are now commonly used as general health guidelines. They primarily use height and gender to estimate a target weight.'
    },
    {
      question: 'Are ideal weight formulas accurate for everyone?',
      answer: 'No formula perfectly captures individual variation. These formulas don\'t account for muscle mass, bone density, body frame size, or fat distribution. A muscular athlete might weigh more than their "ideal" yet be perfectly healthy. Use these as starting guidelines, not definitive targets. Your healthcare provider can give personalized recommendations.'
    },
    {
      question: 'What is a healthy BMI range and how does it relate to ideal weight?',
      answer: 'A healthy BMI range is 18.5-24.9 for most adults. The calculator shows weight ranges that correspond to these BMI values for your height. This provides a broader "healthy weight zone" rather than a single number, acknowledging that healthy weights vary by individual factors.'
    },
    {
      question: 'Why do the three formulas give different results?',
      answer: 'Each formula was developed using different population samples and mathematical approaches. Devine was created for medical dosing, Robinson updated it for clinical use, and Miller refined it further. The differences are typically small (5-10 lbs), and the calculator averages them to provide a balanced recommendation.'
    },
    {
      question: 'Should I aim for my ideal weight exactly?',
      answer: 'Rather than targeting a specific number, focus on a healthy range. If you\'re significantly above or below the ideal weight range, gradual changes toward it can improve health. However, small variations from calculated "ideal" don\'t necessarily indicate health problems. Consider body composition, energy levels, and overall wellness alongside weight.'
    },
    {
      question: 'How should I use this calculator if I\'m trying to gain or lose weight?',
      answer: 'If you\'re underweight (below BMI 18.5), gradually increase calories and strength training to build healthy mass. If you\'re overweight or obese (BMI 25+), sustainable weight loss of 1-2 lbs per week through diet and exercise is recommended. Set realistic goals that move you toward the healthy range rather than trying to reach an exact ideal number.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Ideal Weight Calculator',
        description: 'Find your ideal body weight using multiple formulas (Devine, Robinson, Miller) based on your height and gender.',
        url: 'https://www.calculatorpilotai.com/tools/health/ideal-weight-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Ideal Weight Calculator', item: 'https://www.calculatorpilotai.com/tools/health/ideal-weight-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', desc: 'Calculate your body mass index' },
    { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Calculate your daily calorie needs' },
    { name: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator', desc: 'Estimate your body fat percentage' },
  ];

  return (
    <ToolLayout toolId="ideal-weight" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Find Your Ideal Weight</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="ideal-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="ideal-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="ideal-height" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height ({heightLabel})</label>
              <input
                id="ideal-height"
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
              <label htmlFor="ideal-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="ideal-age"
                type="number"
                min="1"
                max="120"
                step="1"
                value={age}
                onChange={(e) => {
                  setAge(validateNumberInput(Number(e.target.value), { min: 1, max: 120 }));
                  setErrors(prev => { const n = { ...prev }; delete n.age; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.age ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.age && <p className="text-xs text-rose-500">{errors.age}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Ideal Weight
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Recommended Ideal Weight Range</span>
              <div className={`${getResultTextSize(kgToDisplay(result.rangeMin) + ' - ' + kgToDisplay(result.rangeMax))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>
                {kgToDisplay(result.rangeMin)} - {kgToDisplay(result.rangeMax)}
                <span className="text-lg font-normal text-muted-foreground ml-2">{unitLabel}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Devine Formula</span>
                <div className={`${getResultTextSize(kgToDisplay(result.devine))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{kgToDisplay(result.devine)}</div>
                <span className="text-sm text-muted-foreground">{unitLabel}</span>
                <p className="text-xs text-muted-foreground mt-2">{getFormulaDescription('Devine')}</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Robinson Formula</span>
                <div className={`${getResultTextSize(kgToDisplay(result.robinson))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{kgToDisplay(result.robinson)}</div>
                <span className="text-sm text-muted-foreground">{unitLabel}</span>
                <p className="text-xs text-muted-foreground mt-2">{getFormulaDescription('Robinson')}</p>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Miller Formula</span>
                <div className={`${getResultTextSize(kgToDisplay(result.miller))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{kgToDisplay(result.miller)}</div>
                <span className="text-sm text-muted-foreground">{unitLabel}</span>
                <p className="text-xs text-muted-foreground mt-2">{getFormulaDescription('Miller')}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Healthy BMI Range</h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-50 rounded-lg gap-2">
                  <span className="text-sm font-medium">BMI Range</span>
                  <span className="font-bold">18.5 - 24.9</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-50 rounded-lg gap-2">
                  <span className="text-sm font-medium">At BMI 18.5</span>
                  <span className="font-mono">{kgToDisplay(result.bmiLow)} {unitLabel}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-50 rounded-lg gap-2">
                  <span className="text-sm font-medium">At BMI 24.9</span>
                  <span className="font-mono">{kgToDisplay(result.bmiHigh)} {unitLabel}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-800 mb-3">Understanding Ideal Weight Formulas</h3>
              <p className="text-sm text-blue-700 mb-4">
                These formulas provide estimates based on height and gender. The average of all three formulas gives you a balanced recommendation.
              </p>
              <div className="text-sm text-blue-700">
                <p><strong>Note:</strong> These are general guidelines. Your ideal weight depends on factors like muscle mass, bone density, and overall health. Consult a healthcare provider for personalized advice.</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Ideal Weight Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Ideal Weight Calculator estimates healthy weight ranges using three scientifically-developed formulas. These estimates are based on height and gender, providing a range rather than a single number to account for individual variation in body composition.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator uses three established formulas: Devine, Robinson, and Miller. Each formula was developed for medical and clinical use and uses height and gender as inputs. The calculator also shows the weight range corresponding to a healthy BMI (18.5-24.9), providing additional context for your target weight.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formulas</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>Devine: IBW = 50 + 2.3 × (height in inches - 60)</strong></p>
                <p className="mb-2"><strong>Robinson: IBW = 52 + 1.9 × (height in inches - 60)</strong></p>
                <p className="mb-2"><strong>Miller: IBW = 56.2 + 1.41 × (height in inches - 60)</strong></p>
                <p className="text-xs text-slate-500">Adjustments of -2kg apply for women in each formula</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Ideal Weight Range:</strong> A healthy target based on averaging all formulas.</li>
                <li><strong>BMI Range:</strong> Weights corresponding to healthy BMI (18.5-24.9).</li>
                <li><strong>Formula Values:</strong> Individual estimates from each formula.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Treating it as exact:</strong> These are estimates, not definitive health standards.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring muscle mass:</strong> Athletes may weigh more but still be healthy.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Consider the range</strong> and focus on sustainable health habits rather than a single number.</p>
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
