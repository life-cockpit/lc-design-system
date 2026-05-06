import { Component, input, computed, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SpacerSize = 'auto' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'lc-spacer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spacer.component.html',
  styleUrls: ['./spacer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Spacer component for adding vertical or flexible spacing.
 *
 * Features:
 * - Fixed spacing sizes (xs, sm, md, lg, xl, 2xl)
 * - Auto (flex-grow) mode for filling available space
 * - Host class binding for layout integration
 *
 * @example
 * ```html
 * <lc-spacer size="lg" />
 * ```
 */
export class SpacerComponent {
  size = input<SpacerSize>('auto');

  @HostBinding('class')
  get hostClasses(): string {
    return this.classes();
  }

  @HostBinding('attr.aria-hidden')
  get ariaHidden(): string {
    return 'true';
  }

  @HostBinding('attr.tabindex')
  get tabIndex(): number {
    return -1;
  }

  classes = computed(() => {
    const classes: string[] = [];

    // Add semantic size class
    classes.push(`spacer-${this.size()}`);

    if (this.size() === 'auto') {
      classes.push('flex-1');
    }
    // Note: spacer-xs, spacer-sm, etc. are defined in SCSS

    return classes.join(' ');
  });
}
