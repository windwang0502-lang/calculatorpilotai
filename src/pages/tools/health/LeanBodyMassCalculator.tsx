import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, getResultTextSize, validateNumberInput } from '@/lib/utils';

interface LeanMassResult {
  leanMassKg: number;
  leanMassLb: number;
  fatMassKg: number;
  fatMassLb: number;
}

export default function LeanBodyMassCalculator() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightKg, setWeightKg] = useState(75);
  const [bodyFatPercent, setBodyFatPercent] = useState(20);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<LeanMassResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const weightDisplay = unit === 'metric' ? weightKg : Math.round(weightKg * 2.20462 * 10) / 10;
  const weightFromDisplay = (val: number) => unit === 'metric' ? val : val / 2.20462;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (weightKg <= 0 || weightKg > 500) newErrors.weight = 'Weight must be between 1 and 500 kg';
    if (bodyFatPercent < 1 || bodyFatPercent > 70) newErrors.bodyFat = 'Body fat must be between 1% and 70%';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const fatMassKg = weightKg * (bodyFatPercent / 100);
    const leanMassKg = weightKg - fatMassKg;
    setResult({
      leanMassKg,
      leanMassLb: leanMassKg * 2.20462,
      fatMassKg,
      fatMassLb: fatMassKg * 2.20462,
    });
  };

  const faqs = [
    {
      question: 'What is lean body mass?',
      answer: 'Lean body mass (LBM) is your total body weight minus the weight of your body fat. It includes muscle, bone, organs, skin, and other non-fat tissues. LBM is typically higher in men than women due to hormonal differences and body composition patterns.'
    },
    {
      question: 'How is lean body mass calculated?',
      answer: 'This calculator uses a simple formula: LBM = Weight × (1 - Body Fat %). For example, if you weigh 80 kg and have 20% body fat, your lean mass is 80 × 0.80 = 64 kg. More accurate methods include bioelectrical impedance analysis, DEXA scans, or underwater weighing.'
    },
    {
      question: 'Why is knowing your lean body mass useful?',
      answer: 'LBM is important for several reasons: it helps calculate daily caloric needs (more muscle burns more calories), determines protein requirements, and provides a baseline for tracking muscle gain or loss during fitness programs. Athletes and bodybuilders often track LBM to measure progress.'
    },
    {
      question: 'What is a healthy lean body mass?',
      answer: 'Healthy LBM varies significantly based on height, gender, and body frame. For adult men, LBM typically ranges from 60-90% of body weight. For adult women, it typically ranges from 50-75%. Athletes may have lower body fat but higher LBM percentages due to muscular development.'
    },
    {
      question: 'How can I increase my lean body mass?',
      answer: 'Building LBM requires a combination of resistance training (progressive overload), adequate protein intake (1.6-2.2g per kg bodyweight), sufficient sleep (7-9 hours), and a slight caloric surplus. Consistency over months and years is key to meaningful LBM gains.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Lean Body Mass Calculator',
        description: 'Calculate your lean body mass by subtracting fat mass from total body weight.',
        url: 'https://www.calculatorpilotai.com/tools/health/lean-body-mass-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Lean Body Mass Calculator', item: 'https://www.calculatorpilotai.com/tools/health/lean-body-mass-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator', desc: 'Estimate your body fat percentage' },
    { name: 'BMR Calculator', path: '/tools/health/bmr-calculator', desc: 'Calculate your basal metabolic rate' },
    { name: 'Macro Calculator', path: '/tools/health/macro-calculator', desc: 'Calculate your macros for fitness goals' },
  ];

  return (
    <ToolLayout toolId="lean-body-mass" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate Lean Body Mass</h2>
            <UnitToggle
              value={unit}
              onChange={(v) => setUnit(v as 'metric' | 'imperial')}
              options={[{ label: 'Metric', value: 'metric' }, { label: 'Imperial', value: 'imperial' }]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="lbm-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="lbm-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="lbm-weight" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Body Weight ({unit === 'metric' ? 'kg' : 'lb'})</label>
              <input
                id="lbm-weight"
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
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="lbm-bodyfat" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Body Fat Percentage (%)</label>
              <input
                id="lbm-bodyfat"
                type="number"
                min="1"
                max="70"
                step="0.1"
                value={bodyFatPercent}
                onChange={(e) => {
                  setBodyFatPercent(validateNumberInput(Number(e.target.value), { min: 1, max: 70 }));
                  setErrors(prev => { const n = { ...prev }; delete n.bodyFat; return n; });
                }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.bodyFat ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.bodyFat && <p className="text-xs text-rose-500">{errors.bodyFat}</p>}
              <p className="text-xs text-muted-foreground">If you don't know your body fat, use our Body Fat Calculator first.</p>
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate Lean Body Mass
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Your Lean Body Mass</span>
              <div className={`${getResultTextSize(formatNumber(result.leanMassKg, { decimals: 1 }) + ' kg')} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.leanMassKg, { decimals: 1 })} kg</div>
              <span className="text-lg text-muted-foreground">or {formatNumber(Math.round(result.leanMassLb))} lb</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Lean Mass</span>
                <div className={`${getResultTextSize(formatNumber(result.leanMassKg, { decimals: 1 }))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.leanMassKg, { decimals: 1 })} kg</div>
                <span className="text-sm text-muted-foreground">{formatNumber(result.leanMassLb, { decimals: 1 })} lb</span>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Fat Mass</span>
                <div className={`${getResultTextSize(formatNumber(result.fatMassKg, { decimals: 1 }))} font-mono font-bold tabular-nums leading-tight tracking-tight`}>{formatNumber(result.fatMassKg, { decimals: 1 })} kg</div>
                <span className="text-sm text-muted-foreground">{formatNumber(result.fatMassLb, { decimals: 1 })} lb</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Your Body Composition Summary</h3>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: `${100 - bodyFatPercent}%` }} />
                <div className="bg-orange-400 h-full" style={{ width: `${bodyFatPercent}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded mr-1"></span> Lean Mass</span>
                <span className="flex items-center"><span className="w-3 h-3 bg-orange-400 rounded mr-1"></span> Fat Mass</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding Lean Body Mass</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What is Lean Body Mass?</h3>
              <p className="text-slate-700 leading-relaxed">
                Lean body mass (LBM) represents everything in your body except fat - including muscles, bones, organs, skin, blood, and body water. It's a more meaningful metric than total weight because it indicates your metabolic tissue mass, which burns calories even at rest.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">How to Calculate</h3>
              <p className="text-slate-700 leading-relaxed">
                The formula is straightforward: Lean Body Mass = Body Weight × (1 - Body Fat %). For example, a 80 kg person with 20% body fat has 80 × 0.80 = 64 kg of lean mass. The remaining 16 kg is fat mass.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Why LBM Matters</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Metabolism:</strong> More LBM means higher resting calorie burn</li>
                <li><strong>Protein needs:</strong> LBM determines daily protein requirements</li>
                <li><strong>Fitness tracking:</strong> Track muscle gain separate from fat loss</li>
                <li><strong>Health assessment:</strong> More accurate than BMI for athletes</li>
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
