import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  model,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToggleOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

/**
 * ToggleGroup Component
 *
 * Binary or multi-option toggle with active state styling.
 * Uses CSS custom properties with dark mode support.
 *
 * @example
 * ```html
 * <lc-toggle-group
 *   [options]="[{value:'1D',label:'1D'},{value:'1h',label:'1H'}]"
 *   [(selected)]="interval"
 * ></lc-toggle-group>
 * ```
 */
@Component({
  selector: 'lc-toggle-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle-group.component.html',
  styleUrl: './toggle-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleGroupComponent {
  /** Available toggle options */
  options = input.required<readonly ToggleOption[]>();

  /** Currently selected value (two-way binding) */
  selected = model<string>('');

  /** Size variant */
  size = input<'sm' | 'md' | 'lg'>('md');

  /** Emitted when selection changes */
  selectionChange = output<string>();

  /** Computed size class */
  sizeClass = computed(() => `lc-toggle-group--${this.size()}`);

  /** Select an option */
  select(option: ToggleOption): void {
    if (option.disabled) return;
    this.selected.set(option.value);
    this.selectionChange.emit(option.value);
  }

  /** Check if an option is active */
  isActive(option: ToggleOption): boolean {
    return this.selected() === option.value;
  }

  /** Get button classes */
  getButtonClasses(option: ToggleOption): string {
    const classes = ['lc-toggle-group__btn'];

    if (this.isActive(option)) {
      classes.push('lc-toggle-group__btn--active');
    }
    if (option.disabled) {
      classes.push('lc-toggle-group__btn--disabled');
    }

    return classes.join(' ');
  }
}
