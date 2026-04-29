import { Component, ChangeDetectionStrategy, input, computed, HostBinding } from '@angular/core';

export type SkeletonVariant = 'line' | 'circle' | 'rect';

/**
 * Skeleton loader component for placeholder loading states.
 *
 * Renders a shimmer-animated placeholder block. Use multiple instances
 * to compose loading skeletons that match your page layout.
 *
 * @example
 * ```html
 * <!-- Text line (default) -->
 * <lc-skeleton />
 *
 * <!-- Custom width/height -->
 * <lc-skeleton width="200px" height="1.75rem" />
 *
 * <!-- Circle avatar placeholder -->
 * <lc-skeleton variant="circle" width="40px" height="40px" />
 *
 * <!-- Full-width rectangle (e.g. chart area) -->
 * <lc-skeleton variant="rect" width="100%" height="400px" borderRadius="0.5rem" />
 * ```
 */
@Component({
  selector: 'lc-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  /** Shape variant. */
  readonly variant = input<SkeletonVariant>('line');

  /** Width (CSS value). Defaults to '100%' for line/rect, '40px' for circle. */
  readonly width = input<string>();

  /** Height (CSS value). Defaults to '0.875rem' for line, '40px' for circle, '100px' for rect. */
  readonly height = input<string>();

  /** Border radius override (CSS value). */
  readonly borderRadius = input<string>();

  protected readonly variantClass = computed(() => `lc-skeleton--${this.variant()}`);

  protected readonly styles = computed(() => {
    const v = this.variant();
    const defaults: Record<SkeletonVariant, { w: string; h: string; r: string }> = {
      line: { w: '100%', h: '0.875rem', r: '0.25rem' },
      circle: { w: '40px', h: '40px', r: '50%' },
      rect: { w: '100%', h: '100px', r: '0.5rem' },
    };
    const d = defaults[v];
    return {
      width: this.width() ?? d.w,
      height: this.height() ?? d.h,
      'border-radius': this.borderRadius() ?? d.r,
    };
  });

  @HostBinding('style.width')
  get hostWidth(): string {
    const v = this.variant();
    const defaults: Record<SkeletonVariant, string> = { line: '100%', circle: '40px', rect: '100%' };
    return this.width() ?? defaults[v];
  }

  @HostBinding('style.flex-shrink')
  get hostFlexShrink(): string {
    return '0';
  }
}
