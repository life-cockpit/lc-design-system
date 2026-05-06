import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
} from '@angular/core';

export type GaugeColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type GaugeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'lc-gauge',
  standalone: true,
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaugeComponent {
  /** Value between 0 and max. */
  value = input<number>(0);

  /** Maximum value. */
  max = input<number>(100);

  /** Color theme. */
  color = input<GaugeColor>('primary');

  /** Size preset. */
  size = input<GaugeSize>('md');

  /** Label text below the value. */
  label = input<string>('');

  /** Value suffix (e.g. '%', '°C'). */
  suffix = input<string>('%');

  /** Show the value in the center. */
  showValue = input<boolean>(true);

  private readonly SIZE_MAP: Record<GaugeSize, number> = { sm: 100, md: 160, lg: 220 };

  protected readonly svgSize = computed(() => this.SIZE_MAP[this.size()]);
  protected readonly svgHeight = computed(() => {
    const s = this.svgSize();
    const sw = this.strokeW();
    const r = (s - sw * 2) / 2;
    // height = stroke padding + radius (arc) + text area
    return sw + r + 36;
  });
  protected readonly viewBox = computed(() => {
    const s = this.svgSize();
    return `0 0 ${s} ${this.svgHeight()}`;
  });

  protected readonly cx = computed(() => this.svgSize() / 2);
  protected readonly cy = computed(() => {
    const sw = this.strokeW();
    const r = (this.svgSize() - sw * 2) / 2;
    return sw + r;
  });
  protected readonly radius = computed(() => (this.svgSize() - this.strokeW() * 2) / 2);
  protected readonly strokeW = computed(() => {
    const map: Record<GaugeSize, number> = { sm: 8, md: 12, lg: 16 };
    return map[this.size()];
  });

  protected readonly fraction = computed(() => {
    const m = this.max() || 1;
    return Math.min(Math.max(this.value() / m, 0), 1);
  });

  protected readonly trackD = computed(() => {
    const r = this.radius();
    const cxv = this.cx();
    const cyv = this.cy();
    return `M${cxv - r},${cyv} A${r},${r} 0 0 1 ${cxv + r},${cyv}`;
  });

  protected readonly valueD = computed(() => {
    const r = this.radius();
    const cxv = this.cx();
    const cyv = this.cy();
    const f = this.fraction();
    if (f <= 0) return '';
    const angle = Math.PI * f;
    const x = cxv - r * Math.cos(angle);
    const y = cyv - r * Math.sin(angle);
    return `M${cxv - r},${cyv} A${r},${r} 0 0 1 ${x},${y}`;
  });

  protected readonly displayValue = computed(() =>
    `${Math.round(this.value())}${this.suffix()}`
  );

  protected readonly valueFontSize = computed(() => {
    const map: Record<GaugeSize, string> = { sm: '1rem', md: '1.5rem', lg: '2rem' };
    return map[this.size()];
  });

  protected readonly labelFontSize = computed(() => {
    const map: Record<GaugeSize, string> = { sm: '0.625rem', md: '0.75rem', lg: '0.875rem' };
    return map[this.size()];
  });
}
