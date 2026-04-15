import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  HostListener,
  computed,
} from '@angular/core';

/**
 * Card component for content grouping and hierarchy.
 *
 * @example
 * ```html
 * <lc-card title="Card Title" variant="elevated" padding="md">
 *   <p>Card body content</p>
 * </lc-card>
 * ```
 */
@Component({
  selector: 'lc-card',
  standalone: true,
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  /**
   * Optional title rendered as a styled header.
   * For complex headers (e.g. title + action button), use content projection instead.
   */
  title = input<string | undefined>(undefined);

  /**
   * Optional subtitle rendered below the title.
   */
  subtitle = input<string | undefined>(undefined);

  /**
   * Visual variant of the card
   * - elevated: Box shadow (default)
   * - outlined: Border only
   * - flat: No shadow or border
   * @default 'elevated'
   */
  variant = input<'elevated' | 'outlined' | 'flat'>('elevated');

  /**
   * Padding inside the card
   * @default 'md'
   */
  padding = input<'none' | 'xs' | 'sm' | 'md' | 'lg'>('md');

  /**
   * Whether the card is clickable (hover effects, cursor pointer)
   * @default false
   */
  clickable = input<boolean>(false);

  /**
   * Whether the card is selected (if clickable)
   * @default false
   */
  selected = input<boolean>(false);

  /**
   * Border radius size
   * @default 'md'
   */
  borderRadius = input<'none' | 'sm' | 'md' | 'lg' | 'full'>('md');

  /**
   * ARIA label for accessibility
   */
  ariaLabel = input<string | undefined>(undefined);

  /**
   * Emitted when card is clicked (if clickable)
   */
  readonly cardClick = output<MouseEvent>();

  /**
   * Compute card CSS classes based on inputs
   */
  protected cardClasses = computed(() => {
    const classes = [
      'card',
      `card-${this.variant()}`,
      `card-padding-${this.padding()}`,
      `card-radius-${this.borderRadius()}`,
    ];

    if (this.clickable()) {
      classes.push('card-clickable');
    }

    if (this.selected()) {
      classes.push('card-selected');
    }

    return classes.join(' ');
  });

  /**
   * Compute ARIA role based on clickable state
   */
  protected role = computed(() => (this.clickable() ? 'button' : 'article'));

  /**
   * Handle card click events
   */
  protected handleClick(event: MouseEvent): void {
    if (this.clickable()) {
      this.cardClick.emit(event);
    }
  }

  /**
   * Handle keyboard events for accessibility
   */
  @HostListener('keydown', ['$event'])
  protected handleKeydown(event: KeyboardEvent): void {
    if (this.clickable() && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      const mouseEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      });
      this.cardClick.emit(mouseEvent);
    }
  }
}
