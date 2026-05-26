import { Link } from 'react-router-dom';

export default function ComparePage() {
  const comparisons = [
    { title: 'Fixed-Rate vs Variable-Rate Mortgage', slug: 'fixed-vs-variable-mortgage', cat: 'Finance' },
    { title: '15-Year vs 30-Year Mortgage', slug: '15-year-vs-30-year-mortgage', cat: 'Finance' },
    { title: 'Buying a Home vs Renting', slug: 'mortgage-vs-rent', cat: 'Finance' },
    { title: 'Refinancing vs Taking a New Mortgage', slug: 'refinance-vs-new-mortgage', cat: 'Finance' },
    { title: 'Personal Loan vs Credit Card', slug: 'personal-loan-vs-credit-card', cat: 'Finance' },
    { title: 'FedEx vs UPS Shipping', slug: 'fedex-vs-ups-shipping', cat: 'Shipping' },
    { title: 'BMI vs Body Fat Percentage', slug: 'bmi-vs-body-fat-percentage', cat: 'Health' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-black tracking-tighter mb-12">COMPARISON TOOLS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comparisons.map((item, i) => (
          <Link key={i} to={`/compare/${item.slug}`} className="block group p-8 border rounded-lg hover:border-primary transition-all">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">{item.cat}</span>
            <h2 className="text-xl font-bold group-hover:text-primary transition-colors">{item.title}</h2>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Compare Now</span>
              <span className="text-primary font-bold">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
