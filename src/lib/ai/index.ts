export interface AIInsight {
  riskLevel: 'Low' | 'Medium' | 'High';
  advice: string;
  suggestion: string;
}

export const generateMortgageInsight = (result: { monthlyPayment: number; totalPayment: number }, income: number): AIInsight => {
  const debtToIncome = (result.monthlyPayment / income) * 100;
  
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  if (debtToIncome > 40) {
    riskLevel = 'High';
    advice = 'Your monthly payment is significantly high compared to your income.';
    suggestion = 'Consider a longer loan term or a smaller loan amount to reduce risk.';
  } else if (debtToIncome > 28) {
    riskLevel = 'Medium';
    advice = 'Your monthly payment is within a moderate range but requires careful budgeting.';
    suggestion = 'Try to keep other debts low and maintain an emergency fund.';
  } else {
    riskLevel = 'Low';
    advice = 'Your monthly payment appears to be well within a safe affordability range.';
    suggestion = 'You might consider a shorter term to save on total interest if your budget allows.';
  }

  return { riskLevel, advice, suggestion };
};

export const generateBMIInsight = (bmi: number, status: string): AIInsight => {
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  if (status === 'Obese' || status === 'Underweight') {
    riskLevel = 'High';
    advice = `Your BMI indicates you are in the ${status} category.`;
    suggestion = 'We recommend consulting with a healthcare professional for a tailored health plan.';
  } else if (status === 'Overweight') {
    riskLevel = 'Medium';
    advice = 'You are slightly above the normal weight range.';
    suggestion = 'Increasing physical activity and monitoring calorie intake could help you reach a healthier range.';
  } else {
    riskLevel = 'Low';
    advice = 'Your weight is within the healthy range for your height.';
    suggestion = 'Maintain your current balanced diet and regular exercise routine.';
  }

  return { riskLevel, advice, suggestion };
};

export const generateAIInsight = (probability: number, classification: string): AIInsight => {
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  if (probability > 70) riskLevel = 'High';
  else if (probability > 40) riskLevel = 'Medium';

  return {
    riskLevel,
    advice: `The text is classified as ${classification} with ${probability}% probability.`,
    suggestion: probability > 50 ? 'Consider revising the text to include more personal anecdotes or varied sentence structures.' : 'The text shows strong human-like characteristics.'
  };
};

export const generateShippingInsight = (dimWeight: number, actualWeight: number): AIInsight => {
  const diff = dimWeight - actualWeight;
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  if (diff > 5) {
    riskLevel = 'High';
    advice = 'Dimensional weight is significantly higher than actual weight.';
    suggestion = 'Use smaller packaging or vacuum sealing if possible to reduce volume and shipping costs.';
  } else {
    riskLevel = 'Low';
    advice = 'Your packaging is efficient relative to its weight.';
    suggestion = 'Good job! Your dimensional weight is close to the actual weight.';
  }

  return { riskLevel, advice, suggestion };
};

export const generateAgeInsight = (years: number): AIInsight => {
  let advice = '';
  if (years < 18) advice = 'Youth is a time for learning and exploration.';
  else if (years < 65) advice = 'Focus on career growth and personal fulfillment.';
  else advice = 'A time for reflection and sharing wisdom.';

  return {
    riskLevel: 'Low',
    advice,
    suggestion: 'Keep track of important milestones and health checkups.'
  };
};

export const generateLoanInsight = (result: { payment: number; totalInterest: number; totalPayment: number }, income: number): AIInsight => {
  const monthlyPayment = result.payment;
  const debtToIncome = (monthlyPayment / income) * 100;

  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  if (debtToIncome > 40) {
    riskLevel = 'High';
    advice = 'Your loan payment is significantly high relative to your income.';
    suggestion = 'Consider a longer term or smaller loan amount to reduce monthly burden.';
  } else if (debtToIncome > 28) {
    riskLevel = 'Medium';
    advice = 'Your loan payment is within a moderate range. Budget carefully.';
    suggestion = 'Maintain an emergency fund to cover 3-6 months of payments.';
  } else {
    riskLevel = 'Low';
    advice = 'Your loan payment appears manageable relative to your income.';
    suggestion = 'Consider making extra payments to reduce total interest paid.';
  }

  return { riskLevel, advice, suggestion };
};

export const generateAPRInsight = (apr: number, nominalRate: number): AIInsight => {
  const diff = apr - nominalRate;
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  if (diff > 2) {
    riskLevel = 'High';
    advice = `The APR is ${diff.toFixed(2)}% higher than the nominal rate due to fees.`;
    suggestion = 'Negotiate fees or shop around for lenders with lower closing costs.';
  } else if (diff > 0.5) {
    riskLevel = 'Medium';
    advice = `APR includes ${diff.toFixed(2)}% in fees, which increases your effective cost.`;
    suggestion = 'Factor in these fees when comparing loan offers from different lenders.';
  } else {
    riskLevel = 'Low';
    advice = 'The APR closely matches the nominal rate, indicating low fees.';
    suggestion = 'This is a good offer. Ensure you understand all terms before proceeding.';
  }

  return { riskLevel, advice, suggestion };
};

export const generateRefinanceInsight = (result: { monthlySavings: number; breakEvenMonths: number; lifetimeSavings: number }): AIInsight => {
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  if (result.lifetimeSavings > 10000) {
    riskLevel = 'Low';
    advice = `You could save $${result.lifetimeSavings.toLocaleString()} over the life of the loan.`;
    suggestion = 'Refinancing makes sense if you plan to stay in your home beyond the break-even point.';
  } else if (result.lifetimeSavings > 0) {
    riskLevel = 'Medium';
    advice = `You will save $${result.monthlySavings.toFixed(2)} per month but check the break-even point.`;
    suggestion = `At ${result.breakEvenMonths} months to break even, ensure your plans align.`;
  } else {
    riskLevel = 'High';
    advice = 'Refinancing may not save you money. Review the terms carefully.';
    suggestion = 'Consider waiting for better rates or reducing the loan term instead.';
  }

  return { riskLevel, advice, suggestion };
};

export const generateInterestInsight = (result: { interestEarned: number; finalBalance: number; effectiveGrowth: number }, type: 'simple' | 'compound'): AIInsight => {
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  if (result.effectiveGrowth > 50) {
    riskLevel = 'Low';
    advice = `Your investment will grow by ${result.effectiveGrowth.toFixed(1)}% over the period.`;
    suggestion = 'Compound interest is working in your favor. Consider longer terms for more growth.';
  } else if (result.effectiveGrowth > 20) {
    riskLevel = 'Medium';
    advice = `Your balance will increase by $${result.interestEarned.toLocaleString()}.`;
    suggestion = type === 'compound' ? 'Compound frequency is helping your growth. Review compound frequency options.' : 'Consider compound interest for higher returns.';
  } else {
    riskLevel = 'Low';
    advice = `Interest earned: $${result.interestEarned.toLocaleString()}. Final balance: $${result.finalBalance.toLocaleString()}.`;
    suggestion = 'Review if this return meets your financial goals. Consider higher-rate alternatives.';
  }

  return { riskLevel, advice, suggestion };
};

export const generateDebtPayoffInsight = (result: { monthsToPayOff: number; interestSaved: number; timeSaved: number }): AIInsight => {
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  if (result.monthsToPayOff > 120) {
    riskLevel = 'High';
    advice = `At ${result.monthsToPayOff} months, this debt will take over 10 years to pay off.`;
    suggestion = 'Consider increasing your monthly payment to reduce total interest paid.';
  } else if (result.monthsToPayOff > 60) {
    riskLevel = 'Medium';
    advice = `Debt-free in ${result.monthsToPayOff} months with $${result.interestSaved.toLocaleString()} in interest saved.`;
    suggestion = 'Consistent extra payments will help you become debt-free faster.';
  } else {
    riskLevel = 'Low';
    advice = `Great progress! Debt-free in ${result.monthsToPayOff} months with $${result.interestSaved.toLocaleString()} saved.`;
    suggestion = 'Consider the debt snowball method to stay motivated with smaller balances first.';
  }

  return { riskLevel, advice, suggestion };
};

export interface PromptGeneratorResult {
  prompt: string;
  structure: string;
}

export const generatePromptInsight = (taskType: string, topic: string): AIInsight => {
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Medium';
  let advice = '';
  let suggestion = '';

  const taskTips: Record<string, string> = {
    Writing: 'Writing prompts work best with clear audience definition and specific output format requirements.',
    Coding: 'Coding prompts should include technical constraints, preferred languages, and expected functionality.',
    Marketing: 'Marketing prompts benefit from target audience specificity and clear campaign objectives.',
    SEO: 'SEO prompts should specify target keywords and content length requirements.',
    Business: 'Business prompts need clear context about the industry and decision criteria.',
    Learning: 'Learning prompts work best with defined current knowledge level and learning objectives.',
  };

  advice = taskTips[taskType] || 'A well-structured prompt includes role, task, context, and format specifications.';

  if (topic.length > 50) {
    suggestion = 'Your topic is detailed. Consider breaking it into sub-topics for more focused prompts.';
  } else if (topic.length < 20) {
    suggestion = 'Your topic is brief. Add more context for better prompt results.';
  } else {
    suggestion = 'Good topic specificity. Add examples or constraints for more targeted results.';
  }

  return { riskLevel, advice, suggestion };
};

export const generateAIHumanizerInsight = (tone: string, intensity: string, changeCount: number): AIInsight => {
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  if (intensity === 'Strong' && changeCount > 5) {
    riskLevel = 'Medium';
    advice = 'The text has been significantly humanized with multiple improvements.';
    suggestion = 'Review the changes to ensure the core message remains intact.';
  } else if (intensity === 'Light') {
    advice = 'Light humanization applied for subtle improvements.';
    suggestion = 'For more noticeable changes, try Medium or Strong intensity.';
  } else {
    advice = 'Your text has been balanced for natural flow and readability.';
    suggestion = 'Read aloud to check if the humanized version sounds natural.';
  }

  return { riskLevel, advice, suggestion };
};

export const generateImagePromptInsight = (style: string, subject: string): AIInsight => {
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  const styleTips: Record<string, string> = {
    Realistic: 'Realistic prompts benefit from specific lighting and environmental details.',
    Anime: 'Anime style works well with vibrant colors, expressive character details, and stylized backgrounds.',
    '3D Render': '3D renders should specify materials, textures, and render engine preferences.',
    'Product Photo': 'Product photos need clean backgrounds, specific angles, and lighting specifications.',
    Cinematic: 'Cinematic prompts benefit from atmosphere, color grading, and emotional tone descriptions.',
  };

  advice = styleTips[style] || 'Include as many specific details as possible for better image generation.';

  if (subject.length < 15) {
    suggestion = 'Consider adding more details about your subject for better results.';
  } else {
    suggestion = 'Your subject description is good. Add style and lighting for optimal results.';
  }

  return { riskLevel, advice, suggestion };
};

export const generateEmailInsight = (purpose: string, tone: string, callToAction: string): AIInsight => {
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  if (callToAction === 'None') {
    advice = 'No specific call-to-action was included in your email.';
    suggestion = 'Consider adding a clear call-to-action to improve email effectiveness.';
  } else {
    advice = `Your email includes a "${callToAction}" call-to-action.`;
    suggestion = 'Make sure your CTA is clear, specific, and easy to follow.';
  }

  if (tone === 'Urgent') {
    riskLevel = 'Medium';
    suggestion += ' Urgent tone can be effective but use sparingly to maintain credibility.';
  }

  return { riskLevel, advice, suggestion };
};

export const generateTitleInsight = (platform: string, topic: string): AIInsight => {
  let riskLevel: 'Low' | 'Medium' | 'High' = 'Low';
  let advice = '';
  let suggestion = '';

  const platformTips: Record<string, string> = {
    YouTube: 'YouTube titles with curiosity gaps, numbers, and personal experiences perform exceptionally well.',
    SEO: 'SEO titles should front-load keywords and promise comprehensive value.',
    Blog: 'Blog titles with "Ultimate Guide", numbers, or strong value propositions work best.',
    'Social Media': 'Social media titles should interrupt scrolling with curiosity or relatability.',
    'Product Page': 'Product titles should build trust and communicate unique value.',
  };

  advice = platformTips[platform] || 'Strong titles clearly communicate value while creating engagement.';

  if (topic.length > 40) {
    suggestion = 'Consider testing a shorter, punchier version of your topic for better performance.';
  } else {
    suggestion = 'Your topic is appropriately concise for title optimization.';
  }

  return { riskLevel, advice, suggestion };
};
