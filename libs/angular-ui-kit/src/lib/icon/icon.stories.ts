import type { Meta, StoryObj } from '@storybook/angular';
import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from './icon.component';

const ALL_ICONS = [
  'academic-cap','adjustments-horizontal','adjustments-vertical','archive-box-arrow-down','archive-box-x-mark','archive-box',
  'arrow-down-circle','arrow-down-left','arrow-down-on-square-stack','arrow-down-on-square','arrow-down-right','arrow-down-tray','arrow-down',
  'arrow-left-circle','arrow-left-end-on-rectangle','arrow-left-on-rectangle','arrow-left-start-on-rectangle','arrow-left',
  'arrow-long-down','arrow-long-left','arrow-long-right','arrow-long-up',
  'arrow-path-rounded-square','arrow-path',
  'arrow-right-circle','arrow-right-end-on-rectangle','arrow-right-on-rectangle','arrow-right-start-on-rectangle','arrow-right',
  'arrow-small-down','arrow-small-left','arrow-small-right','arrow-small-up',
  'arrow-top-right-on-square','arrow-trending-down','arrow-trending-up',
  'arrow-turn-down-left','arrow-turn-down-right','arrow-turn-left-down','arrow-turn-left-up','arrow-turn-right-down','arrow-turn-right-up','arrow-turn-up-left','arrow-turn-up-right',
  'arrow-up-circle','arrow-up-left','arrow-up-on-square-stack','arrow-up-on-square','arrow-up-right','arrow-up-tray','arrow-up',
  'arrow-uturn-down','arrow-uturn-left','arrow-uturn-right','arrow-uturn-up',
  'arrows-pointing-in','arrows-pointing-out','arrows-right-left','arrows-up-down',
  'at-symbol','backspace','backward','banknotes',
  'bars-2','bars-3-bottom-left','bars-3-bottom-right','bars-3-center-left','bars-3','bars-4','bars-arrow-down','bars-arrow-up',
  'battery-0','battery-100','battery-50','beaker',
  'bell-alert','bell-slash','bell-snooze','bell',
  'bold','bolt-slash','bolt','book-open',
  'bookmark-slash','bookmark-square','bookmark','briefcase','bug-ant',
  'building-library','building-office-2','building-office','building-storefront',
  'cake','calculator','calendar-date-range','calendar-days','calendar','camera',
  'chart-bar-square','chart-bar','chart-pie',
  'chat-bubble-bottom-center-text','chat-bubble-bottom-center','chat-bubble-left-ellipsis','chat-bubble-left-right','chat-bubble-left','chat-bubble-oval-left-ellipsis','chat-bubble-oval-left',
  'check-badge','check-circle','check',
  'chevron-double-down','chevron-double-left','chevron-double-right','chevron-double-up','chevron-down','chevron-left','chevron-right','chevron-up-down','chevron-up',
  'circle-stack','clipboard-document-check','clipboard-document-list','clipboard-document','clipboard','clock',
  'cloud-arrow-down','cloud-arrow-up','cloud',
  'code-bracket-square','code-bracket','cog-6-tooth','cog-8-tooth','cog','command-line','computer-desktop','cpu-chip','credit-card',
  'cube-transparent','cube','currency-bangladeshi','currency-dollar','currency-euro','currency-pound','currency-rupee','currency-yen',
  'cursor-arrow-rays','cursor-arrow-ripple',
  'device-phone-mobile','device-tablet','divide',
  'document-arrow-down','document-arrow-up','document-chart-bar','document-check','document-currency-bangladeshi','document-currency-dollar','document-currency-euro','document-currency-pound','document-currency-rupee','document-currency-yen','document-duplicate','document-magnifying-glass','document-minus','document-plus','document-text','document',
  'ellipsis-horizontal-circle','ellipsis-horizontal','ellipsis-vertical',
  'envelope-open','envelope','equals',
  'exclamation-circle','exclamation-triangle',
  'eye-dropper','eye-slash','eye',
  'face-frown','face-smile','film','finger-print','fire','flag',
  'folder-arrow-down','folder-minus','folder-open','folder-plus','folder',
  'forward','funnel','gif','gift-top','gift',
  'globe-alt','globe-americas','globe-asia-australia','globe-europe-africa',
  'h1','h2','h3','hand-raised','hand-thumb-down','hand-thumb-up','hashtag','heart',
  'home-modern','home','identification',
  'inbox-arrow-down','inbox-stack','inbox','information-circle','italic',
  'key','language','lifebuoy','light-bulb','link-slash','link','list-bullet',
  'lock-closed','lock-open',
  'magnifying-glass-circle','magnifying-glass-minus','magnifying-glass-plus','magnifying-glass',
  'map-pin','map','megaphone','microphone',
  'minus-circle','minus-small','minus','moon','musical-note','newspaper','no-symbol','numbered-list',
  'paint-brush','paper-airplane','paper-clip','pause-circle','pause',
  'pencil-square','pencil','percent-badge',
  'phone-arrow-down-left','phone-arrow-up-right','phone-x-mark','phone','photo',
  'play-circle','play-pause','play','plus-circle','plus-small','plus','power',
  'presentation-chart-bar','presentation-chart-line','printer','puzzle-piece',
  'qr-code','question-mark-circle','queue-list','radio',
  'receipt-percent','receipt-refund','rectangle-group','rectangle-stack','rocket-launch','rss',
  'scale','scissors','server-stack','server','share',
  'shield-check','shield-exclamation','shopping-bag','shopping-cart',
  'signal-slash','signal','slash','sparkles','speaker-wave','speaker-x-mark',
  'square-2-stack','square-3-stack-3d','squares-2x2','squares-plus',
  'star','stop-circle','stop','strikethrough','sun','swatch',
  'table-cells','tag','ticket','trash','trophy','truck','tv',
  'underline','user-circle','user-group','user-minus','user-plus','user','users',
  'variable','video-camera-slash','video-camera','view-columns','viewfinder-circle',
  'wallet','wifi','window','wrench-screwdriver','wrench','x-circle','x-mark',
];

@Component({
  selector: 'icon-gallery',
  standalone: true,
  imports: [IconComponent, FormsModule],
  template: `
    <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
      <input
        type="text"
        [ngModel]="search()"
        (ngModelChange)="search.set($event)"
        placeholder="Search icons…"
        style="padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 6px; font-size: 14px; width: 260px; outline: none;"
      />
      <span style="font-size: 13px; color: #6B7280;">
        {{ filtered().length }} of {{ icons.length }} icons
      </span>
      <label style="font-size: 13px; color: #6B7280; display: flex; align-items: center; gap: 4px; margin-left: auto;">
        <input type="checkbox" [ngModel]="showSolid()" (ngModelChange)="showSolid.set($event)" />
        Solid
      </label>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 4px;">
      @for (icon of filtered(); track icon) {
        <div
          style="display: flex; flex-direction: column; align-items: center; padding: 12px 4px; border-radius: 8px; cursor: pointer; transition: background 0.15s;"
          (mouseenter)="$event.currentTarget.style.background='#F3F4F6'"
          (mouseleave)="$event.currentTarget.style.background='transparent'"
          (click)="copyName(icon)"
          [title]="'Click to copy: ' + icon"
        >
          <lc-icon [name]="icon" [variant]="showSolid() ? 'solid' : 'outline'" size="md"></lc-icon>
          <span style="font-size: 10px; color: #6B7280; margin-top: 6px; text-align: center; word-break: break-all; line-height: 1.3;">{{ icon }}</span>
        </div>
      }
    </div>
    @if (filtered().length === 0) {
      <div style="text-align: center; padding: 48px 0; color: #9CA3AF;">
        No icons match "{{ search() }}"
      </div>
    }
  `,
})
class IconGalleryComponent {
  readonly icons = ALL_ICONS;
  readonly search = signal('');
  readonly showSolid = signal(false);
  readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    return q ? this.icons.filter(n => n.includes(q)) : this.icons;
  });

  copyName(name: string) {
    navigator.clipboard.writeText(name);
  }
}

/**
 * Icons are SVG-based visual symbols from the Tabler Icons library.
 * This story keeps a preset icon list and supports outline plus solid (filled) variants.
 * Use them in buttons, navigation, lists, and status indicators.
 *
 * Usage: `<lc-icon name="home" variant="outline" size="md" />`
 */
const meta: Meta<IconComponent> = {
  title: 'Components/Icon',
  component: IconComponent,
  argTypes: {
    name: { description: 'Icon name from the Tabler set (e.g. "home", "user", "settings")' },
    variant: {
      control: 'select',
      options: ['outline', 'solid'],
      description: 'Outline has stroked paths, solid maps to filled icons',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Icon dimensions — xs: 16px, sm: 20px, md: 24px, lg: 32px, xl: 40px',
    },
    color: { description: 'CSS color value (default: currentColor, inherits text color)' },
    ariaLabel: { description: 'Accessible label for screen readers (omit for decorative icons)' },
    decorative: { description: 'If true, icon is hidden from screen readers (aria-hidden)' },
  },

  parameters: {
    docs: {
      description: {
        component: `
Icon component - Tabler Icons wrapper for displaying SVG icons

**Key Features:**
- Signal-based reactive API
- Support for outline and solid variants
- Multiple size options (xs, sm, md, lg, xl)
- Custom color support (CSS colors, variables)
- Accessibility attributes (ARIA labels, decorative icons)
- Dynamic SVG loading from Tabler Icons
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<IconComponent>;

export const Default: Story = {
  args: { name: 'home', variant: 'outline', size: 'md' },
};

export const Solid: Story = {
  args: { name: 'heart', variant: 'solid', size: 'md', color: '#ef4444' },
};

export const Sizes: Story = {
  name: 'Size Comparison',
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 24px;">
        <div style="text-align: center;">
          <lc-icon name="star" size="xs"></lc-icon>
          <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">xs · 16px</div>
        </div>
        <div style="text-align: center;">
          <lc-icon name="star" size="sm"></lc-icon>
          <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">sm · 20px</div>
        </div>
        <div style="text-align: center;">
          <lc-icon name="star" size="md"></lc-icon>
          <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">md · 24px</div>
        </div>
        <div style="text-align: center;">
          <lc-icon name="star" size="lg"></lc-icon>
          <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">lg · 32px</div>
        </div>
        <div style="text-align: center;">
          <lc-icon name="star" size="xl"></lc-icon>
          <div style="font-size: 11px; color: #6B7280; margin-top: 4px;">xl · 40px</div>
        </div>
      </div>`,
  }),
};

export const OutlineVsSolid: Story = {
  name: 'Outline vs Solid',
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: auto auto auto; gap: 16px 32px; align-items: center;">
        <div style="font-size: 12px; color: #6B7280; font-weight: 600;">Icon</div>
        <div style="font-size: 12px; color: #6B7280; font-weight: 600;">Outline</div>
        <div style="font-size: 12px; color: #6B7280; font-weight: 600;">Solid</div>
        <span style="font-size: 13px;">Heart</span>
        <lc-icon name="heart" variant="outline" size="md"></lc-icon>
        <lc-icon name="heart" variant="solid" size="md" color="#ef4444"></lc-icon>
        <span style="font-size: 13px;">Star</span>
        <lc-icon name="star" variant="outline" size="md"></lc-icon>
        <lc-icon name="star" variant="solid" size="md" color="#f59e0b"></lc-icon>
        <span style="font-size: 13px;">Check Circle</span>
        <lc-icon name="check-circle" variant="outline" size="md"></lc-icon>
        <lc-icon name="check-circle" variant="solid" size="md" color="#22c55e"></lc-icon>
        <span style="font-size: 13px;">Bell</span>
        <lc-icon name="bell" variant="outline" size="md"></lc-icon>
        <lc-icon name="bell" variant="solid" size="md" color="#6366f1"></lc-icon>
        <span style="font-size: 13px;">Shield</span>
        <lc-icon name="shield-check" variant="outline" size="md"></lc-icon>
        <lc-icon name="shield-check" variant="solid" size="md" color="#208497"></lc-icon>
      </div>`,
  }),
};

export const CustomColors: Story = {
  name: 'Custom Colors',
  render: () => ({
    template: `
      <div style="display: flex; gap: 16px; align-items: center;">
        <lc-icon name="check-circle" variant="solid" size="lg" color="#8EA475"></lc-icon>
        <lc-icon name="exclamation-triangle" variant="solid" size="lg" color="#E1A040"></lc-icon>
        <lc-icon name="x-circle" variant="solid" size="lg" color="#9D0E0E"></lc-icon>
        <lc-icon name="information-circle" variant="solid" size="lg" color="#208497"></lc-icon>
      </div>`,
  }),
};

/** Browse the preset icon list. Click an icon to copy its name. Use the search field to filter. */
export const AllIcons: Story = {
  name: 'All Icons (Preset)',
  render: () => ({
    moduleMetadata: { imports: [IconGalleryComponent] },
    template: `<icon-gallery></icon-gallery>`,
  }),
};
