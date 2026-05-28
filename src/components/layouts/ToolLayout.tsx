import React from 'react';
import { getSEOContent, getRelatedTools, SEOContent } from '@/lib/seo';
import { Link, useLocation } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { generateFAQSchema, generateWebAppSchema, generateBreadcrumbSchema } from '@/lib/schema';
import { BookOpen, Lightbulb, AlertTriangle, Calculator, TrendingUp } from 'lucide-react';

interface ToolLayoutProps {
  toolId: string;
  category: string;
  children: React.ReactNode;
}

// Guide content mapping for related links
const GUIDE_MAP: Record<string, { title: string; path: string }> = {
  'what-is-mortgage': { title: 'What Is a Mortgage', path: '/guides/what-is-mortgage' },
  'how-mortgage-interest-works': { title: 'How Mortgage Interest Works', path: '/guides/how-mortgage-interest-works' },
  'how-to-reduce-mortgage-interest': { title: 'How to Reduce Mortgage Interest', path: '/guides/how-to-reduce-mortgage-interest' },
  'what-is-mortgage-insurance': { title: 'What Is Mortgage Insurance', path: '/guides/what-is-mortgage-insurance' },
  'how-much-house-can-i-afford': { title: 'How Much House Can I Afford', path: '/guides/how-much-house-can-i-afford' },
  'what-is-loan-amortization': { title: 'Understanding Loan Amortization', path: '/guides/what-is-loan-amortization' },
  'fixed-vs-adjustable-rate-mortgage-guide': { title: 'Fixed vs Adjustable Rate', path: '/guides/fixed-vs-adjustable-rate-mortgage-guide' },
  'understanding-bmi': { title: 'Understanding BMI', path: '/guides/understanding-bmi' },
  'how-to-improve-bmi': { title: 'How to Improve BMI', path: '/guides/how-to-improve-bmi' },
  'understanding-shipping-dim-weight': { title: 'Understanding DIM Weight', path: '/guides/understanding-shipping-dim-weight' },
  'how-shipping-costs-are-calculated': { title: 'How Shipping Costs Are Calculated', path: '/guides/how-shipping-costs-are-calculated' },
  'how-to-reduce-shipping-costs': { title: 'How to Reduce Shipping Costs', path: '/guides/how-to-reduce-shipping-costs' },
  'international-shipping-guide': { title: 'International Shipping Guide', path: '/guides/international-shipping-guide' },
};

export const ToolLayout: React.FC<ToolLayoutProps> = ({ toolId, category, children }) => {
  const content = getSEOContent(toolId);
  const related = getRelatedTools(category);
  const location = useLocation();
  const canonicalUrl = `https://www.calculatorpilotai.com${location.pathname}`;

  const faqSchema = generateFAQSchema(content.faqs);
  const webAppSchema = generateWebAppSchema({
    name: content.title.split(' - ')[0],
    description: content.description,
    url: canonicalUrl,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://www.calculatorpilotai.com/' },
    { name: 'Tools', url: 'https://www.calculatorpilotai.com/tools' },
    { name: category.charAt(0).toUpperCase() + category.slice(1), url: `https://www.calculatorpilotai.com/tools/${category}` },
    { name: content.title.split(' - ')[0], url: canonicalUrl },
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [faqSchema, webAppSchema, breadcrumbSchema],
  };

  return (
    <>
      <PageMeta
        title={content.title}
        description={content.description}
        canonical={canonicalUrl}
        ogType="website"
        jsonLd={jsonLd}
      />
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <header className="mb-12">
        <Breadcrumb items={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/tools' },
          { name: category.charAt(0).toUpperCase() + category.slice(1), url: `/tools/${category}` },
          { name: content.title.split(' - ')[0] },
        ]} />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
          {content.title.split(' - ')[0]}
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl text-pretty leading-relaxed">
          {content.intro}
        </p>
        {content.lastUpdated && (
          <p className="text-sm text-muted-foreground mt-3">
            Last Updated: {content.lastUpdated}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-8 space-y-12">
          {children}

          {content.expertContent && (
            <section className="pt-12 border-t">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">Expert Guide</h2>
              </div>

              {/* Overview */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-lg leading-relaxed text-muted-foreground">{content.expertContent.overview}</p>
              </div>

              {/* How It Works */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-8 mb-8 border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold">How It Works</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">{content.expertContent.howItWorks}</p>
                {content.expertContent.formula && (
                  <div className="bg-white rounded-xl p-4 border border-slate-200 mt-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-2">Formula</span>
                    <code className="text-sm font-mono text-slate-800 block">{content.expertContent.formula}</code>
                  </div>
                )}
              </div>

              {/* Key Concepts */}
              {content.expertContent.keyConcepts && content.expertContent.keyConcepts.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold">Key Concepts</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.expertContent.keyConcepts.map((concept, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5">
                        <h4 className="font-semibold text-foreground mb-2">{concept.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{concept.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tips */}
              {content.expertContent.tips && content.expertContent.tips.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-xl font-bold">Pro Tips</h3>
                  </div>
                  <ul className="space-y-3">
                    {content.expertContent.tips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes */}
              {content.expertContent.commonMistakes && content.expertContent.commonMistakes.length > 0 && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <h3 className="text-xl font-bold text-amber-900">Common Mistakes to Avoid</h3>
                  </div>
                  <div className="space-y-4">
                    {content.expertContent.commonMistakes.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 border border-amber-100">
                        <p className="text-sm text-red-700 mb-2">
                          <span className="font-semibold">❌</span> {item.mistake}
                        </p>
                        <p className="text-sm text-emerald-700">
                          <span className="font-semibold">✓</span> {item.correction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {content.examples && content.examples.length > 0 && (
            <section className="pt-12 border-t">
              <h2 className="text-3xl font-bold mb-8">Real-World Examples</h2>
              <div className="space-y-6">
                {content.examples.map((ex, idx) => (
                  <div key={idx} className="bg-muted/30 border rounded-lg p-6">
                    <h3 className="text-lg font-bold text-foreground mb-3">{ex.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-4">
                      {ex.inputs.map((inp, i2) => (
                        <div key={i2} className="flex justify-between text-sm border-b border-dashed border-border pb-1">
                          <span className="text-muted-foreground">{inp.label}</span>
                          <span className="font-semibold text-foreground">{inp.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-primary/5 border border-primary/10 rounded p-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary block mb-1">Result</span>
                      <p className="text-sm font-medium text-foreground">{ex.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section id="faq" className="pt-12 border-t">
            <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {content.faqs.map((faq, index) => (
                <div key={index} className="group">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="md:col-span-4 space-y-8 sticky top-8">
          <div className="p-6 bg-muted/30 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Related Tools</h2>
            <div className="space-y-3">
              {related.map((tool, index) => (
                <Link
                  key={index}
                  to={tool.path}
                  className="block p-3 hover:bg-white hover:shadow-sm border border-transparent hover:border-border transition-all rounded"
                >
                  <span className="font-medium text-sm text-foreground">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/10 rounded-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Related Guides
            </h2>
            <div className="space-y-3">
              {content.relatedGuides && content.relatedGuides.length > 0 ? (
                content.relatedGuides.map((guideSlug) => {
                  const guide = GUIDE_MAP[guideSlug];
                  if (!guide) return null;
                  return (
                    <Link
                      key={guideSlug}
                      to={guide.path}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4"
                    >
                      {guide.title}
                    </Link>
                  );
                })
              ) : (
                <>
                  <Link to="/guides" className="block text-sm text-muted-foreground hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
                    View Comprehensive Guides
                  </Link>
                  <Link to="/compare" className="block text-sm text-muted-foreground hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
                    Comparison Tools
                  </Link>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
};
