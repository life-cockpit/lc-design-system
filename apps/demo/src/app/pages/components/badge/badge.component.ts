import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  BadgeComponent,
  type BadgeVariant,
  type BadgeSize,
  CardComponent,
  ButtonComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-badge-demo',
  imports: [CommonModule, BadgeComponent, CardComponent, ButtonComponent, TableComponent],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeDemoComponent {
  // Playground controls
  protected variant = signal<BadgeVariant>('default');
  protected size = signal<BadgeSize>('md');
  protected rounded = signal(false);
  protected content = signal('Badge');

  // Notification count
  protected notificationCount = signal(3);

  // Demo code examples
  protected basicExample = `<lc-badge>New</lc-badge>`;

  protected variantExample = `<lc-badge variant="primary">Primary</lc-badge>
<lc-badge variant="success">Success</lc-badge>
<lc-badge variant="warning">Warning</lc-badge>
<lc-badge variant="error">Error</lc-badge>
<lc-badge variant="info">Info</lc-badge>`;

  protected sizeExample = `<lc-badge size="xs">XS</lc-badge>
<lc-badge size="sm">SM</lc-badge>
<lc-badge size="md">MD</lc-badge>
<lc-badge size="lg">LG</lc-badge>`;

  protected roundedExample = `<lc-badge [rounded]="true">5</lc-badge>
<lc-badge variant="primary" [rounded]="true">99+</lc-badge>`;

  protected inlineExample = `<p class="text-base">
  Inbox <lc-badge variant="error" [rounded]="true">{{ notificationCount }}</lc-badge>
</p>`;

  protected buttonExample = `<lc-button>
  Messages <lc-badge variant="primary" [rounded]="true">{{ notificationCount }}</lc-badge>
</lc-button>`;

  // Interactive controls for playground
  protected incrementNotifications(): void {
    this.notificationCount.update((count) => count + 1);
  }

  protected resetNotifications(): void {
    this.notificationCount.set(0);
  }

  protected setVariant(variant: BadgeVariant): void {
    this.variant.set(variant);
  }

  protected setSize(size: BadgeSize): void {
    this.size.set(size);
  }

  protected toggleRounded(): void {
    this.rounded.update((v) => !v);
  }

  // Props API data for documentation table
  protected propsData = [
    {
      name: 'variant',
      type: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'",
      default: "'default'",
      description: 'Visual style variant',
    },
    {
      name: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the badge',
    },
    {
      name: 'rounded',
      type: 'boolean',
      default: 'false',
      description: 'Apply pill shape with fully rounded corners',
    },
  ];

  // API documentation table
  protected apiColumns = signal<TableColumn[]>([
    { key: 'name', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected apiData = signal([
    {
      name: 'variant',
      type: "'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'",
      default: "'default'",
      description: 'Visual style variant',
    },
    {
      name: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the badge',
    },
    {
      name: 'rounded',
      type: 'boolean',
      default: 'false',
      description: 'Apply pill shape with fully rounded corners',
    },
  ]);
}
