import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  ViewEncapsulation,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';
import type { Toast, ToastVariant } from './toast.service';

/**
 * Toast component for displaying ephemeral notification messages.
 *
 * Features:
 * - Semantic variants (success, warning, error, info)
 * - Auto-dismiss with configurable duration
 * - Manual dismiss with close button
 * - Icon display per variant
 * - Stacked toast positioning via ToastService
 * - Animated enter/exit transitions
 *
 * @example
 * ```typescript
 * this.toastService.show({ message: 'Saved!', variant: 'success' });
 * ```
 */
@Component({
  selector: 'lc-toast',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None, // Required for dynamic variant class styling
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.role]': 'ariaRole()',
    '[attr.aria-live]': 'ariaLive()',
    '[attr.aria-atomic]': '"true"',
  },
})
export class ToastComponent {
  /**
   * Toast data
   */
  toast = input.required<Toast>();

  /**
   * Emitted when toast is closed
   */
  readonly closed = output<string>();

  /**
   * Computed host classes
   */
  protected hostClasses = computed(() => {
    const toast = this.toast();
    return `lc-toast lc-toast--${toast.variant}`;
  });

  /**
   * Computed container classes
   */
  protected containerClasses = computed(() => {
    return 'lc-toast__container';
  });

  /**
   * Computed ARIA role
   */
  protected ariaRole = computed(() => {
    const variant = this.toast().variant;
    return variant === 'error' || variant === 'warning' ? 'alert' : 'status';
  });

  /**
   * Computed ARIA live region priority
   */
  protected ariaLive = computed(() => {
    const variant = this.toast().variant;
    return variant === 'error' || variant === 'warning' ? 'assertive' : 'polite';
  });

  /**
   * Computed default icon based on variant
   */
  protected defaultIcon = computed(() => {
    const icons: Record<ToastVariant, string> = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'exclamation-triangle',
      info: 'information-circle',
    };
    return icons[this.toast().variant];
  });

  /**
   * Handle close button click
   */
  protected onCloseClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.closed.emit(this.toast().id);
  }

  /**
   * Handle action button click
   */
  protected onActionClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const action = this.toast().action;
    if (action) {
      action.onClick();
      this.closed.emit(this.toast().id);
    }
  }
}
