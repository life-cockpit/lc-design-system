import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  TextareaComponent,
  ButtonComponent,
  CardComponent,
  TableComponent,
  TableColumn,
} from '@life-cockpit/ui-kit';

@Component({
  selector: 'app-textarea-demo',
  standalone: true,
  imports: [
    TextareaComponent,
    ButtonComponent,
    CardComponent,
    TableComponent,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaDemoComponent {
  // Basic examples
  basicValue = signal<string>('');
  outlineValue = signal<string>('');
  filledValue = signal<string>('');

  // Size examples
  xsValue = signal<string>('');
  smValue = signal<string>('');
  mdValue = signal<string>('');
  lgValue = signal<string>('');

  // State examples
  disabledValue = signal<string>('This textarea is disabled');
  errorValue = signal<string>('');
  readonlyValue = signal<string>('This textarea is readonly');
  requiredValue = signal<string>('');

  // Auto-resize examples
  autoResizeValue = signal<string>('');
  minMaxRowsValue = signal<string>('');

  // Character count examples
  charCountValue = signal<string>('');
  maxLengthValue = signal<string>('');

  // Interactive playground
  playgroundVariant = signal<'outline' | 'filled'>('outline');
  playgroundSize = signal<'xs' | 'sm' | 'md' | 'lg'>('md');
  playgroundDisabled = signal<boolean>(false);
  playgroundError = signal<boolean>(false);
  playgroundReadonly = signal<boolean>(false);
  playgroundRequired = signal<boolean>(false);
  playgroundAutoResize = signal<boolean>(false);
  playgroundShowCharCount = signal<boolean>(false);
  playgroundValue = signal<string>('');

  // Reactive form
  textareaForm = new FormGroup({
    description: new FormControl(''),
    bio: new FormControl(''),
    notes: new FormControl(''),
  });

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
      type: "'outline' | 'filled'",
      default: "'outline'",
      description: 'Visual variant',
    },
    {
      prop: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg'",
      default: "'md'",
      description: 'Size of textarea',
    },
    { prop: 'disabled', type: 'boolean', default: 'false', description: 'Disabled state' },
    { prop: 'error', type: 'boolean', default: 'false', description: 'Error state' },
    {
      prop: 'autoResize',
      type: 'boolean',
      default: 'false',
      description: 'Auto-resize based on content',
    },
    {
      prop: 'showCharacterCount',
      type: 'boolean',
      default: 'false',
      description: 'Show character count',
    },
    { prop: 'maxLength', type: 'number', default: 'undefined', description: 'Max character limit' },
  ]);

  apiOutputsColumns = signal<TableColumn[]>([
    { key: 'event', label: 'Event', sortable: false },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'description', label: 'Description', sortable: false },
  ]);

  apiOutputsData = signal([
    {
      event: 'valueChange',
      type: 'EventEmitter<string>',
      description: 'Emitted when value changes',
    },
  ]);

  onSubmit(): void {
    if (this.textareaForm.valid) {
      console.log('Form submitted:', this.textareaForm.value);
    }
  }
}
