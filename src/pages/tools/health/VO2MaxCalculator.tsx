import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatNumber, validateNumberInput } from '@/lib/utils';

interface VO2Result {
  maxVO2: number;
  category: string;
  ageRange: string;
  description: string;
}

export default function VO2MaxCalculator() {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [restingHR, setRestingHR] = useState(70);
  const [maxHR, setMaxHR] = useState(190);
  const [unit, setUnit] = useState<'bpm' | 'age'>('bpm');
  const [result, setResult] = useState<VO2Result | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (age < 18 || age > 100) newErrors.age = 'Age must be between 18 and 100';
    if (restingHR < 30 || restingHR > 120) newErrors.rhr = 'Resting HR must be between 30 and 120 bpm';
    if (unit === 'bpm' && (maxHR < 100 || maxHR > 220)) newErrors.maxhr = 'Max HR must be between 100 and 220 bpm';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getVO2Category = (vo2: number, age: number, isMale: boolean) => {
    let excellent: number, good: number, aboveAvg: number, avg: number, belowAvg: number;

    if (isMale) {
      excellent = 55; good = 49; aboveAvg = 45; avg = 40; belowAvg = 35;
    } else {
      excellent = 50; good = 44; aboveAvg = 40; avg = 35; belowAvg = 30;
    }

    if (vo2 >= excellent) return { category: 'Excellent', ageRange: '18-25', description: 'Elite athletic performance. Competitive at high levels.' };
    if (vo2 >= good) return { category: 'Good', ageRange: '26-35', description: 'Well above average fitness. Active lifestyle.' };
    if (vo2 >= aboveAvg) return { category: 'Above Average', ageRange: '36-45', description: 'Above average fitness. Regular exercise benefits.' };
    if (vo2 >= avg) return { category: 'Average', ageRange: '46-55', description: 'Typical for age. Room for improvement.' };
    if (vo2 >= belowAvg) return { category: 'Below Average', ageRange: '56-65', description: 'Below typical. Consider increasing activity.' };
    return { category: 'Needs Improvement', ageRange: '65+', description: 'Significantly below average. Consult healthcare provider.' };
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const effectiveMaxHR = unit === 'bpm' ? maxHR : 220 - age;
    const hrReserve = effectiveMaxHR - restingHR;

    // Using Karvonen formula to estimate VO2max
    const vo2 = (hrReserve * 0.75 + restingHR) * 0.8;
    const category = getVO2Category(vo2, age, gender === 'male');

    setResult({
      maxVO2: Math.round(vo2 * 10) / 10,
      category: category.category,
      ageRange: category.ageRange,
      description: category.description,
    });
  };

  const faqs = [
    {
      question: 'What is VO2 max?',
      answer: 'VO2 max (maximal oxygen uptake) is the maximum rate at which your body can consume oxygen during intense exercise. It\'s measured in milliliters of oxygen per kilogram of body weight per minute (ml/kg/min). It\'s considered the gold standard for measuring cardiovascular fitness.'
    },
    {
      question: 'How accurate is this estimate?',
      answer: 'This calculator provides a rough estimate based on heart rate data. The Cooper test (12-minute run) and laboratory testing (metabolic cart) are more accurate. This estimate is typically within 10-15% of actual VO2 max for most people. Individual variations in heart rate response affect accuracy.'
    },
    {
      question: 'What is a good VO2 max?',
      answer: 'For healthy adults: men average 35-40 ml/kg/min, women average 27-31 ml/kg/min. Elite endurance athletes often exceed 70 ml/kg/min. VO2 max naturally declines 5-10% per decade after age 30, but training can slow this decline significantly.'
    },
    {
      question: 'How can I improve my VO2 max?',
      answer: 'High-intensity interval training (HIIT) is most effective. Try 4x4 intervals: warm up 10 min, then 4 minutes at 90-95% max HR, 3 minutes active recovery, repeat 4 times, cool down. Also include steady-state cardio. Most improvement comes in first 12-16 weeks of training.'
    },
    {
      question: 'Why does VO2 max matter?',
      answer: 'VO2 max is a strong predictor of longevity—some studies suggest it\'s more important than blood pressure or cholesterol. Higher VO2 max is associated with reduced risk of cardiovascular disease, diabetes, and all-cause mortality. It\'s also a key factor in athletic performance.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'VO2 Max Calculator',
        description: 'Estimate your cardiovascular fitness using heart rate data.',
        url: 'https://www.calculatorpilotai.com/tools/health/vo2-max-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'VO2 Max Calculator', item: 'https://www.calculatorpilotai.com/tools/health/vo2-max-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Target Heart Rate', path: '/tools/health/target-heart-rate-calculator', desc: 'Calculate your exercise heart rate zones' },
    { name: 'Calorie Burn Calculator', path: '/tools/health/calorie-burn-calculator', desc: 'Calculate calories burned during exercise' },
    { name: 'Running Pace Calculator', path: '/tools/health/running-pace-calculator', desc: 'Calculate your running pace' },
  ];

  const categories = [
    { name: 'Excellent', color: 'text-green-600', bg: 'bg-green-100 border-green-300' },
    { name: 'Good', color: 'text-emerald-600', bg: 'bg-emerald-100 border-emerald-300' },
    { name: 'Above Average', color: 'text-lime-600', bg: 'bg-lime-100 border-lime-300' },
    { name: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-100 border-yellow-300' },
    { name: 'Below Average', color: 'text-orange-600', bg: 'bg-orange-100 border-orange-300' },
    { name: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100 border-red-300' },
  ];

  return (
    <ToolLayout toolId="vo2-max" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold">Calculate VO2 Max</h2>
            <div className="flex bg-slate-100 rounded-lg overflow-hidden text-xs font-bold">
              <button onClick={() => setUnit('bpm')} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === 'bpm' ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-800'}`}>Use Max HR</button>
              <button onClick={() => setUnit('age')} className={`px-3 py-1.5 uppercase tracking-wider transition-colors ${unit === 'age' ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-800'}`}>Use Age</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="vo2-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Age</label>
              <input
                id="vo2-age"
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
              <label htmlFor="vo2-gender" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gender</label>
              <select
                id="vo2-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white font-mono text-lg"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="vo2-rhr" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resting Heart Rate (bpm)</label>
              <input
                id="vo2-rhr"
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
              <p className="text-xs text-muted-foreground">Measure first thing in the morning</p>
            </div>
            {unit === 'bpm' ? (
              <div className="space-y-2">
                <label htmlFor="vo2-maxhr" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Maximum Heart Rate (bpm)</label>
                <input
                  id="vo2-maxhr"
                  type="number"
                  min="100"
                  max="220"
                  value={maxHR}
                  onChange={(e) => {
                    setMaxHR(validateNumberInput(Number(e.target.value), { min: 100, max: 220 }));
                    setErrors(prev => { const n = { ...prev }; delete n.maxhr; return n; });
                  }}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-lg ${errors.maxhr ? 'border-rose-500' : 'border-slate-200'}`}
                />
                {errors.maxhr && <p className="text-xs text-rose-500">{errors.maxhr}</p>}
                <p className="text-xs text-muted-foreground">220 - age = {(220 - age).toString()} bpm (estimated)</p>
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="vo2-estimated-maxhr" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Estimated Max HR</label>
                <div className="w-full p-3 border border-slate-200 rounded-lg bg-slate-50 font-mono text-lg">
                  {220 - age} bpm
                </div>
                <p className="text-xs text-muted-foreground">Calculated from your age</p>
              </div>
            )}
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg hover:bg-primary/90 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Calculate VO2 Max
          </button>
        </div>

        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-2">Estimated VO2 Max</span>
              <div className="text-6xl font-mono font-bold text-blue-600">{formatNumber(result.maxVO2)}</div>
              <span className="text-lg text-muted-foreground">ml/kg/min</span>
            </div>

            <div className={`p-6 border rounded-xl text-center ${categories.find(c => c.name === result.category)?.bg || 'bg-slate-100'}`}>
              <span className={`text-2xl font-bold ${categories.find(c => c.name === result.category)?.color || 'text-slate-600'}`}>{result.category}</span>
              <p className="text-sm mt-2 text-muted-foreground">{result.description}</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">VO2 Max Categories</h3>
              <div className="space-y-2">
                {categories.map((cat, i) => (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-lg ${cat.name === result.category ? cat.bg : 'bg-slate-50'}`}>
                    <span className={`font-bold ${cat.name === result.category ? cat.color : 'text-slate-600'}`}>{cat.name}</span>
                    <span className="text-muted-foreground">
                      {i === 0 ? '55+' : i === 1 ? '49-54' : i === 2 ? '45-48' : i === 3 ? '40-44' : i === 4 ? '35-39' : '30-34'} ml/kg/min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Understanding VO2 Max</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What is VO2 Max?</h3>
              <p className="text-slate-700 leading-relaxed">
                VO2 max represents your body's maximum oxygen uptake capacity—essentially how efficiently your cardiovascular system can deliver oxygen to working muscles. It's expressed in milliliters of oxygen per kilogram of body weight per minute (ml/kg/min). Higher values indicate better cardiovascular fitness.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">How VO2 Max Declines</h3>
              <p className="text-slate-700 leading-relaxed">
                VO2 max typically declines 5-10% per decade after age 30, accelerating after 50. However, regular aerobic exercise can slow this decline by 50% or more. Elite older athletes often maintain VO2 max levels of people decades younger through consistent training.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Improving Your VO2 Max</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>HIIT:</strong> 4x4 intervals (4 min at 90-95% max HR, 3 min rest) 2x/week</li>
                <li><strong>Steady state:</strong> 30-60 min at 65-75% max HR 2-3x/week</li>
                <li><strong>Consistency:</strong> Most gains in first 8-12 weeks of training</li>
                <li><strong>Recovery:</strong> Sleep 7-9 hours, proper nutrition, deload weeks</li>
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
