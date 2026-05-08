import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MarkdownComponent } from './markdown.component';

describe('MarkdownComponent', () => {
  let component: MarkdownComponent;
  let fixture: ComponentFixture<MarkdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render headings', () => {
    fixture.componentRef.setInput('content', '# Hello\n\n## World');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Hello');
    expect(el.querySelector('h2')?.textContent).toContain('World');
  });

  it('should render bold and italic', () => {
    fixture.componentRef.setInput('content', '**bold** and *italic*');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('strong')?.textContent).toBe('bold');
    expect(el.querySelector('em')?.textContent).toBe('italic');
  });

  it('should render links with target', () => {
    fixture.componentRef.setInput('content', '[Click](https://example.com)');
    fixture.componentRef.setInput('linkTarget', '_blank');
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    expect(link.textContent).toBe('Click');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('should render tables', () => {
    fixture.componentRef.setInput('content', '| A | B |\n|---|---|\n| 1 | 2 |');
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeTruthy();
    expect(table.querySelectorAll('th').length).toBe(2);
  });

  it('should render inline code', () => {
    fixture.componentRef.setInput('content', 'Use `npm install`');
    fixture.detectChanges();
    const code = fixture.nativeElement.querySelector('code');
    expect(code?.textContent).toBe('npm install');
  });

  it('should apply compact variant class', () => {
    fixture.componentRef.setInput('content', 'text');
    fixture.componentRef.setInput('variant', 'compact');
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.lc-markdown--compact');
    expect(container).toBeTruthy();
  });

  it('should render code blocks with lc-code-block', () => {
    fixture.componentRef.setInput('content', '```typescript\nconst x = 1;\n```');
    fixture.detectChanges();
    const codeBlock = fixture.nativeElement.querySelector('lc-code-block');
    expect(codeBlock).toBeTruthy();
  });

  it('should render strikethrough', () => {
    fixture.componentRef.setInput('content', '~~deleted~~');
    fixture.detectChanges();
    const del = fixture.nativeElement.querySelector('del');
    expect(del?.textContent).toBe('deleted');
  });

  it('should render blockquotes', () => {
    fixture.componentRef.setInput('content', '> A quote');
    fixture.detectChanges();
    const bq = fixture.nativeElement.querySelector('blockquote');
    expect(bq?.textContent).toContain('A quote');
  });

  it('should emit linkClick on anchor click', () => {
    fixture.componentRef.setInput('content', '[test](https://example.com)');
    fixture.detectChanges();
    const spy = jest.fn();
    component.linkClick.subscribe(spy);
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    link.click();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ href: expect.stringContaining('example.com') })
    );
  });

  it('should show heading anchors when enabled', () => {
    fixture.componentRef.setInput('content', '# Title');
    fixture.componentRef.setInput('showHeadingAnchors', true);
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('.lc-markdown__anchor');
    expect(anchor).toBeTruthy();
  });
});
