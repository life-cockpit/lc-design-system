import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type RichTextEditorMode = 'rich' | 'markdown' | 'split';
export type ToolbarAction =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikethrough'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'ul'
  | 'ol'
  | 'blockquote'
  | 'code'
  | 'codeblock'
  | 'link'
  | 'image'
  | 'hr';

export interface ToolbarConfig {
  actions: ToolbarAction[];
}

const DEFAULT_TOOLBAR: ToolbarConfig = {
  actions: [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'h1',
    'h2',
    'h3',
    'ul',
    'ol',
    'blockquote',
    'code',
    'codeblock',
    'link',
    'hr',
  ],
};

/**
 * Rich Text Editor with Markdown support.
 *
 * Supports three modes:
 * - `rich`: WYSIWYG editing with toolbar
 * - `markdown`: Raw markdown editing with syntax highlighting
 * - `split`: Side-by-side markdown and preview
 *
 * Implements ControlValueAccessor for reactive form integration.
 * The value is always stored as Markdown.
 *
 * @example
 * ```html
 * <lc-rich-text-editor
 *   [(ngModel)]="content"
 *   mode="split"
 *   placeholder="Write something..." />
 * ```
 */
@Component({
  selector: 'lc-rich-text-editor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
})
export class RichTextEditorComponent implements ControlValueAccessor, AfterViewInit, OnDestroy {
  /** Editor mode */
  mode = input<RichTextEditorMode>('rich');

  /** Placeholder text */
  placeholder = input<string>('Start typing...');

  /** Minimum height in px */
  minHeight = input<number>(200);

  /** Maximum height in px (0 = unlimited) */
  maxHeight = input<number>(0);

  /** Whether the editor is disabled */
  disabled = input<boolean>(false);

  /** Whether the editor is readonly */
  readonly = input<boolean>(false);

  /** Toolbar configuration */
  toolbar = input<ToolbarConfig>(DEFAULT_TOOLBAR);

  /** Whether to show word count */
  showWordCount = input<boolean>(true);

  /** Emitted on every content change */
  readonly contentChange = output<string>();

  @ViewChild('editorArea') editorArea!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('richArea') richArea!: ElementRef<HTMLDivElement>;

  /** Internal markdown value */
  protected markdown = signal('');

  /** Current active mode (can be toggled by user) */
  protected activeMode = signal<RichTextEditorMode>('rich');

  /** Word count */
  protected wordCount = computed(() => {
    const text = this.markdown().trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  });

  /** Character count */
  protected charCount = computed(() => this.markdown().length);

  /** Rendered HTML from markdown */
  protected renderedHtml = computed(() => this.markdownToHtml(this.markdown()));

  // CVA
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.activeMode.set(this.mode());
  }

  ngOnDestroy(): void {
    // cleanup if needed
  }

  // -- ControlValueAccessor --
  writeValue(value: string): void {
    this.markdown.set(value || '');
    if (this.richArea?.nativeElement) {
      this.richArea.nativeElement.innerHTML = this.renderedHtml();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // handled by input
  }

  // -- Mode switching --
  protected switchMode(mode: RichTextEditorMode): void {
    if (this.activeMode() === 'rich' && mode !== 'rich') {
      // Sync rich content to markdown
      if (this.richArea?.nativeElement) {
        this.markdown.set(this.htmlToMarkdown(this.richArea.nativeElement.innerHTML));
      }
    } else if (this.activeMode() !== 'rich' && mode === 'rich') {
      // Will render from markdown when view updates
      setTimeout(() => {
        if (this.richArea?.nativeElement) {
          this.richArea.nativeElement.innerHTML = this.renderedHtml();
        }
      });
    }
    this.activeMode.set(mode);
  }

  // -- Toolbar actions --
  protected onToolbarAction(action: ToolbarAction): void {
    if (this.disabled() || this.readonly()) return;

    if (this.activeMode() === 'rich') {
      this.execRichCommand(action);
    } else {
      this.insertMarkdownSyntax(action);
    }
  }

  private execRichCommand(action: ToolbarAction): void {
    switch (action) {
      case 'bold':
        document.execCommand('bold');
        break;
      case 'italic':
        document.execCommand('italic');
        break;
      case 'underline':
        document.execCommand('underline');
        break;
      case 'strikethrough':
        document.execCommand('strikeThrough');
        break;
      case 'h1':
        document.execCommand('formatBlock', false, 'h1');
        break;
      case 'h2':
        document.execCommand('formatBlock', false, 'h2');
        break;
      case 'h3':
        document.execCommand('formatBlock', false, 'h3');
        break;
      case 'ul':
        document.execCommand('insertUnorderedList');
        break;
      case 'ol':
        document.execCommand('insertOrderedList');
        break;
      case 'blockquote':
        document.execCommand('formatBlock', false, 'blockquote');
        break;
      case 'code':
        document.execCommand('insertHTML', false, '<code>' + this.getSelection() + '</code>');
        break;
      case 'codeblock':
        document.execCommand('insertHTML', false, '<pre><code>' + this.getSelection() + '</code></pre>');
        break;
      case 'link': {
        const url = prompt('Enter URL:');
        if (url) document.execCommand('createLink', false, url);
        break;
      }
      case 'hr':
        document.execCommand('insertHorizontalRule');
        break;
    }
    this.syncFromRich();
  }

  private insertMarkdownSyntax(action: ToolbarAction): void {
    const textarea = this.editorArea?.nativeElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = this.markdown();
    const selected = text.substring(start, end);

    let insertion = '';
    let cursorOffset = 0;

    switch (action) {
      case 'bold':
        insertion = `**${selected || 'bold text'}**`;
        cursorOffset = selected ? insertion.length : 2;
        break;
      case 'italic':
        insertion = `*${selected || 'italic text'}*`;
        cursorOffset = selected ? insertion.length : 1;
        break;
      case 'underline':
        insertion = `<u>${selected || 'underlined text'}</u>`;
        cursorOffset = selected ? insertion.length : 3;
        break;
      case 'strikethrough':
        insertion = `~~${selected || 'strikethrough'}~~`;
        cursorOffset = selected ? insertion.length : 2;
        break;
      case 'h1':
        insertion = `# ${selected || 'Heading 1'}`;
        cursorOffset = insertion.length;
        break;
      case 'h2':
        insertion = `## ${selected || 'Heading 2'}`;
        cursorOffset = insertion.length;
        break;
      case 'h3':
        insertion = `### ${selected || 'Heading 3'}`;
        cursorOffset = insertion.length;
        break;
      case 'ul':
        insertion = `- ${selected || 'List item'}`;
        cursorOffset = insertion.length;
        break;
      case 'ol':
        insertion = `1. ${selected || 'List item'}`;
        cursorOffset = insertion.length;
        break;
      case 'blockquote':
        insertion = `> ${selected || 'Quote'}`;
        cursorOffset = insertion.length;
        break;
      case 'code':
        insertion = `\`${selected || 'code'}\``;
        cursorOffset = selected ? insertion.length : 1;
        break;
      case 'codeblock':
        insertion = `\`\`\`\n${selected || 'code'}\n\`\`\``;
        cursorOffset = 4;
        break;
      case 'link':
        insertion = `[${selected || 'link text'}](url)`;
        cursorOffset = selected ? insertion.length - 5 : 1;
        break;
      case 'image':
        insertion = `![${selected || 'alt text'}](url)`;
        cursorOffset = selected ? insertion.length - 5 : 2;
        break;
      case 'hr':
        insertion = `\n---\n`;
        cursorOffset = insertion.length;
        break;
    }

    const newText = text.substring(0, start) + insertion + text.substring(end);
    this.markdown.set(newText);
    this.emitChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursorOffset, start + cursorOffset);
    });
  }

  // -- Content input handlers --
  protected onMarkdownInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.markdown.set(value);
    this.emitChange(value);
  }

  protected onRichInput(): void {
    this.syncFromRich();
  }

  protected onBlur(): void {
    this.onTouched();
  }

  private syncFromRich(): void {
    if (this.richArea?.nativeElement) {
      const md = this.htmlToMarkdown(this.richArea.nativeElement.innerHTML);
      this.markdown.set(md);
      this.emitChange(md);
    }
  }

  private emitChange(value: string): void {
    this.onChange(value);
    this.contentChange.emit(value);
  }

  private getSelection(): string {
    return window.getSelection()?.toString() || '';
  }

  // -- Toolbar label helpers --
  protected getActionLabel(action: ToolbarAction): string {
    const labels: Record<ToolbarAction, string> = {
      bold: 'B',
      italic: 'I',
      underline: 'U',
      strikethrough: 'S',
      h1: 'H1',
      h2: 'H2',
      h3: 'H3',
      ul: '•',
      ol: '1.',
      blockquote: '"',
      code: '<>',
      codeblock: '{ }',
      link: '🔗',
      image: '🖼',
      hr: '—',
    };
    return labels[action] || action;
  }

  protected getActionTitle(action: ToolbarAction): string {
    const titles: Record<ToolbarAction, string> = {
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline',
      strikethrough: 'Strikethrough',
      h1: 'Heading 1',
      h2: 'Heading 2',
      h3: 'Heading 3',
      ul: 'Unordered List',
      ol: 'Ordered List',
      blockquote: 'Blockquote',
      code: 'Inline Code',
      codeblock: 'Code Block',
      link: 'Insert Link',
      image: 'Insert Image',
      hr: 'Horizontal Rule',
    };
    return titles[action] || action;
  }

  // -- Markdown <-> HTML conversion (simple built-in) --
  protected markdownToHtml(md: string): string {
    if (!md) return '';

    let html = md;

    // Code blocks (must be first)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

    // Headings
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // Horizontal rule
    html = html.replace(/^---$/gm, '<hr>');

    // Bold/Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // Inline code
    html = html.replace(/`(.+?)`/g, '<code>$1</code>');

    // Links and images
    html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img alt="$1" src="$2" />');
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Paragraphs (lines that aren't already wrapped)
    html = html.replace(/^(?!<[a-z])((?!^\s*$).+)$/gm, '<p>$1</p>');

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html.trim();
  }

  private htmlToMarkdown(html: string): string {
    if (!html) return '';

    let md = html;

    // Block elements
    md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n');
    md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n');
    md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n');
    md = md.replace(/<hr\s*\/?>/gi, '---\n');
    md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n');
    md = md.replace(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n');

    // Lists
    md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, '$1');
    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, '$1');
    md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');

    // Inline
    md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
    md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
    md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    md = md.replace(/<del[^>]*>(.*?)<\/del>/gi, '~~$1~~');
    md = md.replace(/<u[^>]*>(.*?)<\/u>/gi, '<u>$1</u>');
    md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
    md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, '![$1]($2)');

    // Paragraphs and line breaks
    md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    md = md.replace(/<br\s*\/?>/gi, '\n');
    md = md.replace(/<div[^>]*>(.*?)<\/div>/gi, '$1\n');

    // Strip remaining HTML tags
    md = md.replace(/<[^>]+>/g, '');

    // Decode HTML entities
    md = md.replace(/&amp;/g, '&');
    md = md.replace(/&lt;/g, '<');
    md = md.replace(/&gt;/g, '>');
    md = md.replace(/&quot;/g, '"');
    md = md.replace(/&nbsp;/g, ' ');

    // Normalize whitespace
    md = md.replace(/\n{3,}/g, '\n\n');

    return md.trim();
  }
}
