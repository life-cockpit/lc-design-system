import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressRingComponent } from './progress-ring.component';

describe('ProgressRingComponent', () => {
  let fixture: ComponentFixture<ProgressRingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProgressRingComponent] }).compileComponents();
    fixture = TestBed.createComponent(ProgressRingComponent);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render track and value circles', () => {
    fixture.componentRef.setInput('value', 50);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-progress-ring__track')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.lc-progress-ring__value')).toBeTruthy();
  });

  it('should display percentage text', () => {
    fixture.componentRef.setInput('value', 75);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-progress-ring__text').textContent).toContain('75%');
  });

  it('should hide text when showValue is false', () => {
    fixture.componentRef.setInput('value', 50);
    fixture.componentRef.setInput('showValue', false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-progress-ring__text')).toBeFalsy();
  });

  it('should clamp value between 0 and 100', () => {
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();
    const circle = fixture.nativeElement.querySelector('.lc-progress-ring__value');
    const dasharray = parseFloat(circle.getAttribute('stroke-dasharray'));
    const dashoffset = parseFloat(circle.getAttribute('stroke-dashoffset'));
    // at 100%, offset should be 0
    expect(dashoffset).toBe(0);
  });
});
