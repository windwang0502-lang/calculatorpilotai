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
