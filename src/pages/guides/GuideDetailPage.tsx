import { useParams, Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';

const GUIDE_CONTENTS: Record<string, { title: string; paragraphs: string[]; toolPath: string; toolName: string }> = {
  'what-is-mortgage': {
    title: 'What Is a Mortgage and How Does It Work?',
    paragraphs: [
      'A mortgage is a type of loan used to purchase or maintain a home, land, or other types of real estate. The borrower agrees to pay the lender over time, typically in a series of regular payments that are divided into principal and interest. The property itself serves as collateral to secure the loan.',
      'When you take out a mortgage, you are borrowing a large sum of money to buy a home and agreeing to pay it back over a set period, usually 15 or 30 years. The lender charges interest on the loan, which is how they make money. Your monthly payment includes both principal (the amount you borrowed) and interest (the cost of borrowing).',
      'The interest rate on your mortgage can be fixed, meaning it stays the same for the entire term, or variable, meaning it can change based on market conditions. Fixed-rate mortgages offer predictability, while variable-rate mortgages may start with lower rates but can increase over time.',
      'To qualify for a mortgage, lenders typically look at your credit score, debt-to-income ratio, employment history, and the amount of your down payment. A higher credit score and larger down payment can help you secure a lower interest rate.',
      'Understanding how mortgages work is essential for anyone looking to buy a home. Use our mortgage calculator to estimate your monthly payments and see how different interest rates and loan terms affect your total cost.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
  },
  'how-to-reduce-mortgage-interest': {
    title: 'How to Reduce Your Mortgage Interest',
    paragraphs: [
      'Paying less interest on your mortgage can save you tens of thousands of dollars over the life of your loan. One of the most effective ways to reduce interest is to make a larger down payment. The more you put down upfront, the smaller your loan amount, and the less interest you will pay overall.',
      'Another strategy is to choose a shorter loan term. A 15-year mortgage typically has a lower interest rate than a 30-year mortgage, and you will pay off the loan much faster. While your monthly payments will be higher, the total interest paid is significantly lower.',
      'Making extra payments toward your principal can also reduce your interest burden. Even adding an extra $100 per month can shave years off your mortgage and save thousands in interest. Be sure to specify that the extra payment should go toward principal, not future payments.',
      'Refinancing your mortgage when interest rates drop is another powerful strategy. If current rates are lower than your existing rate, refinancing can lower your monthly payment and total interest. However, be mindful of closing costs and how long you plan to stay in the home.',
      'Improving your credit score before applying for a mortgage can also help you secure a lower rate. Pay down existing debt, avoid opening new credit accounts, and check your credit report for errors.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
  },
  'understanding-bmi': {
    title: 'Understanding BMI: Body Mass Index Explained',
    paragraphs: [
      'Body Mass Index, or BMI, is a simple calculation using a person\'s height and weight that is widely used to categorize whether someone is underweight, normal weight, overweight, or obese. It is calculated by dividing a person\'s weight in kilograms by the square of their height in meters.',
      'BMI is a useful screening tool because it is quick, inexpensive, and easy to calculate. However, it is not a diagnostic tool. It does not directly measure body fat, and it does not account for factors like muscle mass, bone density, age, or sex. For example, a very muscular athlete may have a high BMI despite having low body fat.',
      'The standard BMI categories are: underweight (below 18.5), normal weight (18.5 to 24.9), overweight (25 to 29.9), and obese (30 or above). These categories help healthcare providers identify individuals who may be at risk for weight-related health conditions such as heart disease, diabetes, and high blood pressure.',
      'While BMI has its limitations, it remains a valuable tool for tracking trends in populations and as a starting point for personal health discussions. For a more complete picture of your health, consider combining BMI with other measurements such as waist circumference, body fat percentage, and blood pressure.',
      'Use our BMI calculator to quickly check your BMI and get personalized health insights based on your results.',
    ],
    toolPath: '/tools/health/bmi-calorie-calculator',
    toolName: 'BMI Calculator',
  },
  'how-to-improve-bmi': {
    title: 'How to Improve Your BMI and Maintain a Healthy Weight',
    paragraphs: [
      'Improving your BMI starts with understanding your current status and setting realistic goals. If your BMI falls in the overweight or obese range, even a modest weight loss of 5 to 10 percent of your body weight can significantly improve your health markers, including blood pressure, cholesterol, and blood sugar levels.',
      'The foundation of a healthy BMI is a balanced diet. Focus on whole foods such as vegetables, fruits, lean proteins, and whole grains while reducing processed foods, added sugars, and excessive saturated fats. Portion control is equally important — tracking your daily calorie intake with our calorie calculator can help you stay within your target range.',
      'Regular physical activity is essential for both weight loss and maintenance. Aim for at least 150 minutes of moderate aerobic exercise or 75 minutes of vigorous exercise per week, combined with strength training on two or more days. Exercise not only burns calories but also builds muscle, which increases your resting metabolic rate.',
      'Sleep and stress management are often overlooked factors in weight management. Poor sleep disrupts hormones that regulate hunger, leading to increased cravings and overeating. Chronic stress elevates cortisol levels, which can promote fat storage, particularly around the abdomen.',
      'Remember that BMI is just one indicator of health. Focus on sustainable lifestyle changes rather than quick fixes. Use our BMI and calorie calculator to track your progress and adjust your plan as needed.',
    ],
    toolPath: '/tools/health/bmi-calorie-calculator',
    toolName: 'BMI Calculator',
  },
  'understanding-shipping-dim-weight': {
    title: 'Understanding Dimensional Weight in Shipping',
    paragraphs: [
      'Dimensional weight, also known as DIM weight or volumetric weight, is a pricing technique used by shipping carriers to account for the space a package occupies in relation to its actual weight. If you have ever shipped a large but lightweight box, you may have noticed the cost was higher than expected — that is dimensional weight at work.',
      'Carriers operate with limited cargo space on trucks and aircraft. A large, lightweight package takes up valuable space that could have been used for heavier shipments. To ensure profitability, carriers calculate the dimensional weight based on the package volume and charge whichever is greater: the actual weight or the dimensional weight.',
      'The formula for dimensional weight is straightforward: multiply the length, width, and height of your package, then divide by a divisor. In the United States, FedEx and UPS commonly use a divisor of 139 for domestic shipments. For international shipments and many metric-based carriers, the divisor is typically 5000 when dimensions are measured in centimeters.',
      'You can reduce your shipping costs by minimizing package dimensions. Use appropriately sized boxes, eliminate excess void fill, and consider compressible or foldable packaging when possible. Even a small reduction in box size can bring your dimensional weight below your actual weight, resulting in significant savings on high-volume shipments.',
      'Use our DIM weight calculator to instantly determine whether your package will be charged by actual weight or dimensional weight, and explore our AI-powered insights for packaging optimization tips.',
    ],
    toolPath: '/tools/shipping/dim-weight-calculator',
    toolName: 'Shipping Calculator',
  },
  'how-shipping-costs-are-calculated': {
    title: 'How Shipping Costs Are Calculated: A Complete Guide',
    paragraphs: [
      'Shipping costs are determined by a combination of factors, with the most fundamental being the billable weight. Carriers compare the actual physical weight of a package against its dimensional weight and charge based on whichever value is higher. This ensures they are compensated fairly for both heavy, compact items and light, bulky packages.',
      'Beyond weight, distance plays a major role in pricing. Most major carriers divide countries and regions into zones, with shipping costs increasing as the distance between origin and destination grows. Cross-border shipments also involve customs duties, taxes, and additional documentation fees that can significantly increase the total cost.',
      'The speed of delivery is another key factor. Standard ground shipping is the most economical option, while expedited services such as two-day or overnight delivery command premium prices. Many businesses offer free standard shipping to customers while building the cost into product pricing, creating a competitive advantage.',
      'Surcharges can add unexpected costs to your shipments. These may include fuel surcharges, residential delivery fees, signature confirmation, insurance, and fees for oversized or irregularly shaped packages. Understanding these add-ons helps you provide accurate shipping quotes to customers.',
      'Use our shipping calculator to estimate your dimensional and billable weight before you ship, helping you avoid surprises and optimize your packaging strategy.',
    ],
    toolPath: '/tools/shipping/dim-weight-calculator',
    toolName: 'Shipping Calculator',
  },
  'what-is-mortgage-insurance': {
    title: 'What Is Mortgage Insurance and Do You Need It?',
    paragraphs: [
      'Mortgage insurance is a policy that protects the lender in case the borrower defaults on their home loan. It is typically required when your down payment is less than 20 percent of the home purchase price. Unlike homeowners insurance, which protects your property, mortgage insurance protects the financial institution that issued the loan.',
      'The most common form in the United States is Private Mortgage Insurance, or PMI, which applies to conventional loans. For FHA loans, borrowers pay an Upfront Mortgage Insurance Premium plus an annual MIP. VA loans do not require mortgage insurance but instead charge a one-time funding fee. Understanding which type applies to your loan is essential for accurate budgeting.',
      'PMI rates generally range from 0.3 to 1.5 percent of the original loan amount per year. The exact rate depends on your credit score, loan-to-value ratio, and the type of mortgage. On a $300,000 loan, PMI could cost between $75 and $375 per month, significantly impacting your monthly housing budget.',
      'The good news is that PMI is not permanent. Once your loan balance drops to 80 percent of the home original value, you can request cancellation. At 78 percent, federal law requires automatic termination for most conventional loans. Making extra principal payments or home improvements that increase value can help you reach this threshold sooner.',
      'Whether you need mortgage insurance depends entirely on your down payment size and loan type. If you can afford a 20 percent down payment, you can avoid PMI entirely. Use our mortgage calculator to see how different down payment amounts affect your monthly payment, total interest, and PMI costs.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
  },
  'how-mortgage-interest-works': {
    title: 'How Mortgage Interest Works: A Beginner Guide',
    paragraphs: [
      'Mortgage interest is the cost of borrowing money to purchase a home, expressed as an annual percentage rate. When you make your monthly payment, a portion goes toward the principal (the amount you borrowed) and the remainder covers the interest. In the early years of a mortgage, most of your payment goes toward interest, with principal repayment gradually increasing over time.',
      'Interest on most home loans is calculated using an amortization schedule. This means each payment is applied to the outstanding balance, and the interest for the next period is calculated on the reduced principal. Because the principal shrinks over time, the interest portion of each payment decreases while the principal portion grows. This is why paying extra toward principal early in the loan can save substantial interest over the life of the mortgage.',
      'Several factors determine the interest rate you qualify for. Your credit score is the most significant; borrowers with scores above 740 typically receive the best rates. The loan term also matters, with 15-year mortgages generally offering lower rates than 30-year mortgages. Market conditions, Federal Reserve policy, and the type of loan product all play a role as well.',
      'Fixed-rate mortgages lock in your rate for the entire term, providing predictable payments. Adjustable-rate mortgages start with a lower rate that can change periodically based on market indexes. While ARMs can save money in a declining rate environment, they carry the risk of higher payments if rates rise. Most first-time buyers prefer the stability of a fixed-rate loan.',
      'Understanding how interest accumulates helps you make smarter decisions about when to buy, how much to borrow, and whether to refinance. Use our mortgage calculator with its interactive amortization chart to visualize exactly how much of each payment goes to interest versus principal over the full loan term.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
  },
  'how-much-house-can-i-afford': {
    title: 'How Much House Can I Afford? A Practical Guide',
    paragraphs: [
      'Determining how much house you can afford is one of the most important steps in the home buying process. Financial experts generally recommend that your monthly housing payment should not exceed 28 to 30 percent of your gross monthly income. This includes your mortgage principal, interest, property taxes, homeowners insurance, and any HOA fees.',
      'The 28/36 rule is a widely accepted guideline: spend no more than 28 percent of gross income on housing costs, and no more than 36 percent on total debt payments including car loans, student loans, and credit cards. For example, if your household earns $8,000 per month before taxes, your total housing budget should ideally stay below $2,240, and your total debt payments should stay below $2,880.',
      'Your down payment significantly affects affordability. A larger down payment reduces your loan amount, lowers your monthly payment, and may eliminate the need for private mortgage insurance. In the US, conventional loans typically require at least 3 to 5 percent down, while FHA loans require 3.5 percent. A 20 percent down payment is the gold standard for avoiding PMI.',
      'Do not forget closing costs, which typically range from 2 to 5 percent of the purchase price. These include lender fees, appraisal costs, title insurance, attorney fees, and prepaid taxes or insurance. On a $400,000 home, closing costs could add $8,000 to $20,000 on top of your down payment. Having an emergency fund for maintenance and unexpected repairs is also essential.',
      'Interest rates dramatically impact buying power. At 6.5 percent, a $2,000 monthly payment can support roughly a $316,000 loan over 30 years. At 7.5 percent, that same payment only supports about $286,000, a $30,000 difference in purchasing power. Use our mortgage calculator to experiment with different incomes, down payments, and interest rates to find your personal affordability range.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
  },
  'what-is-loan-amortization': {
    title: 'What Is Loan Amortization and Why Does It Matter?',
    paragraphs: [
      'Loan amortization is the process of spreading out a loan into a series of fixed payments over time. Each payment contains both principal and interest, with the proportion shifting gradually from mostly interest in the beginning to mostly principal toward the end. An amortization schedule is a table that shows exactly how each payment is divided and how the loan balance declines month by month.',
      'Understanding amortization is crucial because it reveals the true cost of borrowing. In the first year of a 30-year mortgage at 6.5 percent, roughly 80 percent of each payment goes toward interest. By year 15, that ratio flips, with most of the payment reducing principal. This front-loaded interest structure means that early extra payments have an outsized impact on reducing total interest costs.',
      'Making one extra payment per year can shorten a 30-year mortgage by about 4 to 5 years and save tens of thousands in interest. Alternatively, switching from a 30-year to a 15-year term dramatically changes the amortization schedule. While monthly payments increase, the total interest paid is often less than half because the loan is paid off in half the time.',
      'Amortization schedules are also useful for comparing different loan offers. Two loans with the same interest rate and amount can have very different total costs depending on fees, prepayment penalties, and term length. Reviewing the full amortization schedule before signing helps you understand exactly where your money goes each month and over the full loan term.',
      'Our mortgage calculator generates a complete amortization schedule alongside an interactive chart showing your annual principal and interest breakdown. Use it to compare 15-year versus 30-year terms, model the impact of extra payments, and see exactly when your loan balance will reach key milestones like the 80 percent PMI cancellation threshold.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
  },
  'fixed-vs-adjustable-rate-mortgage-guide': {
    title: 'Fixed-Rate vs Adjustable-Rate Mortgage: Which Is Right for You?',
    paragraphs: [
      'Choosing between a fixed-rate and an adjustable-rate mortgage is one of the most consequential decisions in the home buying process. A fixed-rate mortgage locks in your interest rate for the entire loan term, meaning your principal and interest payment never changes. This predictability makes budgeting straightforward and protects you from rising interest rates.',
      'An adjustable-rate mortgage, commonly called an ARM, starts with a lower introductory rate that adjusts periodically based on a market index plus a margin. A 5/1 ARM, for example, fixes the rate for the first five years and then adjusts annually thereafter. The initial savings can be significant; a 5.5 percent ARM versus a 6.5 percent fixed rate on a $400,000 loan saves approximately $250 per month during the fixed period.',
      'The risk with ARMs lies in rate uncertainty after the initial period. If market rates have risen, your monthly payment could increase substantially. Most ARMs have rate caps that limit how much the rate can change per adjustment period and over the life of the loan, typically 2 percent per year and 5 percent total. Still, even capped increases can strain a budget.',
      'Fixed-rate mortgages are generally the better choice for buyers who plan to stay in the home long-term, value stability, or believe interest rates will rise. ARMs may be appropriate for buyers who expect to sell or refinance within the initial fixed period, or who can handle payment volatility in exchange for lower initial costs.',
      'The breakeven analysis can help you decide. Calculate how much you save monthly with the ARM during the fixed period, then estimate whether the savings offset the risk of higher future payments. Use our mortgage calculator to run side-by-side comparisons of fixed and adjustable rate scenarios with the same loan amount and term.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
  },
};

function getGuide(slug?: string) {
  if (slug && GUIDE_CONTENTS[slug]) return GUIDE_CONTENTS[slug];
  return {
    title: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Guide',
    paragraphs: [
      'This guide covers essential concepts and best practices to help you make informed decisions. Whether you are calculating finances, tracking health metrics, or analyzing content, understanding the fundamentals is the first step toward better outcomes.',
      'Our tools are designed to complement this knowledge by providing fast, accurate calculations powered by intelligent algorithms. Each tool is built with precision and ease of use in mind, so you can focus on what matters most.',
      'Explore related guides and use our interactive calculators to apply what you learn in real time.',
    ],
    toolPath: '/',
    toolName: 'All Tools',
  };
}

export default function GuideDetailPage() {
  const { slug } = useParams();
  const guide = getGuide(slug);

  return (
    <>
      <PageMeta title={guide.title} description={guide.paragraphs[0]} />
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-20">
        <Breadcrumb items={[
          { name: 'Home', url: '/' },
          { name: 'Guides', url: '/guides' },
          { name: guide.title },
        ]} />
        <article>
          <h1 className="text-4xl font-black tracking-tighter mb-6 uppercase">{guide.title}</h1>
          {guide.paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-slate-700 mb-6">
              {p}
            </p>
          ))}
          <div className="mt-12 p-8 border-2 border-primary rounded-xl bg-primary/5">
            <h3 className="text-xl font-bold mb-2">Ready to calculate?</h3>
            <p className="mb-4 text-slate-600">Use our AI-enhanced tool to get instant results based on the principles discussed in this guide.</p>
            <Link to={guide.toolPath} className="inline-block bg-primary text-white font-bold py-3 px-6 rounded uppercase tracking-widest hover:bg-primary/90 transition-colors">Try {guide.toolName}</Link>
          </div>
        </article>
      </div>
    </>
  );
}
