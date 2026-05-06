import { Component, input, computed, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type StackDirection = 'vertical' | 'horizontal';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

@Component({
  selector: 'lc-stack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Stack component for flexbox-based layout composition.
 *
 * Features:
 * - Vertical and horizontal direction
 * - Configurable gap spacing (none, xs, sm, md, lg, xl)
 * - Alignment and justification options
 * - Optional wrapping and full-width modes
 * - Content projection via ng-content
 *
 * @example
 * ```html
 * <lc-stack direction="horizontal" gap="md" align="center">content</lc-stack>
 * ```
 */
export class StackComponent {
  direction = input<StackDirection>('vertical');
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
    const classes: string[] = ['flex'];

    // Semantic direction class
    classes.push(`stack-${this.direction()}`);

    // Direction
    if (this.direction() === 'horizontal') {
      classes.push('flex-row');
    } else {
      classes.push('flex-col');
    }

    // Semantic gap class
    classes.push(`stack-gap-${this.gap()}`);

    // Gap
    const gapMap: Record<StackGap, string> = {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    };
    classes.push(gapMap[this.gap()]);

    // Alignment
    const alignMap: Record<StackAlign, string> = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    };
    classes.push(alignMap[this.align()]);

    // Justification
    const justifyMap: Record<StackJustify, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };
    classes.push(justifyMap[this.justify()]);

    // Wrap
    if (this.wrap()) {
      classes.push('flex-wrap');
    }

    // Full width
    if (this.fullWidth()) {
      classes.push('w-full');
    }

    return classes.join(' ');
  });
}
