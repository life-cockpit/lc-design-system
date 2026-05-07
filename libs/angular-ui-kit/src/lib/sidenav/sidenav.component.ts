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
 * Sidenav component for application navigation sidebar.
 *
 * Features:
 * - Drawer (overlay) and docked (persistent) modes
 * - Collapsed icon-rail mode (narrow 56px sidebar with icons only)
 * - Hierarchical navigation with collapsible groups
 * - Section headlines for item grouping
 * - Active route highlighting
 * - Keyboard navigation support
 * - Configurable width and position (left/right)
 * - Optional backdrop overlay
 * - Accessible with ARIA navigation role
 *
 * @example
 * ```html
 * <lc-sidenav [isOpen]="isOpen" mode="docked" [collapsed]="isCollapsed" [items]="navItems"
 *   (closed)="isOpen = false" (itemClicked)="navigate($event)" />
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
  /** Whether the sidenav is collapsed to icon-only rail */
  collapsed = signal<boolean>(false);

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
   * Input setter for collapsed
   */
  @Input()
  set collapsedInput(value: boolean) {
    this.collapsed.set(value);
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
    if (this.collapsed()) {
      classes.push('lc-sidenav--collapsed');
    }
    return classes.join(' ');
  });

  /**
   * Computed inline styles for the sidenav
   */
  sidenavStyles = computed(() => ({
    width: this.collapsed() ? '56px' : this.width(),
  }));

  /**
   * Toggle collapsed state
   */
  toggleCollapsed(): void {
    this.collapsed.set(!this.collapsed());
  }

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
