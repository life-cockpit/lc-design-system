import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonComponent,
  CardComponent,
  CheckboxComponent,
  IconComponent,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CardComponent,
    CheckboxComponent,
    IconComponent,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonPageComponent {
  loading = signal(false);
  disabled = signal(false);

  handleClick(): void {
    console.log('Button clicked!');
  }

  simulateLoading(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.loading.set(false);
    }, 2000);
  }

  toggleDisabled(): void {
    this.disabled.update((val) => !val);
  }

  toggleLoading(): void {
    this.loading.update((val) => !val);
  }
}
