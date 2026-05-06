import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DocumentViewerComponent, DocumentType } from './document-viewer.component';
import { CodeBlockLanguage } from '../code-block/code-block.component';
import { provideHttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [DocumentViewerComponent],
  template: `
    <lc-document-viewer
      [src]="src"
      [content]="content"
      [type]="type"
      [filename]="filename"
      [language]="language"
      [showToolbar]="showToolbar"
      [showDownload]="showDownload"
      [height]="height"
    />
  `,
})
class TestHostComponent {
  src = '';
  content = '';
  type: DocumentType = 'auto';
  filename = '';
  language: CodeBlockLanguage = 'text';
  showToolbar = true;
  showDownload = true;
  height = '400px';
}

describe('DocumentViewerComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
  });

  it('should create', () => {
    host.content = 'Hello';
    host.type = 'text';
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  // ── Toolbar ──────────────────────────────────────────────────────────

  it('should display toolbar by default', () => {
    host.content = 'Test';
    host.type = 'text';
    fixture.detectChanges();
    const toolbar = fixture.nativeElement.querySelector('.doc-viewer__toolbar');
    expect(toolbar).toBeTruthy();
  });

  it('should hide toolbar when showToolbar is false', () => {
    host.content = 'Test';
    host.type = 'text';
    host.showToolbar = false;
    fixture.detectChanges();
    const toolbar = fixture.nativeElement.querySelector('.doc-viewer__toolbar');
    expect(toolbar).toBeNull();
  });

  it('should display filename in toolbar', () => {
    host.content = 'Test';
    host.type = 'text';
    host.filename = 'readme.txt';
    fixture.detectChanges();
    const name = fixture.nativeElement.querySelector('.doc-viewer__filename');
    expect(name.textContent).toContain('readme.txt');
  });

  it('should extract filename from src when no filename provided', () => {
    host.content = 'Test';
    host.type = 'text';
    host.src = 'https://example.com/docs/guide.txt';
    fixture.detectChanges();
    const name = fixture.nativeElement.querySelector('.doc-viewer__filename');
    expect(name.textContent).toContain('guide.txt');
  });

  it('should show type badge', () => {
    host.content = '# Hello';
    host.type = 'markdown';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.doc-viewer__badge');
    expect(badge.textContent.trim()).toBe('Markdown');
  });

  // ── Type detection ───────────────────────────────────────────────────

  it('should auto-detect PDF from URL extension', () => {
    host.src = 'https://example.com/report.pdf';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.doc-viewer__badge');
    expect(badge.textContent.trim()).toBe('PDF');
  });

  it('should auto-detect image from URL extension', () => {
    host.src = '/assets/photo.png';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.doc-viewer__badge');
    expect(badge.textContent.trim()).toBe('Image');
  });

  it('should auto-detect markdown from URL extension', () => {
    host.src = '/docs/readme.md';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.doc-viewer__badge');
    expect(badge.textContent.trim()).toBe('Markdown');
  });

  it('should auto-detect code from URL extension', () => {
    host.src = '/src/app.ts';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.doc-viewer__badge');
    expect(badge.textContent.trim()).toBe('TYPESCRIPT');
  });

  it('should use explicit type over auto-detection', () => {
    host.src = '/myfile.txt';
    host.type = 'markdown';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.doc-viewer__badge');
    expect(badge.textContent.trim()).toBe('Markdown');
  });

  // ── Markdown rendering ───────────────────────────────────────────────

  it('should render markdown headings', () => {
    host.content = '# Hello World';
    host.type = 'markdown';
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('.doc-viewer__markdown h1');
    expect(h1).toBeTruthy();
    expect(h1.textContent).toContain('Hello World');
  });

  it('should render markdown bold and italic', () => {
    host.content = '**bold** and *italic*';
    host.type = 'markdown';
    fixture.detectChanges();
    const md = fixture.nativeElement.querySelector('.doc-viewer__markdown');
    expect(md.querySelector('strong').textContent).toBe('bold');
    expect(md.querySelector('em').textContent).toBe('italic');
  });

  it('should render markdown unordered list', () => {
    host.content = '- Item 1\n- Item 2\n- Item 3';
    host.type = 'markdown';
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.doc-viewer__markdown li');
    expect(items.length).toBe(3);
  });

  it('should render markdown ordered list', () => {
    host.content = '1. First\n2. Second';
    host.type = 'markdown';
    fixture.detectChanges();
    const ol = fixture.nativeElement.querySelector('.doc-viewer__markdown ol');
    expect(ol).toBeTruthy();
  });

  it('should render markdown links', () => {
    host.content = '[Click here](https://example.com)';
    host.type = 'markdown';
    fixture.detectChanges();
    const a = fixture.nativeElement.querySelector('.doc-viewer__markdown a');
    expect(a).toBeTruthy();
    expect(a.textContent).toBe('Click here');
    expect(a.getAttribute('target')).toBe('_blank');
    expect(a.getAttribute('rel')).toContain('noopener');
  });

  it('should render markdown inline code', () => {
    host.content = 'Use `console.log()` for debugging';
    host.type = 'markdown';
    fixture.detectChanges();
    const code = fixture.nativeElement.querySelector('.doc-viewer__md-inline-code');
    expect(code).toBeTruthy();
    expect(code.textContent).toBe('console.log()');
  });

  it('should render markdown code blocks', () => {
    host.content = '```typescript\nconst x = 1;\n```';
    host.type = 'markdown';
    fixture.detectChanges();
    const pre = fixture.nativeElement.querySelector('.doc-viewer__md-code-block');
    expect(pre).toBeTruthy();
    expect(pre.textContent).toContain('const x = 1;');
  });

  it('should render markdown blockquotes', () => {
    host.content = '> This is a quote';
    host.type = 'markdown';
    fixture.detectChanges();
    const bq = fixture.nativeElement.querySelector('.doc-viewer__md-blockquote');
    expect(bq).toBeTruthy();
    expect(bq.textContent).toContain('This is a quote');
  });

  it('should render markdown tables', () => {
    host.content = '| Name | Value |\n| --- | --- |\n| A | 1 |\n| B | 2 |';
    host.type = 'markdown';
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('.doc-viewer__md-table');
    expect(table).toBeTruthy();
    const rows = table.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should render markdown horizontal rule', () => {
    host.content = 'Before\n\n---\n\nAfter';
    host.type = 'markdown';
    fixture.detectChanges();
    const hr = fixture.nativeElement.querySelector('.doc-viewer__markdown hr');
    expect(hr).toBeTruthy();
  });

  // ── Text rendering ───────────────────────────────────────────────────

  it('should render text content in pre tag', () => {
    host.content = 'Plain text content';
    host.type = 'text';
    fixture.detectChanges();
    const pre = fixture.nativeElement.querySelector('.doc-viewer__text');
    expect(pre).toBeTruthy();
    expect(pre.textContent).toBe('Plain text content');
  });

  // ── Code rendering ──────────────────────────────────────────────────

  it('should render code with code-block component', () => {
    host.content = 'const x = 42;';
    host.type = 'code';
    host.language = 'typescript';
    fixture.detectChanges();
    const codeBlock = fixture.nativeElement.querySelector('lc-code-block');
    expect(codeBlock).toBeTruthy();
  });

  // ── Image rendering ─────────────────────────────────────────────────

  it('should render image with img tag', () => {
    host.src = '/assets/test.png';
    host.type = 'image';
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('.doc-viewer__image');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/assets/test.png');
  });

  it('should show zoom controls for images', () => {
    host.src = '/assets/test.png';
    host.type = 'image';
    fixture.detectChanges();
    const zoom = fixture.nativeElement.querySelector('.doc-viewer__zoom');
    expect(zoom).toBeTruthy();
  });

  it('should not show zoom controls for non-image types', () => {
    host.content = 'Hello';
    host.type = 'text';
    fixture.detectChanges();
    const zoom = fixture.nativeElement.querySelector('.doc-viewer__zoom');
    expect(zoom).toBeNull();
  });

  // ── PDF rendering ───────────────────────────────────────────────────

  it('should render PDF in iframe', () => {
    host.src = '/assets/test.pdf';
    host.type = 'pdf';
    fixture.detectChanges();
    const iframe = fixture.nativeElement.querySelector('.doc-viewer__iframe');
    expect(iframe).toBeTruthy();
  });

  // ── Unsupported type ────────────────────────────────────────────────

  it('should show unsupported state for unknown file type', () => {
    host.src = '/file.xyz';
    fixture.detectChanges();
    const unsup = fixture.nativeElement.querySelector('.doc-viewer__unsupported');
    expect(unsup).toBeTruthy();
    expect(unsup.textContent).toContain('Preview not available');
  });

  // ── Error state ─────────────────────────────────────────────────────

  it('should show error when no src or content', () => {
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('.doc-viewer__error');
    expect(error).toBeTruthy();
    expect(error.textContent).toContain('No source or content provided');
  });

  // ── Download button ─────────────────────────────────────────────────

  it('should show download button when src is provided', () => {
    host.src = '/assets/test.png';
    host.type = 'image';
    fixture.detectChanges();
    const dlBtn = fixture.nativeElement.querySelector('[aria-label="Download"]');
    expect(dlBtn).toBeTruthy();
  });

  it('should hide download button when showDownload is false', () => {
    host.src = '/assets/test.png';
    host.type = 'image';
    host.showDownload = false;
    fixture.detectChanges();
    const dlBtn = fixture.nativeElement.querySelector('[aria-label="Download"]');
    expect(dlBtn).toBeNull();
  });

  // ── Container height ────────────────────────────────────────────────

  it('should apply custom height', () => {
    host.content = 'Test';
    host.type = 'text';
    host.height = '300px';
    fixture.detectChanges();
    const viewer = fixture.nativeElement.querySelector('.doc-viewer');
    expect(viewer.style.height).toBe('300px');
  });
});
