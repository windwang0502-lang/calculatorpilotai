import { useParams, Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { ArrowRight, CheckCircle, XCircle, Scale, BookOpen, Calculator } from 'lucide-react';

const COMPARE_CONTENTS: Record<string, {
  title: string;
  author: string;
  datePublished: string;
  dateModified: string;
  readTime: string;
  category: string;
  intro: string;
  whenToChooseA: string;
  whenToChooseB: string;
  optionA: { name: string; pros: string[]; cons: string[] };
  optionB: { name: string; pros: string[]; cons: string[] };
  verdict: string;
  toolPath: string;
  toolName: string;
  relatedGuides: string[];
  relatedTools: string[];
  faqs: { question: string; answer: string }[];
}> = {
  'fixed-vs-variable-mortgage': {
    title: 'Fixed-Rate vs Variable-Rate Mortgage',
    author: 'CalcWise AI',
    datePublished: '2026-05-01',
    dateModified: '2026-05-28',
    readTime: '11 min read',
    category: 'Finance',
    intro: 'Choosing between a fixed-rate and adjustable-rate mortgage is one of the most consequential financial decisions you will make. Your choice affects not just your monthly payment, but your long-term financial flexibility, your ability to plan for the future, and your peace of mind. Here is what you need to know to make the right call for your situation.',
    whenToChooseA: 'Choose a fixed-rate mortgage if you value predictability, plan to stay in the home long-term, prefer stable monthly payments for budgeting, or are on a fixed income.',
    whenToChooseB: 'Choose an adjustable-rate mortgage if you expect to sell or refinance before the adjustment period begins, are confident rates will stay stable, or need lower initial payments to qualify.',
    optionA: {
      name: 'Fixed-Rate Mortgage',
      pros: [
        'Monthly payment stays the same for the entire loan term — no surprises regardless of economic conditions',
        'Complete protection against future interest rate increases',
        'Simpler budgeting with predictable housing costs for 15-30 years',
        'Peace of mind knowing your rate is locked regardless of inflation or market changes',
        'Easier long-term financial planning and stability',
      ],
      cons: [
        'Typically starts 0.25-0.75% higher than adjustable rates',
        'You pay a premium for the certainty and stability',
        'If market rates drop, you would need to refinance to get a lower rate',
        'Higher initial payments compared to ARMs during the fixed period',
      ],
    },
    optionB: {
      name: 'Variable-Rate Mortgage (ARM)',
      pros: [
        'Lower initial interest rate for the first 3-10 years',
        'If market rates stay stable or drop, your payments stay manageable',
        'Lower initial payments can help first-time buyers qualify',
        'More flexibility with lower upfront commitment',
        'If you sell before adjustments, you only benefited from the lower rate',
      ],
      cons: [
        'Payments can increase significantly when rates adjust upward',
        'Budget uncertainty — payment changes make long-term planning harder',
        'Complex loan terms that require careful understanding',
        'Rate adjustment caps limit increases but do not prevent them entirely',
      ],
    },
    verdict: 'Fixed-rate mortgages suit most borrowers who value stability and plan to stay in their home for years. Adjustable-rate mortgages make sense for specific situations: when you expect to move before the adjustment period, need lower initial payments to qualify, or have confidence that rates will remain stable or decline.',
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
    relatedGuides: ['what-is-mortgage', 'how-to-reduce-mortgage-interest'],
    relatedTools: ['mortgage-calculator', 'refinance-calculator', 'apr-calculator'],
    faqs: [
      { question: 'Which mortgage type is safer for budgeting?', answer: 'Fixed-rate mortgages are safer for budgeting because your payment stays exactly the same for the entire loan term. ARMs introduce payment uncertainty after the initial fixed period.' },
      { question: 'When does an adjustable-rate mortgage actually make sense?', answer: 'ARMs make sense when you plan to sell or refinance before the adjustment period begins (typically 3-7 years), need lower initial payments to qualify, or believe rates will stay stable or decline.' },
      { question: 'How much higher can ARM rates go over time?', answer: 'Most ARMs cap increases at 2% per adjustment period and 5-6% total over the loan life. A 6% ARM could theoretically reach 11-12% maximum, not infinity.' },
      { question: 'What happens if I cannot afford payments after an ARM adjusts?', answer: 'You would need to refinance (if eligible), sell the home, or work with your servicer on alternatives. Payment shock is a real risk of ARMs that borrowers must plan for.' },
    ],
  },
  '15-year-vs-30-year-mortgage': {
    title: '15-Year vs 30-Year Mortgage: Which Saves You More?',
    author: 'CalcWise AI',
    datePublished: '2026-05-03',
    dateModified: '2026-05-28',
    readTime: '10 min read',
    category: 'Finance',
    intro: 'The choice between a 15-year and 30-year mortgage fundamentally reshapes your financial life. The 15-year path builds wealth faster through interest savings. The 30-year path offers flexibility. Neither is universally correct — the right answer depends on your income stability, career trajectory, and financial goals.',
    whenToChooseA: 'Choose a 15-year mortgage if you can comfortably afford the higher payment, prioritize building equity quickly, want to minimize total interest paid, and plan to stay in your home long-term.',
    whenToChooseB: 'Choose a 30-year mortgage if you need lower payments for affordability, value financial flexibility, want to invest the difference elsewhere, or are uncertain about your long-term plans.',
    optionA: {
      name: '15-Year Mortgage',
      pros: [
        'Significantly lower total interest — potentially saving $100,000+ on a $400,000 loan',
        'Build equity at roughly double the speed of a 30-year loan',
        'Typically comes with a lower interest rate (0.25-0.5% less)',
        'Debt-free decades earlier, freeing income for other goals',
        'Forced savings through accelerated principal paydown',
      ],
      cons: [
        'Monthly payment is substantially higher — often 40-50% more than a 30-year payment',
        'Less monthly flexibility for other financial priorities',
        'Harder to qualify with higher payment requirements',
        'Reduced emergency fund capacity during the payment period',
        'Higher risk if your income decreases unexpectedly',
      ],
    },
    optionB: {
      name: '30-Year Mortgage',
      pros: [
        'Lower monthly payments improve cash flow and financial flexibility',
        'Easier to qualify with lower debt-to-income ratios',
        'More room in your budget for investments, savings, and emergencies',
        'Option to make extra payments when convenient without required minimums',
        'Lower risk if your income decreases or unexpected expenses arise',
      ],
      cons: [
        'Total interest paid is roughly double compared to a 15-year loan',
        'Slower equity building means less financial buffer if you need to sell',
        'Interest rate typically 0.25-0.5% higher than 15-year loans',
        'Takes three full decades to own your home outright',
        'Interest compounds against you for twice as long',
      ],
    },
    verdict: 'A 15-year mortgage wins mathematically if you can afford the payment — the total cost difference is enormous. But the 30-year mortgage wins psychologically if the higher payment would strain your budget or cause anxiety. The best mortgage is one you can comfortably afford while still building toward your other financial goals.',
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
    relatedGuides: ['what-is-mortgage', 'how-mortgage-interest-works'],
    relatedTools: ['mortgage-calculator', 'loan-calculator'],
    faqs: [
      { question: 'How much total interest do I save with a 15-year mortgage?', answer: 'On a $400,000 loan at 7%, a 15-year mortgage costs roughly $232,000 in total interest versus ~$559,000 for a 30-year — saving over $300,000.' },
      { question: 'Should I get a 30-year and make extra payments?', answer: 'This hybrid approach works if you have the discipline to actually make extra payments. It offers flexibility but requires consistent action rather than the "forced savings" of a 15-year.' },
      { question: 'What if I cannot afford the 15-year payment?', answer: 'Consider a 30-year mortgage and make it a goal to accelerate payments. You can always pay extra toward principal without the mandatory higher payment.' },
      { question: 'Does a 15-year mortgage build equity faster?', answer: 'Yes, dramatically. Your larger payments apply far more to principal each month. After 5 years on a 15-year, you might have $80,000+ in equity versus $30,000+ on a 30-year.' },
    ],
  },
  'mortgage-vs-rent': {
    title: 'Buying a Home vs Renting: The Real Trade-offs',
    author: 'CalcWise AI',
    datePublished: '2026-05-05',
    dateModified: '2026-05-28',
    readTime: '10 min read',
    category: 'Finance',
    intro: 'The rent vs. buy decision is deeply personal and involves far more than monthly payment math. Your lifestyle, career stability, and plans for the next 5-10 years matter as much as interest rates and home prices. Here is a framework to think through what is right for you.',
    whenToChooseA: 'Choose buying if you plan to stay in one location for 5+ years, value stability and customization, can afford the upfront costs, and want to build long-term equity.',
    whenToChooseB: 'Choose renting if your future plans are uncertain, you value geographic flexibility, the buy vs. rent ratio is unfavorable in your area, or you prefer to avoid maintenance responsibilities.',
    optionA: {
      name: 'Buying a Home',
      pros: [
        'Builds equity over time as you pay down the mortgage',
        'Lock in your housing cost with a fixed-rate mortgage regardless of future rent increases',
        'Freedom to customize, renovate, and make the space your own',
        'Potential tax benefits from mortgage interest deductions (if you itemize)',
        'Forced savings mechanism — your equity grows even if you just pay on schedule',
        'No landlord to answer to or renew negotiations with',
      ],
      cons: [
        'Large upfront costs: down payment (5-20%), closing costs (2-5% of loan), moving expenses',
        'Maintenance and repair costs fall entirely on you — budget 1-2% of home value annually',
        'Less flexibility to relocate if your situation or career changes',
        'Early years of payments go mostly to interest, not equity',
        'Property taxes, insurance, and HOA fees add substantially to monthly costs',
        'Illiquid asset — selling takes time and carries transaction costs',
      ],
    },
    optionB: {
      name: 'Renting',
      pros: [
        'Lower upfront costs — typically just first month plus security deposit',
        'Complete flexibility to move when your lease ends',
        'Zero maintenance or repair costs or responsibilities',
        'Predictable monthly rent (though lease renewals may increase it)',
        'Access to amenities (gym, pool, concierge) without ownership costs',
        'Easier to relocate for career opportunities or lifestyle changes',
      ],
      cons: [
        'No equity building — rent payments do not build toward ownership',
        'Landlord controls whether you can renew and can increase rent',
        'Limited ability to customize or modify your living space',
        'No tax benefits from rent payments',
        'Rent increases over time can outpace inflation',
        'No asset to leverage or build wealth from',
      ],
    },
    verdict: 'The traditional rule of thumb is to buy if you plan to stay at least 5-7 years to offset transaction costs. But the math varies by market — in some cities, renting forever may be the financially rational choice. Use our mortgage calculator to run the numbers for your specific situation.',
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
    relatedGuides: ['how-much-house-can-i-afford', 'what-is-mortgage'],
    relatedTools: ['mortgage-calculator'],
    faqs: [
      { question: 'How long should I plan to stay to make buying worthwhile?', answer: 'Most financial advisors suggest at least 5-7 years to offset the upfront costs of buying. The break-even point varies by market and depends on rent vs. buy price ratios.' },
      { question: 'Is renting ever financially smarter than buying?', answer: 'Yes. In high-cost housing markets where rent is substantially cheaper than owning, if you value mobility, or if you may need to relocate within a few years.' },
      { question: 'What costs do first-time buyers forget?', answer: 'Closing costs (2-5%), moving expenses, immediate repairs, furniture for larger spaces, and ongoing costs like property taxes, insurance, and maintenance.' },
      { question: 'Should I invest the difference or put more down?', answer: 'This depends on your mortgage rate versus expected investment returns, your risk tolerance, and your emergency fund status. Generally, matching employer 401k contributions before extra mortgage payments makes sense.' },
    ],
  },
  'refinance-vs-new-mortgage': {
    title: 'Refinancing vs New Mortgage: When to Restructure Your Home Loan',
    author: 'CalcWise AI',
    datePublished: '2026-05-07',
    dateModified: '2026-05-28',
    readTime: '9 min read',
    category: 'Finance',
    intro: 'When interest rates drop, the question becomes: should you refinance your existing mortgage or take out a completely new one? The answer involves break-even analysis, your long-term plans, and what you are trying to accomplish beyond just lowering your rate.',
    whenToChooseA: 'Choose refinancing your existing mortgage if you want simpler loan terms, need to access equity, are consolidating debts, or want to switch from ARM to fixed rate.',
    whenToChooseB: 'Choose a new mortgage if you need significant cash out, want to change loan types significantly, or are unhappy with your current lender.',
    optionA: {
      name: 'Refinancing Your Existing Mortgage',
      pros: [
        'Simpler process with potentially one lender relationship',
        'Lower closing costs than a completely new purchase mortgage',
        'Opportunity to access home equity through cash-out refinancing',
        'Can switch from adjustable to fixed rate for stability',
        'May qualify for better rates based on improved credit',
        'Typically completes in 30-45 days',
      ],
      cons: [
        'Closing costs still apply — typically 2-5% of loan amount',
        'May extend your loan term, delaying full ownership',
        'Must meet current lender qualification requirements',
        'Appraisal may be required to verify current home value',
        'Starting over on amortization means paying more interest upfront again',
      ],
    },
    optionB: {
      name: 'Taking a New Mortgage',
      pros: [
        'Complete flexibility to change lenders and shop for the best rates',
        'Opportunity to access significant equity for major expenses',
        'Can consolidate other debts into your mortgage for lower rates',
        'Option to change your loan structure entirely',
        'May achieve better rates by shopping multiple lenders aggressively',
      ],
      cons: [
        'More complex application process than a streamlined refinance',
        'Higher loan amounts may face stricter qualification requirements',
        'Additional closing costs for the new loan structure',
        'Longer timeline to complete the transaction',
        'May restart your amortization schedule with more early payments to interest',
      ],
    },
    verdict: 'Refinancing makes sense when rates drop meaningfully (typically 0.5-0.75%+), when you want to switch loan types, or when you need to access equity. Calculate your break-even point: how many months of savings will offset closing costs?',
    toolPath: '/tools/finance/refinance-calculator',
    toolName: 'Refinance Calculator',
    relatedGuides: ['how-to-reduce-mortgage-interest', 'what-is-mortgage'],
    relatedTools: ['refinance-calculator', 'mortgage-calculator'],
    faqs: [
      { question: 'How much do rates need to drop to make refinancing worthwhile?', answer: 'A general guideline is 0.5-0.75%, but also consider your loan balance, remaining term, and closing costs. Smaller loans benefit less from refinancing.' },
      { question: 'When should I take a new mortgage instead of refinancing?', answer: 'Consider a new mortgage when you need to access significant equity, want to change lenders for better service, or need a completely different loan structure.' },
      { question: 'What are typical refinancing closing costs?', answer: 'Expect to pay 2-5% of your loan amount in closing costs. On a $300,000 loan, that is $6,000-$15,000 in upfront costs.' },
      { question: 'Does refinancing restart my loan term?', answer: 'Not necessarily. You can choose a new term when refinancing — same 30 years, shorter term, or anything in between. Shorter terms mean higher payments but less total interest.' },
    ],
  },
  'personal-loan-vs-credit-card': {
    title: 'Personal Loan vs Credit Card: How to Choose the Right Borrowing',
    author: 'CalcWise AI',
    datePublished: '2026-05-09',
    dateModified: '2026-05-28',
    readTime: '9 min read',
    category: 'Finance',
    intro: 'Both personal loans and credit cards help you borrow money, but they work differently and suit different situations. Understanding when each makes sense can save you thousands in interest and help you avoid debt traps.',
    whenToChooseA: 'Choose a personal loan for large one-time expenses with a clear payoff plan, debt consolidation at lower rates, or when you need the discipline of fixed payments.',
    whenToChooseB: 'Choose a credit card for ongoing flexibility, purchases you will pay in full monthly, or short-term financing with rewards programs.',
    optionA: {
      name: 'Personal Loan',
      pros: [
        'Fixed interest rate — no surprises regardless of market conditions',
        'Set monthly payment for a predetermined payoff timeline (typically 2-7 years)',
        'One-time lump sum disbursement for your planned expense',
        'Often lower rates than credit cards for borrowers with good credit',
        'No temptation to continuously borrow like with revolving credit',
        'Fixed schedule provides discipline for payoff',
      ],
      cons: [
        'May have origination fees of 1-8% of the loan amount',
        'Strict qualification requirements — credit score and income matter significantly',
        'Cannot increase the loan without applying for a new one',
        'Fixed payment schedule limits flexibility if your income drops',
        'Interest starts accruing immediately upon disbursement',
      ],
    },
    optionB: {
      name: 'Credit Card',
      pros: [
        'Revolving credit available whenever you need it',
        'No money required upfront if you pay your balance in full monthly',
        'Rewards programs — cash back, travel points, or purchase protection',
        'Grace period for purchases — pay in full and pay zero interest',
        'Can build credit history with responsible use',
        'Maximum flexibility for variable or ongoing expenses',
      ],
      cons: [
        'Variable rates that can increase significantly',
        'Minimum payments extend repayment dramatically and increase total interest paid',
        'Easy to accumulate debt that becomes difficult to pay off',
        'Higher effective rates than personal loans for most borrowers',
        'Rewards rarely offset interest costs if you carry a balance',
      ],
    },
    verdict: 'Use a personal loan for structured, one-time borrowing with a clear payoff plan — debt consolidation, home improvements, or major purchases. Use a credit card for flexibility, ongoing purchases, and situations where you can pay the balance in full monthly to avoid interest entirely.',
    toolPath: '/tools/finance/loan-calculator',
    toolName: 'Loan Calculator',
    relatedGuides: ['what-is-loan-amortization', 'what-is-mortgage'],
    relatedTools: ['loan-calculator', 'interest-calculator'],
    faqs: [
      { question: 'Which option typically has lower interest rates?', answer: 'Personal loans typically have lower rates than credit cards, especially for borrowers with good credit. Credit cards average 20%+ APR while personal loans often range 6-36%.' },
      { question: 'How do I decide which to use for a major purchase?', answer: 'If the purchase is one-time and you need a structured payoff plan, a personal loan is usually better. For ongoing flexibility and purchases you can pay in full monthly, credit cards work.' },
      { question: 'What credit score do I need for a good personal loan rate?', answer: 'Credit scores above 740 typically qualify for the best personal loan rates. Scores below 640 may struggle to qualify or face high rates.' },
      { question: 'Is it ever smart to pay minimum credit card payments?', answer: 'No. Paying only minimums extends repayment for decades and costs enormous interest. Always pay more than the minimum if possible.' },
    ],
  },
  'fedex-vs-ups-shipping': {
    title: 'FedEx vs UPS: A Practical Comparison for Regular Shippers',
    author: 'CalcWise AI',
    datePublished: '2026-05-11',
    dateModified: '2026-05-28',
    readTime: '8 min read',
    category: 'Shipping',
    intro: 'FedEx and UPS are the two dominant parcel carriers in the United States, and most businesses ship with both at some point. Understanding their strengths helps you choose the right carrier for each shipment rather than defaulting to habit.',
    whenToChooseA: 'Choose FedEx for urgent international shipments, when tracking reliability is critical, or when you value superior customer service.',
    whenToChooseB: 'Choose UPS for cost-effective domestic ground shipping, heavy packages, or when you value accessible drop-off locations.',
    optionA: {
      name: 'FedEx',
      pros: [
        'Strongest international shipping network with comprehensive global reach',
        'Reliable tracking with excellent visibility throughout delivery',
        'Wide range of express delivery options with guaranteed delivery times',
        'Generally stronger presence and service in southern and eastern regions',
        'Innovative tracking technology with proactive notification options',
        'Often better for time-sensitive domestic shipments',
      ],
      cons: [
        'Can be more expensive than UPS for certain domestic routes',
        'Fuel surcharges and residential delivery fees can add up',
        'Less competitive rates for heavy packages in certain zones',
        'May have fewer convenient drop-off locations in some areas',
        'Premium pricing for the brand name and reliability',
      ],
    },
    optionB: {
      name: 'UPS',
      pros: [
        'More competitive pricing for heavy packages and longer-distance routes',
        'Extensive drop-off network including Staples and CVS stores nationwide',
        'Reliable ground shipping network with consistent delivery times',
        'Often offers better rates for high-volume business shippers',
        'Generally stronger presence in Midwest and western regions',
        'Good option for consolidated shipments and freight',
      ],
      cons: [
        'Weekend delivery options more limited than FedEx',
        'Residential surcharges can significantly increase domestic shipping costs',
        'Tracking and customer service responsiveness can vary by location',
        'Can charge higher rates for premium expedited services',
        'International network not as comprehensive as FedEx',
      ],
    },
    verdict: 'Choose FedEx for international shipments and time-critical domestic deliveries where reliability matters most. Choose UPS for cost-effective domestic ground shipping and when drop-off convenience is important. Most businesses use both strategically.',
    toolPath: '/tools/shipping/shipping-cost-estimator',
    toolName: 'Shipping Cost Estimator',
    relatedGuides: ['how-shipping-costs-are-calculated', 'how-to-reduce-shipping-costs'],
    relatedTools: ['shipping-cost-estimator', 'dim-weight-calculator'],
    faqs: [
      { question: 'Which carrier is cheaper for domestic ground shipping?', answer: 'UPS Ground is often more competitive for heavier packages and longer routes, while FedEx Ground may be slightly better for lighter packages in certain zones.' },
      { question: 'How do surcharges affect the total cost comparison?', answer: 'Both carriers add fuel surcharges and residential delivery fees that can increase base rates by 15-25%. Always compare total costs, not just base rates.' },
      { question: 'Should I use both carriers?', answer: 'Most businesses ship with both carriers strategically — FedEx for urgent international and time-critical shipments, UPS for cost-effective domestic ground shipping.' },
      { question: 'Do both carriers offer package insurance?', answer: 'Yes, both offer carrier-provided insurance up to certain value limits. Third-party shipping insurance is available for higher-value shipments through both carriers.' },
    ],
  },
  'bmi-vs-body-fat-percentage': {
    title: 'BMI vs Body Fat Percentage: Which Metric Actually Matters?',
    author: 'CalcWise AI',
    datePublished: '2026-05-13',
    dateModified: '2026-05-28',
    readTime: '8 min read',
    category: 'Health',
    intro: 'Both BMI and body fat percentage are useful health metrics, but they measure different things. Understanding what each number tells you — and what they miss — helps you use them appropriately rather than over-relying on a single figure.',
    whenToChooseA: 'Use BMI for quick screening when you need a simple, no-equipment-needed assessment of weight categories.',
    whenToChooseB: 'Use body fat percentage when you want a more accurate measure of your actual body composition.',
    optionA: {
      name: 'Body Mass Index (BMI)',
      pros: [
        'Simple calculation using only height and weight — no special equipment needed',
        'Standardized categories that apply to most adults regardless of gender',
        'Widely recognized by healthcare professionals and insurance companies',
        'Excellent population-level screening tool for health research',
        'Correlates reasonably well with health outcomes across large groups',
        'Free and instant to calculate with our tool',
      ],
      cons: [
        'Cannot distinguish between muscle mass and fat mass',
        'Often misclassifies athletes and muscular individuals as overweight or obese',
        'Does not account for where fat is distributed on the body',
        'May not apply uniformly across different ethnic groups',
        'Does not indicate fitness level or metabolic health',
      ],
    },
    optionB: {
      name: 'Body Fat Percentage',
      pros: [
        'Directly measures the proportion of fat in your body rather than estimating it',
        'Accounts for individual differences in muscle mass and bone density',
        'More accurate predictor of health risks than BMI in many cases',
        'Can track changes in body composition over time more precisely',
        'Better indicator of actual fitness level and metabolic health',
        'Differentiates between essential fat and storage fat',
      ],
      cons: [
        'Requires more complex measurement methods (skinfold calipers, bioelectrical impedance, DEXA scans)',
        'Measurements can vary significantly depending on method and technician',
        'No universally accepted standardized "healthy" categories',
        'More expensive and time-consuming to assess accurately',
        'Less practical for quick screening or large-scale use',
      ],
    },
    verdict: 'Use BMI as a quick, free screening tool for general weight categories — it is useful at the population level and for quick self-assessments. Use body fat percentage when you want a more accurate personal health picture, especially if you are athletic, building muscle, or focused on body composition goals. Neither metric tells the complete story alone.',
    toolPath: '/tools/health/bmi-calorie-calculator',
    toolName: 'BMI Calculator',
    relatedGuides: ['understanding-bmi', 'how-to-improve-bmi'],
    relatedTools: ['bmi-calorie-calculator', 'body-fat-calculator'],
    faqs: [
      { question: 'Which is a better indicator of overall health?', answer: 'Body fat percentage is generally more accurate because it directly measures fat mass. However, BMI is useful for quick screening without equipment. Neither alone tells the complete story.' },
      { question: 'Can someone have a high BMI but healthy body fat?', answer: 'Yes, athletes and muscular individuals often have elevated BMIs but low body fat percentages. BMI cannot distinguish between the two.' },
      { question: 'What is a healthy body fat percentage range?', answer: 'For men, 10-20% is typically considered healthy; for women, 18-28%. Athletes often have lower ranges (5-10% men, 12-20% women).' },
      { question: 'How do I measure body fat percentage accurately?', answer: 'Bioelectrical impedance scales and handheld devices offer reasonable estimates at home. For clinical accuracy, DEXA scans or hydrostatic weighing provide the best measurements.' },
    ],
  },
};

const getCompare = (slug?: string) => {
  if (slug && COMPARE_CONTENTS[slug]) return COMPARE_CONTENTS[slug];
  return {
    title: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Comparison',
    author: 'CalcWise AI',
    datePublished: '2026-05-28',
    dateModified: '2026-05-28',
    readTime: '5 min read',
    category: 'General',
    intro: 'This comparison helps you evaluate the pros and cons of both options to make an informed decision based on your specific needs and circumstances.',
    whenToChooseA: 'Choose Option A if you value stability, predictability, and proven results.',
    whenToChooseB: 'Choose Option B if you prioritize flexibility, lower initial costs, or modern features.',
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
    toolName: 'All Calculators',
    relatedGuides: [],
    relatedTools: [],
    faqs: [
      { question: 'What should I compare first?', answer: 'Start with the most important tradeoff for your situation — whether that is cost, convenience, flexibility, or long-term value.' },
      { question: 'How can I test the decision?', answer: 'Use the linked calculator to model both options with your own numbers and see the practical implications.' },
    ],
  };
};

export default function CompareDetailPage() {
  const { slug } = useParams();
  const data = getCompare(slug);
  const canonicalUrl = `https://www.calculatorpilotai.com/compare/${slug ?? ''}`.replace(/\/$/, '');
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Compare', url: '/compare' },
    { name: data.title },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema(breadcrumbItems.filter((item): item is { name: string; url: string } => Boolean(item.url))),
      generateFAQSchema(data.faqs),
      generateArticleSchema({
        headline: data.title,
        description: data.intro,
        url: canonicalUrl,
        datePublished: data.datePublished,
        dateModified: data.dateModified,
        authorName: data.author,
      }),
    ],
  };

  return (
    <>
      <PageMeta title={data.title} description={data.intro} canonical={canonicalUrl} ogType="article" jsonLd={jsonLd} />
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-20">
        <Breadcrumb items={breadcrumbItems} />
        <header className="mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {data.category}
            </span>
            <span>•</span>
            <span>{data.readTime}</span>
            <span>•</span>
            <span>Updated {new Date(data.dateModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">{data.title}</h1>
          <p className="text-lg leading-relaxed text-slate-600">{data.intro}</p>
        </header>

        <section className="mb-8 p-6 bg-slate-50 rounded-xl">
          <h3 className="font-semibold text-slate-900 mb-2">Quick Decision Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="font-medium text-emerald-700 mb-1">Choose {data.optionA.name} if:</p>
              <p className="text-slate-600">{data.whenToChooseA}</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <p className="font-medium text-blue-700 mb-1">Choose {data.optionB.name} if:</p>
              <p className="text-slate-600">{data.whenToChooseB}</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="p-8 border border-slate-200 rounded-xl bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">{data.optionA.name}</h2>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Pros
              </h3>
              <ul className="space-y-3">
                {data.optionA.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-rose-600 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Cons
              </h3>
              <ul className="space-y-3">
                {data.optionA.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="p-8 border border-slate-200 rounded-xl bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">{data.optionB.name}</h2>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Pros
              </h3>
              <ul className="space-y-3">
                {data.optionB.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-rose-600 mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4" /> Cons
              </h3>
              <ul className="space-y-3">
                {data.optionB.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-700">
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-10 rounded-2xl mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Scale className="w-6 h-6" />
            Our Verdict
          </h2>
          <p className="text-slate-300 leading-relaxed mb-6">{data.verdict}</p>
          <Link to={data.toolPath} className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
            <Calculator className="w-5 h-5" />
            Try the Calculator <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Related Guides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.relatedGuides.map((relSlug) => {
              const relatedCompare = COMPARE_CONTENTS[relSlug];
              if (!relatedCompare) return null;
              return (
                <Link key={relSlug} to={`/compare/${relSlug}`} className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:border-primary/50 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{relatedCompare.title}</p>
                    <p className="text-xs text-slate-500">{relatedCompare.readTime}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {data.faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6">
                <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}