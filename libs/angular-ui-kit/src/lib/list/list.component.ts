import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  output,
  ContentChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ButtonComponent } from '../button/button.component';
import { ListItemTemplateDirective } from './list-item-template.directive';

/**
 * List orientation type
 */
export type ListOrientation = 'vertical' | 'horizontal';

/**
 * List visual variant
 *  - default: flat rows (original)
 *  - card: each item rendered as a mini-card with border, radius and shadow on hover
 */
export type ListVariant = 'default' | 'card';

/**
 * List item interface
 */
export interface ListItem {
  /** Item label text */
  label: string;
  /** Optional icon identifier */
  icon?: string;
  /** Optional action label */
  action?: string;
  /** Item identifier */
  id?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Any additional data */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * List Component
 *
 * A flexible list component that supports vertical/horizontal layouts,
 * icons, actions, and dividers.
 *
 * @example
 * ```html
 * <lc-list
 *   [items]="listItems"
 *   orientation="vertical"
 *   [showDividers]="true"
 *   (itemClick)="handleItemClick($event)"
 *   (actionClick)="handleActionClick($event)"
 * />
 * ```
 */
@Component({
  selector: 'lc-list',
  standalone: true,
  imports: [CommonModule, IconComponent, ButtonComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent {
  /** Custom item template provided via lcListItem directive */
  @ContentChild(ListItemTemplateDirective) itemTemplate?: ListItemTemplateDirective;

  /** Array of list items to display */
  items = input<ListItem[]>([]);

  /** Orientation of the list */
  orientation = input<ListOrientation>('vertical');

  /** Visual variant */
  variant = input<ListVariant>('default');

  /** Whether to show dividers between items */
  showDividers = input<boolean>(false);

  /** Event emitted when an item is clicked */
  readonly itemClick = output<ListItem>();

  /** Event emitted when an action button is clicked */
  readonly actionClick = output<ListItem>();

  /**
   * Computed CSS classes for the list
   */
  listClasses = computed(() => {
    const classes = ['lc-list'];

    classes.push(`lc-list--${this.orientation()}`);
    classes.push(`lc-list--${this.variant()}`);

    if (this.showDividers()) {
      classes.push('lc-list--with-dividers');
    }

    return classes.join(' ');
  });

  /**
   * Get CSS classes for a list item
   */
  getItemClasses(item: ListItem): string {
    const classes = ['lc-list__item'];

    if (item.disabled) {
      classes.push('lc-list__item--disabled');
    }

    return classes.join(' ');
  }

  /**
   * Handle item click
   */
  onItemClick(item: ListItem): void {
    if (!item.disabled) {
      this.itemClick.emit(item);
    }
  }

  /**
   * Handle action button click
   */
  onActionClick(item: ListItem): void {
    this.actionClick.emit(item);
  }
}
