import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeatmapComponent } from './heatmap.component';

describe('HeatmapComponent', () => {
  let fixture: ComponentFixture<HeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HeatmapComponent] }).compileComponents();
    fixture = TestBed.createComponent(HeatmapComponent);
  });

  it('should create', () => {
    fixture.componentRef.setInput('data', [[1, 2], [3, 4]]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render cells for each data point', () => {
    fixture.componentRef.setInput('data', [[1, 2, 3], [4, 5, 6]]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-heatmap__cell').length).toBe(6);
  });

  it('should show row labels', () => {
    fixture.componentRef.setInput('data', [[1], [2]]);
    fixture.componentRef.setInput('rowLabels', ['Mon', 'Tue']);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll('.lc-heatmap__label');
    expect(labels.length).toBe(2);
  });

  it('should show values when enabled', () => {
    fixture.componentRef.setInput('data', [[5]]);
    fixture.componentRef.setInput('showValues', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-heatmap__cell-value').textContent).toContain('5');
  });

  it('should not show values by default', () => {
    fixture.componentRef.setInput('data', [[5]]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-heatmap__cell-value')).toBeFalsy();
  });
});
