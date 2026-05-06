import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FunnelChartComponent, FunnelStep } from './funnel-chart.component';

@Component({
  standalone: true,
  imports: [FunnelChartComponent],
  template: `<lc-funnel-chart
    [steps]="steps()"
    [width]="400"
    [height]="300"
    [showLabels]="showLabels()"
    [showValues]="showValues()"
    [showPercentage]="showPercentage()"
    [orientation]="orientation()"
  />`,
})
class TestHost {
  steps = signal<FunnelStep[]>([
    { label: 'Visitors', value: 1000 },
    { label: 'Leads', value: 600 },
    { label: 'Prospects', value: 300 },
    { label: 'Sales', value: 100 },
  ]);
  showLabels = signal(true);
  showValues = signal(true);
  showPercentage = signal(true);
  orientation = signal<'vertical' | 'horizontal'>('vertical');
}

describe('FunnelChartComponent', () => {
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
    expect(el.querySelector('lc-funnel-chart')).toBeTruthy();
  });

  it('should render steps for each funnel item', () => {
    const steps = el.querySelectorAll('.lc-funnel-chart__step');
    expect(steps.length).toBe(4);
  });

  it('should show labels', () => {
    const labels = el.querySelectorAll('.lc-funnel-chart__label');
    expect(labels.length).toBe(4);
    expect(labels[0].textContent?.trim()).toBe('Visitors');
  });

  it('should hide labels when disabled', () => {
    host.showLabels.set(false);
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-funnel-chart__label').length).toBe(0);
  });

  it('should show values', () => {
    const values = el.querySelectorAll('.lc-funnel-chart__value');
    expect(values.length).toBe(4);
  });

  it('should hide values when disabled', () => {
    host.showValues.set(false);
    host.showPercentage.set(false);
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-funnel-chart__value').length).toBe(0);
  });

  it('should show percentages', () => {
    const values = el.querySelectorAll('.lc-funnel-chart__value');
    const text = values[0].textContent || '';
    expect(text).toContain('100%');
  });

  it('should render in horizontal orientation', () => {
    host.orientation.set('horizontal');
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-funnel-chart__step').length).toBe(4);
  });

  it('should handle single step', () => {
    host.steps.set([{ label: 'Only', value: 500 }]);
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-funnel-chart__step').length).toBe(1);
  });

  it('should apply custom colors', () => {
    host.steps.set([
      { label: 'A', value: 100, color: '#ff0000' },
      { label: 'B', value: 50, color: '#00ff00' },
    ]);
    fixture.detectChanges();
    const paths = el.querySelectorAll('.lc-funnel-chart__step');
    expect(paths[0].getAttribute('fill')).toBe('#ff0000');
    expect(paths[1].getAttribute('fill')).toBe('#00ff00');
  });

  it('should render SVG with correct dimensions', () => {
    const svg = el.querySelector('.lc-funnel-chart__svg') as SVGElement;
    expect(svg.getAttribute('width')).toBe('400');
    expect(svg.getAttribute('height')).toBe('300');
  });
});
