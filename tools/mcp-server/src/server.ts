import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load component metadata
const metadataPath = resolve(__dirname, '../../../libs/ui-kit/component-metadata.json');
let rawMetadata: string;
try {
  rawMetadata = readFileSync(metadataPath, 'utf-8');
} catch {
  // Fallback for Lambda: metadata is co-located in dist/
  rawMetadata = readFileSync(resolve(__dirname, './component-metadata.json'), 'utf-8');
}
const metadata = JSON.parse(rawMetadata);

interface ComponentInput {
  name: string;
  type: string;
  default?: string;
  required: boolean;
  description: string;
}

interface ComponentOutput {
  name: string;
  type: string;
  description: string;
}

interface ComponentSlot {
  name: string;
  description: string;
}

interface ComponentMeta {
  name: string;
  selector: string;
  description: string;
  category: string;
  examples: string[];
  inputs: ComponentInput[];
  outputs: ComponentOutput[];
  types: Record<string, string[]>;
  slots: ComponentSlot[];
  filePath: string;
}

const components: ComponentMeta[] = metadata.components;

// ============================================================================
// Create MCP Server (factory for stateless mode — one instance per request)
// ============================================================================

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'Life-Cockpit Design System',
    version: metadata.version,
  });

// ============================================================================
// Tools
// ============================================================================

server.registerTool(
  'list_components',
  {
    description: 'List all available components in the Life-Cockpit Design System. Returns name, selector, category, and a short description for each.',
  },
  async () => {
    const list = components.map((c) => ({
      name: c.name,
      selector: c.selector,
      category: c.category,
      description: c.description.split('\n')[0],
    }));

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(list, null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  'get_component',
  {
    description: 'Get full details of a specific component including all inputs, outputs, slots, types, and usage examples.',
    inputSchema: { selector: z.string().describe('Component selector, e.g. "lc-button"') },
  },
  async ({ selector }) => {
    const component = components.find(
      (c) => c.selector === selector || c.name === selector || c.selector === `lc-${selector}`
    );

    if (!component) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Component "${selector}" not found. Use list_components to see all available components.`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(component, null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  'get_components_by_category',
  {
    description: 'Get all components in a specific category. Categories: Form, Layout, Navigation, Data Display, Feedback, Other.',
    inputSchema: { category: z.string().describe('Category name, e.g. "Form", "Layout", "Feedback"') },
  },
  async ({ category }) => {
    const filtered = components.filter(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );

    if (filtered.length === 0) {
      const categories = [...new Set(components.map((c) => c.category))];
      return {
        content: [
          {
            type: 'text' as const,
            text: `No components found in category "${category}". Available categories: ${categories.join(', ')}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(filtered, null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  'search_components',
  {
    description: 'Search components by name, selector, or description. Returns matching components with full details.',
    inputSchema: { query: z.string().describe('Search query (matched against name, selector, description)') },
  },
  async ({ query }) => {
    const q = query.toLowerCase();
    const results = components.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.selector.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );

    if (results.length === 0) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `No components found matching "${query}".`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  'get_design_tokens',
  {
    description: 'Get information about the design token system including available token categories and how to use them.',
  },
  async () => {
    const tokenInfo = {
      description:
        'Life-Cockpit uses Style Dictionary to generate design tokens. Tokens are available as SCSS variables, CSS custom properties, and TypeScript constants.',
      installation: `import { tokens } from '@life-cockpit/ui-kit';`,
      scss_usage: `@use '@life-cockpit/ui-kit/styles' as lc;\n\n.my-element {\n  color: lc.$color-primary-500;\n  padding: lc.$spacing-4;\n}`,
      css_usage: `.my-element {\n  color: var(--lc-color-primary-500);\n  padding: var(--lc-spacing-4);\n}`,
      categories: [
        'Colors (primary, neutral, success, warning, error, info)',
        'Spacing (0-96, based on 4px grid)',
        'Typography (font families, sizes, weights, line heights)',
        'Border Radius (none, sm, md, lg, xl, full)',
        'Shadows/Elevation (sm, md, lg, xl)',
        'Animation (durations, easings)',
      ],
      theme: {
        description: 'Built-in light/dark theme support via ThemeService',
        usage: `import { ThemeService } from '@life-cockpit/ui-kit';\n\nconst theme = inject(ThemeService);\ntheme.toggleTheme();`,
      },
    };

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(tokenInfo, null, 2),
        },
      ],
    };
  }
);

server.registerTool(
  'get_usage_guide',
  {
    description: 'Get installation and setup instructions for the Life-Cockpit Design System in an Angular project.',
  },
  async () => {
    const guide = {
      name: '@life-cockpit/ui-kit',
      framework: 'Angular 21+',
      installation: 'npm install @life-cockpit/ui-kit',
      setup: [
        '1. Install the package: npm install @life-cockpit/ui-kit',
        '2. Import global styles in your styles.scss: @use "@life-cockpit/ui-kit/styles";',
        '3. Import components directly in your Angular components (standalone):',
      ],
      example: `import { Component } from '@angular/core';
import { ButtonComponent, CardComponent } from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent, CardComponent],
  template: \`
    <lc-card title="Hello" variant="elevated" padding="md">
      <p>Content inside a card</p>
      <lc-button variant="primary" size="md" (clicked)="onSubmit()">
        Submit
      </lc-button>
    </lc-card>
  \`
})
export class ExampleComponent {
  onSubmit() { console.log('clicked'); }
}`,
      features: [
        'Standalone components (no module imports needed)',
        'OnPush change detection',
        'Full TypeScript support with strict types',
        'WCAG 2.1 AA accessible',
        'Light/Dark theme support',
        'Responsive (mobile-first)',
        'Tree-shakable (only bundle what you use)',
      ],
      peerDependencies: {
        '@angular/core': '>=21.0.0',
        '@angular/common': '>=21.0.0',
        '@angular/cdk': '>=21.0.0',
        rxjs: '>=7.8.0',
      },
    };

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(guide, null, 2),
        },
      ],
    };
  }
);

  return server;
}
