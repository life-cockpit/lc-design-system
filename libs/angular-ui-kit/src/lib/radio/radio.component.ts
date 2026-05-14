import {
  Component,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

export type RadioSize = 'xs' | 'sm' | 'md' | 'lg';

let nextUniqueId = 0;

/* eslint-disable @typescript-eslint/member-ordering */

@Component({
  selector: 'lc-radio',
  standalone: true,
  imports: [],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Radio button component for single-option selection within a group.
 *
 * Features:
 * - Single selection within a named radio group
 * - Multiple size variants (sm, md, lg)
 * - Validation error display with error message
 * - Help text support
 * - Full accessibility with ARIA attributes
 * - ControlValueAccessor integration for reactive forms
 *
 * @example
 * ```html
 * <lc-radio label="Option A" value="a" name="group1" />
 * <lc-radio label="Option B" value="b" name="group1" />
 * ```
 */
export class RadioComponent implements ControlValueAccessor, OnInit, OnDestroy {
  // Inputs
  readonly id = input<string>(`lc-radio-${nextUniqueId++}`);
  readonly label = input<string>('');
  readonly value = input<string>('');
  readonly name = input<string>('');
  readonly error = input<boolean>(false);
  readonly errorMessage = input<string>('');
  readonly helpText = input<string>('');
  readonly size = input<RadioSize>('md');
  readonly required = input<boolean>(false);
  readonly ariaLabel = input<string>('');
  readonly ariaLabelledBy = input<string>('');
  readonly ariaDescribedBy = input<string>('');

  // Outputs
  readonly checkedChange = output<boolean>();
  readonly valueChange = output<string>();

  // Computed state
  readonly checked = computed(() => {
    const fv = this.formValue();
    const v = this.value();
    // Only match if both have actual values (not just empty strings)
    return fv !== '' && v !== '' && fv === v;
  });
  readonly disabled = signal(false);
  readonly computedChecked = computed(() => this.checked());
  readonly computedDisabled = computed(() => this.disabled());

  readonly labelClasses = computed(() => {
    const classes = ['radio-label', `radio-${this.size()}`];

    if (this.computedChecked()) {
      classes.push('radio-checked');
    }

    if (this.computedDisabled()) {
      classes.push('radio-disabled');
    }

    if (this.error()) {
      classes.push('radio-error');
    }

    if (this.required()) {
      classes.push('radio-required');
    }

    return classes.join(' ');
  });

  // Private fields
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngControl = inject(NgControl, { optional: true, self: true });
  private formValue = signal<string>('');
  private valueChangeSub?: Subscription;

  // Control Value Accessor callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Prevent circular dependency by not providing NG_VALUE_ACCESSOR here
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    // Subscribe to form control value changes
    if (this.ngControl?.control) {
      this.valueChangeSub = this.ngControl.control.valueChanges.subscribe((value: string) => {
        this.formValue.set(value || '');
        this.cdr.markForCheck();
      });
      // Set initial value
      const initialValue = this.ngControl.control.value as string;
      if (initialValue) {
        this.formValue.set(initialValue);
      }
    }
  }

  ngOnDestroy(): void {
    this.valueChangeSub?.unsubscribe();
  }

  // ControlValueAccessor implementation
  writeValue(value: string | null): void {
    // Update the form value signal - the computed 'checked' will automatically update
    this.formValue.set(value || '');
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Event handlers
  public handleChange(event: Event): void {
    if (this.computedDisabled()) {
      event.preventDefault();
      return;
    }

    // Update local state immediately for instant feedback
    this.formValue.set(this.value());

    // Notify the form control - it will call writeValue on all radios
    this.onChange(this.value());

    this.valueChange.emit(this.value());
    this.checkedChange.emit(true);
  }

  public handleBlur(): void {
    this.onTouched();
  }
}
