import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/schema';
import {
  Sparkles,
  CreditCard,
  Heart,
  Clock,
  Bot,
  Truck,
  ArrowRight,
  Mail,
  Shield,
  RefreshCw,
  Eye,
  CheckCircle,
  Calculator,
  BookOpen,
  Grid3X3,
} from 'lucide-react';
import { categories, getPopularTools, getFeaturedTools, getToolStats } from '@/data/tools';

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'About Us' },
];

const orgSchema = generateOrganizationSchema();
const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [orgSchema, breadcrumbSchema],
};

// Dynamic stats from tools registry
const toolStats = getToolStats();
const totalCategories = categories.length;
const totalGuides = 10; // Current number of guides in the system

const platformStats = [
  { value: `${toolStats.totalTools}+`, label: 'Calculators', icon: Calculator },
  { value: `${totalCategories}`, label: 'Categories', icon: Grid3X3 },
  { value: `${totalGuides}+`, label: 'Guides', icon: BookOpen },
];

const offerings = [
  {
    title: 'Finance Tools',
    desc: 'Mortgage calculators, loan amortization, interest calculations, and debt payoff planners to help you make smarter financial decisions.',
    icon: CreditCard,
    path: '/tools/finance',
  },
  {
    title: 'Health Tools',
    desc: 'BMI calculator, BMR calculator, body fat calculator, and protein calculator to track your health and fitness goals.',
    icon: Heart,
    path: '/tools/health',
  },
  {
    title: 'Time Tools',
    desc: 'Age calculator, date difference calculator, business days calculator, and countdown tools for precise time tracking.',
    icon: Clock,
    path: '/tools/time',
  },
  {
    title: 'AI Tools',
    desc: 'AI text detector, prompt generator, humanizer, image prompt generator, email generator, and title generator.',
    icon: Bot,
    path: '/tools/ai',
  },
  {
    title: 'Shipping Tools',
    desc: 'DIM weight calculator, freight class calculator, package volume calculator, and chargeable weight calculator for logistics.',
    icon: Truck,
    path: '/tools/shipping',
  },
];

const trustPoints = [
  { icon: CheckCircle, text: 'Free to use, always' },
  { icon: Shield, text: 'Built for practical decisions' },
  { icon: RefreshCw, text: 'Updated and improved regularly' },
  { icon: Eye, text: 'Privacy-friendly, no tracking' },
];

export default function AboutPage() {
  const canonicalUrl = 'https://www.calculatorpilotai.com/about';

  return (
    <>
      <PageMeta
        title="About Us - Free AI-Powered Calculators and Tools"
        description="Learn about CalcWise AI, our mission to provide free AI-powered calculators for everyone, and explore our suite of tools for finance, health, shipping, and productivity."
        canonical={canonicalUrl}
        ogType="website"
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <Breadcrumb items={[
            { name: 'Home', url: '/' },
            { name: 'About Us' },
          ]} />

          {/* Hero Section */}
          <section className="relative bg-gradient-to-b from-slate-100 via-white to-slate-50 rounded-3xl p-8 md:p-12 mb-12 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl" />
            </div>
            <div className="relative text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-slate-600">About CalcWise AI</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
                Free AI-Powered Calculators<br/><span className="text-primary">for Everyone</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Professional-grade calculators and detectors enhanced with AI insights. Built for US users who need fast, accurate, and free tools for finance, health, shipping, and more.
              </p>
            </div>
          </section>

          {/* Mission Card */}
          <section className="mb-12">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h2>
                  <p className="text-slate-500 leading-relaxed">
                    CalcWise AI was created with a clear mission: to make professional-grade calculators and analytical tools accessible to everyone, completely free of charge. We believe that powerful computational assistance should not be locked behind paywalls or require specialized software.
                  </p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                In a world where information overload is common, we cut through the noise by delivering focused, accurate, and actionable results. Every tool on our platform is designed to solve real problems quickly and transparently, without unnecessary complexity or hidden fees.
              </p>
            </div>
          </section>

          {/* Platform Statistics */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 md:p-10">
              <h2 className="text-xl font-bold mb-6 text-center">Platform Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {platformStats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
                      <stat.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* What We Offer */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">What We Offer</h2>
              <p className="text-slate-500 mt-2">Explore our growing suite of free tools</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offerings.map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  className="group bg-white p-6 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  <span className="text-sm font-semibold text-primary flex items-center gap-1">
                    Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Trust Section */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 md:p-10">
              <h2 className="text-xl font-bold mb-6 text-center">Why Choose CalcWise AI</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trustPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <point.icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-slate-300">{point.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* AI-Powered Section */}
          <section className="mb-12">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">AI-Powered Insights</h2>
                  <p className="text-slate-500 leading-relaxed">
                    What sets CalcWise AI apart from traditional calculators is our integrated AI Insight engine. After every calculation, our system generates a contextual analysis that goes beyond raw numbers.
                  </p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">
                For example, after calculating your mortgage payment, the AI evaluates your debt-to-income ratio and provides a risk assessment along with actionable suggestions for improvement. After a BMI calculation, it offers personalized health recommendations tailored to your specific results. These insights transform simple arithmetic into meaningful decision support.
              </p>
            </div>
          </section>

          {/* Key Tools Highlight */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Popular Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/tools/finance/mortgage-calculator" className="bg-white p-5 border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all">
                <CreditCard className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-semibold text-slate-900 mb-1">Mortgage Calculator</h3>
                <p className="text-xs text-slate-500">Estimate monthly payments with detailed amortization.</p>
              </Link>
              <Link to="/tools/health/bmi-calorie-calculator" className="bg-white p-5 border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all">
                <Heart className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-semibold text-slate-900 mb-1">BMI & Calorie Calculator</h3>
                <p className="text-xs text-slate-500">Track body composition and daily caloric needs.</p>
              </Link>
              <Link to="/tools/ai/ai-detector" className="bg-white p-5 border border-slate-200 rounded-xl hover:border-primary hover:shadow-md transition-all">
                <Bot className="w-5 h-5 text-primary mb-2" />
                <h3 className="font-semibold text-slate-900 mb-1">AI Text Detector</h3>
                <p className="text-xs text-slate-500">Analyze text to detect AI-generated content.</p>
              </Link>
            </div>
          </section>

          {/* Who We Serve */}
          <section className="mb-12">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Who We Serve</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Our tools are built for a wide audience. Home buyers and real estate professionals rely on our mortgage calculator for quick payment estimates and financial planning. Fitness enthusiasts and healthcare-conscious individuals use our BMI calculator to track body composition. E-commerce sellers and small business owners depend on our shipping calculator to optimize packaging and control logistics costs. Writers, educators, and content creators utilize our AI detector to assess text authenticity.
              </p>
              <p className="text-slate-600 leading-relaxed">
                In short, if you need fast, accurate calculations with intelligent context, CalcWise AI is designed for you.
              </p>
            </div>
          </section>

          {/* Important Disclaimer */}
          <section className="mb-12">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8">
              <h2 className="text-lg font-bold text-amber-800 mb-3">Important Disclaimer</h2>
              <p className="text-amber-700 text-sm leading-relaxed">
                While we strive for accuracy and reliability in every tool we build, all results generated on this platform are provided for informational and educational purposes only. They should not be construed as professional financial, medical, legal, or logistical advice. Always consult with qualified professionals before making decisions that could significantly impact your finances, health, or business operations.
              </p>
            </div>
          </section>

          {/* Constantly Evolving */}
          <section className="mb-12">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Constantly Evolving</h2>
              <p className="text-slate-600 leading-relaxed">
                CalcWise AI is not a static platform. We are actively developing new calculators and tools to expand our coverage across additional domains including productivity, education, engineering, and data analysis. Our roadmap includes advanced financial planning tools, comprehensive health metric trackers, unit converters, password generators, and specialized calculators for developers and designers. We release updates regularly and welcome user feedback to help us prioritize which tools to build next.
              </p>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="bg-slate-900 text-white rounded-2xl p-8 md:p-10 text-center">
            <div className="max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-3">Questions or Feedback?</h2>
              <p className="text-slate-400 mb-6">
                We value your feedback, suggestions, and questions. Whether you have found a bug, want to request a new calculator, or simply want to say hello, we would love to hear from you.
              </p>
              <a
                href="mailto:support@calculatorpilotai.com"
                className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                support@calculatorpilotai.com
              </a>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
