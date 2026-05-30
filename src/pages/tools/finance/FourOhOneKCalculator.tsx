import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, formatPercent, validateNumberInput } from '@/lib/utils';

interface FourOhOneKResult {
  employeeTotal: number;
  employerTotal: number;
  totalValue: number;
  interestEarned: number;
  monthlyIncome: number;
}

export default function FourOhOneKCalculator() {
  const [salary, setSalary] = useState(75000);
  const [employeeContribution, setEmployeeContribution] = useState(6);
  const [employerMatch, setEmployerMatch] = useState(50);
  const [employerCap, setEmployerCap] = useState(6);
  const [years, setYears] = useState(30);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [result, setResult] = useState<FourOhOneKResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (salary <= 0) newErrors.salary = 'Salary must be greater than 0';
    if (employeeContribution < 0 || employeeContribution > 100) newErrors.employeeContribution = 'Enter a valid percentage (0-100)';
    if (employerMatch < 0 || employerMatch > 100) newErrors.employerMatch = 'Enter a valid percentage (0-100)';
    if (employerCap < 0 || employerCap > 100) newErrors.employerCap = 'Enter a valid percentage (0-100)';
    if (years <= 0 || years > 50) newErrors.years = 'Enter a valid number of years (1-50)';
    if (annualReturn < -10 || annualReturn > 30) newErrors.annualReturn = 'Enter a realistic return rate (-10% to 30%)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const monthlyRate = annualReturn / 100 / 12;
    const months = years * 12;
    const annualEmployeeContribution = salary * (employeeContribution / 100);
    const actualEmployerMatch = Math.min(employeeContribution, employerCap) * (employerMatch / 100);
    const annualEmployerContribution = salary * actualEmployerMatch;
    const monthlyEmployee = annualEmployeeContribution / 12;
    const monthlyEmployer = annualEmployerContribution / 12;
    const totalMonthly = monthlyEmployee + monthlyEmployer;

    const employeeFuture = monthlyEmployee * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const employerFuture = monthlyEmployer * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    const totalValue = employeeFuture + employerFuture;

    const totalContributions = (annualEmployeeContribution + annualEmployerContribution) * years;
    const interestEarned = totalValue - totalContributions;

    const monthlyIncome = (totalValue * 0.04) / 12;

    setResult({
      employeeTotal: employeeFuture,
      employerTotal: employerFuture,
      totalValue,
      interestEarned,
      monthlyIncome
    });
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
      question: 'What is a 401k employer match?',
      answer: 'An employer match means your company matches a portion of your 401k contributions. For example, a 50% match up to 6% means if you contribute 6% of your salary, your employer adds 3%. This is essentially free money—always contribute enough to get the full match.'
    },
    {
      question: 'What are 401k contribution limits?',
      answer: 'For 2026, employees can contribute up to $23,500 to a 401k. If you are 50 or older, you can make catch-up contributions of an additional $7,500. These limits are set by the IRS and may increase annually.'
    },
    {
      question: 'Traditional vs. Roth 401k: which should I choose?',
      answer: 'Traditional 401k contributions reduce your taxable income now but withdrawals are taxed in retirement. Roth 401k contributions are made with after-tax dollars but withdrawals are tax-free. If you expect to be in a higher tax bracket in retirement, choose Roth. If you expect lower taxes in retirement, Traditional may be better.'
    },
    {
      question: 'When can I withdraw from my 401k?',
      answer: 'You can withdraw from your 401k without penalty after age 59½. Early withdrawals before this age typically face a 10% penalty plus income taxes. There are some exceptions for hardship withdrawals, but these should be avoided if possible.'
    },
    {
      question: 'Should I take a 401k loan?',
      answer: '401k loans allow you to borrow against your retirement savings, but they come with risks. If you leave your job, the loan may become due immediately. Additionally, you miss out on potential investment growth while the money is borrowed. Consider other options first.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: '401k Calculator',
        description: 'Calculate your 401k retirement savings with employer matching. See how much you will have at retirement with detailed breakdowns.',
        url: 'https://www.calculatorpilotai.com/tools/finance/401k-calculator',
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
          { '@type': 'ListItem', position: 3, name: '401k Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/401k-calculator' }
        ]
      }
    ]
  };

  const relatedTools = [
    { name: 'Retirement Calculator', path: '/tools/finance/retirement-calculator', desc: 'Plan your overall retirement strategy' },
    { name: 'Investment Calculator', path: '/tools/finance/investment-calculator', desc: 'Project investment growth over time' },
    { name: 'FIRE Calculator', path: '/tools/finance/fire-calculator', desc: 'Calculate your FIRE number and timeline' },
  ];

  return (
    <ToolLayout toolId="401k" category="finance">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <section className="space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">401k Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="salary" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Annual Salary ($)</label>
              <input
                id="salary"
                type="number"
                min="0"
                step="1000"
                value={salary}
                onChange={(e) => { setSalary(validateNumberInput(e.target.value, { min: 0 })); clearError('salary'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.salary ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.salary && <p className="text-xs text-rose-500">{errors.salary}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="employee-contribution" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Contribution (%)</label>
              <input
                id="employee-contribution"
                type="number"
                min="0"
                max="100"
                step="1"
                value={employeeContribution}
                onChange={(e) => { setEmployeeContribution(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('employeeContribution'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.employeeContribution ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.employeeContribution && <p className="text-xs text-rose-500">{errors.employeeContribution}</p>}
              <p className="text-xs text-slate-500">Max $23,500/year (2026)</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="employer-match" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Employer Match (%)</label>
              <input
                id="employer-match"
                type="number"
                min="0"
                max="100"
                step="1"
                value={employerMatch}
                onChange={(e) => { setEmployerMatch(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('employerMatch'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.employerMatch ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.employerMatch && <p className="text-xs text-rose-500">{errors.employerMatch}</p>}
              <p className="text-xs text-slate-500">e.g., 50% match up to 6%</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="employer-cap" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Match Cap (%)</label>
              <input
                id="employer-cap"
                type="number"
                min="0"
                max="100"
                step="1"
                value={employerCap}
                onChange={(e) => { setEmployerCap(validateNumberInput(e.target.value, { min: 0, max: 100 })); clearError('employerCap'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.employerCap ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.employerCap && <p className="text-xs text-rose-500">{errors.employerCap}</p>}
              <p className="text-xs text-slate-500">Max contribution matched by employer</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="years" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Years Until Retirement</label>
              <input
                id="years"
                type="number"
                min="1"
                max="50"
                step="1"
                value={years}
                onChange={(e) => { setYears(validateNumberInput(e.target.value, { min: 1, max: 50 })); clearError('years'); }}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.years ? 'border-rose-500' : 'border-slate-200'}`}
              />
              {errors.years && <p className="text-xs text-rose-500">{errors.years}</p>}
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
          </div>
          <button
            onClick={handleCalculate}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-widest focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate 401k
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 bg-slate-900 text-white rounded-xl text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Projected 401k Balance</span>
              <div className="text-3xl md:text-4xl font-mono font-black mt-2">{formatCurrency(result.totalValue)}</div>
              <span className="text-sm text-slate-400">After {years} years of contributions</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Your Contributions</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.employeeTotal)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Employer Match</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-emerald-600 tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.employerTotal)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Interest Earned</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-emerald-600 tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.interestEarned)}</div>
              </div>
              <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest block mb-2">Monthly Income (4%)</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold tabular-nums leading-none overflow-wrap-anywhere">{formatCurrency(result.monthlyIncome)}</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the 401k Calculator</h2>
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The 401k Calculator projects your retirement savings by combining your contributions with employer matching. It shows the power of employer matching and compound growth over time.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Employer Matching</h3>
              <p className="text-slate-700 leading-relaxed">
                Employer matching is essentially free money. If your employer matches 50% up to 6% of your salary and you earn $75,000, contributing 6% ($4,500/year) means your employer adds $2,250/year. That is an instant 50% return on your contribution!
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Maximizing Your 401k</h3>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Always get the full match:</strong> This is your first priority</li>
                <li><strong>Increase contributions gradually:</strong> Aim for 15-20% total contribution</li>
                <li><strong>Consider Roth vs. Traditional:</strong> Depends on your expected tax bracket</li>
                <li><strong>Review your investments:</strong> Diversify and adjust based on age</li>
              </ul>
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
