import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import {
  RadioComponent,
  CardComponent,
  SelectComponent,
  CheckboxComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-radio-demo',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RadioComponent,
    CardComponent,
    SelectComponent,
    CheckboxComponent,
    TableComponent,
  ],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
})
export class RadioDemoComponent {
  // Form controls for radio groups
  protected themeValue = signal('light');
  protected planValue = signal('pro');
  protected colorValue = signal('blue');
  protected sizeValue = signal('md');
  protected shippingValue = signal('standard');

  // Interactive controls
  protected playgroundSize = signal<'xs' | 'sm' | 'md' | 'lg'>('md');
  protected playgroundValue = signal('option1');
  protected showHelperText = signal(true);
  protected showError = signal(false);
  protected isDisabled = signal(false);
  protected isRequired = signal(false);

  // Reactive form
  protected preferencesForm = new FormGroup({
    theme: new FormControl('light'),
    fontSize: new FormControl('medium'),
    language: new FormControl('en'),
  });

  // Options
  protected themes = [
    { value: 'light', label: 'Light Mode', description: 'Bright and clean interface' },
    { value: 'dark', label: 'Dark Mode', description: 'Easy on the eyes at night' },
    { value: 'auto', label: 'Auto', description: 'Follows system preference' },
  ];

  protected plans = [
    { value: 'free', label: 'Free', description: 'Basic features for personal use' },
    { value: 'pro', label: 'Pro', description: 'Advanced features for professionals' },
    { value: 'enterprise', label: 'Enterprise', description: 'Custom solutions for teams' },
  ];

  protected colors = [
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'red', label: 'Red' },
  ];

  protected fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  protected languages = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
  ];

  protected sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg'];
  protected sizeOptions = [
    { value: 'xs', label: 'xs' },
    { value: 'sm', label: 'sm' },
    { value: 'md', label: 'md' },
    { value: 'lg', label: 'lg' },
  ];

  // Code examples
  protected readonly basicExample = `themeValue = signal('light');

<lc-radio
  name="theme"
  value="light"
  label="Light Mode"
  [(ngModel)]="themeValue"
></lc-radio>`;

  protected readonly sizesExample = `<lc-radio size="xs" name="size" value="xs" label="Extra Small"></lc-radio>
<lc-radio size="sm" name="size" value="sm" label="Small"></lc-radio>
<lc-radio size="md" name="size" value="md" label="Medium"></lc-radio>
<lc-radio size="lg" name="size" value="lg" label="Large"></lc-radio>`;

  protected readonly groupExample = `themeControl = new FormControl('light');

@for (theme of themes; track theme.value) {
  <lc-radio
    name="theme-group"
    [value]="theme.value"
    [label]="theme.label"
    [helpText]="theme.description"
    [formControl]="themeControl"
  ></lc-radio>
}`;

  protected readonly statesExample = `<lc-radio name="state" value="normal" label="Normal" [formControl]="control"></lc-radio>`;

  protected readonly featuresExample = `<lc-radio 
  name="plan"
  value="pro"
  label="Pro Plan"
  helpText="$29/month"
  [formControl]="planControl"
></lc-radio>`;

  protected readonly formsExample = `preferencesForm = new FormGroup({
  theme: new FormControl('light'),
});

<form [formGroup]="preferencesForm">
  <lc-radio
    formControlName="theme"
    value="light"
    label="Light Mode"
  ></lc-radio>
</form>`;

  protected onValueChange(value: string): void {
    console.log('Radio changed:', value);
  }

  protected get formValues(): string {
    return JSON.stringify(this.preferencesForm.value, null, 2);
  }

  // API documentation tables
  apiPropsColumns = signal<TableColumn[]>([
    { key: 'prop', label: 'Prop', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiPropsData = signal([
    { prop: 'label', type: 'string', default: "''", description: 'Label text for the radio' },
    { prop: 'value', type: 'string', default: "''", description: 'Value of the radio button' },
    {
      prop: 'name',
      type: 'string',
      default: "''",
      description: 'Name for the radio group (required for grouping)',
    },
    {
      prop: 'error',
      type: 'boolean',
      default: 'false',
      description: 'Whether the radio is in error state',
    },
    {
      prop: 'errorMessage',
      type: 'string',
      default: "''",
      description: 'Error message to display',
    },
    {
      prop: 'helpText',
      type: 'string',
      default: "''",
      description: 'Helper text displayed below the radio',
    },
    {
      prop: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the radio button',
    },
    {
      prop: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Whether the radio is required',
    },
  ]);

  apiEventsColumns = signal<TableColumn[]>([
    { key: 'event', label: 'Event', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiEventsData = signal([
    {
      event: 'checkedChange',
      type: 'EventEmitter<boolean>',
      description: 'Emitted when the checked state changes',
    },
    {
      event: 'valueChange',
      type: 'EventEmitter<string>',
      description: 'Emitted when the value changes (for ngModel)',
    },
  ]);
}
