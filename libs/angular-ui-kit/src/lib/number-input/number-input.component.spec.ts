import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { NumberInputComponent } from './number-input.component';
import { provideHttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [NumberInputComponent],
  template: `
    <lc-number-input
      [min]="min"
      [max]="max"
      [step]="step"
      [label]="label"
      [disabled]="disabled"
      (valueChange)="onValueChange($event)"
    />
  `,
})
class TestHostComponent {
  min: number | undefined = undefined;
  max: number | undefined = undefined;
  step = 1;
  label = '';
  disabled = false;
  lastValue: number | null = null;
  onValueChange(val: number) {
    this.lastValue = val;
  }
}

describe('NumberInputComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render increment and decrement buttons', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.number-input__button');
    expect(buttons.length).toBe(2);
  });

  it('should render label when provided', () => {
    host.label = 'Quantity';
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.number-input__label');
    expect(label.textContent).toContain('Quantity');
  });

  it('should increment value on button click', () => {
    fixture.detectChanges();
    const incBtn = fixture.nativeElement.querySelector('.number-input__button--increment');
    incBtn.click();
    fixture.detectChanges();
    expect(host.lastValue).toBe(1);
  });

  it('should decrement value on button click', () => {
    fixture.detectChanges();
    // First increment so value = 1
    const incBtn = fixture.nativeElement.querySelector('.number-input__button--increment');
    incBtn.click();
    fixture.detectChanges();

    const decBtn = fixture.nativeElement.querySelector('.number-input__button--decrement');
    decBtn.click();
    fixture.detectChanges();
    expect(host.lastValue).toBe(0);
  });

  it('should respect min boundary', () => {
    host.min = 0;
    fixture.detectChanges();

    const decBtn = fixture.nativeElement.querySelector('.number-input__button--decrement');
    decBtn.click();
    fixture.detectChanges();

    // Should stay at 0 (clamped)
    expect(host.lastValue).toBe(0);
  });

  it('should respect max boundary', () => {
    host.max = 2;
    fixture.detectChanges();

    const incBtn = fixture.nativeElement.querySelector('.number-input__button--increment');
    incBtn.click(); // 1
    incBtn.click(); // 2
    incBtn.click(); // should stay 2
    fixture.detectChanges();

    expect(host.lastValue).toBe(2);
  });

  it('should use step value', () => {
    host.step = 5;
    fixture.detectChanges();

    const incBtn = fixture.nativeElement.querySelector('.number-input__button--increment');
    incBtn.click();
    fixture.detectChanges();
    expect(host.lastValue).toBe(5);
  });

  it('should apply disabled class', () => {
    host.disabled = true;
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('.number-input');
    expect(wrapper.classList).toContain('number-input--disabled');
  });
});
