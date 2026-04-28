import { Component } from '@angular/core';
import { TabsComponent, TabComponent } from '@life-cockpit/angular-ui-kit';

/**
 * Tabs Demo Page
 *
 * Demonstrates all features of the Tabs component
 */
@Component({
  selector: 'app-tabs-demo',
  standalone: true,
  imports: [TabsComponent, TabComponent],
  templateUrl: './tabs-demo.component.html',
  styleUrl: './tabs-demo.component.scss',
})
export class TabsDemoComponent {}
