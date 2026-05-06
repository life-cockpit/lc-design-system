import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BarChartComponent } from './bar-chart.component';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('data', [{ value: 10, label: 'A' }]);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render bars for each data item', () => {
    fixture.componentRef.setInput('data', [
      { value: 30, label: 'Jan' },
      { value: 50, label: 'Feb' },
      { value: 40, label: 'Mar' },
    ]);
    fixture.detectChanges();
    const bars = fixture.nativeElement.querySelectorAll('.lc-bar-chart__bar');
    expect(bars.length).toBe(3);
  });

  it('should show value labels by default', () => {
    fixture.componentRef.setInput('data', [
      { value: 30, label: 'A' },
    ]);
    fixture.detectChanges();
    const values = fixture.nativeElement.querySelectorAll('.lc-bar-chart__value');
    expect(values.length).toBe(1);
    expect(values[0].textContent.trim()).toBe('30');
  });

  it('should hide value labels when showValues is false', () => {
    fixture.componentRef.setInput('data', [{ value: 30, label: 'A' }]);
    fixture.componentRef.setInput('showValues', false);
    fixture.detectChanges();
    const values = fixture.nativeElement.querySelectorAll('.lc-bar-chart__value');
    expect(values.length).toBe(0);
  });

  it('should show labels by default', () => {
    fixture.componentRef.setInput('data', [{ value: 30, label: 'Jan' }]);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll('.lc-bar-chart__label');
    expect(labels.length).toBe(1);
    expect(labels[0].textContent.trim()).toBe('Jan');
  });

  it('should render grid lines by default', () => {
    fixture.componentRef.setInput('data', [{ value: 100, label: 'A' }]);
    fixture.detectChanges();
    const gridLines = fixture.nativeElement.querySelectorAll('.lc-bar-chart__grid-line');
    expect(gridLines.length).toBeGreaterThan(0);
  });

  it('should handle empty data', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    const bars = fixture.nativeElement.querySelectorAll('.lc-bar-chart__bar');
    expect(bars.length).toBe(0);
  });

  it('should render axes', () => {
    fixture.componentRef.setInput('data', [{ value: 50, label: 'A' }]);
    fixture.detectChanges();
    const axes = fixture.nativeElement.querySelectorAll('.lc-bar-chart__axis');
    expect(axes.length).toBe(2);
  });

  it('should respect custom width and height', () => {
    fixture.componentRef.setInput('data', [{ value: 50, label: 'A' }]);
    fixture.componentRef.setInput('width', 600);
    fixture.componentRef.setInput('height', 300);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('600');
    expect(svg.getAttribute('height')).toBe('300');
  });
});
