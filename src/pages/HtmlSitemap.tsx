import { Link } from 'react-router-dom';
import PageMeta from '@/components/common/PageMeta';
import { generateAllSitemapEntries } from '@/lib/seo/sitemap-generator';
import { FileText } from 'lucide-react';

export default function HtmlSitemap() {
  const entries = generateAllSitemapEntries();

  const groupedEntries = entries.reduce((acc, entry) => {
    const url = new URL(entry.loc);
    const path = url.pathname;

    let category = 'Other';
    if (path === '/') category = 'Home';
    else if (path.startsWith('/tools/finance')) category = 'Finance Tools';
    else if (path.startsWith('/tools/health')) category = 'Health Tools';
    else if (path.startsWith('/tools/shipping')) category = 'Shipping Tools';
    else if (path.startsWith('/tools/ai')) category = 'AI Tools';
    else if (path.startsWith('/tools/time')) category = 'Time Tools';
    else if (path.startsWith('/tools')) category = 'All Tools';
    else if (path.startsWith('/guides')) category = 'Guides';
    else if (path.startsWith('/finance-guides')) category = 'Finance Guides';
    else if (path.startsWith('/health-guides')) category = 'Health Guides';
    else if (path.startsWith('/compare')) category = 'Comparisons';
    else if (path.match(/\/(about|contact|privacy|terms|disclaimer|editorial|ai-disclosure|our-mission)/)) {
      category = 'Legal & Info';
    }

    if (!acc[category]) acc[category] = [];
    acc[category].push({ path, priority: entry.priority });
    return acc;
  }, {} as Record<string, Array<{ path: string; priority: number }>>);

  const categoryOrder = [
    'Home',
    'Finance Tools',
    'Health Tools',
    'Shipping Tools',
    'AI Tools',
    'Time Tools',
    'All Tools',
    'Guides',
    'Finance Guides',
    'Health Guides',
    'Comparisons',
    'Legal & Info',
    'Other',
  ];

  const sortedCategories = categoryOrder.filter(cat => groupedEntries[cat]).concat(
    Object.keys(groupedEntries).filter(cat => !categoryOrder.includes(cat))
  );

  return (
    <>
      <PageMeta
        title="Sitemap | CalculatorPilotAI"
        description="Complete sitemap of all pages on CalculatorPilotAI - find any calculator, tool, or guide quickly."
      />
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse all pages on CalculatorPilotAI. We offer {entries.length} pages of free calculators, tools, and guides.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedCategories.map((category) => (
            <section key={category} className="bg-card rounded-xl p-6 border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {category}
                <span className="text-sm text-muted-foreground font-normal">
                  ({groupedEntries[category].length})
                </span>
              </h2>
              <ul className="space-y-2">
                {groupedEntries[category].map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-sm text-primary hover:underline block truncate"
                      title={item.path}
                    >
                      {item.path}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
