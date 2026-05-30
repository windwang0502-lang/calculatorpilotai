import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { Link } from 'react-router-dom';
import { Target, Heart, Lock, Shield, Accessibility, Sparkles, Eye, RefreshCw, Users, Globe } from 'lucide-react';

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Our Mission' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    generateBreadcrumbSchema(breadcrumbItems),
  ],
};

const coreValues = [
  {
    icon: Accessibility,
    title: 'Accessibility',
    description: 'We believe powerful tools should be available to everyone, regardless of technical expertise or budget. Our calculators are designed to be intuitive and easy to use.',
  },
  {
    icon: Shield,
    title: 'Accuracy',
    description: 'We use industry-standard formulas and best practices to ensure our calculations are reliable. Every tool undergoes rigorous testing before release.',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data stays on your device. All calculations happen locally in your browser. We never collect, store, or share your personal information.',
  },
  {
    icon: Heart,
    title: 'User-Focused',
    description: 'We build tools based on user needs, not assumptions. Your feedback directly shapes what we create and improve.',
  },
];

const commitments = [
  {
    icon: Sparkles,
    title: 'Free Forever',
    description: 'Every calculator on CalcWise AI is 100% free to use. No hidden fees, no premium tiers, no paywalls. Access powerful tools without spending a dime.',
  },
  {
    icon: Eye,
    title: 'Transparent Formulas',
    description: 'We show you exactly how calculations work. No black boxes—you can understand the math behind every result.',
  },
  {
    icon: RefreshCw,
    title: 'Continuously Updated',
    description: 'We regularly improve our tools, add new features, and update calculations to reflect current industry standards and practices.',
  },
  {
    icon: Globe,
    title: 'Built for US Users',
    description: 'Our tools are designed with US users in mind, using familiar units, local conventions, and relevant standards for American audiences.',
  },
];

export default function OurMissionPage() {
  return (
    <>
      <PageMeta
        title="Our Mission - CalcWise AI"
        description="Learn about CalcWise AI's mission to provide free, accurate, and accessible calculators for everyone. Discover our commitment to privacy, accuracy, and user empowerment."
        canonical="https://www.calculatorpilotai.com/our-mission"
        jsonLd={jsonLd}
      />
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Mission</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Why CalcWise AI Exists
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Empowering everyone with free, accurate, and accessible calculation tools.
          </p>
          <p className="text-sm text-muted-foreground mt-3">Established: January 2026</p>
        </header>

        {/* Origin Story */}
        <section className="mb-16">
          <div className="bg-gradient-to-b from-slate-100 via-white to-slate-50 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl font-bold mb-6">The Problem We Solve</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Professional-grade calculators and analytical tools have historically been locked behind expensive software subscriptions, complex spreadsheets, or specialized knowledge. For millions of people making important decisions about their finances, health, shipping, or daily productivity, accessing accurate calculations meant either paying for premium tools or settling for rough estimates.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              CalcWise AI was created to change that. We believe that powerful computational tools should not be a luxury—they should be freely available to everyone who needs them.
            </p>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coreValues.map((value, i) => (
              <div key={i} className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Free Calculator Philosophy */}
        <section className="mb-16">
          <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold">Our Free Calculator Philosophy</h2>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">
              We believe access to accurate information should not depend on how much money you have. When someone is trying to figure out their mortgage payment, estimate shipping costs for their small business, or understand their health metrics, they deserve the same quality tools as a financial advisor or healthcare professional.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Every calculator on CalcWise AI is built with the same care and attention to accuracy, whether you're calculating for the first time or the thousandth time. Your zip code, income level, or budget should never determine the quality of tools available to you.
            </p>
          </div>
        </section>

        {/* Commitments */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">What We Commit To</h2>
          <div className="space-y-4">
            {commitments.map((item, i) => (
              <div key={i} className="bg-white p-6 border border-slate-200 rounded-xl hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy Commitment */}
        <section className="mb-16">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Our Privacy Commitment</h2>
                <p className="text-slate-500 text-sm">Your data stays with you</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              Privacy is not just a feature—it's a fundamental principle. When you use CalcWise AI:
            </p>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>
                <span>All calculations run locally in your browser</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>
                <span>We never store your inputs or results on our servers</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>
                <span>No account or sign-up required to use any tool</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                </div>
                <span>We don't track your calculations or browsing habits</span>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t">
              <Link to="/privacy-policy" className="text-primary font-semibold hover:underline text-sm">
                Read our full Privacy Policy →
              </Link>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section className="mb-16">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Accessibility className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Accessibility Commitment</h2>
                <p className="text-slate-500 text-sm">Tools for everyone</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              CalcWise AI is designed to be accessible to users of all backgrounds and abilities:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Intuitive interfaces that don't require technical knowledge</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Responsive design works on mobile, tablet, and desktop</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>Clear, plain-language explanations of results</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span>No complex registration or setup required</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Community */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-2xl p-8 md:p-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Users className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Built With the Community</h2>
            <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
              CalcWise AI grows through user feedback. Every suggestion, bug report, and idea helps us build better tools. We're committed to listening to our community and prioritizing the features that matter most to you.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-slate-900 text-white rounded-2xl p-8 md:p-10">
          <h2 className="text-xl font-bold mb-4 text-center">Ready to Get Started?</h2>
          <p className="text-slate-400 text-center mb-6 max-w-xl mx-auto">
            Explore our free calculators and tools. No sign-up required, no hidden fees—just accurate calculations when you need them.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/tools"
              className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse All Tools
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20 transition-colors"
            >
              Share Your Feedback
            </Link>
          </div>
        </section>

        {/* Footer Links */}
        <div className="mt-12 flex flex-wrap gap-4 text-sm text-muted-foreground justify-center">
          <Link to="/about" className="hover:text-primary">About Us</Link>
          <span>·</span>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
          <span>·</span>
          <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
          <span>·</span>
          <Link to="/terms" className="hover:text-primary">Terms of Use</Link>
          <span>·</span>
          <Link to="/disclaimer" className="hover:text-primary">Disclaimer</Link>
        </div>
      </div>
    </>
  );
}
