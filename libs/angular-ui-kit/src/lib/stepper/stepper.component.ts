import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  model,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StepperStep {
  readonly label: string;
  readonly description?: string;
  readonly optional?: boolean;
}

export type StepState = 'pending' | 'active' | 'completed';

/**
 * Stepper Component
 *
 * Step-by-step wizard with numbered steps, active/completed/pending states.
 * Emits events when user navigates between steps.
 *
 * @example
 * ```html
 * <lc-stepper
 *   [steps]="steps"
 *   [(activeStep)]="currentStep"
 *   (stepChange)="onStep($event)"
 * >
 *   @if (currentStep === 0) {
 *     <div class="step-content">Step 1 content</div>
 *   }
 *   @if (currentStep === 1) {
 *     <div class="step-content">Step 2 content</div>
 *   }
 * </lc-stepper>
 * ```
 */
@Component({
  selector: 'lc-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent {
  /** Step definitions */
  steps = input.required<readonly StepperStep[]>();

  /** Active step index (0-based, two-way binding) */
  activeStep = model<number>(0);

  /** Whether completed steps can be clicked to navigate back */
  linear = input<boolean>(true);

  /** Orientation */
  orientation = input<'horizontal' | 'vertical'>('horizontal');

  /** Emitted when active step changes */
  stepChange = output<number>();

  /** Computed total step count */
  totalSteps = computed(() => this.steps().length);

  /** Whether we're on the first step */
  isFirstStep = computed(() => this.activeStep() === 0);

  /** Whether we're on the last step */
  isLastStep = computed(() => this.activeStep() === this.totalSteps() - 1);

  /** Get the state of a step */
  getStepState(index: number): StepState {
    const current = this.activeStep();
    if (index < current) return 'completed';
    if (index === current) return 'active';
    return 'pending';
  }

  /** Navigate to a specific step (only if completed or next) */
  goToStep(index: number): void {
    const current = this.activeStep();
    if (this.linear()) {
      // In linear mode, only allow going to completed steps or next
      if (index <= current) {
        this.activeStep.set(index);
        this.stepChange.emit(index);
      }
    } else {
      this.activeStep.set(index);
      this.stepChange.emit(index);
    }
  }

  /** Go to next step */
  next(): void {
    const current = this.activeStep();
    if (current < this.totalSteps() - 1) {
      this.activeStep.set(current + 1);
      this.stepChange.emit(current + 1);
    }
  }

  /** Go to previous step */
  previous(): void {
    const current = this.activeStep();
    if (current > 0) {
      this.activeStep.set(current - 1);
      this.stepChange.emit(current - 1);
    }
  }

  /** Get CSS classes for step indicator */
  getStepClasses(index: number): string {
    const state = this.getStepState(index);
    const classes = ['lc-stepper__step'];
    classes.push(`lc-stepper__step--${state}`);
    if (!this.linear() || state === 'completed') {
      classes.push('lc-stepper__step--clickable');
    }
    return classes.join(' ');
  }

  /** Get CSS classes for connector line */
  getConnectorClasses(index: number): string {
    const classes = ['lc-stepper__connector'];
    if (index < this.activeStep()) {
      classes.push('lc-stepper__connector--completed');
    }
    return classes.join(' ');
  }
}
