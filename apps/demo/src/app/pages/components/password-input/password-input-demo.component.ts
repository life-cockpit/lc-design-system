import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  PasswordInputComponent,
  CardComponent,
  CheckboxComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-password-input-demo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    PasswordInputComponent,
    CardComponent,
    CheckboxComponent,
    TableComponent,
  ],
  templateUrl: './password-input-demo.component.html',
  styleUrl: './password-input-demo.component.scss',
})
export class PasswordInputDemoComponent {
  // Demo controls
  protected passwordControl = new FormControl('');
  protected withStrengthControl = new FormControl('');
  protected withRequirementsControl = new FormControl('');
  protected disabledControl = new FormControl({ value: 'DisabledPassword123!', disabled: true });
  protected errorControl = new FormControl('weak');

  // Interactive controls
  protected showStrengthMeter = true;
  protected showRequirements = true;
  protected isDisabled = false;
  protected showError = false;

  // Code examples
  protected readonly basicExample = `<lc-password-input
  label="Password"
  placeholder="Enter your password"
  [formControl]="passwordControl"
></lc-password-input>`;

  protected readonly withStrengthExample = `<lc-password-input
  label="Create Password"
  placeholder="Choose a strong password"
  [formControl]="passwordControl"
  [showStrengthMeter]="true"
  helperText="Choose a password with at least 8 characters"
></lc-password-input>`;

  protected readonly withRequirementsExample = `<lc-password-input
  label="Set Password"
  placeholder="Enter password"
  [formControl]="passwordControl"
  [showStrengthMeter]="true"
  [showRequirements]="true"
></lc-password-input>`;

  protected readonly statesExample = `<!-- Normal -->
<lc-password-input 
  label="Password" 
  [formControl]="passwordControl"
></lc-password-input>

<!-- Disabled -->
<lc-password-input 
  label="Password" 
  [formControl]="disabledControl"
></lc-password-input>

<!-- With Error -->
<lc-password-input 
  label="Password" 
  [formControl]="errorControl"
  error="Password is too weak"
></lc-password-input>

<!-- With Helper Text -->
<lc-password-input 
  label="Password" 
  [formControl]="passwordControl"
  helperText="Must be at least 8 characters"
></lc-password-input>`;

  protected readonly formIntegrationExample = `import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({...})
export class MyComponent {
  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ])
  });

  onSubmit() {
    if (this.form.valid) {
      console.log('Password:', this.form.value.password);
    }
  }
}`;

  // API documentation table
  protected readonly apiColumns = signal<TableColumn[]>([
    { key: 'property', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected readonly apiData = signal([
    { property: '@Input() label', type: 'string', default: "''", description: 'Label text displayed above the input' },
    { property: '@Input() placeholder', type: 'string', default: "''", description: 'Placeholder text shown when input is empty' },
    { property: '@Input() helperText', type: 'string', default: "''", description: 'Helper text displayed below the input' },
    { property: '@Input() error', type: 'string', default: "''", description: 'Error message to display (shows error state)' },
    { property: '@Input() showStrengthMeter', type: 'boolean', default: 'true', description: 'Whether to show password strength indicator' },
    { property: '@Input() showRequirements', type: 'boolean', default: 'false', description: 'Whether to show password requirements list' },
    { property: '@Input() disabled', type: 'boolean', default: 'false', description: 'Whether the input is disabled' },
    { property: '@Output() valueChange', type: 'EventEmitter<string>', default: '-', description: 'Emits when the password value changes' },
  ]);

  // Event handlers
  onPasswordChange(value: string): void {
    console.log('Password changed:', value);
  }

  toggleDisabled(): void {
    if (this.isDisabled) {
      this.passwordControl.disable();
    } else {
      this.passwordControl.enable();
    }
  }
}
