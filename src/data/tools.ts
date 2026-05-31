import { LucideIcon } from 'lucide-react';
import {
  CreditCard,
  Heart,
  Clock,
  Bot,
  Truck,
} from 'lucide-react';

export type ToolCategory = 'finance' | 'health' | 'shipping' | 'ai' | 'time';

export interface Tool {
  name: string;
  slug: string;
  category: ToolCategory;
  description: string;
  route: string;
  featured: boolean;
  popular: boolean;
  new: boolean;
  createdAt: string;
}

export interface Category {
  id: ToolCategory;
  name: string;
  path: string;
  icon: LucideIcon;
  description: string;
  tools: Tool[];
}

export const categories: Category[] = [
  {
    id: 'finance',
    name: 'Finance',
    path: '/tools/finance',
    icon: CreditCard,
    description: 'Mortgage calculators, interest analyzers, and financial planning tools.',
    tools: [
      { name: 'Mortgage Calculator', slug: 'mortgage-calculator', category: 'finance', description: 'Estimate your monthly mortgage payment, total interest, and total cost over the life of your loan.', route: '/tools/finance/mortgage-calculator', featured: true, popular: true, new: false, createdAt: '2024-01-01' },
      { name: 'Loan Calculator', slug: 'loan-calculator', category: 'finance', description: 'Calculate your loan monthly payment, total interest, and payoff date with flexible payment frequencies.', route: '/tools/finance/loan-calculator', featured: true, popular: true, new: false, createdAt: '2024-01-01' },
      { name: 'APR Calculator', slug: 'apr-calculator', category: 'finance', description: 'Calculate the Annual Percentage Rate (APR) for loans and credit cards.', route: '/tools/finance/apr-calculator', featured: false, popular: true, new: false, createdAt: '2024-01-01' },
      { name: 'Compound Interest Calculator', slug: 'compound-interest-calculator', category: 'finance', description: 'Calculate compound interest on savings or loans with customizable compounding periods.', route: '/tools/finance/compound-interest-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Refinance Calculator', slug: 'refinance-calculator', category: 'finance', description: 'Determine if refinancing your mortgage makes financial sense.', route: '/tools/finance/refinance-calculator', featured: false, popular: true, new: false, createdAt: '2024-01-01' },
      { name: 'Interest Calculator', slug: 'interest-calculator', category: 'finance', description: 'Calculate simple and compound interest for loans and investments.', route: '/tools/finance/interest-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Debt Payoff Calculator', slug: 'debt-payoff-calculator', category: 'finance', description: 'Create a debt payoff strategy and see how long until you are debt-free.', route: '/tools/finance/debt-payoff-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'ROI Calculator', slug: 'roi-calculator', category: 'finance', description: 'Calculate Return on Investment (ROI) and annualized returns to evaluate investment performance.', route: '/tools/finance/roi-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Investment Calculator', slug: 'investment-calculator', category: 'finance', description: 'Project future investment growth with compound interest and monthly contributions.', route: '/tools/finance/investment-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Retirement Calculator', slug: 'retirement-calculator', category: 'finance', description: 'Estimate retirement savings and monthly retirement income based on current contributions.', route: '/tools/finance/retirement-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-30' },
      { name: '401k Calculator', slug: '401k-calculator', category: 'finance', description: 'Calculate 401k growth with employer match and projected retirement balance.', route: '/tools/finance/401k-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'FIRE Calculator', slug: 'fire-calculator', category: 'finance', description: 'Calculate your FIRE number and monthly savings needed for financial independence.', route: '/tools/finance/fire-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Savings Goal Calculator', slug: 'savings-goal-calculator', category: 'finance', description: 'Determine monthly savings required to reach your financial goal by a target date.', route: '/tools/finance/savings-goal-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Personal Loan Calculator', slug: 'personal-loan-calculator', category: 'finance', description: 'Calculate personal loan monthly payments, total interest, and payoff timeline.', route: '/tools/finance/personal-loan-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Auto Loan Calculator', slug: 'auto-loan-calculator', category: 'finance', description: 'Estimate car loan payments including down payment, trade-in value, and interest costs.', route: '/tools/finance/auto-loan-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Student Loan Calculator', slug: 'student-loan-calculator', category: 'finance', description: 'Calculate student loan payments, total interest, and grace period impact.', route: '/tools/finance/student-loan-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Loan Interest Calculator', slug: 'loan-interest-calculator', category: 'finance', description: 'Analyze total loan interest costs and principal-to-interest breakdown over time.', route: '/tools/finance/loan-interest-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-30' },
      { name: 'Sales Tax Calculator', slug: 'sales-tax-calculator', category: 'finance', description: 'Calculate sales tax and total purchase cost using state or custom tax rates.', route: '/tools/finance/sales-tax-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Income Tax Calculator', slug: 'income-tax-calculator', category: 'finance', description: 'Estimate federal income tax liability using 2026 tax brackets and deductions.', route: '/tools/finance/income-tax-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'VAT Calculator', slug: 'vat-calculator', category: 'finance', description: 'Add or remove Value Added Tax (VAT) for international pricing calculations.', route: '/tools/finance/vat-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Tax Refund Calculator', slug: 'tax-refund-calculator', category: 'finance', description: 'Estimate tax refund or amount owed by comparing withholding and tax liability.', route: '/tools/finance/tax-refund-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Mortgage Affordability Calculator', slug: 'mortgage-affordability-calculator', category: 'finance', description: 'Calculate how much mortgage you can afford based on income, debts, and down payment.', route: '/tools/finance/mortgage-affordability-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'DTI Calculator', slug: 'dti-calculator', category: 'finance', description: 'Calculate your debt-to-income ratio for mortgage qualification and financial health.', route: '/tools/finance/dti-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'PMI Calculator', slug: 'pmi-calculator', category: 'finance', description: 'Estimate private mortgage insurance costs and when PMI drops off your loan.', route: '/tools/finance/pmi-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-31' },
      { name: 'Home Equity Calculator', slug: 'home-equity-calculator', category: 'finance', description: 'Calculate your home equity for HELOC or cash-out refinancing decisions.', route: '/tools/finance/home-equity-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'CD Rate Calculator', slug: 'cd-rate-calculator', category: 'finance', description: 'Calculate returns on certificates of deposit and compare CD rates.', route: '/tools/finance/cd-rate-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-31' },
      { name: 'Savings Yield Calculator', slug: 'savings-yield-calculator', category: 'finance', description: 'Calculate APY and interest earnings on savings accounts.', route: '/tools/finance/savings-yield-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-31' },
    ],
  },
  {
    id: 'health',
    name: 'Health',
    path: '/tools/health',
    icon: Heart,
    description: 'BMI, calorie, and body composition calculators with AI health insights.',
    tools: [
      { name: 'BMI & Calorie Calculator', slug: 'bmi-calorie-calculator', category: 'health', description: 'Calculate your Body Mass Index and daily caloric needs based on the scientifically validated Mifflin-St Jeor equation.', route: '/tools/health/bmi-calorie-calculator', featured: true, popular: true, new: false, createdAt: '2024-01-01' },
      { name: 'Calorie Calculator', slug: 'calorie-calculator', category: 'health', description: 'Calculate your daily calorie needs based on your age, gender, weight, height, and activity level.', route: '/tools/health/calorie-calculator', featured: false, popular: true, new: false, createdAt: '2024-01-01' },
      { name: 'BMR Calculator', slug: 'bmr-calculator', category: 'health', description: 'Calculate your Basal Metabolic Rate to understand how many calories your body burns at rest.', route: '/tools/health/bmr-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Body Fat Calculator', slug: 'body-fat-calculator', category: 'health', description: 'Estimate your body fat percentage using the US Navy circumference method.', route: '/tools/health/body-fat-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Protein Calculator', slug: 'protein-calculator', category: 'health', description: 'Calculate your optimal daily protein intake based on weight and fitness goals.', route: '/tools/health/protein-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Ideal Weight Calculator', slug: 'ideal-weight-calculator', category: 'health', description: 'Find your ideal body weight based on height, gender, and frame size.', route: '/tools/health/ideal-weight-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Water Intake Calculator', slug: 'water-intake-calculator', category: 'health', description: 'Calculate how much water you should drink daily based on your weight and activity level.', route: '/tools/health/water-intake-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Lean Body Mass Calculator', slug: 'lean-body-mass-calculator', category: 'health', description: 'Calculate your lean body mass by subtracting fat mass from total body weight.', route: '/tools/health/lean-body-mass-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Waist to Hip Ratio Calculator', slug: 'waist-to-hip-ratio-calculator', category: 'health', description: 'Calculate your waist-to-hip ratio to assess health risk based on fat distribution.', route: '/tools/health/waist-to-hip-ratio-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Waist to Height Ratio Calculator', slug: 'waist-to-height-ratio-calculator', category: 'health', description: 'Calculate your waist-to-height ratio to assess abdominal obesity.', route: '/tools/health/waist-to-height-ratio-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Ideal Body Fat Calculator', slug: 'ideal-body-fat-calculator', category: 'health', description: 'Determine your healthy body fat percentage range based on age and gender.', route: '/tools/health/ideal-body-fat-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-30' },
      { name: 'Macro Calculator', slug: 'macro-calculator', category: 'health', description: 'Calculate your optimal macronutrient breakdown for fitness goals.', route: '/tools/health/macro-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Maintenance Calorie Calculator', slug: 'maintenance-calorie-calculator', category: 'health', description: 'Calculate your daily maintenance calories based on BMR and activity level.', route: '/tools/health/maintenance-calorie-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Weight Loss Calorie Calculator', slug: 'weight-loss-calorie-calculator', category: 'health', description: 'Calculate optimal calories for sustainable fat loss with muscle preservation.', route: '/tools/health/weight-loss-calorie-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Weight Gain Calorie Calculator', slug: 'weight-gain-calorie-calculator', category: 'health', description: 'Calculate optimal calories for healthy muscle building and weight gain.', route: '/tools/health/weight-gain-calorie-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Protein Intake Calculator', slug: 'protein-intake-calculator', category: 'health', description: 'Calculate your optimal daily protein intake based on weight and fitness goals.', route: '/tools/health/protein-intake-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-30' },
      { name: 'Target Heart Rate Calculator', slug: 'target-heart-rate-calculator', category: 'health', description: 'Calculate your exercise heart rate zones for optimal fat burn and cardio benefits.', route: '/tools/health/target-heart-rate-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'One Rep Max Calculator', slug: 'one-rep-max-calculator', category: 'health', description: 'Estimate your one rep max strength using multiple validated formulas.', route: '/tools/health/one-rep-max-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Running Pace Calculator', slug: 'running-pace-calculator', category: 'health', description: 'Calculate your running pace, speed, and estimated race times.', route: '/tools/health/running-pace-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'VO2 Max Calculator', slug: 'vo2-max-calculator', category: 'health', description: 'Estimate your cardiovascular fitness using heart rate data.', route: '/tools/health/vo2-max-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'Calorie Burn Calculator', slug: 'calorie-burn-calculator', category: 'health', description: 'Calculate calories burned during various exercises and activities.', route: '/tools/health/calorie-burn-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-30' },
      { name: 'TDEE Calculator', slug: 'tdee-calculator', category: 'health', description: 'Calculate your Total Daily Energy Expenditure for effective nutrition planning.', route: '/tools/health/tdee-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Caloric Deficit Calculator', slug: 'caloric-deficit-calculator', category: 'health', description: 'Calculate how much to eat below maintenance for sustainable weight loss.', route: '/tools/health/caloric-deficit-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Pregnancy Due Date Calculator', slug: 'pregnancy-due-date-calculator', category: 'health', description: 'Calculate your estimated due date based on your cycle or conception date.', route: '/tools/health/pregnancy-due-date-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Ovulation Calculator', slug: 'ovulation-calculator', category: 'health', description: 'Calculate your fertility window and ovulation date for family planning.', route: '/tools/health/ovulation-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
    ],
  },
  {
    id: 'time',
    name: 'Time',
    path: '/tools/time',
    icon: Clock,
    description: 'Age calculators and date difference tools with precision accuracy.',
    tools: [
      { name: 'Age Calculator', slug: 'age-calculator', category: 'time', description: 'Calculate your exact age in years, months, and days from your birthdate with leap-year-aware precision.', route: '/tools/time/age-calculator', featured: true, popular: true, new: false, createdAt: '2024-01-01' },
      { name: 'Date Difference Calculator', slug: 'date-difference-calculator', category: 'time', description: 'Calculate the number of days, weeks, months, or years between any two dates.', route: '/tools/time/date-difference-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Business Days Calculator', slug: 'business-days-calculator', category: 'time', description: 'Calculate business days between dates excluding weekends and holidays.', route: '/tools/time/business-days-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Countdown Calculator', slug: 'countdown-calculator', category: 'time', description: 'Create countdowns to special dates, birthdays, holidays, or events.', route: '/tools/time/countdown-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Time Duration Calculator', slug: 'time-duration-calculator', category: 'time', description: 'Calculate the duration between two times with results in various units.', route: '/tools/time/time-duration-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Age At Date Calculator', slug: 'age-at-date-calculator', category: 'time', description: 'Calculate how old someone will be at a specific future date.', route: '/tools/time/age-at-date-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Work Hours Calculator', slug: 'work-hours-calculator', category: 'time', description: 'Calculate total work hours including overtime with break deductions.', route: '/tools/time/work-hours-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Timesheet Calculator', slug: 'timesheet-calculator', category: 'time', description: 'Calculate weekly timesheet hours including overtime and paycheck estimates.', route: '/tools/time/timesheet-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'PTO Calculator', slug: 'pto-calculator', category: 'time', description: 'Calculate PTO accrual rates and track your paid time off balance.', route: '/tools/time/pto-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-31' },
      { name: 'Overtime Calculator', slug: 'overtime-calculator', category: 'time', description: 'Calculate overtime pay including time-and-a-half and double-time rates.', route: '/tools/time/overtime-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Deadline Calculator', slug: 'deadline-calculator', category: 'time', description: 'Calculate project deadlines accounting for weekends and holidays.', route: '/tools/time/deadline-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-31' },
    ],
  },
  {
    id: 'ai',
    name: 'AI',
    path: '/tools/ai',
    icon: Bot,
    description: 'AI prompt generation, text humanization, image prompts, email and title generators.',
    tools: [
      { name: 'AI Text Detector', slug: 'ai-detector', category: 'ai', description: 'Analyze any text to estimate the probability of AI generation using deterministic heuristic features.', route: '/tools/ai/ai-detector', featured: true, popular: true, new: false, createdAt: '2024-01-01' },
      { name: 'Prompt Generator', slug: 'prompt-generator', category: 'ai', description: 'Generate effective prompts for AI text models with customizable parameters.', route: '/tools/ai/prompt-generator', featured: false, popular: true, new: false, createdAt: '2024-01-01' },
      { name: 'AI Humanizer', slug: 'ai-humanizer', category: 'ai', description: 'Transform AI-generated text to sound more natural and human-written.', route: '/tools/ai/ai-humanizer', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Image Prompt Generator', slug: 'image-prompt-generator', category: 'ai', description: 'Generate detailed prompts for AI image generators like Midjourney and DALL-E.', route: '/tools/ai/image-prompt-generator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Email Generator', slug: 'email-generator', category: 'ai', description: 'Generate professional emails with AI assistance for various purposes.', route: '/tools/ai/email-generator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Title Generator', slug: 'title-generator', category: 'ai', description: 'Generate catchy titles and headlines for blog posts, articles, and content.', route: '/tools/ai/title-generator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Token Calculator', slug: 'token-calculator', category: 'ai', description: 'Estimate tokens for AI prompts and calculate API costs for various AI models.', route: '/tools/ai/token-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'AI API Cost Calculator', slug: 'api-cost-calculator', category: 'ai', description: 'Calculate API costs across major AI providers including OpenAI, Anthropic, and Google.', route: '/tools/ai/api-cost-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'AI Inference Cost Calculator', slug: 'inference-cost-calculator', category: 'ai', description: 'Estimate inference costs for deploying AI models with different hardware configurations.', route: '/tools/ai/inference-cost-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'AI Training Cost Calculator', slug: 'training-cost-calculator', category: 'ai', description: 'Calculate the cost of training AI models based on dataset size and compute requirements.', route: '/tools/ai/training-cost-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Claude Cost Calculator', slug: 'claude-cost-calculator', category: 'ai', description: 'Calculate Claude API costs for different models, context windows, and usage volumes.', route: '/tools/ai/claude-cost-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Context Window Calculator', slug: 'context-window-calculator', category: 'ai', description: 'Calculate how much content fits within different AI model context windows.', route: '/tools/ai/context-window-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Embedding Cost Calculator', slug: 'embedding-cost-calculator', category: 'ai', description: 'Calculate the cost of generating text embeddings for RAG and semantic search.', route: '/tools/ai/embedding-cost-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Fine-Tuning Cost Calculator', slug: 'fine-tuning-cost-calculator', category: 'ai', description: 'Estimate the cost of fine-tuning AI models on custom datasets.', route: '/tools/ai/fine-tuning-cost-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-31' },
      { name: 'GPU Cost Calculator', slug: 'gpu-cost-calculator', category: 'ai', description: 'Calculate GPU costs for AI training and inference workloads.', route: '/tools/ai/gpu-cost-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Gemini Cost Calculator', slug: 'gemini-cost-calculator', category: 'ai', description: 'Calculate Google Gemini API costs for different models and usage patterns.', route: '/tools/ai/gemini-cost-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'OpenAI Cost Calculator', slug: 'openai-cost-calculator', category: 'ai', description: 'Calculate OpenAI API costs for GPT models with different token volumes.', route: '/tools/ai/openai-cost-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Prompt Length Calculator', slug: 'prompt-length-calculator', category: 'ai', description: 'Estimate the length of AI prompts in tokens and characters.', route: '/tools/ai/prompt-length-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-31' },
      { name: 'RAG Chunk Size Calculator', slug: 'rag-chunk-size-calculator', category: 'ai', description: 'Calculate optimal chunk sizes for Retrieval-Augmented Generation pipelines.', route: '/tools/ai/rag-chunk-size-calculator', featured: false, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Token to Word Calculator', slug: 'token-to-word-calculator', category: 'ai', description: 'Convert token counts to approximate word counts for AI text processing.', route: '/tools/ai/token-to-word-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-31' },
      { name: 'Vector DB Storage Calculator', slug: 'vector-storage-calculator', category: 'ai', description: 'Calculate storage requirements for vector databases in AI applications.', route: '/tools/ai/vector-storage-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-31' },
      { name: 'Word to Token Calculator', slug: 'word-to-token-calculator', category: 'ai', description: 'Convert word counts to approximate token counts for AI API pricing.', route: '/tools/ai/word-to-token-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-31' },
      { name: 'LLM Comparison Calculator', slug: 'llm-comparison-calculator', category: 'ai', description: 'Compare cost and performance of different LLM models side by side.', route: '/tools/ai/llm-comparison-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Context Length Cost Calculator', slug: 'context-length-cost-calculator', category: 'ai', description: 'Calculate costs for processing different context lengths in AI models.', route: '/tools/ai/context-length-cost-calculator', featured: false, popular: false, new: true, createdAt: '2026-05-31' },
    ],
  },
  {
    id: 'shipping',
    name: 'Shipping',
    path: '/tools/shipping',
    icon: Truck,
    description: 'Dimensional weight and billable weight calculators for logistics.',
    tools: [
      { name: 'DIM Weight Calculator', slug: 'dim-weight-calculator', category: 'shipping', description: 'Determine whether your package will be billed by actual weight or dimensional weight.', route: '/tools/shipping/dim-weight-calculator', featured: true, popular: true, new: false, createdAt: '2024-01-01' },
      { name: 'Freight Class Calculator', slug: 'freight-class-calculator', category: 'shipping', description: 'Calculate freight class based on density and freight characteristics.', route: '/tools/shipping/freight-class-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Shipping Cost Estimator', slug: 'shipping-cost-estimator', category: 'shipping', description: 'Estimate shipping costs across major carriers with AI-powered insights.', route: '/tools/shipping/shipping-cost-estimator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Package Volume Calculator', slug: 'package-volume-calculator', category: 'shipping', description: 'Calculate package volume in cubic inches, feet, and meters.', route: '/tools/shipping/package-volume-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Chargeable Weight Calculator', slug: 'chargeable-weight-calculator', category: 'shipping', description: 'Calculate chargeable weight for air and ocean freight shipments.', route: '/tools/shipping/chargeable-weight-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Pallet Calculator', slug: 'pallet-calculator', category: 'shipping', description: 'Calculate how many boxes fit on a pallet and plan optimal arrangements.', route: '/tools/shipping/pallet-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Shipping Cost Calculator', slug: 'shipping-cost-calculator', category: 'shipping', description: 'Compare shipping rates across major carriers for your packages.', route: '/tools/shipping/shipping-cost-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'FedEx DIM Weight Calculator', slug: 'fedex-dim-weight-calculator', category: 'shipping', description: 'Calculate FedEx-specific dimensional weight using their divisors.', route: '/tools/shipping/fedex-dim-weight-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'UPS DIM Weight Calculator', slug: 'ups-dim-weight-calculator', category: 'shipping', description: 'Calculate UPS-specific dimensional weight using their divisors.', route: '/tools/shipping/ups-dim-weight-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Shipping Volume Calculator', slug: 'shipping-volume-calculator', category: 'shipping', description: 'Calculate shipping volume in cubic inches, feet, and meters.', route: '/tools/shipping/shipping-volume-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Oversize Charge Calculator', slug: 'oversize-charge-calculator', category: 'shipping', description: 'Check if your package qualifies as oversize and estimate surcharges.', route: '/tools/shipping/oversize-charge-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Freight Class Estimator', slug: 'freight-class-estimator', category: 'shipping', description: 'Estimate freight class from shipment density for LTL planning.', route: '/tools/shipping/freight-class-estimator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Freight Density Calculator', slug: 'freight-density-calculator', category: 'shipping', description: 'Calculate freight density to determine appropriate freight class.', route: '/tools/shipping/freight-density-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Package Cubic Feet Calculator', slug: 'package-cubic-feet-calculator', category: 'shipping', description: 'Convert package dimensions to cubic feet for freight calculations.', route: '/tools/shipping/package-cubic-feet-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'DIM Divisor Calculator', slug: 'dim-divisor-calculator', category: 'shipping', description: 'Calculate dimensional weight using different carrier DIM divisors.', route: '/tools/shipping/dim-divisor-calculator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'Shipment Cost Estimator', slug: 'shipment-cost-estimator', category: 'shipping', description: 'Estimate shipping cost range by weight, dimensions, and service type.', route: '/tools/shipping/shipment-cost-estimator', featured: false, popular: false, new: false, createdAt: '2024-01-01' },
      { name: 'USPS Rate Calculator', slug: 'usps-rate-calculator', category: 'shipping', description: 'Calculate USPS shipping rates for Priority Mail, First Class, and other services.', route: '/tools/shipping/usps-rate-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'UPS Rate Calculator', slug: 'ups-rate-calculator', category: 'shipping', description: 'Calculate UPS shipping rates for Ground, 3 Day Select, and Express services.', route: '/tools/shipping/ups-rate-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'FedEx Rate Calculator', slug: 'fedex-rate-calculator', category: 'shipping', description: 'Calculate FedEx shipping rates for Ground, Express, and Overnight services.', route: '/tools/shipping/fedex-rate-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
      { name: 'Parcel Rate Calculator', slug: 'parcel-rate-calculator', category: 'shipping', description: 'Compare parcel shipping rates across all major carriers.', route: '/tools/shipping/parcel-rate-calculator', featured: true, popular: true, new: true, createdAt: '2026-05-31' },
    ],
  },
];

// Flatten all tools for easy lookup
export const allTools: Tool[] = categories.flatMap(cat => cat.tools);

// Helper functions
export function getToolBySlug(slug: string): Tool | undefined {
  return allTools.find(tool => tool.slug === slug);
}

export function getToolByRoute(route: string): Tool | undefined {
  return allTools.find(tool => tool.route === route);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return allTools.filter(tool => tool.category === category);
}

export function getFeaturedTools(): Tool[] {
  return allTools.filter(tool => tool.featured);
}

export function getPopularTools(): Tool[] {
  return allTools.filter(tool => tool.popular);
}

export function getNewTools(): Tool[] {
  return allTools.filter(tool => tool.new);
}

export function getRecentlyAddedTools(limit = 5): Tool[] {
  return [...allTools]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getRelatedTools(tool: Tool, limit = 4): Tool[] {
  const sameCategory = getToolsByCategory(tool.category).filter(t => t.slug !== tool.slug);

  // If same category has enough tools, only use same category
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  // Fill remaining slots from other categories, prioritizing by popularity and keyword similarity
  const otherCategories = allTools.filter(t => t.category !== tool.category && t.slug !== tool.slug);

  // Extract keywords from tool name for matching
  const toolKeywords = tool.name.toLowerCase().split(/[\s\-]+/);

  // Score other tools by relevance
  const scored = otherCategories.map(t => {
    let score = t.popular ? 2 : 0; // Prioritize popular tools
    const toolNameLower = t.name.toLowerCase();
    for (const keyword of toolKeywords) {
      if (toolNameLower.includes(keyword)) {
        score += 1;
      }
    }
    return { tool: t, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const fillers = scored.slice(0, limit - sameCategory.length).map(s => s.tool);

  return [...sameCategory, ...fillers].slice(0, limit);
}

export function getCategoryById(id: ToolCategory): Category | undefined {
  return categories.find(cat => cat.id === id);
}

export function getCategoryByPath(path: string): Category | undefined {
  return categories.find(cat => cat.path === path);
}

export function getToolStats() {
  return {
    totalTools: allTools.length,
    byCategory: categories.reduce((acc, cat) => {
      acc[cat.id] = cat.tools.length;
      return acc;
    }, {} as Record<ToolCategory, number>),
    featured: getFeaturedTools().length,
    popular: getPopularTools().length,
    new: getNewTools().length,
  };
}
