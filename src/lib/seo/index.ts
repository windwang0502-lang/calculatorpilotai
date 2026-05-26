export interface ToolExample {
  title: string;
  inputs: { label: string; value: string }[];
  result: string;
}

export interface SEOContent {
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  faqs: { question: string; answer: string }[];
  examples?: ToolExample[];
  lastUpdated?: string;
}

export const getSEOContent = (tool: string): SEOContent => {
  const contents: Record<string, SEOContent> = {
    mortgage: {
      title: 'Mortgage Calculator - AI-Powered Affordability Insights',
      description: 'Calculate your monthly mortgage payments, total interest, and get AI-driven affordability insights.',
      keywords: ['mortgage calculator', 'home loan', 'monthly payment', 'affordability', 'finance tool'],
      intro: 'Planning to buy a home? Our AI-powered mortgage calculator helps you estimate your monthly payments and provides expert insights into your financial readiness.',
      faqs: [
        { question: 'What is a mortgage calculator?', answer: 'A tool used to estimate the monthly payments on a home loan based on amount, interest, and term.' },
        { question: 'How is monthly payment calculated?', answer: 'It uses the principal loan amount, interest rate, and number of monthly payments.' },
        { question: 'What is included in total interest?', answer: 'The total amount you will pay to the lender over the life of the loan in addition to the principal.' },
        { question: 'Why use an AI mortgage calculator?', answer: 'It provides additional insights into risk levels and optimization suggestions that traditional calculators lack.' },
        { question: 'Can I change the interest rate?', answer: 'Yes, our calculator allows you to input any annual interest rate to see how it affects your payments.' }
      ],
      examples: [
        {
          title: 'First-Time Home Buyer in Texas',
          inputs: [
            { label: 'Home price', value: '$400,000' },
            { label: 'Down payment', value: '$80,000 (20%)' },
            { label: 'Loan amount', value: '$320,000' },
            { label: 'Interest rate', value: '6.5%' },
            { label: 'Loan term', value: '30 years' },
          ],
          result: 'Estimated monthly payment: $2,022.62 · Total interest: $408,143 · Total payment: $728,143',
        },
        {
          title: 'Refinancing a 15-Year Mortgage',
          inputs: [
            { label: 'Current loan balance', value: '$250,000' },
            { label: 'New interest rate', value: '5.75%' },
            { label: 'Loan term', value: '15 years' },
          ],
          result: 'Estimated monthly payment: $2,077.55 · Total interest: $123,959 · You save $200,000+ vs a 30-year loan',
        },
      ],
      lastUpdated: 'May 2026',
    },
    bmi: {
      title: 'BMI & Calorie Calculator - Health Status & AI Advice',
      description: 'Check your BMI and daily calorie needs. Get AI-driven health status classification and advice.',
      keywords: ['bmi calculator', 'calorie calculator', 'health status', 'weight management', 'fitness'],
      intro: 'Understand your body composition and nutritional needs with our integrated BMI and Calorie calculator, enhanced with AI health insights.',
      faqs: [
        { question: 'What is BMI?', answer: 'Body Mass Index is a measure of body fat based on height and weight.' },
        { question: 'How many calories do I need daily?', answer: 'It depends on your BMR and physical activity level.' },
        { question: 'Is BMI accurate for everyone?', answer: 'It is a general indicator but may not account for muscle mass in athletes.' },
        { question: 'What is BMR?', answer: 'Basal Metabolic Rate is the number of calories your body needs to function at rest.' },
        { question: 'How can I improve my BMI?', answer: 'Through a balanced diet and regular physical activity as suggested by our AI insights.' }
      ],
      examples: [
        {
          title: 'Average American Male',
          inputs: [
            { label: 'Weight', value: '198 lb (90 kg)' },
            { label: 'Height', value: "5'9\" (175 cm)" },
            { label: 'Age', value: '35' },
            { label: 'Gender', value: 'Male' },
            { label: 'Activity', value: 'Moderately active' },
          ],
          result: 'BMI: 29.4 (Overweight) · Daily calories: ~2,750 kcal · AI Insight: Consider reducing daily intake by 300-500 kcal and adding 30 min of cardio.',
        },
        {
          title: 'Active Female Runner',
          inputs: [
            { label: 'Weight', value: '132 lb (60 kg)' },
            { label: 'Height', value: "5'5\" (165 cm)" },
            { label: 'Age', value: '28' },
            { label: 'Gender', value: 'Female' },
            { label: 'Activity', value: 'Very active' },
          ],
          result: 'BMI: 22.0 (Normal) · Daily calories: ~2,400 kcal · AI Insight: Your BMI is in a healthy range. Maintain current activity level for optimal performance.',
        },
      ],
      lastUpdated: 'May 2026',
    },
    age: {
      title: 'Age Calculator - Date Difference & Milestones',
      description: 'Calculate your exact age or the difference between two dates. Discover life milestones with AI.',
      keywords: ['age calculator', 'date calculator', 'birthday', 'date difference', 'time tool'],
      intro: 'Need to know your exact age in days or months? Our precise age calculator provides comprehensive time breakdowns and AI life-stage insights.',
      faqs: [
        { question: 'How does the age calculator work?', answer: 'It calculates the span between your birthdate and the current or target date.' },
        { question: 'Can it calculate days between dates?', answer: 'Yes, it provides the total number of days between any two dates.' },
        { question: 'Is it leap year aware?', answer: 'Yes, our engine correctly accounts for leap years in all calculations.' },
        { question: 'Can I use it for countdowns?', answer: 'Absolutely, just set the target date to a future event.' },
        { question: 'Does it show months and days?', answer: 'Yes, it breaks down the age into years, months, and days for precision.' }
      ],
      examples: [
        {
          title: 'Born on July 4, 1990',
          inputs: [
            { label: 'Birth date', value: 'July 4, 1990' },
            { label: 'Target date', value: 'May 24, 2026' },
          ],
          result: 'Age: 35 years, 10 months, 20 days · Total days: 13,099 days · You have lived through 9 leap years.',
        },
        {
          title: 'Days Until Next Presidential Election',
          inputs: [
            { label: 'Start date', value: 'May 24, 2026' },
            { label: 'Target date', value: 'November 3, 2026' },
          ],
          result: 'Time remaining: 0 years, 5 months, 10 days · Total days: 163 days until Election Day.',
        },
      ],
      lastUpdated: 'May 2026',
    },
    ai: {
      title: 'AI Text Detector - Human vs AI Probability',
      description: 'Analyze text to determine the probability of it being AI-generated. Get AI-powered heuristic detection.',
      keywords: ['ai detector', 'human vs ai', 'gpt detector', 'text analysis', 'writing tool'],
      intro: 'Concerned about AI-generated content? Use our advanced detector to analyze writing patterns and determine the likelihood of AI involvement.',
      faqs: [
        { question: 'How does the AI detector work?', answer: 'It uses heuristic patterns like sentence length consistency and keyword usage to estimate AI probability.' },
        { question: 'Is the detection 100% accurate?', answer: 'No, it provides a probability based on writing style and patterns.' },
        { question: 'What is a "Mixed" classification?', answer: 'It indicates the text has characteristics of both human and AI writing.' },
        { question: 'Can it detect GPT-4?', answer: 'It can identify general AI writing patterns common across most large language models.' },
        { question: 'Why does sentence length matter?', answer: 'AI often produces sentences with less variation in length compared to natural human writing.' }
      ],
      examples: [
        {
          title: 'Academic Essay Sample',
          inputs: [
            { label: 'Text length', value: '350 words' },
            { label: 'Source', value: 'Student-submitted essay' },
          ],
          result: 'AI Probability: 72% (AI-like) · Detected features: Low lexical diversity (TTR 0.38), 8 AI marker phrases, high passive voice usage.',
        },
        {
          title: 'Personal Blog Post',
          inputs: [
            { label: 'Text length', value: '280 words' },
            { label: 'Source', value: 'Personal travel blog' },
          ],
          result: 'AI Probability: 18% (Human) · Detected features: High burstiness, varied sentence lengths, natural conversational tone.',
        },
      ],
      lastUpdated: 'May 2026',
    },
    shipping: {
      title: 'Shipping DIM Weight Calculator - Save on Freight',
      description: 'Calculate dimensional weight for shipping and optimize your packaging costs with AI insights.',
      keywords: ['shipping calculator', 'dim weight', 'volumetric weight', 'logistics', 'packaging'],
      intro: 'Avoid surprise shipping costs! Calculate your dimensional weight instantly and get AI suggestions for packaging optimization.',
      faqs: [
        { question: 'What is dimensional weight?', answer: 'A pricing technique for commercial freight transport which uses an estimated weight that is calculated from the length, width and height of a package.' },
        { question: 'How is DIM weight calculated?', answer: 'The formula is (Length x Width x Height) / Divisor (usually 139 for US shipping).' },
        { question: 'What is billable weight?', answer: 'The greater of the actual weight or the dimensional weight.' },
        { question: 'How can I lower shipping costs?', answer: 'By reducing the package volume to bring DIM weight closer to actual weight.' },
        { question: 'What divisor should I use?', answer: '139 is common for FedEx and UPS in the US; international may use 166 or 200.' }
      ],
      examples: [
        {
          title: 'E-Commerce Shoe Box',
          inputs: [
            { label: 'Length', value: '14 in' },
            { label: 'Width', value: '10 in' },
            { label: 'Height', value: '6 in' },
            { label: 'Actual weight', value: '3 lb' },
            { label: 'Divisor', value: '139 (US Standard)' },
          ],
          result: 'DIM Weight: 6.04 lb · Billable Weight: 6.04 lb · The carrier charges for DIM weight because the box is lightweight but bulky.',
        },
        {
          title: 'Small Electronics Shipment',
          inputs: [
            { label: 'Length', value: '8 in' },
            { label: 'Width', value: '6 in' },
            { label: 'Height', value: '4 in' },
            { label: 'Actual weight', value: '8 lb' },
            { label: 'Divisor', value: '139 (US Standard)' },
          ],
          result: 'DIM Weight: 1.38 lb · Billable Weight: 8.00 lb · The actual weight is higher, so you pay for actual weight. Good packaging!',
        },
      ],
      lastUpdated: 'May 2026',
    }
  };

  return contents[tool] || contents['mortgage'];
};

export const getRelatedTools = (category: string) => {
  const tools = [
    { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', category: 'finance' },
    { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', category: 'health' },
    { name: 'Age Calculator', path: '/tools/time/age-calculator', category: 'time' },
    { name: 'AI Detector', path: '/tools/ai/ai-detector', category: 'ai' },
    { name: 'Shipping Calculator', path: '/tools/shipping/dim-weight-calculator', category: 'shipping' },
  ];
  const sameCategory = tools.filter(t => t.category === category);
  const otherCategory = tools.filter(t => t.category !== category);
  return [...sameCategory, ...otherCategory].slice(0, 3);
};
