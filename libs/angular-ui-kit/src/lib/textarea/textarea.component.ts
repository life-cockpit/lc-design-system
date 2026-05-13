import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  computed,
  ChangeDetectionStrategy,
  forwardRef,
  ElementRef,
  ViewChild,
  inject,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

/**
 * Textarea component for multi-line text input.
 *
 * Features:
 * - Variant styles (outline, filled)
 * - Size presets (xs, sm, md, lg)
 * - Auto-resize with configurable min/max rows
 * - Character count display with maxLength
 * - Validation error message and helper text
 * - Disabled and readonly states
 * - ControlValueAccessor integration for reactive forms
 *
 * @example
 * ```html
 * <lc-textarea placeholder="Enter message" [autoResize]="true" [(ngModel)]="message" />
 * ```
 */
/* eslint-disable @typescript-eslint/member-ordering */
@Component({
  selector: 'lc-textarea',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild('textarea', { static: false, read: ElementRef })
  private textareaElement!: ElementRef<HTMLTextAreaElement>;

  /**
   * Visual variant of the textarea
   */
  @Input() variant: 'outline' | 'filled' = 'outline';

  /**
   * Size of the textarea
   */
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';

  /**
   * Whether the textarea is disabled
   */
  @Input() disabled = false;

  /**
   * Whether the textarea is in error state
   */
  @Input() error = false;

  /**
   * Whether the textarea is required
   */
  @Input() required = false;

  /**
   * Whether the textarea is readonly
   */
  @Input() readonly = false;

  /**
   * Placeholder text
   */
  @Input() placeholder = '';

  /**
   * Label text displayed above the textarea
   */
  @Input() label = '';

  /**
   * Helper text displayed below the textarea
   */
  @Input() helperText = '';

  /**
   * Error message displayed when error is true
   */
  @Input() errorMessage = '';

  /**
   * ARIA label for accessibility
   */
  @Input() ariaLabel: string | undefined = undefined;

  /**
   * Number of visible text rows
   */
  @Input() rows = 3;

  /**
   * Maximum number of characters allowed
   */
  @Input() maxLength: number | undefined = undefined;

  /**
   * Whether to show character count
   */
  @Input() showCharacterCount = false;

  /**
   * Whether to automatically resize based on content
   */
  @Input() autoResize = false;

  /**
   * Minimum number of rows for auto-resize
   */
  @Input() minRows = 3;

  /**
   * Maximum number of rows for auto-resize
   */
  @Input() maxRows: number | undefined = undefined;

  /**
   * Emitted when value changes
   */
  @Output() readonly valueChange = new EventEmitter<string>();

  // Internal state
  value = signal<string>('');

  // Computed values
  currentCharacterCount = computed(() => {
    return this.value().length;
  });

  characterCountText = computed(() => {
    const current = this.currentCharacterCount();
    const max = this.maxLength;
    return max !== undefined ? `${current} / ${max}` : `${current}`;
  });

  isOverLimit = computed(() => {
    const max = this.maxLength;
    return max !== undefined && this.currentCharacterCount() > max;
  });

  // Private properties
  private elementRef = inject(ElementRef);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/member-ordering
  private onTouched: () => void = () => {};

  // Public methods
  ngAfterViewInit(): void {
    if (this.autoResize) {
      this.adjustHeight();
    }
  }

  /**
   * Handle input changes
   */
  onInput(value: string): void {
    if (this.disabled || this.readonly) {
      return;
    }

    this.value.set(value);
    this.onChange(value);
    this.valueChange.emit(value);

    if (this.autoResize) {
      this.adjustHeight();
    }
  }

  /**
   * Handle blur event
   */
  onBlur(): void {
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: string | null | undefined): void {
    this.value.set(value || '');
    if (this.autoResize && this.textareaElement) {
      setTimeout(() => this.adjustHeight(), 0);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Get computed classes for the textarea element
   */
  get textareaClasses(): string {
    const classes = ['lc-textarea'];

    classes.push(`lc-textarea--${this.variant}`);
    classes.push(`lc-textarea--${this.size}`);

    if (this.disabled) {
      classes.push('lc-textarea--disabled');
    }

    if (this.error) {
      classes.push('lc-textarea--error');
    }

    if (this.readonly) {
      classes.push('lc-textarea--readonly');
    }

    if (this.autoResize) {
      classes.push('lc-textarea--auto-resize');
    }

    return classes.join(' ');
  }

  // Private helper methods
  private adjustHeight(): void {
    if (!this.textareaElement) {
      return;
    }

    const textarea = this.textareaElement.nativeElement;

    // Reset height to get accurate scrollHeight
    textarea.style.height = 'auto';

    const minHeight = this.calculateMinHeight();
    const maxHeight = this.calculateMaxHeight();
    let newHeight = textarea.scrollHeight;

    // Apply constraints
    if (minHeight !== undefined) {
      newHeight = Math.max(newHeight, minHeight);
    }
    if (maxHeight !== undefined) {
      newHeight = Math.min(newHeight, maxHeight);
    }

    textarea.style.height = `${newHeight}px`;
  }

  private calculateMinHeight(): number | undefined {
    if (!this.textareaElement || this.minRows === undefined) {
      return undefined;
    }

    const textarea = this.textareaElement.nativeElement;
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
    const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop);
    const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom);

    return lineHeight * this.minRows + paddingTop + paddingBottom;
  }

  private calculateMaxHeight(): number | undefined {
    if (!this.textareaElement || this.maxRows === undefined) {
      return undefined;
    }

    const textarea = this.textareaElement.nativeElement;
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
    const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop);
    const paddingBottom = parseFloat(getComputedStyle(textarea).paddingBottom);

    return lineHeight * this.maxRows + paddingTop + paddingBottom;
  }

  protected getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
}
