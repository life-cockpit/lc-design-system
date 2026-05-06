import {
  Component,
  ChangeDetectionStrategy,
  input,
  model,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

/**
 * Accordion component for collapsible content sections.
 *
 * Features:
 * - Expandable/collapsible content panels
 * - Two-way binding for expanded state
 * - Animated expand/collapse transitions
 * - Content projection for custom body content
 * - Accessible with keyboard support
 *
 * @example
 * ```html
 * <lc-accordion title="Section Title" [(expanded)]="isOpen">
 *   <p>Collapsible content here</p>
 * </lc-accordion>
 * ```
 */
@Component({
  selector: 'lc-accordion',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccordionComponent {
  /** Title displayed in the accordion header */
  readonly title = input.required<string>();

  /** Whether the accordion is expanded (two-way binding) */
  readonly expanded = model<boolean>(false);

  /** Visual variant */
  readonly variant = input<'outlined' | 'flat'>('outlined');

  /** Size of the header */
  readonly size = input<'sm' | 'md' | 'lg'>('md');

  /** Whether the accordion is disabled */
  readonly disabled = input<boolean>(false);

  /** Computed CSS classes */
  protected accordionClasses = computed(() => {
    const classes = ['lc-accordion', `lc-accordion--${this.variant()}`, `lc-accordion--${this.size()}`];
    if (this.expanded()) classes.push('lc-accordion--expanded');
    if (this.disabled()) classes.push('lc-accordion--disabled');
    return classes.join(' ');
  });

  /** Toggle expanded state */
  protected toggle(): void {
    if (!this.disabled()) {
      this.expanded.update((v) => !v);
    }
  }

  /** Handle keyboard events for accessibility */
  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }
}
