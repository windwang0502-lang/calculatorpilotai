import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageMeta
        title="Privacy Policy - CalcWise AI"
        description="Read our privacy policy to understand how CalcWise AI collects, uses, and protects your data including cookies, analytics, and advertising."
        canonical="https://www.calculatorpilotai.com/privacy-policy"
      />
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-3xl mx-auto px-4 py-8 md:py-20">
          <Breadcrumb items={[
            { name: 'Home', url: '/' },
            { name: 'Privacy Policy' },
          ]} />
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm mb-10">Effective date: January 1, 2026 &nbsp;·&nbsp; Last updated: May 24, 2026</p>

          <div className="space-y-8 text-slate-700 leading-relaxed">
            <section>
              <p className="text-base text-slate-600">
                CalcWise AI ("we", "us", or "our") operates the website located at <strong>www.calculatorpilotai.com</strong> (the "Site"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our Site. We are committed to protecting your privacy and handling your data in an open and transparent manner.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-widest text-sm">1. Information We Collect</h2>
              <p>
                We do not require users to create an account or provide personally identifiable information to use any calculator or tool on this Site. All calculations run entirely in your browser and are not transmitted to our servers.
              </p>
              <p className="mt-3">
                However, like most websites, we automatically collect certain non-personally identifiable information when you visit the Site, including:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-slate-600">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Referring URL</li>
                <li>Pages visited and time spent on each page</li>
                <li>IP address (anonymized where applicable)</li>
                <li>Device type and screen resolution</li>
              </ul>
              <p className="mt-3">
                If you use our Contact form, we collect the name, email address, and message content you voluntarily provide.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-widest text-sm">2. Cookies</h2>
              <p>
                We use cookies to enhance your experience on the Site. Cookies are small text files placed on your device when you visit a website. We use the following types of cookies:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-slate-600">
                <li><strong>Essential Cookies:</strong> Required for the Site to function properly. These cannot be disabled.</li>
                <li><strong>Analytics Cookies:</strong> Used to understand how visitors interact with the Site, which pages are most visited, and how users navigate between pages. We use Google Analytics for this purpose. Data collected is aggregated and anonymized.</li>
                <li><strong>Preference Cookies:</strong> Allow the Site to remember your settings and preferences, such as unit preferences (metric vs. imperial) in our calculators.</li>
              </ul>
              <p className="mt-3">
                You can control and manage cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of the Site.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-widest text-sm">3. Analytics</h2>
              <p>
                We use <strong>Google Analytics</strong> to collect and analyze aggregate usage data about our Site. Google Analytics uses cookies and similar technologies to collect information about how users interact with our Site. This information is used to compile reports and help us improve the Site.
              </p>
              <p className="mt-3">
                Google Analytics data is processed in accordance with Google's Privacy Policy. We have enabled IP anonymization in Google Analytics to further protect user privacy. You can opt out of Google Analytics tracking by installing the <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-widest text-sm">4. Advertising</h2>
              <p>
                We may display third-party advertisements on the Site in the future. These advertisers may use cookies and similar tracking technologies to deliver ads that are relevant to your interests. Advertising cookies collect information about your browsing activity, but they do not collect personally identifiable information directly from our Site.
              </p>
              <p className="mt-3">
                If we use Google AdSense, it will comply with Google's advertising policies. You can manage your ad personalization preferences at <a href="https://adssettings.google.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>. We currently do not run advertising, but reserve the right to do so in the future.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-widest text-sm">5. How We Use Your Data</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-slate-600">
                <li>To operate, maintain, and improve the Site and its tools</li>
                <li>To understand usage patterns and optimize user experience</li>
                <li>To respond to inquiries submitted through our Contact form</li>
                <li>To detect and prevent security threats or abuse</li>
                <li>To comply with legal obligations</li>
              </ul>
              <p className="mt-3">
                We do not sell, rent, or share your personal data with third parties for their own marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-widest text-sm">6. Data Retention</h2>
              <p>
                Contact form submissions are retained for up to 12 months for the purpose of responding to inquiries. Analytics data is retained for 26 months in accordance with Google Analytics default settings. We do not store any calculator input data — all calculations are performed locally in your browser.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-widest text-sm">7. Your Rights</h2>
              <p>
                Depending on your jurisdiction, you may have the following rights with respect to your personal data:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 text-slate-600">
                <li>The right to access the personal data we hold about you</li>
                <li>The right to request correction of inaccurate data</li>
                <li>The right to request deletion of your data</li>
                <li>The right to opt out of analytics tracking</li>
                <li>The right to withdraw consent where processing is consent-based</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us at <a href="mailto:support@calculatorpilotai.com" className="text-primary hover:underline">support@calculatorpilotai.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-widest text-sm">8. Children's Privacy</h2>
              <p>
                The Site is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will promptly delete it.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-widest text-sm">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify users of material changes by updating the "Last updated" date at the top of this page. We encourage you to review this policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3 uppercase tracking-widest text-sm">10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@calculatorpilotai.com" className="text-primary font-semibold hover:underline">support@calculatorpilotai.com</a>.
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
