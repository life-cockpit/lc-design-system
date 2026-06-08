import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: [
    '../src/docs/**/*.mdx',
    '../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-themes',
    '@storybook/addon-mcp',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  features: {
    componentsManifest: true,
  },
  staticDirs: [
    { from: '../../../node_modules/@tabler/icons/icons', to: '/tabler-icons' },
    { from: '../src/assets', to: '/assets' },
  ],
}

export default config;
