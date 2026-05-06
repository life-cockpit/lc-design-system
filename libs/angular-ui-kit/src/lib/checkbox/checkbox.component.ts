import {
  Component,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type CheckboxSize = 'xs' | 'sm' | 'md' | 'lg';

let nextUniqueId = 0;

@Component({
  selector: 'lc-checkbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
/**
 * Checkbox component for boolean or indeterminate selections.
 *
 * Features:
 * - Checked, unchecked, and indeterminate states
 * - Multiple size variants (sm, md, lg)
 * - Validation error display with error message
 * - Help text support
 * - Full accessibility with ARIA attributes
 * - ControlValueAccessor integration for reactive forms
 *
 * @example
 * ```html
 * <lc-checkbox label="Accept terms" />
 * ```
 */
export class CheckboxComponent implements ControlValueAccessor {
  // Inputs
  readonly id = input<string>(`lc-checkbox-${nextUniqueId++}`);
  readonly label = input<string>('');
  readonly error = input<boolean>(false);
  readonly errorMessage = input<string>('');
  readonly helpText = input<string>('');
  readonly size = input<CheckboxSize>('md');
  readonly required = input<boolean>(false);
  readonly ariaLabel = input<string>('');
  readonly ariaLabelledBy = input<string>('');
  readonly ariaDescribedBy = input<string>('');

  // Outputs
  readonly checkedChange = output<boolean>();

  // Internal state (exposed as signals for testing/external access)
  readonly checked = signal(false);
  readonly disabled = signal(false);
  readonly indeterminate = signal(false);

  // Computed values
  readonly computedChecked = computed(() => this.checked());
  readonly computedDisabled = computed(() => this.disabled());
  readonly computedIndeterminate = computed(() => this.indeterminate());

  readonly labelClasses = computed(() => {
    const classes = ['checkbox-label', `checkbox-${this.size()}`];

    if (this.computedChecked()) {
      classes.push('checkbox-checked');
    }

    if (this.computedDisabled()) {
      classes.push('checkbox-disabled');
    }

    if (this.computedIndeterminate()) {
      classes.push('checkbox-indeterminate');
    }

    if (this.error()) {
      classes.push('checkbox-error');
    }

    if (this.required()) {
      classes.push('checkbox-required');
    }

    return classes.join(' ');
  });

  // ControlValueAccessor implementation
  writeValue(value: boolean | null): void {
    this.checked.set(value ?? false);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Event handlers
  handleChange(event: Event): void {
    if (this.computedDisabled()) {
      event.preventDefault();
      return;
    }

    const target = event.target as HTMLInputElement;
    const newValue = target.checked;

    // Clear indeterminate state when user interacts
    if (this.computedIndeterminate()) {
      this.indeterminate.set(false);
    }

    this.checked.set(newValue);
    this.onChange(newValue);
    this.checkedChange.emit(newValue);
  }

  handleBlur(): void {
    this.onTouched();
  }

  // Control Value Accessor callbacks (private)
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};
}
