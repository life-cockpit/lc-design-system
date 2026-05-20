import { Component, input, computed, HostBinding, ChangeDetectionStrategy } from '@angular/core';

export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type SectionBackground = 'none' | 'gray' | 'primary' | 'secondary';

@Component({
  selector: 'lc-section',
  standalone: true,
  imports: [],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Section component for page content grouping with spacing and background.
 *
 * Features:
 * - Configurable vertical spacing (none, sm, md, lg, xl)
 * - Background color options (none, gray, primary, secondary)
 * - Independent horizontal and vertical padding control
 * - Density-aware: paddings come from `--lc-density-padding-*`, so a single
 *   `data-density` on an ancestor rescales every section on the page.
 * - No Tailwind dependency — styling lives in the component's own SCSS.
 *
 * @example
 * ```html
 * <lc-section spacing="lg" background="gray">Content</lc-section>
 * ```
 */
export class SectionComponent {
  spacing = input<SectionSpacing>('md');
  background = input<SectionBackground>('none');
  noPaddingX = input<boolean>(false);
  noPaddingY = input<boolean>(false);

  @HostBinding('class')
  get hostClasses(): string {
    return this.classes();
  }

  classes = computed(() => {
    const classes: string[] = ['lc-section'];

    classes.push(`section-spacing-${this.spacing()}`);
    classes.push(`section-bg-${this.background()}`);

    if (this.noPaddingX()) classes.push('section-no-padding-x');
    if (this.noPaddingY()) classes.push('section-no-padding-y');

    return classes.join(' ');
  });
}
