import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export interface StackedBarCategory {
  label: string;
  values: number[];
}

export interface StackedBarLegend {
  label: string;
  color?: string;
}

export type StackedBarOrientation = 'vertical' | 'horizontal';

const DEFAULT_COLORS = [
  'var(--color-primary-500)',
  'var(--color-secondary-500)',
  'var(--color-success-default)',
  'var(--color-warning-default)',
  'var(--color-error-default)',
  'var(--color-info-default)',
  'var(--color-primary-300)',
  'var(--color-secondary-300)',
];

@Component({
  selector: 'lc-stacked-bar-chart',
  standalone: true,
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Stacked bar chart component for comparing category compositions.
 *
 * Features:
 * - Multiple stacked value segments per category
 * - Vertical and horizontal orientation
 * - Optional legend, grid, value labels, and axis labels
 * - Configurable bar gap spacing
 * - Color-coded segments with legend mapping
 * - Responsive SVG rendering
 *
 * @example
 * ```html
 * <lc-stacked-bar-chart [categories]="data" [legends]="legends" [showLegend]="true" />
 * ```
 */
export class StackedBarChartComponent {
  /** Categories with stacked values. */
  categories = input.required<StackedBarCategory[]>();

  /** Legend items mapping to each value index. */
  legends = input<StackedBarLegend[]>([]);

  width = input<number>(400);
  height = input<number>(200);
  orientation = input<StackedBarOrientation>('vertical');
  showLabels = input<boolean>(true);
  showValues = input<boolean>(false);
  showLegend = input<boolean>(true);
  showGrid = input<boolean>(true);
  barGap = input<number>(0.3);

  private readonly PL = 40;
  private readonly PR = 10;
  private readonly PT = 10;
  private readonly PB = 30;

  protected readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  protected readonly maxTotal = computed(() => {
    const cats = this.categories();
    if (!cats.length) return 0;
    return Math.max(...cats.map(c => c.values.reduce((a, b) => a + b, 0)));
  });

  protected readonly gridLines = computed(() => {
    if (!this.showGrid() || this.orientation() !== 'vertical') return [];
    const max = this.maxTotal();
    if (!max) return [];
    const steps = 4;
    const stepVal = Math.ceil(max / steps);
    const plotH = this.height() - this.PT - this.PB;
    const lines: { y: number; label: string }[] = [];
    for (let i = 0; i <= steps; i++) {
      const val = i * stepVal;
      const y = this.PT + plotH - (val / (stepVal * steps)) * plotH;
      lines.push({ y, label: String(val) });
    }
    return lines;
  });

  protected readonly stacks = computed(() => {
    const cats = this.categories();
    const legs = this.legends();
    if (!cats.length) return [];

    const w = this.width();
    const h = this.height();
    const isV = this.orientation() === 'vertical';
    const plotW = w - this.PL - this.PR;
    const plotH = h - this.PT - this.PB;
    const max = this.maxTotal() || 1;
    const gap = this.barGap();

    return cats.map((cat, ci) => {
      const total = cat.values.reduce((a, b) => a + b, 0);
      let cumulative = 0;

      const segments = cat.values.map((val, vi) => {
        const color = legs[vi]?.color || DEFAULT_COLORS[vi % DEFAULT_COLORS.length];
        const frac = val / max;
        let rect: { x: number; y: number; w: number; h: number };

        if (isV) {
          const totalBarW = plotW / cats.length;
          const barW = totalBarW * (1 - gap);
          const barOff = (totalBarW - barW) / 2;
          const segH = frac * plotH;
          rect = {
            x: this.PL + ci * totalBarW + barOff,
            y: this.PT + plotH - (cumulative / max) * plotH - segH,
            w: barW,
            h: segH,
          };
        } else {
          const totalBarH = plotH / cats.length;
          const barH = totalBarH * (1 - gap);
          const barOff = (totalBarH - barH) / 2;
          const segW = frac * plotW;
          rect = {
            x: this.PL + (cumulative / max) * plotW,
            y: this.PT + ci * totalBarH + barOff,
            w: segW,
            h: barH,
          };
        }

        cumulative += val;
        return { ...rect, color, value: val };
      });

      const labelPos = isV
        ? { x: this.PL + (ci + 0.5) * (plotW / cats.length), y: h - this.PB + 16 }
        : { x: this.PL - 6, y: this.PT + (ci + 0.5) * (plotH / cats.length) };

      return { label: cat.label, segments, labelPos, total };
    });
  });

  protected readonly legendItems = computed(() => {
    const legs = this.legends();
    return legs.map((l, i) => ({
      label: l.label,
      color: l.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    }));
  });

  protected readonly isVertical = computed(() => this.orientation() === 'vertical');

  protected readonly axisLine = computed(() => ({
    vx1: this.PL, vy1: this.PT,
    vx2: this.PL, vy2: this.height() - this.PB,
    hx1: this.PL, hy1: this.height() - this.PB,
    hx2: this.width() - this.PR, hy2: this.height() - this.PB,
  }));
}
