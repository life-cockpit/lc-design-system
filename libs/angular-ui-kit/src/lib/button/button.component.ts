import {
  Component,
  input,
  output,
  computed,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'danger'
  | 'warning'
  | 'info';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'lc-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None, // Required for dynamic variant class styling
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Button component for user actions and form submissions.
 *
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, danger, link)
 * - Size options (xs, sm, md, lg)
 * - Loading state with spinner
 * - Icon-only mode
 * - Full-width layout option
 * - Keyboard and focus handling
 * - Accessible with ARIA attributes
 *
 * @example
 * ```html
 * <lc-button variant="primary" size="md">Save</lc-button>
 * ```
 */
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly iconOnly = input(false);
  readonly fullWidth = input(false);
  readonly ariaLabel = input('');
  readonly type = input<ButtonType>('button');

  readonly clicked = output<void>();
  readonly focused = output<void>();
  readonly blurred = output<void>();

  @ViewChild('buttonElement') buttonElement!: ElementRef<HTMLButtonElement>;

  readonly isDisabled = computed(() => this.disabled() || this.loading());

  handleClick(): void {
    if (!this.isDisabled()) {
      this.clicked.emit();
    }
  }

  handleFocus(): void {
    this.focused.emit();
  }

  handleBlur(): void {
    this.blurred.emit();
  }

  focus(): void {
    this.buttonElement?.nativeElement.focus();
  }

  blur(): void {
    this.buttonElement?.nativeElement.blur();
  }
}
