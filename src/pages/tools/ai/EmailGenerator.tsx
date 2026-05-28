import React, { useState } from 'react';
import { ToolLayout } from '@/components/layouts/ToolLayout';
import { generateEmailInsight, AIInsight } from '@/lib/ai';
import { AIInsightPanel } from '@/components/AIInsightPanel';

const EMAIL_PURPOSES = ['Support', 'Sales', 'Follow-up', 'Apology', 'Request', 'Announcement', 'Thank You', 'Introduction'] as const;
const RECIPIENT_TYPES = ['Customer', 'Client', 'Colleague', 'Manager', 'Vendor', 'Partner', 'Potential Customer', 'Team Member'] as const;
const TONES = ['Professional', 'Friendly', 'Formal', 'Casual', 'Empathetic', 'Urgent'] as const;
const CALL_TO_ACTIONS = ['Schedule a Call', 'Reply to Confirm', 'Visit Website', 'Download Resource', 'Purchase Now', 'Sign Up', 'Request More Info', 'None'] as const;

interface EmailResult {
  subject: string;
  body: string;
  shortVersion: string;
  followUpVersion: string;
}

export default function EmailGenerator() {
  const [purpose, setPurpose] = useState<string>(EMAIL_PURPOSES[0]);
  const [recipientType, setRecipientType] = useState<string>(RECIPIENT_TYPES[0]);
  const [keyMessage, setKeyMessage] = useState('');
  const [tone, setTone] = useState<string>(TONES[0]);
  const [callToAction, setCallToAction] = useState<string>(CALL_TO_ACTIONS[0]);
  const [recipientName, setRecipientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [result, setResult] = useState<EmailResult | null>(null);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [copied, setCopied] = useState('');

  const validate = () => {
    return keyMessage.length >= 10;
  };

  const generateEmail = () => {
    if (!validate()) return;

    const subject = generateSubject(purpose, keyMessage);
    const body = generateBody(purpose, recipientType, keyMessage, tone, callToAction, recipientName, companyName);
    const shortVersion = generateShortVersion(purpose, keyMessage, tone, recipientName);
    const followUpVersion = generateFollowUpVersion(purpose, keyMessage, tone, recipientName);

    setResult({ subject, body, shortVersion, followUpVersion });
    setInsight(generateEmailInsight(purpose, tone, callToAction));
    setCopied('');
  };

  const generateSubject = (p: string, message: string): string => {
    const subjects: Record<string, string[]> = {
      Support: [
        `How We Can Help: ${message.slice(0, 40)}...`,
        `Your Support Request - Here's What We Found`,
        `Following Up on Your Recent Inquiry`,
      ],
      Sales: [
        `Exclusive Offer for ${companyName || 'You'}`,
        `How We Helped Similar Companies Achieve Results`,
        `Quick Question About Your Goals`,
      ],
      'Follow-up': [
        `Following Up: ${message.slice(0, 30)}`,
        `Checking In - Would Love to Hear From You`,
        `Still Interested? Here's an Update`,
      ],
      Apology: [
        `We Apologize for the Inconvenience`,
        `Addressing Your Concerns`,
        `Making Things Right`,
      ],
      Request: [
        `A Quick Favor to Ask`,
        `Requesting Your Input`,
        `Would You Be Able to Help?`,
      ],
      Announcement: [
        `Exciting News from ${companyName || 'Our Team'}`,
        `Important Update You Need to Know`,
        `Announcing Something We've Been Working On`,
      ],
      'Thank You': [
        `Thank You for ${message.slice(0, 30)}`,
        `We Really Appreciate Your Help`,
        `Grateful for Your Support`,
      ],
      Introduction: [
        `Introduction: A Solution You Might Love`,
        `Nice to Connect With You`,
        `How We Might Be of Service`,
      ],
    };

    const options = subjects[p] || subjects['Support'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const generateBody = (
    p: string,
    recipient: string,
    message: string,
    t: string,
    cta: string,
    recipientName: string,
    companyName: string
  ): string => {
    const greeting = recipientName ? `Dear ${recipientName},` : `Dear ${recipientType},`;
    const companyGreeting = companyName ? `I hope this message finds you well. I'm reaching out from ${companyName}.` : 'I hope this message finds you well.';

    let body = `${greeting}\n\n${companyGreeting}\n\n`;

    const opener = getOpener(p, t);
    body += `${opener}\n\n`;

    body += `${message}\n\n`;

    if (cta !== 'None') {
      body += `Next Steps:\n`;
      const ctaText = getCTAText(cta);
      body += `${ctaText}\n\n`;
    }

    const closing = getClosing(p, t);
    body += closing;

    return body;
  };

  const getOpener = (p: string, t: string): string => {
    const openers: Record<string, string[]> = {
      Support: [
        'Thank you for reaching out. I wanted to personally address your inquiry and ensure you have all the information you need.',
        'I appreciate you bringing this to our attention. After reviewing your request, here is what I found.',
      ],
      Sales: [
        'I noticed that your company could benefit from our solutions, and I wanted to share how we have helped similar organizations achieve their goals.',
        'After seeing the challenges your industry is facing, I thought our services might be exactly what you are looking for.',
      ],
      'Follow-up': [
        'I wanted to follow up on our previous conversation. Have you had a chance to review the information I sent?',
        'I am checking in to see if you have any questions or if there is anything else I can help you with.',
      ],
      Apology: [
        'I sincerely apologize for the inconvenience you experienced. We take this matter seriously and want to make it right.',
        'Please accept our heartfelt apology. We understand this was frustrating and are committed to improving.',
      ],
      Request: [
        'I hope you do not mind me reaching out. I have a quick request that I believe will benefit both of us.',
        'I am reaching out with a small favor. Would you be able to help me with something?',
      ],
      Announcement: [
        'I am excited to share some news that I believe will be of great interest to you.',
        'We have been working hard on something new, and I am thrilled to finally share it with you.',
      ],
      'Thank You': [
        'I wanted to take a moment to express my sincere gratitude for your recent help.',
        'Thank you so much for taking the time to assist me. Your support means a great deal.',
      ],
      Introduction: [
        'I hope you do not mind a cold introduction. I came across your work and believe there might be a great opportunity for us to connect.',
        'I wanted to introduce myself and share how we might be able to add value to your efforts.',
      ],
    };

    const options = openers[p] || openers['Support'];
    return options[Math.floor(Math.random() * options.length)];
  };

  const getCTAText = (cta: string): string => {
    const ctas: Record<string, string> = {
      'Schedule a Call': 'If you are available, I would love to schedule a quick call to discuss this further. Would any of these times work for you?',
      'Reply to Confirm': 'Please reply to this email to confirm your interest or let me know if you have any questions.',
      'Visit Website': 'Feel free to visit our website at [URL] for more information about our services.',
      'Download Resource': 'You can download the resource I mentioned using this link: [URL]',
      'Purchase Now': 'If this sounds like a good fit, you can get started right away at [URL]. Use code SAVE20 for 20% off.',
      'Sign Up': 'You can sign up for free right here: [URL]. No credit card required.',
      'Request More Info': 'If you would like more information, just reply to this email and I will send over everything you need.',
      'None': '',
    };
    return ctas[cta] || '';
  };

  const getClosing = (p: string, t: string): string => {
    let closing = 'Best regards,\n[Your Name]\n[Your Title]';

    if (p === 'Apology') {
      closing = 'We value your business and hope to restore your trust.\n\nBest regards,\n[Your Name]\n[Your Title]';
    } else if (t === 'Friendly') {
      closing = 'Looking forward to hearing from you!\n\nCheers,\n[Your Name]';
    }

    return closing;
  };

  const generateShortVersion = (p: string, message: string, t: string, recipientName: string): string => {
    const greeting = recipientName ? `Hi ${recipientName},` : 'Hi there,';
    return `${greeting}\n\n${message}\n\nThanks,\n[Your Name]`;
  };

  const generateFollowUpVersion = (p: string, message: string, t: string, recipientName: string): string => {
    const greeting = recipientName ? `Hi ${recipientName},` : 'Hi there,';
    return `${greeting}\n\nI wanted to follow up on my previous email about ${message.slice(0, 30)}.\n\nJust checking in to see if you had a chance to review this. Happy to answer any questions or provide more details.\n\nThanks,\n[Your Name]`;
  };

  const copyToClipboard = async (type: 'subject' | 'body' | 'short' | 'followup') => {
    if (result) {
      let text = '';
      switch (type) {
        case 'subject':
          text = result.subject;
          break;
        case 'body':
          text = `Subject: ${result.subject}\n\n${result.body}`;
          break;
        case 'short':
          text = `Subject: ${result.subject}\n\n${result.shortVersion}`;
          break;
        case 'followup':
          text = `Subject: ${result.subject}\n\n${result.followUpVersion}`;
          break;
      }
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    }
  };

  return (
    <ToolLayout toolId="email-generator" category="ai">
      <section className="space-y-8">
        <div className="bg-white p-8 border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Professional Email Generator</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Email Purpose</label>
                <select
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {EMAIL_PURPOSES.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recipient Type</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {RECIPIENT_TYPES.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recipient Name (Optional)</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Company Name (Optional)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Acme Corp"
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {TONES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Call to Action</label>
                <select
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  className="w-full p-4 border rounded outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  {CALL_TO_ACTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Key Message</label>
              <textarea
                value={keyMessage}
                onChange={(e) => setKeyMessage(e.target.value)}
                placeholder="Describe the main point of your email..."
                className="w-full h-32 p-4 border rounded outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          </div>
          <button
            onClick={generateEmail}
            disabled={!validate()}
            className="mt-8 w-full bg-slate-900 text-white font-bold py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Email
          </button>
        </div>

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Full Email</h3>
                <button
                  onClick={() => copyToClipboard('body')}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/90 transition-colors"
                >
                  {copied === 'body' ? 'Copied!' : 'Copy Full Email'}
                </button>
              </div>
              <div className="bg-slate-50 p-4 rounded border-l-4 border-primary">
                <p className="text-sm font-semibold text-slate-600 mb-2">Subject: {result.subject}</p>
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{result.body}</p>
              </div>
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Short Version</h3>
                <button
                  onClick={() => copyToClipboard('short')}
                  className="px-4 py-2 bg-slate-600 text-white text-sm font-semibold rounded hover:bg-slate-500 transition-colors"
                >
                  {copied === 'short' ? 'Copied!' : 'Copy Short'}
                </button>
              </div>
              <div className="bg-amber-50 p-4 rounded border-l-4 border-amber-400">
                <p className="text-sm font-semibold text-slate-600 mb-2">Subject: {result.subject}</p>
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">{result.shortVersion}</p>
              </div>
            </div>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Follow-up Version</h3>
                <button
                  onClick={() => copyToClipboard('followup')}
                  className="px-4 py-2 bg-slate-600 text-white text-sm font-semibold rounded hover:bg-slate-500 transition-colors"
                >
                  {copied === 'followup' ? 'Copied!' : 'Copy Follow-up'}
                </button>
              </div>
              <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-400">
                <p className="text-sm font-semibold text-slate-600 mb-2">Subject: {result.subject}</p>
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">{result.followUpVersion}</p>
              </div>
            </div>

            <AIInsightPanel insight={insight} />
          </div>
        )}
      </section>
    </ToolLayout>
  );
}
