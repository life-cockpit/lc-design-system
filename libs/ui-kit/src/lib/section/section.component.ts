import { Component, input, computed, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SectionSpacing = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type SectionBackground = 'none' | 'gray' | 'primary' | 'secondary';

@Component({
  selector: 'lc-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
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
    const classes: string[] = [];

    // Spacing
    const spacingClass = `section-spacing-${this.spacing()}`;
    classes.push(spacingClass);

    if (!this.noPaddingY()) {
      const spacingMap: Record<SectionSpacing, string> = {
        none: '',
        sm: 'py-8',
        md: 'py-12',
        lg: 'py-16',
        xl: 'py-24',
      };
      const paddingY = spacingMap[this.spacing()];
      if (paddingY) {
        classes.push(paddingY);
      }
    }

    // Background
    const backgroundClass = `section-bg-${this.background()}`;
    classes.push(backgroundClass);

    if (this.background() !== 'none') {
      const backgroundMap: Record<Exclude<SectionBackground, 'none'>, string> = {
        gray: 'bg-neutral-50',
        primary: 'bg-primary-50',
        secondary: 'bg-secondary-50',
      };
      classes.push(backgroundMap[this.background() as Exclude<SectionBackground, 'none'>]);
    }

    // Horizontal padding
    if (!this.noPaddingX()) {
      classes.push('px-4', 'sm:px-6', 'lg:px-8');
    }

    return classes.join(' ');
  });
}
