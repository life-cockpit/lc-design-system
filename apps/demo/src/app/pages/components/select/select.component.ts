import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  Validators,
} from '@angular/forms';
import {
  SelectComponent,
  CardComponent,
  CheckboxComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-select-demo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SelectComponent,
    CardComponent,
    CheckboxComponent,
    TableComponent,
  ],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectDemoComponent {
  // Basic options
  basicOptions = signal([
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
  ]);

  // Grouped options
  groupedOptions = signal([
    {
      label: 'Fruits',
      options: [
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
        { value: 'cherry', label: 'Cherry' },
      ],
    },
    {
      label: 'Vegetables',
      options: [
        { value: 'carrot', label: 'Carrot' },
        { value: 'broccoli', label: 'Broccoli' },
        { value: 'spinach', label: 'Spinach' },
      ],
    },
  ]);

  // Country options (searchable)
  countryOptions = signal([
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'cn', label: 'China' },
  ]);

  // Interactive playground
  playgroundVariant = signal<'outline' | 'filled'>('outline');
  playgroundSize = signal<'xs' | 'sm' | 'md' | 'lg'>('md');
  playgroundDisabled = signal(false);
  playgroundError = signal(false);
  playgroundSearchable = signal(false);
  playgroundMultiple = signal(false);
  playgroundValue = signal<string | string[] | null>(null);

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

  // Reactive form
  selectForm = new FormGroup({
    country: new FormControl('', [(control) => Validators.required(control)]),
    interests: new FormControl([] as string[]),
    notification: new FormControl('email'),
  });

  onSubmit(): void {
    if (this.selectForm.valid) {
      console.log('Form submitted:', this.selectForm.value);
    }
  }

  // API Documentation
  apiColumns = signal<TableColumn[]>([
    { key: 'prop', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiData = signal([
    {
      prop: 'variant',
      type: "'outline' | 'filled'",
      default: "'outline'",
      description: 'Visual variant',
    },
    { prop: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Size' },
    { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { prop: 'error', type: 'boolean', default: 'false', description: 'Error state' },
    { prop: 'searchable', type: 'boolean', default: 'false', description: 'Enable search' },
    { prop: 'multiple', type: 'boolean', default: 'false', description: 'Multiple selection' },
  ]);
}
