import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaterfallChartComponent } from './waterfall-chart.component';

describe('WaterfallChartComponent', () => {
  let fixture: ComponentFixture<WaterfallChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [WaterfallChartComponent] }).compileComponents();
    fixture = TestBed.createComponent(WaterfallChartComponent);
  });

  it('should create', () => {
    fixture.componentRef.setInput('data', [{ label: 'Start', value: 100, type: 'total' }]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render bars', () => {
    fixture.componentRef.setInput('data', [
      { label: 'Start', value: 100, type: 'total' },
      { label: 'Add', value: 30 },
      { label: 'Remove', value: -20 },
      { label: 'End', value: 110, type: 'total' },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-waterfall-chart__bar').length).toBe(4);
  });

  it('should render connectors', () => {
    fixture.componentRef.setInput('data', [
      { label: 'A', value: 100, type: 'total' },
      { label: 'B', value: 20 },
      { label: 'C', value: -10 },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-waterfall-chart__connector').length).toBe(2);
  });

  it('should show values', () => {
    fixture.componentRef.setInput('data', [{ label: 'A', value: 50, type: 'total' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-waterfall-chart__value')).toBeTruthy();
  });

  it('should handle empty data', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-waterfall-chart__bar').length).toBe(0);
  });
});
