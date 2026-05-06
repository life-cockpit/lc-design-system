import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export interface PieSegment {
  value: number;
  label?: string;
  color?: string;
}

export type PieChartSize = 'sm' | 'md' | 'lg';

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
  selector: 'lc-pie-chart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieChartComponent {
  segments = input.required<PieSegment[]>();
  size = input<PieChartSize>('md');
  showLegend = input<boolean>(false);

  private readonly SIZE_MAP: Record<PieChartSize, number> = { sm: 96, md: 140, lg: 200 };

  protected readonly svgSize = computed(() => this.SIZE_MAP[this.size()]);
  protected readonly viewBox = computed(() => `0 0 ${this.svgSize()} ${this.svgSize()}`);
  protected readonly center = computed(() => this.svgSize() / 2);
  protected readonly radius = computed(() => this.svgSize() / 2 - 2);

  protected readonly arcs = computed(() => {
    const segs = this.segments();
    if (!segs?.length) return [];
    const total = segs.reduce((s, seg) => s + seg.value, 0);
    if (!total) return [];

    const cx = this.center();
    const cy = this.center();
    const r = this.radius();
    let startAngle = -Math.PI / 2;
    const gap = segs.length > 1 ? 0.02 : 0;

    return segs.map((seg, i) => {
      const frac = seg.value / total;
      const sweep = frac * Math.PI * 2 - gap;
      const endAngle = startAngle + sweep;
      const large = sweep > Math.PI ? 1 : 0;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      const d = segs.length === 1
        ? `M${cx - r},${cy} A${r},${r} 0 1 1 ${cx - r - 0.01},${cy} Z`
        : `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;

      startAngle = endAngle + gap;

      return {
        d,
        color: seg.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        label: seg.label || '',
        percentage: Math.round(frac * 100),
      };
    });
  });

  protected readonly legendItems = computed(() =>
    this.arcs().map(a => ({ color: a.color, label: a.label, percentage: a.percentage }))
  );
}
