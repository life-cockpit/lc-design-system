import {
  Component,
  Input,
  Output,
  EventEmitter,
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
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() isLoading = false; // Alias for loading
  @Input() iconOnly = false; // Icon-only button (no text, square shape)
  @Input() fullWidth = false;
  @Input() ariaLabel = '';
  @Input() type: ButtonType = 'button';

  @Output() readonly clicked = new EventEmitter<void>();
  @Output() readonly focused = new EventEmitter<void>();
  @Output() readonly blurred = new EventEmitter<void>();

  @ViewChild('buttonElement') buttonElement!: ElementRef<HTMLButtonElement>;

  get isDisabled(): boolean {
    return this.disabled || this.loading || this.isLoading;
  }

  handleClick(): void {
    if (!this.isDisabled) {
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
