import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export type ProgressRingColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type ProgressRingSize = 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'lc-progress-ring',
  standalone: true,
  templateUrl: './progress-ring.component.html',
  styleUrls: ['./progress-ring.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Progress ring component for circular progress indication.
 *
 * Features:
 * - Circular SVG progress arc (0–100%)
 * - Color theme variants (primary, secondary, success, warning, error)
 * - Size presets (xs, sm, md, lg)
 * - Optional percentage value display
 * - Animated stroke transitions
 *
 * @example
 * ```html
 * <lc-progress-ring [value]="65" color="success" [showValue]="true" />
 * ```
 */
export class ProgressRingComponent {
  /** Value between 0 and 100. */
  value = input<number>(0);

  /** Color theme. */
  color = input<ProgressRingColor>('primary');

  /** Size preset. */
  size = input<ProgressRingSize>('md');

  /** Show percentage text in center. */
  showValue = input<boolean>(true);

  private readonly SIZE_MAP: Record<ProgressRingSize, number> = { xs: 32, sm: 48, md: 64, lg: 96 };
  private readonly STROKE_MAP: Record<ProgressRingSize, number> = { xs: 3, sm: 4, md: 5, lg: 7 };

  protected readonly svgSize = computed(() => this.SIZE_MAP[this.size()]);
  protected readonly strokeW = computed(() => this.STROKE_MAP[this.size()]);
  protected readonly viewBox = computed(() => `0 0 ${this.svgSize()} ${this.svgSize()}`);
  protected readonly center = computed(() => this.svgSize() / 2);
  protected readonly radius = computed(() => (this.svgSize() - this.strokeW() * 2) / 2);
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius());

  protected readonly dashOffset = computed(() => {
    const c = this.circumference();
    const v = Math.min(Math.max(this.value(), 0), 100);
    return c - (v / 100) * c;
  });

  protected readonly fontSize = computed(() => {
    const map: Record<ProgressRingSize, string> = { xs: '0.5rem', sm: '0.625rem', md: '0.875rem', lg: '1.25rem' };
    return map[this.size()];
  });

  protected readonly displayValue = computed(() => `${Math.round(this.value())}%`);
}
