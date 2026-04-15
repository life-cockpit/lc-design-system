import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Creation', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default variant "outline"', () => {
      expect(component.variant).toBe('outline');
    });

    it('should have default size "md"', () => {
      expect(component.size).toBe('md');
    });

    it('should not be disabled by default', () => {
      expect(component.disabled).toBe(false);
    });

    it('should not have error state by default', () => {
      expect(component.error).toBe(false);
    });

    it('should not be required by default', () => {
      expect(component.required).toBe(false);
    });

    it('should not be in loading state by default', () => {
      expect(component.loading).toBe(false);
    });

    it('should not be searchable by default', () => {
      expect(component.searchable).toBe(false);
    });

    it('should not allow multiple selection by default', () => {
      expect(component.multiple).toBe(false);
    });
  });

  describe('Options Management', () => {
    it('should accept options array', () => {
      const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ];
      component.options = options;
      expect(component.options).toEqual(options);
    });

    it('should support grouped options', () => {
      const options = [
        { label: 'Group 1', options: [{ value: '1', label: 'Option 1' }] },
        { label: 'Group 2', options: [{ value: '2', label: 'Option 2' }] },
      ];
      component.options = options;
      expect(component.options).toEqual(options);
    });

    it('should filter options when searchable', () => {
      const options = [
        { value: '1', label: 'Apple' },
        { value: '2', label: 'Banana' },
        { value: '3', label: 'Cherry' },
      ];
      component.options = options;
      component.searchable = true;
      component.searchQuery.set('ban');

      const filtered = component.filteredOptions();
      expect(filtered).toHaveLength(1);
      expect(filtered[0].label).toBe('Banana');
    });

    it('should return all options when search query is empty', () => {
      const options = [
        { value: '1', label: 'Apple' },
        { value: '2', label: 'Banana' },
      ];
      component.options = options;
      component.searchable = true;
      component.searchQuery.set('');

      expect(component.filteredOptions()).toEqual(options);
    });
  });

  describe('Variant Styles', () => {
    it('should apply outline variant classes', () => {
      component.variant = 'outline';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.classList.contains('lc-select--outline')).toBe(true);
    });

    it('should apply filled variant classes', () => {
      component.variant = 'filled';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.classList.contains('lc-select--filled')).toBe(true);
    });
  });

  describe('Size Styles', () => {
    it('should apply xs size classes', () => {
      component.size = 'xs';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.classList.contains('lc-select--xs')).toBe(true);
    });

    it('should apply sm size classes', () => {
      component.size = 'sm';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.classList.contains('lc-select--sm')).toBe(true);
    });

    it('should apply md size classes', () => {
      component.size = 'md';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.classList.contains('lc-select--md')).toBe(true);
    });

    it('should apply lg size classes', () => {
      component.size = 'lg';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.classList.contains('lc-select--lg')).toBe(true);
    });
  });

  describe('State Management', () => {
    it('should apply disabled state', () => {
      component.disabled = true;
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.classList.contains('lc-select--disabled')).toBe(true);
    });

    it('should apply error state', () => {
      component.error = true;
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.classList.contains('lc-select--error')).toBe(true);
    });

    it('should apply loading state', () => {
      component.loading = true;
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.classList.contains('lc-select--loading')).toBe(true);
    });

    it('should not open dropdown when disabled', () => {
      component.disabled = true;
      component.toggle();
      expect(component.isOpen()).toBe(false);
    });

    it('should not open dropdown when loading', () => {
      component.loading = true;
      component.toggle();
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Dropdown Behavior', () => {
    it('should toggle dropdown open/closed', () => {
      expect(component.isOpen()).toBe(false);
      component.toggle();
      expect(component.isOpen()).toBe(true);
      component.toggle();
      expect(component.isOpen()).toBe(false);
    });

    it('should open dropdown', () => {
      component.open();
      expect(component.isOpen()).toBe(true);
    });

    it('should close dropdown', () => {
      component.open();
      component.close();
      expect(component.isOpen()).toBe(false);
    });

    it('should close dropdown on outside click', () => {
      component.open();
      component.onClickOutside();
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Selection Behavior', () => {
    beforeEach(() => {
      const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
      ];
      component.options = options;
    });

    it('should select an option', () => {
      const option = { value: '1', label: 'Option 1' };
      component.selectOption(option);

      expect(component.value()).toBe('1');
      expect(component.selectedLabel()).toBe('Option 1');
    });

    it('should close dropdown after selection in single mode', () => {
      component.open();
      const option = { value: '1', label: 'Option 1' };
      component.selectOption(option);

      expect(component.isOpen()).toBe(false);
    });

    it('should keep dropdown open after selection in multiple mode', () => {
      component.multiple = true;
      component.open();
      const option = { value: '1', label: 'Option 1' };
      component.selectOption(option);

      expect(component.isOpen()).toBe(true);
    });

    it('should support multiple selection', () => {
      component.multiple = true;
      component.selectOption({ value: '1', label: 'Option 1' });
      component.selectOption({ value: '2', label: 'Option 2' });

      const value = component.value() as string[];
      expect(value).toEqual(['1', '2']);
    });

    it('should deselect option in multiple mode', () => {
      component.multiple = true;
      component.selectOption({ value: '1', label: 'Option 1' });
      component.selectOption({ value: '2', label: 'Option 2' });
      component.selectOption({ value: '1', label: 'Option 1' }); // Deselect

      const value = component.value() as string[];
      expect(value).toEqual(['2']);
    });

    it('should check if option is selected', () => {
      component.selectOption({ value: '1', label: 'Option 1' });

      expect(component.isSelected({ value: '1', label: 'Option 1' })).toBe(true);
      expect(component.isSelected({ value: '2', label: 'Option 2' })).toBe(false);
    });

    it('should clear selection', () => {
      component.selectOption({ value: '1', label: 'Option 1' });
      component.clear();

      expect(component.value()).toBeNull();
      expect(component.selectedLabel()).toBe('');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should write value', () => {
      component.writeValue('2');
      expect(component.value()).toBe('2');
    });

    it('should write null value', () => {
      component.selectOption({ value: '1', label: 'Option 1' });
      component.writeValue(null);
      expect(component.value()).toBeNull();
    });

    it('should register onChange callback', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);

      component.selectOption({ value: '1', label: 'Option 1' });
      expect(onChange).toHaveBeenCalledWith('1');
    });

    it('should register onTouched callback', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);

      component.onBlur();
      expect(onTouched).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);

      component.setDisabledState(false);
      expect(component.disabled).toBe(false);
    });
  });

  describe('Reactive Forms Integration', () => {
    it('should work with FormControl', () => {
      const control = new FormControl('2');
      component.writeValue(control.value);

      expect(component.value()).toBe('2');
    });

    it('should update FormControl on selection', () => {
      const control = new FormControl('');
      let capturedValue: any;

      component.registerOnChange((value) => {
        capturedValue = value;
        control.setValue(value);
      });

      component.selectOption({ value: '1', label: 'Option 1' });

      expect(capturedValue).toBe('1');
      expect(control.value).toBe('1');
    });

    it('should mark as touched on blur', () => {
      const control = new FormControl('');

      component.registerOnTouched(() => {
        control.markAsTouched();
      });

      component.onBlur();

      expect(control.touched).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA role', () => {
      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.getAttribute('role')).toBe('combobox');
    });

    it('should have aria-expanded attribute', () => {
      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.getAttribute('aria-expanded')).toBe('false');

      component.open();
      fixture.detectChanges();
      expect(select.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have aria-label when provided', () => {
      component.ariaLabel = 'Choose an option';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.getAttribute('aria-label')).toBe('Choose an option');
    });

    it('should have aria-required when required', () => {
      component.required = true;
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.getAttribute('aria-required')).toBe('true');
    });

    it('should have aria-disabled when disabled', () => {
      component.disabled = true;
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.getAttribute('aria-disabled')).toBe('true');
    });

    it('should have aria-invalid when error', () => {
      component.error = true;
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const select = compiled.querySelector('.lc-select');
      expect(select.getAttribute('aria-invalid')).toBe('true');
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
      ];
      component.options = options;
    });

    it('should open dropdown on Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeyDown(event);
      expect(component.isOpen()).toBe(true);
    });

    it('should open dropdown on Space key', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      component.onKeyDown(event);
      expect(component.isOpen()).toBe(true);
    });

    it('should close dropdown on Escape key', () => {
      component.open();
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      component.onKeyDown(event);
      expect(component.isOpen()).toBe(false);
    });

    it('should navigate down with ArrowDown', () => {
      component.open();
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });

      component.onKeyDown(event);
      expect(component.highlightedIndex()).toBe(0);

      component.onKeyDown(event);
      expect(component.highlightedIndex()).toBe(1);
    });

    it('should navigate up with ArrowUp', () => {
      component.open();
      component.highlightedIndex.set(2);

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.onKeyDown(event);
      expect(component.highlightedIndex()).toBe(1);
    });

    it('should wrap to last option when navigating up from first', () => {
      component.open();
      component.highlightedIndex.set(0);

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      component.onKeyDown(event);
      expect(component.highlightedIndex()).toBe(2);
    });

    it('should wrap to first option when navigating down from last', () => {
      component.open();
      component.highlightedIndex.set(2);

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      component.onKeyDown(event);
      expect(component.highlightedIndex()).toBe(0);
    });

    it('should select highlighted option on Enter', () => {
      component.open();
      component.highlightedIndex.set(1);

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeyDown(event);

      expect(component.value()).toBe('2');
    });
  });

  describe('Helper Text', () => {
    it('should display helper text', () => {
      component.helperText = 'This is helpful';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const helper = compiled.querySelector('.lc-select__helper');
      expect(helper?.textContent).toContain('This is helpful');
    });

    it('should display error message when in error state', () => {
      component.error = true;
      component.errorMessage = 'This is an error';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const error = compiled.querySelector('.lc-select__error');
      expect(error?.textContent).toContain('This is an error');
    });

    it('should prioritize error message over helper text', () => {
      component.helperText = 'This is helpful';
      component.error = true;
      component.errorMessage = 'This is an error';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      const compiled = fixture.nativeElement;
      const error = compiled.querySelector('.lc-select__error');
      const helper = compiled.querySelector('.lc-select__helper');

      expect(error).toBeTruthy();
      expect(helper).toBeFalsy();
    });
  });

  describe('Placeholder', () => {
    beforeEach(() => {
      const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
      ];
      component.options = options;
    });

    it('should display placeholder when no selection', () => {
      component.placeholder = 'Select an option';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      fixture.detectChanges();

      expect(component.displayValue()).toBe('Select an option');
    });

    it('should display selected value instead of placeholder', () => {
      component.placeholder = 'Select an option';
      fixture.debugElement.injector.get(ChangeDetectorRef).markForCheck();
      component.selectOption({ value: '1', label: 'Option 1' });
      fixture.detectChanges();

      expect(component.displayValue()).toBe('Option 1');
    });

    it('should display count in multiple mode', () => {
      component.multiple = true;
      component.selectOption({ value: '1', label: 'Option 1' });
      component.selectOption({ value: '2', label: 'Option 2' });

      expect(component.displayValue()).toContain('2 selected');
    });
  });
});
