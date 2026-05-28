import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function CategoryPage() {
  const { category } = useParams();

  const allTools = [
    { title: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', cat: 'finance' },
    { title: 'Loan Calculator', path: '/tools/finance/loan-calculator', cat: 'finance' },
    { title: 'APR Calculator', path: '/tools/finance/apr-calculator', cat: 'finance' },
    { title: 'Refinance Calculator', path: '/tools/finance/refinance-calculator', cat: 'finance' },
    { title: 'Interest Calculator', path: '/tools/finance/interest-calculator', cat: 'finance' },
    { title: 'Debt Payoff Calculator', path: '/tools/finance/debt-payoff-calculator', cat: 'finance' },
    { title: 'BMI & Calorie Calculator', path: '/tools/health/bmi-calorie-calculator', cat: 'health' },
    { title: 'BMR Calculator', path: '/tools/health/bmr-calculator', cat: 'health' },
    { title: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator', cat: 'health' },
    { title: 'Protein Calculator', path: '/tools/health/protein-calculator', cat: 'health' },
    { title: 'Ideal Weight Calculator', path: '/tools/health/ideal-weight-calculator', cat: 'health' },
    { title: 'Water Intake Calculator', path: '/tools/health/water-intake-calculator', cat: 'health' },
    { title: 'Age Calculator', path: '/tools/time/age-calculator', cat: 'time' },
    { title: 'Date Difference Calculator', path: '/tools/time/date-difference-calculator', cat: 'time' },
    { title: 'Business Days Calculator', path: '/tools/time/business-days-calculator', cat: 'time' },
    { title: 'Countdown Calculator', path: '/tools/time/countdown-calculator', cat: 'time' },
    { title: 'Time Duration Calculator', path: '/tools/time/time-duration-calculator', cat: 'time' },
    { title: 'Age At Date Calculator', path: '/tools/time/age-at-date-calculator', cat: 'time' },
    { title: 'AI Detector', path: '/tools/ai/ai-detector', cat: 'ai' },
    { title: 'Prompt Generator', path: '/tools/ai/prompt-generator', cat: 'ai' },
    { title: 'AI Humanizer', path: '/tools/ai/ai-humanizer', cat: 'ai' },
    { title: 'Image Prompt Generator', path: '/tools/ai/image-prompt-generator', cat: 'ai' },
    { title: 'Email Generator', path: '/tools/ai/email-generator', cat: 'ai' },
    { title: 'Title Generator', path: '/tools/ai/title-generator', cat: 'ai' },
    { title: 'DIM Weight Calculator', path: '/tools/shipping/dim-weight-calculator', cat: 'shipping' },
    { title: 'Freight Class Calculator', path: '/tools/shipping/freight-class-calculator', cat: 'shipping' },
    { title: 'Shipping Cost Estimator', path: '/tools/shipping/shipping-cost-estimator', cat: 'shipping' },
    { title: 'Package Volume Calculator', path: '/tools/shipping/package-volume-calculator', cat: 'shipping' },
    { title: 'Chargeable Weight Calculator', path: '/tools/shipping/chargeable-weight-calculator', cat: 'shipping' },
    { title: 'Pallet Calculator', path: '/tools/shipping/pallet-calculator', cat: 'shipping' },
  ];

  const tools = allTools.filter(t => t.cat === category);

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <Link to="/" className="text-sm font-bold text-primary uppercase tracking-widest mb-4 inline-block">← Back to Home</Link>
      <h1 className="text-5xl font-black tracking-tighter mb-8 uppercase">{category} TOOLS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.length > 0 ? tools.map((tool, i) => (
          <Link key={i} to={tool.path} className="block group p-8 border rounded-lg hover:border-primary transition-all">
            <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">{tool.title}</h2>
            <p className="text-muted-foreground mt-2">Access our professional {tool.title.toLowerCase()} with AI insights.</p>
          </Link>
        )) : (
          <p className="text-muted-foreground">No tools found in this category.</p>
        )}
      </div>
    </div>
  );
}
