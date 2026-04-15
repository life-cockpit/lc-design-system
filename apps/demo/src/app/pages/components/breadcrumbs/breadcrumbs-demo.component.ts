import { Component, signal } from '@angular/core';
import {
  BreadcrumbsComponent,
  BreadcrumbItem,
  TableComponent,
  TableColumn,
} from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-breadcrumbs-demo',
  imports: [BreadcrumbsComponent, TableComponent],
  templateUrl: './breadcrumbs-demo.component.html',
  styleUrls: ['./breadcrumbs-demo.component.scss'],
})
export class BreadcrumbsDemoComponent {
  basicItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Products', url: '/products' },
    { label: 'Electronics', url: '/products/electronics' },
    { label: 'Laptops' },
  ];

  shallowItems: BreadcrumbItem[] = [{ label: 'Home', url: '/' }, { label: 'About' }];

  deepItems: BreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Category', url: '/category' },
    { label: 'Sub-Category', url: '/category/sub' },
    { label: 'Product Type', url: '/category/sub/type' },
    { label: 'Brand', url: '/category/sub/type/brand' },
    { label: 'Product Details' },
  ];

  customSeparatorItems: BreadcrumbItem[] = [
    { label: 'Dashboard', url: '/dashboard' },
    { label: 'Settings', url: '/dashboard/settings' },
    { label: 'Profile' },
  ];

  // API documentation table
  apiColumns = signal<TableColumn[]>([
    { key: 'prop', label: 'Prop', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiData = signal([
    {
      prop: 'itemsInput',
      type: 'BreadcrumbItem[]',
      default: '[]',
      description: 'Array of breadcrumb items',
    },
    {
      prop: 'separatorInput',
      type: 'string',
      default: "'/'",
      description: 'Character to separate items',
    },
    {
      prop: 'maxItemsInput',
      type: 'number',
      default: '0',
      description: 'Maximum items to show (0 = all)',
    },
    { prop: 'sizeInput', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size variant' },
    { prop: 'ariaLabelInput', type: 'string', default: "'Breadcrumbs'", description: 'ARIA label' },
  ]);
}
