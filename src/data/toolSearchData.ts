import { allTools, ToolCategory } from './tools';

export interface SearchableTool {
  name: string;
  slug: string;
  description: string;
  route: string;
  category: ToolCategory;
  keywords: string[];
}

const KEYWORD_MAP: Record<string, string[]> = {
  // Finance
  'mortgage-calculator': ['home loan', 'mortgage payment', 'house loan', 'property loan', 'financing', 'amortization'],
  'loan-calculator': ['personal loan', 'monthly payment', 'borrow', 'credit', 'lending'],
  'apr-calculator': ['annual percentage rate', 'interest rate', 'credit card', 'loan cost'],
  'compound-interest-calculator': ['savings', 'investment growth', 'interest earned', 'compound'],
  'refinance-calculator': ['refinancing', 'loan refinance', 'rate refinance', 'mortgage refinance'],
  'interest-calculator': ['simple interest', 'loan interest', 'credit interest'],
  'debt-payoff-calculator': ['pay off debt', 'credit card payoff', 'debt free', 'snowball'],
  'roi-calculator': ['return on investment', 'investment return', 'profit', 'gain'],
  'investment-calculator': ['invest', 'portfolio', 'wealth', 'mutual fund', 'stocks'],
  'retirement-calculator': ['retirement savings', 'pension', '401k', 'ira'],
  '401k-calculator': ['401k', 'employer match', 'retirement', '401(k)'],
  'fire-calculator': ['financial independence', 'retire early', 'fire movement', 'savings rate'],
  'savings-goal-calculator': ['savings target', 'savings plan', 'emergency fund'],
  'personal-loan-calculator': ['personal loan', 'unsecured loan', 'borrow money'],
  'auto-loan-calculator': ['car loan', 'vehicle financing', 'auto financing'],
  'student-loan-calculator': ['college loan', 'education loan', 'student debt', 'grad school'],
  'loan-interest-calculator': ['total interest', 'interest cost', 'loan fees'],
  'sales-tax-calculator': ['sales tax', 'purchase tax', 'retail tax'],
  'income-tax-calculator': ['income tax', 'federal tax', 'tax return', 'w2'],
  'vat-calculator': ['vat', 'value added tax', 'european tax', 'gst'],
  'tax-refund-calculator': ['tax refund', 'tax return', 'tax owed', 'withholding'],
  'mortgage-affordability-calculator': ['afford', 'home affordability', 'budget home', 'qualify'],
  'dti-calculator': ['debt to income', 'dti ratio', 'lending', 'qualification'],
  'pmi-calculator': ['private mortgage insurance', 'pmi removal', 'equity'],
  'home-equity-calculator': ['home equity', 'heloc', 'cash out', 'equity loan'],
  'cd-rate-calculator': ['certificate of deposit', 'cd', 'bank interest', 'savings'],
  'savings-yield-calculator': ['apy', 'annual percentage yield', 'savings account'],

  // Health
  'bmi-calorie-calculator': ['bmi', 'body mass index', 'calories', 'weight management'],
  'calorie-calculator': ['calories', 'tdee', 'daily calories', 'nutrition'],
  'bmr-calculator': ['basal metabolic rate', 'metabolism', 'bmr'],
  'body-fat-calculator': ['body fat percentage', 'fat mass', 'lean body'],
  'protein-calculator': ['protein intake', 'daily protein', 'nutrition'],
  'ideal-weight-calculator': ['ideal weight', 'healthy weight', 'target weight'],
  'water-intake-calculator': ['water intake', 'hydration', 'daily water'],
  'lean-body-mass-calculator': ['lean mass', 'muscle mass', 'lbm'],
  'waist-to-hip-ratio-calculator': ['whr', 'body shape', 'fat distribution'],
  'waist-to-height-ratio-calculator': ['whr', 'obesity', 'body shape'],
  'ideal-body-fat-calculator': ['target body fat', 'healthy body fat'],
  'macro-calculator': ['macros', 'macronutrients', 'iifym', 'nutrition'],
  'maintenance-calorie-calculator': ['maintenance calories', 'tdee', 'weight maintenance'],
  'weight-loss-calorie-calculator': ['weight loss', 'fat loss', 'cutting'],
  'weight-gain-calorie-calculator': ['weight gain', 'bulking', 'muscle gain'],
  'protein-intake-calculator': ['protein intake', 'daily protein', 'bodybuilding'],
  'target-heart-rate-calculator': ['heart rate zones', 'cardio', 'exercise intensity'],
  'one-rep-max-calculator': ['1rm', 'strength', 'weightlifting', '1 rep max'],
  'running-pace-calculator': ['running', 'pace', 'jogging', '5k', 'marathon'],
  'vo2-max-calculator': ['vo2 max', 'cardiovascular fitness', 'aerobic capacity'],
  'calorie-burn-calculator': ['calories burned', 'exercise calories', 'workout'],
  'tdee-calculator': ['tdee', 'total daily energy expenditure', 'metabolism'],
  'caloric-deficit-calculator': ['deficit', 'cutting', 'weight loss diet'],
  'pregnancy-due-date-calculator': ['pregnancy', 'due date', 'baby', 'expecting'],
  'ovulation-calculator': ['ovulation', 'fertility', 'period', 'cycle'],

  // Time
  'age-calculator': ['age', 'birthday', 'how old'],
  'date-difference-calculator': ['date diff', 'days between', 'time span'],
  'business-days-calculator': ['business days', 'work days', 'weekdays'],
  'countdown-calculator': ['countdown', 'timer', 'days until'],
  'time-duration-calculator': ['duration', 'hours', 'minutes', 'elapsed time'],
  'age-at-date-calculator': ['future age', 'age at date'],
  'work-hours-calculator': ['work hours', 'labor', 'timesheet'],
  'timesheet-calculator': ['timesheet', 'clock in', 'clock out', 'payroll'],
  'pto-calculator': ['pto', 'paid time off', 'vacation days', 'leave'],
  'overtime-calculator': ['overtime', 'time and a half', 'double time', 'pay'],
  'deadline-calculator': ['deadline', 'due date', 'project management'],

  // AI
  'ai-detector': ['ai detector', 'chatgpt', 'gpt detector', 'plagiarism'],
  'prompt-generator': ['prompt', 'ai prompt', 'chatgpt prompt', 'writing'],
  'ai-humanizer': ['humanizer', 'ai humanizer', 'bypass ai', 'naturalize'],
  'image-prompt-generator': ['image prompt', 'midjourney', 'dall-e', 'stable diffusion'],
  'email-generator': ['email writer', 'cold email', 'email template'],
  'title-generator': ['title generator', 'headline', 'seo title'],
  'token-calculator': ['token', 'tokens', 'openai', 'anthropic'],
  'api-cost-calculator': ['api cost', 'openai', 'anthropic', 'gemini'],
  'inference-cost-calculator': ['inference', 'deployment', 'model serving'],
  'training-cost-calculator': ['training', 'ml training', 'ai training'],
  'claude-cost-calculator': ['claude', 'anthropic', 'opus', 'sonnet', 'haiku'],
  'context-window-calculator': ['context window', 'tokens', 'context length'],
  'embedding-cost-calculator': ['embedding', 'vector', 'rag', 'similarity'],
  'fine-tuning-cost-calculator': ['fine tuning', 'custom model', 'training'],
  'gpu-cost-calculator': ['gpu', 'nvidia', 'a100', 'h100', 'cloud gpu'],
  'gemini-cost-calculator': ['gemini', 'google ai', 'gemini pro'],
  'openai-cost-calculator': ['openai', 'gpt-4', 'gpt-3.5', 'api pricing'],
  'prompt-length-calculator': ['prompt length', 'characters', 'word count'],
  'rag-chunk-size-calculator': ['rag', 'chunking', 'retrieval', 'vector'],
  'token-to-word-calculator': ['token to word', 'word count', 'tokens'],
  'vector-storage-calculator': ['vector database', 'pinecone', 'weaviate', 'storage'],
  'word-to-token-calculator': ['word to token', 'token estimation'],
  'llm-comparison-calculator': ['llm comparison', 'compare ai', 'model comparison'],
  'context-length-cost-calculator': ['context length cost', 'long context'],

  // Shipping
  'dim-weight-calculator': ['dim weight', 'dimensional weight', 'shipping weight'],
  'freight-class-calculator': ['freight class', 'nmfc', 'freight shipping'],
  'shipping-cost-estimator': ['shipping cost', 'estimate shipping', 'rate'],
  'shipping-cost-calculator': ['shipping rate', 'carrier rates', 'compare shipping'],
  'package-volume-calculator': ['package volume', 'cubic inches', 'package size'],
  'chargeable-weight-calculator': ['chargeable weight', 'billable weight'],
  'pallet-calculator': ['pallet', 'loading', 'logistics', 'warehouse'],
  'fedex-dim-weight-calculator': ['fedex', 'fedex dim weight', 'fedex shipping'],
  'ups-dim-weight-calculator': ['ups', 'ups dim weight', 'ups shipping'],
  'shipping-volume-calculator': ['shipping volume', 'cubic feet', 'cubic meters'],
  'oversize-charge-calculator': ['oversize', 'overweight', 'shipping surcharge'],
  'freight-class-estimator': ['freight class', 'density', 'ltl'],
  'freight-density-calculator': ['freight density', 'density calculation'],
  'package-cubic-feet-calculator': ['cubic feet', 'package dimensions'],
  'dim-divisor-calculator': ['dim divisor', 'dimensional divisor'],
  'shipment-cost-estimator': ['shipment cost', 'freight cost'],
  'usps-rate-calculator': ['usps', 'usps rate', 'postal', 'mail'],
  'ups-rate-calculator': ['ups rate', 'ups ground', 'ups express'],
  'fedex-rate-calculator': ['fedex rate', 'fedex ground', 'fedex express'],
  'parcel-rate-calculator': ['parcel rate', 'parcel shipping'],
};

export const toolSearchData: SearchableTool[] = allTools.map(tool => ({
  name: tool.name,
  slug: tool.slug,
  description: tool.description,
  route: tool.route,
  category: tool.category,
  keywords: KEYWORD_MAP[tool.slug] || [],
}));

export function searchTools(query: string, limit = 8): SearchableTool[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);

  const scored = toolSearchData.map(tool => {
    let score = 0;
    const searchText = `${tool.name} ${tool.description} ${tool.keywords.join(' ')}`.toLowerCase();

    for (const term of queryTerms) {
      // Exact name match
      if (tool.name.toLowerCase() === normalizedQuery) {
        score += 100;
      }
      // Name starts with query
      else if (tool.name.toLowerCase().startsWith(normalizedQuery)) {
        score += 80;
      }
      // Name contains query
      else if (tool.name.toLowerCase().includes(normalizedQuery)) {
        score += 60;
      }

      // Exact keyword match
      if (tool.keywords.some(k => k.toLowerCase() === term)) {
        score += 40;
      }
      // Keyword contains term
      if (tool.keywords.some(k => k.toLowerCase().includes(term))) {
        score += 30;
      }

      // Description match
      if (tool.description.toLowerCase().includes(term)) {
        score += 20;
      }

      // General search text match
      if (searchText.includes(term)) {
        score += 10;
      }
    }

    return { tool, score };
  });

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ tool }) => tool);
}
