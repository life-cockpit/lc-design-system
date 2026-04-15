import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  SwitchComponent,
  ButtonComponent,
  CardComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-switch-demo',
  standalone: true,
  imports: [
    SwitchComponent,
    ButtonComponent,
    CardComponent,
    TableComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
})
export class SwitchDemoComponent {
  // Basic examples
  basicChecked = signal<boolean>(false);
  primaryChecked = signal<boolean>(true);
  secondaryChecked = signal<boolean>(false);

  // Variant examples
  successChecked = signal<boolean>(true);
  warningChecked = signal<boolean>(true);
  dangerChecked = signal<boolean>(false);

  // Size examples
  smChecked = signal<boolean>(true);
  mdChecked = signal<boolean>(true);
  lgChecked = signal<boolean>(true);

  // State examples
  disabledUnchecked = signal<boolean>(false);
  disabledChecked = signal<boolean>(true);
  loadingChecked = signal<boolean>(true);

  // Label position examples
  leftLabelChecked = signal<boolean>(true);
  rightLabelChecked = signal<boolean>(true);

  // Reactive form
  switchForm = new FormGroup({
    notifications: new FormControl<boolean>(true),
    darkMode: new FormControl<boolean>(false),
    autoSave: new FormControl<boolean>(true),
  });

  // Playground
  playgroundVariant = signal<'primary' | 'secondary' | 'success' | 'warning' | 'danger'>('primary');
  playgroundSize = signal<'sm' | 'md' | 'lg'>('md');
  playgroundDisabled = signal<boolean>(false);
  playgroundLoading = signal<boolean>(false);
  playgroundLabelPosition = signal<'left' | 'right'>('right');
  playgroundChecked = signal<boolean>(false);

  // API Documentation
  apiInputsColumns = signal<TableColumn[]>([
    { key: 'prop', label: 'Property', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'default', label: 'Default', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiInputsData = signal([
    {
      prop: 'variant',
      type: "'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
      default: "'primary'",
      description: 'Visual variant',
    },
    { prop: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of switch' },
    { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { prop: 'loading', type: 'boolean', default: 'false', description: 'Loading state' },
    { prop: 'label', type: 'string', default: "''", description: 'Label text' },
    {
      prop: 'labelPosition',
      type: "'left' | 'right'",
      default: "'right'",
      description: 'Label position',
    },
  ]);

  apiOutputsColumns = signal<TableColumn[]>([
    { key: 'event', label: 'Event', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiOutputsData = signal([
    {
      event: 'checkedChange',
      type: 'EventEmitter<boolean>',
      description: 'Emitted when checked state changes',
    },
  ]);

  onSubmit(): void {
    console.log('Switch form submitted:', this.switchForm.value);
  }
}
