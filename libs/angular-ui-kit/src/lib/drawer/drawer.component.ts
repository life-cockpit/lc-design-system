import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  effect,
  HostListener,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export type DrawerPosition = 'left' | 'right';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Drawer component for slide-out overlay panels.
 *
 * Features:
 * - Slide-in from left, right, top, or bottom
 * - Size presets (sm, md, lg, xl, full)
 * - Optional backdrop overlay with click-to-close
 * - Close on Escape key support
 * - Heading text display
 * - Content projection for arbitrary body content
 * - Accessible with ARIA dialog role
 *
 * @example
 * ```html
 * <lc-drawer [open]="showPanel" position="right" size="md"
 *            heading="Settings" (closed)="showPanel = false">
 *   <p>Any content goes here</p>
 * </lc-drawer>
 * ```
 */
@Component({
  selector: 'lc-drawer',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  /** Whether the drawer is open. */
  readonly open = input<boolean>(false);

  /** Slide-in direction. */
  readonly position = input<DrawerPosition>('right');

  /** Predefined width (sm=320, md=400, lg=520, xl=640). */
  readonly size = input<DrawerSize>('md');

  /** Optional heading shown in the drawer header. */
  readonly heading = input<string>('');

  /** Whether the overlay backdrop is shown. */
  readonly hasOverlay = input<boolean>(true);

  /** Whether clicking the overlay closes the drawer. */
  readonly closeOnOverlayClick = input<boolean>(true);

  /** Whether pressing Escape closes the drawer. */
  readonly closeOnEscape = input<boolean>(true);

  /** ARIA label for assistive technology. */
  readonly ariaLabel = input<string>('');

  /** Emitted when the drawer should close. */
  readonly closed = output<void>();

  /** Internal visibility — drives the animation lifecycle. */
  protected _visible = signal(false);
  protected _animating = signal(false);

  constructor() {
    effect(() => {
      const isOpen = this.open();
      if (isOpen) {
        this._visible.set(true);
        this._animating.set(true);
        // Lock body scroll
        document.body.style.overflow = 'hidden';
      } else if (this._visible()) {
        this._animating.set(false);
        // Restore scroll after animation
        setTimeout(() => {
          this._visible.set(false);
          document.body.style.overflow = '';
        }, 250);
      }
    });
  }

  /** Width token → CSS. */
  protected get widthValue(): string {
    const map: Record<DrawerSize, string> = {
      sm: '320px',
      md: '400px',
      lg: '520px',
      xl: '640px',
    };
    return map[this.size()];
  }

  protected get panelClasses(): string {
    const cls = ['lc-drawer__panel', `lc-drawer__panel--${this.position()}`];
    if (this.open()) cls.push('lc-drawer__panel--open');
    return cls.join(' ');
  }

  /** Handle backdrop click. */
  protected onOverlayClick(): void {
    if (this.closeOnOverlayClick()) {
      this.close();
    }
  }

  /** Handle close action. */
  protected close(): void {
    document.body.style.overflow = '';
    this.closed.emit();
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open() && this.closeOnEscape()) {
      this.close();
    }
  }
}
