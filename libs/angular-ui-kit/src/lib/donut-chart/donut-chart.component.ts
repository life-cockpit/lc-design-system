import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export interface DonutSegment {
  value: number;
  label?: string;
  color?: string;
}

export type DonutChartSize = 'sm' | 'md' | 'lg';

const DEFAULT_COLORS = [
  'var(--color-primary-500)',
  'var(--color-secondary-500)',
  'var(--color-success-default)',
  'var(--color-warning-default)',
  'var(--color-error-default)',
  'var(--color-info-default)',
  'var(--color-primary-300)',
  'var(--color-secondary-300)',
  'var(--color-success-light)',
  'var(--color-warning-light)',
];

@Component({
  selector: 'lc-donut-chart',
  standalone: true,
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartComponent {
  /** Segments to render. */
  segments = input.required<DonutSegment[]>();

  /** Size preset. */
  size = input<DonutChartSize>('md');

  /** Thickness of the donut ring (0-1 ratio of radius). */
  thickness = input<number>(0.35);

  /** Show the center label area. */
  showCenter = input<boolean>(true);

  /** Center label text. */
  centerLabel = input<string>('');

  /** Center value text (large number). */
  centerValue = input<string>('');

  /** Show legend below the chart. */
  showLegend = input<boolean>(false);

  protected readonly sizeMap: Record<DonutChartSize, number> = {
    sm: 96,
    md: 140,
    lg: 200,
  };

  protected readonly svgSize = computed(() => this.sizeMap[this.size()]);
  protected readonly viewBox = computed(() => {
    const s = this.svgSize();
    return `0 0 ${s} ${s}`;
  });

  protected readonly center = computed(() => this.svgSize() / 2);
  protected readonly outerRadius = computed(() => this.svgSize() / 2 - 2);
  protected readonly innerRadius = computed(
    () => this.outerRadius() * (1 - this.thickness())
  );

  protected readonly arcs = computed(() => {
    const segs = this.segments();
    if (!segs || segs.length === 0) return [];

    const total = segs.reduce((sum, s) => sum + s.value, 0);
    if (total === 0) return [];

    const cx = this.center();
    const cy = this.center();
    const r = this.outerRadius();
    const ir = this.innerRadius();

    let startAngle = -Math.PI / 2; // start at top
    const gap = segs.length > 1 ? 0.02 : 0; // small gap between segments

    return segs.map((seg, i) => {
      const fraction = seg.value / total;
      const sweepAngle = fraction * Math.PI * 2 - gap;
      const endAngle = startAngle + sweepAngle;

      const largeArc = sweepAngle > Math.PI ? 1 : 0;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      const ix1 = cx + ir * Math.cos(endAngle);
      const iy1 = cy + ir * Math.sin(endAngle);
      const ix2 = cx + ir * Math.cos(startAngle);
      const iy2 = cy + ir * Math.sin(startAngle);

      const d = [
        `M${x1},${y1}`,
        `A${r},${r} 0 ${largeArc} 1 ${x2},${y2}`,
        `L${ix1},${iy1}`,
        `A${ir},${ir} 0 ${largeArc} 0 ${ix2},${iy2}`,
        'Z',
      ].join(' ');

      startAngle = endAngle + gap;

      return {
        d,
        color: seg.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        label: seg.label || '',
        value: seg.value,
        percentage: Math.round(fraction * 100),
      };
    });
  });

  protected readonly legendItems = computed(() =>
    this.arcs().map((arc) => ({
      color: arc.color,
      label: arc.label,
      value: arc.value,
      percentage: arc.percentage,
    }))
  );
}
