import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterBarComponent, FilterConfig, FilterValues } from './filter-bar.component';

describe('FilterBarComponent', () => {
  let component: FilterBarComponent;
  let fixture: ComponentFixture<FilterBarComponent>;

  const mockFilters: FilterConfig[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'toggle',
      options: [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
      ],
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      placeholder: 'All Categories',
      options: [
        { value: 'forex', label: 'Forex' },
        { value: 'commodities', label: 'Commodities' },
      ],
    },
    {
      key: 'search',
      label: '',
      type: 'search',
      placeholder: 'Search strategies...',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('filters', mockFilters);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all filter items', () => {
    const items = fixture.nativeElement.querySelectorAll('.lc-filter-bar__item');
    expect(items.length).toBe(3);
  });

  it('should render toggle buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.lc-filter-bar__toggle-btn');
    expect(buttons.length).toBe(3);
  });

  it('should render select dropdown', () => {
    const select = fixture.nativeElement.querySelector('.lc-filter-bar__select');
    expect(select).toBeTruthy();
  });

  it('should render search input', () => {
    const input = fixture.nativeElement.querySelector('.lc-filter-bar__search .search-input__field');
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Search strategies...');
  });

  it('should return correct value for filter key', () => {
    fixture.componentRef.setInput('values', { status: 'active' });
    fixture.detectChanges();
    expect(component.getValue('status')).toBe('active');
    expect(component.getValue('missing')).toBe('');
  });

  it('should emit valuesChange on filter change', () => {
    const spy = jest.spyOn(component.valuesChange, 'emit');
    component.onFilterChange('status', 'active');
    expect(spy).toHaveBeenCalledWith({ status: 'active' });
  });

  it('should preserve other values when changing one filter', () => {
    fixture.componentRef.setInput('values', { status: 'all', category: 'forex' });
    fixture.detectChanges();
    const spy = jest.spyOn(component.valuesChange, 'emit');
    component.onFilterChange('status', 'active');
    expect(spy).toHaveBeenCalledWith({ status: 'active', category: 'forex' });
  });

  it('should check toggle active state correctly', () => {
    fixture.componentRef.setInput('values', { status: 'active' });
    fixture.detectChanges();
    expect(component.isToggleActive('status', 'active')).toBe(true);
    expect(component.isToggleActive('status', 'all')).toBe(false);
  });

  it('should apply active class to active toggle', () => {
    fixture.componentRef.setInput('values', { status: 'active' });
    fixture.detectChanges();
    const classes = component.getToggleClasses('status', { value: 'active', label: 'Active' });
    expect(classes).toContain('lc-filter-bar__toggle-btn--active');
  });
});
