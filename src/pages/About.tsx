import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { generateOrganizationSchema } from '@/lib/schema';

export default function AboutPage() {
  const canonicalUrl = 'https://toolfactory.ai/about';
  const orgSchema = generateOrganizationSchema();

  return (
    <>
      <PageMeta
        title="About Us - Free AI-Powered Calculators and Tools"
        description="Learn about our free AI-powered calculators and tools for finance, health, shipping, and productivity."
        canonical={canonicalUrl}
        ogType="website"
        jsonLd={orgSchema}
      />
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-3xl mx-auto px-4 py-8 md:py-20">
          <Breadcrumb items={[
            { name: 'Home', url: '/' },
            { name: 'About Us' },
          ]} />
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tight">
            About <span className="text-primary">CalcWise AI</span>
          </h1>

          <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed">
            <section>
              <p className="text-lg text-slate-600 font-medium">
                Free AI-powered calculators and tools for US users — built to help you make smarter financial, health, and logistics decisions without paying a dime.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Our Mission</h2>
              <p>
                CalcWise AI was created with a clear mission: to make professional-grade calculators and analytical tools accessible to everyone, completely free of charge. We believe that powerful computational assistance should not be locked behind paywalls or require specialized software. Whether you are planning a major financial decision, tracking your health metrics, analyzing text content, or optimizing logistics operations, our platform provides the precision tools you need with the added intelligence of AI-driven insights.
              </p>
              <p>
                In a world where information overload is common, we cut through the noise by delivering focused, accurate, and actionable results. Every tool on our platform is designed to solve real problems quickly and transparently, without unnecessary complexity or hidden fees.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">What We Offer</h2>
              <p>
                Our growing suite of calculators and detectors spans multiple categories to serve diverse needs. In <strong>Finance</strong>, our <Link to="/tools/finance/mortgage-calculator" className="text-primary font-semibold hover:underline">Mortgage Calculator</Link> helps you estimate monthly payments, total interest, and overall affordability — complete with a detailed amortization schedule and interactive charts that break down your principal versus interest over the life of the loan.
              </p>
              <p>
                For <strong>Health and Wellness</strong>, our <Link to="/tools/health/bmi-calorie-calculator" className="text-primary font-semibold hover:underline">BMI and Calorie Calculator</Link> computes your Body Mass Index, classifies your health status, and estimates your daily caloric needs based on the scientifically validated Mifflin-St Jeor equation. With support for both metric and imperial units, it is accessible to users worldwide.
              </p>
              <p>
                In <strong>Logistics and Shipping</strong>, our <Link to="/tools/shipping/dim-weight-calculator" className="text-primary font-semibold hover:underline">DIM Weight Calculator</Link> determines whether your package will be billed by actual weight or dimensional weight, helping you avoid unexpected shipping costs. It supports both US standard (inches/pounds) and international metric (centimeters/kilograms) measurements.
              </p>
              <p>
                We also provide an <strong>Age Calculator</strong> for precise date difference calculations, and an <strong>AI Text Detector</strong> that analyzes writing patterns to estimate the probability of AI-generated content. Beyond standalone tools, our <Link to="/guides" className="text-primary font-semibold hover:underline">Guides</Link> section offers in-depth educational content, while our <Link to="/compare" className="text-primary font-semibold hover:underline">Compare</Link> section presents side-by-side analysis of important decisions such as fixed versus variable-rate mortgages.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Who We Serve</h2>
              <p>
                Our tools are built for a wide audience. Home buyers and real estate professionals rely on our mortgage calculator for quick payment estimates and financial planning. Fitness enthusiasts, nutritionists, and healthcare-conscious individuals use our BMI calculator to track body composition and caloric requirements. E-commerce sellers, warehouse managers, and small business owners depend on our shipping calculator to optimize packaging and control logistics costs. Writers, educators, and content creators utilize our AI detector to assess text authenticity. In short, if you need fast, accurate calculations with intelligent context, CalcWise AI is designed for you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">AI-Powered Insights</h2>
              <p>
                What sets CalcWise AI apart from traditional calculators is our integrated AI Insight engine. After every calculation, our system generates a contextual analysis that goes beyond raw numbers. For example, after calculating your mortgage payment, the AI evaluates your debt-to-income ratio and provides a risk assessment along with actionable suggestions for improvement. After a BMI calculation, it offers personalized health recommendations tailored to your specific results. These insights transform simple arithmetic into meaningful decision support, helping you understand not just what the numbers are, but what they mean for your situation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Important Disclaimer</h2>
              <p>
                While we strive for accuracy and reliability in every tool we build, it is important to understand that all results generated on this platform are provided for informational and educational purposes only. They should not be construed as professional financial, medical, legal, or logistical advice. Always consult with qualified professionals — such as financial advisors, healthcare providers, or shipping specialists — before making decisions that could significantly impact your finances, health, or business operations. We make no warranties regarding the completeness or accuracy of any calculation, and we are not liable for any decisions made based on the information provided.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Constantly Evolving</h2>
              <p>
                CalcWise AI is not a static platform. We are actively developing new calculators and tools to expand our coverage across additional domains including productivity, education, engineering, and data analysis. Our roadmap includes advanced financial planning tools, comprehensive health metric trackers, unit converters, password generators, and specialized calculators for developers and designers. We release updates regularly and welcome user feedback to help us prioritize which tools to build next.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3">Get in Touch</h2>
              <p>
                We value your feedback, suggestions, and questions. Whether you have found a bug, want to request a new calculator, or simply want to say hello, we would love to hear from you. Reach out to us via email at <a href="mailto:support@toolfactory.ai" className="text-primary font-semibold hover:underline">support@toolfactory.ai</a> and we will respond as soon as possible.
              </p>
              <p>
                Thank you for using CalcWise AI. We are honored to be part of your decision-making process, and we remain committed to delivering the best free AI-powered calculators on the web.
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
