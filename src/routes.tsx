import React, { Suspense } from 'react';
import type { ReactNode } from 'react';

const Home = React.lazy(() => import('./pages/Home'));
const MortgageCalculator = React.lazy(() => import('./pages/tools/finance/MortgageCalculator'));
const BMICalculator = React.lazy(() => import('./pages/tools/health/BMICalculator'));
const AgeCalculator = React.lazy(() => import('./pages/tools/time/AgeCalculator'));
const AIDetector = React.lazy(() => import('./pages/tools/ai/AIDetector'));
const DimWeightCalculator = React.lazy(() => import('./pages/tools/shipping/DimWeightCalculator'));
const CategoryPage = React.lazy(() => import('./pages/tools/CategoryPage'));
const Guides = React.lazy(() => import('./pages/guides/Guides'));
const GuideDetailPage = React.lazy(() => import('./pages/guides/GuideDetailPage'));
const Compare = React.lazy(() => import('./pages/compare/Compare'));
const CompareDetailPage = React.lazy(() => import('./pages/compare/CompareDetailPage'));
const AboutPage = React.lazy(() => import('./pages/About'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsPage = React.lazy(() => import('./pages/Terms'));
const ContactPage = React.lazy(() => import('./pages/Contact'));

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
  {
    name: 'Home',
    path: '/',
    element: LazyWrap(Home),
    public: true,
  },
  {
    name: 'Mortgage Calculator',
    path: '/tools/finance/mortgage-calculator',
    element: LazyWrap(MortgageCalculator),
    public: true,
  },
  {
    name: 'BMI Calculator',
    path: '/tools/health/bmi-calorie-calculator',
    element: LazyWrap(BMICalculator),
    public: true,
  },
  {
    name: 'Age Calculator',
    path: '/tools/time/age-calculator',
    element: LazyWrap(AgeCalculator),
    public: true,
  },
  {
    name: 'AI Detector',
    path: '/tools/ai/ai-detector',
    element: LazyWrap(AIDetector),
    public: true,
  },
  {
    name: 'Shipping Calculator',
    path: '/tools/shipping/dim-weight-calculator',
    element: LazyWrap(DimWeightCalculator),
    public: true,
  },
  {
    name: 'Category',
    path: '/tools/:category',
    element: LazyWrap(CategoryPage),
    public: true,
  },
  {
    name: 'Guides',
    path: '/guides',
    element: LazyWrap(Guides),
    public: true,
  },
  {
    name: 'Guide Detail',
    path: '/guides/:slug',
    element: LazyWrap(GuideDetailPage),
    public: true,
  },
  {
    name: 'Compare',
    path: '/compare',
    element: LazyWrap(Compare),
    public: true,
  },
  {
    name: 'Compare Detail',
    path: '/compare/:slug',
    element: LazyWrap(CompareDetailPage),
    public: true,
  },
  {
    name: 'About',
    path: '/about',
    element: LazyWrap(AboutPage),
    public: true,
  },
  {
    name: 'Privacy Policy',
    path: '/privacy-policy',
    element: LazyWrap(PrivacyPolicyPage),
    public: true,
  },
  {
    name: 'Terms of Use',
    path: '/terms',
    element: LazyWrap(TermsPage),
    public: true,
  },
  {
    name: 'Contact',
    path: '/contact',
    element: LazyWrap(ContactPage),
    public: true,
  }
];
