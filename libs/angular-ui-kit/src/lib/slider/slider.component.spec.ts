import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SliderComponent } from './slider.component';

@Component({
  standalone: true,
  imports: [SliderComponent],
  template: `
    <lc-slider
      [min]="min"
      [max]="max"
      [step]="step"
      [label]="label"
      [showValue]="showValue"
      [disabled]="disabled"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class TestHostComponent {
  min = 0;
  max = 100;
  step = 1;
  label = '';
  showValue = true;
  disabled = false;
  lastValue: number | null = null;
  onValueChange(val: number) {
    this.lastValue = val;
  }
}

describe('SliderComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render range input', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="range"]');
    expect(input).toBeTruthy();
    expect(input.min).toBe('0');
    expect(input.max).toBe('100');
  });

  it('should render label when provided', () => {
    host.label = 'Volume';
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.slider__label');
    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Volume');
  });

  it('should not render label when empty', () => {
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.slider__label');
    expect(label).toBeNull();
  });

  it('should emit value on input', () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    input.value = '42';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(host.lastValue).toBe(42);
  });

  it('should apply disabled state', () => {
    host.disabled = true;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it('should respect step', () => {
    host.step = 5;
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.step).toBe('5');
  });

  it('should show value by default', () => {
    fixture.detectChanges();
    // trigger an input event first so value > 0
    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    input.value = '50';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const valueEl = fixture.nativeElement.querySelector('.slider__value');
    expect(valueEl).toBeTruthy();
  });

  it('should hide value when showValue is false', () => {
    host.showValue = false;
    fixture.detectChanges();
    const valueEl = fixture.nativeElement.querySelector('.slider__value');
    expect(valueEl).toBeNull();
  });
});
