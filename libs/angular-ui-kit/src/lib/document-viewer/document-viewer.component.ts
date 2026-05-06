import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
  signal,
  OnInit,
  OnDestroy,
  inject,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { IconComponent } from '../icon/icon.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CodeBlockComponent, CodeBlockLanguage } from '../code-block/code-block.component';

export type DocumentType = 'pdf' | 'markdown' | 'image' | 'text' | 'code' | 'auto';

const EXTENSION_TYPE_MAP: Record<string, DocumentType> = {
  pdf: 'pdf',
  md: 'markdown',
  markdown: 'markdown',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  svg: 'image',
  bmp: 'image',
  ts: 'code',
  js: 'code',
  tsx: 'code',
  jsx: 'code',
  py: 'code',
  java: 'code',
  html: 'code',
  css: 'code',
  scss: 'code',
  json: 'code',
  sh: 'code',
  bash: 'code',
  txt: 'text',
  log: 'text',
  csv: 'text',
};

const EXTENSION_LANGUAGE_MAP: Record<string, CodeBlockLanguage> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  jsx: 'javascript',
  py: 'python',
  java: 'java',
  html: 'html',
  css: 'css',
  scss: 'scss',
  json: 'json',
  sh: 'bash',
  bash: 'bash',
};

const TYPE_ICONS: Record<string, string> = {
  pdf: 'document-text',
  markdown: 'document-text',
  image: 'photo',
  text: 'document',
  code: 'code-bracket',
  unknown: 'document',
};

// ── Markdown Parser ──────────────────────────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function parseMarkdownInline(text: string): string {
  return text
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="doc-viewer__md-img" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="doc-viewer__md-inline-code">$1</code>');
}

function parseMarkdown(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeLines: string[] = [];
  let inList: 'ul' | 'ol' | null = null;
  let inBlockquote = false;
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      html.push(`<p>${parseMarkdownInline(paragraph.join(' '))}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (inList) {
      html.push(`</${inList}>`);
      inList = null;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote) {
      html.push('</blockquote>');
      inBlockquote = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.trimStart().startsWith('```')) {
      if (!inCodeBlock) {
        flushParagraph();
        flushList();
        flushBlockquote();
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
        codeLines = [];
      } else {
        html.push(
          `<pre class="doc-viewer__md-code-block"><code class="language-${escapeHtml(codeBlockLang)}">${escapeHtml(codeLines.join('\n'))}</code></pre>`
        );
        inCodeBlock = false;
        codeBlockLang = '';
      }
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Horizontal rule
    if (/^(\*{3,}|-{3,}|_{3,})\s*$/.test(line.trim())) {
      flushParagraph();
      flushList();
      flushBlockquote();
      html.push('<hr />');
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      flushBlockquote();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${parseMarkdownInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      flushParagraph();
      flushList();
      if (!inBlockquote) {
        html.push('<blockquote class="doc-viewer__md-blockquote">');
        inBlockquote = true;
      }
      html.push(`<p>${parseMarkdownInline(line.slice(2))}</p>`);
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // Unordered lists
    const ulMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
    if (ulMatch) {
      flushParagraph();
      if (inList !== 'ul') {
        flushList();
        html.push('<ul>');
        inList = 'ul';
      }
      html.push(`<li>${parseMarkdownInline(ulMatch[2])}</li>`);
      continue;
    }

    // Ordered lists
    const olMatch = line.match(/^(\s*)\d+\.\s+(.+)$/);
    if (olMatch) {
      flushParagraph();
      if (inList !== 'ol') {
        flushList();
        html.push('<ol>');
        inList = 'ol';
      }
      html.push(`<li>${parseMarkdownInline(olMatch[2])}</li>`);
      continue;
    }

    // Close list if not a list item
    if (inList) flushList();

    // Tables
    if (line.includes('|') && line.trim().startsWith('|')) {
      flushParagraph();
      const tableLines: string[] = [line];
      let j = i + 1;
      while (j < lines.length && lines[j].includes('|') && lines[j].trim().startsWith('|')) {
        tableLines.push(lines[j]);
        j++;
      }
      i = j - 1;

      if (tableLines.length >= 2) {
        html.push('<table class="doc-viewer__md-table">');
        // Header
        const headerCells = tableLines[0].split('|').filter(c => c.trim());
        html.push('<thead><tr>');
        headerCells.forEach(c => html.push(`<th>${parseMarkdownInline(c.trim())}</th>`));
        html.push('</tr></thead>');
        // Body (skip separator row)
        html.push('<tbody>');
        for (let k = 2; k < tableLines.length; k++) {
          const cells = tableLines[k].split('|').filter(c => c.trim());
          html.push('<tr>');
          cells.forEach(c => html.push(`<td>${parseMarkdownInline(c.trim())}</td>`));
          html.push('</tr>');
        }
        html.push('</tbody></table>');
      }
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    // Paragraph text
    paragraph.push(line);
  }

  // Flush remaining
  if (inCodeBlock) {
    html.push(`<pre class="doc-viewer__md-code-block"><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
  }
  flushParagraph();
  flushList();
  flushBlockquote();

  return html.join('\n');
}

/**
 * Document viewer component for previewing various file types.
 *
 * Features:
 * - Auto-detects file type from URL extension or explicit type input
 * - PDF rendering via browser-native iframe viewer
 * - Markdown parsing and rendering with full formatting support
 * - Image display with zoom controls (25% – 500%)
 * - Code display using the built-in code block component
 * - Plain text display
 * - Toolbar with filename, type badge, zoom, download, and fullscreen
 * - Loading and error states
 * - Dark/light theme support
 *
 * @example
 * ```html
 * <lc-document-viewer src="https://example.com/report.pdf" />
 * <lc-document-viewer [content]="markdownString" type="markdown" filename="README.md" />
 * <lc-document-viewer src="/assets/diagram.png" />
 * ```
 */
@Component({
  selector: 'lc-document-viewer',
  standalone: true,
  imports: [IconComponent, SpinnerComponent, CodeBlockComponent],
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': '"doc-viewer"',
    '[style.height]': 'height()',
  },
})
export class DocumentViewerComponent implements OnInit, OnDestroy {
  /** URL of the document to display (for PDF, images, or remote files) */
  readonly src = input<string>('');

  /** Direct content string (for markdown, text, or code — takes precedence over src for content-based types) */
  readonly content = input<string>('');

  /** File type — set to 'auto' to detect from URL extension */
  readonly type = input<DocumentType>('auto');

  /** Display name shown in the toolbar */
  readonly filename = input<string>('');

  /** Code language for syntax highlighting (when type is 'code') */
  readonly language = input<CodeBlockLanguage>('text');

  /** Whether to display the toolbar */
  readonly showToolbar = input(true);

  /** Whether to show the download button in the toolbar */
  readonly showDownload = input(true);

  /** Height of the viewer container */
  readonly height = input('500px');

  // ── Internal state ───────────────────────────────────────────────────────

  protected loading = signal(true);
  protected error = signal<string | null>(null);
  protected fetchedContent = signal<string>('');
  protected zoom = signal(100);
  protected isFullscreen = signal(false);

  private readonly sanitizer = inject(DomSanitizer);
  private readonly elementRef = inject(ElementRef);
  private fullscreenHandler: (() => void) | null = null;

  // ── Computed values ──────────────────────────────────────────────────────

  /** Resolved document type from input or URL extension */
  protected resolvedType = computed<DocumentType | 'unknown'>(() => {
    const t = this.type();
    if (t !== 'auto') return t;
    const ext = this.extractExtension(this.src());
    return ext && EXTENSION_TYPE_MAP[ext] ? EXTENSION_TYPE_MAP[ext] : 'unknown';
  });

  /** Display name for the toolbar */
  protected displayName = computed(() => {
    if (this.filename()) return this.filename();
    const src = this.src();
    if (!src) return 'Document';
    try {
      const url = new URL(src, 'http://localhost');
      const segments = url.pathname.split('/');
      return segments[segments.length - 1] || 'Document';
    } catch {
      return src.split('/').pop() || 'Document';
    }
  });

  /** Icon name for the document type */
  protected typeIcon = computed(() => TYPE_ICONS[this.resolvedType()] || TYPE_ICONS['unknown']);

  /** Type label for the toolbar badge */
  protected typeLabel = computed(() => {
    const t = this.resolvedType();
    switch (t) {
      case 'pdf': return 'PDF';
      case 'markdown': return 'Markdown';
      case 'image': return 'Image';
      case 'text': return 'Text';
      case 'code': return this.resolvedLanguage().toUpperCase();
      default: return 'File';
    }
  });

  /** Resolved code language */
  protected resolvedLanguage = computed<CodeBlockLanguage>(() => {
    const lang = this.language();
    if (lang !== 'text') return lang;
    const ext = this.extractExtension(this.src());
    return ext && EXTENSION_LANGUAGE_MAP[ext] ? EXTENSION_LANGUAGE_MAP[ext] : 'text';
  });

  /** Sanitized src URL for iframe/img embedding */
  protected safeSrc = computed<SafeResourceUrl>(() => {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.src());
  });

  /** Effective content: direct content input or fetched content */
  protected effectiveContent = computed(() => {
    return this.content() || this.fetchedContent();
  });

  /** Rendered markdown HTML */
  protected renderedMarkdown = computed<SafeHtml>(() => {
    const md = this.effectiveContent();
    if (!md) return '';
    return this.sanitizer.bypassSecurityTrustHtml(parseMarkdown(md));
  });

  /** Image transform style for zoom */
  protected imageTransform = computed(() => {
    const z = this.zoom() / 100;
    return `scale(${z})`;
  });

  /** Whether zoom controls should be shown */
  protected showZoom = computed(() => {
    const t = this.resolvedType();
    return t === 'image';
  });

  // ── Lifecycle ────────────────────────────────────────────────────────────

  ngOnInit(): void {
    const type = this.resolvedType();
    const src = this.src();
    const content = this.content();

    if (content) {
      this.loading.set(false);
      return;
    }

    if (!src) {
      this.loading.set(false);
      this.error.set('No source or content provided');
      return;
    }

    // PDF and images are embedded directly — no fetch needed
    if (type === 'pdf' || type === 'image') {
      this.loading.set(false);
      return;
    }

    // Fetch text-based content
    if (type === 'markdown' || type === 'text' || type === 'code') {
      this.fetchContent(src);
    } else {
      this.loading.set(false);
    }
  }

  ngOnDestroy(): void {
    if (this.fullscreenHandler) {
      document.removeEventListener('fullscreenchange', this.fullscreenHandler);
    }
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  protected zoomIn(): void {
    this.zoom.update(z => Math.min(z + 25, 500));
  }

  protected zoomOut(): void {
    this.zoom.update(z => Math.max(z - 25, 25));
  }

  protected resetZoom(): void {
    this.zoom.set(100);
  }

  protected download(): void {
    const src = this.src();
    if (!src) return;
    const a = document.createElement('a');
    a.href = src;
    a.download = this.displayName();
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  protected toggleFullscreen(): void {
    const el = this.elementRef.nativeElement as HTMLElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      this.isFullscreen.set(true);
    } else {
      document.exitFullscreen?.();
      this.isFullscreen.set(false);
    }

    if (!this.fullscreenHandler) {
      this.fullscreenHandler = () => {
        this.isFullscreen.set(!!document.fullscreenElement);
      };
      document.addEventListener('fullscreenchange', this.fullscreenHandler);
    }
  }

  protected onIframeLoad(): void {
    this.loading.set(false);
  }

  protected onImageLoad(): void {
    this.loading.set(false);
  }

  protected onImageError(): void {
    this.loading.set(false);
    this.error.set('Failed to load image');
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private extractExtension(url: string): string | null {
    if (!url) return null;
    try {
      const pathname = new URL(url, 'http://localhost').pathname;
      const parts = pathname.split('.');
      return parts.length > 1 ? parts.pop()!.toLowerCase() : null;
    } catch {
      const parts = url.split('.');
      return parts.length > 1 ? parts.pop()!.toLowerCase().split('?')[0] : null;
    }
  }

  private async fetchContent(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const text = await response.text();
      this.fetchedContent.set(text);
      this.loading.set(false);
    } catch (err) {
      this.loading.set(false);
      this.error.set(`Failed to load document: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }
}
