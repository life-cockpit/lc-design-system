import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  signal,
  computed,
  effect,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { A11yModule, FocusTrap, ConfigurableFocusTrapFactory } from '@angular/cdk/a11y';
import { IconComponent } from '../icon/icon.component';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Modal dialog component for focused user interactions.
 *
 * Features:
 * - Size presets (sm, md, lg, xl, full)
 * - Focus trap for keyboard accessibility
 * - Backdrop click and Escape key to close
 * - Two-way open binding
 * - Header, body, and footer content slots
 * - Optional close button
 * - Accessible with ARIA dialog role
 *
 * @example
 * ```html
 * <lc-modal [(open)]="isOpen" size="md" [closeOnBackdropClick]="true">
 *   <div slot="header"><h2>Title</h2></div>
 *   <div slot="body">Content</div>
 *   <div slot="footer"><lc-button (click)="close()">Close</lc-button></div>
 * </lc-modal>
 * ```
 */
@Component({
  selector: 'lc-modal',
  standalone: true,
  imports: [CommonModule, A11yModule, IconComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None, // Required for dynamic size class styling
})
export class ModalComponent implements OnDestroy {
  @ViewChild('modalContent') modalContent?: ElementRef<HTMLElement>;

  /**
   * Whether the modal is open (input from parent)
   * @default false
   */
  open = input<boolean>(false);

  /**
   * Modal size
   * @default 'md'
   */
  size = input<ModalSize>('md');

  /**
   * Whether clicking backdrop closes modal
   * @default true
   */
  closeOnBackdropClick = input<boolean>(true);

  /**
   * Whether pressing Escape closes modal
   * @default true
   */
  closeOnEscape = input<boolean>(true);

  /**
   * Whether to show close button in header
   * @default true
   */
  showCloseButton = input<boolean>(true);

  /**
   * ARIA label for accessibility
   */
  ariaLabel = input<string>();

  /**
   * ARIA labelledby ID
   */
  ariaLabelledBy = input<string>();

  /**
   * ARIA describedby ID
   */
  ariaDescribedBy = input<string>();

  /**
   * Emitted when modal opens
   */
  readonly modalOpened = output<void>();

  /**
   * Emitted when modal closes
   */
  readonly modalClosed = output<void>();

  /**
   * Two-way binding for open state
   */
  readonly openChange = output<boolean>();

  /**
   * Emitted when backdrop is clicked
   */
  readonly backdropClicked = output<MouseEvent>();

  /**
   * Internal open state signal (protected for AOT)
   */
  protected _open = signal<boolean>(false);

  /**
   * Computed modal classes
   */
  protected modalClasses = computed(() => {
    return `lc-modal lc-modal--${this.size()}`;
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  private readonly focusTrapFactory = inject(ConfigurableFocusTrapFactory);
  private focusTrap?: FocusTrap;
  private originalOverflow?: string;
  private escapeListener?: (event: KeyboardEvent) => void;

  constructor() {
    // Sync input with internal state
    effect(() => {
      this._open.set(this.open());
    });

    // Watch for open state changes
    effect(() => {
      const isOpen = this._open();
      if (isOpen) {
        void this.showModal();
      } else {
        this.hideModal();
      }
    });

    // Listen for Escape key
    if (typeof window !== 'undefined') {
      this.escapeListener = this.handleEscapeKey.bind(this);
      document.addEventListener('keydown', this.escapeListener);
    }
  }

  ngOnDestroy(): void {
    this.hideModal();
    if (this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener);
    }
  }

  /**
   * Open the modal programmatically
   */
  openModal(): void {
    this._open.set(true);
    this.openChange.emit(true);
    this.modalOpened.emit();
  }

  /**
   * Close the modal programmatically
   */
  closeModal(): void {
    this._open.set(false);
    this.openChange.emit(false);
    this.modalClosed.emit();
  }

  /**
   * Handle backdrop click
   */
  protected onBackdropClick(event: MouseEvent): void {
    this.backdropClicked.emit(event);
    if (this.closeOnBackdropClick()) {
      this.closeModal();
    }
  }

  /**
   * Handle close button click
   */
  protected onCloseClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.closeModal();
  }

  /**
   * Handle Escape key press
   */
  private handleEscapeKey(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this._open() && this.closeOnEscape()) {
      this.closeModal();
    }
  }

  /**
   * Show the modal
   */
  private async showModal(): Promise<void> {
    // Lock body scroll
    if (typeof document !== 'undefined') {
      this.originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    // Setup focus trap after view is ready
    await Promise.resolve();
    if (this.modalContent && this._open()) {
      const element = this.modalContent.nativeElement;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      this.focusTrap = this.focusTrapFactory.create(element);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.focusTrap.focusInitialElement();
    }
  }

  /**
   * Hide the modal
   */
  private hideModal(): void {
    // Restore body scroll
    if (typeof document !== 'undefined' && this.originalOverflow !== undefined) {
      document.body.style.overflow = this.originalOverflow;
      this.originalOverflow = undefined;
    }

    // Destroy focus trap
    if (this.focusTrap) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.focusTrap.destroy();
      this.focusTrap = undefined;
    }
  }
}
