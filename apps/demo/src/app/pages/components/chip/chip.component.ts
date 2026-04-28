import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChipComponent,
  type ChipVariant,
  type ChipSize,
  CardComponent,
  ButtonComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-chip-demo',
  imports: [CommonModule, ChipComponent, CardComponent, ButtonComponent, TableComponent],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.scss',
})
export class ChipDemoComponent {
  // Playground controls
  protected variant = signal<ChipVariant>('default');
  protected size = signal<ChipSize>('md');
  protected removable = signal(true);
  protected disabled = signal(false);
  protected withIcon = signal(false);
  protected content = signal('Chip');

  // Tags for removable demo
  protected tags = signal<string[]>(['Design', 'Development', 'Marketing', 'Sales', 'Support']);

  // Demo code examples
  protected basicExample = `<lc-chip>Tag</lc-chip>`;

  protected variantExample = `<lc-chip variant="default">Default</lc-chip>
<lc-chip variant="primary">Primary</lc-chip>
<lc-chip variant="success">Success</lc-chip>
<lc-chip variant="warning">Warning</lc-chip>
<lc-chip variant="error">Error</lc-chip>
<lc-chip variant="info">Info</lc-chip>`;

  protected sizeExample = `<lc-chip size="sm">Small</lc-chip>
<lc-chip size="md">Medium</lc-chip>
<lc-chip size="lg">Large</lc-chip>`;

  protected removableExample = `<lc-chip [removable]="true" (remove)="onRemove()">
  Removable Tag
</lc-chip>`;

  protected iconExample = `<lc-chip variant="primary" icon="tag">
  With Icon
</lc-chip>`;

  protected disabledExample = `<lc-chip [disabled]="true">Disabled</lc-chip>
<lc-chip [removable]="true" [disabled]="true">Disabled Removable</lc-chip>`;

  protected tagsExample = `@for (tag of tags(); track tag) {
  <lc-chip 
    variant="primary" 
    [removable]="true" 
    (remove)="removeTag(tag)"
  >
    {{ tag }}
  </lc-chip>
}`;

  // Interactive controls for playground
  protected setVariant(variant: ChipVariant): void {
    this.variant.set(variant);
  }

  protected setSize(size: ChipSize): void {
    this.size.set(size);
  }

  protected toggleRemovable(): void {
    this.removable.update((v) => !v);
  }

  protected toggleDisabled(): void {
    this.disabled.update((v) => !v);
  }

  protected toggleIcon(): void {
    this.withIcon.update((v) => !v);
  }

  protected handleRemove(): void {
    console.log('Chip removed!');
  }

  protected removeTag(tag: string): void {
    this.tags.update((tags) => tags.filter((t) => t !== tag));
  }

  protected resetTags(): void {
    this.tags.set(['Design', 'Development', 'Marketing', 'Sales', 'Support']);
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
      type: "'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of the chip',
    },
    {
      name: 'icon',
      type: 'string',
      default: 'undefined',
      description: 'Heroicon name to display before the label',
    },
    {
      name: 'removable',
      type: 'boolean',
      default: 'false',
      description: 'Show delete button and enable removal',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disable the chip and prevent interactions',
    },
  ];

  protected eventsData = [
    {
      name: 'remove',
      type: 'void',
      description: 'Emitted when the chip is removed (via delete button or keyboard)',
    },
  ];

  // API documentation tables
  protected propsColumns = signal<TableColumn[]>([
    { key: 'name', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  protected eventsColumns = signal<TableColumn[]>([
    { key: 'name', label: 'Event', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);
}
