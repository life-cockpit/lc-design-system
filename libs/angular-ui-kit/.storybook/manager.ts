import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

const lcTheme = create({
  base: 'light',

  // Brand
  brandTitle: 'Life-Cockpit Design System',
  brandUrl: '/',
  brandImage: '/assets/life-cockpit-logo.svg',
  brandTarget: '_self',

  // Colors — LC Primary (#208497) & Neutral palette
  colorPrimary: '#208497',
  colorSecondary: '#208497',

  // UI
  appBg: '#F9FAFB',
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E5E7EB',
  appBorderRadius: 8,

  // Text
  textColor: '#1F2937',
  textInverseColor: '#F9FAFB',
  textMutedColor: '#6B7280',

  // Toolbar
  barTextColor: '#6B7280',
  barSelectedColor: '#208497',
  barHoverColor: '#1A6A79',
  barBg: '#FFFFFF',

  // Form
  inputBg: '#FFFFFF',
  inputBorder: '#D1D5DB',
  inputTextColor: '#1F2937',
  inputBorderRadius: 6,

  // Fonts
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"Fira Code", "JetBrains Mono", monospace',
});

addons.setConfig({
  theme: lcTheme,
});
