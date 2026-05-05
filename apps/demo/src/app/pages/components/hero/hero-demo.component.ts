import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent, HeroColor, HeroSize } from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-hero-demo',
  standalone: true,
  imports: [CommonModule, HeroComponent],
  templateUrl: './hero-demo.component.html',
  styleUrl: './hero-demo.component.scss',
})
export class HeroDemoComponent {
  selectedColor = signal<HeroColor>('primary');
  selectedSize = signal<HeroSize>('md');
  selectedRadius = signal<'none' | 'sm' | 'md' | 'lg'>('lg');

  colors: HeroColor[] = [
    'primary',
    'secondary',
    'neutral',
    'success',
    'info',
    'warning',
    'accent-orange',
    'accent-purple',
    'accent-violet',
  ];

  sizes: HeroSize[] = ['sm', 'md', 'lg'];
  radii: ('none' | 'sm' | 'md' | 'lg')[] = ['none', 'sm', 'md', 'lg'];

  setColor(color: HeroColor): void {
    this.selectedColor.set(color);
  }

  setSize(size: HeroSize): void {
    this.selectedSize.set(size);
  }

  setRadius(radius: 'none' | 'sm' | 'md' | 'lg'): void {
    this.selectedRadius.set(radius);
  }
}
