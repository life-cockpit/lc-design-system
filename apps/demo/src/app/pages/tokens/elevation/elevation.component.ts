import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@life-cockpit/angular-ui-kit';

interface ElevationLevel {
  name: string;
  value: string;
  description: string;
}

@Component({
  selector: 'app-elevation',
  imports: [CommonModule, CardComponent],
  templateUrl: './elevation.component.html',
  styleUrl: './elevation.component.scss',
})
export class ElevationComponent {
  protected elevationLevels: ElevationLevel[] = [
    {
      name: 'shadow-sm',
      value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      description: 'Subtle shadow for minimal elevation',
    },
    {
      name: 'shadow-md',
      value: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      description: 'Medium shadow for raised elements',
    },
    {
      name: 'shadow-lg',
      value: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      description: 'Large shadow for prominent components',
    },
    {
      name: 'shadow-xl',
      value: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      description: 'Extra large shadow for modals and overlays',
    },
  ];

  protected usageExample = `<!-- Tailwind CSS -->
<div class="shadow-sm">Subtle shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">Extra large shadow</div>

<!-- SCSS -->
.card {
  box-shadow: var(--shadow-md);
}

.modal {
  box-shadow: var(--shadow-xl);
}`;
}
