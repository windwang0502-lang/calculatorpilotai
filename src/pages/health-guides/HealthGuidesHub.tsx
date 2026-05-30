import React from 'react';
import { Link } from 'react-router-dom';
import { ToolLayout } from '@/components/layouts/ToolLayout';

// BMI Resources
const bmiResources = [
  { name: 'BMI Chart for Men', path: '/tools/health/bmi-chart-men', desc: 'Male body mass index reference guide' },
  { name: 'BMI Chart for Women', path: '/tools/health/bmi-chart-women', desc: 'Female body mass index reference guide' },
  { name: 'BMI Chart for Children', path: '/tools/health/bmi-chart-children', desc: 'Youth BMI growth charts' },
  { name: 'BMI Chart by Age', path: '/tools/health/bmi-chart-by-age', desc: 'Adult BMI reference by age' },
  { name: 'BMI Chart by Height', path: '/tools/health/bmi-chart-by-height', desc: 'Find your healthy weight by height' },
  { name: 'BMI Chart for Athletes', path: '/tools/health/bmi-chart-for-athletes', desc: 'Body composition for active people' },
  { name: 'BMI Chart for Seniors', path: '/tools/health/bmi-chart-for-seniors', desc: 'Healthy weight for older adults' },
  { name: 'BMI Chart for Teens', path: '/tools/health/bmi-chart-for-teens', desc: 'Youth BMI percentiles explained' },
  { name: 'Healthy Weight Range Guide', path: '/tools/health/healthy-weight-range-guide', desc: 'Find your ideal weight zone' },
];

// Weight Management
const weightManagement = [
  { name: 'Ideal Weight Calculator Guide', path: '/tools/health/ideal-weight-calculator-guide', desc: 'Find your healthy target weight' },
  { name: 'Calorie Deficit Calculator Guide', path: '/tools/health/calorie-deficit-calculator-guide', desc: 'Safe weight loss planning' },
  { name: 'Calorie Surplus Calculator Guide', path: '/tools/health/calorie-surplus-calculator-guide', desc: 'Healthy weight gain planning' },
  { name: 'Body Fat Percentage Guide', path: '/tools/health/body-fat-percentage-guide', desc: 'Understanding body composition' },
  { name: 'Body Fat Percentage Chart', path: '/tools/health/body-fat-percentage-chart-guide', desc: 'Complete body fat reference' },
  { name: 'Healthy Weight by Height', path: '/tools/health/healthy-weight-by-height-guide', desc: 'Ideal range for your height' },
  { name: 'Ideal Weight by Age', path: '/tools/health/ideal-weight-by-age-guide', desc: 'How needs change with age' },
  { name: 'Weight Loss Calorie Guide', path: '/tools/health/weight-loss-calorie-calculator-guide', desc: 'Find your calorie deficit' },
  { name: 'Weight Gain Calorie Guide', path: '/tools/health/weight-gain-calorie-calculator-guide', desc: 'Build muscle safely' },
];

// Nutrition & Wellness
const nutritionWellness = [
  { name: 'Daily Water Intake Guide', path: '/tools/health/daily-water-intake-guide', desc: 'How much water should you drink' },
  { name: 'Basal Metabolic Rate Guide', path: '/tools/health/basal-metabolic-rate-guide', desc: 'Understanding your metabolism' },
  { name: 'Protein Intake by Weight', path: '/tools/health/protein-intake-by-weight-guide', desc: 'Daily protein needs calculator' },
  { name: 'Protein for Muscle Gain', path: '/tools/health/protein-intake-for-muscle-gain-guide', desc: 'Build more muscle' },
  { name: 'Water Intake by Weight', path: '/tools/health/daily-water-intake-by-weight-guide', desc: 'Personalized hydration' },
  { name: 'Macro Calculator Guide', path: '/tools/health/macro-calculator-guide', desc: 'Balance your macros' },
  { name: 'Maintenance Calorie Guide', path: '/tools/health/maintenance-calorie-guide', desc: 'Find your TDEE' },
];

// Health Calculators - All health calculators
const healthCalculators = [
  { name: 'BMI Calculator', path: '/tools/health/bmi-calculator', desc: 'Calculate your body mass index' },
  { name: 'Calorie Calculator', path: '/tools/health/calorie-calculator', desc: 'Daily calorie needs estimator' },
  { name: 'BMR Calculator', path: '/tools/health/bmr-calculator', desc: 'Basal metabolic rate calculator' },
  { name: 'Ideal Weight Calculator', path: '/tools/health/ideal-weight-calculator', desc: 'Find your healthy weight' },
  { name: 'Water Intake Calculator', path: '/tools/health/water-intake-calculator', desc: 'Daily hydration needs' },
  { name: 'Protein Calculator', path: '/tools/health/protein-calculator', desc: 'Daily protein needs' },
  { name: 'Body Fat Calculator', path: '/tools/health/body-fat-percentage-calculator', desc: 'Estimate body fat percentage' },
  { name: 'Target Heart Rate Calculator', path: '/tools/health/target-heart-rate-calculator', desc: 'Exercise heart rate zones' },
];

const allGuides = [...bmiResources, ...weightManagement, ...nutritionWellness];

const healthDisclaimer = "This tool provides general wellness information only and is not medical advice. Always consult a qualified healthcare professional before making health, nutrition, or weight-management decisions.";

const schemaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Health & Wellness Guides - Comprehensive Hub',
      description: 'Find comprehensive health and wellness guides covering BMI, weight management, nutrition, and fitness. Expert resources to help you understand and improve your health metrics.',
      url: 'https://www.calculatorpilotai.com/health-guides',
      isPartOf: {
        '@type': 'WebSite',
        name: 'CalculatorPilot AI',
        url: 'https://www.calculatorpilotai.com',
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.calculatorpilotai.com/' },
          { '@type': 'ListItem', position: 2, name: 'Health Guides', item: 'https://www.calculatorpilotai.com/health-guides' },
        ],
      },
    },
    {
      '@type': 'ItemList',
      name: 'Health & Wellness Guides',
      description: 'Comprehensive guides covering BMI, weight management, nutrition, and fitness',
      itemListElement: allGuides.map((guide, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: guide.name,
        url: `https://www.calculatorpilotai.com${guide.path}`,
      })),
    },
  ],
};

function ResourceSection({ title, icon, resources }: { title: string; icon: React.ReactNode; resources: typeof bmiResources }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
        {icon}
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {resources.map((resource) => (
          <Link
            key={resource.path}
            to={resource.path}
            className="group bg-white border border-slate-200 rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all"
          >
            <h4 className="font-medium group-hover:text-primary transition-colors text-sm">
              {resource.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">{resource.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HealthGuidesHub() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }} />
      <ToolLayout toolId="health-guides-hub" category="health">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/health" className="hover:text-primary transition-colors">Health Tools</Link>
              <span>/</span>
              <span>Guides</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Health & Wellness Guides
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Comprehensive guides to help you understand and improve your health metrics. From BMI charts to nutrition tips, find expert resources for your wellness journey.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Health Guides ({allGuides.length} guides)
            </h2>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                <ResourceSection
                  title="BMI Resources"
                  icon={
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  }
                  resources={bmiResources}
                />
              </div>

              <ResourceSection
                title="Weight Management"
                icon={
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                }
                resources={weightManagement}
              />

              <ResourceSection
                title="Nutrition & Wellness"
                icon={
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                }
                resources={nutritionWellness}
              />
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Health Calculators
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {healthCalculators.map((calc) => (
                <Link
                  key={calc.path}
                  to={calc.path}
                  className="group bg-slate-50 border border-slate-200 rounded-xl p-4 hover:bg-primary/5 hover:border-primary/30 transition-all"
                >
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {calc.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{calc.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Start Your Health Journey</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Use our calculators and guides to better understand your health metrics and make informed decisions about your wellness goals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/tools/health/bmi-calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculate Your BMI
              </Link>
              <Link
                to="/tools/health"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
              >
                Browse All Health Calculators
              </Link>
            </div>
          </section>
        </div>
      </ToolLayout>
    </>
  );
}