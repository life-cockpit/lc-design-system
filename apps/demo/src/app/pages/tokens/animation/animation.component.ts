import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, CardComponent } from '@life-cockpit/angular-ui-kit';

interface AnimationToken {
  name: string;
  value: string;
  description: string;
}

@Component({
  selector: 'app-animation',
  imports: [CommonModule, ButtonComponent, CardComponent],
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss'],
})
export class AnimationComponent {
  protected isAnimating = signal(false);
  protected currentEasing = signal('');

  protected durations: AnimationToken[] = [
    {
      name: 'duration-fast',
      value: '150ms',
      description: 'Fast animations for immediate feedback',
    },
    {
      name: 'duration-normal',
      value: '300ms',
      description: 'Normal speed for most transitions',
    },
    {
      name: 'duration-slow',
      value: '500ms',
      description: 'Slower animations for complex transitions',
    },
  ];

  protected easingFunctions: AnimationToken[] = [
    {
      name: 'ease-in-out',
      value: 'ease-in-out',
      description: 'Smooth start and end (recommended default)',
    },
    {
      name: 'ease-in',
      value: 'ease-in',
      description: 'Slow start, fast end',
    },
    {
      name: 'ease-out',
      value: 'ease-out',
      description: 'Fast start, slow end',
    },
    {
      name: 'linear',
      value: 'linear',
      description: 'Constant speed throughout',
    },
  ];

  protected usageExample = `<!-- Tailwind CSS -->
<div class="transition-all duration-150 ease-in-out">
  Animated Element
</div>

<!-- SCSS with CSS Variables -->
.animated {
  transition-property: transform, opacity;
  transition-duration: var(--duration-fast);
  transition-timing-function: var(--easing-in-out);
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .animated {
    transition-duration: 0.01ms;
  }
}`;

  protected animate(duration: string): void {
    this.isAnimating.set(true);
    const durationMs = parseInt(duration);
    setTimeout(() => {
      this.isAnimating.set(false);
    }, durationMs);
  }

  protected animateWithEasing(easing: string): void {
    this.currentEasing.set(easing);
    setTimeout(() => {
      this.currentEasing.set('');
    }, 500);
  }
}
