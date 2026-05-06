import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { DateRangePickerComponent, DateRange } from './date-range-picker.component';

@Component({
  standalone: true,
  imports: [DateRangePickerComponent],
  template: `<lc-date-range-picker
    [label]="label()"
    [placeholder]="placeholder()"
    [disabled]="disabled()"
    (rangeChange)="lastRange = $event"
  />`,
})
class TestHost {
  label = signal('');
  placeholder = signal('Select date range');
  disabled = signal(false);
  lastRange: DateRange | null = null;
}

describe('DateRangePickerComponent', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHost] }).compileComponents();
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  it('should create', () => {
    expect(el.querySelector('lc-date-range-picker')).toBeTruthy();
  });

  it('should show placeholder', () => {
    expect(el.querySelector('.lc-drp__value')?.textContent?.trim()).toBe('Select date range');
  });

  it('should open calendar on click', () => {
    expect(el.querySelector('.lc-drp__dropdown')).toBeFalsy();
    (el.querySelector('.lc-drp__trigger') as HTMLElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.lc-drp__dropdown')).toBeTruthy();
  });

  it('should render weekday headers', () => {
    (el.querySelector('.lc-drp__trigger') as HTMLElement).click();
    fixture.detectChanges();
    const weekdays = el.querySelectorAll('.lc-drp__weekday');
    expect(weekdays.length).toBe(7);
    expect(weekdays[0].textContent?.trim()).toBe('Mo');
  });

  it('should render 42 calendar days', () => {
    (el.querySelector('.lc-drp__trigger') as HTMLElement).click();
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-drp__day').length).toBe(42);
  });

  it('should navigate months', () => {
    (el.querySelector('.lc-drp__trigger') as HTMLElement).click();
    fixture.detectChanges();
    const label = el.querySelector('.lc-drp__month')?.textContent?.trim();
    const nextBtn = el.querySelectorAll('.lc-drp__nav')[1] as HTMLElement;
    nextBtn.click();
    fixture.detectChanges();
    const newLabel = el.querySelector('.lc-drp__month')?.textContent?.trim();
    expect(newLabel).not.toBe(label);
  });

  it('should select start date', () => {
    (el.querySelector('.lc-drp__trigger') as HTMLElement).click();
    fixture.detectChanges();
    const inMonthDays = el.querySelectorAll('.lc-drp__day:not(.lc-drp__day--outside)');
    (inMonthDays[0] as HTMLElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.lc-drp__day--start')).toBeTruthy();
  });

  it('should select full range', () => {
    (el.querySelector('.lc-drp__trigger') as HTMLElement).click();
    fixture.detectChanges();
    const inMonthDays = el.querySelectorAll('.lc-drp__day:not(.lc-drp__day--outside)');
    (inMonthDays[4] as HTMLElement).click();
    fixture.detectChanges();
    (inMonthDays[10] as HTMLElement).click();
    fixture.detectChanges();
    expect(host.lastRange).toBeTruthy();
    expect(host.lastRange!.start).toBeTruthy();
    expect(host.lastRange!.end).toBeTruthy();
  });

  it('should close after selecting end date', () => {
    (el.querySelector('.lc-drp__trigger') as HTMLElement).click();
    fixture.detectChanges();
    const inMonthDays = el.querySelectorAll('.lc-drp__day:not(.lc-drp__day--outside)');
    (inMonthDays[0] as HTMLElement).click();
    fixture.detectChanges();
    (inMonthDays[5] as HTMLElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.lc-drp__dropdown')).toBeFalsy();
  });

  it('should show label when provided', () => {
    host.label.set('Period');
    fixture.detectChanges();
    expect(el.querySelector('.lc-drp__label')?.textContent?.trim()).toBe('Period');
  });

  it('should be disabled', () => {
    host.disabled.set(true);
    fixture.detectChanges();
    expect(el.querySelector('.lc-drp__trigger--disabled')).toBeTruthy();
  });

  it('should clear range', () => {
    (el.querySelector('.lc-drp__trigger') as HTMLElement).click();
    fixture.detectChanges();
    const inMonthDays = el.querySelectorAll('.lc-drp__day:not(.lc-drp__day--outside)');
    (inMonthDays[0] as HTMLElement).click();
    fixture.detectChanges();
    (inMonthDays[5] as HTMLElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.lc-drp__clear')).toBeTruthy();
    (el.querySelector('.lc-drp__clear') as HTMLElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.lc-drp__value--placeholder')).toBeTruthy();
  });

  it('should swap dates if end is before start', () => {
    (el.querySelector('.lc-drp__trigger') as HTMLElement).click();
    fixture.detectChanges();
    const inMonthDays = el.querySelectorAll('.lc-drp__day:not(.lc-drp__day--outside)');
    (inMonthDays[10] as HTMLElement).click();
    fixture.detectChanges();
    (inMonthDays[2] as HTMLElement).click();
    fixture.detectChanges();
    expect(host.lastRange!.start!.getTime()).toBeLessThan(host.lastRange!.end!.getTime());
  });

  it('should show hint for selecting', () => {
    (el.querySelector('.lc-drp__trigger') as HTMLElement).click();
    fixture.detectChanges();
    expect(el.querySelector('.lc-drp__hint')?.textContent?.trim()).toContain('start');
  });
});
