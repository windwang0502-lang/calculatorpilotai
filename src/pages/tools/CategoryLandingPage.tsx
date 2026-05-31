import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import { getCategoryById, getToolBySlug, getRelatedTools } from '@/data/tools';
import { generateFAQSchema, generateBreadcrumbSchema, generateCollectionPageSchema } from '@/lib/schema';
import { ArrowRight, ChevronRight, HelpCircle } from 'lucide-react';

interface CategoryPageProps {
  intro: string;
  faqs: { q: string; a: string }[];
  category?: string;
}

export default function CategoryLandingPage({ intro, faqs, category: categoryProp }: CategoryPageProps) {
  const { category: categoryParam } = useParams<{ category: string }>();
  const category = categoryProp || categoryParam;
  const categoryData = category ? getCategoryById(category as any) : null;

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Category not found</h1>
          <Link to="/tools" className="text-primary hover:underline">Browse all tools</Link>
        </div>
      </div>
    );
  }

  const Icon = categoryData.icon;
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.calculatorpilotai.com/' },
    { name: 'Tools', url: 'https://www.calculatorpilotai.com/tools' },
    { name: `${categoryData.name} Tools`, url: `https://www.calculatorpilotai.com/tools/${category}` },
  ];

  const faqSchema = generateFAQSchema(faqs.map(f => ({ question: f.q, answer: f.a })));
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const collectionSchema = generateCollectionPageSchema({
    name: `${categoryData.name} Calculators and Tools`,
    description: categoryData.description,
    url: `https://www.calculatorpilotai.com/tools/${category}`,
    itemList: categoryData.tools.map(tool => ({
      name: tool.name,
      url: `https://www.calculatorpilotai.com${tool.route}`,
    })),
  });

  const relatedCategories = [
    { id: 'finance', name: 'Finance', path: '/tools/finance' },
    { id: 'health', name: 'Health', path: '/tools/health' },
    { id: 'shipping', name: 'Shipping', path: '/tools/shipping' },
    { id: 'time', name: 'Time', path: '/tools/time' },
    { id: 'ai', name: 'AI', path: '/tools/ai' },
  ].filter(c => c.id !== category);

  return (
    <>
      <PageMeta
        title={`${categoryData.name} Calculators and Tools — CalcWise AI`}
        description={`Free ${categoryData.name.toLowerCase()} calculators and online tools. ${categoryData.description} All tools are AI-powered and free to use.`}
        canonical={`https://www.calculatorpilotai.com/tools/${category}`}
        jsonLd={[faqSchema, breadcrumbSchema, collectionSchema]}
      />

      <div className="min-h-screen bg-slate-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-100 via-white to-slate-50 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/tools" className="hover:text-primary transition-colors">Tools</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-900 font-medium">{categoryData.name} Tools</span>
            </nav>

            <div className="flex items-start gap-6 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">
                  {categoryData.name} Calculators & Tools
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl">
                  {intro}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/tools"
                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:border-primary hover:text-primary transition-all text-sm"
              >
                <ArrowRight className="w-4 h-4" />
                Browse All Categories
              </Link>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {categoryData.tools.length} {categoryData.name} Tools
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.tools.map((tool) => (
              <Link
                key={tool.slug}
                to={tool.route}
                className="group bg-white p-6 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">
                  {tool.description}
                </p>
                <div className="flex items-center text-sm font-semibold text-primary">
                  Use Tool <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Related Categories */}
        <section className="max-w-6xl mx-auto px-4 py-12 bg-white">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse Other Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedCategories.map((cat) => (
              <Link
                key={cat.id}
                to={cat.path}
                className="group bg-slate-50 p-4 border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all text-center"
              >
                <span className="font-semibold text-slate-700 group-hover:text-primary transition-colors">
                  {cat.name} Tools
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        {faqs.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white p-6 border border-slate-200 rounded-2xl">
                  <h3 className="font-bold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
