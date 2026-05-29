import type { SEOPageConfig, SEOCategory, SEOPageType } from '@/data/seo';

interface ContentResult {
  intro: string;
  explanation: string;
  howTo: string[];
  faqs: { question: string; answer: string }[];
  cta: string;
}

const categoryIntros: Record<SEOCategory, (keyword: string) => string> = {
  finance: (keyword) =>
    `Our ${keyword} helps you make informed financial decisions. Whether you're planning a major purchase, evaluating investment options, or simply need to understand your current financial situation, this tool provides the clarity you need.`,

  health: (keyword) =>
    `Use our ${keyword} to better understand your health metrics. This tool is designed for informational purposes and can help you track progress toward your wellness goals.`,

  shipping: (keyword) =>
    `Calculate shipping costs and logistics with our ${keyword}. Whether you're running a business or sending a personal package, get accurate estimates quickly.`,

  ai: (keyword) =>
    `Our ${keyword} helps you understand and work with AI technologies. Get estimates, comparisons, and insights to make better decisions about AI tools and services.`,

  time: (keyword) =>
    `Our ${keyword} helps you manage time-related calculations with precision. From planning events to tracking deadlines, simplify your time calculations.`,
};

const categoryExplanations: Record<SEOCategory, (keyword: string) => string> = {
  finance: (keyword) =>
    `This ${keyword} uses standard financial formulas to provide estimates. Results are based on the inputs you provide and current market conditions. Financial decisions should also consider factors beyond what any calculator can measure, such as your overall financial health, risk tolerance, and long-term goals.`,

  health: (keyword) =>
    `The ${keyword} provides estimates based on established health metrics. These calculations are general guidelines and should not replace professional medical advice. Always consult a healthcare provider for personalized recommendations.`,

  shipping: (keyword) =>
    `This ${keyword} estimates shipping costs and requirements. Actual rates may vary based on carrier-specific policies, fuel surcharges, and package handling. For the most accurate quotes, check directly with carriers.`,

  ai: (keyword) =>
    `This ${keyword} provides estimates based on publicly available information about AI models and services. The AI landscape evolves rapidly, so we recommend verifying current pricing and capabilities directly with providers.`,

  time: (keyword) =>
    `This ${keyword} performs calculations based on calendar data and standard time conventions. Results account for leap years and common date variations. For precise scheduling requirements, verify against official time sources.`,
};

const pageTypeHowTo: Record<SEOPageType, (keyword: string) => string[]> = {
  calculator: (keyword) => [
    `Enter your values in the input fields provided`,
    `Review the results displayed instantly below`,
    `Adjust inputs to see how changes affect outcomes`,
    `Use the results for planning and decision-making`,
  ],

  guide: (keyword) => [
    `Read through the key concepts and explanations`,
    `Note the important factors relevant to your situation`,
    `Review the frequently asked questions`,
    `Explore related tools and resources for deeper understanding`,
  ],

  compare: (keyword) => [
    `Review the side-by-side comparison table`,
    `Identify which criteria matter most for your needs`,
    `Consider the trade-offs between each option`,
    `Use the related calculators to get specific numbers`,
  ],
};

const categoryFAQs: Record<SEOCategory, (keyword: string) => { question: string; answer: string }[]> = {
  finance: (keyword) => [
    {
      question: `Is this ${keyword} accurate for official financial planning?`,
      answer: `This tool provides estimates based on standard formulas and the inputs you provide. For official financial planning, consult with a certified financial planner who can consider your complete financial picture.`,
    },
    {
      question: `What information do I need to use this calculator?`,
      answer: `You'll need the relevant financial figures such as loan amounts, interest rates, income levels, or investment values depending on the specific calculation. The tool will guide you through required inputs.`,
    },
    {
      question: `Can I save my results for later?`,
      answer: `You can bookmark the page or take screenshots of your results. For comprehensive financial planning, consider working with a financial advisor who can help track your progress over time.`,
    },
    {
      question: `How often should I recalculate?`,
      answer: `Financial situations change over time. We recommend reviewing your calculations when you have significant life changes like new income, major purchases, or changes in interest rates.`,
    },
  ],

  health: (keyword) => [
    {
      question: `Can I rely on this ${keyword} for medical advice?`,
      answer: `This tool is for informational purposes only. It cannot replace professional medical advice, diagnosis, or treatment. Always consult a healthcare professional for personalized guidance.`,
    },
    {
      question: `What factors does this calculator consider?`,
      answer: `The calculator uses standard health metrics and formulas. Individual factors like medical history, medications, and specific conditions may affect what's appropriate for you.`,
    },
    {
      question: `How should I interpret my results?`,
      answer: `Results show general ranges based on your inputs. These are starting points for understanding your health metrics, not medical diagnoses or treatment recommendations.`,
    },
    {
      question: `When should I see a healthcare provider?`,
      answer: `If you have concerns about your health metrics or if your results fall outside expected ranges, schedule an appointment with a healthcare provider for personalized evaluation.`,
    },
  ],

  shipping: (keyword) => [
    {
      question: `Are these shipping estimates guaranteed?`,
      answer: `Estimates are based on typical conditions and carrier rate structures. Actual costs may vary due to fuel surcharges, special handling requirements, or carrier-specific policies.`,
    },
    {
      question: `Which carriers can I compare?`,
      answer: `The calculator covers major carriers. For the most current rates and services, we recommend checking directly with carriers, as pricing structures change regularly.`,
    },
    {
      question: `What affects my actual shipping cost?`,
      answer: `Actual costs depend on package dimensions, weight, distance, delivery speed, and additional services like insurance or signature confirmation.`,
    },
    {
      question: `How can I reduce shipping costs?`,
      answer: `Consider optimizing package size, using regional carriers, shipping during off-peak times, and comparing multiple carrier rates. Business accounts often offer additional discounts.`,
    },
  ],

  ai: (keyword) => [
    {
      question: `How accurate are these AI cost estimates?`,
      answer: `Estimates are based on publicly available pricing information. AI service pricing changes frequently, so we recommend verifying current rates directly with providers.`,
    },
    {
      question: `Which AI models are included?`,
      answer: `We cover major commercial AI models and services. The AI landscape evolves rapidly, with new models and pricing structures emerging regularly.`,
    },
    {
      question: `Can I use these estimates for budgeting?`,
      answer: `Use these as starting estimates for planning purposes. Actual costs depend on usage patterns, API call volumes, and specific model pricing tiers.`,
    },
    {
      question: `How do I choose the right AI model?`,
      answer: `Consider factors like cost, capability requirements, latency needs, and privacy requirements. For production use, we recommend testing multiple options with your actual workload.`,
    },
  ],

  time: (keyword) => [
    {
      question: `Does this calculator account for time zones?`,
      answer: `The calculator uses your local time zone for inputs. When comparing across time zones, results show the difference in hours and days between locations.`,
    },
    {
      question: `How are leap years handled?`,
      answer: `Calculations automatically account for leap years following the Gregorian calendar system used in most countries.`,
    },
    {
      question: `Can I calculate business days only?`,
      answer: `Some time calculators offer business day options. Standard business day calculations exclude weekends and common holidays, though holiday recognition varies by country.`,
    },
    {
      question: `What happens during daylight saving time?`,
      answer: `The calculator accounts for standard time conventions. When crossing DST boundaries, the exact time difference may vary depending on the specific dates.`,
    },
  ],
};

const categoryCTA: Record<SEOCategory, (keyword: string) => string> = {
  finance: () =>
    `Browse our collection of financial calculators to explore more tools for your financial planning journey.`,

  health: () =>
    `Explore our health and wellness calculators to track and understand your health metrics better.`,

  shipping: () =>
    `Compare shipping rates and calculate logistics with our suite of shipping tools.`,

  ai: () =>
    `Discover more AI tools and calculators to help you make informed decisions about AI technologies.`,

  time: () =>
    `Find more time-related calculators to help with planning and scheduling.`,
};

const intentSpecificContent: Record<string, (keyword: string) => { intro?: string; howTo?: string[] }> = {
  calculator: () => ({
    howTo: [
      `Enter your values in the input fields`,
      `Click calculate or wait for auto-calculation`,
      `Review the results immediately`,
      `Adjust inputs to explore different scenarios`,
    ],
  }),
  guide: (keyword) => ({
    intro: `This guide covers everything you need to know about ${keyword}. Whether you're just getting started or looking to deepen your understanding, you'll find practical information here.`,
    howTo: [
      `Read through the overview section first`,
      `Review the key takeaways`,
      `Check the FAQ for common questions`,
      `Use related tools to apply what you learn`,
    ],
  }),
  compare: (keyword) => ({
    intro: `Compare different options for ${keyword} side by side. This comparison helps you understand the trade-offs and make an informed choice based on your specific needs.`,
    howTo: [
      `Review all options in the comparison table`,
      `Identify which criteria matter most to you`,
      `Consider both short-term and long-term factors`,
      `Use the related calculators for detailed analysis`,
    ],
  }),
};

export function generateProgrammaticIntro(config: SEOPageConfig): string {
  const { category, keyword, intent } = config;

  if (intent !== 'calculator' && intentSpecificContent[intent]) {
    const intentContent = intentSpecificContent[intent](keyword);
    if (intentContent.intro) {
      return intentContent.intro;
    }
  }

  return categoryIntros[category](keyword);
}

export function generateProgrammaticExplanation(config: SEOPageConfig): string {
  const { category, keyword } = config;
  return categoryExplanations[category](keyword);
}

export function generateProgrammaticHowTo(config: SEOPageConfig): string[] {
  const { pageType, keyword, intent } = config;

  if (intent !== 'calculator' && intentSpecificContent[intent]) {
    const intentContent = intentSpecificContent[intent](keyword);
    if (intentContent.howTo) {
      return intentContent.howTo;
    }
  }

  return pageTypeHowTo[pageType](keyword);
}

export function generateProgrammaticFAQ(config: SEOPageConfig): { question: string; answer: string }[] {
  const { category, keyword } = config;
  return categoryFAQs[category](keyword);
}

export function generateProgrammaticCTA(config: SEOPageConfig): string {
  const { category, keyword } = config;
  return categoryCTA[category](keyword);
}

export function generateProgrammaticRelatedContent(config: SEOPageConfig): {
  explanation: string;
  keyPoints: string[];
} {
  const { category, pageType, intent } = config;

  const basePoints: Record<SEOCategory, string[]> = {
    finance: [
      `Results are estimates based on standard formulas`,
      `Consider consulting a financial advisor for major decisions`,
      `Regular review helps keep plans aligned with goals`,
    ],
    health: [
      `Use as informational guidance only`,
      `Consult healthcare professionals for personalized advice`,
      `Metrics are general guidelines, not medical recommendations`,
    ],
    shipping: [
      `Actual rates may vary from estimates`,
      `Check directly with carriers for precise quotes`,
      `Consider multiple carriers for best rates`,
    ],
    ai: [
      `Estimates based on publicly available information`,
      `Verify current pricing with service providers`,
      `AI capabilities evolve rapidly`,
    ],
    time: [
      `Calculations follow standard calendar conventions`,
      `Account for local holidays when relevant`,
      `Verify critical deadlines directly`,
    ],
  };

  const pageTypeModifiers: Record<SEOPageType, string[]> = {
    calculator: [`Enter values to get instant results`],
    guide: [`Learn the fundamentals before applying`],
    compare: [`Evaluate options based on your specific needs`],
  };

  return {
    explanation: generateProgrammaticExplanation(config),
    keyPoints: [...basePoints[category], ...pageTypeModifiers[pageType]],
  };
}

export function generateAllProgrammaticContent(config: SEOPageConfig): ContentResult {
  return {
    intro: generateProgrammaticIntro(config),
    explanation: generateProgrammaticExplanation(config),
    howTo: generateProgrammaticHowTo(config),
    faqs: generateProgrammaticFAQ(config),
    cta: generateProgrammaticCTA(config),
  };
}

// Specialized content for loan types and BMI audiences - P5.2A
const loanTypeContent: Record<string, { intro: string; faqs: { question: string; answer: string }[] }> = {
  'fha-loan-calculator': {
    intro: `Our FHA loan calculator helps first-time homebuyers estimate their monthly mortgage payments with FHA loan requirements. FHA loans are government-backed mortgages designed to make home ownership more accessible with lower down payment requirements and more flexible credit standards.`,
    faqs: [
      { question: 'What is the minimum down payment for an FHA loan?', answer: 'FHA loans require a minimum down payment of 3.5% for borrowers with credit scores of 580 or higher. Those with credit scores between 500-579 may qualify with a 10% down payment.' },
      { question: 'What are FHA loan limits in 2026?', answer: 'FHA loan limits vary by county and range from $524,225 to $1,209,750 for single-family homes in high-cost areas. Check your county limits for accurate borrowing limits.' },
      { question: 'What is FHA MIP and how long do I pay it?', answer: 'FHA requires both an upfront mortgage insurance premium (UFMIP) of 1.75% of the loan amount and annual MIP that varies by loan term, amount, and LTV. Most borrowers pay MIP for the life of the loan.' },
      { question: 'Can I use an FHA loan for a multi-unit property?', answer: 'Yes, FHA loans can finance 1-4 unit properties as long as you occupy one unit as your primary residence. Multi-unit properties can be cost-effective for house hacking strategies.' },
    ],
  },
  'va-loan-calculator': {
    intro: `Our VA loan calculator helps eligible veterans, service members, and surviving spouses estimate their VA loan payments. VA loans offer competitive rates with no down payment required and no private mortgage insurance, making them one of the most favorable mortgage options available.`,
    faqs: [
      { question: 'Who is eligible for a VA loan?', answer: 'Eligible borrowers include veterans with qualifying service, active-duty service members, National Guard and Reserve members, and surviving spouses of veterans who died in service or from service-connected disabilities.' },
      { question: 'Do VA loans require a down payment?', answer: 'No, VA loans do not require a down payment for loans at or below the county loan limit. For loans exceeding the limit, a down payment equal to 25% of the amount above the limit is required.' },
      { question: 'What are VA loan funding fees?', answer: 'VA charges a funding fee that varies based on service type, down payment, and whether it is your first use. The fee typically ranges from 1.4% to 3.6% of the loan amount and can be financed.' },
      { question: 'Can I use a VA loan more than once?', answer: 'Yes, VA loans can be used multiple times. However, there are entitlement restoration requirements and potential funding fee increases for subsequent uses.' },
    ],
  },
  'usda-loan-calculator': {
    intro: `Our USDA loan calculator helps eligible buyers in rural and suburban areas estimate their zero-down-payment mortgage payments. USDA loans offer 100% financing for qualified borrowers purchasing homes in designated rural development areas.`,
    faqs: [
      { question: 'What are USDA loan income limits?', answer: 'USDA income limits vary by location and household size. Generally, household income cannot exceed 115% of the area median income. Limits are adjusted annually.' },
      { question: 'What properties qualify for USDA loans?', answer: 'Properties must be located in eligible rural areas as designated by USDA. Most suburban and rural areas qualify. The property must be your primary residence and typically must be modest in size and price.' },
      { question: 'What are USDA guarantee fees?', answer: 'USDA charges a guarantee fee of 1% upfront and an annual fee of 0.35% of the outstanding loan balance. These fees help support the program and can be financed with the loan.' },
      { question: 'Can I use USDA loans for new construction?', answer: 'Yes, USDA loans can be used for new construction, including builder-certified new homes meeting energy efficiency standards. The property must meet all USDA property requirements.' },
    ],
  },
  'conventional-loan-calculator': {
    intro: `Our conventional loan calculator helps estimate monthly payments for conforming mortgages not backed by government agencies. Conventional loans typically offer competitive rates with various term options for well-qualified borrowers.`,
    faqs: [
      { question: 'What is the conventional loan limit in 2026?', answer: 'The baseline conforming loan limit for single-family homes is $806,500 in most areas. Higher-cost areas may have limits up to $1,209,750. Limits are adjusted annually based on home prices.' },
      { question: 'When do I need PMI on a conventional loan?', answer: 'Private mortgage insurance (PMI) is typically required when your down payment is less than 20%. PMI protects the lender if you default and can be removed once you reach 20% equity.' },
      { question: 'What credit score do I need for a conventional loan?', answer: 'Most lenders require a minimum credit score of 620-640 for conventional loans. However, optimal rates typically require scores of 740 or higher. Requirements vary by lender.' },
      { question: 'What are conventional loan term options?', answer: 'Conventional loans are available in various terms including 10, 15, 20, 25, and 30 years. Shorter terms offer higher monthly payments but less total interest. Choose based on your budget and goals.' },
    ],
  },
  'jumbo-loan-calculator': {
    intro: `Our jumbo loan calculator helps estimate payments for mortgages exceeding conforming loan limits. Jumbo loans finance luxury homes and high-value properties in expensive real estate markets.`,
    faqs: [
      { question: 'What is considered a jumbo loan in 2026?', answer: 'Jumbo loans exceed the conforming loan limit of $806,500 for most areas. In high-cost markets, loans above $1,209,750 are considered jumbo. Exact thresholds vary by county.' },
      { question: 'What are jumbo loan interest rates?', answer: 'Jumbo loan rates are typically slightly higher than conforming rates due to increased lender risk. However, rates vary significantly by lender, loan size, and borrower qualifications.' },
      { question: 'What are jumbo loan requirements?', answer: 'Jumbo loans require stronger borrower profiles including higher credit scores (typically 700+), lower debt-to-income ratios (typically under 43%), and larger cash reserves (6-12 months of payments).' },
      { question: 'Can I get a fixed-rate jumbo loan?', answer: 'Yes, jumbo loans are available in both fixed-rate and adjustable-rate formats. Fixed-rate jumbos provide payment certainty, while ARMs may offer lower initial rates for shorter-term ownership.' },
    ],
  },
};

const bmiAudienceContent: Record<string, { intro: string; faqs: { question: string; answer: string }[] }> = {
  'bmi-calculator-men': {
    intro: `Our BMI calculator for men helps you understand your body mass index with insights tailored to male physiology. Men typically have more muscle mass and less body fat percentage compared to women at the same BMI, making gender-specific calculations valuable.`,
    faqs: [
      { question: 'Is BMI calculated differently for men?', answer: 'The basic BMI formula is the same for everyone. However, men generally have denser bones and more muscle mass, so a man and woman with the same BMI may have different body fat percentages.' },
      { question: 'What is a healthy BMI for men?', answer: 'For adult men, a BMI between 18.5 and 24.9 is considered healthy. However, athletes may have higher BMIs due to muscle mass. Consult a healthcare provider for personalized assessment.' },
      { question: 'How does muscle mass affect BMI for men?', answer: 'Because muscle weighs more than fat, muscular men may have elevated BMIs despite having low body fat. For athletes or those building muscle, body fat percentage or waist measurements may be more useful.' },
      { question: 'What waist size should men aim for?', answer: 'For men, a waist circumference under 40 inches (102 cm) is generally considered healthy. Waist size is a good indicator of abdominal fat and related health risks.' },
    ],
  },
  'bmi-calculator-women': {
    intro: `Our BMI calculator for women provides body mass index calculations with insights specific to female physiology. Women naturally have higher body fat percentages than men, and BMI categories may need context for athletes and those with different body compositions.`,
    faqs: [
      { question: 'Is BMI calculated differently for women?', answer: 'The BMI formula is identical for all adults. However, women typically carry more essential body fat (10-13% vs 2-5% for men), which affects health interpretations.' },
      { question: 'What is a healthy BMI for women?', answer: 'For adult women, a BMI between 18.5 and 24.9 is considered healthy. However, athletes may have healthy BMIs that appear underweight due to muscle mass. Pregnancy also affects BMI calculations.' },
      { question: 'How does menopause affect BMI?', answer: 'Menopause often leads to increased abdominal fat and metabolic changes. Women over 50 may have slightly higher healthy BMI ranges (25-27) compared to younger adults according to some research.' },
      { question: 'What waist size should women aim for?', answer: 'For women, a waist circumference under 35 inches (89 cm) is generally considered healthy. Waist measurements are particularly important for postmenopausal women.' },
    ],
  },
  'bmi-calculator-teenagers': {
    intro: `Our BMI calculator for teenagers helps assess body mass index using age and gender-specific percentiles. Unlike adult BMI, teen BMI is plotted on growth charts accounting for normal developmental changes during adolescence.`,
    faqs: [
      { question: 'How is teenage BMI different from adult BMI?', answer: 'Teen BMI uses percentile rankings based on age and gender, not absolute categories. A teen is compared to other teens of the same age and sex rather than using standard adult categories.' },
      { question: 'What BMI percentile is considered healthy for teens?', answer: 'Teens between the 5th and 85th percentile are generally considered a healthy weight. Below 5th percentile may indicate underweight, while above 85th suggests overweight and above 95th indicates obesity.' },
      { question: 'Why do teens need special BMI considerations?', answer: 'Teenagers undergo significant physical changes during puberty. Growth spurts, hormonal changes, and varying maturation rates mean BMI must be interpreted within the context of development.' },
      { question: 'Should teens be concerned about BMI?', answer: 'Rather than focusing on weight, teens should aim for healthy habits: regular physical activity, balanced nutrition, adequate sleep, and positive body image. Consult a pediatrician for personalized guidance.' },
    ],
  },
  'bmi-calculator-seniors': {
    intro: `Our BMI calculator for seniors provides body mass index insights tailored to adults over 65. Research suggests slightly higher BMI ranges may be healthier for older adults due to the protective effects of extra weight against certain health conditions.`,
    faqs: [
      { question: 'What is a healthy BMI for seniors?', answer: 'For adults over 65, a BMI between 25 and 27 is often considered optimal. Research indicates slightly higher BMIs may be protective against osteoporosis, infections, and other age-related conditions.' },
      { question: 'Why is BMI interpreted differently for seniors?', answer: 'As we age, body composition changes with muscle loss and bone density reduction. Some muscle loss (sarcopenia) is normal, but maintaining adequate nutrition and physical activity is crucial.' },
      { question: 'What other measurements matter for senior health?', answer: 'For seniors, waist circumference, grip strength, and functional assessments often provide more meaningful health indicators than BMI alone. Talk to your healthcare provider about comprehensive assessments.' },
      { question: 'How can seniors maintain healthy weight?', answer: 'Combine regular resistance exercise to maintain muscle mass with adequate protein intake (1.0-1.2g per kg body weight). Focus on nutrient-dense foods and stay physically active with activities you enjoy.' },
    ],
  },
};

export function getSpecializedContent(slug: string): {
  intro?: string;
  faqs?: { question: string; answer: string }[];
} | null {
  if (loanTypeContent[slug]) {
    return loanTypeContent[slug];
  }
  if (bmiAudienceContent[slug]) {
    return bmiAudienceContent[slug];
  }
  return null;
}
