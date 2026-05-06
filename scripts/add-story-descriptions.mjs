/**
 * Script to add parameters.docs.description.component to all story files
 * that are missing it. Reads the JSDoc from the component .ts file and
 * injects it into the story meta.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join, basename } from 'path';

const LIB_DIR = join(import.meta.dirname, '..', 'libs', 'angular-ui-kit', 'src', 'lib');

function extractJSDoc(componentTs) {
  const content = readFileSync(componentTs, 'utf-8');

  // Find the JSDoc that comes before @Component or export class
  const jsdocRegex = /\/\*\*\s*\n([\s\S]*?)\s*\*\//g;
  let lastJsdoc = null;
  let match;
  while ((match = jsdocRegex.exec(content)) !== null) {
    // Check if this JSDoc is near a @Component or export class
    const afterMatch = content.slice(match.index + match[0].length, match.index + match[0].length + 200);
    if (afterMatch.match(/^\s*\n\s*@Component/) || afterMatch.match(/^\s*\n\s*export\s+class/)) {
      lastJsdoc = match[0];
      break;
    }
  }

  if (!lastJsdoc) return null;

  // Parse the JSDoc into description + features
  const lines = lastJsdoc
    .replace(/^\/\*\*\s*\n?/, '')
    .replace(/\s*\*\/\s*$/, '')
    .split('\n')
    .map(l => l.replace(/^\s*\*\s?/, ''));

  // Extract title (first non-empty line)
  let title = '';
  let features = [];
  let inFeatures = false;

  for (const line of lines) {
    if (line.startsWith('@example')) break;

    if (line.match(/^Features:/i)) {
      inFeatures = true;
      continue;
    }

    if (inFeatures) {
      if (line.startsWith('- ')) {
        features.push(line);
      } else if (line.trim() === '') {
        continue;
      } else {
        inFeatures = false;
      }
    } else if (!title && line.trim()) {
      title = line.trim();
    }
  }

  // Build markdown description
  let desc = title;
  if (features.length > 0) {
    desc += '\n\n**Key Features:**\n' + features.join('\n');
  }

  return desc;
}

function hasComponentDescription(storyContent) {
  // Check if parameters.docs.description.component already exists
  return storyContent.includes('description:') &&
    storyContent.includes('component:') &&
    // Make sure it's in the meta, not just in a story
    (storyContent.match(/const\s+meta[\s\S]*?parameters[\s\S]*?docs[\s\S]*?description[\s\S]*?component/));
}

function addDescription(storyFile, description) {
  let content = readFileSync(storyFile, 'utf-8');

  if (hasComponentDescription(content)) {
    return false; // Already has it
  }

  const escapedDesc = description.replace(/`/g, '\\`').replace(/\$/g, '\\$');

  // Pattern 1: One-line meta like `const meta: Meta<X> = { title: ..., component: ..., tags: [...] };`
  const oneLineMetaRegex = /^(const meta:\s*Meta<[^>]+>\s*=\s*\{)(.*?)(};)/m;
  const oneLineMatch = content.match(oneLineMetaRegex);

  if (oneLineMatch && !oneLineMatch[2].includes('\n')) {
    // Single-line meta - expand to multi-line
    const inner = oneLineMatch[2].trim();
    const newMeta = `const meta: Meta<${content.match(/Meta<([^>]+)>/)[1]}> = {\n  ${inner.replace(/,\s*/g, ',\n  ')}\n  parameters: {\n    docs: {\n      description: {\n        component: \`\n${description}\n\`,\n      },\n    },\n  },\n};`;
    content = content.replace(oneLineMetaRegex, newMeta);
    writeFileSync(storyFile, content);
    return true;
  }

  // Pattern 2: Multi-line meta with tags: ['autodocs'] but no parameters
  // Find the closing `};` of the meta and add parameters before it
  if (!content.includes('parameters:') || !content.match(/const\s+meta[\s\S]*?parameters/)) {
    // No parameters in meta block - add it before the closing `};`
    // Find `export default meta;` line, then find `};` before it
    const exportIdx = content.indexOf('export default meta;');
    if (exportIdx === -1) return false;

    const metaBlock = content.slice(0, exportIdx);
    const lastClosingBrace = metaBlock.lastIndexOf('};');
    if (lastClosingBrace === -1) return false;

    const before = content.slice(0, lastClosingBrace);
    const after = content.slice(lastClosingBrace);

    // Check if we need a comma
    const trimmedBefore = before.trimEnd();
    const needsComma = !trimmedBefore.endsWith(',') && !trimmedBefore.endsWith('{');

    const insertion = `${needsComma ? ',' : ''}\n  parameters: {\n    docs: {\n      description: {\n        component: \`\n${description}\n\`,\n      },\n    },\n  },\n`;

    content = before + insertion + after;
    writeFileSync(storyFile, content);
    return true;
  }

  return false;
}

// Main
const dirs = readdirSync(LIB_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let updated = 0;
let skipped = 0;
let noJsdoc = 0;

for (const dir of dirs) {
  const dirPath = join(LIB_DIR, dir);
  const storyFile = join(dirPath, `${dir}.stories.ts`);
  const componentFile = join(dirPath, `${dir}.component.ts`);

  if (!existsSync(storyFile)) continue;
  if (!existsSync(componentFile)) continue;

  const desc = extractJSDoc(componentFile);
  if (!desc) {
    console.log(`  SKIP (no JSDoc): ${dir}`);
    noJsdoc++;
    continue;
  }

  const storyContent = readFileSync(storyFile, 'utf-8');
  if (hasComponentDescription(storyContent)) {
    console.log(`  SKIP (already has desc): ${dir}`);
    skipped++;
    continue;
  }

  const result = addDescription(storyFile, desc);
  if (result) {
    console.log(`  ADDED: ${dir}`);
    updated++;
  } else {
    console.log(`  FAILED: ${dir}`);
  }
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped (already had desc), ${noJsdoc} no JSDoc`);
