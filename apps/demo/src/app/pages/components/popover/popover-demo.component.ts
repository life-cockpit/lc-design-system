import { Component } from '@angular/core';
import { PopoverComponent } from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-popover-demo',
  standalone: true,
  imports: [PopoverComponent],
  template: `
    <h2>Popover</h2>
    <section style="display: flex; flex-direction: column; gap: 48px; padding: 60px 0;">
      <div>
        <h3>Click Trigger</h3>
        <lc-popover position="bottom">
          <button popover-trigger style="padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 6px; background: white; cursor: pointer;">
            Open Menu
          </button>
          <div popover-content style="padding: 8px 0;">
            <div style="padding: 6px 16px; cursor: pointer;">Edit</div>
            <div style="padding: 6px 16px; cursor: pointer;">Duplicate</div>
            <div style="padding: 6px 16px; cursor: pointer; color: #9d0e0e;">Delete</div>
          </div>
        </lc-popover>
      </div>

      <div>
        <h3>Hover Trigger</h3>
        <lc-popover position="bottom" trigger="hover">
          <span popover-trigger style="text-decoration: underline; cursor: help; color: #208497;">
            Hover me for details
          </span>
          <div popover-content>
            <p style="margin: 0; font-size: 14px;">This popover appears on hover.</p>
          </div>
        </lc-popover>
      </div>

      <div>
        <h3>Positions</h3>
        <div style="display: flex; gap: 40px; flex-wrap: wrap;">
          <lc-popover position="top"><button popover-trigger style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer;">Top</button><div popover-content><p style="margin: 0;">Top content</p></div></lc-popover>
          <lc-popover position="bottom"><button popover-trigger style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer;">Bottom</button><div popover-content><p style="margin: 0;">Bottom content</p></div></lc-popover>
          <lc-popover position="left"><button popover-trigger style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer;">Left</button><div popover-content><p style="margin: 0;">Left content</p></div></lc-popover>
          <lc-popover position="right"><button popover-trigger style="padding: 6px 12px; border: 1px solid #d1d5db; border-radius: 4px; background: white; cursor: pointer;">Right</button><div popover-content><p style="margin: 0;">Right content</p></div></lc-popover>
        </div>
      </div>
    </section>
  `,
})
export class PopoverDemoComponent {}
