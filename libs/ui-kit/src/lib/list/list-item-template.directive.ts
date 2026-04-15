import { Directive, TemplateRef, inject } from '@angular/core';
import { ListItem } from './list.component';

/**
 * Directive for providing a custom template to render each list item.
 *
 * @example
 * ```html
 * <lc-list [items]="runs()" (itemClick)="onRunClick($event)">
 *   <ng-template lcListItem let-item>
 *     <lc-badge [variant]="getStatusVariant(item.status)">{{ item.status }}</lc-badge>
 *     <span>{{ item.symbol }}</span>
 *     <span class="text-sm text-neutral-500">{{ item.date }}</span>
 *   </ng-template>
 * </lc-list>
 * ```
 */
@Directive({
  selector: '[lcListItem]',
  standalone: true,
})
export class ListItemTemplateDirective {
  public readonly template = inject(TemplateRef<{ $implicit: ListItem }>);
}
