import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  variant?: 'default' | 'danger';
  dividerAfter?: boolean;
  disabled?: boolean;
  metadata?: {
    subtitle?: string;
    badge?: string;
  };
}

/**
 * Menu Component - Dropdown menu for navigation and actions
 *
 * Features:
 * - Customizable menu items with icons
 * - Support for links and buttons
 * - Dividers between menu sections
 * - Optional subtitle/metadata for items
 * - Danger variant for destructive actions
 * - Click outside to close
 * - Keyboard navigation (Escape to close)
 * - OnPush change detection for performance
 *
 * @example
 * ```html
 * <lc-menu
 *   [items]="menuItems"
 *   [isOpen]="isMenuOpen"
 *   (itemClick)="handleMenuClick($event)"
 *   (closed)="isMenuOpen = false"
 * >
 *   <button trigger>Open Menu</button>
 *   <div header>User Profile</div>
 * </lc-menu>
 * ```
 */
@Component({
  selector: 'lc-menu',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  readonly items = input<MenuItem[]>([]);
  readonly isOpen = input(false);
  readonly position = input<'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'>('bottom-right');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly minWidth = input('220px');

  readonly itemClick = output<MenuItem>();
  readonly closed = output<void>();

  private elementRef = inject(ElementRef<HTMLElement>);

  /**
   * Handle menu item click
   */
  onItemClick(item: MenuItem, event: Event): void {
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    // If it's a link with href, let the browser handle navigation
    if (item.href) {
      // Event will propagate naturally
    } else {
      // For button items, prevent default and emit event
      event.preventDefault();
    }

    this.itemClick.emit(item);
  }

  /**
   * Close the menu
   */
  close(): void {
    this.closed.emit();
  }

  /**
   * Handle click outside to close menu
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) {
      return;
    }

    const target = event.target;
    if (target instanceof Node) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const clickedInside = this.elementRef.nativeElement.contains(target);
      if (!clickedInside) {
        this.close();
      }
    }
  }

  /**
   * Handle Escape key to close menu
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close();
    }
  }
}
