import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MetricCardComponent } from './metric-card.component';
import { Component } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [MetricCardComponent],
  template: `
    <lc-metric-card
      [label]="label"
      [value]="value"
      [trend]="trend"
      [trendValue]="trendValue"
      [icon]="icon"
    ></lc-metric-card>
  `,
})
class TestHostComponent {
  label = 'Portfolio Equity';
  value = '$125,430';
  trend: 'up' | 'down' | 'flat' = 'up';
  trendValue = '+2.4%';
  icon = '';
}

describe('MetricCardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.nativeElement.querySelector('.lc-metric-card')).toBeTruthy();
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
    host.trend = 'down';
    fixture.detectChanges();
    const arrow = fixture.nativeElement.querySelector('.lc-metric-card__arrow');
    expect(arrow.textContent).toContain('↓');
  });

  it('should show flat arrow for flat trend', () => {
    host.trend = 'flat';
    fixture.detectChanges();
    const arrow = fixture.nativeElement.querySelector('.lc-metric-card__arrow');
    expect(arrow.textContent).toContain('→');
  });

  it('should apply green class for up trend', () => {
    const trend = fixture.nativeElement.querySelector('.lc-metric-card__trend');
    expect(trend.classList).toContain('text-green-600');
  });

  it('should apply red class for down trend', () => {
    host.trend = 'down';
    fixture.detectChanges();
    const trend = fixture.nativeElement.querySelector('.lc-metric-card__trend');
    expect(trend.classList).toContain('text-red-600');
  });

  it('should not show trend section when trendValue is empty', () => {
    host.trendValue = '';
    fixture.detectChanges();
    const trend = fixture.nativeElement.querySelector('.lc-metric-card__trend');
    expect(trend).toBeNull();
  });

  it('should show icon when provided', () => {
    host.icon = 'arrow-trending-up';
    fixture.detectChanges();
    const icon = fixture.nativeElement.querySelector('.lc-metric-card__icon');
    expect(icon).toBeTruthy();
  });

  it('should not show icon when not provided', () => {
    const icon = fixture.nativeElement.querySelector('.lc-metric-card__icon');
    expect(icon).toBeNull();
  });
});
