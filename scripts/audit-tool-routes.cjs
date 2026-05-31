/**
 * Audit script: Verify tool routes match component files and route definitions
 * Compares src/data/tools.ts against src/routes.tsx and actual component files
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// Parse tools.ts to get all tool entries
function parseToolsData() {
  const content = fs.readFileSync(path.join(ROOT, 'src/data/tools.ts'), 'utf8');
  const tools = [];

  // Extract tools from each category block
  const toolRegex = /{\s*name:\s*['"]([^'"]+)['"]\s*,\s*slug:\s*['"]([^'"]+)['"]\s*,\s*category:\s*['"](\w+)['"]\s*,\s*description:\s*['"]([^'"]+)['"]\s*,\s*route:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = toolRegex.exec(content)) !== null) {
    tools.push({
      name: match[1],
      slug: match[2],
      category: match[3],
      description: match[4],
      route: match[5]
    });
  }

  return tools;
}

// Get all component files by category
function getComponentFiles() {
  const categories = ['finance', 'health', 'shipping', 'ai', 'time'];
  const files = {};

  categories.forEach(cat => {
    const dir = path.join(ROOT, 'src/pages/tools', cat);
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        if (file.endsWith('.tsx') && !file.includes('CategoryPage')) {
          const componentName = file.replace('.tsx', '');
          files[componentName] = `./pages/tools/${cat}/${file}`;
        }
      });
    }
  });

  return files;
}

// Parse routes.tsx imports and routes
function parseRoutes() {
  const content = fs.readFileSync(path.join(ROOT, 'src/routes.tsx'), 'utf8');
  const imports = {};
  const routes = [];

  // Match lazy imports
  const importRegex = /const\s+(\w+)\s+=\s+React\.lazy\(\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)\)/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports[match[1]] = match[2];
  }

  // Match route definitions - capture variable name between LazyWrap( and )
  const routeRegex = /\{\s*name:\s*['"]([^'"]+)['"]\s*,\s*path:\s*['"]([^'"]+)['"]\s*,\s*element:\s*LazyWrap\(\s*(\w+)/g;
  while ((match = routeRegex.exec(content)) !== null) {
    routes.push({
      name: match[1],
      path: match[2],
      component: match[3]
    });
  }

  return { imports, routes };
}

// Check if component file exists
function componentExists(importPath) {
  const fullPath = path.join(ROOT, 'src', importPath.replace('@/', ''));
  return fs.existsSync(fullPath + '.tsx') || fs.existsSync(fullPath + '.ts');
}

// Build slug to component name mapping
function buildSlugToComponentMap(componentFiles) {
  const map = {};

  // Map from component file names to slug patterns
  // PromptGenerator -> prompt-generator
  // TokenCalculator -> token-calculator
  // etc.

  Object.keys(componentFiles).forEach(componentName => {
    // Convert PascalCase to kebab-case
    const slug = componentName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
    map[slug] = componentName;
  });

  // Handle special cases
  const specialCases = {
    'bmi-calculate': 'BMICalculator',
    'fedex-dim-weight': 'FedExDimWeightCalculator',
    'ups-dim-weight': 'UPSDimWeightCalculator',
    '401k': 'FourOhOneKCalculator',
    'vo2-max': 'VO2MaxCalculator',
    'openai': 'OpenAICostCalculator',
    'rag-chunk-size': 'RAGChunkSizeCalculator',
  };

  // Override with special cases
  Object.keys(specialCases).forEach(key => {
    map[key] = specialCases[key];
  });

  return map;
}

// Run audit
function runAudit() {
  console.log('='.repeat(70));
  console.log('TOOL ROUTE AUDIT');
  console.log('='.repeat(70));

  const tools = parseToolsData();
  const componentFiles = getComponentFiles();
  const { imports, routes } = parseRoutes();
  const slugToComponent = buildSlugToComponentMap(componentFiles);

  console.log(`\nTotal tools in tools.ts: ${tools.length}`);
  console.log(`Total component files: ${Object.keys(componentFiles).length}`);
  console.log(`Total routes in routes.tsx: ${routes.length}`);
  console.log(`Total imports in routes.tsx: ${Object.keys(imports).length}`);

  const issues = [];

  // Build route path -> component mapping
  const routePathToComponent = {};
  routes.forEach(route => {
    routePathToComponent[route.path] = route.component;
  });

  console.log('\n' + '-'.repeat(70));
  console.log('CHECKING TOOL ROUTES');
  console.log('-'.repeat(70));

  tools.forEach(tool => {
    const expectedRoute = `/tools/${tool.category}/${tool.slug}`;
    const hasRoute = !!routePathToComponent[expectedRoute];
    const hasRouteInTools = !!routePathToComponent[tool.route];
    const actualRoute = tool.route;

    // Check route path
    if (!hasRoute && !hasRouteInTools) {
      issues.push({
        type: 'MISSING_ROUTE',
        tool: tool.name,
        slug: tool.slug,
        category: tool.category,
        expectedRoute: expectedRoute,
        actualRoute: actualRoute,
        message: `Route '${expectedRoute}' not found in routes.tsx`
      });
    } else if (actualRoute !== expectedRoute) {
      issues.push({
        type: 'ROUTE_MISMATCH',
        tool: tool.name,
        slug: tool.slug,
        category: tool.category,
        actualRoute: actualRoute,
        expectedRoute: expectedRoute,
        message: `Route '${actualRoute}' should be '${expectedRoute}'`
      });
    }

    // Check component exists
    const routeKey = hasRoute ? expectedRoute : actualRoute;
    const componentName = routePathToComponent[routeKey];

    if (componentName) {
      const importPath = imports[componentName];
      if (!importPath) {
        issues.push({
          type: 'MISSING_IMPORT',
          tool: tool.name,
          slug: tool.slug,
          category: tool.category,
          componentName: componentName,
          message: `Component '${componentName}' not imported in routes.tsx`
        });
      } else if (!componentExists(importPath)) {
        issues.push({
          type: 'MISSING_COMPONENT_FILE',
          tool: tool.name,
          slug: tool.slug,
          category: tool.category,
          componentName: componentName,
          importPath: importPath,
          message: `Component file '${importPath}.tsx' does not exist`
        });
      }
    }
  });

  console.log('\n' + '-'.repeat(70));
  console.log('CHECKING FOR UNREGISTERED COMPONENTS');
  console.log('-'.repeat(70));

  const toolRoutes = new Set(tools.map(t => `/tools/${t.category}/${t.slug}`));
  const expectedToolRoutes = new Set(tools.map(t => t.route));
  const allToolRoutes = new Set([...toolRoutes, ...expectedToolRoutes]);

  routes.forEach(route => {
    // Skip non-tool routes and category routes
    if (!route.path.startsWith('/tools/')) return;
    if (route.path.match(/^\/tools\/\w+$/)) return;
    if (route.path.match(/^\/tools\/:/)) return; // Parametric routes

    if (!allToolRoutes.has(route.path)) {
      issues.push({
        type: 'ORPHAN_ROUTE',
        routePath: route.path,
        routeName: route.name,
        componentName: route.component,
        message: `Route '${route.path}' (${route.name}) not in tools.ts`
      });
    }
  });

  console.log('\n' + '-'.repeat(70));
  console.log('CHECKING COMPONENT FILE COVERAGE');
  console.log('-'.repeat(70));

  // Check if all component files have routes
  Object.keys(componentFiles).forEach(componentName => {
    const routePath = componentFiles[componentName]
      .replace('./pages/tools/', '')
      .replace(/\//g, '/')
      .replace('.tsx', '');

    // Find routes for this component
    const routesForComponent = routes.filter(r => r.component === componentName);

    if (routesForComponent.length === 0) {
      issues.push({
        type: 'UNROUTED_COMPONENT',
        componentName: componentName,
        filePath: componentFiles[componentName],
        message: `Component '${componentName}' has no route`
      });
    }
  });

  console.log('\n' + '-'.repeat(70));
  console.log('SUMMARY BY TYPE');
  console.log('-'.repeat(70));

  const issuesByType = {};
  issues.forEach(issue => {
    if (!issuesByType[issue.type]) issuesByType[issue.type] = [];
    issuesByType[issue.type].push(issue);
  });

  Object.keys(issuesByType).forEach(type => {
    console.log(`\n${type} (${issuesByType[type].length}):`);
    issuesByType[type].forEach(issue => {
      console.log(`  - ${issue.message}`);
    });
  });

  console.log(`\nTotal issues found: ${issues.length}`);

  return issues;
}

// Check for duplicate slugs across all tools
function checkDuplicates() {
  const tools = parseToolsData();
  const slugCount = {};

  tools.forEach(tool => {
    if (!slugCount[tool.slug]) slugCount[tool.slug] = [];
    slugCount[tool.slug].push(tool);
  });

  const duplicates = Object.entries(slugCount).filter(([_, items]) => items.length > 1);

  if (duplicates.length > 0) {
    console.log('\n' + '-'.repeat(70));
    console.log('DUPLICATE SLUGS DETECTED');
    console.log('-'.repeat(70));
    duplicates.forEach(([slug, items]) => {
      console.log(`\nSlug '${slug}' appears ${items.length} times:`);
      items.forEach(item => {
        console.log(`  - ${item.name} (${item.category}) @ ${item.route}`);
      });
    });
    return duplicates;
  }

  return [];
}

// Check for common undefined variable patterns
function checkCommonPatterns() {
  const categories = ['finance', 'health', 'shipping', 'ai', 'time'];
  const issues = [];

  categories.forEach(cat => {
    const dir = path.join(ROOT, 'src/pages/tools', cat);
    if (!fs.existsSync(dir)) return;

    fs.readdirSync(dir).forEach(file => {
      if (!file.endsWith('.tsx') || file.includes('Category')) return;

      const content = fs.readFileSync(path.join(dir, file), 'utf8');

      // Check for faqs usage without definition
      if (content.includes('faqs.map') || content.includes('faqs[')) {
        if (!content.match(/const\s+faqs\s*=/)) {
          issues.push({
            type: 'UNDEFINED_VARIABLE',
            file: `./pages/tools/${cat}/${file}`,
            variable: 'faqs',
            message: `Component '${file}' uses 'faqs' variable but it's not defined`
          });
        }
      }

      // Check for unused imports
      const imports = content.match(/import\s+.*?from\s+['"](.+?)['"]/g) || [];
      imports.forEach(imp => {
        const match = imp.match(/import\s+(.*?)\s+from\s+['"](.+?)['"]/);
        if (match) {
          const importedItems = match[1].replace(/\{|\}/g, '').split(',').map(i => i.trim());
          const importPath = match[2];

          importedItems.forEach(item => {
            if (item && !content.includes(item) && item !== 'React' && item !== 'useState' && item !== 'useEffect') {
              // This is a potential unused import, but we'll skip for now as it may be intentional
            }
          });
        }
      });
    });
  });

  return issues;
}

const allIssues = runAudit();
const duplicates = checkDuplicates();
const commonIssues = checkCommonPatterns();

console.log('\n' + '-'.repeat(70));
console.log('COMMON PATTERN CHECKS');
console.log('-'.repeat(70));

if (commonIssues.length > 0) {
  console.log(`\nISSUES FOUND (${commonIssues.length}):`);
  commonIssues.forEach(issue => {
    console.log(`  - ${issue.message}`);
  });
} else {
  console.log('\nNo common pattern issues found.');
}

console.log('\n' + '='.repeat(70));
if (allIssues.length === 0 && duplicates.length === 0) {
  console.log('AUDIT PASSED: No issues found!');
} else {
  console.log(`AUDIT FAILED: ${allIssues.length} issues + ${duplicates.length} duplicate groups`);
}
console.log('='.repeat(70));

module.exports = { issues: allIssues, duplicates };