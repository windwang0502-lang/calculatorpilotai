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

interface ProgrammaticCompareTemplateProps {
  config: SEOPageConfig;
  items?: { name: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}

export function ProgrammaticCompareTemplate({ config, items }: ProgrammaticCompareTemplateProps) {
  const relatedInCategory = getSEOPagesByCategory(config.category)
    .filter(p => p.slug !== config.slug)
    .slice(0, 4);

  const allPages = getAllSEOProgrammaticPages();
  const relatedCalculators = config.relatedTools?.slice(0, 3).map(slug => {
    return allPages.find(p => p.slug === slug);
  }).filter(Boolean) as SEOPageConfig[];

  const relatedCompares = config.relatedCompare?.slice(0, 3).map(slug => {
    return allPages.find(p => p.slug === slug);
  }).filter(Boolean) as SEOPageConfig[];

  const intro = generateProgrammaticIntro(config);
  const explanation = generateProgrammaticExplanation(config);
  const howTo = generateProgrammaticHowTo(config);
  const faqs = generateProgrammaticFAQ(config);
  const cta = generateProgrammaticCTA(config);

  const defaultItems = [
    { name: 'Option A', description: 'First option in this comparison category' },
    { name: 'Option B', description: 'Second option in this comparison category' },
    { name: 'Option C', description: 'Third option for comprehensive analysis' },
  ];

  const comparisonItems = items || defaultItems;

  return (
    <ToolLayout toolId={`programmatic-${config.slug}`} category={config.category}>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
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

        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-slate-50 p-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Side-by-Side Comparison
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-4 font-semibold text-slate-900 bg-slate-50">Criteria</th>
                  {comparisonItems.map((item, index) => (
                    <th key={index} className="text-left p-4 font-semibold text-slate-900 min-w-[150px]">
                      {item.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="p-4 font-medium text-slate-700">Overview</td>
                  {comparisonItems.map((item, index) => (
                    <td key={index} className="p-4 text-slate-600 text-sm">
                      {item.description}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <td className="p-4 font-medium text-slate-700">Category</td>
                  {comparisonItems.map((_, index) => (
                    <td key={index} className="p-4 text-slate-600">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                        {categoryLabels[config.category]}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Use This Comparison
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

        {relatedCalculators && relatedCalculators.length > 0 && (
          <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Related Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedCalculators.map((page) => (
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

        {relatedInCategory.length > 0 && (
          <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              More {categoryLabels[config.category]} Comparisons
            </h2>
            <div className="space-y-2">
              {relatedInCategory.map((page) => (
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
              Related Comparisons
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

        <div className="text-center pt-4">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Browse All Comparisons
          </Link>
        </div>
      </div>
    </ToolLayout>
  );
}
