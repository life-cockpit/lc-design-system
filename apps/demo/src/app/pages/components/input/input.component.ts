import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  InputComponent,
  CardComponent,
  SelectComponent,
  CheckboxComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-input-demo',
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    CardComponent,
    SelectComponent,
    CheckboxComponent,
    TableComponent,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
})
export class InputDemoComponent {
  // Demo values
  protected textValue = signal('');
  protected emailValue = signal('');
  protected passwordValue = signal('');
  protected numberValue = signal('');
  protected disabledValue = signal('Disabled input');
  protected readonlyValue = signal('Readonly input');
  protected errorValue = signal('invalid@');
  protected charCountValue = signal('');

  // Interactive controls
  protected selectedSize = signal<'xs' | 'sm' | 'md' | 'lg'>('md');
  protected showHelperText = signal(true);
  protected showError = signal(false);
  protected isDisabled = signal(false);
  protected isReadonly = signal(false);
  protected isRequired = signal(false);

  // Code examples
  protected readonly basicExample = `<lc-input
  label="Email"
  type="email"
  placeholder="Enter your email"
  [(ngModel)]="email"
></lc-input>`;

  protected readonly sizesExample = `<!-- Extra Small -->
<lc-input size="xs" label="Extra Small" placeholder="xs input"></lc-input>

<!-- Small -->
<lc-input size="sm" label="Small" placeholder="sm input"></lc-input>

<!-- Medium (Default) -->
<lc-input size="md" label="Medium" placeholder="md input"></lc-input>

<!-- Large -->
<lc-input size="lg" label="Large" placeholder="lg input"></lc-input>`;

  protected readonly statesExample = `<!-- Normal -->
<lc-input label="Normal" placeholder="Enter text"></lc-input>

<!-- Disabled -->
<lc-input label="Disabled" placeholder="Can't edit" [disabled]="true"></lc-input>

<!-- Readonly -->
<lc-input label="Readonly" value="Read only value" [readonly]="true"></lc-input>

<!-- Error -->
<lc-input 
  label="Email" 
  placeholder="Enter email"
  error="Invalid email format"
></lc-input>

<!-- Required -->
<lc-input label="Required Field" [required]="true"></lc-input>`;

  protected readonly typesExample = `<!-- Text -->
<lc-input type="text" label="Name" placeholder="Enter your name"></lc-input>

<!-- Email -->
<lc-input type="email" label="Email" placeholder="you@example.com"></lc-input>

<!-- Password -->
<lc-input type="password" label="Password"></lc-input>

<!-- Number -->
<lc-input type="number" label="Age" placeholder="25"></lc-input>

<!-- Phone -->
<lc-input type="tel" label="Phone" placeholder="(555) 123-4567"></lc-input>

<!-- URL -->
<lc-input type="url" label="Website" placeholder="https://example.com"></lc-input>`;

  protected readonly featuresExample = `<!-- With Helper Text -->
<lc-input 
  label="Email" 
  placeholder="you@example.com"
  helperText="We'll never share your email"
></lc-input>

<!-- With Character Count -->
<lc-input 
  label="Bio"
  placeholder="Tell us about yourself"
  [maxLength]="200"
  [showCharCount]="true"
></lc-input>

<!-- With Icons (TODO: requires icon component) -->
<lc-input 
  label="Email"
  iconBefore="envelope"
  placeholder="you@example.com"
></lc-input>`;

  protected sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg'];
  protected sizeOptions = [
    { value: 'xs', label: 'xs' },
    { value: 'sm', label: 'sm' },
    { value: 'md', label: 'md' },
    { value: 'lg', label: 'lg' },
  ];

  protected onValueChange(value: string): void {
    console.log('Value changed:', value);
  }

  protected onInputFocus(): void {
    console.log('Input focused');
  }

  protected onInputBlur(): void {
    console.log('Input blurred');
  }

  protected onEnterPressed(): void {
    console.log('Enter key pressed');
  }

  // API documentation table
  apiColumns = signal<TableColumn[]>([
    { key: 'prop', label: 'Prop', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiData = signal([
    { prop: 'label', type: 'string', default: '-', description: 'Input label' },
    {
      prop: 'type',
      type: "'text' | 'email' | 'password' | 'number' | 'tel' | 'url'",
      default: "'text'",
      description: 'Input type',
    },
    { prop: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size' },
    { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disable the input' },
    { prop: 'readonly', type: 'boolean', default: 'false', description: 'Make input readonly' },
    { prop: 'required', type: 'boolean', default: 'false', description: 'Mark as required' },
    { prop: 'error', type: 'string', default: '-', description: 'Error message' },
    { prop: 'helperText', type: 'string', default: '-', description: 'Helper text below input' },
    { prop: 'maxLength', type: 'number', default: '-', description: 'Max character length' },
    {
      prop: 'showCharCount',
      type: 'boolean',
      default: 'false',
      description: 'Show character count',
    },
  ]);
}
