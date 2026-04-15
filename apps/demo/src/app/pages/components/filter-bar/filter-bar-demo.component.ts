import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {
  FilterBarComponent,
  FilterConfig,
  FilterValues,
  CardComponent,
  TableComponent,
  type TableColumn,
} from '@life-cockpit/ui-kit';

@Component({
  standalone: true,
  imports: [JsonPipe, FilterBarComponent, CardComponent, TableComponent],
  selector: 'app-filter-bar-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './filter-bar-demo.component.html',
  styleUrl: './filter-bar-demo.component.scss',
})
export class FilterBarDemoComponent {
  protected readonly apiTable: TableColumn[] = [
    { key: 'property', label: 'Property' },
    { key: 'type', label: 'Type' },
    { key: 'default', label: 'Default' },
    { key: 'description', label: 'Description' },
  ];

  protected readonly apiData = [
    {
      property: 'filters',
      type: 'FilterConfig[]',
      default: '(required)',
      description: 'Array of filter configurations defining the filter bar layout',
    },
    {
      property: 'values',
      type: 'FilterValues',
      default: '{}',
      description: 'Current filter values keyed by filter key',
    },
    {
      property: 'size',
      type: "'sm' | 'md'",
      default: "'md'",
      description: 'Size variant affecting padding and font size',
    },
    {
      property: 'valuesChange',
      type: 'EventEmitter<FilterValues>',
      default: '—',
      description: 'Emitted when any filter value changes',
    },
  ];

  protected readonly filterConfigInterface = [
    {
      property: 'key',
      type: 'string',
      default: '(required)',
      description: 'Unique identifier for this filter',
    },
    {
      property: 'label',
      type: 'string',
      default: '(required)',
      description: 'Display label for the filter',
    },
    {
      property: 'type',
      type: "'select' | 'toggle' | 'search'",
      default: '(required)',
      description: 'Type of filter control to render',
    },
    {
      property: 'options',
      type: 'FilterOption[]',
      default: '—',
      description: 'Available options for select/toggle types',
    },
    {
      property: 'placeholder',
      type: 'string',
      default: '—',
      description: 'Placeholder text (for search type)',
    },
  ];

  readonly strategyFilters: FilterConfig[] = [
    {
      key: 'lifecycle',
      label: 'Lifecycle',
      type: 'toggle',
      options: [
        { value: '', label: 'All' },
        { value: 'CANDIDATE', label: 'Candidate' },
        { value: 'VALIDATED', label: 'Validated' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'PAUSED', label: 'Paused' },
        { value: 'RETIRED', label: 'Retired' },
      ],
    },
    {
      key: 'symbol',
      label: 'Symbol',
      type: 'select',
      placeholder: 'All Symbols',
      options: [
        { value: 'XAUUSD', label: 'XAU/USD' },
        { value: 'XAGUSD', label: 'XAG/USD' },
        { value: 'EURUSD', label: 'EUR/USD' },
      ],
    },
    {
      key: 'search',
      label: '',
      type: 'search',
      placeholder: 'Search strategies...',
    },
  ];

  readonly simpleFilters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'toggle',
      options: [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
    {
      key: 'search',
      label: '',
      type: 'search',
      placeholder: 'Filter...',
    },
  ];

  readonly searchOnlyFilters: FilterConfig[] = [
    {
      key: 'search',
      label: '',
      type: 'search',
      placeholder: 'Search assets...',
    },
  ];

  readonly strategyValues = signal<FilterValues>({ lifecycle: '' });
  readonly simpleValues = signal<FilterValues>({ status: 'all' });
  readonly searchOnlyValues = signal<FilterValues>({});

  protected readonly basicExample = `<lc-filter-bar
  [filters]="filters"
  [values]="currentValues()"
  (valuesChange)="currentValues.set($event)"
/>`;

  protected readonly smallExample = `<lc-filter-bar
  [filters]="filters"
  [values]="values()"
  size="sm"
  (valuesChange)="values.set($event)"
/>`;
}
