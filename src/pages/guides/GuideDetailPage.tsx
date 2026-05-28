import { useParams, Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { generateArticleSchema, generateBreadcrumbSchema, generateFAQSchema } from '@/lib/schema';
import { Calculator, ArrowRight, BookOpen, Lightbulb } from 'lucide-react';

const GUIDE_CONTENTS: Record<string, { title: string; author: string; datePublished: string; dateModified: string; readTime: string; category: string; paragraphs: string[]; toolPath: string; toolName: string; relatedGuides: string[]; relatedTools: string[]; faqs: { question: string; answer: string }[] }> = {
  'what-is-mortgage': {
    title: 'What Is a Mortgage and How Does It Work?',
    author: 'CalcWise AI',
    datePublished: '2026-05-01',
    dateModified: '2026-05-28',
    readTime: '8 min read',
    category: 'Finance',
    paragraphs: [
      'Most Americans finance their home purchases with mortgages, yet the mechanics behind these loans remain mysterious to many first-time buyers. A mortgage is essentially a loan where your home serves as collateral — if you stop making payments, the lender can take possession of the property through a legal process called foreclosure.',
      'When you sign a mortgage, you are promising to repay borrowed money over a set period, almost always 15 or 30 years. The lender provides a large sum upfront (often hundreds of thousands of dollars), and in return, you agree to pay it back with interest. Your monthly payment typically includes four components: principal (the amount borrowed), interest (the lender\'s fee for borrowing), property taxes, and homeowners insurance. This bundling is why mortgages are sometimes called PITI loans.',
      'Here is where many first-time buyers get confused: the split between principal and interest changes over time. In the early years, most of your payment goes toward interest. By the final years, most goes toward principal. This process is called amortization, and it means you build equity slowly at first, then faster as you approach payoff. If you make extra payments toward principal early in the loan, you can save thousands in interest and own your home years sooner.',
      'Mortgage rates come in two main flavors: fixed and adjustable. A fixed rate stays the same for the entire loan life, making budgeting predictable. An adjustable-rate mortgage (ARM) starts lower but can change after an introductory period, introducing payment uncertainty. Most borrowers choose fixed-rate mortgages for the peace of mind, even if it means paying a slightly higher initial rate.',
      'Lenders evaluate your application based on four main factors. Your credit score tells them how reliably you have handled debt in the past — scores above 740 typically qualify for the best rates. Your debt-to-income ratio compares your monthly debt payments to your gross income; most lenders prefer this below 36%. Your employment history shows stability and ability to repay. Your down payment size reduces the lender\'s risk and often qualifies you for better terms.',
      'What surprises many buyers is that the advertised rate is not always the rate you get. Your final rate depends on your credit profile, the loan type, and market conditions. Getting rate quotes from at least three lenders is standard advice because rate differences of 0.5% can mean tens of thousands of dollars over a 30-year loan.',
      'Understanding these fundamentals helps you approach home buying as an informed financial decision rather than a confusing paperwork exercise. Use our mortgage calculator to see how different scenarios affect your monthly payment and total interest paid over the life of the loan.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
    relatedGuides: ['how-mortgage-interest-works', 'how-to-reduce-mortgage-interest', 'what-is-mortgage-insurance', 'how-much-house-can-i-afford'],
    relatedTools: ['loan-calculator', 'apr-calculator', 'refinance-calculator'],
    faqs: [
      { question: 'What does a mortgage payment include each month?', answer: 'Most mortgage payments include four components: Principal (the amount borrowed), Interest (lenders fee), Property Taxes, and Insurance (PITI). Some loans also include mortgage insurance if your down payment was less than 20%.' },
      { question: 'What is the difference between fixed and variable mortgage rates?', answer: 'A fixed rate stays the same for your entire loan term, so your payment never changes. A variable rate can adjust after an introductory period, meaning your payment could go up or down depending on market conditions.' },
      { question: 'How much down payment do I really need?', answer: 'While you can sometimes qualify with as little as 3-5% down, putting down 20% or more typically qualifies you for better rates and lets you avoid costly private mortgage insurance (PMI).' },
      { question: 'Why do early mortgage payments go mostly to interest?', answer: 'Interest is calculated on your remaining balance. Early on, your balance is highest, so the interest portion is largest. As you pay down principal, less interest accrues and more of your payment reduces the balance.' },
    ],
  },
  'how-to-reduce-mortgage-interest': {
    title: 'How to Lower Your Mortgage Interest Rate',
    author: 'CalcWise AI',
    datePublished: '2026-05-03',
    dateModified: '2026-05-28',
    readTime: '10 min read',
    category: 'Finance',
    paragraphs: [
      'Your mortgage interest rate shapes how much you pay monthly and the total cost of your home over decades. A difference of just 0.5% on a $400,000 loan can mean $40,000 or more in extra interest charges. That is real money that could stay in your pocket with the right strategies.',
      'Start before you even apply. Lenders use credit scores to assess risk and set rates, so improving your credit score before applying can shave points off your rate. Check your credit report for errors — these are more common than you might think and can drag your score down unfairly. Pay down existing credit card balances to lower your credit utilization ratio, which accounts for 30% of your score. Avoid opening new credit accounts or making large purchases in the months leading up to your mortgage application, as these can temporarily lower your score.',
      'The size of your down payment matters more than most first-time buyers realize. A larger down payment means borrowing less money, which reduces lender risk. Many lenders offer their best rates to borrowers who put down 20% or more. Beyond getting a better rate, a 20% down payment typically eliminates private mortgage insurance (PMI), which can add $100-400 monthly to your payment. In high-cost housing markets, this can be the difference between qualifying and not qualifying for the loan.',
      'Discount points deserve closer examination. One point costs 1% of your loan amount and typically reduces your interest rate by 0.25%. On a $400,000 loan, that is $4,000 upfront to reduce your rate. Whether this makes sense depends on how long you plan to stay in the home. If you will be there for the full 30 years, paying points usually wins. If you anticipate moving in 5-7 years, you might not recoup the upfront cost before selling.',
      'Shopping multiple lenders is not optional — it is essential. Mortgage rates and fees vary significantly between lenders, even when they serve the same market. Get written quotes from at least three different lenders and compare them line by line. Look beyond the interest rate to the annual percentage rate (APR), which includes fees and gives you a true cost comparison. The lender with the lowest rate might not be the cheapest when origination fees and closing costs are included.',
      'Consider the loan term carefully. A 15-year mortgage typically carries a rate 0.25-0.5% lower than a 30-year loan. Your monthly payment will be higher, but you pay significantly less total interest. If you can comfortably afford the higher payment, the long-term savings can be substantial.',
      'Once you have a mortgage, you are not stuck with your original rate. Refinancing when rates drop meaningfully can save thousands. Most financial advisors suggest refinancing when you can secure a rate at least 0.75% lower than your current rate, though the exact threshold depends on your loan balance, remaining term, and closing costs.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
    relatedGuides: ['what-is-mortgage', 'how-mortgage-interest-works', 'how-to-reduce-mortgage-interest'],
    relatedTools: ['refinance-calculator', 'apr-calculator', 'loan-calculator'],
    faqs: [
      { question: 'How much can improving my credit score actually save?', answer: 'Moving from a 670 credit score to 780 could reduce your rate by 2-3 percentage points. On a $300,000 loan over 30 years, that difference could save $100,000 or more in total interest.' },
      { question: 'Are mortgage points worth paying?', answer: 'Points make sense when you plan to stay in the home long enough to recoup the upfront cost through lower monthly payments. Calculate your break-even point: how many months of savings equal the cost of the points.' },
      { question: 'How many lenders should I actually compare?', answer: 'Most experts recommend getting quotes from at least three lenders. Some research suggests comparing five or more can find additional savings, especially if you have strong credit and a clean financial history.' },
      { question: 'When should I consider refinancing my existing mortgage?', answer: 'Refinancing makes sense when rates drop by 0.75% or more, when you can switch from an adjustable rate to a fixed rate, or when you can significantly shorten your loan term. Always calculate your break-even point first.' },
    ],
  },
  'what-is-mortgage-insurance': {
    title: 'What Is Mortgage Insurance and Do You Actually Need It?',
    author: 'CalcWise AI',
    datePublished: '2026-05-05',
    dateModified: '2026-05-28',
    readTime: '7 min read',
    category: 'Finance',
    paragraphs: [
      'Mortgage insurance is one of those things nobody talks about at dinner parties but affects millions of American homeowners. In essence, it is a policy that protects the lender if you fail to make payments. You pay the premiums, but the policy benefits the bank. This arrangement lets lenders offer loans to borrowers who cannot afford large down payments while still managing their risk.',
      'You will encounter mortgage insurance most often when your down payment falls below 20% of the home price. For conventional loans, this is called private mortgage insurance (PMI). For FHA loans, it goes by MIP (Mortgage Insurance Premium). VA loans have a funding fee instead, and USDA loans have guarantee fees. Each loan type has its own rules about when insurance applies and how much it costs.',
      'PMI costs vary based on your loan amount, credit score, and down payment size, but expect to pay 0.5% to 1% of your loan amount annually. On a $350,000 loan, that translates to $175-350 monthly — money that goes away once you reach 20% equity, but until then, it adds to your housing cost. FHA MIP is particularly persistent: if your down payment was under 10%, you pay MIP for the life of the loan. Only borrowers who put down 10% or more can cancel it after 11 years.',
      'Here is a misconception worth addressing: many buyers think mortgage insurance protects them. It does not. It protects the lender. If you stop paying and the bank forecloses, PMI compensates the lender for losses. Your equity in the home is not protected, and your credit score still takes a hit.',
      'The path to canceling PMI on conventional loans is relatively straightforward once you reach 20% equity. Write to your lender requesting cancellation — most servicers have forms for this. Your loan servicer must cancel PMI automatically once you reach 22% equity based on the original property value, but proactively requesting cancellation at 20% can save months of unnecessary payments.',
      'Some borrowers try to rush to 20% equity through larger payments or accelerated schedules. This can make sense financially if you can afford it, but consider opportunity cost: that extra monthly payment might generate better returns elsewhere, especially if your mortgage rate is already reasonable. Run the numbers with our mortgage calculator to see how extra payments affect your equity timeline.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
    relatedGuides: ['what-is-mortgage', 'how-to-reduce-mortgage-interest', 'how-mortgage-interest-works'],
    relatedTools: ['mortgage-calculator', 'refinance-calculator'],
    faqs: [
      { question: 'Can I cancel PMI early if I make extra payments?', answer: 'Yes, once your principal balance reaches 80% of your home\'s original value, you can request cancellation. Accelerated payments can help you reach this threshold faster.' },
      { question: 'Is FHA mortgage insurance the same as PMI?', answer: 'No. FHA MIP cannot be canceled if your down payment was under 10%. For conventional loans with PMI, you can cancel once you reach 20% equity.' },
      { question: 'Does mortgage insurance cover me if I stop paying?', answer: 'No. Mortgage insurance protects the lender, not you. If you default, the lender receives a claim from the insurance company, but you still face foreclosure and significant credit damage.' },
      { question: 'How do I know if I am paying mortgage insurance?', answer: 'Check your loan statement or closing documents. PMI typically appears as a separate line item in your monthly payment. If your down payment was under 20%, you are almost certainly paying it.' },
    ],
  },
  'how-mortgage-interest-works': {
    title: 'How Mortgage Interest Really Works',
    author: 'CalcWise AI',
    datePublished: '2026-05-07',
    dateModified: '2026-05-28',
    readTime: '9 min read',
    category: 'Finance',
    paragraphs: [
      'Interest is the price you pay for borrowing money. On a $400,000 mortgage at 7% over 30 years, you will pay roughly $560,000 in total — meaning $160,000 of that home\'s cost is interest alone. Understanding how this charge accumulates helps you make smarter decisions about extra payments, refinancing, and which loan to choose.',
      'Mortgage interest accrues daily, not monthly. Your lender calculates your monthly interest charge by taking your annual rate, dividing by 365 to get a daily rate, then multiplying by your current balance and the number of days in that month. This means the interest you owe in February (28 days) differs slightly from March (31 days), even if your balance stays constant.',
      'The amortization schedule is where most borrowers get surprised. Early in your mortgage, most of each payment goes toward interest rather than principal. In month one of a 30-year, 7% mortgage, roughly 70% of your payment covers interest. This ratio gradually shifts until, in the final years, most of your payment reduces principal. This front-loading of interest is not a trick — it is how all amortization schedules work mathematically. The key insight is that making extra principal payments early has a compounding effect because you are reducing the balance that future interest calculations are based on.',
      'Extra payments are more powerful than most people realize. Even one extra payment per year can shave 4-5 years off a 30-year mortgage and save tens of thousands in interest. The timing matters: an extra $500 payment in year one of your mortgage saves more interest than $500 in year twenty-five. This is because every dollar you pay early reduces the principal that all future interest charges are calculated on.',
      'Tax deductibility adds another layer. Mortgage interest on loans up to $750,000 (or $375,000 if married filing separately) is tax-deductible if you itemize deductions. At a 24% marginal tax rate, a $24,000 annual mortgage interest payment reduces your taxes by nearly $6,000. This effectively reduces your actual interest cost, though the Tax Cuts and Jobs Act capped the deduction and many homeowners now find the standard deduction more valuable than itemizing.',
      'Variable-rate mortgages introduce interest rate risk. After an introductory period (often 3, 5, or 7 years), your rate can adjust based on market conditions. Your payment could increase significantly if rates rise. This uncertainty is the price you pay for the lower initial rate. Before choosing an ARM, consider whether you can handle payment increases of 30-50% if rates spike during the adjustment period.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
    relatedGuides: ['what-is-mortgage', 'how-to-reduce-mortgage-interest', 'fixed-vs-adjustable-rate-mortgage-guide'],
    relatedTools: ['loan-calculator', 'apr-calculator', 'interest-calculator'],
    faqs: [
      { question: 'Why do early mortgage payments mostly cover interest?', answer: 'Interest is calculated on your outstanding balance, which is highest at the start of the loan. As you pay down principal, the balance shrinks, less interest accrues, and more of your payment applies to the principal.' },
      { question: 'How do extra payments save so much interest?', answer: 'Every extra dollar toward principal reduces the balance that future interest is calculated on. This creates a compounding effect — less interest means more of your payment goes to principal, which reduces the balance faster.' },
      { question: 'Is mortgage interest really tax-deductible?', answer: 'Yes, but with limits. Interest on mortgages up to $750,000 is deductible if you itemize. Many homeowners find the standard deduction more valuable since TCJA increased it significantly.' },
      { question: 'Should I pay extra on my mortgage or invest?', answer: 'This depends on your mortgage rate, investment returns, and risk tolerance. Paying mortgage interest is like earning a guaranteed return equal to your interest rate. Compare that to investment expectations after taxes.' },
    ],
  },
  'how-much-house-can-i-afford': {
    title: 'How Much House Can I Actually Afford?',
    author: 'CalcWise AI',
    datePublished: '2026-05-09',
    dateModified: '2026-05-28',
    readTime: '10 min read',
    category: 'Finance',
    paragraphs: [
      'The question "how much house can I afford" sounds simple, but the answer involves layers of math, psychology, and lifestyle trade-offs. Lenders will approve you for as much as their formulas allow, but what they approve and what you can comfortably afford are often different numbers.',
      'Lenders use two ratios to determine your maximum loan amount. The front-end ratio compares your housing payment (principal, interest, taxes, insurance) to your gross monthly income — most lenders want this below 28%. The back-end ratio compares all your monthly debt payments (housing, car loans, student loans, minimum credit card payments) to income — most want this below 36%. Hit these thresholds and you pass the automated underwriting, fail them and you need either a larger down payment, a lower loan amount, or fewer other debts.',
      'But approval limits are not comfort limits. A $3,000 monthly mortgage payment that technically fits within the 28/36 ratios might leave you house-poor if your other expenses are high. The 50/30/20 budget framework (50% needs, 30% wants, 20% savings) suggests your housing cost should fit comfortably within your needs category alongside utilities, groceries, and healthcare.',
      'Beyond the mortgage, owning costs money. Property taxes vary enormously by state and municipality — a $400,000 home in Texas might carry $8,000 annually in property taxes while the same home in California costs $4,000. Homeowners insurance runs $1,500-3,000 annually typically. HOA fees can add $200-1,000 monthly depending on the community. Maintenance requires budgeting 1-2% of your home value annually, or $4,000-8,000 yearly on a $400,000 home.',
      'Common mistakes homebuyers make include stretching to buy at the very top of their approval amount, underestimating total ownership costs, and failing to account for job instability or planned lifestyle changes. A mortgage that works when you are single might become crushing if you have children, change careers, or face medical expenses.',
      'Use our mortgage calculator to test different scenarios. Enter your anticipated loan amount, interest rate, and property taxes for your area. Run the numbers at various down payment levels to see how much equity you build over time and when you reach specific milestones.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
    relatedGuides: ['what-is-mortgage', 'what-is-loan-amortization', 'fixed-vs-adjustable-rate-mortgage-guide'],
    relatedTools: ['mortgage-calculator', 'loan-calculator'],
    faqs: [
      { question: 'What income do mortgage lenders actually use?', answer: 'Lenders use gross (before-tax) monthly income, typically averaging your salary over the past two years. Bonuses, commissions, and self-employment income can count if you have a consistent 2-year history.' },
      { question: 'How much should I really save for a down payment?', answer: 'Aim for 20% to avoid PMI, but 5-10% is often workable. Remember that a larger down payment means smaller monthly payments and less total interest over the loan life.' },
      { question: 'What costs do first-time buyers forget?', answer: 'Closing costs (2-5% of loan amount), moving expenses, immediate repairs, furniture for larger spaces, and the ongoing costs of property taxes, insurance, and maintenance.' },
      { question: 'Should I buy as much house as the bank approves?', answer: 'Probably not. Banks approve based on formulas, not your actual lifestyle and goals. Buying at the top of your approval can leave you vulnerable to unexpected expenses or income changes.' },
    ],
  },
  'what-is-loan-amortization': {
    title: 'Understanding Loan Amortization and Why It Matters for Your Finances',
    author: 'CalcWise AI',
    datePublished: '2026-05-11',
    dateModified: '2026-05-28',
    readTime: '8 min read',
    category: 'Finance',
    paragraphs: [
      'Loan amortization sounds like a term from a finance textbook, but it describes something you interact with every month: the schedule that determines how your payment is split between interest and principal. Understanding this process reveals why making extra payments early saves so much money and helps you see your home equity growth more clearly.',
      'An amortization schedule is simply a table showing each payment across the life of the loan, with columns for payment number, total payment, principal portion, interest portion, and remaining balance. These schedules follow a mathematical formula: your payment is calculated to be constant, but the interest portion decreases over time while the principal portion increases.',
      'The interest calculation happens on every payment. In month one, your balance is at its highest, so the interest charge (rate times balance divided by 12) is highest. The small difference between that interest and your total payment goes to principal. Next month, your balance is slightly lower, so interest is slightly lower, and slightly more goes to principal. This pattern continues until your final payment, where almost everything goes to principal.',
      'Here is the counterintuitive part for many borrowers: paying exactly on time every month for years does not meaningfully reduce your balance until years into the loan. If you have a 30-year mortgage at 7%, after five years of on-time payments on a $400,000 loan, you might have reduced your balance by only $20,000-30,000. The rest of your payments went to interest. This is not a scam — it is just how amortization works.',
      'Making extra principal payments disrupts this schedule powerfully. Suppose you owe $300,000 on a 30-year mortgage and you make one extra $1,000 payment in year one. That $1,000 goes entirely to principal (because interest for that month is already paid). Now your balance is $299,000 instead of $300,000, meaning next month\'s interest calculation starts from a lower base. Over 30 years, that single $1,000 payment saves far more than $1,000 in interest because the reduced balance compounds the savings forward.',
      'The amortization schedule also reveals why 15-year mortgages cost less total interest despite higher monthly payments. You are paying principal much faster, so less interest accumulates. A $400,000 loan at 7% for 15 years costs roughly $232,000 in total interest. The same loan over 30 years costs roughly $559,000 — more than double. The 15-year path is mathematically superior for those who can afford the payment.',
      'Use our loan calculator to generate a full amortization schedule and see exactly where your payments go each month. Seeing the principal-to-interest ratio at year one versus year twenty-five often motivates borrowers to make extra payments.',
    ],
    toolPath: '/tools/finance/loan-calculator',
    toolName: 'Loan Calculator',
    relatedGuides: ['how-mortgage-interest-works', 'what-is-mortgage'],
    relatedTools: ['mortgage-calculator', 'interest-calculator'],
    faqs: [
      { question: 'What exactly is amortization?', answer: 'Amortization is the process of paying off debt through scheduled payments over time, with each payment covering interest and reducing the principal balance according to a fixed schedule.' },
      { question: 'Why do I owe almost as much after 5 years of payments?', answer: 'Early payments are mostly interest. On a 30-year loan, you have paid mostly interest for the first decade. Extra payments go directly to principal and save significant interest.' },
      { question: 'How does extra payment affect my amortization schedule?', answer: 'Extra principal payments reduce your balance ahead of schedule, causing subsequent payments to apply more to principal. This accelerates equity buildup and shortens the loan term.' },
      { question: 'Can I see an amortization schedule for my loan?', answer: 'Yes, our loan calculator generates a complete amortization schedule showing how each payment affects your balance and the interest versus principal split over time.' },
    ],
  },
  'fixed-vs-adjustable-rate-mortgage-guide': {
    title: 'Fixed-Rate vs Adjustable-Rate Mortgages: Which Is Right for You?',
    author: 'CalcWise AI',
    datePublished: '2026-05-13',
    dateModified: '2026-05-28',
    readTime: '10 min read',
    category: 'Finance',
    paragraphs: [
      'The choice between a fixed-rate and adjustable-rate mortgage is one of the first big decisions you will make as a homebuyer, and it sets the tone for your entire ownership experience. Neither option is universally better — the right choice depends on your plans, your risk tolerance, and your financial situation.',
      'A fixed-rate mortgage offers certainty. Your interest rate and monthly payment stay exactly the same for 15, 20, or 30 years regardless of what happens in the economy. If inflation spikes, rates rise to 10%, or the housing market overheats, your payment remains unchanged. This predictability helps with long-term financial planning and budget stability.',
      'Fixed rates do come with a cost premium. Lenders price in the certainty they are offering, so fixed rates are typically 0.25-0.75% higher than the initial rate on an adjustable mortgage. Over a $400,000 loan over 30 years, that difference can mean $50,000-100,000 more in total interest paid.',
      'Adjustable-rate mortgages (ARMs) start with lower rates for an introductory period — commonly 3, 5, or 7 years. After that period, the rate adjusts annually based on market conditions. Your payment can go up or down. Hybrid products like 5/1 ARMs offer fixed rates for five years, then adjust annually thereafter. 7/1 ARMs fix for seven years before adjusting.',
      'The risk with ARMs is real but often overstated. Most ARMs have caps that limit how much the rate can increase per adjustment (typically 2% per adjustment) and over the life of the loan (typically 5-6% total). A 5/1 ARM starting at 6% cannot jump to 15% even if rates spike dramatically. Still, your payment could increase substantially, and you need to budget for that possibility.',
      'ARMs make the most sense for borrowers who expect to sell or refinance before the adjustment period begins, borrowers with strong confidence that rates will remain stable or decline, borrowers with flexible finances who can absorb payment increases, and first-time buyers who need lower initial payments to qualify.',
      'Fixed-rate mortgages suit borrowers who value stability and predictability, borrowers planning to stay in their home for many years, borrowers on fixed incomes who cannot absorb payment increases, and borrowers who sleep better at night knowing their housing cost will never change.',
    ],
    toolPath: '/tools/finance/mortgage-calculator',
    toolName: 'Mortgage Calculator',
    relatedGuides: ['what-is-mortgage', 'how-to-reduce-mortgage-interest', 'how-mortgage-interest-works'],
    relatedTools: ['mortgage-calculator', 'refinance-calculator'],
    faqs: [
      { question: 'What is a 5/1 ARM?', answer: 'A 5/1 ARM has a fixed interest rate for the first 5 years, then adjusts annually (every 1 year) for the remaining loan term. The 5 is the initial fixed period; the 1 is how often it adjusts after that.' },
      { question: 'When does an adjustable-rate mortgage make sense?', answer: 'ARMs make sense if you plan to sell or refinance before the adjustment period, expect stable or declining rates, or need lower initial payments to qualify for the loan.' },
      { question: 'How high can ARM rates actually go?', answer: 'Most ARMs cap rate increases at 2% per adjustment and 5-6% total over the loan life. A 6% ARM could theoretically reach 11-12% maximum, not 20%.' },
      { question: 'Which is safer for first-time homebuyers?', answer: 'Fixed-rate mortgages are generally safer for first-time buyers because payment stability helps with budgeting and planning. The slightly higher rate is worth the certainty.' },
    ],
  },
  'understanding-bmi': {
    title: 'Understanding BMI: What the Numbers Actually Mean for Your Health',
    author: 'CalcWise AI',
    datePublished: '2026-05-01',
    dateModified: '2026-05-28',
    readTime: '8 min read',
    category: 'Health',
    paragraphs: [
      'Body Mass Index has been the go-to health metric since the 1970s, when insurance companies noticed correlations between weight and mortality rates across large populations. The formula is simple: weight in kilograms divided by height in meters squared. But simplicity has limits, and understanding what BMI does and does not tell you is crucial for putting your results in context.',
      'BMI categories are standardized: below 18.5 is underweight, 18.5-24.9 is normal weight, 25-29.9 is overweight, and 30 or above indicates obesity. These ranges apply to all adults aged 20 and older regardless of gender. The simplicity is the point — BMI was designed as a population screening tool, not an individual health assessment.',
      'Where BMI falls short is distinguishing between muscle and fat. A professional football player at 6\'2" and 250 pounds with 10% body fat has a BMI of 32, which puts him in the "obese" category. Yet his body composition is clearly healthy. Similarly, an elderly person with weak muscles and high body fat might have a normal BMI despite poor metabolic health. BMI cannot see the difference.',
      'Research has also shown that BMI thresholds may not apply uniformly across ethnic groups. People of Asian descent may face health risks at lower BMIs than the standard categories suggest. Conversely, some populations with higher muscle mass may have elevated BMIs without corresponding health risks. The one-size-fits-all categories are increasingly seen as overly simplistic.',
      'Despite its limitations, BMI remains useful as one indicator among many. It correlates reasonably well with health outcomes at the population level and requires no special equipment or training to measure. For a quick screening in a clinical or public health setting, it provides useful information. The key is treating it as one input to your health picture, not the final word.',
      'If you are tracking your BMI over time, remember that weight fluctuates daily based on hydration, food intake, and bowel movements. Weekly or monthly averages give you a more accurate picture than daily readings. More importantly, consider pairing BMI with waist circumference measurements — carrying excess fat around your midsection poses greater health risks than fat stored elsewhere.',
    ],
    toolPath: '/tools/health/bmi-calorie-calculator',
    toolName: 'BMI Calculator',
    relatedGuides: ['how-to-improve-bmi'],
    relatedTools: ['bmi-calorie-calculator', 'bmr-calculator', 'body-fat-calculator'],
    faqs: [
      { question: 'Is BMI an accurate measure of body fat?', answer: 'No. BMI cannot distinguish between muscle and fat mass. Athletes and muscular individuals often have high BMIs despite low body fat, while sedentary individuals with low muscle mass may have normal BMIs.' },
      { question: 'What is a healthy BMI range?', answer: 'For most adults, 18.5-24.9 is considered a healthy weight range. Below 18.5 is underweight; 25-29.9 is overweight; 30+ is obese. These ranges have limitations and do not apply uniformly to all populations.' },
      { question: 'Why do healthcare providers still use BMI?', answer: 'BMI is free, requires no equipment, and correlates reasonably well with health outcomes across large populations. It is a useful screening tool, even if it should not be the sole measure of individual health.' },
      { question: 'What should I use instead of or alongside BMI?', answer: 'Waist circumference, waist-to-height ratio, body fat percentage, and overall fitness level provide more complete pictures. A healthcare provider can help you understand which metrics matter most for your situation.' },
    ],
  },
  'how-to-improve-bmi': {
    title: 'Practical Strategies to Reach and Maintain a Healthy BMI',
    author: 'CalcWise AI',
    datePublished: '2026-05-03',
    dateModified: '2026-05-28',
    readTime: '9 min read',
    category: 'Health',
    paragraphs: [
      'Improving your BMI is fundamentally about creating sustainable habits, not pursuing quick fixes. Fad diets might show results fast, but they rarely stick. The research on long-term weight management consistently shows that gradual, consistent changes work better than dramatic overhauls — and the changes that stick are the ones you can maintain for years, not weeks.',
      'Start with nutrition. What you eat matters more than exercise for weight management, though both contribute. Focus on protein — it keeps you full longer and preserves muscle mass during weight loss. Fiber-rich foods like vegetables, whole grains, and legumes promote satiety without many calories. Healthy fats from nuts, avocados, and olive oil support hormone balance and help you feel satisfied after meals.',
      'Practical nutrition moves that actually work: swap sugary drinks for water or sparkling water, add one extra serving of vegetables daily before worrying about anything else, batch-cook healthy proteins so you have ready options when hungry, and keep healthy snacks visible while putting less healthy options harder to reach.',
      'Physical activity builds on nutrition. Cardiovascular exercise burns calories during the activity, but strength training matters more than most people realize. Muscle tissue is metabolically active — it burns calories at rest just to exist. Adding muscle through strength training increases your resting metabolism, making weight maintenance easier over time.',
      'The 150 minutes of moderate exercise per week recommended by health authorities breaks down to about 30 minutes, 5 days a week. Brisk walking counts. Taking stairs counts. Playing with your kids or pets counts. You do not need a gym membership to meet these guidelines, though structured exercise certainly helps.',
      'Sleep and stress management are the factors most likely to derail your efforts. Poor sleep disrupts hunger hormones, making you hungrier and less satisfied after eating. Chronic stress elevates cortisol, which promotes fat storage, particularly around the midsection. Both deserve attention alongside nutrition and exercise.',
      'Aim for 7-9 hours of quality sleep nightly, and build stress-reduction practices into your routine — whether that is meditation, walks, time with loved ones, or simply hobbies you find genuinely relaxing. These are not luxuries; they directly support your weight management goals.',
    ],
    toolPath: '/tools/health/bmi-calorie-calculator',
    toolName: 'BMI Calculator',
    relatedGuides: ['understanding-bmi'],
    relatedTools: ['bmi-calorie-calculator', 'protein-calculator', 'water-intake-calculator'],
    faqs: [
      { question: 'How quickly is it safe to lose weight for BMI improvement?', answer: 'A safe rate is 1-2 pounds per week, achieved through a calorie deficit of 500-1000 calories daily. Faster weight loss often comes back and is harder to sustain.' },
      { question: 'Does muscle actually weigh more than fat?', answer: 'A pound is a pound, but muscle is denser than fat, meaning it takes less volume. The scale does not tell the whole story — body composition matters more than weight alone.' },
      { question: 'What is the best diet for sustainable weight management?', answer: 'The best diet is one you can maintain long-term. Research suggests Mediterranean-style eating, moderate protein intake, and home cooking are common threads in sustainable approaches.' },
      { question: 'How do I stay motivated when progress is slow?', answer: 'Track non-scale victories: energy levels, clothing fit, strength improvements, sleep quality. Scale weight fluctuates daily. Weekly averages tell a clearer story.' },
    ],
  },
  'understanding-shipping-dim-weight': {
    title: 'Dimensional Weight Explained: Why Your Light Package Costs So Much to Ship',
    author: 'CalcWise AI',
    datePublished: '2026-05-01',
    dateModified: '2026-05-28',
    readTime: '7 min read',
    category: 'Shipping',
    paragraphs: [
      'If you have ever shipped a large but lightweight item and been surprised by the cost, dimensional weight is probably why. Carriers do not charge based on weight alone — they charge based on the space your package takes up. A 10-pound box that is mostly air costs them the same truck or plane space as a 10-pound box packed solid.',
      'Dimensional weight (DIM weight) pricing emerged because lightweight packages were taking up valuable space in carriers\' networks without generating proportional revenue. The solution: charge based on the cubic space packages occupy, not just their actual weight. This is called dimensional weight or volumetric weight pricing.',
      'To calculate dimensional weight, measure your package length, width, and height in inches. Multiply those dimensions to get cubic inches. Divide by the DIM divisor — typically 139 for FedEx and UPS domestic shipments, 166 for USPS Priority Mail. The resulting number is your dimensional weight in pounds.',
      'Your billable weight is whichever is higher: actual weight or dimensional weight. If your package weighs 5 pounds but its dimensions create a dimensional weight of 8 pounds, you pay for 8 pounds. Conversely, if your package weighs 12 pounds but has only 6 pounds of dimensional weight, you pay for 12 pounds.',
      'This is why e-commerce businesses obsess over packaging. That large Amazon-style box might hold only a small item, but you pay shipping based on the box size. Switching to a smaller, appropriately sized box can cut your shipping costs in half for lightweight items. Every cubic inch eliminated directly reduces your dimensional weight.',
      'The DIM divisor varies by carrier and service level. FedEx and UPS typically use 139 for standard ground shipments. USPS uses 166 for Priority Mail and 194 for Ground Advantage. International shipments often use higher divisors. Always check your specific carrier\'s current guidelines, as these change periodically.',
      'Use our DIM weight calculator to compare packaging options and see how different box sizes affect your billable weight. Even a few inches reduction in each dimension can meaningfully change your shipping costs for lightweight, bulky items.',
    ],
    toolPath: '/tools/shipping/dim-weight-calculator',
    toolName: 'DIM Weight Calculator',
    relatedGuides: ['how-shipping-costs-are-calculated', 'how-to-reduce-shipping-costs'],
    relatedTools: ['dim-weight-calculator', 'shipping-cost-estimator', 'package-volume-calculator'],
    faqs: [
      { question: 'What is the DIM divisor and why does it matter?', answer: 'The DIM divisor converts cubic inches to a weight equivalent. FedEx and UPS use 139; lower divisors increase dimensional weight. Understanding your carrier\'s divisor helps you predict shipping costs.' },
      { question: 'When should I measure package dimensions carefully?', answer: 'Measure carefully for any package where length plus girth exceeds 84 inches, as carriers charge penalties for oversized packages that exceed certain dimensional thresholds.' },
      { question: 'How much can I save by reducing package size?', answer: 'Reducing dimensions to minimize dimensional weight can save 20-50% on lightweight, bulky items. Switching from an oversized box to a properly sized one often has the biggest impact.' },
      { question: 'What is billable weight?', answer: 'Billable weight is whichever is higher: your package\'s actual weight or its dimensional weight. You always pay for the higher of the two.' },
    ],
  },
  'how-shipping-costs-are-calculated': {
    title: 'How Shipping Costs Are Calculated: A Complete Guide to Carrier Pricing',
    author: 'CalcWise AI',
    datePublished: '2026-05-03',
    dateModified: '2026-05-28',
    readTime: '9 min read',
    category: 'Shipping',
    paragraphs: [
      'Shipping costs are rarely simple. Carriers use complex pricing models that consider package weight, dimensions, distance, service level, and numerous surcharges. Understanding these factors helps you optimize your shipping strategy and avoid surprise charges on your monthly bill.',
      'The foundation of shipping cost is weight, but not in the simple way you might expect. Carriers use dimensional (DIM) weight for lightweight packages and actual weight for heavy packages, charging whichever is higher. Your 3-pound package in a large box might cost as much to ship as a 10-pound package in a properly sized box because DIM weight applies.',
      'Distance zones determine your base rate. Carriers divide their service areas into zones based on how far packages travel from origin to destination. The further your package goes, the higher the zone and the higher the base rate. Zone pricing means shipping 100 miles costs less than shipping 1,000 miles to the same service level.',
      'Service levels dramatically affect pricing. Ground shipping is the cheapest option, typically arriving in 5-7 business days. Express options — 2-day, overnight, or same-day — cost substantially more. Priority services can cost 3-10 times more than ground for the same package.',
      'Surcharges are where carriers hide costs. Fuel surcharges, residential delivery surcharges, oversize package fees, peak season surcharges, and address correction charges can add 15-25% to your base rate. These fees are often buried in the fine print and appear as line items on your invoice rather than being included in rate quotes.',
      'Negotiating with carriers requires volume. The more packages you ship, the more leverage you have. Even small businesses shipping 50+ packages monthly can often negotiate meaningful discounts from published rates. Regional carriers offer another negotiation lever — they often provide competitive rates in specific zones and give you leverage when comparing against major carriers.',
      'Our shipping calculators help you compare scenarios. Run the numbers on different packaging options, service levels, and carriers before you ship to avoid sticker shock.',
    ],
    toolPath: '/tools/shipping/shipping-cost-estimator',
    toolName: 'Shipping Cost Estimator',
    relatedGuides: ['understanding-shipping-dim-weight', 'how-to-reduce-shipping-costs', 'international-shipping-guide'],
    relatedTools: ['shipping-cost-estimator', 'dim-weight-calculator', 'freight-class-calculator'],
    faqs: [
      { question: 'What is the cheapest shipping method for small packages?', answer: 'USPS Ground Advantage is often the cheapest for packages under 1 pound. UPS and FedEx Ground become competitive for larger or heavier packages, especially in certain zones.' },
      { question: 'Why do surcharges add so much to my shipping costs?', answer: 'Fuel surcharges, residential delivery fees, and peak surcharges are common line items that carriers add to base rates. These can represent 15-25% of your total shipping cost.' },
      { question: 'How can I reduce my shipping costs?', answer: 'Optimize packaging to reduce dimensional weight, compare carrier rates for each shipment, use regional carriers for certain zones, and negotiate volume discounts if you ship regularly.' },
      { question: 'Should I negotiate directly with carriers?', answer: 'Yes, especially if you ship 50+ packages monthly. Volume gives you leverage, and carriers often have unpublished discount tiers for regular shippers.' },
    ],
  },
  'how-to-reduce-shipping-costs': {
    title: 'Proven Ways to Reduce Your Shipping Costs Without Sacrificing Service',
    author: 'CalcWise AI',
    datePublished: '2026-05-01',
    dateModified: '2026-05-28',
    readTime: '8 min read',
    category: 'Shipping',
    paragraphs: [
      'For e-commerce businesses, shipping costs can consume 10-15% of revenue — a line item that directly affects profitability. The good news: shipping costs are one of the most optimizable expenses in your business. Small changes in packaging and carrier selection can meaningfully improve your bottom line.',
      'Packaging optimization is the highest-impact change most shippers can make. Every cubic inch of unnecessary packaging costs you money. Audit your packages and ask: is this box the smallest that safely holds this product? Could a mailer envelope work instead? Could we use lighter but still protective materials? A packaging audit often reveals 20-30% reduction potential.',
      'Dimensional weight pricing means box size matters more than ever. A package that weighs 8 pounds but has 12 pounds of DIM weight costs as much to ship as a 12-pound package. Use a box dimension calculator to find the smallest safe packaging for each product. The savings add up fast at scale.',
      'Carrier negotiation is not just for big businesses. If you ship 50+ packages monthly, you have negotiation leverage. Contact carrier sales representatives, present your volume and shipping patterns, and ask about unpublished discount tiers. Even small businesses can often secure 15-25% off published rates.',
      'Regional carriers deserve serious consideration. Companies like LSO, OnTrac, and regional USPS partners often offer faster delivery and lower costs than FedEx and UPS for certain routes. Especially for packages under 5 pounds traveling within specific regions, regional options can save 15-30% with better delivery times.',
      'Service level optimization means choosing the cheapest acceptable service for each shipment. Not every package needs overnight delivery. A customer in the next state does not need FedEx 2Day — USPS Ground Advantage might arrive in 3 days for half the cost. Use zone-based routing: local and regional packages get cheaper service levels.',
      'Our shipping calculators let you compare scenarios before shipping. Run the numbers on different carriers, service levels, and packaging options to find the most cost-effective approach for each shipment type.',
    ],
    toolPath: '/tools/shipping/dim-weight-calculator',
    toolName: 'DIM Weight Calculator',
    relatedGuides: ['how-shipping-costs-are-calculated', 'understanding-shipping-dim-weight', 'international-shipping-guide'],
    relatedTools: ['shipping-cost-estimator', 'dim-weight-calculator', 'pallet-calculator'],
    faqs: [
      { question: 'How much can I save by reducing package size?', answer: 'Reducing dimensions to minimize dimensional weight can save 20-50% on lightweight, bulky items. For an e-commerce business shipping hundreds of packages monthly, these savings can be significant.' },
      { question: 'Are regional carriers reliable?', answer: 'Most regional carriers offer reliable service within their regions, often with faster delivery times than major carriers for short-distance shipments. Research specific carriers for your routes.' },
      { question: 'How do I negotiate with carriers?', answer: 'Contact carrier business development teams, present your monthly shipping volume and patterns, and ask about discount programs. Even small businesses with 50+ packages monthly can often negotiate meaningful rates.' },
      { question: 'When should I use ground shipping versus expedited?', answer: 'Ground shipping works well for non-urgent shipments, heavier packages, and regional destinations. Reserve expedited services for genuinely urgent deliveries or customers who pay for faster options.' },
    ],
  },
  'international-shipping-guide': {
    title: 'International Shipping: What You Need to Know Before Going Global',
    author: 'CalcWise AI',
    datePublished: '2026-05-01',
    dateModified: '2026-05-28',
    readTime: '10 min read',
    category: 'Shipping',
    paragraphs: [
      'Expanding your business internationally opens vast new markets, but shipping globally comes with complexity that trips up many first-time exporters. Customs delays, unexpected duties, and regulatory compliance are the main challenges — and they are all manageable with proper preparation.',
      'Customs documentation is where international shipments most commonly go wrong. You must provide a complete commercial invoice describing your goods, declaring their value in USD, and classifying them using HS (Harmonized System) codes. These six-to-ten-digit codes tell customs authorities exactly what your products are and what duties apply.',
      'Incomplete or inaccurate customs documentation is the leading cause of international shipping delays. Packages can sit in customs for days or weeks while documentation is corrected. Use official customs software or work with a customs broker for your first international shipments to ensure paperwork is complete.',
      'Import duties and taxes are typically the recipient\'s responsibility in most countries. This practice, called DDP (Delivered Duty Paid) in some regions and "DDU" (Delivered Duty Unpaid) in others, means international customers may face unexpected charges upon delivery. Clear communication before purchase helps avoid failed deliveries and frustrated customers.',
      'Every country has different rules about what can be imported. Products legal in the United States might be restricted or banned elsewhere. Research your destination country\'s import regulations before shipping. Our freight class and shipping cost calculators can help you estimate international logistics costs.',
      'Insurance becomes more important internationally. Longer transit times, multiple handling points, and customs inspections increase risk of damage or loss. Standard carrier liability for international shipments often falls far short of product values. Consider third-party shipping insurance for valuable items.',
      'Partner with carriers experienced in international shipping. FedEx, UPS, and DHL have established international networks with customs clearance expertise built in. Their rates may be higher than regional options, but the compliance support often justifies the premium for businesses new to international shipping.',
    ],
    toolPath: '/tools/shipping/freight-class-calculator',
    toolName: 'Freight Class Calculator',
    relatedGuides: ['how-shipping-costs-are-calculated', 'how-to-reduce-shipping-costs'],
    relatedTools: ['shipping-cost-estimator', 'freight-class-calculator', 'dim-weight-calculator'],
    faqs: [
      { question: 'What is an HS code and why do I need one?', answer: 'The Harmonized System code classifies products for customs purposes. It determines duty rates and import regulations. Incomplete or incorrect HS codes cause customs delays and incorrect duty assessments.' },
      { question: 'Do I need shipping insurance for international shipments?', answer: 'Standard carrier liability for international shipments is often very limited. For valuable products, third-party insurance that covers the full value is strongly recommended due to longer transit times and more handling.' },
      { question: 'Who pays import duties on international shipments?', answer: 'Typically the recipient pays import duties. Clear communication about potential additional charges helps prevent failed deliveries and customer disputes.' },
      { question: 'How do I find the correct HS code for my products?', answer: 'Start with the Harmonized Tariff Schedule database, consult a customs broker, or use classification software. Getting expert help for your first international shipments is worthwhile.' },
    ],
  },
};

const getGuide = (slug?: string) => {
  if (slug && GUIDE_CONTENTS[slug]) return GUIDE_CONTENTS[slug];
  return {
    title: slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'Guide',
    author: 'CalcWise AI',
    datePublished: '2026-05-28',
    dateModified: '2026-05-28',
    readTime: '5 min read',
    category: 'General',
    paragraphs: [
      'This guide covers essential concepts and best practices to help you make informed decisions. Whether you are calculating finances, tracking health metrics, or optimizing shipping costs, understanding the fundamentals is the first step toward better outcomes.',
      'Our tools are designed to complement this knowledge by providing fast, accurate calculations powered by intelligent algorithms. Each tool is built with precision and ease of use in mind, so you can focus on what matters most.',
      'Explore related guides and use our interactive calculators to apply what you learn in real time.',
    ],
    toolPath: '/',
    toolName: 'All Tools',
    relatedGuides: [],
    relatedTools: [],
    faqs: [
      { question: 'What is this guide for?', answer: 'This article is a general overview that helps readers understand the topic before using the calculator.' },
      { question: 'Where can I continue after reading?', answer: 'Use the linked calculator to test scenarios with your own numbers and get instant results.' },
    ],
  };
};

export default function GuideDetailPage() {
  const { slug } = useParams();
  const guide = getGuide(slug);
  const canonicalUrl = `https://www.calculatorpilotai.com/guides/${slug ?? ''}`.replace(/\/$/, '');
  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides' },
    { name: guide.title },
  ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      generateBreadcrumbSchema(breadcrumbItems.filter((item): item is { name: string; url: string } => Boolean(item.url))),
      generateFAQSchema(guide.faqs),
      generateArticleSchema({
        headline: guide.title,
        description: guide.paragraphs[0],
        url: canonicalUrl,
        datePublished: guide.datePublished,
        dateModified: guide.dateModified,
        authorName: guide.author,
      }),
    ],
  };

  return (
    <>
      <PageMeta title={guide.title} description={guide.paragraphs[0]} canonical={canonicalUrl} ogType="article" jsonLd={jsonLd} />
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-20">
        <Breadcrumb items={breadcrumbItems} />
        <article className="prose prose-lg max-w-none">
          <header className="mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {guide.category}
              </span>
              <span>•</span>
              <span>{guide.readTime}</span>
              <span>•</span>
              <span>Updated {new Date(guide.dateModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight mb-4">{guide.title}</h1>
          </header>

          {guide.paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-relaxed text-slate-700 mb-6">
              {p}
            </p>
          ))}

          <section className="mt-12 p-8 border-2 border-primary/20 rounded-xl bg-primary/5">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold">Ready to calculate?</h3>
            </div>
            <p className="mb-4 text-slate-600">Use our {guide.toolName} to apply what you learned with your own numbers.</p>
            <Link to={guide.toolPath} className="inline-flex items-center gap-2 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
              Try {guide.toolName} <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Related Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guide.relatedGuides.map((relSlug) => {
                const relatedGuide = GUIDE_CONTENTS[relSlug];
                if (!relatedGuide) return null;
                return (
                  <Link key={relSlug} to={`/guides/${relSlug}`} className="flex items-start gap-3 p-4 border border-slate-200 rounded-xl hover:border-primary/50 transition-colors">
                    <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{relatedGuide.title}</p>
                      <p className="text-xs text-slate-500">{relatedGuide.readTime}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {guide.faqs.map((faq, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </>
  );
}