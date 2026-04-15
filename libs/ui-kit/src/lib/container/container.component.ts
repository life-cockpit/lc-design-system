import { Component, input, computed, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'lc-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {
  size = input<ContainerSize>('lg');
  noPadding = input<boolean>(false);
  paddingY = input<boolean>(false);

  @HostBinding('class')
  get hostClasses(): string {
    return this.classes();
  }

  classes = computed(() => {
    const classes: string[] = ['mx-auto'];

    // Semantic size class
    classes.push(`container-${this.size()}`);

    // Size/Max-width
    if (this.size() !== 'full') {
      const sizeMap: Record<Exclude<ContainerSize, 'full'>, string> = {
        sm: 'max-w-screen-sm',
        md: 'max-w-screen-md',
        lg: 'max-w-screen-lg',
        xl: 'max-w-screen-xl',
      };
      classes.push(sizeMap[this.size() as Exclude<ContainerSize, 'full'>]);
    }

    // Padding
    if (!this.noPadding()) {
      classes.push('px-4', 'sm:px-6', 'lg:px-8');

      if (this.paddingY()) {
        classes.push('py-6');
      }
    }

    return classes.join(' ');
  });
}
