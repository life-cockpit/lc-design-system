import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RadarChartComponent } from './radar-chart.component';

describe('RadarChartComponent', () => {
  let fixture: ComponentFixture<RadarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RadarChartComponent] }).compileComponents();
    fixture = TestBed.createComponent(RadarChartComponent);
  });

  it('should create', () => {
    fixture.componentRef.setInput('series', [{ label: 'A', data: [80, 60, 70, 90, 50] }]);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render grid rings', () => {
    fixture.componentRef.setInput('series', [{ label: 'A', data: [80, 60, 70] }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-radar-chart__grid').length).toBe(4);
  });

  it('should render series polygon', () => {
    fixture.componentRef.setInput('series', [{ label: 'A', data: [80, 60, 70, 90, 50] }]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.lc-radar-chart__polygon')).toBeTruthy();
  });

  it('should render multiple series', () => {
    fixture.componentRef.setInput('series', [
      { label: 'A', data: [80, 60, 70] },
      { label: 'B', data: [50, 80, 60] },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.lc-radar-chart__polygon').length).toBe(2);
  });

  it('should render axis labels', () => {
    fixture.componentRef.setInput('series', [{ label: 'A', data: [80, 60, 70] }]);
    fixture.componentRef.setInput('axes', ['Speed', 'Power', 'Agility']);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll('.lc-radar-chart__label');
    expect(labels.length).toBe(3);
  });
});
