export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortization: AmortizationRow[];
}

export const calculateMortgage = (
  loanAmount: number,
  annualInterestRate: number,
  years: number
): MortgageResult => {
  const monthlyRate = annualInterestRate / 100 / 12;
  const numberOfPayments = years * 12;

  if (monthlyRate === 0) {
    const monthlyPayment = loanAmount / numberOfPayments;
    const amortization: AmortizationRow[] = [];
    let balance = loanAmount;
    for (let i = 1; i <= numberOfPayments; i++) {
      const principal = monthlyPayment;
      balance = Math.max(0, balance - principal);
      amortization.push({ month: i, payment: monthlyPayment, principal, interest: 0, balance });
    }
    return {
      monthlyPayment,
      totalInterest: 0,
      totalPayment: loanAmount,
      amortization,
    };
  }

  const monthlyPayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  const amortization: AmortizationRow[] = [];
  let balance = loanAmount;
  for (let i = 1; i <= numberOfPayments; i++) {
    const interest = balance * monthlyRate;
    const principal = monthlyPayment - interest;
    balance = Math.max(0, balance - principal);
    amortization.push({ month: i, payment: monthlyPayment, principal, interest, balance });
  }

  const totalPayment = monthlyPayment * numberOfPayments;
  const totalInterest = totalPayment - loanAmount;

  return {
    monthlyPayment,
    totalInterest,
    totalPayment,
    amortization,
  };
};

export interface BMIResult {
  bmi: number;
  status: string;
  calories: number;
}

export const calculateBMI = (
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: 'male' | 'female',
  activityLevel: number // 1.2 to 1.9
): BMIResult => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  let status = '';
  if (bmi < 18.5) status = 'Underweight';
  else if (bmi < 25) status = 'Normal';
  else if (bmi < 30) status = 'Overweight';
  else status = 'Obese';

  // BMR Calculation (Mifflin-St Jeor Equation)
  let bmr = 0;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const calories = bmr * activityLevel;

  return {
    bmi,
    status,
    calories,
  };
};

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export const calculateAge = (birthDate: Date, targetDate: Date = new Date()): AgeResult => {
  let years = targetDate.getFullYear() - birthDate.getFullYear();
  let months = targetDate.getMonth() - birthDate.getMonth();
  let days = targetDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((targetDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays };
};

export interface AIDetectorResult {
  aiProbability: number;
  classification: 'Human' | 'AI-like' | 'Mixed';
}

export const detectAI = (text: string): AIDetectorResult => {
  if (!text || text.length < 50) {
    return { aiProbability: 0, classification: 'Human' };
  }

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);

  // Feature 1: burstiness — sentence length variance
  const sentenceLengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / (sentenceLengths.length || 1);
  const variance = sentenceLengths.reduce((sum, l) => sum + (l - avgLen) ** 2, 0) / (sentenceLengths.length || 1);
  const burstinessScore = variance < 20 ? 25 : variance < 40 ? 10 : 0;

  // Feature 2: lexical diversity (TTR)
  const ttr = words.length > 0 ? new Set(words).size / words.length : 1;
  const ttrScore = ttr < 0.4 ? 20 : ttr < 0.5 ? 10 : 0;

  // Feature 3: AI marker phrases
  const aiPhrases = [
    'furthermore', 'moreover', 'in conclusion', 'consequently',
    'it is important to note', 'it is worth noting', 'in summary',
    'to summarize', 'additionally', 'therefore', 'thus', 'in other words',
  ];
  const phraseCount = aiPhrases.filter(p => text.toLowerCase().includes(p)).length;
  const phraseScore = Math.min(phraseCount * 8, 30);

  // Feature 4: average word length (AI tends toward longer formal words)
  const avgWordLen = words.length > 0 ? words.reduce((s, w) => s + w.length, 0) / words.length : 0;
  const wordLenScore = avgWordLen > 5.5 ? 15 : avgWordLen > 5.0 ? 8 : 0;

  // Feature 5: punctuation patterns
  const commaCount = (text.match(/,/g) || []).length;
  const semicolonCount = (text.match(/;/g) || []).length;
  const punctuationScore = semicolonCount > 2 ? 10 : semicolonCount > 0 ? 5 : 0;

  // Feature 6: passive voice indicators
  const passiveIndicators = [' was ', ' were ', ' been ', ' being ', ' is '];
  const passiveCount = passiveIndicators.reduce((c, p) => c + (text.toLowerCase().match(new RegExp(p, 'g')) || []).length, 0);
  const passiveScore = passiveCount > 5 ? 10 : 0;

  // Deterministic score — no randomness
  const total = Math.min(
    burstinessScore + ttrScore + phraseScore + wordLenScore + punctuationScore + passiveScore,
    100
  );

  let classification: 'Human' | 'AI-like' | 'Mixed';
  if (total < 30) classification = 'Human';
  else if (total < 65) classification = 'Mixed';
  else classification = 'AI-like';

  return { aiProbability: Math.round(total), classification };
};

export interface ShippingResult {
  dimWeight: number;
  actualWeight?: number;
  billableWeight: number;
}

export const calculateShipping = (
  length: number,
  width: number,
  height: number,
  actualWeight?: number,
  divisor: number = 139
): ShippingResult => {
  const dimWeight = (length * width * height) / divisor;
  const billableWeight = actualWeight ? Math.max(dimWeight, actualWeight) : dimWeight;

  return {
    dimWeight,
    actualWeight,
    billableWeight,
  };
};
