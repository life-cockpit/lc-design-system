import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonutChartComponent } from './donut-chart.component';

describe('DonutChartComponent', () => {
  let component: DonutChartComponent;
  let fixture: ComponentFixture<DonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonutChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonutChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('segments', [{ value: 50, label: 'A' }]);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render segments as paths', () => {
    fixture.componentRef.setInput('segments', [
      { value: 60, label: 'A' },
      { value: 40, label: 'B' },
    ]);
    fixture.detectChanges();
    const paths = fixture.nativeElement.querySelectorAll('.lc-donut-chart__segment');
    expect(paths.length).toBe(2);
  });

  it('should display center value', () => {
    fixture.componentRef.setInput('segments', [{ value: 100, label: 'All' }]);
    fixture.componentRef.setInput('centerValue', '100');
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('.lc-donut-chart__center-value');
    expect(text.textContent).toContain('100');
  });

  it('should display center label', () => {
    fixture.componentRef.setInput('segments', [{ value: 100, label: 'All' }]);
    fixture.componentRef.setInput('centerValue', '100');
    fixture.componentRef.setInput('centerLabel', 'Total');
    fixture.detectChanges();
    const text = fixture.nativeElement.querySelector('.lc-donut-chart__center-label');
    expect(text.textContent).toContain('Total');
  });

  it('should render legend when showLegend is true', () => {
    fixture.componentRef.setInput('segments', [
      { value: 60, label: 'Apples' },
      { value: 40, label: 'Oranges' },
    ]);
    fixture.componentRef.setInput('showLegend', true);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.lc-donut-chart__legend-item');
    expect(items.length).toBe(2);
  });

  it('should not render legend by default', () => {
    fixture.componentRef.setInput('segments', [{ value: 100, label: 'All' }]);
    fixture.detectChanges();
    const legend = fixture.nativeElement.querySelector('.lc-donut-chart__legend');
    expect(legend).toBeFalsy();
  });

  it('should handle empty segments', () => {
    fixture.componentRef.setInput('segments', []);
    fixture.detectChanges();
    const paths = fixture.nativeElement.querySelectorAll('.lc-donut-chart__segment');
    expect(paths.length).toBe(0);
  });

  it('should use custom colors from segments', () => {
    fixture.componentRef.setInput('segments', [
      { value: 50, label: 'A', color: '#ff0000' },
    ]);
    fixture.detectChanges();
    const path = fixture.nativeElement.querySelector('.lc-donut-chart__segment');
    expect(path.getAttribute('fill')).toBe('#ff0000');
  });
});
