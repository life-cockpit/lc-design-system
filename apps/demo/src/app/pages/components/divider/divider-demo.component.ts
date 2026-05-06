import { Component } from '@angular/core';
import { DividerComponent } from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-divider-demo',
  standalone: true,
  imports: [DividerComponent],
  template: `
    <h2>Divider</h2>
    <section style="max-width: 480px;">
      <h3>Default</h3>
      <p>Content above</p>
      <lc-divider></lc-divider>
      <p>Content below</p>

      <h3>With Label</h3>
      <lc-divider label="OR" spacing="lg"></lc-divider>

      <h3>Variants</h3>
      <lc-divider variant="solid" spacing="sm"></lc-divider>
      <lc-divider variant="dashed" spacing="sm"></lc-divider>
      <lc-divider variant="dotted" spacing="sm"></lc-divider>

      <h3>Vertical</h3>
      <div style="display: flex; align-items: center; height: 40px;">
        <span>Home</span>
        <lc-divider orientation="vertical" spacing="md"></lc-divider>
        <span>About</span>
        <lc-divider orientation="vertical" spacing="md"></lc-divider>
        <span>Contact</span>
      </div>
    </section>
  `,
})
export class DividerDemoComponent {}
