#!/usr/bin/env node
/**
 * Generates manifests/components.json from Storybook's index.json + source files.
 * Required because @storybook/mcp needs this manifest but Angular has no
 * built-in docgen to generate it automatically (unlike React).
 *
 * Extracts: story IDs, code snippets (templates), component props (@Input/@Output),
 * and component descriptions from stories meta.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, resolve } from 'path';

const ROOT = process.cwd();
const STORYBOOK_OUTPUT = join(ROOT, 'dist/storybook/angular-ui-kit');
const INDEX_PATH = join(STORYBOOK_OUTPUT, 'index.json');
const MANIFESTS_DIR = join(STORYBOOK_OUTPUT, 'manifests');
const OUTPUT_PATH = join(MANIFESTS_DIR, 'components.json');

// --- Helpers ---

/** Extract @Input() and @Output() declarations from a component .ts file */
function extractProps(componentPath) {
  const absPath = resolve(ROOT, componentPath.replace(/^\.\//, ''));
  if (!existsSync(absPath)) return null;
  const src = readFileSync(absPath, 'utf-8');

  const inputs = [];
  const outputs = [];

  // Match @Input() declarations: @Input() name: Type = default;
  const inputRegex = /@Input\(\s*(?:\{[^}]*\}\s*)?\)\s*(?:readonly\s+)?(\w+)(?:\s*[!?]?\s*:\s*([^=;]+?))?(?:\s*=\s*([^;]+))?\s*;/g;
  let m;
  while ((m = inputRegex.exec(src)) !== null) {
    inputs.push({
      name: m[1],
      type: m[2]?.trim() || 'any',
      default: m[3]?.trim() || undefined,
    });
  }

  // Match input() signal syntax: name = input<Type>(default)
  const signalInputRegex = /(\w+)\s*=\s*input(?:<([^>]+)>)?\s*\(([^)]*)\)/g;
  while ((m = signalInputRegex.exec(src)) !== null) {
    inputs.push({
      name: m[1],
      type: m[2]?.trim() || 'any',
      default: m[3]?.trim() || undefined,
    });
  }

  // Match @Output() declarations
  const outputRegex = /@Output\(\s*\)\s*(?:readonly\s+)?(\w+)/g;
  while ((m = outputRegex.exec(src)) !== null) {
    outputs.push({ name: m[1], type: 'EventEmitter' });
  }

  // Match output() signal syntax
  const signalOutputRegex = /(\w+)\s*=\s*output(?:<([^>]+)>)?\s*\(/g;
  while ((m = signalOutputRegex.exec(src)) !== null) {
    outputs.push({ name: m[1], type: m[2]?.trim() || 'void' });
  }

  if (inputs.length === 0 && outputs.length === 0) return null;
  return { inputs, outputs };
}

/** Extract story snippets and description from a .stories.ts file */
function extractStoryData(storiesPath, exportNames) {
  const absPath = resolve(ROOT, storiesPath.replace(/^\.\//, ''));
  if (!existsSync(absPath)) return { snippets: {}, description: '' };
  const src = readFileSync(absPath, 'utf-8');

  // Extract component description from meta
  let description = '';
  const descMatch = src.match(/description:\s*\{\s*component:\s*`([^`]+)`/s) ||
                    src.match(/description:\s*\{\s*component:\s*['"]([^'"]+)['"]/);
  if (descMatch) {
    description = descMatch[1].trim();
  }

  // Extract template snippets per export
  const snippets = {};
  for (const exportName of exportNames) {
    // Find the story export and extract its template
    const storyPattern = new RegExp(
      `export\\s+const\\s+${exportName}[^=]*=\\s*\\{([\\s\\S]*?)(?:^\\};?|^export\\s)`,
      'm'
    );
    const storyMatch = src.match(storyPattern);
    if (storyMatch) {
      const storyBlock = storyMatch[1];
      // Extract template string
      const templateMatch = storyBlock.match(/template:\s*`([^`]+)`/) ||
                           storyBlock.match(/template:\s*'([^']+)'/) ||
                           storyBlock.match(/template:\s*"([^"]+)"/);
      if (templateMatch) {
        snippets[exportName] = templateMatch[1].trim();
      }
    }
  }

  return { snippets, description };
}

/** Format props as a TypeScript-like summary string */
function formatPropsAsSummary(props) {
  if (!props) return '';
  const lines = [];
  if (props.inputs.length > 0) {
    lines.push('// Inputs (Props)');
    for (const p of props.inputs) {
      const def = p.default ? ` = ${p.default}` : '';
      lines.push(`@Input() ${p.name}: ${p.type}${def};`);
    }
  }
  if (props.outputs.length > 0) {
    lines.push('// Outputs (Events)');
    for (const p of props.outputs) {
      lines.push(`@Output() ${p.name}: ${p.type};`);
    }
  }
  return lines.join('\n');
}

// --- Main ---

const index = JSON.parse(readFileSync(INDEX_PATH, 'utf-8'));
const entries = Object.values(index.entries);
const stories = entries.filter(e => e.type === 'story');

// Group stories by componentPath (or title as fallback)
const componentGroups = new Map();
for (const story of stories) {
  const key = story.componentPath || story.title;
  if (!componentGroups.has(key)) {
    componentGroups.set(key, {
      componentPath: story.componentPath,
      title: story.title,
      importPath: story.importPath,
      stories: [],
    });
  }
  componentGroups.get(key).stories.push(story);
}

// Build ComponentsManifest
const components = {};
for (const [key, group] of componentGroups) {
  const titleParts = group.title.split('/');
  const name = titleParts[titleParts.length - 1];
  const id = group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Extract props from component source
  const props = group.componentPath ? extractProps(group.componentPath) : null;
  const propsSummary = formatPropsAsSummary(props);

  // Extract story snippets and description from stories file
  const exportNames = group.stories.map(s => s.exportName);
  const { snippets, description } = extractStoryData(group.importPath, exportNames);

  components[id] = {
    id,
    path: group.componentPath || group.importPath,
    name,
    description: description || undefined,
    summary: propsSummary || undefined,
    stories: group.stories.map(s => ({
      id: s.id,
      name: s.name,
      snippet: snippets[s.exportName] || undefined,
    })),
    jsDocTags: {},
  };
}

const manifest = {
  v: 0,
  components,
};

mkdirSync(MANIFESTS_DIR, { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(manifest));

// Stats
let totalSnippets = 0;
let totalWithProps = 0;
for (const comp of Object.values(components)) {
  if (comp.summary) totalWithProps++;
  for (const s of comp.stories) {
    if (s.snippet) totalSnippets++;
  }
}
console.log(`Generated components.json: ${Object.keys(components).length} components, ${totalSnippets} snippets, ${totalWithProps} with props`);
