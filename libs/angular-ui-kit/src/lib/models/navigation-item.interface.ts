/**
 * NavigationItem interface for sidenav navigation
 *
 * Represents a navigation item with icon, label, route, and optional role requirement.
 * Can also represent a section header (group) when `isSection` is true.
 */
export interface NavigationItem {
  /**
   * Unique identifier for the navigation item
   */
  id: string;

  /**
   * Icon name from lc-icons library (e.g., 'home', 'paint-brush')
   */
  icon: string;

  /**
   * Display label for the navigation item
   */
  label: string;

  /**
   * Angular route path (e.g., '/', '/trading')
   */
  route: string;

  /**
   * Optional required Cognito role (e.g., 'LC.Trader')
   * If specified, item only visible to users with this role
   */
  requiredRole?: string;

  /**
   * Display order in sidebar (1 = first)
   */
  displayOrder: number;

  /**
   * Optional nested navigation items for multi-level navigation
   */
  children?: NavigationItem[];

  /**
   * When true, this item acts as a non-clickable section header/headline.
   * Children are displayed beneath it with the label as a group title.
   */
  isSection?: boolean;

  /**
   * Optional action button displayed on the right side of the item.
   * Emits `itemAction` when clicked (e.g. to open a modal or context menu).
   */
  action?: {
    /** Icon name from lc-icons library (e.g., 'plus', 'ellipsis-horizontal') */
    icon: string;
    /** Accessible label for the action button */
    ariaLabel?: string;
  };

  /**
   * Optional badge displayed on the right side of the item (e.g. count).
   * Rendered as a small pill badge.
   */
  badge?: {
    /** Text or number to display inside the badge */
    value: string | number;
    /** Badge color variant */
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
  };
}
