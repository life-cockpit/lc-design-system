import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  VerificationCodeInputComponent,
  CardComponent,
  CheckboxComponent,
  ButtonComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-verification-code-input-demo',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    VerificationCodeInputComponent,
    CardComponent,
    CheckboxComponent,
    ButtonComponent,
    TableComponent,
  ],
  templateUrl: './verification-code-input-demo.component.html',
  styleUrl: './verification-code-input-demo.component.scss',
})
export class VerificationCodeInputDemoComponent {
  // Demo controls
  protected codeControl = new FormControl('');
  protected autoSubmitControl = new FormControl('');
  protected disabledControl = new FormControl({ value: '123456', disabled: true });
  protected errorControl = new FormControl('');

  // Interactive controls
  protected enableAutoSubmit = true;
  protected isDisabled = false;
  protected showError = false;

  // Completion tracking
  protected lastCompletedCode = signal<string>('');
  protected submissionCount = signal(0);

  // Code examples
  protected readonly basicExample = `<lc-verification-code-input
  label="Verification Code"
  [formControl]="codeControl"
  (codeComplete)="onCodeComplete($event)"
></lc-verification-code-input>`;

  protected readonly autoSubmitExample = `<lc-verification-code-input
  label="Enter Verification Code"
  [formControl]="codeControl"
  [autoSubmit]="true"
  (codeComplete)="onCodeComplete($event)"
  helperText="Enter the 6-digit code sent to your email"
></lc-verification-code-input>`;

  protected readonly statesExample = `<!-- Normal -->
<lc-verification-code-input 
  label="Verification Code" 
  [formControl]="codeControl"
></lc-verification-code-input>

<!-- Disabled -->
<lc-verification-code-input 
  label="Verification Code" 
  [formControl]="disabledControl"
></lc-verification-code-input>

<!-- With Error -->
<lc-verification-code-input 
  label="Verification Code" 
  [formControl]="errorControl"
  error="Invalid verification code"
></lc-verification-code-input>

<!-- With Helper Text -->
<lc-verification-code-input 
  label="Verification Code" 
  [formControl]="codeControl"
  helperText="Check your email for the code"
></lc-verification-code-input>`;

  protected readonly formIntegrationExample = `import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({...})
export class MyComponent {
  form = new FormGroup({
    verificationCode: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\\d{6}$/)
    ])
  });

  onCodeComplete(code: string) {
    // Auto-submit when code is complete
    if (this.form.valid) {
      this.verifyCode(code);
    }
  }

  verifyCode(code: string) {
    // API call to verify the code
    this.authService.verifyCode(code).subscribe({
      next: () => console.log('Code verified!'),
      error: () => this.form.controls.verificationCode.setErrors({
        invalid: true
      })
    });
  }
}`;

  protected readonly pasteExample = `<!-- The component automatically handles paste events -->
<lc-verification-code-input 
  label="Verification Code" 
  [formControl]="codeControl"
  helperText="You can paste the code from your email"
></lc-verification-code-input>

<!-- When user pastes "123456", all inputs are filled automatically -->`;

  // API documentation table
  protected readonly apiColumns = signal<TableColumn[]>([
    { key: 'property', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected readonly apiData = signal([
    { property: '@Input() label', type: 'string', default: "''", description: 'Label text displayed above the input' },
    { property: '@Input() helperText', type: 'string', default: "''", description: 'Helper text displayed below the input' },
    { property: '@Input() error', type: 'string', default: "''", description: 'Error message to display (shows error state)' },
    { property: '@Input() autoSubmit', type: 'boolean', default: 'false', description: 'Whether to emit codeComplete when all digits are entered' },
    { property: '@Input() disabled', type: 'boolean', default: 'false', description: 'Whether the input is disabled' },
    { property: '@Output() codeComplete', type: 'EventEmitter<string>', default: '-', description: 'Emits when all 6 digits are entered' },
  ]);

  // Event handlers
  onCodeComplete(code: string): void {
    this.lastCompletedCode.set(code);
    this.submissionCount.update(count => count + 1);
    console.log('Code completed:', code);
  }

  onValueChange(value: string): void {
    console.log('Code value changed:', value);
  }

  toggleDisabled(): void {
    if (this.isDisabled) {
      this.codeControl.disable();
    } else {
      this.codeControl.enable();
    }
  }

  resetCode(): void {
    this.codeControl.setValue('');
    this.lastCompletedCode.set('');
  }

  fillCode(code: string): void {
    this.codeControl.setValue(code);
  }
}
