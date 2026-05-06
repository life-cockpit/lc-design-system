import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LineChartComponent } from './line-chart.component';

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('series', [
      { label: 'A', data: [1, 2, 3] },
    ]);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render a line path for each series', () => {
    fixture.componentRef.setInput('series', [
      { label: 'Revenue', data: [10, 20, 30, 25] },
      { label: 'Costs', data: [5, 15, 10, 20] },
    ]);
    fixture.detectChanges();
    const paths = fixture.nativeElement.querySelectorAll('.lc-line-chart__line');
    expect(paths.length).toBe(2);
  });

  it('should render dots by default', () => {
    fixture.componentRef.setInput('series', [
      { label: 'A', data: [1, 2, 3] },
    ]);
    fixture.detectChanges();
    const dots = fixture.nativeElement.querySelectorAll('.lc-line-chart__dot');
    expect(dots.length).toBe(3);
  });

  it('should hide dots when showDots is false', () => {
    fixture.componentRef.setInput('series', [
      { label: 'A', data: [1, 2, 3] },
    ]);
    fixture.componentRef.setInput('showDots', false);
    fixture.detectChanges();
    const dots = fixture.nativeElement.querySelectorAll('.lc-line-chart__dot');
    expect(dots.length).toBe(0);
  });

  it('should render area when filled is true', () => {
    fixture.componentRef.setInput('series', [
      { label: 'A', data: [1, 2, 3] },
    ]);
    fixture.componentRef.setInput('filled', true);
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector('.lc-line-chart__area');
    expect(area).toBeTruthy();
  });

  it('should show grid lines by default', () => {
    fixture.componentRef.setInput('series', [
      { label: 'A', data: [10, 20, 30] },
    ]);
    fixture.detectChanges();
    const lines = fixture.nativeElement.querySelectorAll('.lc-line-chart__grid-line');
    expect(lines.length).toBeGreaterThan(0);
  });

  it('should render x-axis labels', () => {
    fixture.componentRef.setInput('series', [
      { label: 'A', data: [1, 2, 3] },
    ]);
    fixture.componentRef.setInput('labels', ['Jan', 'Feb', 'Mar']);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll('.lc-line-chart__x-label');
    expect(labels.length).toBe(3);
  });

  it('should render legend when showLegend is true', () => {
    fixture.componentRef.setInput('series', [
      { label: 'Revenue', data: [10, 20] },
      { label: 'Costs', data: [5, 15] },
    ]);
    fixture.componentRef.setInput('showLegend', true);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.lc-line-chart__legend-item');
    expect(items.length).toBe(2);
  });

  it('should respect custom dimensions', () => {
    fixture.componentRef.setInput('series', [
      { label: 'A', data: [1, 2] },
    ]);
    fixture.componentRef.setInput('width', 500);
    fixture.componentRef.setInput('height', 300);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('500');
    expect(svg.getAttribute('height')).toBe('300');
  });
});
