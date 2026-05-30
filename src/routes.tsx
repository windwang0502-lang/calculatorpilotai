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
const AIDetector = React.lazy(() => import('./pages/tools/ai/AIDetector'));
const PromptGenerator = React.lazy(() => import('./pages/tools/ai/PromptGenerator'));
const AIHumanizer = React.lazy(() => import('./pages/tools/ai/AIHumanizer'));
const ImagePromptGenerator = React.lazy(() => import('./pages/tools/ai/ImagePromptGenerator'));
const EmailGenerator = React.lazy(() => import('./pages/tools/ai/EmailGenerator'));
const TitleGenerator = React.lazy(() => import('./pages/tools/ai/TitleGenerator'));
const TokenCalculator = React.lazy(() => import('./pages/tools/ai/TokenCalculator'));
const CalorieCalculator = React.lazy(() => import('./pages/tools/health/CalorieCalculator'));
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
const ProgrammaticToolPage = React.lazy(() => import('./pages/tools/ProgrammaticToolPage'));
const MortgageByStateHub = React.lazy(() => import('./pages/finance-guides/MortgageByStateHub'));
const FinanceGuidesHub = React.lazy(() => import('./pages/finance-guides/FinanceGuidesHub'));
const HealthGuidesHub = React.lazy(() => import('./pages/health-guides/HealthGuidesHub'));

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
  { name: 'AI Detector', path: '/tools/ai/ai-detector', element: LazyWrap(AIDetector), public: true },
  { name: 'Prompt Generator', path: '/tools/ai/prompt-generator', element: LazyWrap(PromptGenerator), public: true },
  { name: 'AI Humanizer', path: '/tools/ai/ai-humanizer', element: LazyWrap(AIHumanizer), public: true },
  { name: 'Image Prompt Generator', path: '/tools/ai/image-prompt-generator', element: LazyWrap(ImagePromptGenerator), public: true },
  { name: 'Email Generator', path: '/tools/ai/email-generator', element: LazyWrap(EmailGenerator), public: true },
  { name: 'Title Generator', path: '/tools/ai/title-generator', element: LazyWrap(TitleGenerator), public: true },
  { name: 'Token Calculator', path: '/tools/ai/token-calculator', element: LazyWrap(TokenCalculator), public: true },
  { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', element: LazyWrap(CalorieCalculator), public: true },
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
  { name: 'Shipment Cost Estimator', path: '/tools/shipping/shipment-cost-estimator', element: LazyWrap(ShipmentCostEstimator), public: true },
  { name: 'All Tools', path: '/tools', element: LazyWrap(AllTools), public: true },
  { name: 'Finance Category', path: '/tools/finance', element: LazyWrap(FinanceCategoryPage), public: true },
  { name: 'Health Category', path: '/tools/health', element: LazyWrap(HealthCategoryPage), public: true },
  { name: 'Shipping Category', path: '/tools/shipping', element: LazyWrap(ShippingCategoryPage), public: true },
  { name: 'Time Category', path: '/tools/time', element: LazyWrap(TimeCategoryPage), public: true },
  { name: 'AI Category', path: '/tools/ai', element: LazyWrap(AICategoryPage), public: true },
  { name: 'Category', path: '/tools/:category', element: LazyWrap(CategoryPage), public: true },
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
  { name: 'Mortgage by State Hub', path: '/finance-guides/mortgage-by-state', element: LazyWrap(MortgageByStateHub), public: true },
  { name: 'Finance Guides Hub', path: '/finance-guides', element: LazyWrap(FinanceGuidesHub), public: true },
  { name: 'Health Guides Hub', path: '/health-guides', element: LazyWrap(HealthGuidesHub), public: true },
  // Dynamic programmatic routes - MUST be last to preserve static route priority
  { name: 'Programmatic Tool', path: '/tools/:category/:slug', element: LazyWrap(ProgrammaticToolPage), public: true },
];
