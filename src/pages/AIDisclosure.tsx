import PageMeta from '@/components/common/PageMeta';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Clock, Brain, FileCheck, AlertTriangle } from 'lucide-react';

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'AI Disclosure' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    generateBreadcrumbSchema(breadcrumbItems),
  ],
};

export default function AIDisclosure() {
  return (
    <>
      <PageMeta
        title="AI Disclosure - CalcWise AI"
        description="Learn how CalcWise AI uses artificial intelligence to create and improve our calculator tools and content."
        canonical="https://www.calculatorpilotai.com/ai-disclosure"
        jsonLd={jsonLd}
      />
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Transparency</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">AI Disclosure</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            How we use artificial intelligence to create better tools and content for you.
          </p>
          <p className="text-sm text-muted-foreground mt-3">Last Updated: May 28, 2026</p>
        </header>

        <article className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              Our Approach to AI
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Artificial intelligence is a powerful tool that, when used responsibly, helps us create
              more comprehensive, accurate, and helpful content for our users. We believe in being
              transparent about how we use AI so you can make informed decisions about the content
              you find here.
            </p>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-8 mb-6">
              <h3 className="font-bold text-lg mb-4">In Short</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span>AI assists human-created content with editing and enhancement</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span>All AI-assisted content is reviewed by human editors</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span>Calculator formulas and algorithms are human-designed and tested</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  <span>We clearly label when AI insights are provided</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-primary" />
              Where We Use AI
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">1</span>
                  AI-Powered Insights
                </h3>
                <p className="text-muted-foreground mb-3">
                  Our calculators include AI-powered insights that analyze your inputs and provide
                  personalized recommendations. These insights are generated algorithmically based on
                  established formulas and best practices.
                </p>
                <div className="bg-slate-50 rounded-lg p-3 text-sm">
                  <span className="font-semibold">Example:</span> After calculating your mortgage payment,
                  our AI provides context about affordability and recommendations based on your
                  income and loan terms.
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">2</span>
                  Content Enhancement
                </h3>
                <p className="text-muted-foreground mb-3">
                  We use AI tools to help draft and enhance our educational content, guides, and
                  FAQ sections. AI assists with research summaries, structure, and grammar review.
                </p>
                <div className="bg-slate-50 rounded-lg p-3 text-sm">
                  <span className="font-semibold">Example:</span> When creating a guide about mortgages,
                  AI helps draft initial content which human editors review, expand, and verify
                  for accuracy.
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">3</span>
                  Tool Features
                </h3>
                <p className="text-muted-foreground mb-3">
                  Some of our tools, like the AI Humanizer and Prompt Generator, are designed to
                  help users work with AI more effectively. These tools use AI techniques to
                  transform or generate content based on user inputs.
                </p>
                <div className="bg-slate-50 rounded-lg p-3 text-sm">
                  <span className="font-semibold">Example:</span> The AI Humanizer transforms text
                  to sound more natural, using rule-based transformations and pattern analysis.
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              What AI Does NOT Do
            </h2>
            <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-rose-900 mb-2">Important Limitations</h3>
                  <p className="text-rose-800">
                    AI is a tool that assists human decision-making—it does not replace human
                    judgment, professional advice, or authoritative sources.
                  </p>
                </div>
              </div>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">✗</span>
                <div>
                  <span className="font-semibold">Replace Professional Advice</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our content and tools provide general information, not professional advice.
                    For significant financial, health, or legal decisions, consult qualified professionals.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">✗</span>
                <div>
                  <span className="font-semibold">Guarantee Accuracy of AI Insights</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    AI-generated insights are based on patterns and best practices—they are not
                    medical, financial, or legal advice. Always verify with authoritative sources.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">✗</span>
                <div>
                  <span className="font-semibold">Override Calculator Formulas</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Calculator results are based on established mathematical formulas, not AI.
                    AI insights provide context, not different calculation results.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              How We Ensure Quality
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Using AI responsibly means implementing safeguards to ensure the content we produce
              is accurate, helpful, and trustworthy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5">
                <h3 className="font-bold mb-2">Human Review</h3>
                <p className="text-sm text-muted-foreground">
                  All AI-assisted content is reviewed by human editors before publication.
                  Humans verify accuracy, clarity, and usefulness.
                </p>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5">
                <h3 className="font-bold mb-2">Source Verification</h3>
                <p className="text-sm text-muted-foreground">
                  We verify claims against authoritative sources: government data, academic
                  research, and established industry practices.
                </p>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5">
                <h3 className="font-bold mb-2">Expert Consultation</h3>
                <p className="text-sm text-muted-foreground">
                  Sensitive topics like health and finance are reviewed by professionals
                  with relevant expertise before publication.
                </p>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-5">
                <h3 className="font-bold mb-2">Regular Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Content is reviewed quarterly and updated when new information becomes
                  available or when errors are identified.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">User Transparency</h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              We believe you deserve to know when you're interacting with AI-generated or
              AI-assisted content. Here's how we keep you informed:
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">AI</span>
                </div>
                <div>
                  <h3 className="font-bold">AI-Generated Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    When our tools provide AI-generated insights, we clearly label them with
                    an "AI Insight" indicator so you know the context is algorithmic, not
                    human-generated advice.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Human-Created Calculations</h3>
                  <p className="text-sm text-muted-foreground">
                    The actual calculation results from our tools are based on established
                    mathematical formulas—they are not AI-generated. AI provides context
                    around those results.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Last Updated Dates</h3>
                  <p className="text-sm text-muted-foreground">
                    We include "Last Updated" dates on content pages so you know when
                    information was last reviewed.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                We are committed to using AI responsibly to create better tools and content for you.
                AI helps us be more comprehensive, more responsive, and more helpful—but it always
                works alongside human judgment, not instead of it.
              </p>
              <p className="text-slate-300 leading-relaxed">
                If you have questions about how we use AI, or if you have concerns about specific
                content, we welcome your feedback.
              </p>
            </div>
          </section>
        </article>

        <div className="mt-12 pt-8 border-t">
          <p className="text-muted-foreground">
            Questions about our AI practices?{' '}
            <Link to="/contact" className="text-primary font-semibold hover:underline">
              Contact us
            </Link>
            {' '}or read our{' '}
            <Link to="/editorial-policy" className="text-primary font-semibold hover:underline">
              Editorial Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
