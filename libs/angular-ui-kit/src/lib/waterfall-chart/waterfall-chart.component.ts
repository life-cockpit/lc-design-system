import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export interface WaterfallItem {
  label: string;
  value: number;
  /** 'total' renders from 0 to value instead of incremental. */
  type?: 'increase' | 'decrease' | 'total';
}

@Component({
  selector: 'lc-waterfall-chart',
  standalone: true,
  templateUrl: './waterfall-chart.component.html',
  styleUrls: ['./waterfall-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Waterfall chart component for visualizing cumulative value changes.
 *
 * Features:
 * - Increase, decrease, and total bar types
 * - Connector lines between bars
 * - Configurable colors for increase, decrease, and total
 * - Optional value labels and grid
 * - Adjustable bar gap spacing
 * - Responsive SVG rendering
 *
 * @example
 * ```html
 * <lc-waterfall-chart [data]="items" [showConnectors]="true" />
 * ```
 */
export class WaterfallChartComponent {
  data = input.required<WaterfallItem[]>();
  width = input<number>(500);
  height = input<number>(250);
  showValues = input<boolean>(true);
  showGrid = input<boolean>(true);
  showConnectors = input<boolean>(true);
  increaseColor = input<string>('var(--color-success-default)');
  decreaseColor = input<string>('var(--color-error-default)');
  totalColor = input<string>('var(--color-primary-500)');
  barGap = input<number>(0.3);

  private readonly PL = 50;
  private readonly PR = 10;
  private readonly PT = 15;
  private readonly PB = 30;

  protected readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  protected readonly computedBars = computed(() => {
    const items = this.data();
    if (!items.length) return { bars: [], connectors: [], gridLines: [] };

    // Compute running totals
    const entries: { label: string; start: number; end: number; type: string }[] = [];
    let running = 0;

    for (const item of items) {
      if (item.type === 'total') {
        entries.push({ label: item.label, start: 0, end: item.value, type: 'total' });
        running = item.value;
      } else {
        const start = running;
        running += item.value;
        entries.push({
          label: item.label,
          start,
          end: running,
          type: item.value >= 0 ? 'increase' : 'decrease',
        });
      }
    }

    // Find min/max for scaling
    const allVals = entries.flatMap(e => [e.start, e.end]);
    const minVal = Math.min(0, ...allVals);
    const maxVal = Math.max(0, ...allVals);
    const range = maxVal - minVal || 1;

    const w = this.width();
    const h = this.height();
    const plotW = w - this.PL - this.PR;
    const plotH = h - this.PT - this.PB;
    const gap = this.barGap();

    const totalBarW = plotW / items.length;
    const barW = totalBarW * (1 - gap);
    const barOff = (totalBarW - barW) / 2;

    const toY = (v: number) => this.PT + plotH - ((v - minVal) / range) * plotH;

    const bars = entries.map((e, i) => {
      const top = toY(Math.max(e.start, e.end));
      const bottom = toY(Math.min(e.start, e.end));
      return {
        x: this.PL + i * totalBarW + barOff,
        y: top,
        width: barW,
        height: Math.max(bottom - top, 1),
        color: e.type === 'total' ? this.totalColor()
          : e.type === 'increase' ? this.increaseColor()
          : this.decreaseColor(),
        label: e.label,
        value: e.end - e.start,
        labelX: this.PL + i * totalBarW + totalBarW / 2,
        labelY: h - this.PB + 16,
        valueY: top - 6,
        endVal: e.end,
      };
    });

    const connectors: { x1: number; x2: number; y: number }[] = [];
    if (this.showConnectors()) {
      for (let i = 0; i < entries.length - 1; i++) {
        const currEnd = entries[i].end;
        const y = toY(currEnd);
        connectors.push({
          x1: this.PL + i * totalBarW + barOff + barW,
          x2: this.PL + (i + 1) * totalBarW + barOff,
          y,
        });
      }
    }

    // Grid lines
    const gridLines: { y: number; label: string }[] = [];
    if (this.showGrid()) {
      const steps = 4;
      for (let i = 0; i <= steps; i++) {
        const val = minVal + (i / steps) * range;
        gridLines.push({ y: toY(val), label: String(Math.round(val)) });
      }
    }

    return { bars, connectors, gridLines };
  });

  protected readonly axisLine = computed(() => ({
    vx1: this.PL, vy1: this.PT,
    vx2: this.PL, vy2: this.height() - this.PB,
    hx1: this.PL, hy1: this.height() - this.PB,
    hx2: this.width() - this.PR, hy2: this.height() - this.PB,
  }));
}
