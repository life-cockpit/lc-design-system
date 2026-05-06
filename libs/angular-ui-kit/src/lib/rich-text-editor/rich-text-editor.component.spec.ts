import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RichTextEditorComponent } from './rich-text-editor.component';

describe('RichTextEditorComponent', () => {
  let component: RichTextEditorComponent;
  let fixture: ComponentFixture<RichTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichTextEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RichTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Basic Structure', () => {
    it('should render the editor container', () => {
      const el = fixture.debugElement.query(By.css('.lc-rich-text-editor'));
      expect(el).toBeTruthy();
    });

    it('should render the toolbar', () => {
      const toolbar = fixture.debugElement.query(By.css('.lc-rich-text-editor__toolbar'));
      expect(toolbar).toBeTruthy();
    });

    it('should render toolbar action buttons', () => {
      const buttons = fixture.debugElement.queryAll(By.css('.lc-rich-text-editor__toolbar-btn'));
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render mode toggle buttons', () => {
      const modes = fixture.debugElement.queryAll(By.css('.lc-rich-text-editor__mode-btn'));
      expect(modes.length).toBe(3);
    });

    it('should show word count footer by default', () => {
      const footer = fixture.debugElement.query(By.css('.lc-rich-text-editor__footer'));
      expect(footer).toBeTruthy();
    });
  });

  describe('Modes', () => {
    it('should default to rich mode', () => {
      const richArea = fixture.debugElement.query(By.css('.lc-rich-text-editor__rich'));
      expect(richArea).toBeTruthy();
    });

    it('should switch to markdown mode', () => {
      const mdBtn = fixture.debugElement.queryAll(By.css('.lc-rich-text-editor__mode-btn'))[1];
      mdBtn.nativeElement.click();
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('.lc-rich-text-editor__textarea'));
      expect(textarea).toBeTruthy();
    });

    it('should switch to split mode', () => {
      const splitBtn = fixture.debugElement.queryAll(By.css('.lc-rich-text-editor__mode-btn'))[2];
      splitBtn.nativeElement.click();
      fixture.detectChanges();

      const split = fixture.debugElement.query(By.css('.lc-rich-text-editor__split'));
      expect(split).toBeTruthy();
    });

    it('should highlight active mode button', () => {
      const richBtn = fixture.debugElement.queryAll(By.css('.lc-rich-text-editor__mode-btn'))[0];
      expect(richBtn.nativeElement.classList.contains('active')).toBe(true);
    });
  });

  describe('Markdown Input', () => {
    beforeEach(() => {
      // Switch to markdown mode
      const mdBtn = fixture.debugElement.queryAll(By.css('.lc-rich-text-editor__mode-btn'))[1];
      mdBtn.nativeElement.click();
      fixture.detectChanges();
    });

    it('should accept text input in markdown mode', () => {
      const textarea = fixture.debugElement.query(By.css('.lc-rich-text-editor__textarea'));
      textarea.nativeElement.value = 'Hello World';
      textarea.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.wordCount()).toBe(2);
    });

    it('should emit contentChange on input', () => {
      jest.spyOn(component.contentChange, 'emit');
      const textarea = fixture.debugElement.query(By.css('.lc-rich-text-editor__textarea'));
      textarea.nativeElement.value = 'Test content';
      textarea.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.contentChange.emit).toHaveBeenCalledWith('Test content');
    });

    it('should show word count', () => {
      const textarea = fixture.debugElement.query(By.css('.lc-rich-text-editor__textarea'));
      textarea.nativeElement.value = 'one two three four five';
      textarea.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.wordCount()).toBe(5);
    });

    it('should show character count', () => {
      const textarea = fixture.debugElement.query(By.css('.lc-rich-text-editor__textarea'));
      textarea.nativeElement.value = 'hello';
      textarea.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.charCount()).toBe(5);
    });
  });

  describe('Markdown to HTML', () => {
    it('should convert headings', () => {
      component.writeValue('# Title\n## Subtitle');
      expect(component['renderedHtml']()).toContain('<h1>Title</h1>');
      expect(component['renderedHtml']()).toContain('<h2>Subtitle</h2>');
    });

    it('should convert bold text', () => {
      component.writeValue('**bold**');
      expect(component['renderedHtml']()).toContain('<strong>bold</strong>');
    });

    it('should convert italic text', () => {
      component.writeValue('*italic*');
      expect(component['renderedHtml']()).toContain('<em>italic</em>');
    });

    it('should convert inline code', () => {
      component.writeValue('`code`');
      expect(component['renderedHtml']()).toContain('<code>code</code>');
    });

    it('should convert links', () => {
      component.writeValue('[link](http://example.com)');
      expect(component['renderedHtml']()).toContain('<a href="http://example.com">link</a>');
    });

    it('should convert horizontal rules', () => {
      component.writeValue('---');
      expect(component['renderedHtml']()).toContain('<hr>');
    });

    it('should convert blockquotes', () => {
      component.writeValue('> quote');
      expect(component['renderedHtml']()).toContain('<blockquote>quote</blockquote>');
    });

    it('should convert strikethrough', () => {
      component.writeValue('~~deleted~~');
      expect(component['renderedHtml']()).toContain('<del>deleted</del>');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('Hello World');
      expect(component.wordCount()).toBe(2);
    });

    it('should register onChange', () => {
      const fn = jest.fn();
      component.registerOnChange(fn);
      // Switch to markdown mode to trigger input
      const mdBtn = fixture.debugElement.queryAll(By.css('.lc-rich-text-editor__mode-btn'))[1];
      mdBtn.nativeElement.click();
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('.lc-rich-text-editor__textarea'));
      textarea.nativeElement.value = 'New text';
      textarea.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(fn).toHaveBeenCalledWith('New text');
    });

    it('should register onTouched', () => {
      const fn = jest.fn();
      component.registerOnTouched(fn);
      // Switch to markdown mode
      const mdBtn = fixture.debugElement.queryAll(By.css('.lc-rich-text-editor__mode-btn'))[1];
      mdBtn.nativeElement.click();
      fixture.detectChanges();

      const textarea = fixture.debugElement.query(By.css('.lc-rich-text-editor__textarea'));
      textarea.nativeElement.dispatchEvent(new Event('blur'));
      fixture.detectChanges();

      expect(fn).toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should apply disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const el = fixture.debugElement.query(By.css('.lc-rich-text-editor--disabled'));
      expect(el).toBeTruthy();
    });

    it('should disable toolbar buttons when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const btns = fixture.debugElement.queryAll(By.css('.lc-rich-text-editor__toolbar-btn'));
      btns.forEach(btn => {
        expect(btn.nativeElement.disabled).toBe(true);
      });
    });
  });

  describe('Configuration', () => {
    it('should hide word count when showWordCount is false', () => {
      fixture.componentRef.setInput('showWordCount', false);
      fixture.detectChanges();

      const footer = fixture.debugElement.query(By.css('.lc-rich-text-editor__footer'));
      expect(footer).toBeFalsy();
    });

    it('should apply minHeight', () => {
      fixture.componentRef.setInput('minHeight', 300);
      fixture.detectChanges();

      const content = fixture.debugElement.query(By.css('.lc-rich-text-editor__content'));
      expect(content.nativeElement.style.minHeight).toBe('300px');
    });

    it('should respect custom toolbar config', () => {
      fixture.componentRef.setInput('toolbar', { actions: ['bold', 'italic'] });
      fixture.detectChanges();

      const btns = fixture.debugElement.queryAll(By.css('.lc-rich-text-editor__toolbar-btn'));
      expect(btns.length).toBe(2);
    });
  });
});
