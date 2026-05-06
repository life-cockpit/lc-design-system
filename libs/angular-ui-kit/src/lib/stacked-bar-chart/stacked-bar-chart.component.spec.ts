import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StackedBarChartComponent } from './stacked-bar-chart.component';

describe('StackedBarChartComponent', () => {
  let fixture: ComponentFixture<StackedBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StackedBarChartComponent] }).compileComponents();
    fixture = TestBed.createComponent(StackedBarChartComponent);
  });

  it('should create', () => {
    fixture.componentRef.setInput('categories', [{ label: 'A', values: [10, 20] }]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render segments for stacked values', () => {
    fixture.componentRef.setInput('categories', [
      { label: 'Q1', values: [30, 20, 10] },
      { label: 'Q2', values: [25, 30, 15] },
    ]);
    fixture.detectChanges();
    const segs = fixture.nativeElement.querySelectorAll('.lc-stacked-bar-chart__segment');
    expect(segs.length).toBe(6);
  });

  it('should render legend when legends provided', () => {
    fixture.componentRef.setInput('categories', [{ label: 'A', values: [10, 20] }]);
    fixture.componentRef.setInput('legends', [{ label: 'X' }, { label: 'Y' }]);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.lc-stacked-bar-chart__legend-item');
    expect(items.length).toBe(2);
  });

  it('should render labels', () => {
    fixture.componentRef.setInput('categories', [{ label: 'Jan', values: [10] }]);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.lc-stacked-bar-chart__label');
    expect(label.textContent).toContain('Jan');
  });

  it('should handle empty categories', () => {
    fixture.componentRef.setInput('categories', []);
    fixture.detectChanges();
    const segs = fixture.nativeElement.querySelectorAll('.lc-stacked-bar-chart__segment');
    expect(segs.length).toBe(0);
  });
});
