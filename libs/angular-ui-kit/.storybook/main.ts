import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-themes',
    '@storybook/addon-mcp',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  staticDirs: [
    { from: '../../../node_modules/heroicons', to: '/heroicons' },
    { from: '../src/assets', to: '/assets' },
  ],
}

export default config;
