import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export interface LineChartSeries {
  label: string;
  data: number[];
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
  selector: 'lc-line-chart',
  standalone: true,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent {
  /** One or more data series. */
  series = input.required<LineChartSeries[]>();

  /** X-axis labels. */
  labels = input<string[]>([]);

  /** Chart width in pixels. */
  width = input<number>(400);

  /** Chart height in pixels. */
  height = input<number>(200);

  /** Stroke width for lines. */
  strokeWidth = input<number>(2);

  /** Show dots at data points. */
  showDots = input<boolean>(true);

  /** Show grid lines. */
  showGrid = input<boolean>(true);

  /** Show X-axis labels. */
  showXLabels = input<boolean>(true);

  /** Show Y-axis labels. */
  showYLabels = input<boolean>(true);

  /** Show area fill under lines. */
  filled = input<boolean>(false);

  /** Show legend. */
  showLegend = input<boolean>(false);

  /** Use smooth curves. */
  smooth = input<boolean>(true);

  private readonly PL = 40;
  private readonly PR = 10;
  private readonly PT = 10;
  private readonly PB = 30;

  protected readonly viewBox = computed(
    () => `0 0 ${this.width()} ${this.height()}`
  );

  protected readonly allValues = computed(() => {
    const s = this.series();
    return s.flatMap((ser) => ser.data);
  });

  protected readonly minValue = computed(() =>
    this.allValues().length ? Math.min(...this.allValues()) : 0
  );

  protected readonly maxValue = computed(() =>
    this.allValues().length ? Math.max(...this.allValues()) : 0
  );

  protected readonly maxDataLength = computed(() =>
    Math.max(...this.series().map((s) => s.data.length), 0)
  );

  protected readonly plotArea = computed(() => ({
    x: this.PL,
    y: this.PT,
    w: this.width() - this.PL - this.PR,
    h: this.height() - this.PT - this.PB,
  }));

  protected readonly gridLines = computed(() => {
    if (!this.showGrid()) return [];
    const max = this.maxValue();
    const min = this.minValue();
    const range = max - min || 1;
    const steps = 4;
    const pa = this.plotArea();
    const lines: { y: number; label: string }[] = [];

    for (let i = 0; i <= steps; i++) {
      const val = min + (i / steps) * range;
      const y = pa.y + pa.h - (i / steps) * pa.h;
      lines.push({ y, label: String(Math.round(val * 10) / 10) });
    }
    return lines;
  });

  protected readonly xLabels = computed(() => {
    const lbls = this.labels();
    if (!this.showXLabels() || lbls.length === 0) return [];
    const pa = this.plotArea();
    const count = lbls.length;

    return lbls.map((label, i) => ({
      x: pa.x + (count > 1 ? (i / (count - 1)) * pa.w : pa.w / 2),
      y: this.height() - this.PB + 16,
      label,
    }));
  });

  protected readonly renderedSeries = computed(() => {
    const allSeries = this.series();
    const pa = this.plotArea();
    const min = this.minValue();
    const max = this.maxValue();
    const range = max - min || 1;

    return allSeries.map((ser, si) => {
      const color = ser.color || DEFAULT_COLORS[si % DEFAULT_COLORS.length];
      const points = ser.data.map((v, i) => ({
        x: pa.x + (ser.data.length > 1 ? (i / (ser.data.length - 1)) * pa.w : pa.w / 2),
        y: pa.y + pa.h - ((v - min) / range) * pa.h,
      }));

      let pathD = '';
      if (points.length >= 2) {
        if (this.smooth()) {
          pathD = `M${points[0].x},${points[0].y}`;
          for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[Math.max(i - 1, 0)];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[Math.min(i + 2, points.length - 1)];
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            pathD += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
          }
        } else {
          pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
        }
      }

      let areaD = '';
      if (this.filled() && pathD && points.length >= 2) {
        const lastX = points[points.length - 1].x;
        const firstX = points[0].x;
        const bottomY = pa.y + pa.h;
        areaD = `${pathD} L${lastX},${bottomY} L${firstX},${bottomY} Z`;
      }

      return {
        label: ser.label,
        color,
        pathD,
        areaD,
        points: this.showDots() ? points : [],
      };
    });
  });

  protected readonly axisLine = computed(() => {
    const pa = this.plotArea();
    return {
      vx1: pa.x, vy1: pa.y,
      vx2: pa.x, vy2: pa.y + pa.h,
      hx1: pa.x, hy1: pa.y + pa.h,
      hx2: pa.x + pa.w, hy2: pa.y + pa.h,
    };
  });

  protected readonly legendItems = computed(() => {
    if (!this.showLegend()) return [];
    return this.renderedSeries().map((s) => ({
      label: s.label,
      color: s.color,
    }));
  });
}
