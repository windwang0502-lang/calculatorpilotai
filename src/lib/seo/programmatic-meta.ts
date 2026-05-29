import type { SEOPageConfig, SEOCategory, SEOPageType } from '@/data/seo';

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

export function generateProgrammaticFAQ(config: SEOPageConfig): { question: string; answer: string }[] {
  const { category, keyword } = config;
  return categoryFAQs[category](keyword);
}

interface OpenGraphData {
  title: string;
  description: string;
  type: string;
  url: string;
  siteName: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface BaseStructuredData {
  '@context': string;
  '@type': string;
}

interface WebPageSchema extends BaseStructuredData {
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  isPartOf?: {
    '@type': 'WebSite';
    name: string;
    url: string;
  };
  breadcrumb?: {
    '@type': 'BreadcrumbList';
    itemListElement: {
      '@type': 'ListItem';
      position: number;
      name: string;
      item: string;
    }[];
  };
}

interface FAQPageSchema extends BaseStructuredData {
  '@type': 'FAQPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }[];
}

interface SoftwareApplicationSchema extends BaseStructuredData {
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
}

interface ItemListSchema extends BaseStructuredData {
  '@type': 'ItemList';
  name: string;
  description: string;
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
  }[];
}

const BASE_URL = 'https://www.calculatorpilotai.com';

const categoryLabels: Record<SEOCategory, string> = {
  finance: 'Finance',
  health: 'Health',
  shipping: 'Shipping',
  ai: 'AI',
  time: 'Time',
};

const pageTypeSuffixes: Record<SEOPageType, string> = {
  calculator: '| Free Online Calculator',
  guide: 'Guide (2026)',
  compare: 'Comparison',
};

const applicationCategories: Record<SEOCategory, string> = {
  finance: 'FinanceApplication',
  health: 'HealthApplication',
  shipping: 'BusinessApplication',
  ai: 'DeveloperApplication',
  time: 'UtilityApplication',
};

export function generateProgrammaticTitle(config: SEOPageConfig): string {
  const suffix = pageTypeSuffixes[config.pageType];
  return `${config.keyword} ${suffix}`;
}

export function generateProgrammaticDescription(config: SEOPageConfig): string {
  const descriptions: Record<SEOCategory, string> = {
    finance: `${config.description} Use our free calculator to get accurate estimates for your financial planning decisions.`,
    health: `${config.description} Track your health metrics with our free, easy-to-use calculator. For informational purposes only.`,
    shipping: `${config.description} Get instant shipping rate estimates with our free calculator. Compare carriers and save on shipping costs.`,
    ai: `${config.description} Estimate AI costs and usage with our free calculator. Make informed decisions about AI tools and services.`,
    time: `${config.description} Calculate time-related values instantly with our free calculator. Simple, accurate, and easy to use.`,
  };

  const base = descriptions[config.category];
  if (base.length > 160) {
    return base.substring(0, 157) + '...';
  }
  return base;
}

export function generateProgrammaticCanonical(config: SEOPageConfig): string {
  return `${BASE_URL}/tools/${config.category}/${config.slug}`;
}

export function generateProgrammaticKeywords(config: SEOPageConfig): string[] {
  const baseKeywords = [config.keyword, categoryLabels[config.category]];

  const pageTypeKeywords: Record<SEOPageType, string[]> = {
    calculator: ['calculator', 'calculate', 'free calculator', 'online calculator'],
    guide: ['guide', 'tutorial', 'how to', 'learn'],
    compare: ['compare', 'comparison', 'vs', 'versus'],
  };

  return [...new Set([...baseKeywords, ...pageTypeKeywords[config.pageType]])];
}

export function generateProgrammaticOpenGraph(config: SEOPageConfig): OpenGraphData {
  return {
    title: generateProgrammaticTitle(config),
    description: generateProgrammaticDescription(config),
    type: 'website',
    url: generateProgrammaticCanonical(config),
    siteName: 'CalculatorPilot AI',
  };
}

export function generateBreadcrumbSchema(config: SEOPageConfig): WebPageSchema['breadcrumb'] {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${BASE_URL}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryLabels[config.category],
        item: `${BASE_URL}/tools/${config.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: config.keyword,
        item: generateProgrammaticCanonical(config),
      },
    ],
  };
}

export function generateWebPageSchema(config: SEOPageConfig): WebPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: generateProgrammaticTitle(config),
    description: generateProgrammaticDescription(config),
    url: generateProgrammaticCanonical(config),
    isPartOf: {
      '@type': 'WebSite',
      name: 'CalculatorPilot AI',
      url: BASE_URL,
    },
    breadcrumb: generateBreadcrumbSchema(config),
  };
}

export function generateFAQSchema(config: SEOPageConfig, faqs: FAQItem[]): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateSoftwareApplicationSchema(config: SEOPageConfig): SoftwareApplicationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: generateProgrammaticTitle(config),
    description: generateProgrammaticDescription(config),
    applicationCategory: applicationCategories[config.category],
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function generateItemListSchema(config: SEOPageConfig): ItemListSchema {
  const relatedItems = [
    ...(config.relatedTools || []),
    ...(config.relatedGuides || []),
    ...(config.relatedCompare || []),
  ].slice(0, 10);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Related ${categoryLabels[config.category]} Tools`,
    description: `A list of related ${categoryLabels[config.category]} calculators, guides, and comparisons.`,
    itemListElement: relatedItems.map((name, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: name,
    })),
  };
}

export function generateAllStructuredData(config: SEOPageConfig, faqs: FAQItem[]) {
  const schemas: (WebPageSchema | FAQPageSchema | SoftwareApplicationSchema | ItemListSchema)[] = [];

  schemas.push(generateWebPageSchema(config));

  if (faqs.length > 0) {
    schemas.push(generateFAQSchema(config, faqs));
  }

  if (config.pageType === 'calculator') {
    schemas.push(generateSoftwareApplicationSchema(config));
  }

  if (config.relatedTools?.length || config.relatedGuides?.length || config.relatedCompare?.length) {
    schemas.push(generateItemListSchema(config));
  }

  return schemas;
}

export function generateDisclaimer(config: SEOPageConfig): string | null {
  if (config.category === 'health') {
    return 'This calculator is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.';
  }

  if (config.category === 'finance') {
    return 'This calculator provides estimates for informational purposes only. Results are not financial advice. Consult a qualified financial advisor for important decisions.';
  }

  return null;
}

export function generateAllSEOData(config: SEOPageConfig, faqs: FAQItem[]) {
  return {
    title: generateProgrammaticTitle(config),
    description: generateProgrammaticDescription(config),
    canonical: generateProgrammaticCanonical(config),
    keywords: generateProgrammaticKeywords(config),
    openGraph: generateProgrammaticOpenGraph(config),
    structuredData: generateAllStructuredData(config, faqs),
    disclaimer: generateDisclaimer(config),
  };
}
