import { applicationConfig } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { withThemeByClassName } from '@storybook/addon-themes';
import { create } from 'storybook/theming/create';
import type { Preview } from '@storybook/angular';

const lcDocsTheme = create({
  base: 'light',
  colorPrimary: '#208497',
  colorSecondary: '#208497',
  textColor: '#1F2937',
  textMutedColor: '#6B7280',
  fontBase: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontCode: '"Fira Code", "JetBrains Mono", monospace',
});

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [provideHttpClient(), provideAnimations()],
    }),
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
      parentSelector: ':root',
    }),
  ],
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: lcDocsTheme,
      source: {
        type: 'dynamic',
        state: 'open',
      },
      canvas: {
        sourceState: 'shown',
      },
    },
    options: {
      storySort: {
        order: [
          'Installation',
          'Design Tokens',
          ['Colors', 'Spacing', 'Typography', 'Elevation', 'Sizes & Animation'],
          'Components',
          'Form',
          'Data Display',
          'Feedback',
          'Navigation',
          'Layout',
          '*',
        ],
      },
    },
  },
};

export default preview;
