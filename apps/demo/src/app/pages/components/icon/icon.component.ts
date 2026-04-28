import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IconComponent,
  CardComponent,
  SelectComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-icon-demo',
  imports: [
    CommonModule,
    FormsModule,
    IconComponent,
    CardComponent,
    SelectComponent,
    TableComponent,
  ],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconDemoComponent {
  // Size examples
  protected selectedSize = signal<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');

  // Variant examples
  protected selectedVariant = signal<'outline' | 'solid'>('outline');

  // Color examples
  protected selectedColor = signal<string>('currentColor');

  // Interactive playground
  protected playgroundIcon = signal('user');
  protected playgroundSize = signal<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  protected playgroundVariant = signal<'outline' | 'solid'>('outline');
  protected playgroundColor = signal('currentColor');
  protected playgroundAriaLabel = signal('');
  protected playgroundDecorative = signal(false);

  // Common icons
  protected readonly commonIcons = [
    { name: 'user', label: 'User' },
    { name: 'home', label: 'Home' },
    { name: 'cog-6-tooth', label: 'Settings' },
    { name: 'bell', label: 'Notifications' },
    { name: 'envelope', label: 'Email' },
    { name: 'magnifying-glass', label: 'Search' },
    { name: 'heart', label: 'Like' },
    { name: 'star', label: 'Favorite' },
    { name: 'trash', label: 'Delete' },
    { name: 'pencil', label: 'Edit' },
    { name: 'plus', label: 'Add' },
    { name: 'minus', label: 'Remove' },
    { name: 'check', label: 'Confirm' },
    { name: 'x-mark', label: 'Close' },
    { name: 'arrow-right', label: 'Next' },
    { name: 'arrow-left', label: 'Previous' },
    { name: 'arrow-up', label: 'Up' },
    { name: 'arrow-down', label: 'Down' },
    { name: 'chevron-right', label: 'Chevron Right' },
    { name: 'chevron-down', label: 'Chevron Down' },
    { name: 'folder', label: 'Folder' },
    { name: 'document', label: 'Document' },
    { name: 'photo', label: 'Photo' },
    { name: 'video-camera', label: 'Video' },
    { name: 'chat-bubble-left-right', label: 'Chat' },
    { name: 'calendar', label: 'Calendar' },
    { name: 'clock', label: 'Time' },
    { name: 'map-pin', label: 'Location' },
    { name: 'globe-alt', label: 'Globe' },
    { name: 'shield-check', label: 'Security' },
    { name: 'lock-closed', label: 'Lock' },
    { name: 'information-circle', label: 'Info' },
    { name: 'exclamation-triangle', label: 'Warning' },
    { name: 'question-mark-circle', label: 'Help' },
    { name: 'check-circle', label: 'Success' },
    { name: 'x-circle', label: 'Error' },
  ];

  // Icon options for select dropdowns
  protected readonly iconOptions = this.commonIcons.map((icon) => ({
    value: icon.name,
    label: icon.label,
  }));

  protected readonly sizeOptions = [
    { value: 'xs', label: 'XS' },
    { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' },
    { value: 'lg', label: 'LG' },
    { value: 'xl', label: 'XL' },
  ];

  // Navigation icons
  protected readonly navigationIcons = [
    'arrow-left',
    'arrow-right',
    'arrow-up',
    'arrow-down',
    'chevron-left',
    'chevron-right',
    'chevron-up',
    'chevron-down',
    'chevron-double-left',
    'chevron-double-right',
    'bars-3',
    'ellipsis-horizontal',
  ];

  // Action icons
  protected readonly actionIcons = [
    'plus',
    'minus',
    'check',
    'x-mark',
    'pencil',
    'trash',
    'arrow-path',
    'arrow-down-tray',
    'arrow-up-tray',
    'share',
    'bookmark',
    'heart',
  ];

  // Size options
  protected readonly sizes: Array<'xs' | 'sm' | 'md' | 'lg' | 'xl'> = [
    'xs',
    'sm',
    'md',
    'lg',
    'xl',
  ];

  // Variant options
  protected readonly variants: Array<'outline' | 'solid'> = ['outline', 'solid'];

  // Predefined colors
  protected readonly colorOptions = [
    { value: 'currentColor', label: 'Current Color' },
    { value: '#208497', label: 'Primary' },
    { value: '#7097AF', label: 'Secondary' },
    { value: '#10b981', label: 'Success' },
    { value: '#ef4444', label: 'Error' },
    { value: '#f59e0b', label: 'Warning' },
    { value: '#3b82f6', label: 'Info' },
    { value: '#6b7280', label: 'Gray' },
    { value: '#000000', label: 'Black' },
  ];

  protected copyCode(code: string): void {
    void navigator.clipboard.writeText(code);
  }

  // API Documentation
  apiColumns = signal<TableColumn[]>([
    { key: 'prop', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiData = signal([
    {
      prop: 'name',
      type: 'string',
      default: "''",
      description: 'Icon name from Heroicons library (e.g., "user", "check", "arrow-right")',
    },
    {
      prop: 'variant',
      type: "'outline' | 'solid'",
      default: "'outline'",
      description: 'Icon style variant',
    },
    {
      prop: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
      default: "'md'",
      description: 'Icon size (xs=16px, sm=20px, md=24px, lg=32px, xl=40px)',
    },
    {
      prop: 'color',
      type: 'string',
      default: "'currentColor'",
      description: 'Icon color (hex, CSS variable, or Tailwind class)',
    },
    {
      prop: 'ariaLabel',
      type: 'string',
      default: 'undefined',
      description: 'Accessible label for screen readers (required if icon has semantic meaning)',
    },
    {
      prop: 'decorative',
      type: 'boolean',
      default: 'false',
      description: 'Whether icon is purely decorative (sets aria-hidden="true")',
    },
  ]);
}
