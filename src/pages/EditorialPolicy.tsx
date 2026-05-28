import PageMeta from '@/components/common/PageMeta';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, Users, FileText, Shield } from 'lucide-react';

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Editorial Policy' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    generateBreadcrumbSchema(breadcrumbItems),
  ],
};

export default function EditorialPolicy() {
  return (
    <>
      <PageMeta
        title="Editorial Policy - CalcWise AI"
        description="Learn how CalcWise AI creates, reviews, and maintains accurate content across all our calculators and guides."
        canonical="https://www.calculatorpilotai.com/editorial-policy"
        jsonLd={jsonLd}
      />
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Content Standards</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Editorial Policy</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Our commitment to creating trustworthy, accurate, and helpful content for every user.
          </p>
          <p className="text-sm text-muted-foreground mt-3">Last Updated: May 28, 2026</p>
        </header>

        <article className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-primary" />
              Our Editorial Mission
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              CalcWise AI was founded on the principle that everyone deserves access to accurate,
              trustworthy calculation tools and the educational content to understand them. Our editorial
              policy ensures that every calculator, guide, and comparison page meets the highest
              standards of accuracy, clarity, and usefulness.
            </p>
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg mb-3">Our Core Commitments</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Provide accurate, tested calculations that users can rely on for important decisions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Create educational content that genuinely helps users understand concepts, not just get answers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Be transparent about our methods, sources, and any limitations in our tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Update content when new information becomes available or when errors are identified</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              Who Creates Our Content
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Our content is created by a combination of domain experts, technical writers, and AI-assisted
              tools—all subject to rigorous review processes. Every piece of content goes through multiple
              layers of review before publication.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold mb-3">Subject Matter Experts</h3>
                <p className="text-muted-foreground text-sm">
                  Financial calculators are reviewed by professionals with backgrounds in banking, real estate,
                  and personal finance. Health tools are reviewed against current medical guidelines and
                  research. Shipping tools reflect real-world logistics industry practices.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold mb-3">Technical Writers</h3>
                <p className="text-muted-foreground text-sm">
                  Our editorial team includes writers with experience in technical communication,
                  educational content, and user experience design. They ensure our explanations are
                  clear, accessible, and genuinely helpful.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              Content Review and Update Schedule
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Information changes. Interest rates fluctuate, health guidelines evolve, and shipping
              regulations update. We maintain an active review schedule to keep our content current.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-24 flex-shrink-0 text-center">
                  <span className="text-2xl font-bold text-primary">Quarterly</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Financial Content Review</h4>
                  <p className="text-sm text-muted-foreground">
                    Interest rates, fee structures, tax information, and financial formulas are
                    verified against current data sources.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-24 flex-shrink-0 text-center">
                  <span className="text-2xl font-bold text-primary">Semi-Annual</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Health and Scientific Content</h4>
                  <p className="text-sm text-muted-foreground">
                    Health guidelines, BMI ranges, and nutritional recommendations are reviewed
                    against current medical consensus.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-24 flex-shrink-0 text-center">
                  <span className="text-2xl font-bold text-primary">Annual</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Comprehensive Content Audit</h4>
                  <p className="text-sm text-muted-foreground">
                    All content undergoes a full review to identify outdated information,
                    areas for improvement, and new content opportunities.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              Corrections and Feedback
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Despite our best efforts, errors can occur. We take accuracy seriously and have
              clear processes for addressing mistakes when they are identified.
            </p>

            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-amber-900 mb-3">If You Find an Error</h3>
              <p className="text-amber-800 mb-4">
                We encourage users to report potential errors. When you spot something that
                doesn't look right, please contact us with the specific page and the issue you've identified.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-amber-900 font-semibold hover:underline"
              >
                Report an Error →
              </Link>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <h3 className="font-bold mb-3">Our Correction Process</h3>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span>Report received and acknowledged within 2 business days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span>Content verified against authoritative sources</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span>Corrections implemented and page updated</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                  <span>You receive confirmation when the fix is live</span>
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Content You Can Trust</h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              When you use CalcWise AI, you can trust that:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Calculations are tested</span>
                  <p className="text-sm text-muted-foreground">
                    Every calculator is tested against known values and real-world scenarios
                    before publication.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Sources are cited</span>
                  <p className="text-sm text-muted-foreground">
                    When we cite statistics, formulas, or guidelines, we reference
                    authoritative sources.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <CheckCircle className="w-6 h-6 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold">Limitations are disclosed</span>
                  <p className="text-sm text-muted-foreground">
                    We clearly explain when a calculation is an estimate, when
                    individual circumstances may vary, and when professional advice is needed.
                  </p>
                </div>
              </li>
            </ul>
          </section>
        </article>

        <div className="mt-12 pt-8 border-t">
          <p className="text-muted-foreground">
            Questions about our editorial process?{' '}
            <Link to="/contact" className="text-primary font-semibold hover:underline">
              Contact us
            </Link>
            {' '}or read our{' '}
            <Link to="/ai-disclosure" className="text-primary font-semibold hover:underline">
              AI Disclosure
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
