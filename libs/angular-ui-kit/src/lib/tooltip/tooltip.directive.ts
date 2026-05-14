import {
  Directive,
  input,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewContainerRef,
  ComponentRef,
  HostListener,
  Component,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { Overlay, OverlayRef, ConnectedPosition } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Internal tooltip content component
 */
@Component({
  selector: 'lc-tooltip-content',
  standalone: true,
  imports: [],
  template: `<div class="lc-tooltip-inner">{{ content }}</div>`,
  styles: [
    `
      :host {
        display: block;
        background-color: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        max-width: 300px;
        word-wrap: break-word;
        box-shadow:
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }

      .lc-tooltip-inner {
        position: relative;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'lc-tooltip',
    role: 'tooltip',
  },
})
export class TooltipContentComponent {
  content = '';
}

/**
 * Tooltip directive for displaying contextual information.
 * Uses Angular CDK Overlay for positioning.
 *
 * @example
 * ```html
 * <button lcTooltip="Click me!" tooltipPosition="top">
 *   Hover or focus
 * </button>
 * ```
 */
@Directive({
  selector: '[lcTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  /**
   * Tooltip content text
   */
  lcTooltip = input.required<string>();

  /**
   * Tooltip position
   * @default 'top'
   */
  tooltipPosition = input<TooltipPosition>('top');

  /**
   * Show delay in milliseconds
   * @default 0
   */
  tooltipShowDelay = input<number>(0);

  /**
   * Hide delay in milliseconds
   * @default 0
   */
  tooltipHideDelay = input<number>(0);

  /**
   * Whether tooltip is disabled
   * @default false
   */
  tooltipDisabled = input<boolean>(false);

  private overlayRef?: OverlayRef;
  private tooltipRef?: ComponentRef<TooltipContentComponent>;
  private showTimeout?: number;
  private hideTimeout?: number;
  private tooltipId?: string;

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly renderer = inject(Renderer2);

  ngOnDestroy(): void {
    this.hide();
    this.cleanup();
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.showWithDelay();
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hideWithDelay();
  }

  @HostListener('focus')
  onFocus(): void {
    this.showWithDelay();
  }

  @HostListener('blur')
  onBlur(): void {
    this.hideWithDelay();
  }

  /**
   * Show tooltip programmatically
   */
  show(): void {
    if (this.tooltipDisabled() || !this.lcTooltip()) {
      return;
    }

    this.clearTimeouts();

    if (!this.overlayRef) {
      this.createOverlay();
    }

    if (!this.tooltipRef && this.overlayRef) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const portal = new ComponentPortal(TooltipContentComponent, this.viewContainerRef);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.tooltipRef = this.overlayRef.attach(portal) as ComponentRef<TooltipContentComponent>;
      this.tooltipRef.instance.content = this.lcTooltip();

      // Add position class to tooltip component
      const tooltipEl = this.tooltipRef.location.nativeElement as HTMLElement;
      this.renderer.addClass(tooltipEl, `lc-tooltip--${this.tooltipPosition()}`);

      // Generate unique ID for ARIA
      this.tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
      this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-describedby', this.tooltipId);
    }
  }

  /**
   * Hide tooltip programmatically
   */
  hide(): void {
    this.clearTimeouts();

    if (this.tooltipRef) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.tooltipRef.destroy();
      this.tooltipRef = undefined;
    }

    if (this.overlayRef) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.overlayRef.detach();
    }

    if (this.tooltipId) {
      this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-describedby');
      this.tooltipId = undefined;
    }
  }

  /**
   * Toggle tooltip visibility
   */
  toggle(): void {
    if (this.tooltipRef) {
      this.hide();
    } else {
      this.show();
    }
  }

  private showWithDelay(): void {
    this.clearTimeouts();
    const delay = this.tooltipShowDelay();

    if (delay > 0) {
      this.showTimeout = window.setTimeout(() => this.show(), delay);
    } else {
      this.show();
    }
  }

  private hideWithDelay(): void {
    this.clearTimeouts();
    const delay = this.tooltipHideDelay();

    if (delay > 0) {
      this.hideTimeout = window.setTimeout(() => this.hide(), delay);
    } else {
      this.hide();
    }
  }

  private createOverlay(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const positionStrategy = this.overlay
      .position()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      .flexibleConnectedTo(this.elementRef)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      .withPositions(this.getPositions());

    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: `lc-tooltip--${this.tooltipPosition()}`,
    }) as OverlayRef;
    /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
  }

  private getPositions(): ConnectedPosition[] {
    const position = this.tooltipPosition();
    const positions: Record<TooltipPosition, ConnectedPosition> = {
      top: {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -8,
      },
      bottom: {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 8,
      },
      left: {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: -8,
      },
      right: {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: 8,
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return [positions[position]];
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      window.clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
    if (this.hideTimeout) {
      window.clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }

  private cleanup(): void {
    this.clearTimeouts();
    if (this.overlayRef) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.overlayRef.dispose();
      this.overlayRef = undefined;
    }
  }
}
