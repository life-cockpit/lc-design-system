import { Component } from '@angular/core';
import { ProgressBarComponent } from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-progress-bar-demo',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <h2>Progress Bar</h2>
    <section style="display: flex; flex-direction: column; gap: 24px; max-width: 480px;">
      <div>
        <h3>Linear</h3>
        <lc-progress-bar [value]="65" color="primary" size="md" [showLabel]="true"></lc-progress-bar>
      </div>
      <div>
        <h3>Colors</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <lc-progress-bar [value]="80" color="primary" [showLabel]="true"></lc-progress-bar>
          <lc-progress-bar [value]="60" color="success" [showLabel]="true"></lc-progress-bar>
          <lc-progress-bar [value]="40" color="warning" [showLabel]="true"></lc-progress-bar>
          <lc-progress-bar [value]="25" color="error" [showLabel]="true"></lc-progress-bar>
        </div>
      </div>
      <div>
        <h3>Indeterminate</h3>
        <lc-progress-bar [indeterminate]="true" color="primary" size="md"></lc-progress-bar>
      </div>
      <div>
        <h3>Circular</h3>
        <div style="display: flex; gap: 24px; align-items: center;">
          <lc-progress-bar [value]="75" variant="circular" size="sm" [showLabel]="true" color="primary"></lc-progress-bar>
          <lc-progress-bar [value]="50" variant="circular" size="md" [showLabel]="true" color="success"></lc-progress-bar>
          <lc-progress-bar [value]="90" variant="circular" size="lg" [showLabel]="true" color="info"></lc-progress-bar>
        </div>
      </div>
    </section>
  `,
})
export class ProgressBarDemoComponent {}
