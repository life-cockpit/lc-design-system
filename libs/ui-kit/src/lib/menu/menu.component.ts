import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  HostListener,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, IconComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  /**
   * Menu items to display
   */
  @Input() items: MenuItem[] = [];

  /**
   * Whether the menu is open
   */
  @Input() isOpen = false;

  /**
   * Menu position relative to trigger
   * @default 'bottom-right'
   */
  @Input() position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' = 'bottom-right';

  /**
   * Minimum width of menu dropdown
   * @default '220px'
   */
  @Input() minWidth = '220px';

  /**
   * Emitted when a menu item is clicked
   */
  @Output() readonly itemClick = new EventEmitter<MenuItem>();

  /**
   * Emitted when the menu should be closed (e.g., click outside, Escape key)
   */
  @Output() readonly closed = new EventEmitter<void>();

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
    if (!this.isOpen) {
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
    if (this.isOpen) {
      this.close();
    }
  }
}
