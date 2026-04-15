import { Component } from '@angular/core';
import { LayoutComponent } from './layout/layout/layout.component';

@Component({
  imports: [LayoutComponent],
  selector: 'app-root',
  template: '<app-layout />',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'design-system-demo';
}
