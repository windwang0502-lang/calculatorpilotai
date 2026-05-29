import React from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import {
  getSEOPagesByCategory,
  getAllSEOProgrammaticPages,
  type SEOPageConfig,
  type SEOCategory,
} from '@/data/seo';
import {
  generateProgrammaticIntro,
  generateProgrammaticExplanation,
  generateProgrammaticHowTo,
  generateProgrammaticFAQ,
  generateProgrammaticCTA,
  getSpecializedContent,
} from '@/lib/seo/programmatic-content-engine';

const categoryLabels: Record<SEOCategory, string> = {
  finance: 'Finance',
  health: 'Health',
  shipping: 'Shipping',
  ai: 'AI',
  time: 'Time',
};

const intentLabels: Record<string, string> = {
  calculator: 'Calculator',
  guide: 'Guide',
  compare: 'Comparison',
};

interface BaseTemplateProps {
  config: SEOPageConfig;
  howToUseSteps?: string[];
  explanationPoints?: string[];
  faqs?: { question: string; answer: string }[];
}

export function ProgrammaticCalculatorTemplate({ config }: BaseTemplateProps) {
  const relatedInCategory = getSEOPagesByCategory(config.category)
    .filter(p => p.slug !== config.slug)
    .slice(0, 4);

  const allPages = getAllSEOProgrammaticPages();
  const relatedGuides = config.relatedGuides?.slice(0, 3).map(slug => {
    return allPages.find(p => p.slug === slug);
  }).filter(Boolean) as SEOPageConfig[];

  const relatedCompares = config.relatedCompare?.slice(0, 3).map(slug => {
    return allPages.find(p => p.slug === slug);
  }).filter(Boolean) as SEOPageConfig[];

  // Get specialized content for loan types and BMI audiences
  const specializedContent = getSpecializedContent(config.slug);
  const intro = specializedContent?.intro || generateProgrammaticIntro(config);
  const explanation = generateProgrammaticExplanation(config);
  const howTo = generateProgrammaticHowTo(config);
  const faqs = specializedContent?.faqs || generateProgrammaticFAQ(config);
  const cta = generateProgrammaticCTA(config);

  // Generate schema markup
  const baseUrl = 'https://www.calculatorpilotai.com';
  const pageUrl = `${baseUrl}/tools/${config.category}/${config.slug}`;

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: config.title,
        description: config.description,
        url: pageUrl,
        applicationCategory: config.category === 'finance' ? 'FinanceApplication' : 'HealthApplication',
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
          { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
          { '@type': 'ListItem', position: 2, name: categoryLabels[config.category], item: `${baseUrl}/tools/${config.category}` },
          { '@type': 'ListItem', position: 3, name: config.keyword, item: pageUrl }
        ]
      }
    ]
  };

  const explanationPoints = [
    explanation,
    'Results are estimates and may vary based on your specific inputs',
    config.category === 'finance' ? 'Consult professionals for important financial decisions' : 'Consult healthcare providers for personalized advice',
  ];

  // Determine parent calculator link for specialized pages
  const parentLinks: Record<string, { name: string; path: string }> = {
    'fha-loan-calculator': { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator' },
    'va-loan-calculator': { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator' },
    'usda-loan-calculator': { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator' },
    'conventional-loan-calculator': { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator' },
    'jumbo-loan-calculator': { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator' },
    'bmi-calculator-men': { name: 'BMI Calculator', path: '/tools/health/bmi-calculator' },
    'bmi-calculator-women': { name: 'BMI Calculator', path: '/tools/health/bmi-calculator' },
    'bmi-calculator-teenagers': { name: 'BMI Calculator', path: '/tools/health/bmi-calculator' },
    'bmi-calculator-seniors': { name: 'BMI Calculator', path: '/tools/health/bmi-calculator' },
  };

  // State mortgage page mappings
  const stateMappings: Record<string, { name: string; region: string; nearby: string[] }> = {
    'california-mortgage-calculator': { name: 'California', region: 'west', nearby: ['oregon-mortgage-calculator', 'arizona-mortgage-calculator', 'nevada-mortgage-calculator'] },
    'texas-mortgage-calculator': { name: 'Texas', region: 'south', nearby: ['oklahoma-mortgage-calculator', 'arkansas-mortgage-calculator', 'new-mexico-mortgage-calculator'] },
    'florida-mortgage-calculator': { name: 'Florida', region: 'southeast', nearby: ['georgia-mortgage-calculator', 'south-carolina-mortgage-calculator', 'alabama-mortgage-calculator'] },
    'new-york-mortgage-calculator': { name: 'New York', region: 'northeast', nearby: ['massachusetts-mortgage-calculator', 'pennsylvania-mortgage-calculator', 'connecticut-mortgage-calculator'] },
    'pennsylvania-mortgage-calculator': { name: 'Pennsylvania', region: 'northeast', nearby: ['new-york-mortgage-calculator', 'ohio-mortgage-calculator', 'virginia-mortgage-calculator'] },
    'illinois-mortgage-calculator': { name: 'Illinois', region: 'midwest', nearby: ['indiana-mortgage-calculator', 'iowa-mortgage-calculator', 'wisconsin-mortgage-calculator'] },
    'ohio-mortgage-calculator': { name: 'Ohio', region: 'midwest', nearby: ['indiana-mortgage-calculator', 'michigan-mortgage-calculator', 'pennsylvania-mortgage-calculator'] },
    'georgia-mortgage-calculator': { name: 'Georgia', region: 'southeast', nearby: ['florida-mortgage-calculator', 'north-carolina-mortgage-calculator', 'tennessee-mortgage-calculator'] },
    'north-carolina-mortgage-calculator': { name: 'North Carolina', region: 'southeast', nearby: ['south-carolina-mortgage-calculator', 'virginia-mortgage-calculator', 'tennessee-mortgage-calculator'] },
    'michigan-mortgage-calculator': { name: 'Michigan', region: 'midwest', nearby: ['ohio-mortgage-calculator', 'indiana-mortgage-calculator', 'wisconsin-mortgage-calculator'] },
    'washington-mortgage-calculator': { name: 'Washington', region: 'west', nearby: ['oregon-mortgage-calculator', 'idaho-mortgage-calculator', 'california-mortgage-calculator'] },
    'virginia-mortgage-calculator': { name: 'Virginia', region: 'northeast', nearby: ['north-carolina-mortgage-calculator', 'pennsylvania-mortgage-calculator', 'maryland-mortgage-calculator'] },
    'massachusetts-mortgage-calculator': { name: 'Massachusetts', region: 'northeast', nearby: ['new-york-mortgage-calculator', 'connecticut-mortgage-calculator', 'rhode-island-mortgage-calculator'] },
    'arizona-mortgage-calculator': { name: 'Arizona', region: 'southwest', nearby: ['california-mortgage-calculator', 'nevada-mortgage-calculator', 'utah-mortgage-calculator', 'new-mexico-mortgage-calculator'] },
    'tennessee-mortgage-calculator': { name: 'Tennessee', region: 'south', nearby: ['kentucky-mortgage-calculator', 'north-carolina-mortgage-calculator', 'georgia-mortgage-calculator', 'arkansas-mortgage-calculator'] },
    'indiana-mortgage-calculator': { name: 'Indiana', region: 'midwest', nearby: ['ohio-mortgage-calculator', 'illinois-mortgage-calculator', 'kentucky-mortgage-calculator'] },
    'missouri-mortgage-calculator': { name: 'Missouri', region: 'midwest', nearby: ['kansas-mortgage-calculator', 'iowa-mortgage-calculator', 'illinois-mortgage-calculator', 'arkansas-mortgage-calculator'] },
    'wisconsin-mortgage-calculator': { name: 'Wisconsin', region: 'midwest', nearby: ['minnesota-mortgage-calculator', 'michigan-mortgage-calculator', 'iowa-mortgage-calculator'] },
    'colorado-mortgage-calculator': { name: 'Colorado', region: 'southwest', nearby: ['utah-mortgage-calculator', 'wyoming-mortgage-calculator', 'nebraska-mortgage-calculator', 'kansas-mortgage-calculator'] },
    'minnesota-mortgage-calculator': { name: 'Minnesota', region: 'midwest', nearby: ['wisconsin-mortgage-calculator', 'iowa-mortgage-calculator', 'south-dakota-mortgage-calculator'] },
    'oregon-mortgage-calculator': { name: 'Oregon', region: 'west', nearby: ['washington-mortgage-calculator', 'california-mortgage-calculator', 'idaho-mortgage-calculator'] },
    'nevada-mortgage-calculator': { name: 'Nevada', region: 'southwest', nearby: ['california-mortgage-calculator', 'arizona-mortgage-calculator', 'utah-mortgage-calculator'] },
    'utah-mortgage-calculator': { name: 'Utah', region: 'southwest', nearby: ['colorado-mortgage-calculator', 'nevada-mortgage-calculator', 'arizona-mortgage-calculator', 'wyoming-mortgage-calculator'] },
    'alabama-mortgage-calculator': { name: 'Alabama', region: 'southeast', nearby: ['mississippi-mortgage-calculator', 'tennessee-mortgage-calculator', 'florida-mortgage-calculator'] },
    'kentucky-mortgage-calculator': { name: 'Kentucky', region: 'south', nearby: ['tennessee-mortgage-calculator', 'indiana-mortgage-calculator', 'ohio-mortgage-calculator', 'virginia-mortgage-calculator'] },
    'south-carolina-mortgage-calculator': { name: 'South Carolina', region: 'southeast', nearby: ['north-carolina-mortgage-calculator', 'georgia-mortgage-calculator', 'florida-mortgage-calculator'] },
    'oklahoma-mortgage-calculator': { name: 'Oklahoma', region: 'south', nearby: ['texas-mortgage-calculator', 'kansas-mortgage-calculator', 'missouri-mortgage-calculator', 'colorado-mortgage-calculator'] },
    'kansas-mortgage-calculator': { name: 'Kansas', region: 'midwest', nearby: ['missouri-mortgage-calculator', 'oklahoma-mortgage-calculator', 'colorado-mortgage-calculator', 'nebraska-mortgage-calculator'] },
    'iowa-mortgage-calculator': { name: 'Iowa', region: 'midwest', nearby: ['minnesota-mortgage-calculator', 'wisconsin-mortgage-calculator', 'illinois-mortgage-calculator', 'missouri-mortgage-calculator'] },
    'arkansas-mortgage-calculator': { name: 'Arkansas', region: 'south', nearby: ['missouri-mortgage-calculator', 'tennessee-mortgage-calculator', 'texas-mortgage-calculator', 'oklahoma-mortgage-calculator'] },
  };

  // Get state info if this is a state mortgage page
  const stateInfo = stateMappings[config.slug];
  const isStateMortgagePage = !!stateInfo;

  // Get nearby state pages
  const nearbyStates = stateInfo ? stateInfo.nearby
    .map(slug => getSEOPagesByCategory('finance').find(p => p.slug === slug))
    .filter(Boolean) as SEOPageConfig[]
    : [];

  // Popular states to show on all state mortgage pages
  const popularStates: string[] = ['california-mortgage-calculator', 'texas-mortgage-calculator', 'florida-mortgage-calculator', 'new-york-mortgage-calculator', 'colorado-mortgage-calculator'];
  const popularStatePages = isStateMortgagePage ? popularStates
    .filter(slug => slug !== config.slug)
    .map(slug => getSEOPagesByCategory('finance').find(p => p.slug === slug))
    .filter(Boolean) as SEOPageConfig[]
    : [];

  // Loan calculator pages for state mortgage pages
  const loanCalculatorPages: SEOPageConfig[] = getSEOPagesByCategory('finance')
    .filter(p => ['fha-loan-calculator', 'va-loan-calculator', 'usda-loan-calculator', 'jumbo-loan-calculator', 'conventional-loan-calculator'].includes(p.slug))
    .slice(0, 5);

  const parentLink = parentLinks[config.slug];

  return (
    <ToolLayout toolId={`programmatic-${config.slug}`} category={config.category}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
          {parentLink && (
            <Link
              to={parentLink.path}
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {parentLink.name}
            </Link>
          )}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary rounded-full">
              {categoryLabels[config.category]}
            </span>
            <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 rounded-full">
              {intentLabels[config.intent]}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {config.title}
          </h1>

          <p className="text-lg text-slate-600 mb-6">
            {intro}
          </p>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-700">Priority:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                config.priority === 'P0' ? 'bg-red-100 text-red-700' :
                config.priority === 'P1' ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>
                {config.priority}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-700">Competition:</span>
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
                {config.competition}
              </span>
            </div>
          </div>
        </header>

        <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Use This Calculator
          </h2>
          <ol className="space-y-3">
            {howTo.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-slate-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Understanding the Results
          </h2>
          <ul className="space-y-3">
            {explanationPoints.map((point, index) => (
              <li key={index} className="flex gap-3">
                <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-slate-700">{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {relatedInCategory.length > 0 && (
          <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Related Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedInCategory.map((page) => (
                <Link
                  key={page.slug}
                  to={`/tools/${config.category}/${page.slug}`}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors group"
                >
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-slate-700 group-hover:text-primary transition-colors">
                    {page.keyword}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedGuides && relatedGuides.length > 0 && (
          <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Related Guides
            </h2>
            <div className="space-y-2">
              {relatedGuides.map((page) => (
                <Link
                  key={page.slug}
                  to={`/tools/${config.category}/${page.slug}`}
                  className="flex items-center gap-2 text-slate-700 hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {page.keyword}
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedCompares && relatedCompares.length > 0 && (
          <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Comparisons
            </h2>
            <div className="space-y-2">
              {relatedCompares.map((page) => (
                <Link
                  key={page.slug}
                  to={`/tools/${config.category}/${page.slug}`}
                  className="flex items-center gap-2 text-slate-700 hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {page.keyword}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Internal Links for State Mortgage Pages */}
        {isStateMortgagePage && (
          <>
            <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {stateInfo.name} Mortgage Resources
              </h2>
              <div className="space-y-4">
                <div>
                  <Link
                    to="/finance-guides/mortgage-by-state"
                    className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors mb-3"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Browse All State Mortgage Calculators
                  </Link>
                </div>
                <div>
                  <Link
                    to="/tools/finance/mortgage-calculator"
                    className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    General Mortgage Calculator
                  </Link>
                </div>
              </div>
            </section>

            {nearbyStates.length > 0 && (
              <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Nearby State Mortgage Calculators
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nearbyStates.map((page) => (
                    <Link
                      key={page.slug}
                      to={`/tools/${page.category}/${page.slug}`}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-primary/5 transition-colors group"
                    >
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                        {page.keyword}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {popularStatePages.length > 0 && (
              <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Popular State Mortgage Calculators
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {popularStatePages.slice(0, 4).map((page) => (
                    <Link
                      key={page.slug}
                      to={`/tools/${page.category}/${page.slug}`}
                      className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-primary/5 transition-colors group"
                    >
                      <svg className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                        {page.keyword}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Loan Type Calculators
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {loanCalculatorPages.map((page) => (
                  <Link
                    key={page.slug}
                    to={`/tools/${page.category}/${page.slug}`}
                    className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg hover:bg-primary/5 transition-colors group"
                  >
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">
                      {page.keyword}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="text-center pt-4">
          <p className="text-slate-600 mb-4">{cta}</p>
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Browse All Calculators
          </Link>
        </div>
      </div>
    </ToolLayout>
  );
}
