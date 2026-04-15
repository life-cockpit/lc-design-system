import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  DatepickerComponent,
  CardComponent,
  SelectComponent,
  CheckboxComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-datepicker-demo',
  standalone: true,
  imports: [
    DatepickerComponent,
    CardComponent,
    SelectComponent,
    CheckboxComponent,
    TableComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
})
export class DatepickerDemoComponent {
  // Basic examples
  basicDate: Date | null = null;
  outlineDate: Date | null = null;
  filledDate: Date | null = null;

  // Size examples
  xsDate: Date | null = null;
  smDate: Date | null = null;
  mdDate: Date | null = null;
  lgDate: Date | null = null;

  // State examples
  disabledDate: Date | null = new Date();
  errorDate: Date | null = null;
  readonlyDate: Date | null = new Date();
  requiredDate: Date | null = null;

  // Date constraints
  minDate = new Date();
  maxDate = new Date();
  minMaxDate: Date | null = null;

  // Format examples
  formatDate: Date | null = null;

  // Reactive form
  datepickerForm = new FormGroup({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null),
    birthDate: new FormControl<Date | null>(null),
  });

  // Playground
  playgroundVariant: 'outline' | 'filled' = 'outline';
  playgroundSize: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  playgroundDisabled = false;
  playgroundError = false;
  playgroundReadonly = false;
  playgroundRequired = false;
  playgroundDate: Date | null = null;

  variantOptions = [
    { value: 'outline', label: 'Outline' },
    { value: 'filled', label: 'Filled' },
  ];

  sizeOptions = [
    { value: 'xs', label: 'XS' },
    { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' },
    { value: 'lg', label: 'LG' },
  ];

  // API Documentation
  apiInputsColumns: TableColumn[] = [
    { key: 'prop', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ];

  apiInputsData = [
    {
      prop: 'variant',
      type: "'outline' | 'filled'",
      default: "'outline'",
      description: 'Visual variant of the datepicker',
    },
    {
      prop: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the datepicker',
    },
    {
      prop: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether the datepicker is disabled',
    },
    {
      prop: 'error',
      type: 'boolean',
      default: 'false',
      description: 'Whether the datepicker is in error state',
    },
    {
      prop: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Whether the datepicker is required',
    },
    {
      prop: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Whether the datepicker is readonly',
    },
    { prop: 'placeholder', type: 'string', default: "''", description: 'Placeholder text' },
    {
      prop: 'label',
      type: 'string',
      default: "''",
      description: 'Label text displayed above datepicker',
    },
    {
      prop: 'helperText',
      type: 'string',
      default: "''",
      description: 'Helper text displayed below datepicker',
    },
    {
      prop: 'errorMessage',
      type: 'string',
      default: "''",
      description: 'Error message when error is true',
    },
    {
      prop: 'minDate',
      type: 'Date | undefined',
      default: 'undefined',
      description: 'Minimum selectable date',
    },
    {
      prop: 'maxDate',
      type: 'Date | undefined',
      default: 'undefined',
      description: 'Maximum selectable date',
    },
    { prop: 'format', type: 'string', default: "'dd/MM/yyyy'", description: 'Date display format' },
    {
      prop: 'ariaLabel',
      type: 'string',
      default: 'undefined',
      description: 'ARIA label for accessibility',
    },
  ];

  apiOutputsColumns: TableColumn[] = [
    { key: 'event', label: 'Event', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ];

  apiOutputsData = [
    {
      event: 'valueChange',
      type: 'EventEmitter<Date | null>',
      description: 'Emitted when date value changes',
    },
  ];

  keyboardColumns: TableColumn[] = [
    { key: 'key', label: 'Key', sortable: false },
    { key: 'action', label: 'Action', sortable: false },
  ];

  keyboardData = [
    { key: 'Space or Enter', action: 'Open/close datepicker' },
    { key: 'Escape', action: 'Close datepicker' },
    { key: 'Arrow Keys', action: 'Navigate through calendar dates' },
    { key: 'Home', action: 'Go to first day of month' },
    { key: 'End', action: 'Go to last day of month' },
    { key: 'Page Up', action: 'Go to previous month' },
    { key: 'Page Down', action: 'Go to next month' },
  ];

  constructor() {
    // Set min/max dates (30 days before and after today)
    this.minDate.setDate(this.minDate.getDate() - 30);
    this.maxDate.setDate(this.maxDate.getDate() + 30);
  }

  onSubmit(): void {
    console.log('DatePicker form submitted:', this.datepickerForm.value);
  }
}
