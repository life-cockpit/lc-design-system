import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
  effect,
  inject,
  OnDestroy,
  SecurityContext,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CodeBlockComponent } from '../code-block/code-block.component';

export interface MarkdownHeading {
  level: number;
  text: string;
  id: string;
}

export interface MarkdownLinkClick {
  href: string;
  event: MouseEvent;
}

export interface MarkdownRendered {
  headings: MarkdownHeading[];
}

export interface RenderPart {
  type: 'html' | 'code';
  index: number;
  safeHtml?: SafeHtml;
  code?: string;
  lang?: string;
}

/**
 * Markdown renderer component.
 *
 * Renders GitHub-Flavored Markdown (GFM) to sanitized HTML with
 * optional syntax highlighting via `<lc-code-block>`.
 *
 * @example
 * ```html
 * <lc-markdown [content]="'# Hello World'" />
 * <lc-markdown [src]="'/docs/readme.md'" />
 * ```
 */
@Component({
  selector: 'lc-markdown',
  standalone: true,
  imports: [CodeBlockComponent],
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkdownComponent implements OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly http = inject(HttpClient);
  private httpSub?: Subscription;

  /** URL or path to load markdown from */
  readonly src = input<string>();

  /** Raw markdown string */
  readonly content = input<string>();

  /** Display variant */
  readonly variant = input<'default' | 'compact'>('default');

  /** Target for links */
  readonly linkTarget = input<'_self' | '_blank'>('_self');

  /** Whether to sanitize HTML output */
  readonly sanitize = input<boolean>(true);

  /** Whether to use code-block for fenced code */
  readonly syntaxHighlight = input<boolean>(true);

  /** Whether to show anchor links on headings */
  readonly showHeadingAnchors = input<boolean>(false);

  /** Base URL for resolving relative links/images */
  readonly baseUrl = input<string>();

  /** Emitted when a link is clicked */
  readonly linkClick = output<MarkdownLinkClick>();

  /** Emitted after rendering with heading TOC */
  readonly rendered = output<MarkdownRendered>();

  /** Internal resolved markdown source */
  protected resolvedMarkdown = signal<string>('');

  /** Parsed result (computed once from resolvedMarkdown) */
  private parsed = computed(() => {
    const md = this.resolvedMarkdown();
    if (!md) return { html: '', blocks: [] as { lang: string; code: string }[], headings: [] as MarkdownHeading[] };
    return this.parseMarkdown(md);
  });

  /** Computed render parts (HTML chunks + code blocks interleaved) */
  protected renderParts = computed<RenderPart[]>(() => {
    const { html, blocks } = this.parsed();
    if (!html) return [];

    if (this.syntaxHighlight() && blocks.length > 0) {
      return this.splitIntoParts(html, blocks);
    }

    // No code blocks — single HTML part
    const sanitized = this.sanitize()
      ? this.sanitizer.sanitize(SecurityContext.HTML, html) || ''
      : html;
    return [{
      type: 'html',
      index: 0,
      safeHtml: this.sanitizer.bypassSecurityTrustHtml(sanitized as string),
    }];
  });

  protected containerClasses = computed(() => {
    return `lc-markdown lc-markdown--${this.variant()}`;
  });

  private headings = computed(() => this.parsed().headings);

  constructor() {
    // Load content from src when src changes
    effect(() => {
      const src = this.src();
      if (src) {
        this.loadFromUrl(src);
      }
    });

    // Use raw content when provided
    effect(() => {
      const content = this.content();
      if (content !== undefined) {
        this.resolvedMarkdown.set(content);
      }
    });

    // Emit rendered event when headings change
    effect(() => {
      const h = this.headings();
      if (h.length > 0) {
        this.rendered.emit({ headings: h });
      }
    });
  }

  ngOnDestroy(): void {
    this.httpSub?.unsubscribe();
  }

  protected onLinkClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      this.linkClick.emit({ href: anchor.href, event });
    }
  }

  private loadFromUrl(url: string): void {
    this.httpSub?.unsubscribe();
    this.httpSub = this.http.get(url, { responseType: 'text' }).subscribe({
      next: (text) => this.resolvedMarkdown.set(text),
      error: () => this.resolvedMarkdown.set(`*Failed to load ${url}*`),
    });
  }

  private splitIntoParts(
    html: string,
    blocks: { lang: string; code: string }[]
  ): RenderPart[] {
    const parts: RenderPart[] = [];
    // The placeholders survive HTML escaping as &lt;!--CODE_BLOCK_N--&gt;
    const regex = /&lt;!--CODE_BLOCK_(\d+)--&gt;/g;
    let lastIndex = 0;
    let partIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(html)) !== null) {
      const before = html.slice(lastIndex, match.index);
      if (before.trim()) {
        const sanitized = this.sanitize()
          ? this.sanitizer.sanitize(SecurityContext.HTML, before) || ''
          : before;
        parts.push({
          type: 'html',
          index: partIndex++,
          safeHtml: this.sanitizer.bypassSecurityTrustHtml(sanitized as string),
        });
      }
      const blockIdx = parseInt(match[1], 10);
      parts.push({
        type: 'code',
        index: partIndex++,
        code: blocks[blockIdx].code,
        lang: blocks[blockIdx].lang,
      });
      lastIndex = match.index + match[0].length;
    }

    const remaining = html.slice(lastIndex);
    if (remaining.trim()) {
      const sanitized = this.sanitize()
        ? this.sanitizer.sanitize(SecurityContext.HTML, remaining) || ''
        : remaining;
      parts.push({
        type: 'html',
        index: partIndex++,
        safeHtml: this.sanitizer.bypassSecurityTrustHtml(sanitized as string),
      });
    }

    return parts;
  }

  private parseMarkdown(md: string): {
    html: string;
    blocks: { lang: string; code: string }[];
    headings: MarkdownHeading[];
  } {
    const blocks: { lang: string; code: string }[] = [];
    const headings: MarkdownHeading[] = [];
    const baseUrl = this.baseUrl();
    const linkTarget = this.linkTarget();
    const showAnchors = this.showHeadingAnchors();

    // 1. Extract fenced code blocks → placeholders
    let processed = md.replace(
      /```(\w*)\n([\s\S]*?)```/g,
      (_match, lang: string, code: string) => {
        const idx = blocks.length;
        blocks.push({ lang: lang || 'text', code: code.trimEnd() });
        return `<!--CODE_BLOCK_${idx}-->`;
      }
    );

    // 2. Escape HTML entities
    processed = processed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 3. Headings (# to ######)
    processed = processed.replace(
      /^(#{1,6})\s+(.+)$/gm,
      (_match, hashes: string, text: string) => {
        const level = hashes.length;
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        headings.push({ level, text, id });
        const anchor = showAnchors
          ? `<a href="#${id}" class="lc-markdown__anchor" aria-hidden="true">#</a>`
          : '';
        return `<h${level} id="${id}">${anchor}${text}</h${level}>`;
      }
    );

    // 4. Horizontal rules
    processed = processed.replace(/^---+$/gm, '<hr>');

    // 5. Blockquotes
    processed = processed.replace(
      /^(?:&gt;)\s?(.*)$/gm,
      '<blockquote>$1</blockquote>'
    );
    // Merge consecutive blockquotes
    processed = processed.replace(
      /<\/blockquote>\n<blockquote>/g,
      '\n'
    );

    // 6. Tables (GFM)
    processed = this.parseTables(processed);

    // 7. Task lists
    processed = processed.replace(
      /^[-*]\s+\[x\]\s+(.*)$/gm,
      '<li class="lc-markdown__task"><input type="checkbox" checked disabled> $1</li>'
    );
    processed = processed.replace(
      /^[-*]\s+\[ \]\s+(.*)$/gm,
      '<li class="lc-markdown__task"><input type="checkbox" disabled> $1</li>'
    );

    // 8. Unordered lists
    processed = processed.replace(
      /^[-*]\s+(.*)$/gm,
      '<li>$1</li>'
    );
    processed = processed.replace(
      /(<li>[\s\S]*?<\/li>)/g,
      (match) => {
        if (!match.includes('lc-markdown__task')) {
          return match;
        }
        return match;
      }
    );
    // Wrap consecutive <li> in <ul>
    processed = processed.replace(
      /((?:<li[^>]*>.*<\/li>\n?)+)/g,
      '<ul>$1</ul>'
    );

    // 9. Ordered lists
    processed = processed.replace(
      /^\d+\.\s+(.*)$/gm,
      '<li>$1</li>'
    );

    // 10. Inline code
    processed = processed.replace(
      /`([^`]+)`/g,
      '<code>$1</code>'
    );

    // 11. Bold + italic combos
    processed = processed.replace(
      /\*\*\*(.+?)\*\*\*/g,
      '<strong><em>$1</em></strong>'
    );
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    processed = processed.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // 12. Strikethrough (GFM)
    processed = processed.replace(/~~(.+?)~~/g, '<del>$1</del>');

    // 13. Images
    processed = processed.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (_match, alt: string, src: string) => {
        const resolvedSrc = baseUrl && !src.startsWith('http') ? `${baseUrl}/${src}` : src;
        return `<img src="${resolvedSrc}" alt="${alt}" class="lc-markdown__img">`;
      }
    );

    // 14. Links
    processed = processed.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_match, text: string, href: string) => {
        const resolvedHref = baseUrl && !href.startsWith('http') && !href.startsWith('#')
          ? `${baseUrl}/${href}`
          : href;
        return `<a href="${resolvedHref}" target="${linkTarget}" rel="noopener">${text}</a>`;
      }
    );

    // 15. Paragraphs — wrap standalone lines
    processed = processed
      .split('\n\n')
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (
          trimmed.startsWith('<h') ||
          trimmed.startsWith('<ul') ||
          trimmed.startsWith('<ol') ||
          trimmed.startsWith('<blockquote') ||
          trimmed.startsWith('<hr') ||
          trimmed.startsWith('<table') ||
          trimmed.startsWith('<!--CODE_BLOCK')
        ) {
          return trimmed;
        }
        return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n');

    // 16. Restore code block placeholders
    if (this.syntaxHighlight()) {
      // Leave placeholders — the template will render <lc-code-block> for each
      // No replacement needed here
    } else {
      processed = processed.replace(
        /&lt;!--CODE_BLOCK_(\d+)--&gt;/g,
        (_match, idx: string) => {
          const block = blocks[parseInt(idx, 10)];
          return `<pre><code class="language-${block.lang}">${this.escapeHtml(block.code)}</code></pre>`;
        }
      );
    }

    return { html: processed, blocks, headings };
  }

  private parseTables(text: string): string {
    return text.replace(
      /^(\|.+\|)\n(\|[-| :]+\|)\n((?:\|.+\|\n?)*)/gm,
      (_match, header: string, _separator: string, body: string) => {
        const headers = header
          .split('|')
          .filter((c: string) => c.trim())
          .map((c: string) => `<th>${c.trim()}</th>`)
          .join('');

        const rows = body
          .trim()
          .split('\n')
          .map((row: string) => {
            const cells = row
              .split('|')
              .filter((c: string) => c.trim())
              .map((c: string) => `<td>${c.trim()}</td>`)
              .join('');
            return `<tr>${cells}</tr>`;
          })
          .join('');

        return `<table class="lc-markdown__table"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
      }
    );
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
