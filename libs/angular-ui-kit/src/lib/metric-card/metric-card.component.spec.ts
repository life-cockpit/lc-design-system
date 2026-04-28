import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricCardComponent } from './metric-card.component';
import { provideHttpClient } from '@angular/common/http';

describe('MetricCardComponent', () => {
  let fixture: ComponentFixture<MetricCardComponent>;
  let component: MetricCardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCardComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('label', 'Portfolio Equity');
    fixture.componentRef.setInput('value', '$125,430');
    fixture.componentRef.setInput('trend', 'up');
    fixture.componentRef.setInput('trendValue', '+2.4%');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label and value', () => {
    const label = fixture.nativeElement.querySelector('.lc-metric-card__label');
    const value = fixture.nativeElement.querySelector('.lc-metric-card__value');
    expect(label.textContent).toContain('Portfolio Equity');
    expect(value.textContent).toContain('$125,430');
  });

  it('should show up arrow for up trend', () => {
    const arrow = fixture.nativeElement.querySelector('.lc-metric-card__arrow');
    expect(arrow.textContent).toContain('↑');
  });

  it('should show down arrow for down trend', () => {
    fixture.componentRef.setInput('trend', 'down');
    fixture.detectChanges();
    const arrow = fixture.nativeElement.querySelector('.lc-metric-card__arrow');
    expect(arrow.textContent).toContain('↓');
  });

  it('should show flat arrow for flat trend', () => {
    fixture.componentRef.setInput('trend', 'flat');
    fixture.detectChanges();
    const arrow = fixture.nativeElement.querySelector('.lc-metric-card__arrow');
    expect(arrow.textContent).toContain('→');
  });

  it('should apply green class for up trend', () => {
    const trend = fixture.nativeElement.querySelector('.lc-metric-card__trend');
    expect(trend.classList).toContain('text-green-600');
  });

  it('should apply red class for down trend', () => {
    fixture.componentRef.setInput('trend', 'down');
    fixture.detectChanges();
    const trend = fixture.nativeElement.querySelector('.lc-metric-card__trend');
    expect(trend.classList).toContain('text-red-600');
  });

  it('should not show trend section when trendValue is empty', () => {
    fixture.componentRef.setInput('trendValue', '');
    fixture.detectChanges();
    const trend = fixture.nativeElement.querySelector('.lc-metric-card__trend');
    expect(trend).toBeNull();
  });

  it('should show icon when provided', () => {
    fixture.componentRef.setInput('icon', 'arrow-trending-up');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.lc-metric-card__icon');
    expect(icon).toBeTruthy();
  });

  it('should not show icon when not provided', () => {
    fixture.componentRef.setInput('icon', '');
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.lc-metric-card__icon');
    expect(icon).toBeNull();
  });
});
