import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  computed,
  output,
  forwardRef,
  ElementRef,
  viewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'lc-tag-input',
  standalone: true,
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true,
    },
  ],
})
export class TagInputComponent implements ControlValueAccessor {
  readonly placeholder = input('Add tag…');
  readonly maxTags = input(Infinity);
  readonly allowDuplicates = input(false);
  readonly removable = input(true);
  readonly disabled = input(false);
  readonly separator = input<'enter' | 'comma' | 'both'>('both');
  readonly suggestions = input<string[]>([]);
  readonly label = input('');

  readonly tagAdded = output<string>();
  readonly tagRemoved = output<string>();

  protected tags = signal<string[]>([]);
  protected inputValue = signal('');
  protected focused = signal(false);

  protected readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  protected readonly filteredSuggestions = computed(() => {
    const val = this.inputValue().toLowerCase().trim();
    if (!val) return [];
    return this.suggestions().filter(
      s => s.toLowerCase().includes(val) && (this.allowDuplicates() || !this.tags().includes(s))
    );
  });

  protected readonly canAdd = computed(() => this.tags().length < this.maxTags());

  private onChange: (val: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string[] | null): void {
    this.tags.set(value ?? []);
  }

  registerOnChange(fn: (val: string[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  protected addTag(value: string): void {
    const tag = value.trim();
    if (!tag || !this.canAdd()) return;
    if (!this.allowDuplicates() && this.tags().includes(tag)) return;

    this.tags.update(t => [...t, tag]);
    this.inputValue.set('');
    this.onChange(this.tags());
    this.tagAdded.emit(tag);
  }

  protected removeTag(index: number): void {
    const removed = this.tags()[index];
    this.tags.update(t => t.filter((_, i) => i !== index));
    this.onChange(this.tags());
    this.tagRemoved.emit(removed);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const sep = this.separator();
    const val = this.inputValue();

    if (event.key === 'Enter' && (sep === 'enter' || sep === 'both')) {
      event.preventDefault();
      this.addTag(val);
    }

    if (event.key === ',' && (sep === 'comma' || sep === 'both')) {
      event.preventDefault();
      this.addTag(val);
    }

    if (event.key === 'Backspace' && !val && this.tags().length > 0) {
      this.removeTag(this.tags().length - 1);
    }
  }

  protected onInput(event: Event): void {
    this.inputValue.set((event.target as HTMLInputElement).value);
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
    const val = this.inputValue();
    if (val.trim()) this.addTag(val);
  }

  protected selectSuggestion(value: string): void {
    this.addTag(value);
    this.inputEl()?.nativeElement.focus();
  }

  protected focusInput(): void {
    this.inputEl()?.nativeElement.focus();
  }
}
