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

// Loan Calculator
export interface LoanResult {
  payment: number;
  totalInterest: number;
  totalPayment: number;
  payoffDate: string;
}

export const calculateLoan = (
  loanAmount: number,
  annualRate: number,
  years: number,
  frequency: 'monthly' | 'biweekly' | 'weekly' = 'monthly'
): LoanResult => {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;

  let payment: number;
  if (monthlyRate === 0) {
    payment = loanAmount / numPayments;
  } else {
    payment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  // Adjust payment based on frequency
  let periodPayment: number;
  let totalPayments: number;
  switch (frequency) {
    case 'biweekly':
      periodPayment = payment / 2;
      totalPayments = numPayments * 26 / 12;
      break;
    case 'weekly':
      periodPayment = payment / 4.33;
      totalPayments = numPayments * 52 / 12;
      break;
    default:
      periodPayment = payment;
      totalPayments = numPayments;
  }

  const totalPayment = periodPayment * totalPayments;
  const totalInterest = totalPayment - loanAmount;

  // Calculate payoff date
  const payoffDate = new Date();
  if (frequency === 'biweekly') {
    payoffDate.setMonth(payoffDate.getMonth() + Math.round(totalPayments / 2));
  } else if (frequency === 'weekly') {
    payoffDate.setDate(payoffDate.getDate() + Math.round(totalPayments * 7));
  } else {
    payoffDate.setMonth(payoffDate.getMonth() + Math.round(totalPayments));
  }

  return {
    payment: periodPayment,
    totalInterest,
    totalPayment,
    payoffDate: payoffDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
  };
};

// APR Calculator
export interface APRResult {
  apr: number;
  monthlyPayment: number;
  totalCost: number;
  rateDifference: number;
}

export const calculateAPR = (
  loanAmount: number,
  nominalRate: number,
  years: number,
  fees: number = 0
): APRResult => {
  const monthlyRate = nominalRate / 100 / 12;
  const numPayments = years * 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / numPayments;
  } else {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }

  const effectiveLoanAmount = loanAmount + fees;
  const totalCost = monthlyPayment * numPayments;

  // Newton-Raphson to find APR
  let apr = nominalRate;
  for (let i = 0; i < 50; i++) {
    const monthlyApr = apr / 100 / 12;
    const computedPayment =
      (effectiveLoanAmount * monthlyApr * Math.pow(1 + monthlyApr, numPayments)) /
      (Math.pow(1 + monthlyApr, numPayments) - 1);
    const derivative =
      (computedPayment - monthlyPayment) / 0.01;
    if (Math.abs(derivative) < 1e-10) break;
    apr = apr - (computedPayment - monthlyPayment) / derivative * 0.5;
    if (apr < 0) apr = 0.01;
    if (apr > 100) apr = 100;
  }

  return {
    apr: Math.round(apr * 100) / 100,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    rateDifference: Math.round((apr - nominalRate) * 100) / 100,
  };
};

// Refinance Calculator
export interface RefinanceResult {
  currentPayment: number;
  newPayment: number;
  monthlySavings: number;
  breakEvenMonths: number;
  lifetimeSavings: number;
}

export const calculateRefinance = (
  currentBalance: number,
  currentRate: number,
  remainingYears: number,
  newRate: number,
  newTermYears: number,
  closingCosts: number
): RefinanceResult => {
  const currentMonthlyRate = currentRate / 100 / 12;
  const currentPayments = remainingYears * 12;

  const currentPayment =
    (currentBalance * currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentPayments)) /
    (Math.pow(1 + currentMonthlyRate, currentPayments) - 1);

  const newMonthlyRate = newRate / 100 / 12;
  const newPayments = newTermYears * 12;

  const newPayment =
    (currentBalance * newMonthlyRate * Math.pow(1 + newMonthlyRate, newPayments)) /
    (Math.pow(1 + newMonthlyRate, newPayments) - 1);

  const monthlySavings = currentPayment - newPayment;
  const breakEvenMonths = closingCosts > 0 && monthlySavings > 0
    ? Math.ceil(closingCosts / monthlySavings)
    : 0;

  const currentTotalCost = currentPayment * currentPayments;
  const newTotalCost = newPayment * newPayments + closingCosts;
  const lifetimeSavings = currentTotalCost - newTotalCost;

  return {
    currentPayment: Math.round(currentPayment * 100) / 100,
    newPayment: Math.round(newPayment * 100) / 100,
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    breakEvenMonths,
    lifetimeSavings: Math.round(lifetimeSavings * 100) / 100,
  };
};

// Interest Calculator
export interface InterestResult {
  interestEarned: number;
  finalBalance: number;
  effectiveGrowth: number;
}

export const calculateInterest = (
  principal: number,
  rate: number,
  years: number,
  type: 'simple' | 'compound' = 'compound',
  compoundFrequency: 'annually' | 'semiannually' | 'quarterly' | 'monthly' | 'daily' = 'annually'
): InterestResult => {
  const n = {
    annually: 1,
    semiannually: 2,
    quarterly: 4,
    monthly: 12,
    daily: 365,
  }[compoundFrequency];

  let finalBalance: number;
  let interestEarned: number;

  if (type === 'simple') {
    finalBalance = principal * (1 + (rate / 100) * years);
    interestEarned = finalBalance - principal;
  } else {
    finalBalance = principal * Math.pow(1 + (rate / 100) / n, n * years);
    interestEarned = finalBalance - principal;
  }

  const effectiveGrowth = ((finalBalance - principal) / principal) * 100;

  return {
    interestEarned: Math.round(interestEarned * 100) / 100,
    finalBalance: Math.round(finalBalance * 100) / 100,
    effectiveGrowth: Math.round(effectiveGrowth * 100) / 100,
  };
};

// Debt Payoff Calculator
export interface DebtPayoffResult {
  monthsToPayOff: number;
  totalInterest: number;
  totalPaid: number;
  timeSaved: number;
  interestSaved: number;
}

export const calculateDebtPayoff = (
  balance: number,
  rate: number,
  monthlyPayment: number,
  extraPayment: number = 0,
  useExtraPayment: boolean = true
): DebtPayoffResult => {
  const monthlyRate = rate / 100 / 12;
  const actualPayment = monthlyPayment + (useExtraPayment ? extraPayment : 0);

  if (actualPayment <= balance * monthlyRate) {
    return {
      monthsToPayOff: Infinity,
      totalInterest: Infinity,
      totalPaid: Infinity,
      timeSaved: 0,
      interestSaved: 0,
    };
  }

  // Calculate without extra payment for comparison
  let balanceWithoutExtra = balance;
  let monthsWithoutExtra = 0;
  let totalInterestWithoutExtra = 0;

  while (balanceWithoutExtra > 0) {
    const interest = balanceWithoutExtra * monthlyRate;
    const principal = monthlyPayment - interest;
    if (principal <= 0) break;
    balanceWithoutExtra = Math.max(0, balanceWithoutExtra - principal);
    totalInterestWithoutExtra += interest;
    monthsWithoutExtra++;
    if (monthsWithoutExtra > 1200) break;
  }

  // Calculate with extra payment
  let balanceWithExtra = balance;
  let monthsWithExtra = 0;
  let totalInterestWithExtra = 0;

  while (balanceWithExtra > 0) {
    const interest = balanceWithExtra * monthlyRate;
    const principal = actualPayment - interest;
    if (principal <= 0) break;
    balanceWithExtra = Math.max(0, balanceWithExtra - principal);
    totalInterestWithExtra += interest;
    monthsWithExtra++;
    if (monthsWithExtra > 1200) break;
  }

  const totalPaidWithExtra = monthsWithExtra === Infinity ? Infinity : balance + totalInterestWithExtra;

  return {
    monthsToPayOff: monthsWithExtra,
    totalInterest: Math.round(totalInterestWithExtra * 100) / 100,
    totalPaid: Math.round((balance + totalInterestWithExtra) * 100) / 100,
    timeSaved: monthsWithoutExtra === Infinity ? 0 : Math.max(0, monthsWithoutExtra - monthsWithExtra),
    interestSaved: Math.round((totalInterestWithoutExtra - totalInterestWithExtra) * 100) / 100,
  };
};

// BMR Calculator
export interface BMRResult {
  bmr: number;
  maintenanceCalories: number;
  weightLossCalories: number;
  weightGainCalories: number;
}

export const calculateBMR = (
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: 'male' | 'female',
  activityLevel: number // 1.2 to 1.9
): BMRResult => {
  // Mifflin-St Jeor Equation
  let bmr = 0;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  const maintenanceCalories = bmr * activityLevel;
  const weightLossCalories = maintenanceCalories - 500;
  const weightGainCalories = maintenanceCalories + 500;

  return {
    bmr,
    maintenanceCalories,
    weightLossCalories,
    weightGainCalories,
  };
};

// Body Fat Calculator
export interface BodyFatResult {
  bodyFat: number;
  leanMass: number;
  fatMass: number;
}

export const calculateBodyFat = (
  gender: 'male' | 'female',
  height: number, // cm
  neck: number, // cm
  waist: number, // cm
  hip?: number // cm, required for females
): BodyFatResult => {
  let bodyFat = 0;

  if (gender === 'male') {
    // US Navy method for men
    // Body Fat % = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    const waistNeck = waist - neck;
    bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waistNeck) + 0.15456 * Math.log10(height)) - 450;
  } else {
    // US Navy method for women
    // Body Fat % = 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
    if (!hip) {
      hip = waist; // Fallback if hip not provided
    }
    const waistHipNeck = waist + hip - neck;
    bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waistHipNeck) + 0.22100 * Math.log10(height)) - 450;
  }

  // Clamp body fat to reasonable range
  bodyFat = Math.max(2, Math.min(bodyFat, 60));

  // Calculate lean mass and fat mass (assuming weight around average for height)
  // We need weight - let's estimate from BMI 22 (middle of healthy range)
  const heightMeters = height / 100;
  const estimatedWeight = 22 * heightMeters * heightMeters; // BMI 22 baseline
  const leanMass = estimatedWeight * (1 - bodyFat / 100);
  const fatMass = estimatedWeight * (bodyFat / 100);

  return {
    bodyFat: Math.round(bodyFat * 10) / 10,
    leanMass: Math.round(leanMass * 10) / 10,
    fatMass: Math.round(fatMass * 10) / 10,
  };
};

// Protein Calculator
export interface ProteinResult {
  dailyProtein: number;
  minProtein: number;
  maxProtein: number;
  perMeal: number;
  breakfast: number;
  lunch: number;
  dinner: number;
  snacks: number;
}

export const calculateProtein = (
  weight: number, // kg
  goal: 'maintain' | 'fat-loss' | 'muscle-gain'
): ProteinResult => {
  const multipliers = {
    maintain: 1.6,
    'fat-loss': 2.0,
    'muscle-gain': 2.2,
  };

  const multiplier = multipliers[goal];
  const dailyProtein = weight * multiplier;
  const minProtein = Math.round(weight * 1.6);
  const maxProtein = Math.round(weight * 2.4);

  // Distribution: breakfast 25%, lunch 30%, dinner 30%, snacks 15%
  const breakfast = Math.round(dailyProtein * 0.25);
  const lunch = Math.round(dailyProtein * 0.30);
  const dinner = Math.round(dailyProtein * 0.30);
  const snacks = Math.round(dailyProtein * 0.15);

  return {
    dailyProtein: Math.round(dailyProtein),
    minProtein,
    maxProtein,
    perMeal: Math.round(dailyProtein / 4),
    breakfast,
    lunch,
    dinner,
    snacks,
  };
};

// Ideal Weight Calculator
export interface IdealWeightResult {
  devine: number;
  robinson: number;
  miller: number;
  rangeMin: number;
  rangeMax: number;
  bmiLow: number;
  bmiHigh: number;
}

export const calculateIdealWeight = (
  gender: 'male' | 'female',
  height: number, // cm
  _age: number
): IdealWeightResult => {
  const heightInches = height / 2.54;
  const heightCm = height - 152.4; // Devine formula uses (height - 152.4) in cm

  // Devine Formula (1974)
  // Men: 50 + 0.91 * (height_cm - 152.4)
  // Women: 45.5 + 0.91 * (height_cm - 152.4)
  const devineBase = gender === 'male' ? 50 : 45.5;
  const devine = devineBase + 0.91 * heightCm;

  // Robinson Formula (1983)
  // Men: 52 + 1.9 * (height_inches - 60)
  // Women: 49 + 1.7 * (height_inches - 60)
  const robinsonBase = gender === 'male' ? 52 : 49;
  const robinsonAdjust = gender === 'male' ? 1.9 : 1.7;
  const robinson = robinsonBase + robinsonAdjust * (heightInches - 60);

  // Miller Formula (1983)
  // Men: 56.2 + 1.41 * (height_inches - 60)
  // Women: 53.1 + 1.36 * (height_inches - 60)
  const millerBase = gender === 'male' ? 56.2 : 53.1;
  const millerAdjust = gender === 'male' ? 1.41 : 1.36;
  const miller = millerBase + millerAdjust * (heightInches - 60);

  // Calculate range as average ± 5%
  const avgWeight = (devine + robinson + miller) / 3;
  const rangeMin = avgWeight * 0.95;
  const rangeMax = avgWeight * 1.05;

  // BMI-based healthy weight range (BMI 18.5 - 24.9)
  const heightMeters = height / 100;
  const bmiLow = 18.5 * heightMeters * heightMeters;
  const bmiHigh = 24.9 * heightMeters * heightMeters;

  return {
    devine: Math.round(devine * 10) / 10,
    robinson: Math.round(robinson * 10) / 10,
    miller: Math.round(miller * 10) / 10,
    rangeMin: Math.round(rangeMin * 10) / 10,
    rangeMax: Math.round(rangeMax * 10) / 10,
    bmiLow: Math.round(bmiLow * 10) / 10,
    bmiHigh: Math.round(bmiHigh * 10) / 10,
  };
};

// Water Intake Calculator
export interface WaterIntakeResult {
  liters: number;
  cups: number;
  preWorkout: string;
  preWorkoutCups: number;
  duringWorkout: number;
  duringWorkoutCups: number;
  postWorkout: string;
  postWorkoutCups: number;
}

export const calculateWaterIntake = (
  weight: number, // kg
  activityLevel: 'sedentary' | 'moderate' | 'active' | 'very-active',
  climate: 'cool' | 'moderate' | 'hot'
): WaterIntakeResult => {
  // Base calculation: 30-35ml per kg of body weight
  const baseMl = weight * 33;

  // Activity level adjustments
  const activityMultipliers = {
    sedentary: 1.0,
    moderate: 1.15,
    active: 1.3,
    'very-active': 1.5,
  };

  // Climate adjustments
  const climateMultipliers = {
    cool: 0.9,
    moderate: 1.0,
    hot: 1.2,
  };

  const adjustedMl = baseMl * activityMultipliers[activityLevel] * climateMultipliers[climate];
  const liters = adjustedMl / 1000;
  const cups = adjustedMl / 236.588; // 1 US cup = 236.588 ml

  // Workout hydration (assuming 500ml baseline for 60min workout, scaled)
  const workoutFactor = weight / 70; // Normalize to 70kg person
  const preWorkout = Math.round((300 * workoutFactor) / 100) * 100;
  const preWorkoutCups = Math.round(preWorkout / 236.588);
  const duringWorkout = Math.round((500 * workoutFactor) / 100) * 100;
  const duringWorkoutCups = Math.round(duringWorkout / 236.588);
  const postWorkout = Math.round((400 * workoutFactor) / 100) * 100;
  const postWorkoutCups = Math.round(postWorkout / 236.588);

  return {
    liters: Math.round(liters * 10) / 10,
    cups: Math.round(cups),
    preWorkout: `${preWorkout}ml`,
    preWorkoutCups,
    duringWorkout,
    duringWorkoutCups,
    postWorkout: `${postWorkout}ml`,
    postWorkoutCups,
  };
};

// Wave1A Engine Functions

// DTI (Debt-to-Income) Calculator
export interface DTIResult {
  frontEndRatio: number;
  backEndRatio: number;
  frontEndStatus: string;
  backEndStatus: string;
  monthlyDebtPayments: number;
  housingPayment: number;
  grossMonthlyIncome: number;
  maxHousingPayment: number;
  maxTotalDebt: number;
}

export const calculateDTI = (
  grossAnnualIncome: number,
  housingPayment: number,
  otherDebts: number[]
): DTIResult => {
  const grossMonthlyIncome = grossAnnualIncome / 12;
  const monthlyDebtPayments = otherDebts.reduce((sum, debt) => sum + debt, 0);
  const totalMonthlyDebt = housingPayment + monthlyDebtPayments;

  // Front-end ratio: housing payment / gross income
  const frontEndRatio = grossMonthlyIncome > 0 ? (housingPayment / grossMonthlyIncome) * 100 : 0;

  // Back-end ratio: total debt / gross income
  const backEndRatio = grossMonthlyIncome > 0 ? (totalMonthlyDebt / grossMonthlyIncome) * 100 : 0;

  // Status thresholds
  let frontEndStatus: string;
  if (frontEndRatio <= 28) frontEndStatus = 'Excellent';
  else if (frontEndRatio <= 31) frontEndStatus = 'Good';
  else if (frontEndRatio <= 35) frontEndStatus = 'Acceptable';
  else frontEndStatus = 'High Risk';

  let backEndStatus: string;
  if (backEndRatio <= 36) backEndStatus = 'Excellent';
  else if (backEndRatio <= 43) backEndStatus = 'Good';
  else if (backEndRatio <= 50) backEndStatus = 'Acceptable';
  else backEndStatus = 'High Risk';

  // Maximum recommended payments
  const maxHousingPayment = grossMonthlyIncome * 0.28;
  const maxTotalDebt = grossMonthlyIncome * 0.36;

  return {
    frontEndRatio: Math.round(frontEndRatio * 100) / 100,
    backEndRatio: Math.round(backEndRatio * 100) / 100,
    frontEndStatus,
    backEndStatus,
    monthlyDebtPayments: Math.round(monthlyDebtPayments * 100) / 100,
    housingPayment: Math.round(housingPayment * 100) / 100,
    grossMonthlyIncome: Math.round(grossMonthlyIncome * 100) / 100,
    maxHousingPayment: Math.round(maxHousingPayment * 100) / 100,
    maxTotalDebt: Math.round(maxTotalDebt * 100) / 100,
  };
};

// Mortgage Affordability Calculator
export interface AffordabilityResult {
  maxHomePrice: number;
  maxLoanAmount: number;
  downPayment: number;
  downPaymentPercent: number;
  estimatedMonthlyPayment: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  totalMonthlyHousing: number;
}

export const calculateAffordability = (
  annualIncome: number,
  monthlyDebts: number,
  interestRate: number,
  loanTermYears: number,
  downPaymentPercent: number,
  propertyTaxRate: number,
  homeInsuranceAnnual: number
): AffordabilityResult => {
  const monthlyIncome = annualIncome / 12;

  // Using 28/36 rule
  const maxHousingRatio = 0.28;
  const maxDebtRatio = 0.36;

  // Maximum total debt payment (housing + other debts)
  const maxTotalDebt = monthlyIncome * maxDebtRatio;

  // Maximum housing payment
  const maxHousingPayment = maxTotalDebt - monthlyDebts;

  // Calculate loan amount from maximum payment using mortgage formula
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = loanTermYears * 12;

  let maxLoanAmount: number;
  if (monthlyRate === 0) {
    maxLoanAmount = maxHousingPayment * numPayments;
  } else {
    // Rearranging mortgage formula to solve for principal
    const paymentToIncomeRatio = maxHousingPayment / monthlyIncome;
    maxLoanAmount = maxHousingPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) /
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments));
  }

  // Adjust for down payment
  const downPaymentDecimal = downPaymentPercent / 100;
  const maxHomePrice = maxLoanAmount / (1 - downPaymentDecimal);
  const downPayment = maxHomePrice - maxLoanAmount;

  // Calculate monthly costs
  const monthlyPropertyTax = (maxHomePrice * propertyTaxRate / 100) / 12;
  const monthlyInsurance = homeInsuranceAnnual / 12;

  // PMI calculation (typically 0.5-1% of loan annually for < 20% down)
  let monthlyPMI = 0;
  if (downPaymentPercent < 20) {
    monthlyPMI = (maxLoanAmount * 0.008) / 12; // Assume 0.8% annual PMI
  }

  // Estimate principal & interest
  const estimatedMonthlyPayment = maxLoanAmount > 0 ?
    (() => {
      if (monthlyRate === 0) return maxLoanAmount / numPayments;
      return (maxLoanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);
    })() : 0;

  const totalMonthlyHousing = estimatedMonthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyPMI;

  return {
    maxHomePrice: Math.round(maxHomePrice),
    maxLoanAmount: Math.round(maxLoanAmount),
    downPayment: Math.round(downPayment),
    downPaymentPercent,
    estimatedMonthlyPayment: Math.round(estimatedMonthlyPayment * 100) / 100,
    monthlyPropertyTax: Math.round(monthlyPropertyTax * 100) / 100,
    monthlyInsurance: Math.round(monthlyInsurance * 100) / 100,
    monthlyPMI: Math.round(monthlyPMI * 100) / 100,
    totalMonthlyHousing: Math.round(totalMonthlyHousing * 100) / 100,
  };
};

// TDEE (Total Daily Energy Expenditure) Calculator
export interface TDEEResult {
  bmr: number;
  tdee: number;
  caloriesToLose: { mild: number; moderate: number; extreme: number }
  caloriesToGain: { mild: number; moderate: number }
  protein: number;
  fat: number;
  carbs: number;
  proteinMild: number; fatMild: number; carbsMild: number;
  proteinModerate: number; fatModerate: number; carbsModerate: number;
}

export const calculateTDEE = (
  weight: number, // kg
  height: number, // cm
  age: number,
  gender: 'male' | 'female',
  activityLevel: 1.2 | 1.375 | 1.55 | 1.725 | 1.9
): TDEEResult => {
  // Mifflin-St Jeor Equation for BMR
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // TDEE = BMR × Activity Multiplier
  const tdee = bmr * activityLevel;

  // Calorie targets
  const caloriesToLose = {
    mild: Math.round(tdee - 250),
    moderate: Math.round(tdee - 500),
    extreme: Math.round(tdee - 1000),
  };

  const caloriesToGain = {
    mild: Math.round(tdee + 250),
    moderate: Math.round(tdee + 500),
  };

  // Macro calculations (standard percentages)
  const protein = Math.round(weight * 2.0); // 2g per kg bodyweight
  const fat = Math.round((tdee * 0.25) / 9); // 25% of calories from fat
  const carbs = Math.round((tdee - (protein * 4) - (fat * 9)) / 4);

  // Mild deficit macros
  const proteinMild = Math.round(weight * 2.2);
  const fatMild = Math.round((caloriesToLose.mild * 0.25) / 9);
  const carbsMild = Math.round((caloriesToLose.mild - (proteinMild * 4) - (fatMild * 9)) / 4);

  // Moderate deficit macros
  const proteinModerate = Math.round(weight * 2.4);
  const fatModerate = Math.round((caloriesToLose.moderate * 0.25) / 9);
  const carbsModerate = Math.round((caloriesToLose.moderate - (proteinModerate * 4) - (fatModerate * 9)) / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    caloriesToLose,
    caloriesToGain,
    protein,
    fat,
    carbs,
    proteinMild,
    fatMild,
    carbsMild,
    proteinModerate,
    fatModerate,
    carbsModerate,
  };
};

// USPS Rate Calculator
export interface USPSRateResult {
  service: string;
  estimatedDays: string;
  cost: number;
  maxWeight: number;
  options: USPSServiceOption[];
}

export interface USPSServiceOption {
  service: string;
  estimatedDays: string;
  cost: number;
  maxWeight: number;
}

export const calculateUSPSRate = (
  weight: number, // oz
  zone: number, // 1-8
  packageType: 'envelope' | 'pak' | 'small_box' | 'medium_box' | 'large_box'
): USPSRateResult => {
  // USPS 2024 Rate Estimates (domestic)
  const weightLbs = weight / 16;
  const baseRates: Record<string, { min: number; max: number; maxOz: number }> = {
    'envelope': { min: 1.20, max: 3.50, maxOz: 16 },
    'pak': { min: 2.10, max: 4.50, maxOz: 16 },
    'small_box': { min: 3.50, max: 9.50, maxOz: 160 },
    'medium_box': { min: 5.00, max: 16.50, maxOz: 160 },
    'large_box': { min: 7.50, max: 24.00, maxOz: 160 },
  };

  const serviceLevels = [
    { name: 'USPS Ground Advantage', days: '2-5 days', baseCost: 3.50, perLb: 0.50, zoneAdjust: 0.02 },
    { name: 'USPS Priority Mail 3-Day', days: '1-3 days', baseCost: 8.50, perLb: 1.20, zoneAdjust: 0.05 },
    { name: 'USPS Priority Mail Express', days: '1-2 days', baseCost: 26.95, perLb: 0.50, zoneAdjust: 0.10 },
  ];

  const typeConfig = baseRates[packageType] || baseRates['small_box'];

  // Calculate rates for each service
  const options: USPSServiceOption[] = serviceLevels.map(service => {
    let cost = service.baseCost + (weightLbs * service.perLb) + (zone * service.zoneAdjust);
    // Add surcharge for larger packages
    if (packageType === 'large_box') cost += 3.00;
    else if (packageType === 'medium_box') cost += 1.50;

    return {
      service: service.name,
      estimatedDays: service.days,
      cost: Math.round(cost * 100) / 100,
      maxWeight: typeConfig.maxOz / 16,
    };
  });

  const primaryOption = options[0];

  return {
    service: primaryOption.service,
    estimatedDays: primaryOption.estimatedDays,
    cost: primaryOption.cost,
    maxWeight: primaryOption.maxWeight,
    options,
  };
};

// Timesheet Calculator
export interface TimesheetResult {
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  dailyBreakdown: { day: string; hours: number; pay: number }[];
}

export const calculateTimesheet = (
  hoursPerDay: number[],
  hourlyRate: number,
  overtimeThreshold: number, // hours per week before OT kicks in
  overtimeMultiplier: number, // 1.5 for time-and-a-half
  standardWorkWeek: number = 40
): TimesheetResult => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  let totalHours = 0;
  let regularHours = 0;
  let overtimeHours = 0;

  const dailyBreakdown = hoursPerDay.map((hours, index) => {
    totalHours += hours;
    return {
      day: days[index] || `Day ${index + 1}`,
      hours,
      pay: 0,
    };
  });

  // Calculate regular vs overtime
  if (totalHours > standardWorkWeek) {
    regularHours = standardWorkWeek;
    overtimeHours = totalHours - standardWorkWeek;
  } else {
    regularHours = totalHours;
    overtimeHours = 0;
  }

  // Calculate pay
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * hourlyRate * overtimeMultiplier;
  const totalPay = regularPay + overtimePay;

  // Update daily breakdown with pay
  let accumulatedHours = 0;
  dailyBreakdown.forEach(day => {
    let dayRegularHours = day.hours;
    let dayOvertimeHours = 0;

    const hoursOverThreshold = accumulatedHours + day.hours - standardWorkWeek;
    if (hoursOverThreshold > 0 && accumulatedHours < standardWorkWeek) {
      dayRegularHours = Math.min(day.hours, standardWorkWeek - accumulatedHours);
      dayOvertimeHours = day.hours - dayRegularHours;
    } else if (accumulatedHours >= standardWorkWeek) {
      dayRegularHours = 0;
      dayOvertimeHours = day.hours;
    }

    day.pay = dayRegularHours * hourlyRate + dayOvertimeHours * hourlyRate * overtimeMultiplier;
    accumulatedHours += day.hours;
  });

  return {
    regularHours: Math.round(regularHours * 100) / 100,
    overtimeHours: Math.round(overtimeHours * 100) / 100,
    totalHours: Math.round(totalHours * 100) / 100,
    regularPay: Math.round(regularPay * 100) / 100,
    overtimePay: Math.round(overtimePay * 100) / 100,
    totalPay: Math.round(totalPay * 100) / 100,
    dailyBreakdown,
  };
};

// Re-export shipping engines
export {
  calculateFreightClass,
  calculateShippingCost,
  calculateVolume,
  calculateChargeableWeight,
  calculatePallet,
  PALLET_CONFIGS,
  type FreightClassResult,
  type ShippingCostResult,
  type VolumeResult,
  type ChargeableWeightResult,
  type PalletResult,
  type DistanceZone,
  type ServiceLevel,
  type PackageType,
  type VolumeUnit,
  type ChargeableUnit,
  type DimFactor,
  type PalletType,
} from './shippingEngines';
