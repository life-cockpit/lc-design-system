import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@life-cockpit/ui-kit';

interface SpacingToken {
  name: string;
  value: string;
  pixels: string;
  rem: string;
}

@Component({
  selector: 'app-spacing',
  imports: [CommonModule, CardComponent],
  templateUrl: './spacing.component.html',
  styleUrl: './spacing.component.scss',
})
export class SpacingComponent {
  // Moved template to spacing.component.html
  protected spacingTokens: SpacingToken[] = [
    { name: 'spacing-1', value: '0.25rem', pixels: '4px', rem: '0.25rem' },
    { name: 'spacing-2', value: '0.5rem', pixels: '8px', rem: '0.5rem' },
    { name: 'spacing-3', value: '0.75rem', pixels: '12px', rem: '0.75rem' },
    { name: 'spacing-4', value: '1rem', pixels: '16px', rem: '1rem' },
    { name: 'spacing-5', value: '1.25rem', pixels: '20px', rem: '1.25rem' },
    { name: 'spacing-6', value: '1.5rem', pixels: '24px', rem: '1.5rem' },
    { name: 'spacing-8', value: '2rem', pixels: '32px', rem: '2rem' },
    { name: 'spacing-10', value: '2.5rem', pixels: '40px', rem: '2.5rem' },
    { name: 'spacing-12', value: '3rem', pixels: '48px', rem: '3rem' },
    { name: 'spacing-16', value: '4rem', pixels: '64px', rem: '4rem' },
  ];

  protected paddingExample = `<!-- Tailwind CSS -->
<div class="p-4">Padding: 1rem</div>
<div class="px-6 py-4">Padding X: 1.5rem, Y: 1rem</div>

<!-- SCSS -->
.container {
  padding: var(--spacing-4);
}`;

  protected marginExample = `<!-- Tailwind CSS -->
<div class="mb-4">Margin bottom: 1rem</div>
<div class="mx-auto">Margin horizontal: auto</div>

<!-- SCSS -->
.section {
  margin-bottom: var(--spacing-6);
}`;

  protected gapExample = `<!-- Tailwind CSS -->
<div class="flex gap-4">Gap: 1rem</div>
<div class="grid grid-cols-3 gap-6">Gap: 1.5rem</div>

<!-- SCSS -->
.flex-container {
  display: flex;
  gap: var(--spacing-4);
}`;
}
