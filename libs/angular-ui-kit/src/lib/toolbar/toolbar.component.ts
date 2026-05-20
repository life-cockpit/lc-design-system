import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';

/**
 * Toolbar — a horizontal strip of controls with built-in density-aware spacing.
 *
 * Use for action bars above tables, on top of cards, inside drawers, or
 * anywhere a row of buttons / filters / titles needs consistent rhythm.
 *
 * The toolbar exposes three slots:
 *  - `[slot="start"]` — leading content (icon, title, primary filter)
 *  - default          — middle content (grows to fill remaining space)
 *  - `[slot="end"]`   — trailing actions (right-aligned)
 *
 * If only `[slot="start"]` and `[slot="end"]` are provided, the middle
 * automatically becomes a flexible spacer so actions push to the right.
 *
 * Padding, gap and divider styles are driven by `--lc-density-padding-*`
 * and `--lc-density-gap-*` tokens, so wrapping a `data-density` ancestor
 * automatically rescales the toolbar — no template changes needed.
 *
 * @example
 * ```html
 * <lc-toolbar>
 *   <h2 slot="start">Reports</h2>
 *   <lc-button slot="end" variant="secondary">Export</lc-button>
 *   <lc-button slot="end" variant="primary">New report</lc-button>
 * </lc-toolbar>
 * ```
 */
@Component({
  selector: 'lc-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'hostClasses()',
    role: 'toolbar',
  },
})
export class ToolbarComponent {
  /**
   * Visual density of the toolbar itself.
   * - `comfortable` — generous padding/gap (default for dashboards)
   * - `cosy`        — balanced padding/gap (default in chrome)
   * - `compact`     — tight, data-dense (tables, side panels)
   */
  density = input<'compact' | 'cosy' | 'comfortable'>('cosy');

  /**
   * Background variant.
   * - `transparent` — inherits parent background (default)
   * - `surface`     — subtle surface color (use when stacking on page bg)
   * - `muted`       — slightly stronger fill (use as a toolbar on a card)
   */
  background = input<'transparent' | 'surface' | 'muted'>('transparent');

  /**
   * Border placement.
   * - `none`   — no border (default)
   * - `bottom` — divider below the toolbar
   * - `top`    — divider above the toolbar
   * - `around` — full border
   */
  border = input<'none' | 'bottom' | 'top' | 'around'>('none');

  /**
   * Allow toolbar content to wrap onto multiple lines on small viewports.
   * @default true
   */
  wrap = input<boolean>(true);

  /**
   * Vertical alignment of toolbar children.
   * @default 'center'
   */
  align = input<'start' | 'center' | 'end' | 'stretch' | 'baseline'>('center');

  /**
   * Sticky behavior — pins the toolbar to the top of its scroll container.
   * @default false
   */
  sticky = input<boolean>(false);

  protected hostClasses = computed(() =>
    [
      'lc-toolbar',
      `lc-toolbar--density-${this.density()}`,
      `lc-toolbar--bg-${this.background()}`,
      `lc-toolbar--border-${this.border()}`,
      `lc-toolbar--align-${this.align()}`,
      this.wrap() ? 'lc-toolbar--wrap' : null,
      this.sticky() ? 'lc-toolbar--sticky' : null,
    ]
      .filter(Boolean)
      .join(' '),
  );
}
