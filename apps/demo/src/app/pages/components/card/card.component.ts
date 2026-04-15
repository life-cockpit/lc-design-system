import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent, CheckboxComponent } from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, CheckboxComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardPageComponent {
  // Interactive playground state
  selectedVariant = signal<'elevated' | 'outlined' | 'flat'>('elevated');
  selectedPadding = signal<'none' | 'xs' | 'sm' | 'md' | 'lg'>('md');
  selectedRadius = signal<'none' | 'sm' | 'md' | 'lg' | 'full'>('md');
  isClickable = signal(false);
  isSelected = signal(false);

  clickCount = signal(0);

  handleCardClick(): void {
    this.clickCount.update((count) => count + 1);
    console.log('Card clicked!', this.clickCount());
  }

  setVariant(variant: 'elevated' | 'outlined' | 'flat'): void {
    this.selectedVariant.set(variant);
  }

  setPadding(padding: 'none' | 'xs' | 'sm' | 'md' | 'lg'): void {
    this.selectedPadding.set(padding);
  }

  setRadius(radius: 'none' | 'sm' | 'md' | 'lg' | 'full'): void {
    this.selectedRadius.set(radius);
  }

  toggleClickable(): void {
    this.isClickable.update((val) => !val);
  }

  toggleSelected(): void {
    this.isSelected.update((val) => !val);
  }
}
