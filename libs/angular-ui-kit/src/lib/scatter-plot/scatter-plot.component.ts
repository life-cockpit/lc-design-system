import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
  signal,
  output,
} from '@angular/core';

export interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
  size?: number;
}

export interface ScatterSeries {
  label: string;
  data: ScatterPoint[];
  color?: string;
}

const DEFAULT_COLORS = [
  'var(--color-primary-500)',
  'var(--color-secondary-500)',
  'var(--color-success-default)',
  'var(--color-warning-default)',
  'var(--color-error-default)',
  'var(--color-info-default)',
];

@Component({
  selector: 'lc-scatter-plot',
  standalone: true,
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScatterPlotComponent {
  readonly series = input.required<ScatterSeries[]>();
  readonly width = input(400);
  readonly height = input(300);
  readonly showGrid = input(true);
  readonly showXLabels = input(true);
  readonly showYLabels = input(true);
  readonly showLegend = input(false);
  readonly showTooltip = input(true);
  readonly dotRadius = input(4);
  readonly xAxisLabel = input('');
  readonly yAxisLabel = input('');

  readonly pointClick = output<{ series: string; point: ScatterPoint }>();

  protected hoveredPoint = signal<{ x: number; y: number; label: string; sx: number; sy: number } | null>(null);

  private readonly PL = 48;
  private readonly PR = 16;
  private readonly PT = 16;
  private readonly PB = 36;

  protected readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  private readonly allPoints = computed(() => this.series().flatMap(s => s.data));

  private readonly xExtent = computed(() => {
    const pts = this.allPoints();
    if (!pts.length) return { min: 0, max: 1 };
    const vals = pts.map(p => p.x);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.05 || 0.5;
    return { min: min - pad, max: max + pad };
  });

  private readonly yExtent = computed(() => {
    const pts = this.allPoints();
    if (!pts.length) return { min: 0, max: 1 };
    const vals = pts.map(p => p.y);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const pad = (max - min) * 0.05 || 0.5;
    return { min: min - pad, max: max + pad };
  });

  protected readonly plotArea = computed(() => ({
    x: this.PL,
    y: this.PT,
    w: this.width() - this.PL - this.PR,
    h: this.height() - this.PT - this.PB,
  }));

  protected readonly gridLinesX = computed(() => {
    if (!this.showGrid()) return [];
    const { min, max } = this.xExtent();
    const pa = this.plotArea();
    const steps = 5;
    const range = max - min;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const val = min + (i / steps) * range;
      return { x: pa.x + (i / steps) * pa.w, label: Math.round(val * 10) / 10 };
    });
  });

  protected readonly gridLinesY = computed(() => {
    if (!this.showGrid()) return [];
    const { min, max } = this.yExtent();
    const pa = this.plotArea();
    const steps = 5;
    const range = max - min;
    return Array.from({ length: steps + 1 }, (_, i) => {
      const val = min + (i / steps) * range;
      return { y: pa.y + pa.h - (i / steps) * pa.h, label: Math.round(val * 10) / 10 };
    });
  });

  protected readonly renderedSeries = computed(() => {
    const pa = this.plotArea();
    const xE = this.xExtent();
    const yE = this.yExtent();
    const xRange = xE.max - xE.min || 1;
    const yRange = yE.max - yE.min || 1;
    const dr = this.dotRadius();

    return this.series().map((ser, si) => {
      const color = ser.color || DEFAULT_COLORS[si % DEFAULT_COLORS.length];
      const points = ser.data.map(p => ({
        cx: pa.x + ((p.x - xE.min) / xRange) * pa.w,
        cy: pa.y + pa.h - ((p.y - yE.min) / yRange) * pa.h,
        r: p.size ?? dr,
        label: p.label || `(${p.x}, ${p.y})`,
        orig: p,
      }));
      return { label: ser.label, color, points };
    });
  });

  protected readonly legendItems = computed(() => {
    if (!this.showLegend()) return [];
    return this.renderedSeries().map(s => ({ label: s.label, color: s.color }));
  });

  protected readonly axisLine = computed(() => {
    const pa = this.plotArea();
    return {
      vx1: pa.x, vy1: pa.y, vx2: pa.x, vy2: pa.y + pa.h,
      hx1: pa.x, hy1: pa.y + pa.h, hx2: pa.x + pa.w, hy2: pa.y + pa.h,
    };
  });

  protected onDotEnter(cx: number, cy: number, label: string): void {
    if (this.showTooltip()) this.hoveredPoint.set({ x: cx, y: cy, label, sx: cx, sy: cy - 12 });
  }

  protected onDotLeave(): void {
    this.hoveredPoint.set(null);
  }

  protected onDotClick(seriesLabel: string, point: ScatterPoint): void {
    this.pointClick.emit({ series: seriesLabel, point });
  }
}
