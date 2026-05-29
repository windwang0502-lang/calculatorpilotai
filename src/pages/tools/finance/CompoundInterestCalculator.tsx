import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { formatCurrency, formatPercent, getResultTextSize, validateNumberInput } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, ComposedChart, Line, LineChart
} from 'recharts';

type CompoundFrequency = 'annually' | 'semiannually' | 'quarterly' | 'monthly' | 'daily';

interface YearlyGrowth {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
  totalInterest: number;
}

interface CompoundInterestResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  effectiveRate: number;
  yearlyGrowth: YearlyGrowth[];
}

const frequencyMap: Record<CompoundFrequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

const frequencyLabels: Record<CompoundFrequency, string> = {
  annually: 'Annually (1x/year)',
  semiannually: 'Semiannually (2x/year)',
  quarterly: 'Quarterly (4x/year)',
  monthly: 'Monthly (12x/year)',
  daily: 'Daily (365x/year)',
};

function calculateCompoundInterest(
  principal: number,
  rate: number,
  years: number,
  frequency: CompoundFrequency,
  monthlyContribution: number
): CompoundInterestResult {
  const n = frequencyMap[frequency];
  const r = rate / 100;
  const yearlyGrowth: YearlyGrowth[] = [];
  let balance = principal;
  let totalContributions = principal;
  let totalInterest = 0;

  for (let year = 1; year <= years; year++) {
    for (let period = 0; period < n; period++) {
      const monthlyContributionPerPeriod = (monthlyContribution * 12) / n;
      balance += monthlyContributionPerPeriod;
      balance *= (1 + r / n);
    }

    totalContributions = principal + (monthlyContribution * 12 * year);
    totalInterest = balance - totalContributions;

    yearlyGrowth.push({
      year,
      balance: Math.round(balance * 100) / 100,
      contributions: Math.round(totalContributions * 100) / 100,
      interest: Math.round((balance - totalContributions) * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
    });
  }

  const effectiveRate = Math.pow(1 + r / n, n) - 1;

  return {
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    effectiveRate: Math.round(effectiveRate * 10000) / 100,
    yearlyGrowth,
  };
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [frequency, setFrequency] = useState<CompoundFrequency>('monthly');
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line'>('area');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (principal <= 0) newErrors.principal = 'Principal must be greater than 0';
    if (principal > 100000000) newErrors.principal = 'Principal seems unrealistically high';
    if (rate < 0) newErrors.rate = 'Interest rate cannot be negative';
    if (rate > 50) newErrors.rate = 'Interest rate seems unrealistically high';
    if (years <= 0) newErrors.years = 'Time period must be at least 1 year';
    if (years > 100) newErrors.years = 'Time period seems unrealistically long';
    if (monthlyContribution < 0) newErrors.monthlyContribution = 'Monthly contribution cannot be negative';
    if (monthlyContribution > 100000) newErrors.monthlyContribution = 'Monthly contribution seems unrealistically high';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validate()) return;
    const res = calculateCompoundInterest(principal, rate, years, frequency, monthlyContribution);
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
    return result.yearlyGrowth.map(row => ({
      year: row.year,
      balance: row.balance,
      contributions: row.contributions,
      interest: row.interest,
    }));
  }, [result]);

  const totalGrowthPercent = result
    ? ((result.finalBalance - result.totalContributions) / result.totalContributions * 100).toFixed(1)
    : '0';

  const faqs = [
    {
      question: 'What is compound interest?',
      answer: 'Compound interest is interest earned on both the initial principal and the accumulated interest from previous periods. Unlike simple interest (which only applies to the principal), compound interest allows your money to grow exponentially over time because you earn interest on your interest. This is why starting early is so powerful — even small contributions can grow significantly over decades.'
    },
    {
      question: 'How does compounding frequency affect my returns?',
      answer: 'The more frequently interest compounds, the more you\'ll earn. This is because interest is added to your balance more often, allowing the next period\'s interest to be calculated on a larger amount. Daily compounding earns more than monthly, which earns more than annually. While the difference may seem small for short periods, it becomes significant over decades of investing.'
    },
    {
      question: 'What is the difference between nominal and effective interest rate?',
      answer: 'The nominal rate is the stated annual interest rate (like 7% per year). The effective rate accounts for compounding frequency — for the same nominal rate, monthly compounding produces a slightly higher effective rate than annual compounding. Our calculator shows the effective rate so you can compare investments accurately regardless of how often they compound.'
    },
    {
      question: 'Why do contributions matter so much with compound interest?',
      answer: 'Contributions supercharge compound interest because you earn returns on every dollar you add. In the early years, your contributions make up most of your balance. Over time, however, compound interest on those contributions becomes the dominant force. This is why consistent monthly contributions, even small ones, can lead to substantial wealth over long periods.'
    },
    {
      question: 'What is a realistic expected return for investments?',
      answer: 'Historical stock market returns average about 7-10% annually over long periods, adjusted for inflation. Bond markets typically return 3-5%. High-yield savings accounts currently offer around 4-5%. Remember that past performance doesn\'t guarantee future results, and your actual returns will vary. It\'s wise to use conservative estimates for planning purposes.'
    },
    {
      question: 'How do I use this calculator for retirement planning?',
      answer: 'Enter your current savings as principal, your expected annual return, and how many years until retirement. Add your planned monthly contributions. The calculator shows your projected balance, how much came from contributions versus interest, and the percentage growth. Use this to understand if you\'re on track and how much more you might need to contribute.'
    }
  ];

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Compound Interest Calculator',
        description: 'Calculate how your investments grow over time with compound interest and regular contributions.',
        url: 'https://www.calculatorpilotai.com/tools/finance/compound-interest-calculator',
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
          { '@type': 'ListItem', position: 3, name: 'Compound Interest Calculator', item: 'https://www.calculatorpilotai.com/tools/finance/compound-interest-calculator' }
        ]
      }
    ]
  };

  return (
    <ToolLayout toolId="compound-interest" category="finance">
      <section className="space-y-8">
        {/* Calculator Input Section */}
        <div className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Calculate Your Investment Growth</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Principal */}
            <div className="space-y-2">
              <label htmlFor="ci-principal" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Initial Investment
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
                <input
                  id="ci-principal"
                  type="number"
                  min="0"
                  step="100"
                  value={principal}
                  onChange={(e) => { setPrincipal(validateNumberInput(e.target.value, { min: 0 })); clearError('principal'); }}
                  className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.principal ? 'border-rose-500' : 'border-slate-200'}`}
                />
              </div>
              {errors.principal && <p className="text-xs text-rose-500">{errors.principal}</p>}
              <p className="text-xs text-muted-foreground">Starting amount of your investment</p>
            </div>

            {/* Annual Interest Rate */}
            <div className="space-y-2">
              <label htmlFor="ci-rate" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Annual Interest Rate
              </label>
              <div className="relative">
                <input
                  id="ci-rate"
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={rate}
                  onChange={(e) => { setRate(validateNumberInput(e.target.value, { min: 0, max: 50 })); clearError('rate'); }}
                  className={`w-full pl-3 pr-8 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.rate ? 'border-rose-500' : 'border-slate-200'}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">%</span>
              </div>
              {errors.rate && <p className="text-xs text-rose-500">{errors.rate}</p>}
              <p className="text-xs text-muted-foreground">Expected annual return rate</p>
            </div>

            {/* Years */}
            <div className="space-y-2">
              <label htmlFor="ci-years" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Time Period
              </label>
              <div className="relative">
                <input
                  id="ci-years"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={years}
                  onChange={(e) => { setYears(validateNumberInput(e.target.value, { min: 1, max: 100 })); clearError('years'); }}
                  className={`w-full pl-3 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.years ? 'border-rose-500' : 'border-slate-200'}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">years</span>
              </div>
              {errors.years && <p className="text-xs text-rose-500">{errors.years}</p>}
              <p className="text-xs text-muted-foreground">How long you plan to invest</p>
            </div>

            {/* Monthly Contribution */}
            <div className="space-y-2">
              <label htmlFor="ci-contribution" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Monthly Contribution
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
                <input
                  id="ci-contribution"
                  type="number"
                  min="0"
                  max="100000"
                  step="50"
                  value={monthlyContribution}
                  onChange={(e) => { setMonthlyContribution(validateNumberInput(e.target.value, { min: 0 })); clearError('monthlyContribution'); }}
                  className={`w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-lg ${errors.monthlyContribution ? 'border-rose-500' : 'border-slate-200'}`}
                />
              </div>
              {errors.monthlyContribution && <p className="text-xs text-rose-500">{errors.monthlyContribution}</p>}
              <p className="text-xs text-muted-foreground">Regular monthly addition (optional)</p>
            </div>

            {/* Compounding Frequency - Full Width */}
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="ci-frequency" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Compounding Frequency
              </label>
              <select
                id="ci-frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as CompoundFrequency)}
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white font-mono text-lg"
              >
                <option value="annually">Annually (1x per year)</option>
                <option value="semiannually">Semiannually (2x per year)</option>
                <option value="quarterly">Quarterly (4x per year)</option>
                <option value="monthly">Monthly (12x per year)</option>
                <option value="daily">Daily (365x per year)</option>
              </select>
              <p className="text-xs text-muted-foreground">How often interest is calculated and added to your balance</p>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="mt-6 w-full sm:w-auto sm:px-12 bg-slate-900 text-white font-bold py-4 rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-wider focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
          >
            Calculate Returns
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Key Metrics - Fixed grid for overflow */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 md:p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">Final Balance</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-emerald-700 tabular-nums leading-none overflow-wrap-anywhere break-normal">
                  {formatCurrency(result.finalBalance)}
                </div>
              </div>
              <div className="p-4 md:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Total Contributed</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-slate-700 tabular-nums leading-none overflow-wrap-anywhere break-normal">
                  {formatCurrency(result.totalContributions)}
                </div>
              </div>
              <div className="p-4 md:p-5 bg-amber-50 border border-amber-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">Interest Earned</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-amber-700 tabular-nums leading-none overflow-wrap-anywhere break-normal">
                  {formatCurrency(result.totalInterest)}
                </div>
              </div>
              <div className="p-4 md:p-5 bg-slate-50 border border-slate-200 rounded-xl text-center min-w-0">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Growth</span>
                <div className="text-base md:text-lg lg:text-xl font-mono font-bold text-slate-700 tabular-nums leading-none">
                  +{totalGrowthPercent}%
                </div>
              </div>
            </div>

            {/* Growth Summary Visual */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6">
              <h3 className="text-lg font-bold mb-4">Growth Breakdown</h3>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
                <div className="text-center min-w-[100px]">
                  <div className="text-base md:text-lg font-mono font-bold text-slate-500 truncate max-w-full">{formatCurrency(principal)}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-1">Initial</div>
                </div>
                <div className="text-slate-300 hidden sm:block">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="text-center min-w-[100px]">
                  <div className="text-base md:text-lg font-mono font-bold text-blue-600 truncate max-w-full">+{formatCurrency(monthlyContribution * 12 * years)}</div>
                  <div className="text-xs md:text-sm text-blue-600 mt-1">Contributions</div>
                </div>
                <div className="text-slate-300 hidden sm:block">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="text-center min-w-[100px]">
                  <div className="text-base md:text-lg font-mono font-bold text-amber-600 truncate max-w-full">+{formatCurrency(result.totalInterest)}</div>
                  <div className="text-xs md:text-sm text-amber-600 mt-1">Interest</div>
                </div>
                <div className="text-slate-300 hidden sm:block">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
                <div className="text-center min-w-[120px]">
                  <div className="text-xl md:text-2xl font-mono font-bold text-primary truncate max-w-full">{formatCurrency(result.finalBalance)}</div>
                  <div className="text-xs md:text-sm text-primary mt-1 font-semibold">Final Balance</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Effective Annual Rate: <span className="font-mono font-semibold">{formatPercent(result.effectiveRate)}</span>
              </p>
            </div>

            {/* Chart Section */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className="text-lg font-bold">Growth Over Time</h3>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setChartType('area')}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                      chartType === 'area' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Area
                  </button>
                  <button
                    onClick={() => setChartType('bar')}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                      chartType === 'bar' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Bar
                  </button>
                  <button
                    onClick={() => setChartType('line')}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                      chartType === 'line' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Line
                  </button>
                </div>
              </div>

              <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'area' ? (
                    <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} width={50} />
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} labelFormatter={(label) => `Year ${label}`} />
                      <Legend wrapperStyle={{ paddingTop: 8, fontSize: 12 }} />
                      <Area type="monotone" dataKey="balance" name="Total Balance" stroke="#10b981" fillOpacity={1} fill="url(#colorBalance)" />
                      <Area type="monotone" dataKey="contributions" name="Contributions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorContributions)" />
                    </AreaChart>
                  ) : chartType === 'bar' ? (
                    <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} width={50} />
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} labelFormatter={(label) => `Year ${label}`} />
                      <Legend wrapperStyle={{ paddingTop: 8, fontSize: 12 }} />
                      <Bar dataKey="balance" name="Total Balance" fill="#10b981" />
                      <Bar dataKey="contributions" name="Contributions" fill="#3b82f6" />
                    </BarChart>
                  ) : (
                    <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} width={50} />
                      <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} labelFormatter={(label) => `Year ${label}`} />
                      <Legend wrapperStyle={{ paddingTop: 8, fontSize: 12 }} />
                      <Line type="monotone" dataKey="balance" name="Total Balance" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="contributions" name="Contributions" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Interest vs Contributions Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-bold mb-4">Interest vs Contributions Over Time</h3>
              <div className="w-full h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} label={{ value: 'Year', position: 'insideBottom', offset: -2 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} width={50} />
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} labelFormatter={(label) => `Year ${label}`} />
                    <Legend wrapperStyle={{ paddingTop: 8, fontSize: 12 }} />
                    <Bar dataKey="contributions" name="Your Contributions" fill="#3b82f6" />
                    <Bar dataKey="interest" name="Interest Earned" fill="#f59e0b" />
                    <Line type="monotone" dataKey="balance" name="Total Balance" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-3 text-center">
                Notice how interest grows faster over time — the power of compound growth!
              </p>
            </div>

            {/* Yearly Growth Table */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 overflow-x-auto">
              <h3 className="text-lg font-bold mb-4">Year-by-Year Growth</h3>
              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full min-w-[500px] text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-muted-foreground uppercase tracking-wider text-xs">
                      <th className="text-left py-3 px-2 md:px-3 font-semibold">Year</th>
                      <th className="text-right py-3 px-2 md:px-3 font-semibold">Contributions</th>
                      <th className="text-right py-3 px-2 md:px-3 font-semibold">Interest</th>
                      <th className="text-right py-3 px-2 md:px-3 font-semibold">Total Interest</th>
                      <th className="text-right py-3 px-2 md:px-3 font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearlyGrowth.map((row) => (
                      <tr key={row.year} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="py-2 px-2 md:px-3 font-medium">{row.year}</td>
                        <td className="text-right py-2 px-2 md:px-3 font-mono tabular-nums text-blue-600">{formatCurrency(row.contributions)}</td>
                        <td className="text-right py-2 px-2 md:px-3 font-mono tabular-nums text-amber-600">{formatCurrency(row.interest)}</td>
                        <td className="text-right py-2 px-2 md:px-3 font-mono tabular-nums text-amber-700">{formatCurrency(row.totalInterest)}</td>
                        <td className="text-right py-2 px-2 md:px-3 font-mono tabular-nums font-semibold text-emerald-600">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* More Finance Tools */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-6">
              <h3 className="text-lg font-bold mb-4">Explore More Finance Calculators</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Link
                  to="/tools/finance/mortgage-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Mortgage Calculator</span>
                </Link>
                <Link
                  to="/tools/finance/loan-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Loan Calculator</span>
                </Link>
                <Link
                  to="/tools/finance/apr-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">APR Calculator</span>
                </Link>
                <Link
                  to="/tools/finance/refinance-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Refinance Calculator</span>
                </Link>
                <Link
                  to="/tools/finance/interest-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Interest Calculator</span>
                </Link>
                <Link
                  to="/tools/finance/debt-payoff-calculator"
                  className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-slate-700">Debt Payoff Calculator</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SEO Explanation Section */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Use the Compound Interest Calculator</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-3">What This Calculator Does</h3>
              <p className="text-slate-700 leading-relaxed">
                The Compound Interest Calculator helps you project the future value of your investments by showing how compound interest and regular contributions grow your money over time. It visualizes the power of compound growth, showing how your contributions stack up against the interest you earn. This tool is essential for retirement planning, investment comparisons, and understanding the time value of money.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">How It Works</h3>
              <p className="text-slate-700 leading-relaxed">
                The calculator uses the compound interest formula with regular contributions. Each period, it adds your contributions, then applies the interest rate. Over time, you earn interest on increasingly larger balances, creating exponential growth. The chart and table show your balance year-by-year, clearly separating your contributions from the interest earned.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">The Formula</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4 font-mono text-sm">
                <p className="mb-2"><strong>A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]</strong></p>
                <p className="mb-1">Where:</p>
                <p className="mb-1">• A = Final balance</p>
                <p className="mb-1">• P = Principal (initial investment)</p>
                <p className="mb-1">• r = Annual interest rate (decimal)</p>
                <p className="mb-1">• n = Compounding frequency per year</p>
                <p className="mb-1">• t = Time in years</p>
                <p className="mb-1">• PMT = Monthly contribution</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Understanding Your Results</h3>
              <p className="text-slate-700 leading-relaxed mb-3">Your compound interest calculation shows:</p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Final Balance:</strong> Your projected total value at the end of the period.</li>
                <li><strong>Total Contributed:</strong> Your initial principal plus all contributions.</li>
                <li><strong>Interest Earned:</strong> The growth from compound interest — often exceeds your contributions.</li>
                <li><strong>Growth Percentage:</strong> How much your money multiplied over the period.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-3">Common Mistakes to Avoid</h3>
              <div className="space-y-3 text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Using unrealistic returns:</strong> 15% annual returns are not realistic for most investments over long periods.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Ignoring inflation:</strong> A 7% return with 3% inflation is really only 4% in real terms.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <p><strong>Not starting early:</strong> Waiting 10 years to start investing means missing decades of compound growth.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <p><strong>Increase contributions over time</strong> as your income grows to accelerate wealth building.</p>
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
            <a href="/tools/finance/mortgage-calculator" className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
              <h3 className="font-bold text-lg mb-2">Mortgage Calculator</h3>
              <p className="text-slate-400 text-sm">Calculate home loan payments and amortization</p>
            </a>
            <a href="/tools/finance/loan-calculator" className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
              <h3 className="font-bold text-lg mb-2">Loan Calculator</h3>
              <p className="text-slate-400 text-sm">Calculate loan payments with different frequencies</p>
            </a>
            <a href="/tools/finance/apr-calculator" className="block p-6 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
              <h3 className="font-bold text-lg mb-2">APR Calculator</h3>
              <p className="text-slate-400 text-sm">Compare the true cost of different loans</p>
            </a>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
