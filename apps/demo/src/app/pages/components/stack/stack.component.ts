import { Component, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  StackComponent,
  StackDirection,
  StackGap,
  StackAlign,
  StackJustify,
  CardComponent,
  ButtonComponent,
  SelectComponent,
  CheckboxComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-stack',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StackComponent,
    CardComponent,
    ButtonComponent,
    SelectComponent,
    CheckboxComponent,
    TableComponent,
  ],
  templateUrl: './stack.component.html',
  styleUrls: ['./stack.component.scss'],
})
export class StackDemoComponent {
  direction = model<StackDirection>('vertical');
  gap = model<StackGap>('md');
  align = model<StackAlign>('stretch');
  justify = model<StackJustify>('start');
  wrap = model(false);
  fullWidth = model(false);

  directionOptions = [
    { value: 'vertical', label: 'Vertical' },
    { value: 'horizontal', label: 'Horizontal' },
  ];

  gapOptions = [
    { value: 'none', label: 'None' },
    { value: 'xs', label: 'XS' },
    { value: 'sm', label: 'SM' },
    { value: 'md', label: 'MD' },
    { value: 'lg', label: 'LG' },
    { value: 'xl', label: 'XL' },
  ];

  alignOptions = [
    { value: 'start', label: 'Start' },
    { value: 'center', label: 'Center' },
    { value: 'end', label: 'End' },
    { value: 'stretch', label: 'Stretch' },
    { value: 'baseline', label: 'Baseline' },
  ];

  justifyOptions = [
    { value: 'start', label: 'Start' },
    { value: 'center', label: 'Center' },
    { value: 'end', label: 'End' },
    { value: 'between', label: 'Between' },
    { value: 'around', label: 'Around' },
    { value: 'evenly', label: 'Evenly' },
  ];

  getCode(): string {
    const props: string[] = [];

    if (this.direction() !== 'vertical') {
      props.push(`direction="${this.direction()}"`);
    }
    if (this.gap() !== 'md') {
      props.push(`gap="${this.gap()}"`);
    }
    if (this.align() !== 'stretch') {
      props.push(`align="${this.align()}"`);
    }
    if (this.justify() !== 'start') {
      props.push(`justify="${this.justify()}"`);
    }
    if (this.wrap()) {
      props.push(`[wrap]="true"`);
    }
    if (this.fullWidth()) {
      props.push(`[fullWidth]="true"`);
    }

    const propsStr = props.length > 0 ? ' ' + props.join(' ') : '';

    return `<lc-stack${propsStr}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</lc-stack>`;
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
      prop: 'direction',
      type: "'vertical' | 'horizontal'",
      default: "'vertical'",
      description: 'Stack direction',
    },
    {
      prop: 'gap',
      type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'",
      default: "'md'",
      description: 'Spacing between items',
    },
    {
      prop: 'align',
      type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'",
      default: "'stretch'",
      description: 'Cross-axis alignment',
    },
    {
      prop: 'justify',
      type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'",
      default: "'start'",
      description: 'Main-axis justification',
    },
    { prop: 'wrap', type: 'boolean', default: 'false', description: 'Allow items to wrap' },
    {
      prop: 'fullWidth',
      type: 'boolean',
      default: 'false',
      description: 'Take full width of container',
    },
  ]);
}
