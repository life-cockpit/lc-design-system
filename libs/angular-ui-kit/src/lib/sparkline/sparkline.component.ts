import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export type SparklineColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type SparklineCurve = 'linear' | 'smooth';

@Component({
  selector: 'lc-sparkline',
  standalone: true,
  templateUrl: './sparkline.component.html',
  styleUrls: ['./sparkline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Sparkline component for compact inline trend visualization.
 *
 * Features:
 * - Linear or smooth curve interpolation
 * - Optional area fill below the line
 * - Color theme variants (primary, secondary, success, warning, error)
 * - Optional end-dot indicator
 * - Configurable dimensions and stroke width
 * - Lightweight SVG rendering
 *
 * @example
 * ```html
 * <lc-sparkline [data]="[10, 25, 15, 30, 20]" color="primary" [filled]="true" />
 * ```
 */
export class SparklineComponent {
  /** Data points to plot. */
  data = input.required<number[]>();

  /** Stroke color theme. */
  color = input<SparklineColor>('primary');

  /** Width of the SVG in pixels. */
  width = input<number>(120);

  /** Height of the SVG in pixels. */
  height = input<number>(32);

  /** Stroke width in pixels. */
  strokeWidth = input<number>(2);

  /** Show a filled area under the line. */
  filled = input<boolean>(false);

  /** Curve interpolation mode. */
  curve = input<SparklineCurve>('smooth');

  /** Show a dot on the last data point. */
  showEndDot = input<boolean>(false);

  protected readonly colorVar = computed(() => {
    const map: Record<SparklineColor, string> = {
      primary: 'var(--color-primary-500)',
      secondary: 'var(--color-secondary-500)',
      success: 'var(--color-success-default)',
      warning: 'var(--color-warning-default)',
      error: 'var(--color-error-default)',
      info: 'var(--color-info-default)',
    };
    return map[this.color()];
  });

  protected readonly fillColorVar = computed(() => {
    const map: Record<SparklineColor, string> = {
      primary: 'var(--color-primary-100)',
      secondary: 'var(--color-secondary-100)',
      success: 'var(--color-success-light)',
      warning: 'var(--color-warning-light)',
      error: 'var(--color-error-light)',
      info: 'var(--color-info-light)',
    };
    return map[this.color()];
  });

  protected readonly pathD = computed(() => {
    const d = this.data();
    if (!d || d.length < 2) return '';

    const w = this.width();
    const h = this.height();
    const sw = this.strokeWidth();
    const padding = sw;
    const plotW = w - padding * 2;
    const plotH = h - padding * 2;

    const min = Math.min(...d);
    const max = Math.max(...d);
    const range = max - min || 1;

    const points = d.map((v, i) => ({
      x: padding + (i / (d.length - 1)) * plotW,
      y: padding + plotH - ((v - min) / range) * plotH,
    }));

    if (this.curve() === 'linear') {
      return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
    }

    // Smooth (monotone cubic) via catmull-rom approximation
    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(i - 1, 0)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(i + 2, points.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  });

  protected readonly areaD = computed(() => {
    if (!this.filled()) return '';
    const line = this.pathD();
    if (!line) return '';
    const d = this.data();
    const w = this.width();
    const h = this.height();
    const sw = this.strokeWidth();
    const padding = sw;
    const plotW = w - padding * 2;
    const lastX = padding + plotW;
    const bottomY = h - padding;
    const firstX = padding;
    return `${line} L${lastX},${bottomY} L${firstX},${bottomY} Z`;
  });

  protected readonly endDot = computed(() => {
    if (!this.showEndDot()) return null;
    const d = this.data();
    if (!d || d.length < 2) return null;

    const w = this.width();
    const h = this.height();
    const sw = this.strokeWidth();
    const padding = sw;
    const plotW = w - padding * 2;
    const plotH = h - padding * 2;

    const min = Math.min(...d);
    const max = Math.max(...d);
    const range = max - min || 1;

    const lastIdx = d.length - 1;
    return {
      cx: padding + (lastIdx / (d.length - 1)) * plotW,
      cy: padding + plotH - ((d[lastIdx] - min) / range) * plotH,
      r: sw + 1,
    };
  });

  protected readonly viewBox = computed(
    () => `0 0 ${this.width()} ${this.height()}`
  );
}
