import React, { useState, useMemo } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { validateNumberInput } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell, LabelList
} from 'recharts';

type Gender = 'male' | 'female';
type UnitSystem = 'imperial' | 'metric';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

interface CalorieResult {
  bmr: number;
  tdee: number;
  weightLoss: number;
  maintenance: number;
  weightGain: number;
  weeklyLoss: number;
  weeklyGain: number;
}

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Light (exercise 1-3 days/week)',
  moderate: 'Moderate (exercise 3-5 days/week)',
  active: 'Active (exercise 6-7 days/week)',
  very_active: 'Very Active (hard exercise daily)',
};

function calculateCalories(
  gender: Gender,
  age: number,
  heightCm: number,
  weightKg: number,
  activity: ActivityLevel
): CalorieResult {
  // Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const tdee = Math.round(bmr * activityMultipliers[activity]);
  const weightLoss = Math.round(tdee - 500);
  const maintenance = tdee;
  const weightGain = Math.round(tdee + 500);

  // Weekly targets (deficit/surplus × 7)
  const weeklyLoss = weightLoss * 7;
  const weeklyGain = weightGain * 7;

  return {
    bmr: Math.round(bmr),
    tdee,
    weightLoss,
    maintenance,
    weightGain,
    weeklyLoss,
    weeklyGain,
  };
}

function convertToMetric(heightFt: number, heightIn: number, weightLb: number): { heightCm: number; weightKg: number } {
  const totalInches = heightFt * 12 + heightIn;
  const heightCm = totalInches * 2.54;
  const weightKg = weightLb * 0.453592;
  return { heightCm, weightKg };
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

export default function CalorieCalculator() {
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState(30);
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('imperial');
  const [heightFt, setHeightFt] = useState(5);
  const [heightIn, setHeightIn] = useState(9);
  const [heightCm, setHeightCm] = useState(175);
  const [weightLb, setWeightLb] = useState(160);
  const [weightKg, setWeightKg] = useState(73);
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (age < 15 || age > 120) {
      newErrors.age = 'Age must be between 15 and 120';
    }

    if (unitSystem === 'imperial') {
      if (heightFt < 3 || heightFt > 8) {
        newErrors.heightFt = 'Height must be between 3 and 8 feet';
      }
      if (weightLb < 50 || weightLb > 700) {
        newErrors.weightLb = 'Weight must be between 50 and 700 pounds';
      }
    } else {
      if (heightCm < 100 || heightCm > 250) {
        newErrors.heightCm = 'Height must be between 100 and 250 cm';
      }
      if (weightKg < 20 || weightKg > 320) {
        newErrors.weightKg = 'Weight must be between 20 and 320 kg';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;

    let heightCmVal: number;
    let weightKgVal: number;

    if (unitSystem === 'imperial') {
      const converted = convertToMetric(heightFt, heightIn, weightLb);
      heightCmVal = converted.heightCm;
      weightKgVal = converted.weightKg;
    } else {
      heightCmVal = heightCm;
      weightKgVal = weightKg;
    }

    const res = calculateCalories(gender, age, heightCmVal, weightKgVal, activity);
    setResult(res);
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  const chartData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Weight Loss', value: result.weightLoss, fill: '#ef4444' },
      { name: 'BMR', value: result.bmr, fill: '#6366f1' },
      { name: 'Maintenance', value: result.maintenance, fill: '#10b981' },
      { name: 'Weight Gain', value: result.weightGain, fill: '#f59e0b' },
    ];
  }, [result]);

  const faqs = [
    {
      question: 'What is BMR and how is it calculated?',
      answer: 'BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest to maintain vital functions like breathing, circulation, and cell production. It\'s calculated using the Mifflin-St Jeor equation, which considers your weight, height, age, and gender. BMR typically accounts for 60-75% of your total daily energy expenditure.'
    },
    {
      question: 'What is TDEE and why is it important?',
      answer: 'TDEE (Total Daily Energy Expenditure) is your BMR plus calories burned through physical activity. It represents the total calories you burn in a day. To maintain your current weight, you should consume approximately your TDEE. To lose weight, consume fewer calories than your TDEE; to gain weight, consume more.'
    },
    {
      question: 'How many calories should I eat to lose weight safely?',
      answer: 'A safe and sustainable rate of weight loss is about 1-2 pounds per week, which requires a daily deficit of 500-1000 calories. This creates a weekly deficit of 3,500-7,000 calories (3,500 calories equals approximately 1 pound of body fat). Never consume fewer than your BMR, as this can slow metabolism and cause muscle loss.'
    },
    {
      question: 'What is the best activity multiplier for my lifestyle?',
      answer: 'Choose based on your typical weekly activity: Sedentary (1.2) for desk job with little exercise; Light (1.375) for light exercise 1-3 days/week; Moderate (1.55) for moderate exercise 3-5 days/week; Active (1.725) for hard exercise 6-7 days/week; Very Active (1.9) for very hard exercise or physical job plus daily training.'
    },
    {
      question: 'How accurate are calorie calculators?',
      answer: 'Calorie calculators estimate your needs based on population-level formulas, so actual needs may vary by 10-20%. Factors like genetics, hormone levels, muscle mass, and medical conditions affect your actual calorie needs. Use the calculator as a starting point and adjust based on your results over 2-3 weeks.'
    },
    {
      question: 'Should I eat back exercise calories?',
      answer: 'It depends on your goal. If weight loss has stalled, you may be overestimating activity and should not eat back exercise calories. If you\'re extremely active or an athlete, eating back some (not all) exercise calories may help sustain energy. Most calculators already include activity in TDEE, so eating additional calories requires careful tracking.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Calorie Calculator',
        description: 'Calculate your daily calorie needs including BMR, TDEE, and targets for weight loss or gain based on activity level.',
        url: 'https://www.calculatorpilotai.com/tools/health/calorie-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Calorie Calculator', item: 'https://www.calculatorpilotai.com/tools/health/calorie-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', desc: 'Calculate your body mass index and category' },
    { name: 'BMR Calculator', path: '/tools/health/bmr-calculator', desc: 'Calculate your basal metabolic rate' },
    { name: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator', desc: 'Estimate your body fat percentage' },
  ];

  return (
    <ToolLayout toolId="calorie" category="health">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        {/* Calculator Input Section */}
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Your Daily Calorie Needs</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Gender
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    gender === 'male'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    gender === 'female'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label htmlFor="cc-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Age
              </label>
              <div className="relative">
                <input
                  id="cc-age"
                  type="number"
                  min="15"
                  max="120"
                  value={age}
                  onChange={(e) => { setAge(validateNumberInput(e.target.value, { min: 15, max: 120 })); clearError('age'); }}
                  className={`w-full pl-3 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.age ? 'border-rose-500' : 'border-slate-200'}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">years</span>
              </div>
              {errors.age && <p className="text-xs text-rose-500">{errors.age}</p>}
              <p className="text-xs text-muted-foreground">Your current age</p>
            </div>

            {/* Unit System Toggle */}
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Unit System
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setUnitSystem('imperial')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    unitSystem === 'imperial'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Imperial (ft/in, lb)
                </button>
                <button
                  type="button"
                  onClick={() => setUnitSystem('metric')}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                    unitSystem === 'metric'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  Metric (cm, kg)
                </button>
              </div>
            </div>

            {/* Height - Imperial */}
            {unitSystem === 'imperial' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Height
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      min="3"
                      max="8"
                      value={heightFt}
                      onChange={(e) => { setHeightFt(validateNumberInput(e.target.value, { min: 3, max: 8 })); clearError('heightFt'); }}
                      className={`w-full pl-3 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.heightFt ? 'border-rose-500' : 'border-slate-200'}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">ft</span>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="number"
                      min="0"
                      max="11"
                      value={heightIn}
                      onChange={(e) => { setHeightIn(validateNumberInput(e.target.value, { min: 0, max: 11 })); clearError('heightFt'); }}
                      className="w-full pl-3 pr-10 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">in</span>
                  </div>
                </div>
                {errors.heightFt && <p className="text-xs text-rose-500">{errors.heightFt}</p>}
                <p className="text-xs text-muted-foreground">Your height in feet and inches</p>
              </div>
            )}

            {/* Height - Metric */}
            {unitSystem === 'metric' && (
              <div className="space-y-2">
                <label htmlFor="cc-height-cm" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Height
                </label>
                <div className="relative">
                  <input
                    id="cc-height-cm"
                    type="number"
                    min="100"
                    max="250"
                    value={heightCm}
                    onChange={(e) => { setHeightCm(validateNumberInput(e.target.value, { min: 100, max: 250 })); clearError('heightCm'); }}
                    className={`w-full pl-3 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.heightCm ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">cm</span>
                </div>
                {errors.heightCm && <p className="text-xs text-rose-500">{errors.heightCm}</p>}
                <p className="text-xs text-muted-foreground">Your height in centimeters</p>
              </div>
            )}

            {/* Weight - Imperial */}
            {unitSystem === 'imperial' && (
              <div className="space-y-2">
                <label htmlFor="cc-weight-lb" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Weight
                </label>
                <div className="relative">
                  <input
                    id="cc-weight-lb"
                    type="number"
                    min="50"
                    max="700"
                    value={weightLb}
                    onChange={(e) => { setWeightLb(validateNumberInput(e.target.value, { min: 50, max: 700 })); clearError('weightLb'); }}
                    className={`w-full pl-3 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.weightLb ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">lb</span>
                </div>
                {errors.weightLb && <p className="text-xs text-rose-500">{errors.weightLb}</p>}
                <p className="text-xs text-muted-foreground">Your weight in pounds</p>
              </div>
            )}

            {/* Weight - Metric */}
            {unitSystem === 'metric' && (
              <div className="space-y-2">
                <label htmlFor="cc-weight-kg" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Weight
                </label>
                <div className="relative">
                  <input
                    id="cc-weight-kg"
                    type="number"
                    min="20"
                    max="320"
                    value={weightKg}
                    onChange={(e) => { setWeightKg(validateNumberInput(e.target.value, { min: 20, max: 320 })); clearError('weightKg'); }}
                    className={`w-full pl-3 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.weightKg ? 'border-rose-500' : 'border-slate-200'}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">kg</span>
                </div>
                {errors.weightKg && <p className="text-xs text-rose-500">{errors.weightKg}</p>}
                <p className="text-xs text-muted-foreground">Your weight in kilograms</p>
              </div>
            )}

            {/* Activity Level - Full Width */}
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="cc-activity" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Activity Level
              </label>
              <select
                id="cc-activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value as ActivityLevel)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="sedentary">Sedentary (little or no exercise)</option>
                <option value="light">Light (exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (exercise 3-5 days/week)</option>
                <option value="active">Active (exercise 6-7 days/week)</option>
                <option value="very_active">Very Active (hard exercise daily)</option>
              </select>
              <p className="text-xs text-muted-foreground">Your typical weekly physical activity level</p>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-6 w-full sm:w-auto sm:px-12 bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-wider focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Calories
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {/* BMR */}
              <div className="p-4 md:p-5 bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 rounded-xl text-center">
                <span className="text-xs font-bold text-violet-700 uppercase tracking-wider block mb-2">BMR</span>
                <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-violet-700 tabular-nums">
                  {formatNumber(result.bmr)}
                </div>
                <div className="text-xs text-violet-600 mt-1">kcal/day</div>
              </div>

              {/* Weight Loss */}
              <div className="p-4 md:p-5 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl text-center">
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider block mb-2">Weight Loss</span>
                <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-red-700 tabular-nums">
                  {formatNumber(result.weightLoss)}
                </div>
                <div className="text-xs text-red-600 mt-1">kcal/day</div>
              </div>

              {/* Maintenance */}
              <div className="p-4 md:p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl text-center">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Maintenance</span>
                <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-emerald-700 tabular-nums">
                  {formatNumber(result.maintenance)}
                </div>
                <div className="text-xs text-emerald-600 mt-1">kcal/day</div>
              </div>

              {/* Weight Gain */}
              <div className="p-4 md:p-5 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl text-center">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Weight Gain</span>
                <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-amber-700 tabular-nums">
                  {formatNumber(result.weightGain)}
                </div>
                <div className="text-xs text-amber-600 mt-1">kcal/day</div>
              </div>
            </div>

            {/* Daily Calorie Breakdown */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
              <h3 className="text-lg font-bold mb-4">Daily Calorie Targets</h3>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
                <div className="text-center min-w-[100px]">
                  <div className="text-base md:text-lg font-mono font-bold text-violet-600">{formatNumber(result.bmr)}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">BMR (Rest)</div>
                </div>
                <div className="text-slate-300 hidden sm:block">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="text-center min-w-[100px]">
                  <div className="text-base md:text-lg font-mono font-bold text-slate-500">{activityLabels[activity].split(' ')[0]}</div>
                  <div className="text-xs md:text-sm text-slate-500 mt-1">Activity Factor</div>
                </div>
                <div className="text-slate-300 hidden sm:block">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="text-center min-w-[100px]">
                  <div className="text-base md:text-lg font-mono font-bold text-primary">{formatNumber(result.tdee)}</div>
                  <div className="text-xs md:text-sm text-primary mt-1">TDEE (Total)</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Your Basal Metabolic Rate (BMR) is the calories your body burns at complete rest. TDEE includes all daily activities.
              </p>
            </div>

            {/* Weekly Targets */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-5 text-center">
                <h4 className="font-semibold text-red-800 mb-2">Weekly Weight Loss Target</h4>
                <div className="text-2xl md:text-3xl font-mono font-bold text-red-700">
                  {formatNumber(result.weeklyLoss)}
                </div>
                <p className="text-sm text-red-600 mt-1">calories/week</p>
                <p className="text-xs text-red-500 mt-2">~1 lb loss per week</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 text-center">
                <h4 className="font-semibold text-amber-800 mb-2">Weekly Weight Gain Target</h4>
                <div className="text-2xl md:text-3xl font-mono font-bold text-amber-700">
                  {formatNumber(result.weeklyGain)}
                </div>
                <p className="text-sm text-amber-600 mt-1">calories/week</p>
                <p className="text-xs text-amber-500 mt-2">~1 lb gain per week</p>
              </div>
            </div>

            {/* Calorie Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-bold mb-4">Calorie Target Comparison</h3>
              <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
                      width={50}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${formatNumber(value)} kcal`, 'Calories']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <LabelList
                        dataKey="value"
                        position="top"
                        formatter={(value: number) => `${formatNumber(value)}`}
                        style={{ fontSize: 12, fontWeight: 600 }}
                      />
                    </Bar>
                    <ReferenceLine y={result.maintenance} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'Maintenance', fill: '#10b981', fontSize: 11 }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-3 text-center">
                The green dashed line indicates your maintenance calories. To lose weight, consume fewer calories; to gain weight, consume more.
              </p>
            </div>

            {/* Macronutrient Estimates */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
              <h3 className="text-lg font-bold mb-4">Estimated Daily Macronutrients (Maintenance)</h3>
              <p className="text-sm text-muted-foreground mb-4">Based on a balanced diet distribution (moderate calories from carbs)</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{Math.round(result.tdee * 0.25 / 4)}g</div>
                  <div className="text-sm text-blue-500 mt-1">Protein</div>
                  <div className="text-xs text-blue-400 mt-1">25% of calories</div>
                </div>
                <div className="text-center p-4 bg-amber-50 rounded-xl">
                  <div className="text-2xl font-bold text-amber-600">{Math.round(result.tdee * 0.30 / 9)}g</div>
                  <div className="text-sm text-amber-500 mt-1">Fat</div>
                  <div className="text-xs text-amber-400 mt-1">30% of calories</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{Math.round(result.tdee * 0.45 / 4)}g</div>
                  <div className="text-sm text-green-500 mt-1">Carbs</div>
                  <div className="text-xs text-green-400 mt-1">45% of calories</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                These are estimates for a balanced diet. Adjust macronutrient ratios based on your specific goals (low-carb, high-protein, etc.).
              </p>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Calorie Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Calorie Calculator estimates your daily calorie needs to maintain your current weight, plus targets for weight loss and weight gain. It calculates your BMR (calories at rest) using the Mifflin-St Jeor equation and applies activity multipliers to estimate your TDEE. This helps you set appropriate calorie goals for any fitness objective.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator first determines your BMR, which represents calories burned at complete rest. It then multiplies this by an activity factor (1.2 to 1.9) based on your typical weekly exercise. The result is your TDEE - total daily energy expenditure. Weight loss and gain targets are created by adjusting this number by 500 calories per day.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formulas</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>BMR (Male) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5</strong></p>
                <p className="mb-2"><strong>BMR (Female) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161</strong></p>
                <p className="mb-2"><strong>TDEE = BMR × Activity Multiplier</strong></p>
                <p className="text-xs text-slate-500">Weight Loss: TDEE - 500 | Weight Gain: TDEE + 500</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>BMR:</strong> Calories your body burns at complete rest.</li>
                <li><strong>Maintenance:</strong> Calories to maintain your current weight.</li>
                <li><strong>Weight Loss:</strong> Target calories for safe weight loss (~1 lb/week).</li>
                <li><strong>Weight Gain:</strong> Target calories for healthy weight gain (~1 lb/week).</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Eating below BMR:</strong> Severely restricting calories can slow metabolism and cause muscle loss.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Overestimating activity:</strong> Be honest about your typical weekly exercise to get accurate TDEE.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Track for 2-3 weeks</strong> and adjust based on actual weight changes, not just calculator numbers.</p>
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
