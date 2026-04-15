/* eslint-disable @typescript-eslint/member-ordering */
/* ControlValueAccessor implementation requires specific method placement */

import { Component, Input, Output, EventEmitter, forwardRef, ViewChildren, QueryList, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

/**
 * Verification Code Input Component with 6 Separate Digit Inputs
 * 
 * Per research.md Decision 8: Email Verification Code Format
 * 
 * Features:
 * - 6 separate input fields (one digit each)
 * - Automatic focus advancement after entering digit
 * - Backspace moves to previous input
 * - Paste support (splits 6-digit code across inputs)
 * - Accessible ARIA attributes
 * - Reactive Forms ControlValueAccessor implementation
 * - Auto-submit on complete (optional)
 * 
 * Usage:
 * ```html
 * <lc-verification-code-input
 *   [formControl]="codeControl"
 *   label="Verification Code"
 *   [autoSubmit]="true"
 *   (complete)="onCodeComplete($event)"
 * ></lc-verification-code-input>
 * ```
 * 
 * Cognito Email Format:
 * - 6-digit numeric code (e.g., 123456)
 * - Sent via email with click-to-verify link (?code=XXX)
 * - Valid for 24 hours
 * 
 * User Stories: US0 (Registration Email Verification), US2 (Password Reset)
 */
@Component({
  selector: 'lc-verification-code-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VerificationCodeInputComponent),
      multi: true,
    },
  ],
  templateUrl: './verification-code-input.component.html',
  styleUrls: ['./verification-code-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationCodeInputComponent implements ControlValueAccessor, AfterViewInit {
  @Input() label = 'Verification Code';
  @Input() length = 6;
  @Input() disabled = false;
  @Input() required = false;
  @Input() error?: string;
  @Input() autoSubmit = false;

  @Output() readonly complete = new EventEmitter<string>();

  @ViewChildren('digitInput') digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  digits: string[] = Array<string>(6).fill('');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    // Auto-focus first input on mount
    if (this.digitInputs.first) {
      setTimeout(() => this.digitInputs.first.nativeElement.focus(), 100);
    }
  }

  /**
   * ControlValueAccessor: Write value from form control
   */
  writeValue(value: string): void {
    if (value && value.length === this.length) {
      this.digits = value.split('');
      this.digitInputs?.toArray().forEach((input, index) => {
        input.nativeElement.value = this.digits[index] || '';
      });
    } else {
      this.digits = Array<string>(this.length).fill('');
      this.digitInputs?.toArray().forEach((input) => {
        input.nativeElement.value = '';
      });
    }
  }

  /**
   * ControlValueAccessor: Register onChange callback
   */
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  /**
   * ControlValueAccessor: Register onTouched callback
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * ControlValueAccessor: Set disabled state
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Handle digit input
   */
  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Only allow single digit (0-9)
    if (!/^\d$/.test(value)) {
      input.value = '';
      return;
    }

    this.digits[index] = value;
    this.updateValue();

    // Move to next input if value entered
    if (value && index < this.length - 1) {
      this.focusInput(index + 1);
    }

    // Check if all digits entered
    if (this.isComplete()) {
      this.onTouched();
      const code = this.getCode();
      this.complete.emit(code);

      if (this.autoSubmit) {
        // Auto-submit after 100ms delay
        setTimeout(() => {
          this.complete.emit(code);
        }, 100);
      }
    }
  }

  /**
   * Handle keydown events (backspace, arrow keys, paste)
   */
  onKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      // Clear current digit
      if (input.value) {
        input.value = '';
        this.digits[index] = '';
        this.updateValue();
      } else if (index > 0) {
        // Move to previous input and clear it
        this.focusInput(index - 1);
        const prevInputElement = this.digitInputs.toArray()[index - 1];
        if (prevInputElement) {
          const prevInput = prevInputElement.nativeElement;
          prevInput.value = '';
          this.digits[index - 1] = '';
          this.updateValue();
        }
      }
      event.preventDefault();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusInput(index - 1);
      event.preventDefault();
    } else if (event.key === 'ArrowRight' && index < this.length - 1) {
      this.focusInput(index + 1);
      event.preventDefault();
    }
  }

  /**
   * Handle paste event (split 6-digit code across inputs)
   */
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').split('').slice(0, this.length);

    if (digits.length === this.length) {
      digits.forEach((digit, index) => {
        this.digits[index] = digit;
        const input = this.digitInputs.toArray()[index]?.nativeElement;
        if (input) {
          input.value = digit;
        }
      });

      this.updateValue();

      // Focus last input
      this.focusInput(this.length - 1);

      // Check if complete
      if (this.isComplete()) {
        this.onTouched();
        const code = this.getCode();
        this.complete.emit(code);

        if (this.autoSubmit) {
          setTimeout(() => {
            this.complete.emit(code);
          }, 100);
        }
      }
    }
  }

  /**
   * Focus specific input by index
   */
  private focusInput(index: number): void {
    const input = this.digitInputs.toArray()[index]?.nativeElement;
    if (input) {
      input.focus();
      input.select();
    }
  }

  /**
   * Check if all digits entered
   */
  private isComplete(): boolean {
    return this.digits.every((digit) => digit !== '');
  }

  /**
   * Get complete verification code
   */
  private getCode(): string {
    return this.digits.join('');
  }

  /**
   * Update form control value
   */
  private updateValue(): void {
    const code = this.getCode();
    this.onChange(code);
  }
}
