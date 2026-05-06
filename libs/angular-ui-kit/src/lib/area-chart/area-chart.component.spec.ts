import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaChartComponent } from './area-chart.component';

describe('AreaChartComponent', () => {
  let fixture: ComponentFixture<AreaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AreaChartComponent] }).compileComponents();
    fixture = TestBed.createComponent(AreaChartComponent);
  });

  it('should create', () => {
    fixture.componentRef.setInput('series', [{ label: 'A', data: [1, 2, 3] }]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render area path', () => {
    fixture.componentRef.setInput('series', [{ label: 'A', data: [10, 20, 15] }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-area-chart__area')).toBeTruthy();
  });

  it('should render line path', () => {
    fixture.componentRef.setInput('series', [{ label: 'A', data: [10, 20, 15] }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-area-chart__line')).toBeTruthy();
  });

  it('should render multiple series', () => {
    fixture.componentRef.setInput('series', [
      { label: 'A', data: [1, 2] },
      { label: 'B', data: [3, 4] },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-area-chart__line').length).toBe(2);
  });

  it('should show legend when enabled', () => {
    fixture.componentRef.setInput('series', [{ label: 'Rev', data: [1, 2] }]);
    fixture.componentRef.setInput('showLegend', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-area-chart__legend-item')).toBeTruthy();
  });

  it('should render x labels', () => {
    fixture.componentRef.setInput('series', [{ label: 'A', data: [1, 2, 3] }]);
    fixture.componentRef.setInput('labels', ['Jan', 'Feb', 'Mar']);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll('.lc-area-chart__axis-label');
    expect(labels.length).toBeGreaterThan(0);
  });
});
