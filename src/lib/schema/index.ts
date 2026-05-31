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
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateArticleSchema = ({
  headline,
  description,
  url,
  image = "https://www.calculatorpilotai.com/og-image.png",
  datePublished = "2026-05-27",
  dateModified = "2026-05-27",
  authorName = "CalculatorPilot AI",
}: {
  headline: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author: {
    "@type": "Organization",
    name: authorName,
  },
  publisher: {
    "@type": "Organization",
    name: "CalculatorPilot AI",
    logo: {
      "@type": "ImageObject",
      url: "https://www.calculatorpilotai.com/logo.png",
    },
  },
  mainEntityOfPage: url,
});

export const generateCollectionPageSchema = ({
  name,
  description,
  url,
  itemList,
}: {
  name: string;
  description: string;
  url: string;
  itemList: { name: string; url: string }[];
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url,
  mainEntity: {
    "@type": "ItemList",
    itemListElement: itemList.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  },
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CalculatorPilot AI",
  url: "https://www.calculatorpilotai.com",
  logo: "https://www.calculatorpilotai.com/logo.png",
});
