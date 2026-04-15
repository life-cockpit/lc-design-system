import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepperComponent, StepperStep } from './stepper.component';

describe('StepperComponent', () => {
  let component: StepperComponent;
  let fixture: ComponentFixture<StepperComponent>;

  const mockSteps: StepperStep[] = [
    { label: 'Step 1', description: 'First step' },
    { label: 'Step 2', description: 'Second step' },
    { label: 'Step 3', description: 'Third step', optional: true },
    { label: 'Step 4' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('steps', mockSteps);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 total steps', () => {
    expect(component.totalSteps()).toBe(4);
  });

  it('should start at step 0', () => {
    expect(component.activeStep()).toBe(0);
  });

  it('should report first step correctly', () => {
    expect(component.isFirstStep()).toBe(true);
    expect(component.isLastStep()).toBe(false);
  });

  it('should navigate to next step', () => {
    component.next();
    expect(component.activeStep()).toBe(1);
    expect(component.isFirstStep()).toBe(false);
  });

  it('should navigate to previous step', () => {
    component.next();
    component.next();
    component.previous();
    expect(component.activeStep()).toBe(1);
  });

  it('should not go below step 0', () => {
    component.previous();
    expect(component.activeStep()).toBe(0);
  });

  it('should not exceed last step', () => {
    component.next();
    component.next();
    component.next();
    component.next(); // try to go past
    expect(component.activeStep()).toBe(3);
    expect(component.isLastStep()).toBe(true);
  });

  it('should return correct step state', () => {
    component.next();
    expect(component.getStepState(0)).toBe('completed');
    expect(component.getStepState(1)).toBe('active');
    expect(component.getStepState(2)).toBe('pending');
  });

  it('should allow going back in linear mode', () => {
    component.next();
    component.next();
    component.goToStep(0);
    expect(component.activeStep()).toBe(0);
  });

  it('should not allow jumping ahead in linear mode', () => {
    component.goToStep(3);
    expect(component.activeStep()).toBe(0);
  });

  it('should allow jumping ahead in non-linear mode', () => {
    fixture.componentRef.setInput('linear', false);
    fixture.detectChanges();
    component.goToStep(3);
    expect(component.activeStep()).toBe(3);
  });

  it('should emit stepChange on navigation', () => {
    const emitted: number[] = [];
    component.stepChange.subscribe((step) => emitted.push(step));
    component.next();
    component.next();
    component.previous();
    expect(emitted).toEqual([1, 2, 1]);
  });
});
