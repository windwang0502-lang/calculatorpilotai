interface FAQItem {
  question: string;
  answer: string;
}

export const generateFAQSchema = (faqs: FAQItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map((faq) => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer,
    },
  })),
});

export const generateWebAppSchema = ({
  name,
  description,
  url,
  category = "UtilityApplication",
}: {
  name: string;
  description: string;
  url: string;
  category?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name,
  description,
  url,
  applicationCategory: category,
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
});

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url,
  })),
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CalcWise AI",
  url: "https://www.calculatorpilotai.com",
  logo: "https://www.calculatorpilotai.com/logo.png",
});
