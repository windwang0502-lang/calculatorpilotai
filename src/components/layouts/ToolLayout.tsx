import React from 'react';
import { getSEOContent, getRelatedTools } from '@/lib/seo';
import { Link, useLocation } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { generateFAQSchema, generateWebAppSchema, generateBreadcrumbSchema } from '@/lib/schema';

interface ToolLayoutProps {
  toolId: string;
  category: string;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ toolId, category, children }) => {
  const content = getSEOContent(toolId);
  const related = getRelatedTools(category);
  const location = useLocation();
  const canonicalUrl = `https://toolfactory.ai${location.pathname}`;

  const faqSchema = generateFAQSchema(content.faqs);
  const webAppSchema = generateWebAppSchema({
    name: content.title.split(' - ')[0],
    description: content.description,
    url: canonicalUrl,
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://toolfactory.ai/' },
    { name: 'Tools', url: 'https://toolfactory.ai/tools' },
    { name: category.charAt(0).toUpperCase() + category.slice(1), url: `https://toolfactory.ai/tools/${category}` },
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
            <h2 className="text-xl font-bold mb-4">Content Clusters</h2>
            <div className="space-y-3">
              <Link to="/guides" className="block text-sm text-muted-foreground hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
                View Comprehensive Guides
              </Link>
              <Link to="/compare" className="block text-sm text-muted-foreground hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4">
                Comparison Tools
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
};
