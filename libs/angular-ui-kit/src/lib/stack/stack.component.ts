import { Component, input, computed, HostBinding, ChangeDetectionStrategy } from '@angular/core';

export type StackDirection = 'vertical' | 'horizontal';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

@Component({
  selector: 'lc-stack',
  standalone: true,
  imports: [],
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Stack component for flexbox-based layout composition.
 *
 * Features:
 * - Vertical and horizontal direction
 * - Configurable gap spacing (none, xs, sm, md, lg, xl) — defaults to `md`
 * - Density-aware: when any ancestor sets `data-density="compact|cosy|comfortable"`,
 *   the gap is driven by the `--lc-density-gap-*` tokens, so one attribute
 *   on the page root rescales the rhythm of every Stack inside.
 * - Alignment and justification options
 * - Optional wrapping and full-width modes
 * - Content projection via ng-content
 *
 * @example
 * ```html
 * <!-- Single setting on the page root rescales all stacks below -->
 * <main data-density="compact">
 *   <lc-stack gap="md">…</lc-stack>
 * </main>
 * ```
 */
export class StackComponent {
  direction = input<StackDirection>('vertical');
  /** Spacing between children. Maps to `--lc-density-gap-*` when an ancestor sets `data-density`. */
  gap = input<StackGap>('md');
  align = input<StackAlign>('stretch');
  justify = input<StackJustify>('start');
  wrap = input<boolean>(false);
  fullWidth = input<boolean>(false);

  @HostBinding('class')
  get hostClasses(): string {
    return this.classes();
  }

  classes = computed(() => {
    const classes: string[] = ['lc-stack'];

    // Semantic direction class
    classes.push(`stack-${this.direction()}`);
    classes.push(`stack-direction-${this.direction()}`);

    // Semantic gap class — drives density via [data-density] ancestor
    classes.push(`stack-gap-${this.gap()}`);

    // Alignment
    classes.push(`stack-align-${this.align()}`);

    // Justification
    classes.push(`stack-justify-${this.justify()}`);

    if (this.wrap()) {
      classes.push('stack-wrap');
    }

    if (this.fullWidth()) {
      classes.push('stack-full-width');
    }

    return classes.join(' ');
  });
}
