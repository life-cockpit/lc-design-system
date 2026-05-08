import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboboxComponent, ComboboxOption } from './combobox.component';

describe('ComboboxComponent', () => {
  let component: ComboboxComponent;
  let fixture: ComponentFixture<ComboboxComponent>;

  const sampleOptions: ComboboxOption[] = [
    { value: '1', label: 'Apple' },
    { value: '2', label: 'Banana' },
    { value: '3', label: 'Cherry' },
    { value: '4', label: 'Date', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComboboxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    fixture.componentRef.setInput('label', 'Fruit');
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.lc-combobox__label');
    expect(label?.textContent).toContain('Fruit');
  });

  it('should filter options by query', () => {
    fixture.componentRef.setInput('options', sampleOptions);
    fixture.detectChanges();
    component['query'].set('ban');
    const visible = component['visibleOptions']();
    expect(visible.length).toBe(1);
    expect(visible[0].label).toBe('Banana');
  });

  it('should select an option in single mode', () => {
    fixture.componentRef.setInput('options', sampleOptions);
    fixture.detectChanges();
    const spy = jest.fn();
    component.valueChange.subscribe(spy);
    component['selectOption'](sampleOptions[0]);
    expect(spy).toHaveBeenCalledWith(sampleOptions[0]);
    expect(component['selectedSingle']()?.value).toBe('1');
  });

  it('should select multiple options in multiple mode', () => {
    fixture.componentRef.setInput('options', sampleOptions);
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();
    component['selectOption'](sampleOptions[0]);
    component['selectOption'](sampleOptions[1]);
    expect(component['selectedMultiple']().length).toBe(2);
  });

  it('should remove selected in multiple mode', () => {
    fixture.componentRef.setInput('options', sampleOptions);
    fixture.componentRef.setInput('multiple', true);
    fixture.detectChanges();
    component['selectOption'](sampleOptions[0]);
    component['selectOption'](sampleOptions[1]);
    component['removeSelected'](sampleOptions[0]);
    expect(component['selectedMultiple']().length).toBe(1);
    expect(component['selectedMultiple']()[0].value).toBe('2');
  });

  it('should show create option when allowCreate is enabled', () => {
    fixture.componentRef.setInput('options', sampleOptions);
    fixture.componentRef.setInput('allowCreate', true);
    fixture.detectChanges();
    component['query'].set('Mango');
    expect(component['showCreateOption']()).toBe(true);
  });

  it('should not show create option when query matches existing', () => {
    fixture.componentRef.setInput('options', sampleOptions);
    fixture.componentRef.setInput('allowCreate', true);
    fixture.detectChanges();
    component['query'].set('Apple');
    expect(component['showCreateOption']()).toBe(false);
  });

  it('should emit created on create new', () => {
    fixture.componentRef.setInput('options', []);
    fixture.componentRef.setInput('allowCreate', true);
    fixture.detectChanges();
    const spy = jest.fn();
    component.created.subscribe(spy);
    component['query'].set('NewItem');
    component['onCreateNew']();
    expect(spy).toHaveBeenCalledWith('NewItem');
  });

  it('should apply error class', () => {
    fixture.componentRef.setInput('error', 'Required');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.lc-combobox--error');
    expect(el).toBeTruthy();
  });

  it('should display helper text', () => {
    fixture.componentRef.setInput('helperText', 'Pick one');
    fixture.detectChanges();
    const helper = fixture.nativeElement.querySelector('.lc-combobox__helper');
    expect(helper?.textContent).toContain('Pick one');
  });

  it('should group options', () => {
    const opts: ComboboxOption[] = [
      { value: '1', label: 'A', group: 'Fruits' },
      { value: '2', label: 'B', group: 'Vegs' },
      { value: '3', label: 'C', group: 'Fruits' },
    ];
    fixture.componentRef.setInput('options', opts);
    fixture.detectChanges();
    component['query'].set('');
    const grouped = component['groupedOptions']();
    expect(grouped.length).toBe(2);
    expect(grouped[0].label).toBe('Fruits');
    expect(grouped[0].items.length).toBe(2);
  });

  it('should implement ControlValueAccessor', () => {
    fixture.detectChanges();
    const fn = jest.fn();
    component.registerOnChange(fn);
    component['selectOption'](sampleOptions[0]);
    expect(fn).toHaveBeenCalledWith(sampleOptions[0]);
  });
});
