import { useParams, Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';

const COMPARE_CONTENTS: Record<string, {
  title: string;
  optionA: { name: string; pros: string[]; cons: string[] };
  optionB: { name: string; pros: string[]; cons: string[] };
  verdict: string;
  toolPath: string;
}> = {
  'fixed-vs-variable-mortgage': {
    title: 'Fixed-Rate vs Variable-Rate Mortgage',
    optionA: {
      name: 'Fixed-Rate Mortgage',
      pros: [
        'Monthly payments stay the same for the entire term',
        'Protection against interest rate rises',
        'Easier to budget and plan long-term finances',
      ],
      cons: [
        'Usually starts with a higher rate than variable',
        'If rates drop, you are locked in unless you refinance',
        'Less flexibility in early repayment terms',
      ],
    },
    optionB: {
      name: 'Variable-Rate Mortgage',
      pros: [
        'Often starts with a lower introductory rate',
        'If market rates drop, your payments decrease',
        'More flexible early repayment options',
      ],
      cons: [
        'Payments can rise unpredictably with rate hikes',
        'Harder to budget long-term',
        'Risk of affordability issues if rates spike',
      ],
    },
    verdict: 'Choose a fixed-rate mortgage if you value stability and plan to stay in the home long-term. Choose a variable-rate mortgage if you can tolerate risk and expect rates to remain stable or decline.',
    toolPath: '/tools/finance/mortgage-calculator',
  },
  '15-year-vs-30-year-mortgage': {
    title: '15-Year vs 30-Year Mortgage',
    optionA: {
      name: '15-Year Mortgage',
      pros: [
        'Significantly lower total interest paid',
        'Build equity much faster',
        'Often comes with a lower interest rate',
      ],
      cons: [
        'Much higher monthly payments',
        'Less financial flexibility month-to-month',
        'Harder to qualify due to higher payment requirement',
      ],
    },
    optionB: {
      name: '30-Year Mortgage',
      pros: [
        'Lower monthly payments improve affordability',
        'More flexibility to invest savings elsewhere',
        'Easier to qualify with lower monthly obligation',
      ],
      cons: [
        'Total interest paid is roughly double',
        'Slower equity buildup',
        'Rate can be slightly higher than 15-year loans',
      ],
    },
    verdict: 'A 15-year mortgage is ideal if you can comfortably afford the higher payments and want to minimize total interest. A 30-year mortgage is better if you need lower monthly payments or want to invest the difference.',
    toolPath: '/tools/finance/mortgage-calculator',
  },
  'mortgage-vs-rent': {
    title: 'Buying a Home vs Renting',
    optionA: {
      name: 'Buying a Home',
      pros: [
        'Build equity and long-term wealth as property values appreciate',
        'Stable monthly payments with a fixed-rate mortgage',
        'Tax deductions on mortgage interest and property taxes',
        'Freedom to renovate, customize, and landscape your property',
      ],
      cons: [
        'High upfront costs including down payment and closing costs',
        'Responsible for all maintenance, repairs, and property taxes',
        'Less flexibility to relocate quickly for job or lifestyle changes',
        'Risk of property value depreciation in a declining market',
      ],
    },
    optionB: {
      name: 'Renting',
      pros: [
        'Lower upfront costs with just a security deposit and first month',
        'Flexibility to move without selling a property',
        'No responsibility for major maintenance or repairs',
        'Access to amenities like pools, gyms, and concierge services',
      ],
      cons: [
        'Monthly payments do not build equity or wealth',
        'Rent can increase at lease renewal',
        'Limited ability to customize or renovate the space',
        'Subject to landlord rules and potential non-renewal',
      ],
    },
    verdict: 'Buy if you plan to stay in the same location for at least 5-7 years, have stable income, and can afford the upfront costs. Rent if you value flexibility, are unsure about your long-term location, or live in a market where home prices are disproportionately high compared to rent.',
    toolPath: '/tools/finance/mortgage-calculator',
  },
  'refinance-vs-new-mortgage': {
    title: 'Refinancing vs Taking a New Mortgage',
    optionA: {
      name: 'Refinancing',
      pros: [
        'Lower interest rate can reduce monthly payments significantly',
        'Switch from ARM to fixed-rate for payment stability',
        'Cash-out refinance allows access to home equity',
        'Can shorten loan term to build equity faster',
      ],
      cons: [
        'Closing costs typically range from 2% to 5% of loan amount',
        'Extends loan term if resetting to 30 years',
        'Requires good credit and sufficient home equity',
        'May not break even if selling the home soon after',
      ],
    },
    optionB: {
      name: 'New Purchase Mortgage',
      pros: [
        'Opportunity to upgrade to a better home or location',
        'New property may appreciate faster than current one',
        'Can choose a home that better fits current needs',
        'Potential tax benefits from a new primary residence',
      ],
      cons: [
        'Moving costs including realtor fees, moving services, and staging',
        'Competitive housing market can drive up prices',
        'Emotional stress of selling and buying simultaneously',
        'No guarantee the new home will appreciate more',
      ],
    },
    verdict: 'Refinance if you are happy with your home and want to lower payments or access equity. Consider a new mortgage only if your current home no longer meets your needs and the housing market supports a favorable sale and purchase.',
    toolPath: '/tools/finance/mortgage-calculator',
  },
  'personal-loan-vs-credit-card': {
    title: 'Personal Loan vs Credit Card',
    optionA: {
      name: 'Personal Loan',
      pros: [
        'Fixed interest rate and predictable monthly payments',
        'Typically lower interest rates than credit cards (8-15% vs 18-29%)',
        'Fixed repayment term means a clear debt-free date',
        'Can consolidate multiple debts into one payment',
      ],
      cons: [
        'Requires a hard credit inquiry during application',
        'Origination fees may apply (1-8% of loan amount)',
        'Less flexible than a revolving line of credit',
        'Missing payments can damage credit significantly',
      ],
    },
    optionB: {
      name: 'Credit Card',
      pros: [
        'Revolving credit allows borrowing only what you need',
        'No interest if balance is paid in full each month',
        'Rewards, cashback, and purchase protection benefits',
        'Builds credit history with responsible use',
      ],
      cons: [
        'High variable interest rates if carrying a balance',
        'Minimum payments can lead to years of debt',
        'Temptation to overspend with available credit',
        'Fees for balance transfers, cash advances, and late payments',
      ],
    },
    verdict: 'Use a personal loan for large, one-time expenses like debt consolidation or home improvements where you need a fixed repayment plan. Use credit cards for everyday purchases that you can pay off monthly, or for rewards on spending you would do anyway.',
    toolPath: '/tools/finance/mortgage-calculator',
  },
  'fedex-vs-ups-shipping': {
    title: 'FedEx vs UPS Shipping',
    optionA: {
      name: 'FedEx',
      pros: [
        'Strong network for overnight and express deliveries',
        'Excellent international shipping infrastructure',
        'Reliable Saturday delivery options at no extra cost',
        'Advanced tracking and proactive delivery notifications',
      ],
      cons: [
        'Often more expensive than UPS for ground shipments',
        'Residential delivery surcharges can add up',
        'Fewer physical retail locations than UPS',
        'Dimensional weight divisor of 139 is standard',
      ],
    },
    optionB: {
      name: 'UPS',
      pros: [
        'Extensive ground shipping network with competitive pricing',
        'Large number of UPS Store locations for easy drop-off',
        'Reliable for heavy and bulky package shipments',
        'Strong e-commerce integration and API tools',
      ],
      cons: [
        'Saturday delivery typically incurs additional fees',
        'International express options fewer than FedEx',
        'Some rural areas have limited service coverage',
        'Dimensional weight divisor of 139 is standard',
      ],
    },
    verdict: 'Choose FedEx for time-sensitive, international, and express shipments. Choose UPS for cost-effective ground shipping, heavy packages, and when convenient drop-off locations matter. Both use the same DIM divisor of 139 for domestic US shipments.',
    toolPath: '/tools/shipping/dim-weight-calculator',
  },
  'bmi-vs-body-fat-percentage': {
    title: 'BMI vs Body Fat Percentage',
    optionA: {
      name: 'BMI',
      pros: [
        'Extremely quick and easy to calculate',
        'No special equipment needed',
        'Widely recognized and used by doctors',
      ],
      cons: [
        'Does not distinguish muscle from fat',
        'Ignores fat distribution patterns',
        'Less accurate for athletes and older adults',
      ],
    },
    optionB: {
      name: 'Body Fat Percentage',
      pros: [
        'Directly measures fat tissue',
        'Better predictor of health risks',
        'Accounts for muscle mass differences',
      ],
      cons: [
        'Requires specialized tools or calipers',
        'Less convenient for frequent monitoring',
        'Measurement accuracy varies by method',
      ],
    },
    verdict: 'BMI is an excellent screening tool for the general population due to its simplicity. Body fat percentage provides a more accurate picture for athletes and those seeking precise body composition data.',
    toolPath: '/tools/health/bmi-calorie-calculator',
  },
};

function getCompare(slug?: string) {
  if (slug && COMPARE_CONTENTS[slug]) return COMPARE_CONTENTS[slug];
  return {
    title: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Comparison',
    optionA: {
      name: 'Option A',
      pros: ['Reliable and proven approach', 'Industry standard with wide support'],
      cons: ['May lack modern features', 'Potentially higher long-term cost'],
    },
    optionB: {
      name: 'Option B',
      pros: ['Modern and feature-rich', 'Often more cost-effective'],
      cons: ['Newer with less proven track record', 'Learning curve may be steeper'],
    },
    verdict: 'The best choice depends on your specific needs, risk tolerance, and long-term goals. Use our calculator to simulate both scenarios.',
    toolPath: '/',
  };
}

export default function CompareDetailPage() {
  const { slug } = useParams();
  const data = getCompare(slug);

  return (
    <>
      <PageMeta title={data.title} description={`Side-by-side comparison of ${data.optionA.name} and ${data.optionB.name}. Find the best choice for your needs.`} />
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-20">
        <Breadcrumb items={[
          { name: 'Home', url: '/' },
          { name: 'Compare', url: '/compare' },
          { name: data.title },
        ]} />
        <h1 className="text-4xl font-black tracking-tighter mb-8 uppercase">{data.title}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 border rounded-xl bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{data.optionA.name}</h2>
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2">Pros</h3>
              <ul className="space-y-2">
                {data.optionA.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-rose-500 mb-2">Cons</h3>
              <ul className="space-y-2">
                {data.optionA.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-rose-500 font-bold mt-0.5">−</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="p-8 border rounded-xl bg-white shadow-sm">
            <h2 className="text-2xl font-bold mb-4">{data.optionB.name}</h2>
            <div className="mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-2">Pros</h3>
              <ul className="space-y-2">
                {data.optionB.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-emerald-500 font-bold mt-0.5">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-rose-500 mb-2">Cons</h3>
              <ul className="space-y-2">
                {data.optionB.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-rose-500 font-bold mt-0.5">−</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-10 rounded-2xl mb-12">
          <h2 className="text-2xl font-bold mb-4">Verdict</h2>
          <p className="text-slate-300 leading-relaxed mb-6">{data.verdict}</p>
        </div>

        <div className="text-center">
          <Link to={data.toolPath} className="inline-block bg-primary text-white font-bold py-3 px-6 rounded uppercase tracking-widest hover:bg-primary/90 transition-colors">
            Try the Calculator
          </Link>
        </div>
      </div>
    </>
  );
}
