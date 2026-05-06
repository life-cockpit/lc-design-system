import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  forwardRef,
  inject,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

/**
 * Switch component for boolean toggle functionality.
 *
 * Features:
 * - Color variants (primary, secondary, success, warning, danger)
 * - Size options (sm, md, lg)
 * - Loading state with spinner
 * - Configurable label positioning (left/right)
 * - Keyboard toggle support
 * - Disabled and required states
 * - ControlValueAccessor integration for reactive forms
 *
 * @example
 * ```html
 * <lc-switch label="Enable notifications" [(ngModel)]="isEnabled" />
 * ```
 */
/* eslint-disable @typescript-eslint/member-ordering */
@Component({
  selector: 'lc-switch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  /**
   * Visual variant of the switch
   */
  @Input() variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' = 'primary';

  /**
   * Size of the switch
   */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Whether the switch is checked
   */
  @Input() checked = false;

  /**
   * Whether the switch is disabled
   */
  @Input() disabled = false;

  /**
   * Whether the switch is required
   */
  @Input() required = false;

  /**
   * Whether the switch is in loading state
   */
  @Input() loading = false;

  /**
   * Label text
   */
  @Input() label = '';

  /**
   * Label position relative to switch
   */
  @Input() labelPosition: 'left' | 'right' = 'right';

  /**
   * ARIA label for accessibility
   */
  @Input() ariaLabel: string | undefined = undefined;

  /**
   * Emitted when checked state changes
   */
  @Output() readonly checkedChange = new EventEmitter<boolean>();

  // Private properties
  private elementRef = inject(ElementRef);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private onChange: (value: boolean) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private onTouched: () => void = () => {};

  // Public methods
  /**
   * Toggle the switch state
   */
  toggle(): void {
    if (this.disabled || this.loading) {
      return;
    }

    this.checked = !this.checked;
    this.onChange(this.checked);
    this.onTouched();
    this.checkedChange.emit(this.checked);
  }

  /**
   * Handle click event
   */
  onClick(): void {
    this.toggle();
  }

  /**
   * Handle keyboard navigation
   */
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled || this.loading) {
      return;
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.toggle();
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: boolean | null | undefined): void {
    this.checked = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Get computed classes for the switch element
   */
  get switchClasses(): string {
    const classes = ['lc-switch'];

    classes.push(`lc-switch--${this.variant}`);
    classes.push(`lc-switch--${this.size}`);

    if (this.checked) {
      classes.push('lc-switch--checked');
    }

    if (this.disabled) {
      classes.push('lc-switch--disabled');
    }

    if (this.loading) {
      classes.push('lc-switch--loading');
    }

    return classes.join(' ');
  }
}
