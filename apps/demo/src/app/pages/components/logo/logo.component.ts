import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent, CardComponent } from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-logo-demo',
  imports: [CommonModule, LogoComponent, CardComponent],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoDemoComponent {
  // Size examples
  protected readonly sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = [
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
  ];

  // Interactive playground
  protected playgroundVariant = signal<'full' | 'emblem'>('full');
  protected playgroundSize = signal<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  protected playgroundClickable = signal(false);
  protected playgroundAlt = signal('Life-Cockpit');

  protected copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(
      () => {
        console.log('Code copied to clipboard');
      },
      (err) => {
        console.error('Failed to copy code: ', err);
      },
    );
  }
}
