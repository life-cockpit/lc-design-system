import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionComponent } from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule, AccordionComponent],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss',
})
export class AccordionPageComponent {
  // Playground state
  selectedVariant = signal<'outlined' | 'flat'>('outlined');
  selectedSize = signal<'sm' | 'md' | 'lg'>('md');
  isDisabled = signal(false);
  playgroundExpanded = signal(true);

  // Individual accordion states
  faqOne = signal(false);
  faqTwo = signal(false);
  faqThree = signal(false);

  setVariant(variant: 'outlined' | 'flat'): void {
    this.selectedVariant.set(variant);
  }

  setSize(size: 'sm' | 'md' | 'lg'): void {
    this.selectedSize.set(size);
  }

  toggleDisabled(): void {
    this.isDisabled.update((v) => !v);
  }
}
