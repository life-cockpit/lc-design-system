import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogViewerComponent, LogLine } from './log-viewer.component';

describe('LogViewerComponent', () => {
  let component: LogViewerComponent;
  let fixture: ComponentFixture<LogViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogViewerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render lines from input', () => {
    const lines: LogLine[] = [
      { text: 'Hello world', level: 'info' },
      { text: 'An error', level: 'error' },
    ];
    fixture.componentRef.setInput('lines', lines);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('.lc-log-viewer__line').length).toBe(2);
  });

  it('should apply terminal variant class', () => {
    fixture.componentRef.setInput('variant', 'terminal');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.lc-log-viewer--terminal');
    expect(el).toBeTruthy();
  });

  it('should show line numbers when enabled', () => {
    fixture.componentRef.setInput('lines', [{ text: 'line 1' }]);
    fixture.componentRef.setInput('showLineNumbers', true);
    fixture.detectChanges();
    const lineNum = fixture.nativeElement.querySelector('.lc-log-viewer__line-num');
    expect(lineNum).toBeTruthy();
  });

  it('should parse ANSI colors', () => {
    const result = component['parseAnsi']('\x1b[31mred text\x1b[0m');
    expect(result).toContain('ansi-red');
  });

  it('should escape HTML in log text', () => {
    const result = component['parseAnsi']('<script>alert("xss")</script>');
    expect(result).toContain('&lt;script&gt;');
    expect(result).not.toContain('<script>');
  });

  it('should filter by level', () => {
    fixture.componentRef.setInput('lines', [
      { text: 'info line', level: 'info' },
      { text: 'error line', level: 'error' },
      { text: 'debug line', level: 'debug' },
    ]);
    fixture.componentRef.setInput('levelFilter', ['error']);
    fixture.detectChanges();
    expect(component['filteredLines']().length).toBe(1);
    expect(component['filteredLines']()[0].text).toBe('error line');
  });

  it('should respect maxLines buffer', () => {
    const lines: LogLine[] = Array.from({ length: 100 }, (_, i) => ({
      text: `line ${i}`,
    }));
    fixture.componentRef.setInput('lines', lines);
    fixture.componentRef.setInput('maxLines', 50);
    fixture.detectChanges();
    expect(component['buffer']().length).toBe(50);
  });

  it('should apply height style', () => {
    fixture.componentRef.setInput('height', '500px');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.lc-log-viewer') as HTMLElement;
    expect(el.style.height).toBe('500px');
  });

  it('should emit lineClick on click', () => {
    const lines: LogLine[] = [{ text: 'clickable' }];
    fixture.componentRef.setInput('lines', lines);
    fixture.detectChanges();
    const spy = jest.fn();
    component.lineClick.subscribe(spy);
    const line = fixture.nativeElement.querySelector('.lc-log-viewer__line') as HTMLElement;
    line.click();
    expect(spy).toHaveBeenCalled();
  });
});
