import { Link } from 'react-router-dom';

export default function GuidesPage() {
  const guides = [
    { title: 'What Is a Mortgage and How Does It Work', slug: 'what-is-mortgage', cat: 'Finance' },
    { title: 'How to Reduce Your Mortgage Interest', slug: 'how-to-reduce-mortgage-interest', cat: 'Finance' },
    { title: 'What Is Mortgage Insurance and Do You Need It', slug: 'what-is-mortgage-insurance', cat: 'Finance' },
    { title: 'How Mortgage Interest Works: A Beginner Guide', slug: 'how-mortgage-interest-works', cat: 'Finance' },
    { title: 'How Much House Can I Afford', slug: 'how-much-house-can-i-afford', cat: 'Finance' },
    { title: 'What Is Loan Amortization and Why Does It Matter', slug: 'what-is-loan-amortization', cat: 'Finance' },
    { title: 'Fixed-Rate vs Adjustable-Rate Mortgage Guide', slug: 'fixed-vs-adjustable-rate-mortgage-guide', cat: 'Finance' },
    { title: 'Understanding BMI: Body Mass Index Explained', slug: 'understanding-bmi', cat: 'Health' },
    { title: 'How to Improve Your BMI and Maintain a Healthy Weight', slug: 'how-to-improve-bmi', cat: 'Health' },
    { title: 'Understanding Dimensional Weight in Shipping', slug: 'understanding-shipping-dim-weight', cat: 'Shipping' },
    { title: 'How Shipping Costs Are Calculated: A Complete Guide', slug: 'how-shipping-costs-are-calculated', cat: 'Shipping' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-5xl font-black tracking-tighter mb-12">GUIDES & INSIGHTS</h1>
      <div className="space-y-8">
        {guides.map((guide, i) => (
          <Link key={i} to={`/guides/${guide.slug}`} className="block group p-8 border rounded-lg hover:border-primary transition-all">
            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-2">{guide.cat}</span>
            <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">{guide.title}</h2>
            <p className="text-muted-foreground mt-4">Deep dive into the mechanics and optimization strategies for {guide.title.toLowerCase()}...</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
