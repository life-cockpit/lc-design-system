import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SparklineComponent } from './sparkline.component';

describe('SparklineComponent', () => {
  let component: SparklineComponent;
  let fixture: ComponentFixture<SparklineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SparklineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SparklineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('data', [1, 2, 3]);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render an SVG', () => {
    fixture.componentRef.setInput('data', [10, 20, 30, 20, 25]);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('should render a path for the line', () => {
    fixture.componentRef.setInput('data', [1, 3, 2, 5]);
    fixture.detectChanges();
    const path = fixture.nativeElement.querySelector('.lc-sparkline__line');
    expect(path).toBeTruthy();
    expect(path.getAttribute('d')).toBeTruthy();
  });

  it('should not render with less than 2 data points', () => {
    fixture.componentRef.setInput('data', [5]);
    fixture.detectChanges();
    const path = fixture.nativeElement.querySelector('.lc-sparkline__line');
    expect(path).toBeFalsy();
  });

  it('should render filled area when filled is true', () => {
    fixture.componentRef.setInput('data', [1, 2, 3]);
    fixture.componentRef.setInput('filled', true);
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector('.lc-sparkline__area');
    expect(area).toBeTruthy();
  });

  it('should not render filled area by default', () => {
    fixture.componentRef.setInput('data', [1, 2, 3]);
    fixture.detectChanges();
    const area = fixture.nativeElement.querySelector('.lc-sparkline__area');
    expect(area).toBeFalsy();
  });

  it('should render end dot when showEndDot is true', () => {
    fixture.componentRef.setInput('data', [1, 2, 3]);
    fixture.componentRef.setInput('showEndDot', true);
    fixture.detectChanges();
    const dot = fixture.nativeElement.querySelector('.lc-sparkline__dot');
    expect(dot).toBeTruthy();
  });

  it('should use linear curve when specified', () => {
    fixture.componentRef.setInput('data', [0, 10, 5]);
    fixture.componentRef.setInput('curve', 'linear');
    fixture.detectChanges();
    const path = fixture.nativeElement.querySelector('.lc-sparkline__line');
    const d = path.getAttribute('d');
    // Linear paths use M and L commands, not C
    expect(d).toContain('M');
    expect(d).toContain('L');
    expect(d).not.toContain('C');
  });

  it('should respect custom height and use width as viewBox fallback', () => {
    fixture.componentRef.setInput('data', [1, 2, 3]);
    fixture.componentRef.setInput('width', 200);
    fixture.componentRef.setInput('height', 50);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('100%');
    expect(svg.getAttribute('height')).toBe('50');
    expect(svg.getAttribute('viewBox')).toContain('0 0 200 50');
  });
});
