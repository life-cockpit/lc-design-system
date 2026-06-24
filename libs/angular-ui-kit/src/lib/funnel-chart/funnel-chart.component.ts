import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  computed,
  signal,
} from '@angular/core';

export interface FunnelStep {
  label: string;
  value: number;
  color?: string;
}

const DEFAULT_COLORS = [
  'var(--color-primary-500)',
  'var(--color-primary-400)',
  'var(--color-primary-300)',
  'var(--color-secondary-500)',
  'var(--color-secondary-400)',
  'var(--color-secondary-300)',
  'var(--color-success-default)',
  'var(--color-warning-default)',
];

@Component({
  selector: 'lc-funnel-chart',
  standalone: true,
  templateUrl: './funnel-chart.component.html',
  styleUrls: ['./funnel-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FunnelChartComponent {
  private readonly _el = inject(ElementRef);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _containerWidth = signal<number>(0);

  constructor() {
    afterNextRender(() => {
      const obs = new ResizeObserver(([entry]) => {
        this._containerWidth.set(entry.contentRect.width);
      });
      obs.observe(this._el.nativeElement);
      this._destroyRef.onDestroy(() => obs.disconnect());
    });
  }

  readonly steps = input.required<FunnelStep[]>();
  readonly width = input(400);
  readonly height = input(300);
  readonly showLabels = input(true);
  readonly showValues = input(true);
  readonly showPercentage = input(true);
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');

  protected readonly effectiveWidth = computed(
    () => this._containerWidth() || this.width()
  );

  protected readonly viewBox = computed(() => `0 0 ${this.effectiveWidth()} ${this.height()}`);

  protected readonly renderedSteps = computed(() => {
    const steps = this.steps();
    if (!steps.length) return [];

    const maxVal = Math.max(...steps.map(s => s.value));
    const w = this.effectiveWidth();
    const h = this.height();
    const isV = this.orientation() === 'vertical';
    const count = steps.length;

    if (isV) {
      const stepH = h / count;
      const padding = 20;
      const maxWidth = w - padding * 2;

      return steps.map((step, i) => {
        const ratio = maxVal > 0 ? step.value / maxVal : 0;
        const nextRatio = i < count - 1 && maxVal > 0 ? steps[i + 1].value / maxVal : ratio * 0.6;
        const topW = ratio * maxWidth;
        const bottomW = (i < count - 1 ? nextRatio : ratio * 0.6) * maxWidth;
        const y = i * stepH;
        const cx = w / 2;
        const pct = i === 0 ? 100 : maxVal > 0 ? Math.round((step.value / maxVal) * 100) : 0;

        const path = [
          `M ${cx - topW / 2} ${y}`,
          `L ${cx + topW / 2} ${y}`,
          `L ${cx + bottomW / 2} ${y + stepH}`,
          `L ${cx - bottomW / 2} ${y + stepH}`,
          'Z',
        ].join(' ');

        return {
          path,
          color: step.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
          label: step.label,
          value: step.value,
          pct,
          labelX: cx,
          labelY: y + stepH / 2,
        };
      });
    } else {
      const stepW = w / count;
      const padding = 20;
      const maxHeight = h - padding * 2;

      return steps.map((step, i) => {
        const ratio = maxVal > 0 ? step.value / maxVal : 0;
        const nextRatio = i < count - 1 && maxVal > 0 ? steps[i + 1].value / maxVal : ratio * 0.6;
        const leftH = ratio * maxHeight;
        const rightH = (i < count - 1 ? nextRatio : ratio * 0.6) * maxHeight;
        const x = i * stepW;
        const cy = h / 2;
        const pct = i === 0 ? 100 : maxVal > 0 ? Math.round((step.value / maxVal) * 100) : 0;

        const path = [
          `M ${x} ${cy - leftH / 2}`,
          `L ${x + stepW} ${cy - rightH / 2}`,
          `L ${x + stepW} ${cy + rightH / 2}`,
          `L ${x} ${cy + leftH / 2}`,
          'Z',
        ].join(' ');

        return {
          path,
          color: step.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
          label: step.label,
          value: step.value,
          pct,
          labelX: x + stepW / 2,
          labelY: cy,
        };
      });
    }
  });
}
