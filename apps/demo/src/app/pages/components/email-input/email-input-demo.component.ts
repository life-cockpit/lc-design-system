import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  EmailInputComponent,
  CardComponent,
  CheckboxComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-email-input-demo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EmailInputComponent,
    CardComponent,
    CheckboxComponent,
    TableComponent,
  ],
  templateUrl: './email-input-demo.component.html',
  styleUrl: './email-input-demo.component.scss',
})
export class EmailInputDemoComponent {
  // Demo controls
  protected emailControl = new FormControl('');
  protected requiredControl = new FormControl('');
  protected validatedControl = new FormControl('');
  protected disabledControl = new FormControl({ value: 'user@example.com', disabled: true });
  protected errorControl = new FormControl('invalid-email');

  // Interactive controls
  protected isRequired = false;
  protected validateOnInput = false;
  protected isDisabled = false;
  protected showError = false;

  // Validation state
  protected validationState: { valid: boolean; error?: string } = {
    valid: false,
    error: undefined,
  };

  // Code examples
  protected readonly basicExample = `<lc-email-input
  label="Email Address"
  placeholder="you@example.com"
  [formControl]="emailControl"
></lc-email-input>`;

  protected readonly requiredExample = `<lc-email-input
  label="Email Address"
  placeholder="you@example.com"
  [formControl]="emailControl"
  [required]="true"
  helperText="We'll never share your email"
></lc-email-input>`;

  protected readonly validationExample = `<lc-email-input
  label="Email Address"
  placeholder="you@example.com"
  [formControl]="emailControl"
  [validateOnInput]="true"
  (validationChange)="handleValidation($event)"
></lc-email-input>`;

  protected readonly statesExample = `<!-- Normal -->
<lc-email-input 
  label="Email" 
  [formControl]="emailControl"
></lc-email-input>

<!-- Required -->
<lc-email-input 
  label="Email" 
  [formControl]="emailControl"
  [required]="true"
></lc-email-input>

<!-- Disabled -->
<lc-email-input 
  label="Email" 
  [formControl]="disabledControl"
></lc-email-input>

<!-- With Error -->
<lc-email-input 
  label="Email" 
  [formControl]="errorControl"
  error="Invalid email format"
></lc-email-input>

<!-- With Helper Text -->
<lc-email-input 
  label="Email" 
  [formControl]="emailControl"
  helperText="We'll send a verification email"
></lc-email-input>`;

  protected readonly formIntegrationExample = `import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({...})
export class MyComponent {
  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Email:', this.form.value.email);
    }
  }

  handleValidation(state: { valid: boolean; error?: string }) {
    console.log('Email valid:', state.valid);
    if (state.error) {
      console.log('Validation error:', state.error);
    }
  }
}`;

  protected readonly validationPatternExample = `RFC 5322 Compliant Email Validation:
/^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

Valid Examples:
- user@example.com
- test.user@example.com
- user+tag@example.co.uk
- user_name@example-domain.com

Invalid Examples:
- notanemail
- @example.com
- user@
- user @example.com (space)
- user@.com`;

  // API documentation table
  protected readonly apiColumns = signal<TableColumn[]>([
    { key: 'property', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected readonly apiData = signal([
    {
      property: '@Input() label',
      type: 'string',
      default: "'Email'",
      description: 'Label text displayed above the input',
    },
    {
      property: '@Input() placeholder',
      type: 'string',
      default: "'you@example.com'",
      description: 'Placeholder text shown when input is empty',
    },
    {
      property: '@Input() helperText',
      type: 'string',
      default: "''",
      description: 'Helper text displayed below the input',
    },
    {
      property: '@Input() error',
      type: 'string',
      default: "''",
      description: 'Custom error message (overrides validation errors)',
    },
    {
      property: '@Input() required',
      type: 'boolean',
      default: 'false',
      description: 'Whether the field is required',
    },
    {
      property: '@Input() validateOnInput',
      type: 'boolean',
      default: 'false',
      description: 'Show validation errors immediately (default: on blur)',
    },
    {
      property: '@Input() disabled',
      type: 'boolean',
      default: 'false',
      description: 'Whether the input is disabled',
    },
    {
      property: '@Input() size',
      type: "'xs' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the input field',
    },
    {
      property: '@Output() valueChange',
      type: 'EventEmitter<string>',
      default: '-',
      description: 'Emits when the email value changes',
    },
    {
      property: '@Output() validationChange',
      type: 'EventEmitter<{valid, error}>',
      default: '-',
      description: 'Emits when validation state changes',
    },
    {
      property: 'validate()',
      type: 'method',
      default: '-',
      description: 'Manually trigger validation, returns boolean',
    },
    {
      property: 'resetValidation()',
      type: 'method',
      default: '-',
      description: 'Reset validation state (clear errors)',
    },
  ]);

  // Event handlers
  onEmailChange(value: string): void {
    console.log('Email changed:', value);
  }

  onValidationChange(state: { valid: boolean; error?: string }): void {
    this.validationState = state;
    console.log('Validation state:', state);
  }

  toggleDisabled(): void {
    if (this.isDisabled) {
      this.emailControl.disable();
      this.requiredControl.disable();
    } else {
      this.emailControl.enable();
      this.requiredControl.enable();
    }
  }
}
