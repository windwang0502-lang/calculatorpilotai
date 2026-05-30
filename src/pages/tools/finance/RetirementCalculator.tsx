import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, formatPercent, validateNumberInput } from '@/lib/utils';

interface RetirementResult {
  totalSavings: number;
  monthlyIncome: number;
  totalContributions: number;
  totalGrowth: number;
  meetsGoal: boolean;
}

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [employerMatch, setEmployerMatch] = useState(3);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [desiredIncome, setDesiredIncome] = useState(60000);
  const [result, setResult] = useState<RetirementResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (currentAge < 18 || currentAge > 80) newErrors.currentAge = 'Please enter a valid age between 18 and 80';
    if (retirementAge <= currentAge) newErrors.retirementAge = 'Retirement age must be greater than current age';
    if (retirementAge > 100) newErrors.retirementAge = 'Retirement age seems too high';
    if (currentSavings < 0) newErrors.currentSavings = 'Current savings cannot be negative';
    if (monthlyContribution < 0) newErrors.monthlyContribution = 'Monthly contribution cannot be negative';
    if (employerMatch < 0 || employerMatch > 100) newErrors.employerMatch = 'Enter a valid percentage';
    if (annualReturn < -10 || annualReturn > 30) newErrors.annualReturn = 'Return rate seems unrealistic';
    if (desiredIncome < 0) newErrors.desiredIncome = 'Desired income cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const yearsToRetirement = retirementAge - currentAge;
    const totalMonthlyContribution = monthlyContribution * (1 + employerMatch / 100);
    const monthlyRate = annualReturn / 100 / 12;
    const months = yearsToRetirement * 12;

    const futureValueSavings = currentSavings * Math.pow(1 + monthlyRate, months);
    const futureValueContributions = totalMonthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const totalSavings = futureValueSavings + futureValueContributions;

    const totalContributions = currentSavings + (totalMonthlyContribution * months);
    const totalGrowth = totalSavings - totalContributions;

    const withdrawalRate = 0.04;
    const monthlyIncome = (totalSavings * withdrawalRate) / 12;
    const meetsGoal = monthlyIncome >= desiredIncome / 12;

    setResult({ totalSavings, monthlyIncome, totalContributions, totalGrowth, meetsGoal });
  };

  const clearError = (key: string) => {
    setErrors(prev => {
      const n = { ...prev };
      delete n[key];
      return n;
    });
  };

  const faqs = [
    {
      question: 'What is the 4% withdrawal rule?',
      answer: 'The 4% rule suggests you can withdraw 4% of your retirement savings annually without running out of money over a 30-year retirement. This means you need 25 times your desired annual income. Our calculator uses this rule to estimate your sustainable monthly income.'
    },
    {
      question: 'How does employer matching work?',
      answer: 'Employer matching means your employer contributes a percentage of your salary to your retirement account. If your employer matches 3% and you earn $80,000, they add $2,400/year. This is essentially free money—always contribute enough to get the full match.'
    },
    {
      question: 'How much should I contribute to retirement?',
      answer: 'Financial advisors often recommend saving 15-20% of your income for retirement. If that is not feasible, at least contribute enough to get your full employer match. As your income grows, try to increase contributions. The key is to start early and be consistent.'
    },
    {
      question: 'What rate of return should I expect?',
      answer: 'Historically, a balanced portfolio of stocks and bonds has returned about 7% annually after inflation. More aggressive portfolios may return more but with higher volatility. Conservative portfolios may return 4-5%. Consider your risk tolerance and time horizon when choosing an expected return.'
    },
    {
      question: 'When should I start saving for retirement?',
      answer: 'Start as early as possible. Thanks to compound interest, money invested in your 20s has decades to grow. Someone investing $200/month from age 25 to 65 at 7% will have about $525,000, while starting at 35 with the same contribution yields only about $244,000.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Retirement Calculator',
        description: 'Plan for retirement by calculating your projected savings, monthly income, and whether you are on track to meet your retirement goals.',
        url: 'https://www.calculatorpilotai.com/tools/finance/retirement-calculator',
        applicationCategory: 'FinanceApplication',
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
          { '@type': 'ListItem', position: 2, name: 'Finance', item: 'https://www.calculatorpilotai.com/tools/finance' },
          { '@type': 'ListItem', position: 3, name: 'Retirement Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/retirement-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: '401k Calculator', path: '/tools/finance/401k-calculator', desc: 'Calculate 401k growth with employer match' },
    { name: 'Investment Calculator', path: '/tools/finance/investment-calculator', desc: 'Project investment growth over time' },
    { name: 'FIRE Calculator', path: '/tools/finance/fire-calculator', desc: 'Calculate your FIRE number and timeline' },
  ];

  return (
    <ToolLayout toolId="retirement" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Retirement Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="current-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Age</label>
              <input
                id="current-age"
                type="number"
                min="18"
                max="80"
                value={currentAge}
                onChange={(e) => { setCurrentAge(validateNumberInput(e.target.value, { min: 18, max: 80 })); clearError('currentAge'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.currentAge ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.currentAge && <p className="text-xs text-rose-500">{errors.currentAge}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="retirement-age" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Retirement Age</label>
              <input
                id="retirement-age"
                type="number"
                min="30"
                max="100"
                value={retirementAge}
                onChange={(e) => { setRetirementAge(validateNumberInput(e.target.value, { min: 30, max: 100 })); clearError('retirementAge'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.retirementAge ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.retirementAge && <p className="text-xs text-rose-500">{errors.retirementAge}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="current-savings" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Retirement Savings ($)</label>
              <input
                id="current-savings"
                type="number"
                min="0"
                step="1000"
                value={currentSavings}
                onChange={(e) => { setCurrentSavings(validateNumberInput(e.target.value, { min: 0 })); clearError('currentSavings'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.currentSavings ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.currentSavings && <p className="text-xs text-rose-500">{errors.currentSavings}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="monthly-contribution" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Monthly Contribution ($)</label>
              <input
                id="monthly-contribution"
                type="number"
                min="0"
                step="50"
                value={monthlyContribution}
                onChange={(e) => { setMonthlyContribution(validateNumberInput(e.target.value, { min: 0 })); clearError('monthlyContribution'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.monthlyContribution ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.monthlyContribution && <p className="text-xs text-rose-500">{errors.monthlyContribution}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="employer-match" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Employer Match (%)</label>
              <input
                id="employer-match"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={employerMatch}
                onChange={(e) => { setEmployerMatch(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('employerMatch'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.employerMatch ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.employerMatch && <p className="text-xs text-rose-500">{errors.employerMatch}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="annual-return" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Expected Annual Return (%)</label>
              <input
                id="annual-return"
                type="number"
                min="-10"
                max="30"
                step="0.5"
                value={annualReturn}
                onChange={(e) => { setAnnualReturn(validateNumberInput(e.target.value, { min: -10, max: 30 })); clearError('annualReturn'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.annualReturn ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.annualReturn && <p className="text-xs text-rose-500">{errors.annualReturn}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="desired-income" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Desired Annual Retirement Income ($)</label>
              <input
                id="desired-income"
                type="number"
                min="0"
                step="1000"
                value={desiredIncome}
                onChange={(e) => { setDesiredIncome(validateNumberInput(e.target.value, { min: 0 })); clearError('desiredIncome'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.desiredIncome ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.desiredIncome && <p className="text-xs text-rose-500">{errors.desiredIncome}</p>}
            </div>
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Retirement
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`p-6 rounded-xl text-center ${result.meetsGoal ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${result.meetsGoal ? 'text-emerald-600' : 'text-amber-600'}`}>
                {result.meetsGoal ? 'On Track for Retirement' : 'May Need to Adjust'}
              </span>
              <div className="text-3xl md:text-4xl font-mono font-black mt-2 text-slate-900">{formatCurrency(result.totalSavings)}</div>
              <span className="text-sm text-slate-500">Projected Retirement Savings</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Monthly Income</span>
                <div className={`text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere ${result.monthlyIncome >= desiredIncome / 12 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {formatCurrency(result.monthlyIncome)}
                </div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Total Contributions</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalContributions)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Investment Growth</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-emerald-600 tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.totalGrowth)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Years to Retire</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{retirementAge - currentAge}</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Retirement Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Retirement Calculator helps you estimate how much you will have saved by retirement and whether that will be enough to support your desired lifestyle. It accounts for your current savings, ongoing contributions, employer matching, and expected investment returns.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Key Retirement Planning Concepts</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Compound Growth:</strong> Your money grows exponentially over time through compound interest</li>
                <li><strong>Employer Match:</strong> Free money from your employer—always maximize this benefit</li>
                <li><strong>4% Rule:</strong> A safe withdrawal rate that suggests you need 25x your annual expenses</li>
                <li><strong>Time Horizon:</strong> The more years until retirement, the more risk you can typically take</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Tips for Retirement Planning</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p><strong>Start early:</strong> Time is your greatest asset for building retirement wealth</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p><strong>Maximize employer match:</strong> Do not leave free money on the table</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <p><strong>Increase contributions:</strong> Raise your savings rate when you get raises</p>
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
          <h2 className="text-3xl font-bold mb-8 text-center">Related Financial Calculators</h2>
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
