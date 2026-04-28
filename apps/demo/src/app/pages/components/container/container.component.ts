import { Component, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ContainerComponent,
  ContainerSize,
  SectionComponent,
  SectionSpacing,
  SectionBackground,
  CardComponent,
  StackComponent,
  SelectComponent,
  CheckboxComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/angular-ui-kit';

@Component({
  selector: 'app-container-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ContainerComponent,
    SectionComponent,
    CardComponent,
    StackComponent,
    SelectComponent,
    CheckboxComponent,
    TableComponent,
  ],
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss'],
})
export class ContainerDemoComponent {
  // Container config
  containerSize = model<ContainerSize>('lg');
  containerNoPadding = model(false);
  containerPaddingY = model(false);

  // Section config
  sectionSpacing = model<SectionSpacing>('md');
  sectionBackground = model<SectionBackground>('none');
  sectionNoPaddingX = model(false);
  sectionNoPaddingY = model(false);

  containerSizeOptions = [
    { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' },
    { value: 'lg', label: 'LG' },
    { value: 'xl', label: 'XL' },
    { value: 'full', label: 'Full' },
  ];

  sectionSpacingOptions = [
    { value: 'none', label: 'None' },
    { value: 'xs', label: 'XS' },
    { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' },
    { value: 'lg', label: 'LG' },
    { value: 'xl', label: 'XL' },
  ];

  sectionBackgroundOptions = [
    { value: 'none', label: 'None' },
    { value: 'subtle', label: 'Subtle' },
    { value: 'muted', label: 'Muted' },
  ];

  getContainerCode(): string {
    const props: string[] = [];

    if (this.containerSize() !== 'lg') {
      props.push(`size="${this.containerSize()}"`);
    }
    if (this.containerNoPadding()) {
      props.push(`[noPadding]="true"`);
    }
    if (this.containerPaddingY()) {
      props.push(`[paddingY]="true"`);
    }

    const propsStr = props.length > 0 ? ' ' + props.join(' ') : '';

    return `<lc-container${propsStr}>
  <!-- Content here -->
</lc-container>`;
  }

  getSectionCode(): string {
    const props: string[] = [];

    if (this.sectionSpacing() !== 'md') {
      props.push(`spacing="${this.sectionSpacing()}"`);
    }
    if (this.sectionBackground() !== 'none') {
      props.push(`background="${this.sectionBackground()}"`);
    }
    if (this.sectionNoPaddingX()) {
      props.push(`[noPaddingX]="true"`);
    }
    if (this.sectionNoPaddingY()) {
      props.push(`[noPaddingY]="true"`);
    }

    const propsStr = props.length > 0 ? ' ' + props.join(' ') : '';

    return `<lc-section${propsStr}>
  <!-- Content here -->
</lc-section>`;
  }

  // Container API Documentation
  containerApiColumns = signal<TableColumn[]>([
    { key: 'prop', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  containerApiData = signal([
    {
      prop: 'size',
      type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
      default: "'lg'",
      description: 'Maximum width of the container',
    },
    {
      prop: 'noPadding',
      type: 'boolean',
      default: 'false',
      description: 'Remove horizontal padding',
    },
    {
      prop: 'paddingY',
      type: 'boolean',
      default: 'false',
      description: 'Add vertical padding (py-6). Useful for page-level containers.',
    },
  ]);

  // Section API Documentation
  sectionApiColumns = signal<TableColumn[]>([
    { key: 'prop', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  sectionApiData = signal([
    {
      prop: 'spacing',
      type: "'none' | 'sm' | 'md' | 'lg' | 'xl'",
      default: "'md'",
      description: 'Vertical padding amount',
    },
    {
      prop: 'background',
      type: "'none' | 'gray' | 'primary' | 'secondary'",
      default: "'none'",
      description: 'Background color',
    },
    {
      prop: 'noPaddingX',
      type: 'boolean',
      default: 'false',
      description: 'Remove horizontal padding',
    },
    {
      prop: 'noPaddingY',
      type: 'boolean',
      default: 'false',
      description: 'Remove vertical padding',
    },
  ]);
}
