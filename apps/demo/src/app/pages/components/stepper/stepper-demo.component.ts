import { Component, signal } from '@angular/core';
import {
  StepperComponent,
  StepperStep,
  CardComponent,
  ButtonComponent,
  TableComponent,
  type TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-stepper-demo',
  standalone: true,
  imports: [StepperComponent, CardComponent, ButtonComponent, TableComponent],
  templateUrl: './stepper-demo.component.html',
  styleUrl: './stepper-demo.component.scss',
})
export class StepperDemoComponent {
  protected readonly apiTable: TableColumn[] = [
    { key: 'property', label: 'Property' },
    { key: 'type', label: 'Type' },
    { key: 'default', label: 'Default' },
    { key: 'description', label: 'Description' },
  ];

  protected readonly apiData = [
    {
      property: 'steps',
      type: 'StepperStep[]',
      default: '(required)',
      description: 'Array of step definitions with label, description, and optional flag',
    },
    {
      property: 'activeStep',
      type: 'number',
      default: '0',
      description: 'Active step index (0-based, supports two-way binding)',
    },
    {
      property: 'linear',
      type: 'boolean',
      default: 'true',
      description: 'Whether completed steps can be clicked to navigate back',
    },
    {
      property: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: "'horizontal'",
      description: 'Layout direction of the stepper',
    },
    {
      property: 'stepChange',
      type: 'EventEmitter<number>',
      default: '—',
      description: 'Emitted when the active step changes',
    },
  ];

  protected readonly stepInterface = [
    {
      property: 'label',
      type: 'string',
      default: '(required)',
      description: 'Step title displayed in the header',
    },
    {
      property: 'description',
      type: 'string',
      default: '—',
      description: 'Optional subtitle below the label',
    },
    {
      property: 'optional',
      type: 'boolean',
      default: 'false',
      description: 'Marks step as optional (visual indicator)',
    },
  ];

  readonly steps: StepperStep[] = [
    { label: 'Select Symbols', description: 'Choose assets to analyze' },
    { label: 'Date Range', description: 'Pick time period' },
    { label: 'Description', description: 'Describe your task', optional: true },
    { label: 'Confirm', description: 'Review & submit' },
  ];

  readonly verticalSteps: StepperStep[] = [
    { label: 'Account Setup', description: 'Create your account' },
    { label: 'Profile Details', description: 'Add personal information' },
    { label: 'Preferences', description: 'Set your preferences' },
  ];

  readonly nonLinearSteps: StepperStep[] = [
    { label: 'General' },
    { label: 'Notifications' },
    { label: 'Privacy' },
    { label: 'Advanced' },
  ];

  readonly currentStep = signal(1);
  readonly verticalStep = signal(0);
  readonly nonLinearStep = signal(0);

  protected readonly basicExample = `<lc-stepper
  [steps]="steps"
  [(activeStep)]="currentStep"
>
  <div class="step-content">
    Content for step {{ currentStep() + 1 }}
  </div>
</lc-stepper>`;

  protected readonly verticalExample = `<lc-stepper
  [steps]="steps"
  [(activeStep)]="currentStep"
  orientation="vertical"
>
  <div class="step-content">...</div>
</lc-stepper>`;

  protected readonly nonLinearExample = `<lc-stepper
  [steps]="steps"
  [(activeStep)]="currentStep"
  [linear]="false"
>
  <div class="step-content">...</div>
</lc-stepper>`;
}
