import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export interface BarChartItem {
  value: number;
  label?: string;
  color?: string;
}

export type BarChartOrientation = 'vertical' | 'horizontal';

const DEFAULT_COLORS = [
  'var(--color-primary-500)',
  'var(--color-secondary-500)',
  'var(--color-success-default)',
  'var(--color-warning-default)',
  'var(--color-error-default)',
  'var(--color-info-default)',
];

@Component({
  selector: 'lc-bar-chart',
  standalone: true,
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Bar chart component for comparing categorical data.
 *
 * Features:
 * - Vertical and horizontal orientation
 * - Per-bar or uniform color support
 * - Optional value labels on bars
 * - Configurable grid and axis labels
 * - Adjustable bar gap spacing
 * - Responsive SVG rendering
 *
 * @example
 * ```html
 * <lc-bar-chart [data]="items" orientation="vertical" [showValues]="true" />
 * ```
 */
export class BarChartComponent {
  /** Data items. */
  data = input.required<BarChartItem[]>();

  /** Chart width in pixels. */
  width = input<number>(400);

  /** Chart height in pixels. */
  height = input<number>(200);

  /** Bar orientation. */
  orientation = input<BarChartOrientation>('vertical');

  /** Show value labels on bars. */
  showValues = input<boolean>(true);

  /** Show axis labels. */
  showLabels = input<boolean>(true);

  /** Show grid lines. */
  showGrid = input<boolean>(true);

  /** Gap between bars as ratio (0-1). */
  barGap = input<number>(0.3);

  /** Use a single color for all bars. */
  color = input<string>('');

  // Layout constants
  private readonly PADDING_LEFT = 40;
  private readonly PADDING_RIGHT = 10;
  private readonly PADDING_TOP = 10;
  private readonly PADDING_BOTTOM = 30;

  protected readonly viewBox = computed(
    () => `0 0 ${this.width()} ${this.height()}`
  );

  protected readonly maxValue = computed(() => {
    const d = this.data();
    if (!d || d.length === 0) return 0;
    return Math.max(...d.map((i) => i.value));
  });

  protected readonly gridLines = computed(() => {
    if (!this.showGrid()) return [];
    const max = this.maxValue();
    if (max === 0) return [];

    const steps = 4;
    const stepValue = Math.ceil(max / steps);
    const lines: { y: number; label: string }[] = [];

    const plotH = this.height() - this.PADDING_TOP - this.PADDING_BOTTOM;

    for (let i = 0; i <= steps; i++) {
      const val = i * stepValue;
      const y = this.PADDING_TOP + plotH - (val / (stepValue * steps)) * plotH;
      lines.push({ y, label: String(val) });
    }
    return lines;
  });

  protected readonly bars = computed(() => {
    const d = this.data();
    if (!d || d.length === 0) return [];

    const isVertical = this.orientation() === 'vertical';
    const w = this.width();
    const h = this.height();
    const pl = this.PADDING_LEFT;
    const pr = this.PADDING_RIGHT;
    const pt = this.PADDING_TOP;
    const pb = this.PADDING_BOTTOM;

    const plotW = w - pl - pr;
    const plotH = h - pt - pb;
    const max = this.maxValue() || 1;
    const gap = this.barGap();
    const singleColor = this.color();

    if (isVertical) {
      const totalBarWidth = plotW / d.length;
      const barWidth = totalBarWidth * (1 - gap);
      const barOffset = (totalBarWidth - barWidth) / 2;

      return d.map((item, i) => {
        const barH = (item.value / max) * plotH;
        return {
          x: pl + i * totalBarWidth + barOffset,
          y: pt + plotH - barH,
          width: barWidth,
          height: barH,
          color: singleColor || item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
          label: item.label || '',
          value: item.value,
          labelX: pl + i * totalBarWidth + totalBarWidth / 2,
          labelY: h - pb + 16,
          valueX: pl + i * totalBarWidth + totalBarWidth / 2,
          valueY: pt + plotH - barH - 6,
        };
      });
    } else {
      const totalBarHeight = plotH / d.length;
      const barHeight = totalBarHeight * (1 - gap);
      const barOffset = (totalBarHeight - barHeight) / 2;

      return d.map((item, i) => {
        const barW = (item.value / max) * plotW;
        return {
          x: pl,
          y: pt + i * totalBarHeight + barOffset,
          width: barW,
          height: barHeight,
          color: singleColor || item.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
          label: item.label || '',
          value: item.value,
          labelX: pl - 6,
          labelY: pt + i * totalBarHeight + totalBarHeight / 2,
          valueX: pl + barW + 6,
          valueY: pt + i * totalBarHeight + totalBarHeight / 2,
        };
      });
    }
  });

  protected readonly isVertical = computed(() => this.orientation() === 'vertical');

  protected readonly axisLine = computed(() => {
    const w = this.width();
    const h = this.height();
    const pl = this.PADDING_LEFT;
    const pt = this.PADDING_TOP;
    const pb = this.PADDING_BOTTOM;
    const pr = this.PADDING_RIGHT;
    return {
      x1: pl,
      y1: pt,
      x2: pl,
      y2: h - pb,
      bx1: pl,
      by1: h - pb,
      bx2: w - pr,
      by2: h - pb,
    };
  });
}
