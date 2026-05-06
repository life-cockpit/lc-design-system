import { Component } from '@angular/core';
import { SearchInputComponent } from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-search-input-demo',
  standalone: true,
  imports: [SearchInputComponent],
  template: `
    <h2>Search Input</h2>
    <section style="max-width: 400px; display: flex; flex-direction: column; gap: 24px;">
      <div>
        <h3>Default</h3>
        <lc-search-input placeholder="Search…" (searchChange)="onSearch($event)"></lc-search-input>
        <p style="font-size: 12px; color: #6b7280; margin-top: 8px;">Last search: {{ lastSearch }}</p>
      </div>
      <div>
        <h3>Sizes</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <lc-search-input size="sm" placeholder="Small"></lc-search-input>
          <lc-search-input size="md" placeholder="Medium"></lc-search-input>
          <lc-search-input size="lg" placeholder="Large"></lc-search-input>
        </div>
      </div>
      <div>
        <h3>Disabled</h3>
        <lc-search-input [disabled]="true" placeholder="Disabled"></lc-search-input>
      </div>
    </section>
  `,
})
export class SearchInputDemoComponent {
  lastSearch = '';

  onSearch(value: string): void {
    this.lastSearch = value;
  }
}
