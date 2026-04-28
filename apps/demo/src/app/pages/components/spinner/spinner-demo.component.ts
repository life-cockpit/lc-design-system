import { Component } from '@angular/core';
import {
  SpinnerComponent,
  CardComponent,
  ButtonComponent,
  TableComponent,
  type TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-spinner-demo',
  imports: [SpinnerComponent, CardComponent, ButtonComponent, TableComponent],
  templateUrl: './spinner-demo.component.html',
  styleUrl: './spinner-demo.component.scss',
})
export class SpinnerDemoComponent {
  protected readonly apiTable: TableColumn[] = [
    { key: 'property', label: 'Property' },
    { key: 'type', label: 'Type' },
    { key: 'default', label: 'Default' },
    { key: 'description', label: 'Description' },
  ];

  protected readonly apiData = [
    {
      property: 'size',
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the spinner circle and surrounding padding',
    },
    {
      property: 'message',
      type: 'string',
      default: '—',
      description: 'Optional loading message displayed below the spinner',
    },
  ];

  protected readonly basicExample = `<lc-spinner />`;

  protected readonly messageExample = `<lc-spinner message="Loading data..." />`;

  protected readonly sizesExample = `<lc-spinner size="sm" message="Small" />
<lc-spinner size="md" message="Medium (default)" />
<lc-spinner size="lg" message="Large" />`;
}
