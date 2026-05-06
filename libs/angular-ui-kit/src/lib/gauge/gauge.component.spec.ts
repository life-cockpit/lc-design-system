import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GaugeComponent } from './gauge.component';

describe('GaugeComponent', () => {
  let fixture: ComponentFixture<GaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaugeComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(GaugeComponent);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render track arc', () => {
    fixture.detectChanges();
    const track = fixture.nativeElement.querySelector('.lc-gauge__track');
    expect(track).toBeTruthy();
  });

  it('should render value arc when value > 0', () => {
    fixture.componentRef.setInput('value', 50);
    fixture.detectChanges();
    const arc = fixture.nativeElement.querySelector('.lc-gauge__value-arc');
    expect(arc).toBeTruthy();
  });

  it('should not render value arc when value is 0', () => {
    fixture.componentRef.setInput('value', 0);
    fixture.detectChanges();
    const arc = fixture.nativeElement.querySelector('.lc-gauge__value-arc');
    expect(arc).toBeFalsy();
  });

  it('should display value text', () => {
    fixture.componentRef.setInput('value', 75);
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('.lc-gauge__value-text');
    expect(text.textContent).toContain('75%');
  });

  it('should display label', () => {
    fixture.componentRef.setInput('label', 'CPU');
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.lc-gauge__label');
    expect(label.textContent).toContain('CPU');
  });

  it('should clamp value to max', () => {
    fixture.componentRef.setInput('value', 150);
    fixture.componentRef.setInput('max', 100);
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('.lc-gauge__value-text');
    expect(text.textContent).toContain('150%');
  });

  it('should use custom suffix', () => {
    fixture.componentRef.setInput('value', 37);
    fixture.componentRef.setInput('suffix', '°C');
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('.lc-gauge__value-text');
    expect(text.textContent).toContain('37°C');
  });
});
