import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavigationItem } from '../models/navigation-item.interface';
import { IconComponent } from '../icon/icon.component';

export type SidenavPosition = 'left' | 'right';
export type SidenavMode = 'drawer' | 'docked';

/**
 * Sidenav Component
 *
 * A navigation component that can work as either a drawer (overlay) or
 * a docked (persistent) sidebar. Supports section headlines, collapsible
 * groups, keyboard navigation, and accessibility features.
 *
 * @example Drawer mode (default — overlay that slides in)
 * ```html
 * <lc-sidenav
 *   [isOpen]="isOpen"
 *   mode="drawer"
 *   (closed)="handleClose()">
 * </lc-sidenav>
 * ```
 *
 * @example Docked mode (persistent sidebar that stays open)
 * ```html
 * <lc-sidenav
 *   [isOpen]="sidebarOpen"
 *   mode="docked"
 *   [items]="navItems"
 *   (closed)="sidebarOpen = false">
 * </lc-sidenav>
 * ```
 */
@Component({
  selector: 'lc-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.lc-sidenav-container]': 'true',
    '[class.lc-sidenav-container--docked]': "mode() === 'docked'",
    '[class.lc-sidenav-container--open]': 'isOpen()',
  },
})
export class SidenavComponent {
  /** Whether the sidenav is open */
  isOpen = signal<boolean>(false);

  /** Display mode: 'drawer' (overlay) or 'docked' (persistent sidebar) */
  mode = signal<SidenavMode>('drawer');

  /** Position of the sidenav (left or right) */
  position = signal<SidenavPosition>('left');

  /** Width of the sidenav drawer */
  width = signal<string>('320px');

  /** ARIA label for the sidenav */
  ariaLabel = signal<string>('Side navigation');

  /** Whether to show the overlay backdrop */
  hasOverlay = signal<boolean>(true);

  /** Navigation items to display */
  items = signal<NavigationItem[]>([]);

  /** Current active route for highlighting */
  activeRoute = signal<string>('');

  /** Track which parent items are expanded */
  expandedItems = signal<Set<string>>(new Set());

  /**
   * Computed sorted navigation items by displayOrder
   */
  sortedItems = computed(() => {
    return [...this.items()].sort((a, b) => a.displayOrder - b.displayOrder);
  });

  /**
   * Input setter for isOpen
   */
  @Input()
  set isOpenInput(value: boolean) {
    this.isOpen.set(value);
  }

  /**
   * Input setter for mode
   */
  @Input()
  set modeInput(value: SidenavMode) {
    this.mode.set(value);
  }

  /**
   * Input setter for position
   */
  @Input()
  set positionInput(value: SidenavPosition) {
    this.position.set(value);
  }

  /**
   * Input setter for width
   */
  @Input()
  set widthInput(value: string) {
    this.width.set(value);
  }

  /**
   * Input setter for ariaLabel
   */
  @Input()
  set ariaLabelInput(value: string) {
    this.ariaLabel.set(value);
  }

  /**
   * Input setter for hasOverlay
   */
  @Input()
  set hasOverlayInput(value: boolean) {
    this.hasOverlay.set(value);
  }

  /**
   * Input setter for navigation items
   */
  @Input()
  set itemsInput(value: NavigationItem[]) {
    this.items.set(value);
  }

  /**
   * Input setter for active route
   */
  @Input()
  set activeRouteInput(value: string) {
    this.activeRoute.set(value);
  }

  /**
   * Event emitted when the sidenav should close
   */
  @Output() readonly closed = new EventEmitter<void>();

  /**
   * Event emitted when a navigation item is clicked
   */
  @Output() readonly itemClicked = new EventEmitter<NavigationItem>();

  /**
   * Computed CSS classes for the sidenav
   */
  sidenavClasses = computed(() => {
    const classes = ['lc-sidenav'];
    classes.push(`lc-sidenav--${this.position()}`);
    classes.push(`lc-sidenav--${this.mode()}`);
    if (this.isOpen()) {
      classes.push('lc-sidenav--open');
    }
    return classes.join(' ');
  });

  /**
   * Computed inline styles for the sidenav
   */
  sidenavStyles = computed(() => ({
    width: this.width(),
  }));

  /**
   * Handle close action
   */
  handleClose(): void {
    this.closed.emit();
  }

  /**
   * Handle navigation item click
   */
  handleItemClick(item: NavigationItem): void {
    this.itemClicked.emit(item);
  }

  /**
   * Check if an item is active
   */
  isItemActive(item: NavigationItem): boolean {
    return this.activeRoute() === item.route;
  }

  /**
   * Check if a parent item has an active child
   */
  hasActiveChild(item: NavigationItem): boolean {
    if (!item.children?.length) return false;
    return item.children.some((child) => this.isItemActive(child));
  }

  /**
   * Toggle expansion of a parent item
   */
  toggleExpanded(item: NavigationItem): void {
    const expanded = new Set(this.expandedItems());
    if (expanded.has(item.id)) {
      expanded.delete(item.id);
    } else {
      expanded.add(item.id);
    }
    this.expandedItems.set(expanded);
  }

  /**
   * Check if an item is expanded
   */
  isExpanded(item: NavigationItem): boolean {
    return this.expandedItems().has(item.id) || this.hasActiveChild(item);
  }

  /**
   * Handle keyboard navigation
   */
  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen() && this.mode() === 'drawer') {
      this.handleClose();
    }
  }
}
