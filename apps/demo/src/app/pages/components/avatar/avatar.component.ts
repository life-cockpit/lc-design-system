import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AvatarComponent,
  type AvatarSize,
  type AvatarStatus,
  CardComponent,
  ButtonComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-avatar-demo',
  imports: [CommonModule, AvatarComponent, CardComponent, ButtonComponent, TableComponent],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarDemoComponent {
  // Playground controls
  protected size = signal<AvatarSize>('md');
  protected status = signal<AvatarStatus | undefined>(undefined);
  protected withImage = signal(false);
  protected name = signal('John Doe');

  // Sample image URL
  protected imageUrl =
    'https://ui-avatars.com/api/?name=John+Doe&size=200&background=4F46E5&color=fff';

  // Demo code examples
  protected basicExample = `<lc-avatar name="John Doe" />`;

  protected imageExample = `<lc-avatar 
  src="https://example.com/avatar.jpg" 
  alt="John Doe" 
/>`;

  protected initialsExample = `<lc-avatar name="Jane Smith" />
<lc-avatar name="Bob Wilson" />
<lc-avatar name="Alice" />`;

  protected sizeExample = `<lc-avatar name="John Doe" size="xs" />
<lc-avatar name="John Doe" size="sm" />
<lc-avatar name="John Doe" size="md" />
<lc-avatar name="John Doe" size="lg" />
<lc-avatar name="John Doe" size="xl" />`;

  protected statusExample = `<lc-avatar name="John Doe" status="online" />
<lc-avatar name="Jane Smith" status="away" />
<lc-avatar name="Bob Wilson" status="busy" />
<lc-avatar name="Alice Brown" status="offline" />`;

  // Interactive controls for playground
  protected setSize(size: AvatarSize): void {
    this.size.set(size);
  }

  protected setStatus(status: AvatarStatus | undefined): void {
    this.status.set(status);
  }

  protected toggleImage(): void {
    this.withImage.update((v) => !v);
  }

  // Props API data for documentation table
  protected propsData = [
    {
      name: 'src',
      type: 'string',
      default: 'undefined',
      description: 'Image source URL for the avatar',
    },
    {
      name: 'alt',
      type: 'string',
      default: 'undefined',
      description: 'Alt text for the image',
    },
    {
      name: 'name',
      type: 'string',
      default: 'undefined',
      description: 'Full name used to generate initials when no image is provided',
    },
    {
      name: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
      default: "'md'",
      description: 'Size of the avatar',
    },
    {
      name: 'status',
      type: "'online' | 'offline' | 'away' | 'busy'",
      default: 'undefined',
      description: 'Status indicator to display',
    },
  ];

  // API documentation tables
  protected propsColumns = signal<TableColumn[]>([
    { key: 'name', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);
}
