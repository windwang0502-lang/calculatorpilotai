import React, { Suspense } from 'react';
import type { ReactNode } from 'react';

const Home = React.lazy(() => import('./pages/Home'));
const MortgageCalculator = React.lazy(() => import('./pages/tools/finance/MortgageCalculator'));
const LoanCalculator = React.lazy(() => import('./pages/tools/finance/LoanCalculator'));
const APRCalculator = React.lazy(() => import('./pages/tools/finance/APRCalculator'));
const RefinanceCalculator = React.lazy(() => import('./pages/tools/finance/RefinanceCalculator'));
const InterestCalculator = React.lazy(() => import('./pages/tools/finance/InterestCalculator'));
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
const AIDetector = React.lazy(() => import('./pages/tools/ai/AIDetector'));
const PromptGenerator = React.lazy(() => import('./pages/tools/ai/PromptGenerator'));
const AIHumanizer = React.lazy(() => import('./pages/tools/ai/AIHumanizer'));
const ImagePromptGenerator = React.lazy(() => import('./pages/tools/ai/ImagePromptGenerator'));
const EmailGenerator = React.lazy(() => import('./pages/tools/ai/EmailGenerator'));
const TitleGenerator = React.lazy(() => import('./pages/tools/ai/TitleGenerator'));
const DimWeightCalculator = React.lazy(() => import('./pages/tools/shipping/DimWeightCalculator'));
const FreightClassCalculator = React.lazy(() => import('./pages/tools/shipping/FreightClassCalculator'));
const ShippingCostEstimator = React.lazy(() => import('./pages/tools/shipping/ShippingCostEstimator'));
const PackageVolumeCalculator = React.lazy(() => import('./pages/tools/shipping/PackageVolumeCalculator'));
const ChargeableWeightCalculator = React.lazy(() => import('./pages/tools/shipping/ChargeableWeightCalculator'));
const PalletCalculator = React.lazy(() => import('./pages/tools/shipping/PalletCalculator'));
const AllTools = React.lazy(() => import('./pages/tools/AllTools'));
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
  { name: 'AI Detector', path: '/tools/ai/ai-detector', element: LazyWrap(AIDetector), public: true },
  { name: 'Prompt Generator', path: '/tools/ai/prompt-generator', element: LazyWrap(PromptGenerator), public: true },
  { name: 'AI Humanizer', path: '/tools/ai/ai-humanizer', element: LazyWrap(AIHumanizer), public: true },
  { name: 'Image Prompt Generator', path: '/tools/ai/image-prompt-generator', element: LazyWrap(ImagePromptGenerator), public: true },
  { name: 'Email Generator', path: '/tools/ai/email-generator', element: LazyWrap(EmailGenerator), public: true },
  { name: 'Title Generator', path: '/tools/ai/title-generator', element: LazyWrap(TitleGenerator), public: true },
  { name: 'Shipping Calculator', path: '/tools/shipping/dim-weight-calculator', element: LazyWrap(DimWeightCalculator), public: true },
  { name: 'Freight Class Calculator', path: '/tools/shipping/freight-class-calculator', element: LazyWrap(FreightClassCalculator), public: true },
  { name: 'Shipping Cost Estimator', path: '/tools/shipping/shipping-cost-estimator', element: LazyWrap(ShippingCostEstimator), public: true },
  { name: 'Package Volume Calculator', path: '/tools/shipping/package-volume-calculator', element: LazyWrap(PackageVolumeCalculator), public: true },
  { name: 'Chargeable Weight Calculator', path: '/tools/shipping/chargeable-weight-calculator', element: LazyWrap(ChargeableWeightCalculator), public: true },
  { name: 'Pallet Calculator', path: '/tools/shipping/pallet-calculator', element: LazyWrap(PalletCalculator), public: true },
  { name: 'All Tools', path: '/tools', element: LazyWrap(AllTools), public: true },
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
];
