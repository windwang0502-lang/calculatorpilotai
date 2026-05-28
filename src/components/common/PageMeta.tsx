import { HelmetProvider, Helmet } from 'react-helmet-async';
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
}: PageMetaProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    {canonical && <link rel="canonical" href={canonical} />}
    <meta name="robots" content="index, follow" />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={ogType} />
    {canonical && <meta property="og:url" content={canonical} />}
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

export const AppWrapper = ({ children }: { children: React.ReactNode }) => (
  <HelmetProvider>
    <TooltipProvider>
      <SpeedInsights />
      {children}
    </TooltipProvider>
  </HelmetProvider>
);

export default PageMeta;
