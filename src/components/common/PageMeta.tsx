import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SpeedInsights } from '@vercel/speed-insights/react';

interface PageMetaProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}

const PageMeta = ({
  title,
  description,
  canonical,
  ogImage = 'https://www.calculatorpilotai.com/og-image.png',
  ogType = 'website',
  jsonLd,
}: PageMetaProps) => {
  const [fallbackCanonical, setFallbackCanonical] = useState<string | null>(null);

  useEffect(() => {
    if (!canonical) {
      setFallbackCanonical(window.location.href);
    }
  }, [canonical]);

  const resolvedCanonical = canonical || fallbackCanonical;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {resolvedCanonical && <link rel="canonical" href={resolvedCanonical} />}
      <meta name="robots" content="index, follow" />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {resolvedCanonical && <meta property="og:url" content={resolvedCanonical} />}
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <TooltipProvider>
      <SpeedInsights />
      {children}
    </TooltipProvider>
  </HelmetProvider>
);

export default PageMeta;
