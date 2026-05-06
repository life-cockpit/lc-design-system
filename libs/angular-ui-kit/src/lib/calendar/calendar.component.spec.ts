import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CalendarComponent] }).compileComponents();
    fixture = TestBed.createComponent(CalendarComponent);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render month view by default', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-calendar__month')).toBeTruthy();
  });

  it('should render 7 weekday headers', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-calendar__weekday').length).toBe(7);
  });

  it('should render 6 week rows', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-calendar__week-row').length).toBe(6);
  });

  it('should render week view', () => {
    fixture.componentRef.setInput('view', 'week');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-calendar__time-grid')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.lc-calendar__time-col-header').length).toBe(7);
  });

  it('should render day view', () => {
    fixture.componentRef.setInput('view', 'day');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-calendar__time-grid--day')).toBeTruthy();
  });

  it('should display events in month view', () => {
    const today = new Date();
    fixture.componentRef.setInput('events', [
      { id: '1', title: 'Test Event', start: today, end: today },
    ]);
    fixture.detectChanges();
    const dots = fixture.nativeElement.querySelectorAll('.lc-calendar__event-dot');
    expect(dots.length).toBeGreaterThanOrEqual(1);
  });

  it('should display view toggle buttons', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.lc-calendar__view-toggle button');
    expect(buttons.length).toBe(3);
  });

  it('should navigate and update header title', () => {
    fixture.detectChanges();
    const title1 = fixture.nativeElement.querySelector('.lc-calendar__title').textContent;
    const nextBtn = fixture.nativeElement.querySelectorAll('.lc-calendar__nav-btn')[1];
    nextBtn.click();
    fixture.detectChanges();
    const title2 = fixture.nativeElement.querySelector('.lc-calendar__title').textContent;
    expect(title1).not.toBe(title2);
  });
});
