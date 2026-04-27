import { Component } from '@angular/core';
import { LayoutComponent } from './layout/layout/layout.component';

@Component({
  imports: [LayoutComponent],
  selector: 'lc-root',
  template: '<app-layout />',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'design-system-demo';
}
