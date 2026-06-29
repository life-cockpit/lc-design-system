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

  describe('Change highlighting', () => {
    const enableHighlight = (content: string, previousContent: string, extra: Record<string, unknown> = {}) => {
      fixture.componentRef.setInput('content', content);
      fixture.componentRef.setInput('previousContent', previousContent);
      fixture.componentRef.setInput('highlightChanges', true);
      for (const [k, v] of Object.entries(extra)) fixture.componentRef.setInput(k, v);
      fixture.detectChanges();
    };
    const el = () => fixture.nativeElement as HTMLElement;
    const changed = () => el().querySelectorAll('.lc-markdown__block--changed');

    it('highlights only the changed/added blocks', () => {
      enableHighlight('Hallo geändert\n\nUnverändert', 'Hallo Welt\n\nUnverändert');
      const marks = changed();
      expect(marks.length).toBe(1);
      expect(marks[0].tagName).toBe('P');
      expect(marks[0].textContent).toContain('Hallo geändert');
    });

    it('highlights a single changed list item, not the whole list', () => {
      enableHighlight('# Titel\n\n- Apfel\n- Kirsche', '# Titel\n\n- Apfel\n- Birne');
      const marks = changed();
      expect(marks.length).toBe(1);
      expect(marks[0].tagName).toBe('LI');
      expect(marks[0].textContent).toContain('Kirsche');
      // The <ul> and the unchanged item are not highlighted.
      expect(el().querySelector('ul')?.classList.contains('lc-markdown__block--changed')).toBe(false);
    });

    it('is byte-for-byte unchanged when highlightChanges is false', () => {
      fixture.componentRef.setInput('content', 'Hallo geändert');
      fixture.componentRef.setInput('previousContent', 'Hallo Welt');
      fixture.componentRef.setInput('highlightChanges', false);
      fixture.detectChanges();
      expect(changed().length).toBe(0);
      expect(component.changedCount()).toBe(0);
    });

    it('produces no highlights when previousContent equals content', () => {
      enableHighlight('Same text', 'Same text');
      expect(changed().length).toBe(0);
      expect(component.changedCount()).toBe(0);
    });

    it('adds a screen-reader "geändert" affordance to changed blocks', () => {
      enableHighlight('Neuer Absatz', 'Alter Absatz');
      const mark = changed()[0];
      const sr = mark.querySelector('.lc-markdown__sr-only');
      expect(sr?.textContent).toContain('geändert');
      // Polite live-region summary is present.
      const status = el().querySelector('[role="status"][aria-live="polite"]');
      expect(status?.textContent).toContain('geändert');
    });

    it('emits changesHighlighted with the changed-block count', () => {
      const spy = jest.fn();
      component.changesHighlighted.subscribe(spy);
      enableHighlight('A neu\n\nB\n\nC neu', 'A\n\nB\n\nC');
      expect(spy).toHaveBeenCalledWith({ changedBlocks: 2 });
    });

    it('fades highlights after changeHighlightFadeMs, persists otherwise', () => {
      jest.useFakeTimers();
      try {
        enableHighlight('Neu', 'Alt', { changeHighlightFadeMs: 1000 });
        expect(el().querySelector('.lc-markdown')?.classList.contains('lc-markdown--faded')).toBe(false);
        jest.advanceTimersByTime(1000);
        fixture.detectChanges();
        expect(el().querySelector('.lc-markdown')?.classList.contains('lc-markdown--faded')).toBe(true);
        // Block keeps its class; only the visual accent transitions out.
        expect(changed().length).toBe(1);
      } finally {
        jest.useRealTimers();
      }
    });

    it('does not fade when changeHighlightFadeMs is unset', () => {
      jest.useFakeTimers();
      try {
        enableHighlight('Neu', 'Alt');
        jest.advanceTimersByTime(10000);
        fixture.detectChanges();
        expect(el().querySelector('.lc-markdown')?.classList.contains('lc-markdown--faded')).toBe(false);
        expect(changed().length).toBe(1);
      } finally {
        jest.useRealTimers();
      }
    });

    it('scrolls the first changed block into view when scrollToFirstChange is set', () => {
      const scrollSpy = jest.fn();
      // jsdom does not implement scrollIntoView.
      Element.prototype.scrollIntoView = scrollSpy;
      jest.useFakeTimers();
      try {
        enableHighlight('Eins neu\n\nZwei neu', 'Eins\n\nZwei', { scrollToFirstChange: true });
        jest.advanceTimersByTime(0);
        expect(scrollSpy).toHaveBeenCalled();
      } finally {
        jest.useRealTimers();
      }
    });
  });
});
