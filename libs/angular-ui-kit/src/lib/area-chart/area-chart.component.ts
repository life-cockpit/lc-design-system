import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export interface AreaChartSeries {
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
  selector: 'lc-area-chart',
  standalone: true,
  templateUrl: './area-chart.component.html',
  styleUrls: ['./area-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaChartComponent {
  series = input.required<AreaChartSeries[]>();
  labels = input<string[]>([]);
  width = input<number>(400);
  height = input<number>(200);
  strokeWidth = input<number>(2);
  showDots = input<boolean>(false);
  showGrid = input<boolean>(true);
  showXLabels = input<boolean>(true);
  showYLabels = input<boolean>(true);
  showLegend = input<boolean>(false);
  smooth = input<boolean>(true);
  /** Opacity for the filled area (0–1). */
  fillOpacity = input<number>(0.2);
  /** Stack areas on top of each other. */
  stacked = input<boolean>(false);

  private readonly PL = 40;
  private readonly PR = 10;
  private readonly PT = 10;
  private readonly PB = 30;

  protected readonly viewBox = computed(() => `0 0 ${this.width()} ${this.height()}`);

  protected readonly plotArea = computed(() => ({
    x: this.PL, y: this.PT,
    w: this.width() - this.PL - this.PR,
    h: this.height() - this.PT - this.PB,
  }));

  protected readonly computedSeries = computed(() => {
    const allSeries = this.series();
    if (!allSeries.length) return [];

    if (this.stacked()) {
      const maxLen = Math.max(...allSeries.map(s => s.data.length));
      const stackedData: number[][] = [];
      const cumulative = new Array(maxLen).fill(0);

      for (const ser of allSeries) {
        const row = ser.data.map((v, i) => {
          cumulative[i] = (cumulative[i] || 0) + v;
          return cumulative[i];
        });
        stackedData.push(row);
      }
      return allSeries.map((ser, i) => ({
        ...ser,
        computedData: stackedData[i],
        prevData: i > 0 ? stackedData[i - 1] : null,
      }));
    }

    return allSeries.map(ser => ({
      ...ser,
      computedData: ser.data,
      prevData: null as number[] | null,
    }));
  });

  protected readonly minValue = computed(() => {
    if (this.stacked()) return 0;
    const all = this.series().flatMap(s => s.data);
    return all.length ? Math.min(...all, 0) : 0;
  });

  protected readonly maxValue = computed(() => {
    const cs = this.computedSeries();
    if (!cs.length) return 0;
    return Math.max(...cs.flatMap(s => s.computedData));
  });

  protected readonly gridLines = computed(() => {
    if (!this.showGrid()) return [];
    const min = this.minValue();
    const max = this.maxValue();
    const range = max - min || 1;
    const pa = this.plotArea();
    const steps = 4;
    const lines: { y: number; label: string }[] = [];
    for (let i = 0; i <= steps; i++) {
      const val = min + (i / steps) * range;
      const y = pa.y + pa.h - (i / steps) * pa.h;
      lines.push({ y, label: String(Math.round(val * 10) / 10) });
    }
    return lines;
  });

  protected readonly xLabelItems = computed(() => {
    const lbls = this.labels();
    if (!this.showXLabels() || !lbls.length) return [];
    const pa = this.plotArea();
    return lbls.map((l, i) => ({
      x: pa.x + (lbls.length > 1 ? (i / (lbls.length - 1)) * pa.w : pa.w / 2),
      y: this.height() - this.PB + 16,
      label: l,
    }));
  });

  private toPoints(data: number[]) {
    const pa = this.plotArea();
    const min = this.minValue();
    const max = this.maxValue();
    const range = max - min || 1;
    return data.map((v, i) => ({
      x: pa.x + (data.length > 1 ? (i / (data.length - 1)) * pa.w : pa.w / 2),
      y: pa.y + pa.h - ((v - min) / range) * pa.h,
    }));
  }

  private buildPath(points: { x: number; y: number }[]) {
    if (points.length < 2) return '';
    if (this.smooth()) {
      let d = `M${points[0].x},${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(i + 2, points.length - 1)];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
      return d;
    }
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  }

  protected readonly renderedSeries = computed(() => {
    const cs = this.computedSeries();
    const pa = this.plotArea();
    const bottomY = pa.y + pa.h;

    return cs.map((ser, si) => {
      const color = ser.color || DEFAULT_COLORS[si % DEFAULT_COLORS.length];
      const points = this.toPoints(ser.computedData);
      const lineD = this.buildPath(points);

      let areaD = '';
      if (lineD && points.length >= 2) {
        if (ser.prevData) {
          const prevPoints = this.toPoints(ser.prevData).reverse();
          const prevPath = prevPoints.map((p, i) => `${i === 0 ? 'L' : 'L'}${p.x},${p.y}`).join(' ');
          areaD = `${lineD} ${prevPath} Z`;
        } else {
          const lastX = points[points.length - 1].x;
          const firstX = points[0].x;
          areaD = `${lineD} L${lastX},${bottomY} L${firstX},${bottomY} Z`;
        }
      }

      return {
        label: ser.label,
        color,
        lineD,
        areaD,
        points: this.showDots() ? points : [],
      };
    });
  });

  protected readonly axisLine = computed(() => {
    const pa = this.plotArea();
    return {
      vx1: pa.x, vy1: pa.y, vx2: pa.x, vy2: pa.y + pa.h,
      hx1: pa.x, hy1: pa.y + pa.h, hx2: pa.x + pa.w, hy2: pa.y + pa.h,
    };
  });

  protected readonly legendItems = computed(() => {
    if (!this.showLegend()) return [];
    return this.renderedSeries().map(s => ({ label: s.label, color: s.color }));
  });
}
