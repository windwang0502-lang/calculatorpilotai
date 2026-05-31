/**
 * Comprehensive Tool Integrity Audit
 * Checks all tool components for runtime safety issues
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const categories = ['finance', 'health', 'shipping', 'ai', 'time'];

function auditComponent(category, file) {
  const content = fs.readFileSync(path.join(ROOT, 'src/pages/tools', category, file), 'utf8');
  const issues = [];

  // 1. Check for default export
  if (!content.includes('export default')) {
    issues.push({ type: 'MISSING_DEFAULT_EXPORT', file, message: 'No default export found' });
  }

  // 2. Check for undefined variables in JSX
  // First, collect all state/const declarations
  const stateDeclarations = content.match(/const\s+\[([^\]]+)\]\s*=\s*useState/g) || [];
  const constDeclarations = content.match(/const\s+(\w+)\s*=/g) || [];
  const functionDeclarations = content.match(/function\s+(\w+)\s*\(/g) || [];

  const definedVariables = new Set();

  // Add React hooks state variables
  stateDeclarations.forEach(decl => {
    const vars = decl.match(/const\s+\[([^\]]+)\]\s*=/)[1].split(',').map(v => v.trim());
    vars.forEach(v => definedVariables.add(v));
  });

  // Add const declarations
  constDeclarations.forEach(decl => {
    const varName = decl.match(/const\s+(\w+)\s*=/)[1];
    definedVariables.add(varName);
  });

  // Add function declarations
  functionDeclarations.forEach(decl => {
    const funcName = decl.match(/function\s+(\w+)\s*\(/)[1];
    definedVariables.add(funcName);
  });

  const jsxMatch = content.match(/return\s*\([^)]*\)/s);
  if (jsxMatch) {
    const jsx = jsxMatch[0];
    // Find variables used in JSX that aren't defined
    const variableUsages = jsx.match(/\{+\s*(\w+(?:\.\w+)*)\s*\}+/g) || [];
    variableUsages.forEach(usage => {
      const varName = usage.replace(/\{|\s|\}/g, '').split('.')[0];
      // Skip common valid patterns
      if (['result', 'insight', 'copied', 'errors', 'toolId', 'category', 'index', 'idx', 'item'].includes(varName)) return;
      // Check if it's defined somewhere in the file
      if (!definedVariables.has(varName)) {
        // Check for imports
        const importMatch = content.match(new RegExp(`import\\s+.*\\b${varName}\\b.*from`));
        if (!importMatch) {
          issues.push({ type: 'UNDEFINED_VARIABLE', file, variable: varName, message: `Variable '${varName}' used but not defined` });
        }
      }
    });
  }

  // 3. Check for faqs usage without definition
  if (content.match(/faqs\.(map|forEach|reduce)|faqs\[/) && !content.match(/const\s+faqs\s*=|faqs:\s*\[/)) {
    issues.push({ type: 'UNDEFINED_FAQS', file, message: 'Component uses faqs but faqs is not defined' });
  }

  // 4. Check ToolLayout props
  const toolLayoutMatch = content.match(/<ToolLayout\s+([^>]+)>/);
  if (toolLayoutMatch) {
    const props = toolLayoutMatch[1];
    if (!props.includes('toolId=')) {
      issues.push({ type: 'INVALID_TOOLLPROPS', file, message: 'ToolLayout missing toolId prop' });
    }
    if (!props.includes('category=')) {
      issues.push({ type: 'INVALID_TOOLLPROPS', file, message: 'ToolLayout missing category prop' });
    }
  }

  // 5. Check for imports that don't exist
  const importRegex = /import\s+(?:{[^}]+}|\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let importMatch;
  while ((importMatch = importRegex.exec(content)) !== null) {
    const importPath = importMatch[1];
    if (importPath.startsWith('@/')) {
      const resolvedPath = path.join(ROOT, 'src', importPath.replace('@/', ''));
      const tsxExists = fs.existsSync(resolvedPath + '.tsx');
      const tsExists = fs.existsSync(resolvedPath + '.ts');
      const indexExists = fs.existsSync(path.join(resolvedPath, 'index.ts')) || fs.existsSync(path.join(resolvedPath, 'index.tsx'));
      if (!tsxExists && !tsExists && !indexExists) {
        issues.push({ type: 'INVALID_IMPORT', file, import: importPath, message: `Import path '${importPath}' does not exist` });
      }
    }
  }

  return issues;
}

function checkDataConsistency() {
  const toolsContent = fs.readFileSync(path.join(ROOT, 'src/data/tools.ts'), 'utf8');
  const routesContent = fs.readFileSync(path.join(ROOT, 'src/routes.tsx'), 'utf8');

  // Extract all tools
  const toolRegex = /slug:\s*['"]([^'"]+)['"]\s*,\s*category:\s*['"](\w+)['"]/g;
  const tools = [];
  let match;
  while ((match = toolRegex.exec(toolsContent)) !== null) {
    tools.push({ slug: match[1], category: match[2] });
  }

  // Extract all routes
  const routeRegex = /path:\s*['"]([^'"]+)['"]/g;
  const routePaths = [];
  while ((match = routeRegex.exec(routesContent)) !== null) {
    routePaths.push(match[1]);
  }

  const issues = [];
  tools.forEach(tool => {
    const expectedRoute = `/tools/${tool.category}/${tool.slug}`;
    if (!routePaths.includes(expectedRoute)) {
      issues.push({ type: 'MISSING_ROUTE', slug: tool.slug, category: tool.category, expectedRoute, message: `Tool '${tool.slug}' missing route '${expectedRoute}'` });
    }
  });

  return issues;
}

console.log('='.repeat(70));
console.log('COMPREHENSIVE TOOL INTEGRITY AUDIT');
console.log('='.repeat(70));

const allIssues = [];
let totalComponents = 0;

categories.forEach(category => {
  const dir = path.join(ROOT, 'src/pages/tools', category);
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && !f.includes('Category'));

  files.forEach(file => {
    totalComponents++;
    const componentIssues = auditComponent(category, file);
    if (componentIssues.length > 0) {
      allIssues.push(...componentIssues);
    }
  });
});

const dataIssues = checkDataConsistency();
allIssues.push(...dataIssues);

console.log(`\nTotal components: ${totalComponents}`);
console.log(`Total issues: ${allIssues.length}`);

if (allIssues.length > 0) {
  console.log('\n' + '-'.repeat(70));
  console.log('ISSUES FOUND');
  console.log('-'.repeat(70));

  const issuesByType = {};
  allIssues.forEach(issue => {
    if (!issuesByType[issue.type]) issuesByType[issue.type] = [];
    issuesByType[issue.type].push(issue);
  });

  Object.keys(issuesByType).forEach(type => {
    console.log(`\n${type} (${issuesByType[type].length}):`);
    issuesByType[type].forEach(issue => {
      console.log(`  - ${issue.message}`);
      if (issue.file) console.log(`    file: ${issue.file}`);
      if (issue.slug) console.log(`    slug: ${issue.slug}, category: ${issue.category}`);
    });
  });
} else {
  console.log('\nNo issues found!');
}

console.log('\n' + '='.repeat(70));
console.log(allIssues.length === 0 ? 'AUDIT PASSED' : 'AUDIT FAILED');
console.log('='.repeat(70));

module.exports = { issues: allIssues, totalComponents };