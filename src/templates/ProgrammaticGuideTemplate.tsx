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

interface ProgrammaticGuideTemplateProps {
  config: SEOPageConfig;
  keyTakeaways?: string[];
  faqs?: { question: string; answer: string }[];
}

export function ProgrammaticGuideTemplate({ config }: ProgrammaticGuideTemplateProps) {
  const relatedInCategory = getSEOPagesByCategory(config.category)
    .filter(p => p.slug !== config.slug)
    .slice(0, 4);

  const allPages = getAllSEOProgrammaticPages();
  const relatedGuides = config.relatedGuides?.slice(0, 3).map(slug => {
    return allPages.find(p => p.slug === slug);
  }).filter(Boolean) as SEOPageConfig[];

  const relatedCalculators = config.relatedTools?.slice(0, 3).map(slug => {
    return allPages.find(p => p.slug === slug);
  }).filter(Boolean) as SEOPageConfig[];

  const intro = generateProgrammaticIntro(config);
  const explanation = generateProgrammaticExplanation(config);
  const howTo = generateProgrammaticHowTo(config);
  const faqs = generateProgrammaticFAQ(config);
  const cta = generateProgrammaticCTA(config);

  const keyTakeaways = [
    'Understanding this topic helps you make informed decisions',
    'Practical application is more valuable than theoretical knowledge',
    'Resources and tools are available to help you implement what you learn',
  ];

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

        <section className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Key Takeaways
          </h2>
          <ul className="space-y-3">
            {keyTakeaways.map((point, index) => (
              <li key={index} className="flex gap-3">
                <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Overview
          </h2>
          <p className="text-slate-700 leading-relaxed">
            {explanation}
          </p>
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
              More {categoryLabels[config.category]} Resources
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

        <div className="text-center pt-4">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Browse All Resources
          </Link>
        </div>
      </div>
    </ToolLayout>
  );
}
