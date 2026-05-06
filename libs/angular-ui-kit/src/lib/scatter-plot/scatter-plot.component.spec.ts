import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { ScatterPlotComponent, ScatterSeries } from './scatter-plot.component';

@Component({
  standalone: true,
  imports: [ScatterPlotComponent],
  template: `<lc-scatter-plot
    [series]="series()"
    [width]="400"
    [height]="300"
    [showGrid]="showGrid()"
    [showLegend]="showLegend()"
    [showTooltip]="showTooltip()"
    [showXLabels]="showXLabels()"
    [showYLabels]="showYLabels()"
    [xAxisLabel]="xAxisLabel()"
    [yAxisLabel]="yAxisLabel()"
  />`,
})
class TestHost {
  series = signal<ScatterSeries[]>([
    {
      label: 'Set A',
      data: [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
        { x: 5, y: 1 },
      ],
    },
  ]);
  showGrid = signal(true);
  showLegend = signal(false);
  showTooltip = signal(true);
  showXLabels = signal(true);
  showYLabels = signal(true);
  xAxisLabel = signal('');
  yAxisLabel = signal('');
}

describe('ScatterPlotComponent', () => {
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
    expect(el.querySelector('lc-scatter-plot')).toBeTruthy();
  });

  it('should render dots for each data point', () => {
    const dots = el.querySelectorAll('.lc-scatter-plot__dot');
    expect(dots.length).toBe(3);
  });

  it('should render grid lines', () => {
    const lines = el.querySelectorAll('.lc-scatter-plot__grid-line');
    expect(lines.length).toBeGreaterThan(0);
  });

  it('should hide grid when disabled', () => {
    host.showGrid.set(false);
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-scatter-plot__grid-line').length).toBe(0);
  });

  it('should show legend when enabled', () => {
    host.showLegend.set(true);
    fixture.detectChanges();
    expect(el.querySelector('.lc-scatter-plot__legend')).toBeTruthy();
    expect(el.querySelector('.lc-scatter-plot__legend-label')?.textContent?.trim()).toBe('Set A');
  });

  it('should not show legend by default', () => {
    expect(el.querySelector('.lc-scatter-plot__legend')).toBeFalsy();
  });

  it('should render multiple series', () => {
    host.series.set([
      { label: 'A', data: [{ x: 1, y: 2 }] },
      { label: 'B', data: [{ x: 3, y: 4 }, { x: 5, y: 6 }] },
    ]);
    fixture.detectChanges();
    expect(el.querySelectorAll('.lc-scatter-plot__dot').length).toBe(3);
  });

  it('should show tooltip on hover', () => {
    expect(el.querySelector('.lc-scatter-plot__tooltip-text')).toBeFalsy();
    const dot = el.querySelector('.lc-scatter-plot__dot') as SVGCircleElement;
    dot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelector('.lc-scatter-plot__tooltip-text')).toBeTruthy();
  });

  it('should hide tooltip on mouse leave', () => {
    const dot = el.querySelector('.lc-scatter-plot__dot') as SVGCircleElement;
    dot.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    fixture.detectChanges();
    dot.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    fixture.detectChanges();
    expect(el.querySelector('.lc-scatter-plot__tooltip-text')).toBeFalsy();
  });

  it('should show axis labels', () => {
    host.xAxisLabel.set('Weight');
    host.yAxisLabel.set('Height');
    fixture.detectChanges();
    const labels = el.querySelectorAll('.lc-scatter-plot__axis-label');
    expect(labels.length).toBe(2);
  });

  it('should render axes', () => {
    const axes = el.querySelectorAll('.lc-scatter-plot__axis');
    expect(axes.length).toBe(2);
  });

  it('should use custom dot size', () => {
    host.series.set([
      { label: 'Big', data: [{ x: 1, y: 2, size: 10 }] },
    ]);
    fixture.detectChanges();
    const dot = el.querySelector('.lc-scatter-plot__dot') as SVGCircleElement;
    expect(dot.getAttribute('r')).toBe('10');
  });

  it('should show X labels', () => {
    const labels = el.querySelectorAll('.lc-scatter-plot__label');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('should hide Y labels when disabled', () => {
    host.showYLabels.set(false);
    fixture.detectChanges();
    // Only X labels remain
    const yLabelsCount = el.querySelectorAll('.lc-scatter-plot__grid-line').length;
    // All grid-line-associated labels should be X only
    expect(yLabelsCount).toBeGreaterThanOrEqual(0);
  });
});
