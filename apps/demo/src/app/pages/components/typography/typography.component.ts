import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TypographyComponent, CheckboxComponent } from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-typography',
  standalone: true,
  imports: [CommonModule, FormsModule, TypographyComponent, CheckboxComponent],
  templateUrl: './typography.component.html',
  styleUrl: './typography.component.scss',
})
export class TypographyPageComponent {
  // Interactive playground state
  selectedVariant = signal<
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'body2'
    | 'subtitle1'
    | 'subtitle2'
    | 'caption'
    | 'overline'
  >('body1');
  selectedAlign = signal<'left' | 'center' | 'right' | 'justify'>('left');
  selectedColor = signal<
    'primary' | 'secondary' | 'disabled' | 'error' | 'success' | 'warning' | 'info'
  >('primary');
  selectedWeight = signal<'regular' | 'medium' | 'semibold' | 'bold'>('regular');
  selectedTransform = signal<'none' | 'uppercase' | 'lowercase' | 'capitalize'>('none');
  isNoWrap = signal(false);
  selectedLineClamp = signal<number | undefined>(undefined);
  isGutterBottom = signal(false);

  playgroundText = signal(
    'The quick brown fox jumps over the lazy dog. This is sample text to demonstrate typography variants and styling options.',
  );

  // Options for dropdowns
  readonly variantOptions = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'body1',
    'body2',
    'subtitle1',
    'subtitle2',
    'caption',
    'overline',
  ] as const;
  readonly alignOptions = ['left', 'center', 'right', 'justify'] as const;
  readonly colorOptions = [
    'primary',
    'secondary',
    'disabled',
    'error',
    'success',
    'warning',
    'info',
  ] as const;
  readonly weightOptions = ['regular', 'medium', 'semibold', 'bold'] as const;
  readonly transformOptions = ['none', 'uppercase', 'lowercase', 'capitalize'] as const;
  readonly lineClampOptions = [undefined, 1, 2, 3, 4] as const;

  setVariant(
    variant:
      | 'h1'
      | 'h2'
      | 'h3'
      | 'h4'
      | 'h5'
      | 'h6'
      | 'body1'
      | 'body2'
      | 'subtitle1'
      | 'subtitle2'
      | 'caption'
      | 'overline',
  ): void {
    this.selectedVariant.set(variant);
  }

  setAlign(align: 'left' | 'center' | 'right' | 'justify'): void {
    this.selectedAlign.set(align);
  }

  setColor(
    color: 'primary' | 'secondary' | 'disabled' | 'error' | 'success' | 'warning' | 'info',
  ): void {
    this.selectedColor.set(color);
  }

  setWeight(weight: 'regular' | 'medium' | 'semibold' | 'bold'): void {
    this.selectedWeight.set(weight);
  }

  setTransform(transform: 'none' | 'uppercase' | 'lowercase' | 'capitalize'): void {
    this.selectedTransform.set(transform);
  }

  toggleNoWrap(): void {
    this.isNoWrap.update((val) => !val);
  }

  setLineClamp(value: number | undefined): void {
    this.selectedLineClamp.set(value);
  }

  toggleGutterBottom(): void {
    this.isGutterBottom.update((val) => !val);
  }
}
