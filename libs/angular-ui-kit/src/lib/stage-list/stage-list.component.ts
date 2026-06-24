import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

export interface StageItem {
  /** Stage name shown as the row label. */
  label: string;
  /** Numeric value; drives the bar width and the right-aligned count. */
  value: number;
  /** Optional bar/dot color (any CSS color). Falls back to the primary token. */
  color?: string;
  /** Optional secondary text shown under the label (e.g. a hint). */
  hint?: string;
  /** Optional opaque payload echoed back in `stageClick`. */
  id?: string;
}

export type StageListSize = 'sm' | 'md';

@Component({
  selector: 'lc-stage-list',
  standalone: true,
  templateUrl: './stage-list.component.html',
  styleUrls: ['./stage-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StageListComponent {
  readonly stages = input.required<StageItem[]>();
  readonly max = input<number | null>(null);
  readonly showValue = input<boolean>(true);
  readonly showBar = input<boolean>(true);
  readonly size = input<StageListSize>('md');
  readonly clickable = input<boolean>(false);
  readonly emptyText = input<string>('');

  readonly stageClick = output<StageItem>();

  protected readonly isEmpty = computed(() => this.stages().length === 0);

  protected readonly resolvedMax = computed(() => {
    const explicitMax = this.max();
    if (typeof explicitMax === 'number' && Number.isFinite(explicitMax) && explicitMax > 0) {
      return explicitMax;
    }

    const numericValues = this.stages()
      .map((stage) => (Number.isFinite(stage.value) ? stage.value : 0));

    return Math.max(1, ...numericValues);
  });

  protected resolveColor(stage: StageItem): string {
    if (typeof stage.color === 'string' && stage.color.trim()) {
      return stage.color;
    }

    return 'var(--lc-color-primary-500, var(--color-primary-500))';
  }

  protected fillWidth(stage: StageItem): string {
    const value = Number.isFinite(stage.value) ? stage.value : 0;
    if (value <= 0) {
      return '0%';
    }

    const maxValue = this.resolvedMax();
    const safeMax = maxValue > 0 ? maxValue : 1;
    const pct = Math.round((value / safeMax) * 100);
    const clampedPct = Math.max(0, Math.min(100, pct));

    return `max(2px, ${clampedPct}%)`;
  }

  protected onStageClick(stage: StageItem): void {
    if (!this.clickable()) {
      return;
    }

    this.stageClick.emit(stage);
  }
}
