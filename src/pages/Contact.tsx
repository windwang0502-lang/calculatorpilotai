import { useState } from 'react';
import PageMeta from '@/components/common/PageMeta';
import Breadcrumb from '@/components/common/Breadcrumb';
import { generateBreadcrumbSchema } from '@/lib/schema';
import { Link } from 'react-router-dom';
import { Mail, Clock, MessageSquare, Bug, Handshake, FileText, AlertCircle } from 'lucide-react';

const breadcrumbItems = [
  { name: 'Home', url: '/' },
  { name: 'Contact Us' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    generateBreadcrumbSchema(breadcrumbItems),
  ],
};

const inquiryTypes = [
  {
    icon: MessageSquare,
    title: 'General Feedback',
    description: 'Share your thoughts, suggestions, or feature requests. We value all feedback.',
    subject: 'feedback',
    response: '24-48 business hours',
  },
  {
    icon: Bug,
    title: 'Calculator Issue',
    description: 'Report bugs, incorrect calculations, or unexpected behavior in any calculator.',
    subject: 'bug-report',
    response: '12-24 business hours',
  },
  {
    icon: FileText,
    title: 'Calculator Request',
    description: 'Suggest a new calculator or tool you would like to see added to our platform.',
    subject: 'tool-request',
    response: '48-72 business hours',
  },
  {
    icon: Handshake,
    title: 'Partnership Inquiries',
    description: 'Interested in collaboration, affiliate partnerships, or business opportunities.',
    subject: 'partnership',
    response: '3-5 business days',
  },
];

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
    setSubmitted(true);
  };

  return (
    <>
      <PageMeta
        title="Contact Us - CalcWise AI"
        description="Get in touch with the CalcWise AI team. Send us feedback, report a bug, request a new calculator, or inquire about partnerships."
        canonical="https://www.calculatorpilotai.com/contact"
        jsonLd={jsonLd}
      />
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-5xl mx-auto px-4 py-8 md:py-16">
          <Breadcrumb items={breadcrumbItems} />

          {/* Hero Section */}
          <section className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Support</p>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Contact Us
            </h1>
            <p className="text-slate-600 text-base max-w-2xl">
              Have a question, found a bug, or want to suggest a new tool? We would love to hear from you. Choose the type of inquiry that best matches your needs below.
            </p>
          </section>

          {/* Inquiry Types */}
          <section className="mb-12">
            <h2 className="text-lg font-bold text-slate-900 mb-4">How Can We Help?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {inquiryTypes.map((type, i) => (
                <div key={i} className="bg-white p-5 border border-slate-200 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <type.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{type.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-3">{type.description}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Response: {type.response}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact info sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-3">Email</h3>
                <a href="mailto:support@calculatorpilotai.com" className="text-primary font-semibold hover:underline text-sm break-all">
                  support@calculatorpilotai.com
                </a>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Support Hours</span>
                  </div>
                  <p className="text-sm text-slate-600">Monday–Friday, 9am–5pm EST</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <h3 className="font-bold text-amber-900 text-sm">Before You Contact</h3>
                </div>
                <p className="text-amber-800 text-xs leading-relaxed">
                  For calculator errors, please include: the calculator name, inputs used, and what result you expected vs. what you received.
                </p>
              </div>

              <div className="bg-white border rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-3">Helpful Links</h3>
                <div className="space-y-2">
                  <Link to="/about" className="block text-sm text-slate-500 hover:text-primary transition-colors">About Us</Link>
                  <Link to="/our-mission" className="block text-sm text-slate-500 hover:text-primary transition-colors">Our Mission</Link>
                  <Link to="/privacy-policy" className="block text-sm text-slate-500 hover:text-primary transition-colors">Privacy Policy</Link>
                  <Link to="/terms" className="block text-sm text-slate-500 hover:text-primary transition-colors">Terms of Use</Link>
                  <Link to="/disclaimer" className="block text-sm text-slate-500 hover:text-primary transition-colors">Disclaimer</Link>
                  <Link to="/editorial-policy" className="block text-sm text-slate-500 hover:text-primary transition-colors">Editorial Policy</Link>
                  <Link to="/guides" className="block text-sm text-slate-500 hover:text-primary transition-colors">Guides</Link>
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900 mb-2">Message Sent!</h3>
                  <p className="text-emerald-700 text-sm mb-4">
                    Thanks for reaching out. We have received your message and will reply to <strong>{form.email}</strong> within 24–48 business hours.
                  </p>
                  <p className="text-emerald-600 text-xs">
                    For urgent calculator issues, please check our <Link to="/disclaimer" className="underline hover:no-underline">disclaimer</Link> and try again with verified inputs.
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
                        placeholder="name@example.com"
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
                      <option value="bug-report">Bug Report (Calculator Issue)</option>
                      <option value="tool-request">Request a New Calculator</option>
                      <option value="feedback">General Feedback</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && <p className="text-xs text-rose-500">{errors.subject}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Message</label>
                    <textarea
                      value={form.message}
                      onChange={e => handleChange('message', e.target.value)}
                      placeholder="Describe your question, issue, or feedback in detail..."
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

          {/* Feedback Process */}
          <section className="mt-16">
            <div className="bg-slate-100 rounded-2xl p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Our Response Process</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto mb-3">1</div>
                  <h3 className="font-semibold text-slate-900 mb-1">Submit</h3>
                  <p className="text-sm text-slate-600">Send us your inquiry using the form above</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto mb-3">2</div>
                  <h3 className="font-semibold text-slate-900 mb-1">Review</h3>
                  <p className="text-sm text-slate-600">We review your message and route it to the right team</p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mx-auto mb-3">3</div>
                  <h3 className="font-semibold text-slate-900 mb-1">Response</h3>
                  <p className="text-sm text-slate-600">You receive a personalized response to your email</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
