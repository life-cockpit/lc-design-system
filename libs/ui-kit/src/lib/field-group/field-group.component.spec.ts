import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldGroupComponent } from './field-group.component';
import { By } from '@angular/platform-browser';

describe('FieldGroupComponent', () => {
  let component: FieldGroupComponent;
  let fixture: ComponentFixture<FieldGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldGroupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('label', 'Test Label');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Basic rendering', () => {
    it('should display the label', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.detectChanges();

      const labelElement = fixture.debugElement.query(By.css('.lc-field-group__label'));
      expect(labelElement.nativeElement.textContent).toBe('Email');
    });

    it('should display the value when provided', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.componentRef.setInput('value', 'test@example.com');
      fixture.detectChanges();

      const valueElement = fixture.debugElement.query(By.css('.lc-field-group__value'));
      expect(valueElement.nativeElement.textContent).toContain('test@example.com');
    });
  });

  describe('Icon support', () => {
    it('should not show icon by default', () => {
      fixture.componentRef.setInput('label', 'Test');
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('lc-icon'));
      expect(iconElement).toBeFalsy();
    });

    it('should show icon when provided', () => {
      fixture.componentRef.setInput('label', 'Language');
      fixture.componentRef.setInput('icon', 'globe-alt');
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('lc-icon'));
      expect(iconElement).toBeTruthy();
    });

    it('should add with-icon class when icon is provided', () => {
      fixture.componentRef.setInput('label', 'Test');
      fixture.componentRef.setInput('icon', 'user');
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('lc-field-group--with-icon')).toBe(true);
    });
  });

  describe('Compact mode', () => {
    it('should not have compact class by default', () => {
      fixture.componentRef.setInput('label', 'Test');
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('lc-field-group--compact')).toBe(false);
    });

    it('should add compact class when enabled', () => {
      fixture.componentRef.setInput('label', 'Test');
      fixture.componentRef.setInput('compact', true);
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('lc-field-group--compact')).toBe(true);
    });
  });
});
