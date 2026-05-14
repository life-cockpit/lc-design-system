import { Directive, input, TemplateRef, inject } from '@angular/core';

/**
 * Directive for defining custom cell templates in the Table component.
 *
 * @example
 * ```html
 * <lc-table [columns]="columns" [data]="data">
 *   <ng-template lcTableCell="status" let-row>
 *     <lc-badge [variant]="row.status">{{ row.status }}</lc-badge>
 *   </ng-template>
 * </lc-table>
 * ```
 */
@Directive({
  selector: '[lcTableCell]',
  standalone: true,
})
export class TableCellDirective {
  /** The column key this template applies to */
  readonly columnKey = input('', { alias: 'lcTableCell' });

  public template = inject(TemplateRef<{ $implicit: Record<string, unknown> }>);
}
