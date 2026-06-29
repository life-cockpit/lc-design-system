import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  computed,
  signal,
  effect,
  untracked,
  inject,
  ElementRef,
  OnDestroy,
  SecurityContext,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CodeBlockComponent, CodeBlockLanguage } from '../code-block/code-block.component';

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

export interface MarkdownChangesHighlighted {
  /** Number of changed/added blocks highlighted in the current render. */
  changedBlocks: number;
}

export interface RenderPart {
  type: 'html' | 'code' | 'mermaid';
  index: number;
  safeHtml?: SafeHtml;
  code?: string;
  lang?: CodeBlockLanguage;
}

/**
 * Markdown renderer component.
 *
 * Renders GitHub-Flavored Markdown (GFM) to sanitized HTML with
 * optional syntax highlighting via `<lc-code-block>`.
 *
 * Optionally highlights *changed* blocks in place: pass the pre-edit markdown as
 * `previousContent` and set `highlightChanges` — added/edited blocks (diffed at
 * block / list-item level) gain a left accent bar + subtle tint, can auto-fade
 * (`changeHighlightFadeMs`) and scroll into view (`scrollToFirstChange`).
 *
 * @example
 * ```html
 * <lc-markdown [content]="'# Hello World'" />
 * <lc-markdown [src]="'/docs/readme.md'" />
 * <lc-markdown
 *   [content]="current" [previousContent]="prev"
 *   [highlightChanges]="true" [changeHighlightFadeMs]="3000" />
 * ```
 */
@Component({
  selector: 'lc-markdown',
  standalone: true,
  imports: [CodeBlockComponent],
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MarkdownComponent implements OnDestroy {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly http = inject(HttpClient);
  private readonly host = inject(ElementRef<HTMLElement>);
  private httpSub?: Subscription;
  private fadeTimer?: ReturnType<typeof setTimeout>;
  private scrollTimer?: ReturnType<typeof setTimeout>;
  private mermaidApiPromise?: Promise<any>;
  private mermaidInitialized = false;
  private mermaidRenderRun = 0;

  /** URL or path to load markdown from */
  readonly src = input<string>();

  /** Raw markdown string */
  readonly content = input<string>();

  /** Display variant */
  readonly variant = input<'default' | 'compact' | 'chat'>('default');

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

  // -- Change highlighting --
  /** Enable change highlighting (requires `previousContent` to compute a diff). */
  readonly highlightChanges = input<boolean>(false);

  /**
   * The prior Markdown. When it differs from `content`, the changed/added blocks
   * in `content` are highlighted. The caller passes the pre-edit markdown.
   */
  readonly previousContent = input<string>();

  /** Auto-fade the highlight after N ms. 0 / undefined ⇒ persist until content changes. */
  readonly changeHighlightFadeMs = input<number>();

  /** Scroll the first changed block into view when highlights appear. */
  readonly scrollToFirstChange = input<boolean>(false);

  /** Emitted when a link is clicked */
  readonly linkClick = output<MarkdownLinkClick>();

  /** Emitted after rendering with heading TOC */
  readonly rendered = output<MarkdownRendered>();

  /** Emitted after a render that produced change highlights. */
  readonly changesHighlighted = output<MarkdownChangesHighlighted>();

  /** Internal resolved markdown source */
  protected resolvedMarkdown = signal<string>('');

  /** Parsed result (computed once from resolvedMarkdown) */
  private parsed = computed(() => {
    const md = this.resolvedMarkdown();
    if (!md) {
      return {
        html: '',
        blocks: [] as { kind: 'code' | 'mermaid'; lang: string; code: string }[],
        headings: [] as MarkdownHeading[],
      };
    }
    return this.parseMarkdown(md);
  });

  /**
   * Rendered HTML after applying change highlights. When highlighting is off (or
   * there is no differing `previousContent`) this returns the parsed HTML
   * unchanged, so the non-highlight path is byte-for-byte identical to before.
   */
  private readonly highlightResult = computed<{ html: string; count: number }>(() => {
    const { html } = this.parsed();
    const prev = this.previousContent();
    if (
      !html ||
      !this.highlightChanges() ||
      prev == null ||
      prev === this.resolvedMarkdown()
    ) {
      return { html, count: 0 };
    }
    return this.applyChangeHighlights(html, prev);
  });

  /** Number of changed/added blocks highlighted in the current render. */
  protected readonly changedCount = computed(() => this.highlightResult().count);

  /** Visually-hidden polite summary announced when highlights appear. */
  protected readonly changeSummary = computed(() => {
    const n = this.changedCount();
    if (n <= 0) return '';
    return `${n} ${n === 1 ? 'Abschnitt' : 'Abschnitte'} geändert`;
  });

  /** Whether the current highlights have faded out (after `changeHighlightFadeMs`). */
  protected readonly highlightsFaded = signal(false);

  /** Computed render parts (HTML chunks + code blocks interleaved) */
  protected renderParts = computed<RenderPart[]>(() => {
    const html = this.highlightResult().html;
    const { blocks } = this.parsed();
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
    let classes = `lc-markdown lc-markdown--${this.variant()}`;
    if (this.highlightsFaded()) classes += ' lc-markdown--faded';
    return classes;
  });

  protected mermaidSvgs = signal<Record<number, SafeHtml>>({});
  protected mermaidErrors = signal<Record<number, string>>({});

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

    // Render Mermaid code fences as inline SVG diagrams.
    effect(() => {
      void this.renderMermaidParts(this.renderParts());
    });

    // React to a render that produced change highlights: emit, schedule fade,
    // and optionally scroll the first changed block into view.
    effect(() => {
      const count = this.highlightResult().count;
      untracked(() => this.onHighlightResult(count));
    });
  }

  ngOnDestroy(): void {
    this.httpSub?.unsubscribe();
    clearTimeout(this.fadeTimer);
    clearTimeout(this.scrollTimer);
  }

  protected onLinkClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor) {
      this.linkClick.emit({ href: anchor.href, event });
    }
  }

  // -- Change highlighting -----------------------------------------------------

  /** Side-effects for a render: emit, (re)arm the fade timer, optional scroll. */
  private onHighlightResult(count: number): void {
    clearTimeout(this.fadeTimer);
    clearTimeout(this.scrollTimer);
    // A fresh render starts un-faded (re-entrant: never reuse stale fade state).
    this.highlightsFaded.set(false);
    if (count <= 0) return;

    this.changesHighlighted.emit({ changedBlocks: count });

    const fadeMs = this.changeHighlightFadeMs();
    if (fadeMs && fadeMs > 0) {
      this.fadeTimer = setTimeout(() => this.highlightsFaded.set(true), fadeMs);
    }
    if (this.scrollToFirstChange()) {
      // Defer until the highlighted HTML has been written to the DOM.
      this.scrollTimer = setTimeout(() => this.scrollToFirstChanged(), 0);
    }
  }

  private scrollToFirstChanged(): void {
    if (typeof document === 'undefined') return;
    const el = this.host.nativeElement.querySelector('.lc-markdown__block--changed');
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Wraps the changed/added top-level blocks of `html` with
   * `.lc-markdown__block--changed`. A block is "changed" when its normalized
   * text is not present among the blocks of `prevMarkdown`. Lists are diffed
   * per `<li>` and tables per `<tr>` so a single edited item highlights alone.
   */
  private applyChangeHighlights(
    html: string,
    prevMarkdown: string
  ): { html: string; count: number } {
    if (typeof document === 'undefined') return { html, count: 0 };

    const prevKeys = this.collectBlockKeys(this.parseMarkdown(prevMarkdown).html);
    const root = this.htmlToElement(html);
    if (!root) return { html, count: 0 };

    let count = 0;
    const markIfChanged = (el: Element): void => {
      const key = this.blockTextKey(el.textContent ?? '');
      if (!key || prevKeys.has(key)) return;
      el.classList.add('lc-markdown__block--changed');
      const sr = document.createElement('span');
      sr.className = 'lc-markdown__sr-only';
      sr.textContent = '(geändert) ';
      el.insertBefore(sr, el.firstChild);
      count++;
    };

    this.eachLogicalBlock(root, markIfChanged);
    return { html: root.innerHTML, count };
  }

  /** Normalized text set of the logical blocks within an HTML fragment. */
  private collectBlockKeys(html: string): Set<string> {
    const keys = new Set<string>();
    const root = this.htmlToElement(html);
    if (!root) return keys;
    this.eachLogicalBlock(root, (el) => {
      const key = this.blockTextKey(el.textContent ?? '');
      if (key) keys.add(key);
    });
    return keys;
  }

  /**
   * Visits each diffable block under `root`: top-level elements, but descending
   * into `<ul>`/`<ol>` (per `<li>`) and `<table>` (per `<tr>`).
   */
  private eachLogicalBlock(root: Element, visit: (el: Element) => void): void {
    for (const node of Array.from(root.childNodes)) {
      if (node.nodeType !== 1) continue; // elements only (skips code placeholders)
      const el = node as Element;
      const tag = el.tagName;
      if (tag === 'UL' || tag === 'OL') {
        for (const li of Array.from(el.children)) {
          if (li.tagName === 'LI') visit(li);
        }
      } else if (tag === 'TABLE') {
        for (const tr of Array.from(el.querySelectorAll('tr'))) {
          visit(tr);
        }
      } else {
        visit(el);
      }
    }
  }

  private blockTextKey(text: string): string {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  private htmlToElement(html: string): HTMLElement | null {
    if (typeof document === 'undefined') return null;
    const div = document.createElement('div');
    div.innerHTML = html;
    return div;
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
    blocks: { kind: 'code' | 'mermaid'; lang: string; code: string }[]
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
      const block = blocks[blockIdx];
      if (block.kind === 'mermaid') {
        parts.push({
          type: 'mermaid',
          index: partIndex++,
          code: block.code,
        });
      } else {
        parts.push({
          type: 'code',
          index: partIndex++,
          code: block.code,
          lang: block.lang as CodeBlockLanguage,
        });
      }
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
    blocks: { kind: 'code' | 'mermaid'; lang: string; code: string }[];
    headings: MarkdownHeading[];
  } {
    const blocks: { kind: 'code' | 'mermaid'; lang: string; code: string }[] = [];
    const headings: MarkdownHeading[] = [];
    const baseUrl = this.baseUrl();
    const linkTarget = this.linkTarget();
    const showAnchors = this.showHeadingAnchors();

    // 1. Extract fenced code blocks → placeholders
    let processed = md.replace(
      /```(\w*)\n([\s\S]*?)```/g,
      (_match, lang: string, code: string) => {
        const idx = blocks.length;
        const normalizedLang = (lang || 'text').toLowerCase();
        blocks.push({
          kind: normalizedLang === 'mermaid' ? 'mermaid' : 'code',
          lang: normalizedLang,
          code: code.trimEnd(),
        });
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

  protected mermaidSvgFor(index: number): SafeHtml | null {
    return this.mermaidSvgs()[index] ?? null;
  }

  protected mermaidErrorFor(index: number): string | null {
    return this.mermaidErrors()[index] ?? null;
  }

  private async renderMermaidParts(parts: RenderPart[]): Promise<void> {
    const mermaidParts = parts.filter((part) => part.type === 'mermaid' && !!part.code);
    this.mermaidSvgs.set({});
    this.mermaidErrors.set({});

    if (mermaidParts.length === 0) {
      return;
    }

    const runId = ++this.mermaidRenderRun;

    try {
      const mermaidApi = await this.getMermaidApi();
      if (runId !== this.mermaidRenderRun) return;

      const nextSvgs: Record<number, SafeHtml> = {};
      const nextErrors: Record<number, string> = {};

      for (const part of mermaidParts) {
        try {
          const renderId = `lc-md-mermaid-${runId}-${part.index}`;
          const { svg } = await mermaidApi.render(renderId, part.code!);
          if (runId !== this.mermaidRenderRun) return;
          // Mermaid emits self-contained SVG with internal <style> rules.
          // Angular HTML sanitization strips critical style declarations,
          // which leaves only labels visible (no edges/shapes). We trust
          // Mermaid output here and rely on Mermaid's strict security mode.
          nextSvgs[part.index] = this.sanitizer.bypassSecurityTrustHtml(svg);
        } catch {
          nextErrors[part.index] = 'Mermaid diagram could not be rendered.';
        }
      }

      if (runId !== this.mermaidRenderRun) return;
      this.mermaidSvgs.set(nextSvgs);
      this.mermaidErrors.set(nextErrors);
    } catch {
      if (runId !== this.mermaidRenderRun) return;
      const fallbackErrors: Record<number, string> = {};
      for (const part of mermaidParts) {
        fallbackErrors[part.index] = 'Mermaid runtime is not available.';
      }
      this.mermaidErrors.set(fallbackErrors);
    }
  }

  private async getMermaidApi(): Promise<any> {
    if (!this.mermaidApiPromise) {
      this.mermaidApiPromise = import('mermaid').then((module) => {
        const api = module.default ?? module;
        if (!this.mermaidInitialized) {
          api.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
          });
          this.mermaidInitialized = true;
        }
        return api;
      });
    }
    return this.mermaidApiPromise;
  }
}
