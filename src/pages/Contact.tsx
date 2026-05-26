import { useState } from 'react';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Link } from 'react-router-dom';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Placeholder: form submission logic goes here
    setSubmitted(true);
  };

  return (
    <>
      <PageMeta
        title="Contact Us - CalcWise AI"
        description="Get in touch with the CalcWise AI team. Send us feedback, report a bug, or request a new calculator."
        canonical="https://www.calculatorpilotai.com/contact"
      />
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-3xl mx-auto px-4 py-8 md:py-20">
          <Breadcrumb items={[
            { name: 'Home', url: '/' },
            { name: 'Contact Us' },
          ]} />
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Support</p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Contact Us
          </h1>
          <p className="text-slate-600 text-base mb-10 max-w-xl">
            We would love to hear from you. Whether you have found a bug, want to suggest a new tool, or simply have a question — send us a message and we will get back to you as soon as possible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact info sidebar */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white border rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-3">Email</h3>
                <a href="mailto:support@www.calculatorpilotai.com" className="text-primary font-semibold hover:underline text-sm break-all">
                  support@www.calculatorpilotai.com
                </a>
                <p className="text-slate-500 text-xs mt-2">We typically respond within 1–2 business days.</p>
              </div>
              <div className="bg-white border rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-3">Helpful Links</h3>
                <div className="space-y-2">
                  <Link to="/about" className="block text-sm text-slate-500 hover:text-primary transition-colors">About Us</Link>
                  <Link to="/privacy-policy" className="block text-sm text-slate-500 hover:text-primary transition-colors">Privacy Policy</Link>
                  <Link to="/terms" className="block text-sm text-slate-500 hover:text-primary transition-colors">Terms of Use</Link>
                  <Link to="/guides" className="block text-sm text-slate-500 hover:text-primary transition-colors">Guides</Link>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="md:col-span-2">
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">✓</div>
                  <h3 className="text-lg font-bold text-emerald-900 mb-2">Message Sent!</h3>
                  <p className="text-emerald-700 text-sm">
                    Thank you for reaching out. We have received your message and will reply to <strong>{form.email}</strong> within 1–2 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border rounded-lg shadow-sm p-6 md:p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => handleChange('name', e.target.value)}
                        placeholder="John Smith"
                        className={`w-full px-3 py-2.5 border rounded outline-none focus:ring-2 focus:ring-primary text-sm transition-all ${errors.name ? 'border-rose-500' : 'border-slate-200'}`}
                      />
                      {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => handleChange('email', e.target.value)}
                        placeholder="you@example.com"
                        className={`w-full px-3 py-2.5 border rounded outline-none focus:ring-2 focus:ring-primary text-sm transition-all ${errors.email ? 'border-rose-500' : 'border-slate-200'}`}
                      />
                      {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Subject</label>
                    <select
                      value={form.subject}
                      onChange={e => handleChange('subject', e.target.value)}
                      className={`w-full px-3 py-2.5 border rounded outline-none focus:ring-2 focus:ring-primary text-sm bg-white transition-all ${errors.subject ? 'border-rose-500' : 'border-slate-200'}`}
                    >
                      <option value="">Select a subject...</option>
                      <option value="bug-report">Bug Report</option>
                      <option value="tool-request">Request a New Tool / Calculator</option>
                      <option value="feedback">General Feedback</option>
                      <option value="partnership">Partnership / Business Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <p className="text-xs text-rose-500">{errors.subject}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
                    <textarea
                      value={form.message}
                      onChange={e => handleChange('message', e.target.value)}
                      placeholder="Describe your question or feedback in detail..."
                      rows={6}
                      className={`w-full px-3 py-2.5 border rounded outline-none focus:ring-2 focus:ring-primary text-sm resize-none transition-all ${errors.message ? 'border-rose-500' : 'border-slate-200'}`}
                    />
                    <div className="flex justify-between items-center">
                      {errors.message ? <p className="text-xs text-rose-500">{errors.message}</p> : <span />}
                      <span className="text-xs text-slate-400">{form.message.length} chars</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest text-sm"
                  >
                    Send Message
                  </button>

                  <p className="text-xs text-slate-400 text-center">
                    By submitting this form, you agree to our{' '}
                    <Link to="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
