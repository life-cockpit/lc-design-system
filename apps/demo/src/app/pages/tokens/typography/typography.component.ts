import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@life-cockpit/angular-ui-kit';

interface TypographyToken {
  name: string;
  value: string;
  example: string;
}

@Component({
  selector: 'app-typography',
  imports: [CommonModule, CardComponent],
  templateUrl: './typography.component.html',
  styleUrl: './typography.component.scss',
})
export class TypographyComponent {
  protected fontFamilies = [
    {
      name: 'font-sans',
      value: 'Inter, system-ui, -apple-system, sans-serif',
      example: 'The quick brown fox jumps over the lazy dog',
    },
    {
      name: 'font-mono',
      value: '"Fira Code", Consolas, Monaco, monospace',
      example: 'const message = "Hello World";',
    },
  ];

  protected fontSizes: TypographyToken[] = [
    { name: 'text-xs', value: '0.75rem', example: 'Extra small text' },
    { name: 'text-sm', value: '0.875rem', example: 'Small text' },
    { name: 'text-base', value: '1rem', example: 'Base text' },
    { name: 'text-lg', value: '1.125rem', example: 'Large text' },
    { name: 'text-xl', value: '1.25rem', example: 'Extra large text' },
    { name: 'text-2xl', value: '1.5rem', example: '2X large text' },
    { name: 'text-3xl', value: '1.875rem', example: '3X large text' },
    { name: 'text-4xl', value: '2.25rem', example: '4X large text' },
  ];

  protected fontWeights = [
    { name: 'font-normal', value: '400', example: 'Normal weight' },
    { name: 'font-medium', value: '500', example: 'Medium weight' },
    { name: 'font-semibold', value: '600', example: 'Semibold weight' },
    { name: 'font-bold', value: '700', example: 'Bold weight' },
  ];

  protected lineHeights = [
    {
      name: 'leading-tight',
      value: '1.25',
      example:
        'Tight line height for headings and short text blocks where compact spacing is desired.',
    },
    {
      name: 'leading-normal',
      value: '1.5',
      example:
        'Normal line height for body text, providing comfortable reading experience for paragraphs.',
    },
    {
      name: 'leading-relaxed',
      value: '1.625',
      example:
        'Relaxed line height for body text requiring extra breathing room and improved readability.',
    },
  ];

  protected usageExample = `<!-- Tailwind CSS -->
<h1 class="text-4xl font-bold leading-tight">
  Heading Text
</h1>
<p class="text-base font-normal leading-normal">
  Body text content
</p>

<!-- SCSS -->
h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}`;
}
