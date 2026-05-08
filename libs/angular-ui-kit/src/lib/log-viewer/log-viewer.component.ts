import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  effect,
  inject,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  NgZone,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { IconComponent } from '../icon/icon.component';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogViewerVariant = 'terminal' | 'log';

export interface LogLine {
  text: string;
  level?: LogLevel;
  timestamp?: Date;
  source?: string;
  meta?: Record<string, unknown>;
}

/**
 * Streaming log / terminal viewer component.
 *
 * Supports controlled (lines input) and streaming (stream$ observable) modes,
 * virtualized rendering for large buffers, ANSI color parsing, auto-scroll,
 * and filtering.
 *
 * @example
 * ```html
 * <lc-log-viewer [stream$]="logs$" autoScroll height="600px" variant="terminal" />
 * ```
 */
@Component({
  selector: 'lc-log-viewer',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LogViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('scrollContainer') scrollContainer?: ElementRef<HTMLElement>;

  private readonly ngZone = inject(NgZone);
  private streamSub?: Subscription;
  private scrollListener?: () => void;

  /** Controlled mode: array of log lines */
  readonly lines = input<LogLine[]>([]);

  /** Streaming mode: observable of log lines */
  readonly stream$ = input<Observable<LogLine | LogLine[]>>();

  /** Maximum lines to keep in buffer */
  readonly maxLines = input<number>(10_000);

  /** Auto-scroll to bottom on new lines */
  readonly autoScroll = input<boolean>(true);

  /** Show timestamps column */
  readonly showTimestamps = input<boolean>(true);

  /** Show line numbers */
  readonly showLineNumbers = input<boolean>(false);

  /** Parse ANSI color codes */
  readonly ansiColors = input<boolean>(true);

  /** Filter by log levels */
  readonly levelFilter = input<LogLevel[]>();

  /** Search query to highlight */
  readonly searchQuery = input<string>();

  /** Container height */
  readonly height = input<string>('400px');

  /** Visual variant */
  readonly variant = input<LogViewerVariant>('log');

  /** Emitted when a line is clicked */
  readonly lineClick = output<LogLine>();

  /** Emitted on copy all */
  readonly copyAll = output<string>();

  /** Emitted when scroll state changes */
  readonly scrollStateChange = output<{ atBottom: boolean }>();

  /** Internal buffer of all lines */
  protected buffer = signal<LogLine[]>([]);

  /** Whether stream is paused */
  protected paused = signal(false);

  /** Whether user is at bottom of scroll */
  protected atBottom = signal(true);

  /** Internal search input */
  protected internalSearch = signal('');

  /** Internal level filter */
  protected internalLevelFilter = signal<Set<LogLevel>>(new Set());

  /** Show search bar */
  protected showSearch = signal(false);

  /** Effective search query */
  protected effectiveSearch = computed(() => {
    return this.searchQuery() || this.internalSearch();
  });

  /** Filtered lines for display */
  protected filteredLines = computed(() => {
    let lines = this.buffer();
    const levels = this.levelFilter();
    const internalFilter = this.internalLevelFilter();

    // Apply level filter
    if (levels?.length) {
      lines = lines.filter((l) => l.level && levels.includes(l.level));
    } else if (internalFilter.size > 0) {
      lines = lines.filter((l) => l.level && internalFilter.has(l.level));
    }

    return lines;
  });

  /** Visible window of lines (virtualized) */
  protected scrollTop = signal(0);
  protected readonly LINE_HEIGHT = 22;

  protected visibleRange = computed(() => {
    const containerHeight = parseInt(this.height(), 10) || 400;
    const toolbarHeight = 40;
    const viewHeight = containerHeight - toolbarHeight;
    const total = this.filteredLines().length;
    const start = Math.floor(this.scrollTop() / this.LINE_HEIGHT);
    const visible = Math.ceil(viewHeight / this.LINE_HEIGHT) + 2;
    return {
      start: Math.max(0, start - 1),
      end: Math.min(total, start + visible + 1),
      total,
      totalHeight: total * this.LINE_HEIGHT,
    };
  });

  protected visibleLines = computed(() => {
    const range = this.visibleRange();
    return this.filteredLines().slice(range.start, range.end).map((line, i) => ({
      ...line,
      _index: range.start + i,
    }));
  });

  protected containerClasses = computed(() => {
    return `lc-log-viewer lc-log-viewer--${this.variant()}`;
  });

  /** Line counts per level for toolbar */
  protected levelCounts = computed(() => {
    const buf = this.buffer();
    const counts = { debug: 0, info: 0, warn: 0, error: 0 };
    for (const line of buf) {
      if (line.level && line.level in counts) counts[line.level as keyof typeof counts]++;
    }
    return counts;
  });

  constructor() {
    // Sync controlled lines to buffer
    effect(() => {
      const input = this.lines();
      if (input.length > 0) {
        this.buffer.set(input.slice(-this.maxLines()));
      }
    });

    // Subscribe to stream$
    effect(() => {
      const stream = this.stream$();
      this.streamSub?.unsubscribe();
      if (stream) {
        this.streamSub = stream.subscribe((data) => {
          if (this.paused()) return;
          const newLines = Array.isArray(data) ? data : [data];
          this.buffer.update((buf) => {
            const combined = [...buf, ...newLines];
            return combined.length > this.maxLines()
              ? combined.slice(-this.maxLines())
              : combined;
          });
        });
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.scrollContainer) {
      this.ngZone.runOutsideAngular(() => {
        this.scrollListener = () => this.onScroll();
        this.scrollContainer!.nativeElement.addEventListener('scroll', this.scrollListener, { passive: true });
      });
    }
  }

  ngOnDestroy(): void {
    this.streamSub?.unsubscribe();
    if (this.scrollContainer && this.scrollListener) {
      this.scrollContainer.nativeElement.removeEventListener('scroll', this.scrollListener);
    }
  }

  protected onScroll(): void {
    const el = this.scrollContainer?.nativeElement;
    if (!el) return;
    this.scrollTop.set(el.scrollTop);
    const wasAtBottom = this.atBottom();
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
    if (wasAtBottom !== isAtBottom) {
      this.ngZone.run(() => {
        this.atBottom.set(isAtBottom);
        this.scrollStateChange.emit({ atBottom: isAtBottom });
      });
    } else {
      this.scrollTop.set(el.scrollTop);
    }
  }

  protected scrollToBottom(): void {
    const el = this.scrollContainer?.nativeElement;
    if (el) {
      el.scrollTop = el.scrollHeight;
      this.atBottom.set(true);
    }
  }

  protected togglePause(): void {
    this.paused.update((v) => !v);
  }

  protected clearBuffer(): void {
    this.buffer.set([]);
  }

  protected async onCopyAll(): Promise<void> {
    const text = this.filteredLines()
      .map((l) => {
        const ts = l.timestamp ? `[${l.timestamp.toISOString()}] ` : '';
        const lvl = l.level ? `[${l.level.toUpperCase()}] ` : '';
        return `${ts}${lvl}${l.text}`;
      })
      .join('\n');
    await navigator.clipboard.writeText(text);
    this.copyAll.emit(text);
  }

  protected toggleSearch(): void {
    this.showSearch.update((v) => !v);
    if (!this.showSearch()) {
      this.internalSearch.set('');
    }
  }

  protected toggleLevelFilter(level: LogLevel): void {
    this.internalLevelFilter.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(level)) {
        newSet.delete(level);
      } else {
        newSet.add(level);
      }
      return newSet;
    });
  }

  protected onLineClick(line: LogLine): void {
    this.lineClick.emit(line);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === '/' && !this.showSearch()) {
      event.preventDefault();
      this.toggleSearch();
    }
    if (event.key === 'g' && !event.shiftKey && !this.showSearch()) {
      this.scrollContainer?.nativeElement.scrollTo(0, 0);
    }
    if (event.key === 'G' && !this.showSearch()) {
      this.scrollToBottom();
    }
  }

  protected formatTimestamp(date?: Date): string {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', { hour12: false } as Intl.DateTimeFormatOptions);
  }

  protected parseAnsi(text: string): string {
    if (!this.ansiColors()) return this.escapeHtml(text);

    const escaped = this.escapeHtml(text);
    // Replace ANSI codes with spans
    return escaped
      .replace(/\x1b\[0m/g, '</span>')
      .replace(/\x1b\[1m/g, '<span class="ansi-bold">')
      .replace(/\x1b\[3m/g, '<span class="ansi-italic">')
      .replace(/\x1b\[30m/g, '<span class="ansi-black">')
      .replace(/\x1b\[31m/g, '<span class="ansi-red">')
      .replace(/\x1b\[32m/g, '<span class="ansi-green">')
      .replace(/\x1b\[33m/g, '<span class="ansi-yellow">')
      .replace(/\x1b\[34m/g, '<span class="ansi-blue">')
      .replace(/\x1b\[35m/g, '<span class="ansi-magenta">')
      .replace(/\x1b\[36m/g, '<span class="ansi-cyan">')
      .replace(/\x1b\[37m/g, '<span class="ansi-white">')
      .replace(/\x1b\[90m/g, '<span class="ansi-gray">')
      .replace(/\x1b\[91m/g, '<span class="ansi-bright-red">')
      .replace(/\x1b\[92m/g, '<span class="ansi-bright-green">')
      .replace(/\x1b\[93m/g, '<span class="ansi-bright-yellow">')
      .replace(/\x1b\[94m/g, '<span class="ansi-bright-blue">')
      .replace(/\x1b\[95m/g, '<span class="ansi-bright-magenta">')
      .replace(/\x1b\[96m/g, '<span class="ansi-bright-cyan">')
      .replace(/\x1b\[97m/g, '<span class="ansi-bright-white">')
      .replace(/\x1b\[\d+m/g, ''); // strip unrecognized codes
  }

  protected highlightSearch(html: string): string {
    const query = this.effectiveSearch();
    if (!query) return html;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return html.replace(
      new RegExp(`(${escaped})`, 'gi'),
      '<mark class="lc-log-viewer__match">$1</mark>'
    );
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
