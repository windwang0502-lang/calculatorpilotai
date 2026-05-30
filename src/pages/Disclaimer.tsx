import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { Link } from 'react-router-dom';
import { AlertTriangle, Scale, Heart, Stethoscope, Gavel, Calculator, Info } from 'lucide-react';

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Disclaimer' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    generateBreadcrumbSchema(breadcrumbItems),
  ],
};

export default function DisclaimerPage() {
  return (
    <>
      <PageMeta
        title="Disclaimer - CalcWise AI"
        description="Read our disclaimer. All calculators on CalcWise AI are for educational and informational purposes only. No financial, medical, or legal advice."
        canonical="https://www.calculatorpilotai.com/disclaimer"
        jsonLd={jsonLd}
      />
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-amber-600 uppercase tracking-wider">Legal Notice</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Disclaimer</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Important information about the use of our calculators and tools.
          </p>
          <p className="text-sm text-muted-foreground mt-3">Last Updated: May 30, 2026</p>
        </header>

        <article className="prose prose-lg max-w-none">
          {/* Educational Purpose Notice */}
          <section className="mb-12">
            <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-6 mb-6">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-amber-900 mb-2">Educational Purposes Only</h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    All calculators, tools, guides, and content on CalcWise AI are provided for educational and informational purposes only. They are designed to help you understand concepts, explore scenarios, and make informed decisions—but they should never be used as a substitute for professional advice.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* No Financial Advice */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Scale className="w-5 h-5 text-emerald-600" />
              </div>
              No Financial Advice
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              The financial calculators on this site—including mortgage calculators, loan calculators, interest calculators, and debt payoff planners—are for informational purposes only.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <p className="text-slate-700 leading-relaxed">
                <strong>What this means:</strong> Our calculators provide estimates based on the inputs you provide. They do not account for all factors that affect financial decisions, including:
              </p>
              <ul className="mt-4 space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Your complete financial situation and credit history</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Changes in interest rates, inflation, or market conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Tax implications specific to your circumstances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Lender-specific requirements and fees</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Professional loan officer recommendations</span>
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                <strong>Always consult:</strong> A licensed financial advisor, certified public accountant (CPA), or mortgage professional before making any financial decisions.
              </p>
            </div>
          </section>

          {/* No Medical Advice */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
              No Medical Advice
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Our health and fitness calculators—including BMI calculator, BMR calculator, calorie calculator, body fat calculator, and protein calculator—are not medical tools.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <p className="text-slate-700 leading-relaxed">
                <strong>Important limitations:</strong>
              </p>
              <ul className="mt-4 space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>BMI is a screening tool, not a diagnostic measure. It does not distinguish between muscle and fat mass.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Calorie calculations are estimates based on formulas that may not apply to everyone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Body composition varies based on age, sex, ethnicity, and other individual factors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-500 mt-1">•</span>
                  <span>Protein and nutritional needs vary based on health conditions and activity levels.</span>
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                <strong>Always consult:</strong> A licensed healthcare provider, physician, or registered dietitian before making changes to your diet, exercise routine, or health-related decisions.
              </p>
            </div>
          </section>

          {/* No Legal Advice */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center">
                <Gavel className="w-5 h-5 text-slate-600" />
              </div>
              No Legal Advice
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Any guides or informational content on legal topics provided through CalcWise AI does not constitute legal advice.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <p className="text-slate-700 leading-relaxed">
                Legal matters are complex and highly dependent on specific circumstances, jurisdictions, and applicable laws. Our content is general in nature and may not apply to your particular situation.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                <strong>Always consult:</strong> A licensed attorney or legal professional for advice on contracts, agreements, regulations, or any legal matter.
              </p>
            </div>
          </section>

          {/* Calculator Accuracy Limitations */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              Calculator Accuracy Limitations
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              While we strive to provide accurate calculations based on standard industry formulas, all results come with inherent limitations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-bold text-slate-900 mb-2">Input Accuracy</h3>
                <p className="text-sm text-slate-600">
                  Results depend entirely on the accuracy of inputs. Small errors in numbers entered can lead to significantly different outputs.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-bold text-slate-900 mb-2">Formula Assumptions</h3>
                <p className="text-sm text-slate-600">
                  Our calculators use standardized formulas that may not account for all variables in real-world scenarios.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-bold text-slate-900 mb-2">Outdated Information</h3>
                <p className="text-sm text-slate-600">
                  Industry standards, rates, and guidelines change. We update our tools regularly but cannot guarantee real-time accuracy.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-bold text-slate-900 mb-2">Carrier Variations</h3>
                <p className="text-sm text-slate-600">
                  Shipping calculators use carrier formulas but actual rates may include surcharges, fuel adjustments, and zone-specific pricing.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping Disclaimer */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-amber-600" />
              </div>
              Shipping Calculator Disclaimer
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              Our shipping tools—including DIM weight calculators, freight class calculators, and cost estimators—provide estimates for planning purposes.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <p className="text-slate-700 leading-relaxed">
                Actual shipping costs are determined by carriers based on factors including:
              </p>
              <ul className="mt-4 space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Actual weight vs. dimensional weight (whichever is greater)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Shipping zones and distance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Fuel surcharges and peak season adjustments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Package handling requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Insurance and signature confirmation fees</span>
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                <strong>Always verify:</strong> Get actual quotes directly from carriers before making shipping decisions.
              </p>
            </div>
          </section>

          {/* Third-Party Links */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Third-Party Links</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Our site may contain links to external websites. We do not endorse, verify, or take responsibility for the content, accuracy, or opinions expressed on third-party sites. Use external resources at your own risk.
            </p>
          </section>

          {/* Changes to Disclaimer */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Changes to This Disclaimer</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              We reserve the right to update this disclaimer at any time. Changes are effective immediately upon posting. The date at the top of this page indicates when the disclaimer was last revised.
            </p>
          </section>
        </article>

        {/* Contact CTA */}
        <div className="mt-12 pt-8 border-t">
          <div className="bg-slate-100 rounded-xl p-6">
            <h3 className="font-bold text-slate-900 mb-2">Questions about our disclaimer?</h3>
            <p className="text-slate-600 text-sm mb-4">
              If you have questions or concerns about this disclaimer, please contact us.
            </p>
            <Link
              to="/contact"
              className="text-primary font-semibold hover:underline text-sm"
            >
              Contact Us →
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link to="/terms" className="hover:text-primary">Terms of Use</Link>
          <span>·</span>
          <Link to="/privacy-policy" className="hover:text-primary">Privacy Policy</Link>
          <span>·</span>
          <Link to="/editorial-policy" className="hover:text-primary">Editorial Policy</Link>
          <span>·</span>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
        </div>
      </div>
    </>
  );
}
