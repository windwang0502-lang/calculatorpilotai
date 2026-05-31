import React, { Suspense } from 'react';
import type { ReactNode } from 'react';

const Home = React.lazy(() => import('./pages/Home'));
const MortgageCalculator = React.lazy(() => import('./pages/tools/finance/MortgageCalculator'));
const LoanCalculator = React.lazy(() => import('./pages/tools/finance/LoanCalculator'));
const APRCalculator = React.lazy(() => import('./pages/tools/finance/APRCalculator'));
const RefinanceCalculator = React.lazy(() => import('./pages/tools/finance/RefinanceCalculator'));
const InterestCalculator = React.lazy(() => import('./pages/tools/finance/InterestCalculator'));
const CompoundInterestCalculator = React.lazy(() => import('./pages/tools/finance/CompoundInterestCalculator'));
const DebtPayoffCalculator = React.lazy(() => import('./pages/tools/finance/DebtPayoffCalculator'));
const ROICalculator = React.lazy(() => import('./pages/tools/finance/ROICalculator'));
const InvestmentCalculator = React.lazy(() => import('./pages/tools/finance/InvestmentCalculator'));
const RetirementCalculator = React.lazy(() => import('./pages/tools/finance/RetirementCalculator'));
const FourOhOneKCalculator = React.lazy(() => import('./pages/tools/finance/FourOhOneKCalculator'));
const FIRECalculator = React.lazy(() => import('./pages/tools/finance/FIRECalculator'));
const SavingsGoalCalculator = React.lazy(() => import('./pages/tools/finance/SavingsGoalCalculator'));
const PersonalLoanCalculator = React.lazy(() => import('./pages/tools/finance/PersonalLoanCalculator'));
const AutoLoanCalculator = React.lazy(() => import('./pages/tools/finance/AutoLoanCalculator'));
const StudentLoanCalculator = React.lazy(() => import('./pages/tools/finance/StudentLoanCalculator'));
const LoanInterestCalculator = React.lazy(() => import('./pages/tools/finance/LoanInterestCalculator'));
const SalesTaxCalculator = React.lazy(() => import('./pages/tools/finance/SalesTaxCalculator'));
const IncomeTaxCalculator = React.lazy(() => import('./pages/tools/finance/IncomeTaxCalculator'));
const VATCalculator = React.lazy(() => import('./pages/tools/finance/VATCalculator'));
const TaxRefundCalculator = React.lazy(() => import('./pages/tools/finance/TaxRefundCalculator'));
const BMICalculator = React.lazy(() => import('./pages/tools/health/BMICalculator'));
const BMRCalculator = React.lazy(() => import('./pages/tools/health/BMRCalculator'));
const BodyFatCalculator = React.lazy(() => import('./pages/tools/health/BodyFatCalculator'));
const ProteinCalculator = React.lazy(() => import('./pages/tools/health/ProteinCalculator'));
const IdealWeightCalculator = React.lazy(() => import('./pages/tools/health/IdealWeightCalculator'));
const WaterIntakeCalculator = React.lazy(() => import('./pages/tools/health/WaterIntakeCalculator'));
const AgeCalculator = React.lazy(() => import('./pages/tools/time/AgeCalculator'));
const DateDifferenceCalculator = React.lazy(() => import('./pages/tools/time/DateDifferenceCalculator'));
const BusinessDaysCalculator = React.lazy(() => import('./pages/tools/time/BusinessDaysCalculator'));
const CountdownCalculator = React.lazy(() => import('./pages/tools/time/CountdownCalculator'));
const TimeDurationCalculator = React.lazy(() => import('./pages/tools/time/TimeDurationCalculator'));
const AgeAtDateCalculator = React.lazy(() => import('./pages/tools/time/AgeAtDateCalculator'));
const WorkHoursCalculator = React.lazy(() => import('./pages/tools/time/WorkHoursCalculator'));
const TimesheetCalculator = React.lazy(() => import('./pages/tools/time/TimesheetCalculator'));
const DTICalculator = React.lazy(() => import('./pages/tools/finance/DTICalculator'));
const MortgageAffordabilityCalculator = React.lazy(() => import('./pages/tools/finance/MortgageAffordabilityCalculator'));
const TDEECalculator = React.lazy(() => import('./pages/tools/health/TDEECalculator'));
const USPSRateCalculator = React.lazy(() => import('./pages/tools/shipping/USPSRateCalculator'));
const LLMComparisonCalculator = React.lazy(() => import('./pages/tools/ai/LLMComparisonCalculator'));
const AIDetector = React.lazy(() => import('./pages/tools/ai/AIDetector'));
const PromptGenerator = React.lazy(() => import('./pages/tools/ai/PromptGenerator'));
const AIHumanizer = React.lazy(() => import('./pages/tools/ai/AIHumanizer'));
const ImagePromptGenerator = React.lazy(() => import('./pages/tools/ai/ImagePromptGenerator'));
const EmailGenerator = React.lazy(() => import('./pages/tools/ai/EmailGenerator'));
const TitleGenerator = React.lazy(() => import('./pages/tools/ai/TitleGenerator'));
const TokenCalculator = React.lazy(() => import('./pages/tools/ai/TokenCalculator'));
const AIAPICostCalculator = React.lazy(() => import('./pages/tools/ai/AIAPICostCalculator'));
const AIInferenceCostCalculator = React.lazy(() => import('./pages/tools/ai/AIInferenceCostCalculator'));
const AITrainingCostCalculator = React.lazy(() => import('./pages/tools/ai/AITrainingCostCalculator'));
const ClaudeCostCalculator = React.lazy(() => import('./pages/tools/ai/ClaudeCostCalculator'));
const ContextWindowCalculator = React.lazy(() => import('./pages/tools/ai/ContextWindowCalculator'));
const EmbeddingCostCalculator = React.lazy(() => import('./pages/tools/ai/EmbeddingCostCalculator'));
const FineTuningCostCalculator = React.lazy(() => import('./pages/tools/ai/FineTuningCostCalculator'));
const GPUCostCalculator = React.lazy(() => import('./pages/tools/ai/GPUCostCalculator'));
const GeminiCostCalculator = React.lazy(() => import('./pages/tools/ai/GeminiCostCalculator'));
const OpenAICostCalculator = React.lazy(() => import('./pages/tools/ai/OpenAICostCalculator'));
const PromptLengthCalculator = React.lazy(() => import('./pages/tools/ai/PromptLengthCalculator'));
const RAGChunkSizeCalculator = React.lazy(() => import('./pages/tools/ai/RAGChunkSizeCalculator'));
const TokenToWordCalculator = React.lazy(() => import('./pages/tools/ai/TokenToWordCalculator'));
const VectorDatabaseStorageCalculator = React.lazy(() => import('./pages/tools/ai/VectorDatabaseStorageCalculator'));
const WordToTokenCalculator = React.lazy(() => import('./pages/tools/ai/WordToTokenCalculator'));
const CalorieCalculator = React.lazy(() => import('./pages/tools/health/CalorieCalculator'));
const LeanBodyMassCalculator = React.lazy(() => import('./pages/tools/health/LeanBodyMassCalculator'));
const WaistToHipRatioCalculator = React.lazy(() => import('./pages/tools/health/WaistToHipRatioCalculator'));
const WaistToHeightRatioCalculator = React.lazy(() => import('./pages/tools/health/WaistToHeightRatioCalculator'));
const IdealBodyFatCalculator = React.lazy(() => import('./pages/tools/health/IdealBodyFatCalculator'));
const MacroCalculator = React.lazy(() => import('./pages/tools/health/MacroCalculator'));
const MaintenanceCalorieCalculator = React.lazy(() => import('./pages/tools/health/MaintenanceCalorieCalculator'));
const WeightLossCalorieCalculator = React.lazy(() => import('./pages/tools/health/WeightLossCalorieCalculator'));
const WeightGainCalorieCalculator = React.lazy(() => import('./pages/tools/health/WeightGainCalorieCalculator'));
const ProteinIntakeCalculator = React.lazy(() => import('./pages/tools/health/ProteinIntakeCalculator'));
const TargetHeartRateCalculator = React.lazy(() => import('./pages/tools/health/TargetHeartRateCalculator'));
const OneRepMaxCalculator = React.lazy(() => import('./pages/tools/health/OneRepMaxCalculator'));
const RunningPaceCalculator = React.lazy(() => import('./pages/tools/health/RunningPaceCalculator'));
const VO2MaxCalculator = React.lazy(() => import('./pages/tools/health/VO2MaxCalculator'));
const CalorieBurnCalculator = React.lazy(() => import('./pages/tools/health/CalorieBurnCalculator'));
const DimWeightCalculator = React.lazy(() => import('./pages/tools/shipping/DimWeightCalculator'));
const FreightClassCalculator = React.lazy(() => import('./pages/tools/shipping/FreightClassCalculator'));
const ShippingCostEstimator = React.lazy(() => import('./pages/tools/shipping/ShippingCostEstimator'));
const ShippingCostCalculator = React.lazy(() => import('./pages/tools/shipping/ShippingCostCalculator'));
const PackageVolumeCalculator = React.lazy(() => import('./pages/tools/shipping/PackageVolumeCalculator'));
const ChargeableWeightCalculator = React.lazy(() => import('./pages/tools/shipping/ChargeableWeightCalculator'));
const PalletCalculator = React.lazy(() => import('./pages/tools/shipping/PalletCalculator'));
const FedExDimWeightCalculator = React.lazy(() => import('./pages/tools/shipping/FedExDimWeightCalculator'));
const UPSDimWeightCalculator = React.lazy(() => import('./pages/tools/shipping/UPSDimWeightCalculator'));
const ShippingVolumeCalculator = React.lazy(() => import('./pages/tools/shipping/ShippingVolumeCalculator'));
const FreightDensityCalculator = React.lazy(() => import('./pages/tools/shipping/FreightDensityCalculator'));
const PackageCubicFeetCalculator = React.lazy(() => import('./pages/tools/shipping/PackageCubicFeetCalculator'));
const DimDivisorCalculator = React.lazy(() => import('./pages/tools/shipping/DimDivisorCalculator'));
const OversizeChargeCalculator = React.lazy(() => import('./pages/tools/shipping/OversizeChargeCalculator'));
const FreightClassEstimator = React.lazy(() => import('./pages/tools/shipping/FreightClassEstimator'));
const ShipmentCostEstimator = React.lazy(() => import('./pages/tools/shipping/ShipmentCostEstimator'));
const AllTools = React.lazy(() => import('./pages/tools/AllTools'));
const FinanceCategoryPage = React.lazy(() => import('./pages/tools/finance/FinanceCategoryPage'));
const HealthCategoryPage = React.lazy(() => import('./pages/tools/health/HealthCategoryPage'));
const ShippingCategoryPage = React.lazy(() => import('./pages/tools/shipping/ShippingCategoryPage'));
const TimeCategoryPage = React.lazy(() => import('./pages/tools/time/TimeCategoryPage'));
const AICategoryPage = React.lazy(() => import('./pages/tools/ai/AICategoryPage'));
const CategoryPage = React.lazy(() => import('./pages/tools/CategoryPage'));
const Guides = React.lazy(() => import('./pages/guides/Guides'));
const GuideDetailPage = React.lazy(() => import('./pages/guides/GuideDetailPage'));
const Compare = React.lazy(() => import('./pages/compare/Compare'));
const CompareDetailPage = React.lazy(() => import('./pages/compare/CompareDetailPage'));
const AboutPage = React.lazy(() => import('./pages/About'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsPage = React.lazy(() => import('./pages/Terms'));
const ContactPage = React.lazy(() => import('./pages/Contact'));
const AIDisclosurePage = React.lazy(() => import('./pages/AIDisclosure'));
const EditorialPolicyPage = React.lazy(() => import('./pages/EditorialPolicy'));
const DisclaimerPage = React.lazy(() => import('./pages/Disclaimer'));
const OurMissionPage = React.lazy(() => import('./pages/OurMission'));
const ProgrammaticToolPage = React.lazy(() => import('./pages/tools/ProgrammaticToolPage'));
const MortgageByStateHub = React.lazy(() => import('./pages/finance-guides/MortgageByStateHub'));
const FinanceGuidesHub = React.lazy(() => import('./pages/finance-guides/FinanceGuidesHub'));
const HealthGuidesHub = React.lazy(() => import('./pages/health-guides/HealthGuidesHub'));
const HtmlSitemap = React.lazy(() => import('./pages/HtmlSitemap'));
const PopularCalculatorsPage = React.lazy(() => import('./pages/PopularCalculatorsPage'));
const CalculatorsPage = React.lazy(() => import('./pages/CalculatorsPage'));

const LazyWrap = (Component: React.LazyExoticComponent<React.FC>) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>}>
    <Component />
  </Suspense>
);

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  public?: boolean;
}

export const routes: RouteConfig[] = [
  { name: 'Home', path: '/', element: LazyWrap(Home), public: true },
  { name: 'Mortgage Calculator', path: '/tools/finance/mortgage-calculator', element: LazyWrap(MortgageCalculator), public: true },
  { name: 'Loan Calculator', path: '/tools/finance/loan-calculator', element: LazyWrap(LoanCalculator), public: true },
  { name: 'APR Calculator', path: '/tools/finance/apr-calculator', element: LazyWrap(APRCalculator), public: true },
  { name: 'Refinance Calculator', path: '/tools/finance/refinance-calculator', element: LazyWrap(RefinanceCalculator), public: true },
  { name: 'Interest Calculator', path: '/tools/finance/interest-calculator', element: LazyWrap(InterestCalculator), public: true },
  { name: 'Compound Interest Calculator', path: '/tools/finance/compound-interest-calculator', element: LazyWrap(CompoundInterestCalculator), public: true },
  { name: 'Debt Payoff Calculator', path: '/tools/finance/debt-payoff-calculator', element: LazyWrap(DebtPayoffCalculator), public: true },
  { name: 'ROI Calculator', path: '/tools/finance/roi-calculator', element: LazyWrap(ROICalculator), public: true },
  { name: 'Investment Calculator', path: '/tools/finance/investment-calculator', element: LazyWrap(InvestmentCalculator), public: true },
  { name: 'Retirement Calculator', path: '/tools/finance/retirement-calculator', element: LazyWrap(RetirementCalculator), public: true },
  { name: '401k Calculator', path: '/tools/finance/401k-calculator', element: LazyWrap(FourOhOneKCalculator), public: true },
  { name: 'FIRE Calculator', path: '/tools/finance/fire-calculator', element: LazyWrap(FIRECalculator), public: true },
  { name: 'Savings Goal Calculator', path: '/tools/finance/savings-goal-calculator', element: LazyWrap(SavingsGoalCalculator), public: true },
  { name: 'Personal Loan Calculator', path: '/tools/finance/personal-loan-calculator', element: LazyWrap(PersonalLoanCalculator), public: true },
  { name: 'Auto Loan Calculator', path: '/tools/finance/auto-loan-calculator', element: LazyWrap(AutoLoanCalculator), public: true },
  { name: 'Student Loan Calculator', path: '/tools/finance/student-loan-calculator', element: LazyWrap(StudentLoanCalculator), public: true },
  { name: 'Loan Interest Calculator', path: '/tools/finance/loan-interest-calculator', element: LazyWrap(LoanInterestCalculator), public: true },
  { name: 'Sales Tax Calculator', path: '/tools/finance/sales-tax-calculator', element: LazyWrap(SalesTaxCalculator), public: true },
  { name: 'Income Tax Calculator', path: '/tools/finance/income-tax-calculator', element: LazyWrap(IncomeTaxCalculator), public: true },
  { name: 'VAT Calculator', path: '/tools/finance/vat-calculator', element: LazyWrap(VATCalculator), public: true },
  { name: 'Tax Refund Calculator', path: '/tools/finance/tax-refund-calculator', element: LazyWrap(TaxRefundCalculator), public: true },
  { name: 'BMI Calculator', path: '/tools/health/bmi-calorie-calculator', element: LazyWrap(BMICalculator), public: true },
  { name: 'BMR Calculator', path: '/tools/health/bmr-calculator', element: LazyWrap(BMRCalculator), public: true },
  { name: 'Body Fat Calculator', path: '/tools/health/body-fat-calculator', element: LazyWrap(BodyFatCalculator), public: true },
  { name: 'Protein Calculator', path: '/tools/health/protein-calculator', element: LazyWrap(ProteinCalculator), public: true },
  { name: 'Ideal Weight Calculator', path: '/tools/health/ideal-weight-calculator', element: LazyWrap(IdealWeightCalculator), public: true },
  { name: 'Water Intake Calculator', path: '/tools/health/water-intake-calculator', element: LazyWrap(WaterIntakeCalculator), public: true },
  { name: 'Age Calculator', path: '/tools/time/age-calculator', element: LazyWrap(AgeCalculator), public: true },
  { name: 'Date Difference Calculator', path: '/tools/time/date-difference-calculator', element: LazyWrap(DateDifferenceCalculator), public: true },
  { name: 'Business Days Calculator', path: '/tools/time/business-days-calculator', element: LazyWrap(BusinessDaysCalculator), public: true },
  { name: 'Countdown Calculator', path: '/tools/time/countdown-calculator', element: LazyWrap(CountdownCalculator), public: true },
  { name: 'Time Duration Calculator', path: '/tools/time/time-duration-calculator', element: LazyWrap(TimeDurationCalculator), public: true },
  { name: 'Age At Date Calculator', path: '/tools/time/age-at-date-calculator', element: LazyWrap(AgeAtDateCalculator), public: true },
  { name: 'Work Hours Calculator', path: '/tools/time/work-hours-calculator', element: LazyWrap(WorkHoursCalculator), public: true },
  { name: 'Timesheet Calculator', path: '/tools/time/timesheet-calculator', element: LazyWrap(TimesheetCalculator), public: true },
  { name: 'DTI Calculator', path: '/tools/finance/dti-calculator', element: LazyWrap(DTICalculator), public: true },
  { name: 'Mortgage Affordability Calculator', path: '/tools/finance/mortgage-affordability-calculator', element: LazyWrap(MortgageAffordabilityCalculator), public: true },
  { name: 'TDEE Calculator', path: '/tools/health/tdee-calculator', element: LazyWrap(TDEECalculator), public: true },
  { name: 'USPS Rate Calculator', path: '/tools/shipping/usps-rate-calculator', element: LazyWrap(USPSRateCalculator), public: true },
  { name: 'LLM Comparison Calculator', path: '/tools/ai/llm-comparison-calculator', element: LazyWrap(LLMComparisonCalculator), public: true },
  { name: 'AI Detector', path: '/tools/ai/ai-detector', element: LazyWrap(AIDetector), public: true },
  { name: 'Prompt Generator', path: '/tools/ai/prompt-generator', element: LazyWrap(PromptGenerator), public: true },
  { name: 'AI Humanizer', path: '/tools/ai/ai-humanizer', element: LazyWrap(AIHumanizer), public: true },
  { name: 'Image Prompt Generator', path: '/tools/ai/image-prompt-generator', element: LazyWrap(ImagePromptGenerator), public: true },
  { name: 'Email Generator', path: '/tools/ai/email-generator', element: LazyWrap(EmailGenerator), public: true },
  { name: 'Title Generator', path: '/tools/ai/title-generator', element: LazyWrap(TitleGenerator), public: true },
  { name: 'Token Calculator', path: '/tools/ai/token-calculator', element: LazyWrap(TokenCalculator), public: true },
  { name: 'AI API Cost Calculator', path: '/tools/ai/api-cost-calculator', element: LazyWrap(AIAPICostCalculator), public: true },
  { name: 'AI Inference Cost Calculator', path: '/tools/ai/inference-cost-calculator', element: LazyWrap(AIInferenceCostCalculator), public: true },
  { name: 'AI Training Cost Calculator', path: '/tools/ai/training-cost-calculator', element: LazyWrap(AITrainingCostCalculator), public: true },
  { name: 'Claude Cost Calculator', path: '/tools/ai/claude-cost-calculator', element: LazyWrap(ClaudeCostCalculator), public: true },
  { name: 'Context Window Calculator', path: '/tools/ai/context-window-calculator', element: LazyWrap(ContextWindowCalculator), public: true },
  { name: 'Embedding Cost Calculator', path: '/tools/ai/embedding-cost-calculator', element: LazyWrap(EmbeddingCostCalculator), public: true },
  { name: 'Fine-Tuning Cost Calculator', path: '/tools/ai/fine-tuning-cost-calculator', element: LazyWrap(FineTuningCostCalculator), public: true },
  { name: 'GPU Cost Calculator', path: '/tools/ai/gpu-cost-calculator', element: LazyWrap(GPUCostCalculator), public: true },
  { name: 'Gemini Cost Calculator', path: '/tools/ai/gemini-cost-calculator', element: LazyWrap(GeminiCostCalculator), public: true },
  { name: 'OpenAI Cost Calculator', path: '/tools/ai/openai-cost-calculator', element: LazyWrap(OpenAICostCalculator), public: true },
  { name: 'Prompt Length Calculator', path: '/tools/ai/prompt-length-calculator', element: LazyWrap(PromptLengthCalculator), public: true },
  { name: 'RAG Chunk Size Calculator', path: '/tools/ai/rag-chunk-size-calculator', element: LazyWrap(RAGChunkSizeCalculator), public: true },
  { name: 'Token to Word Calculator', path: '/tools/ai/token-to-word-calculator', element: LazyWrap(TokenToWordCalculator), public: true },
  { name: 'Vector DB Storage Calculator', path: '/tools/ai/vector-storage-calculator', element: LazyWrap(VectorDatabaseStorageCalculator), public: true },
  { name: 'Word to Token Calculator', path: '/tools/ai/word-to-token-calculator', element: LazyWrap(WordToTokenCalculator), public: true },
  { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', element: LazyWrap(CalorieCalculator), public: true },
  { name: 'Lean Body Mass Calculator', path: '/tools/health/lean-body-mass-calculator', element: LazyWrap(LeanBodyMassCalculator), public: true },
  { name: 'Waist to Hip Ratio Calculator', path: '/tools/health/waist-to-hip-ratio-calculator', element: LazyWrap(WaistToHipRatioCalculator), public: true },
  { name: 'Waist to Height Ratio Calculator', path: '/tools/health/waist-to-height-ratio-calculator', element: LazyWrap(WaistToHeightRatioCalculator), public: true },
  { name: 'Ideal Body Fat Calculator', path: '/tools/health/ideal-body-fat-calculator', element: LazyWrap(IdealBodyFatCalculator), public: true },
  { name: 'Macro Calculator', path: '/tools/health/macro-calculator', element: LazyWrap(MacroCalculator), public: true },
  { name: 'Maintenance Calorie Calculator', path: '/tools/health/maintenance-calorie-calculator', element: LazyWrap(MaintenanceCalorieCalculator), public: true },
  { name: 'Weight Loss Calorie Calculator', path: '/tools/health/weight-loss-calorie-calculator', element: LazyWrap(WeightLossCalorieCalculator), public: true },
  { name: 'Weight Gain Calorie Calculator', path: '/tools/health/weight-gain-calorie-calculator', element: LazyWrap(WeightGainCalorieCalculator), public: true },
  { name: 'Protein Intake Calculator', path: '/tools/health/protein-intake-calculator', element: LazyWrap(ProteinIntakeCalculator), public: true },
  { name: 'Target Heart Rate Calculator', path: '/tools/health/target-heart-rate-calculator', element: LazyWrap(TargetHeartRateCalculator), public: true },
  { name: 'One Rep Max Calculator', path: '/tools/health/one-rep-max-calculator', element: LazyWrap(OneRepMaxCalculator), public: true },
  { name: 'Running Pace Calculator', path: '/tools/health/running-pace-calculator', element: LazyWrap(RunningPaceCalculator), public: true },
  { name: 'VO2 Max Calculator', path: '/tools/health/vo2-max-calculator', element: LazyWrap(VO2MaxCalculator), public: true },
  { name: 'Calorie Burn Calculator', path: '/tools/health/calorie-burn-calculator', element: LazyWrap(CalorieBurnCalculator), public: true },
  { name: 'Shipping Calculator', path: '/tools/shipping/dim-weight-calculator', element: LazyWrap(DimWeightCalculator), public: true },
  { name: 'Freight Class Calculator', path: '/tools/shipping/freight-class-calculator', element: LazyWrap(FreightClassCalculator), public: true },
  { name: 'Shipping Cost Estimator', path: '/tools/shipping/shipping-cost-estimator', element: LazyWrap(ShippingCostEstimator), public: true },
  { name: 'Shipping Cost Calculator', path: '/tools/shipping/shipping-cost-calculator', element: LazyWrap(ShippingCostCalculator), public: true },
  { name: 'Package Volume Calculator', path: '/tools/shipping/package-volume-calculator', element: LazyWrap(PackageVolumeCalculator), public: true },
  { name: 'Chargeable Weight Calculator', path: '/tools/shipping/chargeable-weight-calculator', element: LazyWrap(ChargeableWeightCalculator), public: true },
  { name: 'Pallet Calculator', path: '/tools/shipping/pallet-calculator', element: LazyWrap(PalletCalculator), public: true },
  { name: 'FedEx DIM Weight Calculator', path: '/tools/shipping/fedex-dim-weight-calculator', element: LazyWrap(FedExDimWeightCalculator), public: true },
  { name: 'UPS DIM Weight Calculator', path: '/tools/shipping/ups-dim-weight-calculator', element: LazyWrap(UPSDimWeightCalculator), public: true },
  { name: 'Shipping Volume Calculator', path: '/tools/shipping/shipping-volume-calculator', element: LazyWrap(ShippingVolumeCalculator), public: true },
  { name: 'Oversize Charge Calculator', path: '/tools/shipping/oversize-charge-calculator', element: LazyWrap(OversizeChargeCalculator), public: true },
  { name: 'Freight Class Estimator', path: '/tools/shipping/freight-class-estimator', element: LazyWrap(FreightClassEstimator), public: true },
  { name: 'Freight Density Calculator', path: '/tools/shipping/freight-density-calculator', element: LazyWrap(FreightDensityCalculator), public: true },
  { name: 'Package Cubic Feet Calculator', path: '/tools/shipping/package-cubic-feet-calculator', element: LazyWrap(PackageCubicFeetCalculator), public: true },
  { name: 'DIM Divisor Calculator', path: '/tools/shipping/dim-divisor-calculator', element: LazyWrap(DimDivisorCalculator), public: true },
  { name: 'Shipment Cost Estimator', path: '/tools/shipping/shipment-cost-estimator', element: LazyWrap(ShipmentCostEstimator), public: true },
  { name: 'All Tools', path: '/tools', element: LazyWrap(AllTools), public: true },
  { name: 'Finance Category', path: '/tools/finance', element: LazyWrap(FinanceCategoryPage), public: true },
  { name: 'Health Category', path: '/tools/health', element: LazyWrap(HealthCategoryPage), public: true },
  { name: 'Shipping Category', path: '/tools/shipping', element: LazyWrap(ShippingCategoryPage), public: true },
  { name: 'Time Category', path: '/tools/time', element: LazyWrap(TimeCategoryPage), public: true },
  { name: 'AI Category', path: '/tools/ai', element: LazyWrap(AICategoryPage), public: true },
  { name: 'Category', path: '/tools/:category', element: LazyWrap(CategoryPage), public: true },
  { name: 'Popular Calculators', path: '/popular-calculators', element: LazyWrap(PopularCalculatorsPage), public: true },
  { name: 'Calculators', path: '/calculators', element: LazyWrap(CalculatorsPage), public: true },
  { name: 'Guides', path: '/guides', element: LazyWrap(Guides), public: true },
  { name: 'Guide Detail', path: '/guides/:slug', element: LazyWrap(GuideDetailPage), public: true },
  { name: 'Compare', path: '/compare', element: LazyWrap(Compare), public: true },
  { name: 'Compare Detail', path: '/compare/:slug', element: LazyWrap(CompareDetailPage), public: true },
  { name: 'About', path: '/about', element: LazyWrap(AboutPage), public: true },
  { name: 'Privacy Policy', path: '/privacy-policy', element: LazyWrap(PrivacyPolicyPage), public: true },
  { name: 'Terms of Use', path: '/terms', element: LazyWrap(TermsPage), public: true },
  { name: 'Contact', path: '/contact', element: LazyWrap(ContactPage), public: true },
  { name: 'AI Disclosure', path: '/ai-disclosure', element: LazyWrap(AIDisclosurePage), public: true },
  { name: 'Editorial Policy', path: '/editorial-policy', element: LazyWrap(EditorialPolicyPage), public: true },
  { name: 'Disclaimer', path: '/disclaimer', element: LazyWrap(DisclaimerPage), public: true },
  { name: 'Our Mission', path: '/our-mission', element: LazyWrap(OurMissionPage), public: true },
  { name: 'Mortgage by State Hub', path: '/finance-guides/mortgage-by-state', element: LazyWrap(MortgageByStateHub), public: true },
  { name: 'Finance Guides Hub', path: '/finance-guides', element: LazyWrap(FinanceGuidesHub), public: true },
  { name: 'Health Guides Hub', path: '/health-guides', element: LazyWrap(HealthGuidesHub), public: true },
  { name: 'HTML Sitemap', path: '/html-sitemap', element: LazyWrap(HtmlSitemap), public: true },
  // Dynamic programmatic routes - MUST be last to preserve static route priority
  { name: 'Programmatic Tool', path: '/tools/:category/:slug', element: LazyWrap(ProgrammaticToolPage), public: true },
];
