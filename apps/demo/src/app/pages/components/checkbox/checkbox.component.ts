import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { CheckboxComponent, CardComponent, SelectComponent } from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-checkbox-demo',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxComponent,
    CardComponent,
    SelectComponent,
  ],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxDemoComponent {
  // Demo values
  protected termsAccepted = signal(false);
  protected newsletter = signal(false);
  protected notifications = signal(true);

  // Size examples
  protected checkedXs = signal(true);
  protected checkedSm = signal(true);
  protected checkedMd = signal(true);
  protected checkedLg = signal(true);

  // State examples
  protected stateUnchecked = signal(false);
  protected stateChecked = signal(true);
  protected stateDisabled = signal(false);
  protected stateDisabledChecked = signal(true);
  protected stateError = signal(false);

  // Feature examples
  protected featureMarketing = signal(false);
  protected featureProducts = signal(false);
  protected featureTerms = signal(false);
  protected featureAge = signal(false);

  // Playground
  protected playgroundValue = signal(false);

  // Interactive controls
  protected selectedSize = signal<'xs' | 'sm' | 'md' | 'lg'>('md');
  protected showHelperText = signal(true);
  protected showError = signal(false);
  protected isDisabled = signal(false);
  protected isRequired = signal(false);

  // Reactive form
  protected settingsForm = new FormGroup({
    emailNotifications: new FormControl(true),
    pushNotifications: new FormControl(false),
    smsNotifications: new FormControl(false),
  });

  // Code examples
  protected readonly basicExample = `<lc-checkbox
  label="Accept terms and conditions"
  [(checked)]="termsAccepted"
></lc-checkbox>`;

  protected readonly sizesExample = `<!-- Extra Small -->
<lc-checkbox size="xs" label="Extra Small (xs)"></lc-checkbox>

<!-- Small -->
<lc-checkbox size="sm" label="Small (sm)"></lc-checkbox>

<!-- Medium (Default) -->
<lc-checkbox size="md" label="Medium (md)"></lc-checkbox>

<!-- Large -->
<lc-checkbox size="lg" label="Large (lg)"></lc-checkbox>`;

  protected readonly statesExample = `<!-- Normal -->
<lc-checkbox label="Unchecked" [(ngModel)]="unchecked"></lc-checkbox>

<!-- Checked -->
<lc-checkbox label="Checked" [(ngModel)]="checked"></lc-checkbox>

<!-- Disabled -->
<lc-checkbox label="Disabled" [(ngModel)]="disabled" [disabled]="true"></lc-checkbox>

<!-- Error -->
<lc-checkbox 
  label="Required field"
  [(ngModel)]="value"
  [required]="true"
  [error]="true"
  errorMessage="You must accept to continue"
></lc-checkbox>`;

  protected readonly featuresExample = `<!-- With Helper Text -->
<lc-checkbox 
  label="Subscribe to newsletter"
  helperText="Receive updates about new features"
></lc-checkbox>

<!-- With Error Message -->
<lc-checkbox 
  label="I accept the terms"
  [required]="true"
  error="You must accept the terms to continue"
></lc-checkbox>

<!-- Indeterminate State (useful for "select all") -->
<lc-checkbox 
  label="Select All"
  [indeterminate]="someSelected && !allSelected"
  [(ngModel)]="subscribe"
  helpText="Receive updates about new features"
></lc-checkbox>

<!-- With Error Message -->
<lc-checkbox 
  label="I accept the terms"
  [(ngModel)]="accept"
  [required]="true"
  [error]="!accept"
  errorMessage="You must accept the terms to continue
  ></lc-checkbox>
  
  <lc-checkbox 
    formControlName="pushNotifications"
    label="Push Notifications"
  ></lc-checkbox>
  
  <lc-checkbox 
    formControlName="smsNotifications"
    label="SMS Notifications"
  ></lc-checkbox>
</form>`;

  protected sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg'];
  protected sizeOptions = [
    { value: 'xs', label: 'xs' },
    { value: 'sm', label: 'sm' },
    { value: 'md', label: 'md' },
    { value: 'lg', label: 'lg' },
  ];

  protected onCheckedChange(checked: boolean): void {
    console.log('Checkbox changed:', checked);
  }

  protected get formValues(): string {
    return JSON.stringify(this.settingsForm.value, null, 2);
  }
}
