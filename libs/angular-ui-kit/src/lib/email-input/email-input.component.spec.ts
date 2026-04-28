import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailInputComponent } from './email-input.component';

describe('EmailInputComponent', () => {
  let component: EmailInputComponent;
  let fixture: ComponentFixture<EmailInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.com',
        'user+tag@example.co.uk',
        'user_name@example-domain.com',
        'a@b.co',
      ];

      validEmails.forEach((email) => {
        component.writeValue(email);
        fixture.detectChanges();
        expect(component['isValid']()).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
      ];

      invalidEmails.forEach((email) => {
        component.writeValue(email);
        component.validate(); // Trigger validation
        fixture.detectChanges();
        expect(component['isValid']()).toBe(false);
      });
    });

    it('should show required error when empty and required', () => {
      fixture.componentRef.setInput('required', true);
      component.writeValue('');
      component.validate();
      fixture.detectChanges();

      expect(component['validationError']()).toBe('Email address is required');
    });

    it('should show format error for invalid email', () => {
      component.writeValue('invalid-email');
      component.validate();
      fixture.detectChanges();

      expect(component['validationError']()).toBe('Please enter a valid email address');
    });

    it('should not show error before touched (by default)', () => {
      fixture.componentRef.setInput('validateOnInput', false);
      component.writeValue('invalid-email');
      fixture.detectChanges();

      expect(component['validationError']()).toBeUndefined();
    });

    it('should show error immediately when validateOnInput is true', () => {
      fixture.componentRef.setInput('validateOnInput', true);
      component.writeValue('invalid-email');
      fixture.detectChanges();

      expect(component['validationError']()).toBe('Please enter a valid email address');
    });
  });

  describe('ControlValueAccessor', () => {
    it('should write value correctly', () => {
      component.writeValue('test@example.com');
      expect(component.value()).toBe('test@example.com');
    });

    it('should call onChange when value changes', () => {
      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      component['onValueChange']('test@example.com');
      expect(onChangeSpy).toHaveBeenCalledWith('test@example.com');
    });

    it('should call onTouched when blurred', () => {
      const onTouchedSpy = jest.fn();
      component.registerOnTouched(onTouchedSpy);

      component['onBlur']();
      expect(onTouchedSpy).toHaveBeenCalled();
    });

    it('should set disabled state', () => {
      component.setDisabledState(true);
      expect(component['isDisabled']).toBe(true);

      component.setDisabledState(false);
      expect(component['isDisabled']).toBe(false);
    });
  });

  describe('Events', () => {
    it('should emit valueChange event', () => {
      const spy = jest.fn();
      component.valueChange.subscribe(spy);

      component['onValueChange']('test@example.com');
      expect(spy).toHaveBeenCalledWith('test@example.com');
    });

    it('should emit validationChange event when validation state changes', (done) => {
      const spy = jest.fn();
      component.validationChange.subscribe(spy);

      component.writeValue('invalid-email');
      component.validate();

      // Wait for effect to run
      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith({
          valid: false,
          error: 'Please enter a valid email address',
        });
        done();
      }, 0);
    });

    it('should emit focused event', () => {
      const spy = jest.fn();
      component.focused.subscribe(spy);

      component['onFocus']();
      expect(spy).toHaveBeenCalled();
    });

    it('should emit blurred event', () => {
      const spy = jest.fn();
      component.blurred.subscribe(spy);

      component['onBlur']();
      expect(spy).toHaveBeenCalled();
    });

    it('should emit enterPressed event', () => {
      const spy = jest.fn();
      component.enterPressed.subscribe(spy);

      component['onEnterPressed']();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Public Methods', () => {
    it('should validate and return validation result', () => {
      component.writeValue('invalid-email');
      const result = component.validate();
      expect(result).toBe(false);

      component.writeValue('valid@example.com');
      const result2 = component.validate();
      expect(result2).toBe(true);
    });

    it('should reset validation state', () => {
      component.writeValue('invalid-email');
      component.validate();
      expect(component['validationError']()).toBeDefined();

      component.resetValidation();
      expect(component['validationError']()).toBeUndefined();
    });
  });
});
