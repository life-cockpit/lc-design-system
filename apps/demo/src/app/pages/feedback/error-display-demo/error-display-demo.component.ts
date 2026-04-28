import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ErrorDisplayComponent,
  CardComponent,
  ButtonComponent,
  CheckboxComponent,
  TableComponent,
  TableColumn,
  SelectComponent,
  SelectOption,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-error-display-demo',
  imports: [
    CommonModule,
    FormsModule,
    ErrorDisplayComponent,
    CardComponent,
    ButtonComponent,
    CheckboxComponent,
    TableComponent,
    SelectComponent,
  ],
  templateUrl: './error-display-demo.component.html',
  styleUrl: './error-display-demo.component.scss',
})
export class ErrorDisplayDemoComponent {
  // Demo state
  protected currentError = signal<Error | { code?: string; message?: string } | null>(null);
  protected customMessage = signal<string>('');
  protected currentSeverity = signal<'error' | 'warning' | 'info'>('error');
  protected isDismissible = signal<boolean>(true);
  protected autoHide = signal<boolean>(false);

  // Common Cognito errors
  protected readonly cognitoErrors = [
    { code: 'UsernameExistsException', label: 'Username Exists' },
    { code: 'UserNotFoundException', label: 'User Not Found' },
    { code: 'NotAuthorizedException', label: 'Not Authorized' },
    { code: 'UserNotConfirmedException', label: 'User Not Confirmed' },
    { code: 'CodeMismatchException', label: 'Code Mismatch' },
    { code: 'ExpiredCodeException', label: 'Expired Code' },
    { code: 'InvalidPasswordException', label: 'Invalid Password' },
    { code: 'LimitExceededException', label: 'Limit Exceeded' },
    { code: 'TooManyRequestsException', label: 'Too Many Requests' },
  ];

  // Severity options
  protected readonly severityOptions = signal<SelectOption[]>([
    { value: 'error', label: 'Error' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' },
  ]);

  // Code examples
  protected readonly basicExample = `<lc-error-display
  [error]="error"
></lc-error-display>`;

  protected readonly cognitoExample = `// In your component
signIn() {
  this.authService.signIn(email, password).subscribe({
    error: (error) => {
      this.authError = error;
      // Error is automatically mapped to user-friendly message:
      // "NotAuthorizedException" → "Incorrect email or password."
      // "UserNotFoundException" → "No account found with this email address."
    }
  });
}

// In your template
<lc-error-display [error]="authError"></lc-error-display>`;

  protected readonly customMessageExample = `<lc-error-display
  message="Invalid credentials. Please try again."
  severity="error"
  [dismissible]="true"
></lc-error-display>`;

  protected readonly severityExample = `<!-- Error (default) -->
<lc-error-display
  message="Operation failed"
  severity="error"
></lc-error-display>

<!-- Warning -->
<lc-error-display
  message="Password will expire soon"
  severity="warning"
></lc-error-display>

<!-- Info -->
<lc-error-display
  message="Email verification sent"
  severity="info"
></lc-error-display>`;

  protected readonly autoDismissExample = `<lc-error-display
  [error]="error"
  [autoDismiss]="true"
  [autoDismissDelay]="5000"
></lc-error-display>`;

  protected readonly errorMappingExample = `Common Cognito Error Mappings:

UsernameExistsException
→ "An account with this email already exists."

UserNotFoundException
→ "No account found with this email address."

NotAuthorizedException
→ "Incorrect email or password."

UserNotConfirmedException
→ "Please verify your email address before signing in."

CodeMismatchException
→ "Invalid verification code. Please try again."

ExpiredCodeException
→ "Verification code has expired. Please request a new one."

InvalidPasswordException
→ "Password must be at least 8 characters with uppercase, lowercase, number, and special character."

LimitExceededException
→ "Too many attempts. Please try again later."

TooManyRequestsException
→ "Too many requests. Please wait a moment and try again."`;

  // API documentation table
  protected readonly apiColumns = signal<TableColumn[]>([
    { key: 'property', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected readonly apiData = signal([
    {
      property: '@Input() error',
      type: 'Error | { code?, message? } | null',
      default: 'null',
      description: 'Error object (Cognito or generic)',
    },
    {
      property: '@Input() message',
      type: 'string',
      default: "''",
      description: 'Custom error message (overrides error.message)',
    },
    {
      property: '@Input() severity',
      type: "'error' | 'warning' | 'info'",
      default: "'error'",
      description: 'Error severity level',
    },
    {
      property: '@Input() title',
      type: 'string',
      default: "''",
      description: 'Title for the error display',
    },
    {
      property: '@Input() dismissible',
      type: 'boolean',
      default: 'true',
      description: 'Whether the error can be dismissed',
    },
    {
      property: '@Input() showIcon',
      type: 'boolean',
      default: 'true',
      description: 'Whether to show icon',
    },
    {
      property: '@Input() autoDismiss',
      type: 'boolean',
      default: 'false',
      description: 'Whether to automatically hide after delay',
    },
    {
      property: '@Input() autoDismissDelay',
      type: 'number',
      default: '5000',
      description: 'Auto-dismiss delay in milliseconds',
    },
    { property: 'show()', type: 'method', default: '-', description: 'Manually show the error' },
    { property: 'hide()', type: 'method', default: '-', description: 'Manually hide the error' },
  ]);

  // Event handlers
  showCognitoError(errorCode: string): void {
    this.currentError.set({ code: errorCode });
  }

  showCustomError(): void {
    this.currentError.set({ message: 'This is a custom error message for testing.' });
  }

  showGenericError(): void {
    this.currentError.set(new Error('An unexpected error occurred'));
  }

  clearError(): void {
    this.currentError.set(null);
  }
}
