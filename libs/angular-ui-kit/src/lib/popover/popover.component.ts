import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
} from '@angular/core';

export type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'click' | 'hover';

/**
 * Popover component for displaying rich floating content.
 *
 * Features:
 * - Position options (top, bottom, left, right)
 * - Click or hover trigger modes
 * - Optional arrow indicator
 * - Click-outside to close
 * - Open state change event
 * - Content projection for trigger and body
 *
 * @example
 * ```html
 * <lc-popover position="bottom" trigger="click">
 *   <button popover-trigger>Open</button>
 *   <div popover-content>Rich content here</div>
 * </lc-popover>
 * ```
 */
@Component({
  selector: 'lc-popover',
  standalone: true,
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent implements OnDestroy {
  /**
   * Position relative to the trigger element.
   * @default 'bottom'
   */
  position = input<PopoverPosition>('bottom');

  /**
   * How the popover is triggered.
   * @default 'click'
   */
  trigger = input<PopoverTrigger>('click');

  /**
   * Whether to show an arrow pointing at the trigger.
   * @default true
   */
  showArrow = input<boolean>(true);

  /**
   * Emitted when the popover opens or closes.
   */
  readonly openChange = output<boolean>();

  protected isOpen = signal(false);

  protected panelClasses = computed(() => {
    return [
      'popover__panel',
      `popover__panel--${this.position()}`,
      this.showArrow() ? 'popover__panel--arrow' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });

  private readonly elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen() && this.trigger() === 'click') {
      const el = this.elementRef.nativeElement as HTMLElement;
      if (!el.contains(event.target as Node)) {
        this.close();
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.close();
    }
  }

  ngOnDestroy(): void {
    // Cleanup handled by Angular
  }

  protected toggle(): void {
    this.isOpen() ? this.close() : this.open();
  }

  protected open(): void {
    this.isOpen.set(true);
    this.openChange.emit(true);
  }

  protected close(): void {
    this.isOpen.set(false);
    this.openChange.emit(false);
  }

  protected onMouseEnter(): void {
    if (this.trigger() === 'hover') {
      this.open();
    }
  }

  protected onMouseLeave(): void {
    if (this.trigger() === 'hover') {
      this.close();
    }
  }
}
