import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, CardComponent } from '@life-cockpit/angular-ui-kit';

interface SizeToken {
  name: string;
  height: string;
  padding: string;
  fontSize: string;
  description: string;
}

@Component({
  selector: 'app-sizes',
  imports: [CommonModule, ButtonComponent, CardComponent],
  templateUrl: './sizes.component.html',
  styleUrl: './sizes.component.scss',
})
export class SizesComponent {
  // Moved template to sizes.component.html
  protected sizeTokens: (SizeToken & { useCases: string })[] = [
    {
      name: 'xs',
      height: '1.75rem',
      padding: '0.5rem',
      fontSize: '0.75rem',
      description: 'Extra small size for compact UIs and dense layouts',
      useCases: 'Tags, badges, compact forms',
    },
    {
      name: 'sm',
      height: '2rem',
      padding: '0.75rem',
      fontSize: '0.875rem',
      description: 'Small size for secondary actions and tight spaces',
      useCases: 'Secondary buttons, table actions',
    },
    {
      name: 'md',
      height: '2.5rem',
      padding: '1rem',
      fontSize: '1rem',
      description: 'Medium size - the default for most components',
      useCases: 'Primary forms, standard buttons',
    },
    {
      name: 'lg',
      height: '3rem',
      padding: '1.25rem',
      fontSize: '1.125rem',
      description: 'Large size for emphasis and prominent actions',
      useCases: 'Hero CTAs, prominent forms',
    },
  ];

  protected usageExample = `<!-- Component with size prop -->
<lc-button size="md" variant="primary">
  Medium Button
</lc-button>

<lc-input size="lg" placeholder="Large input">
</lc-input>

<!-- Custom styling with tokens -->
<button class="h-10 px-4 text-base">
  Medium sized button (2.5rem height)
</button>

<!-- SCSS -->
.button-md {
  height: var(--size-md-height);
  padding: 0 var(--size-md-padding);
  font-size: var(--size-md-font-size);
}`;
}
