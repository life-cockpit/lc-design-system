#!/usr/bin/env node
/**
 * Generates manifests/components.json from Storybook's index.json.
 * Required because @storybook/mcp needs this manifest but Angular has no
 * built-in docgen to generate it automatically (unlike React).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

const STORYBOOK_OUTPUT = join(process.cwd(), 'dist/storybook/angular-ui-kit');
const INDEX_PATH = join(STORYBOOK_OUTPUT, 'index.json');
const MANIFESTS_DIR = join(STORYBOOK_OUTPUT, 'manifests');
const OUTPUT_PATH = join(MANIFESTS_DIR, 'components.json');

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
  // Derive component name from title (e.g. "Components/Accordion" -> "Accordion")
  const titleParts = group.title.split('/');
  const name = titleParts[titleParts.length - 1];
  const id = group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  components[id] = {
    id,
    path: group.componentPath || group.importPath,
    name,
    stories: group.stories.map(s => ({
      name: s.name,
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

console.log(`Generated components.json with ${Object.keys(components).length} components`);
