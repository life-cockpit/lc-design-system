import { Component } from '@angular/core';
import {
  EmptyStateComponent,
  CardComponent,
  ButtonComponent,
  TableComponent,
  type TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-empty-state-demo',
  imports: [EmptyStateComponent, CardComponent, ButtonComponent, TableComponent],
  templateUrl: './empty-state-demo.component.html',
  styleUrl: './empty-state-demo.component.scss',
})
export class EmptyStateDemoComponent {
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
      description: 'Controls padding and text sizes',
    },
    {
      property: 'icon',
      type: 'string',
      default: '—',
      description: 'Heroicon name displayed above the heading',
    },
    { property: 'heading', type: 'string', default: '—', description: 'Bold heading text' },
    {
      property: 'message',
      type: 'string',
      default: '—',
      description: 'Description text below the heading',
    },
    {
      property: 'ng-content',
      type: 'slot',
      default: '—',
      description: 'Projected content (e.g. action buttons)',
    },
  ];

  protected readonly inlineExample = `<lc-empty-state
  size="sm"
  message="No signals generated for this asset yet." />`;

  protected readonly iconExample = `<lc-empty-state
  icon="chart-bar"
  heading="No Paper Trading Portfolios"
  message="Portfolios are created automatically when strategies are promoted." />`;

  protected readonly actionExample = `<lc-empty-state
  icon="bolt"
  heading="No runs yet"
  message="Start a new AI trading run to discover strategies."
>
  <lc-button variant="primary">Create First Run</lc-button>
</lc-empty-state>`;

  protected readonly sizesExample = `<lc-empty-state size="sm" message="Small" />
<lc-empty-state size="md" message="Medium (default)" />
<lc-empty-state size="lg" message="Large" />`;
}
