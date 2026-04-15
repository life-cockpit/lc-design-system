/* eslint-disable @typescript-eslint/member-ordering */
/* ControlValueAccessor implementation requires specific method placement */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { AlertComponent } from '../alert/alert.component';

/**
 * Password Input Component with Show/Hide Toggle and Strength Meter
 *
 * Per research.md Decision 7: Password Strength Indicator
 *
 * Features:
 * - Show/Hide password toggle (eye icon)
 * - Real-time password strength indicator (Weak/Fair/Good/Strong)
 * - Visual strength meter bar with color coding
 * - Validation feedback (length, uppercase, lowercase, digit, symbol)
 * - Accessible ARIA attributes
 * - Reactive Forms ControlValueAccessor implementation
 *
 * Strength Criteria:
 * - Weak (0-25%): < 8 chars OR missing 3+ requirements
 * - Fair (26-50%): 8+ chars, missing 2 requirements
 * - Good (51-75%): 8+ chars, missing 1 requirement
 * - Strong (76-100%): 8+ chars, all requirements met
 *
 * Requirements (Cognito password policy):
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one digit (0-9)
 * - At least one symbol (!@#$%^&*()_+-=[]{}|;:,.<>?)
 *
 * Usage:
 * ```html
 * <lc-password-input
 *   [formControl]="passwordControl"
 *   label="Password"
 *   placeholder="Enter your password"
 *   [showStrengthMeter]="true"
 * ></lc-password-input>
 * ```
 *
 * User Story: US0 (User Registration)
 */
@Component({
  selector: 'lc-password-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IconComponent, AlertComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
  ],
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() label = 'Password';
  @Input() placeholder = 'Enter password';
  @Input() showStrengthMeter = false;
  @Input() showRequirements = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() error?: string;

  @Output() readonly strengthChange = new EventEmitter<PasswordStrength>();

  value = '';
  isPasswordVisible = false;
  strength: PasswordStrength = { score: 0, level: 'Weak', percentage: 0 };
  requirements: PasswordRequirement[] = [];

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private cdr = inject(ChangeDetectorRef);

  constructor() {}

  /**
   * ControlValueAccessor: Write value from form control
   */
  writeValue(value: string): void {
    this.value = value || '';
    this.updateStrength();
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
    this.cdr.markForCheck();
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  /**
   * Handle input changes
   */
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.updateStrength();
    this.onChange(this.value);
  }

  /**
   * Handle blur event
   */
  onBlur(): void {
    this.onTouched();
  }

  /**
   * Calculate password strength and update requirements
   */
  private updateStrength(): void {
    const password = this.value;

    // Define requirements
    this.requirements = [
      {
        label: 'At least 8 characters',
        met: password.length >= 8,
        icon: password.length >= 8 ? '✓' : '✗',
      },
      {
        label: 'One uppercase letter (A-Z)',
        met: /[A-Z]/.test(password),
        icon: /[A-Z]/.test(password) ? '✓' : '✗',
      },
      {
        label: 'One lowercase letter (a-z)',
        met: /[a-z]/.test(password),
        icon: /[a-z]/.test(password) ? '✓' : '✗',
      },
      {
        label: 'One digit (0-9)',
        met: /[0-9]/.test(password),
        icon: /[0-9]/.test(password) ? '✓' : '✗',
      },
      {
        label: 'One symbol (!@#$%^&*)',
        met: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password),
        icon: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password) ? '✓' : '✗',
      },
    ];

    // Calculate strength score
    const metRequirements = this.requirements.filter((r) => r.met).length;
    const totalRequirements = this.requirements.length;
    const percentage = (metRequirements / totalRequirements) * 100;

    // Determine strength level
    let level: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
    if (percentage >= 80) {
      level = 'Strong';
    } else if (percentage >= 60) {
      level = 'Good';
    } else if (percentage >= 40) {
      level = 'Fair';
    }

    this.strength = {
      score: metRequirements,
      level,
      percentage,
    };

    this.strengthChange.emit(this.strength);
  }
}

/**
 * Password strength information
 */
export interface PasswordStrength {
  score: number; // 0-5 (number of requirements met)
  level: 'Weak' | 'Fair' | 'Good' | 'Strong';
  percentage: number; // 0-100
}

/**
 * Individual password requirement
 */
export interface PasswordRequirement {
  label: string;
  met: boolean;
  icon: string;
}
