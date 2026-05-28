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
