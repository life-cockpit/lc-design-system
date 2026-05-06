import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PieChartComponent } from './pie-chart.component';

describe('PieChartComponent', () => {
  let fixture: ComponentFixture<PieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PieChartComponent] }).compileComponents();
    fixture = TestBed.createComponent(PieChartComponent);
  });

  it('should create', () => {
    fixture.componentRef.setInput('segments', [{ value: 50, label: 'A' }]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render segment paths', () => {
    fixture.componentRef.setInput('segments', [{ value: 60, label: 'A' }, { value: 40, label: 'B' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-pie-chart__segment').length).toBe(2);
  });

  it('should show legend when enabled', () => {
    fixture.componentRef.setInput('segments', [{ value: 50, label: 'A' }, { value: 50, label: 'B' }]);
    fixture.componentRef.setInput('showLegend', true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-pie-chart__legend-item').length).toBe(2);
  });

  it('should handle single segment', () => {
    fixture.componentRef.setInput('segments', [{ value: 100, label: 'All' }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-pie-chart__segment')).toBeTruthy();
  });
});
