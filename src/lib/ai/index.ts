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
