import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import {
  getSEOPageBySlug,
  getSEOPagesByCategory,
  type SEOPageConfig,
  type SEOCategory,
} from '@/data/seo';
import {
  ProgrammaticCalculatorTemplate,
  ProgrammaticGuideTemplate,
  ProgrammaticCompareTemplate,
} from '@/templates';
import {
  generateAllSEOData,
  generateProgrammaticFAQ,
} from '@/lib/seo/programmatic-meta';

function SEOHead({ config }: { config: SEOPageConfig }) {
  const faqs = generateProgrammaticFAQ(config);
  const seoData = generateAllSEOData(config, faqs);

  useEffect(() => {
    const originalTitle = document.title;
    const originalMetaDescription = document.querySelector('meta[name="description"]');
    const originalCanonical = document.querySelector('link[rel="canonical"]');

    document.title = seoData.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', seoData.description);

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', seoData.keywords.join(', '));
    }

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', seoData.openGraph.title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', seoData.openGraph.description);

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute('content', seoData.openGraph.url);

    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', seoData.openGraph.type);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', seoData.canonical);

    const existingScripts = document.querySelectorAll('script[data-seo-schema]');
    existingScripts.forEach((script) => script.remove());

    seoData.structuredData.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-schema', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      document.title = originalTitle;
      if (originalMetaDescription) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', originalMetaDescription.getAttribute('content') || '');
        }
      }
      const scripts = document.querySelectorAll('script[data-seo-schema]');
      scripts.forEach((script) => script.remove());
    };
  }, [config, seoData]);

  return null;
}

const categoryLabels: Record<SEOCategory, string> = {
  finance: 'Finance',
  health: 'Health',
  shipping: 'Shipping',
  ai: 'AI',
  time: 'Time',
};

export default function ProgrammaticToolPage() {
  const params = useParams<{ category: string; slug: string }>();
  const { category, slug } = params;

  if (!category || !slug) {
    return (
      <ToolLayout toolId="programmatic" category="finance">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Page Not Found</h1>
            <p className="text-slate-600">Invalid page parameters.</p>
          </div>
        </div>
      </ToolLayout>
    );
  }

  const validCategories: SEOCategory[] = ['finance', 'health', 'shipping', 'ai', 'time'];
  const isValidCategory = validCategories.includes(category as SEOCategory);

  if (!isValidCategory) {
    return (
      <ToolLayout toolId="programmatic" category="finance">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Invalid Category</h1>
            <p className="text-slate-600 mb-6">
              Category "{category}" is not valid.
            </p>
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              View All Tools
            </Link>
          </div>
        </div>
      </ToolLayout>
    );
  }

  const pageConfig = getSEOPageBySlug(category as SEOCategory, slug);

  if (!pageConfig) {
    return <NotFoundPage category={category as SEOCategory} />;
  }

  return <ProgrammaticContent config={pageConfig} />;
}

function NotFoundPage({ category }: { category: SEOCategory }) {
  const relatedPages = getSEOPagesByCategory(category).slice(0, 5);

  return (
    <ToolLayout toolId="programmatic" category={category}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Tool Coming Soon</h1>
          <p className="text-slate-600 mb-2">
            This tool is on our roadmap and will be available soon.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Category: {categoryLabels[category]}
          </p>
        </div>

        {relatedPages.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Available {categoryLabels[category]} Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPages.map((page) => (
                <Link
                  key={page.slug}
                  to={`/tools/${category}/${page.slug}`}
                  className="block bg-white p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
                >
                  <h3 className="font-semibold text-slate-900 mb-2">{page.keyword}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{page.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            View All Tools
          </Link>
        </div>
      </div>
    </ToolLayout>
  );
}

function ProgrammaticContent({ config }: { config: SEOPageConfig }) {
  const faqs = generateProgrammaticFAQ(config);
  const seoData = generateAllSEOData(config, faqs);

  let template;
  switch (config.pageType) {
    case 'calculator':
      template = <ProgrammaticCalculatorTemplate config={config} />;
      break;
    case 'guide':
      template = <ProgrammaticGuideTemplate config={config} />;
      break;
    case 'compare':
      template = <ProgrammaticCompareTemplate config={config} />;
      break;
    default:
      template = <ProgrammaticCalculatorTemplate config={config} />;
  }

  return (
    <>
      <SEOHead config={config} />
      {template}
      {seoData.disclaimer && (
        <div className="max-w-4xl mx-auto px-4 pb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">{seoData.disclaimer}</p>
          </div>
        </div>
      )}
    </>
  );
}
